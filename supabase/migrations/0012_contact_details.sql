-- Retire the +91 95605 10035 line and point WhatsApp at 10036.
--
-- The published `settings` document overrides the code defaults, so changing
-- lib/data.ts alone would leave the old number live. These updates only touch
-- the three affected keys — every other setting the admin has edited (address,
-- socials, email…) is preserved by the jsonb || merge.
--
-- Also seeds `mapUrl` (every address on the site links to it) and normalises
-- `brochure`, both of which are new settings fields.

update public.site_content
set
  draft = draft || jsonb_build_object(
    'phone1',   '+91 95605 10036',
    'phone2',   '',
    'whatsapp', 'https://wa.me/919560510036?text=Jai%20Hind!%20I%20want%20to%20know%20more%20about%20SSBWINGS%20courses.'
  ),
  published = published || jsonb_build_object(
    'phone1',   '+91 95605 10036',
    'phone2',   '',
    'whatsapp', 'https://wa.me/919560510036?text=Jai%20Hind!%20I%20want%20to%20know%20more%20about%20SSBWINGS%20courses.'
  )
where key = 'settings';

-- Seed the two new keys only when they are absent, so a later admin edit is
-- never overwritten by re-running this migration.
update public.site_content
set
  draft = jsonb_build_object(
    'mapUrl',   'https://maps.google.com/maps?q=SSBWINGS%2C%20C-56%2F43%2C%20Sector%2062%2C%20Noida&ll=28.6150754%2C77.3672718&z=16',
    'brochure', '/SSB-Wings-Brochure-2026.pdf'
  ) || draft,
  published = jsonb_build_object(
    'mapUrl',   'https://maps.google.com/maps?q=SSBWINGS%2C%20C-56%2F43%2C%20Sector%2062%2C%20Noida&ll=28.6150754%2C77.3672718&z=16',
    'brochure', '/SSB-Wings-Brochure-2026.pdf'
  ) || published
where key = 'settings';
