-- ============================================================================
-- SSBWINGS CMS — remove scheduled publishing
--   The cron-driven scheduled-publish feature was removed; drop its now-unused
--   table. (Manual Publish / Save draft / Rollback are unaffected.)
-- ============================================================================
drop table if exists public.scheduled_content;
