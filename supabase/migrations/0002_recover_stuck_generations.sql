-- ============================================================================
-- One-time recovery for generations stranded by the OLD race bug
-- (status stuck on 'processing' while result_urls already holds photos).
--
-- result_urls is text[], so we use array_length (not jsonb_array_length).
-- Run AFTER 0001, in the Supabase SQL editor.
-- ============================================================================

update public.generations
   set status = 'completed'
 where status = 'processing'
   and result_urls is not null
   and coalesce(array_length(result_urls, 1), 0) > 0;
