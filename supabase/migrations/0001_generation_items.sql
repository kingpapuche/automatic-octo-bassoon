-- ============================================================================
-- Production-grade generation tracking: per-prediction items + atomic finalize
-- Lost to a race? Not anymore. Each Replicate prediction gets its OWN row,
-- so parallel webhooks never overwrite each other. Completion + credit refunds
-- happen inside one locked transaction, idempotent against Replicate retries.
--
-- Run this in the Supabase SQL editor BEFORE deploying the new app code.
-- ============================================================================

-- 1) Per-prediction table -----------------------------------------------------
create table if not exists public.generation_items (
  id            uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.generations(id) on delete cascade,
  style_id      text not null,
  prediction_id text unique,                       -- Replicate prediction id (idempotency key)
  status        text not null default 'processing',-- processing | completed | failed
  result_urls   jsonb not null default '[]'::jsonb,-- the (up to 4) urls for this style
  error         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_generation_items_generation
  on public.generation_items(generation_id);

-- 2) Expected prediction count on the parent row ------------------------------
alter table public.generations
  add column if not exists total_predictions int;

-- 3) Atomic, idempotent finalize function -------------------------------------
-- Called by the webhook once per prediction. Locks the parent generation row so
-- concurrent webhooks serialize; recomputes the aggregate from the item rows
-- (never a blind append), refunds credits on failure exactly once, and flips
-- the generation to 'completed' only when every prediction is terminal.
create or replace function public.record_generation_item(
  p_generation_id uuid,
  p_user_id       uuid,
  p_style_id      text,
  p_prediction_id text,
  p_status        text,    -- 'completed' | 'failed'
  p_urls          jsonb,   -- urls for completed; '[]' for failed
  p_variations    int      -- variations per style (for refund on failure)
) returns jsonb
language plpgsql
as $$
declare
  v_item_status text;
  v_old_gen_status text;
  v_expected int;
  v_terminal int;
  v_all_urls jsonb;
  v_count int;
  v_is_complete boolean := false;
begin
  -- Serialize all webhooks for this generation.
  select status, total_predictions
    into v_old_gen_status, v_expected
    from public.generations
   where id = p_generation_id
   for update;

  if not found then
    return jsonb_build_object('error', 'generation_not_found');
  end if;

  -- Idempotency: if this prediction was already recorded as terminal, do nothing.
  select status into v_item_status
    from public.generation_items
   where prediction_id = p_prediction_id;

  if v_item_status in ('completed', 'failed') then
    return jsonb_build_object('idempotent', true, 'item_status', v_item_status);
  end if;

  -- Record / update this prediction's own row.
  insert into public.generation_items
    (generation_id, style_id, prediction_id, status, result_urls, updated_at)
  values
    (p_generation_id, p_style_id, p_prediction_id, p_status,
     coalesce(p_urls, '[]'::jsonb), now())
  on conflict (prediction_id) do update
    set status      = excluded.status,
        result_urls = excluded.result_urls,
        updated_at  = now();

  -- Refund credits for a failed prediction (exactly once — guarded by the
  -- idempotency check above).
  if p_status = 'failed' and p_variations > 0 then
    update public.users
       set credits = coalesce(credits, 0) + p_variations
     where id = p_user_id;
  end if;

  -- Recompute the aggregate from the item rows (atomic, never lost).
  select coalesce(jsonb_agg(u), '[]'::jsonb)
    into v_all_urls
    from (
      select jsonb_array_elements(result_urls) u
        from public.generation_items
       where generation_id = p_generation_id
         and status = 'completed'
       order by created_at
    ) s;

  v_count := jsonb_array_length(v_all_urls);

  -- How many predictions are terminal?
  select count(*) into v_terminal
    from public.generation_items
   where generation_id = p_generation_id
     and status in ('completed', 'failed');

  v_is_complete := (v_expected is not null and v_terminal >= v_expected);

  update public.generations
     set result_urls  = v_all_urls,
         credits_used = v_count,
         status       = case when v_is_complete then 'completed' else status end
   where id = p_generation_id;

  -- Ledger entry exactly once, on the transition into 'completed'.
  if v_is_complete and v_old_gen_status is distinct from 'completed' then
    insert into public.credits_transactions (user_id, amount, type, description)
    values (p_user_id, -v_count, 'generation',
            'Generated ' || v_count || ' headshots');
  end if;

  return jsonb_build_object(
    'idempotent', false,
    'completed_images', v_count,
    'terminal', v_terminal,
    'expected', v_expected,
    'generation_status', case when v_is_complete then 'completed' else 'processing' end
  );
end;
$$;
