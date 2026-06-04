-- ============================================================================
-- One-time recovery for generations that got stranded by the OLD race bug
-- (status stuck on 'processing' while result_urls already holds photos).
--
-- These rows pre-date the fix, so no new webhook will ever finalize them.
-- This flips them to 'completed' so they leave the progress screen and show
-- up normally. NOTE: any photos whose URL was lost to the race are not
-- recoverable here (the images may still sit orphaned in storage); affected
-- users see the photos that ARE recorded in result_urls.
--
-- Run AFTER 0001, in the Supabase SQL editor.
-- ============================================================================

update public.generations
   set status = 'completed'
 where status = 'processing'
   and result_urls is not null
   and jsonb_array_length(result_urls) > 0;
