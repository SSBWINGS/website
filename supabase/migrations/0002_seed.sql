-- ============================================================================
-- SSBWINGS CMS — seed data (run AFTER 0001_cms_init.sql)
-- Paste into Supabase → SQL Editor → Run. Safe to re-run (idempotent).
-- ============================================================================

-- Site content documents (draft = published at seed time)
insert into public.site_content (key, label, draft, published) values
  ('settings', 'Site Settings (contact & socials)', '{"name":"SSBWINGS","tagline":"We give shape to your Dreams","phone1":"+91 95605 10036","phone2":"","email":"marketing@ssbwings.com","address":"C-56/43, Institutional Area, Phase 2, Sector 62, Noida, Delhi NCR — 201309","instagram":"https://www.instagram.com/ssbwings","youtube":"https://www.youtube.com/@ssbwings","telegram":"https://t.me/ssbwings"}'::jsonb, '{"name":"SSBWINGS","tagline":"We give shape to your Dreams","phone1":"+91 95605 10036","phone2":"","email":"marketing@ssbwings.com","address":"C-56/43, Institutional Area, Phase 2, Sector 62, Noida, Delhi NCR — 201309","instagram":"https://www.instagram.com/ssbwings","youtube":"https://www.youtube.com/@ssbwings","telegram":"https://t.me/ssbwings"}'::jsonb),
  ('hero', 'Home — Hero section', '{"badge":"Noida Sector 62 · Mentored by Ex-SSB Officers","headingLine1":"The Uniform Doesn''t","headingLine2":"Choose Everyone.","paragraph":"Five days at the Services Selection Board decide who wears the stars. At SSBWINGS, ex-SSB assessors rebuild you for every one of them — Screening, Psychology, GTO, Interview and Conference — until the Board sees what we see: an officer.","rating":"Rated 5.0 on Google by aspirants across India"}'::jsonb, '{"badge":"Noida Sector 62 · Mentored by Ex-SSB Officers","headingLine1":"The Uniform Doesn''t","headingLine2":"Choose Everyone.","paragraph":"Five days at the Services Selection Board decide who wears the stars. At SSBWINGS, ex-SSB assessors rebuild you for every one of them — Screening, Psychology, GTO, Interview and Conference — until the Board sees what we see: an officer.","rating":"Rated 5.0 on Google by aspirants across India"}'::jsonb)
on conflict (key) do update set label = excluded.label, published = excluded.published, draft = excluded.draft;

-- Recommended candidates (Wall of Honour). image_path points to the bundled images.
insert into public.recommended_candidates (name, exam, image_path, sort_order, published) values
  ('Tanishq', '10+2 Navy B.Tech', 'students/tanishq.png', 0, true),
  ('Ayush', 'CDS OTA', 'students/ayush.png', 1, true),
  ('Mitesh', 'NCC (123) Special', 'students/mitesh.jpg', 2, true),
  ('Taranjeet', 'NCC (123) Special', 'students/taranjeet.jpg', 3, true),
  ('Tejas', 'CDS OTA', 'students/tejas.jpg', 4, true),
  ('Yash', 'Navy (Pilot) SSC', 'students/yash.jpg', 5, true),
  ('Tarun', 'Navy GS(X)', 'students/tarun.jpg', 6, true),
  ('Sep Ravi', 'ACC 132', 'students/sep-ravi.jpg', 7, true),
  ('Chetan', 'CDS IMA', 'students/chetan.jpg', 8, true),
  ('Rahul', 'CDS IMA', 'students/rahul.jpg', 9, true),
  ('Rewa', 'NCC Special (123)', 'students/rewa.jpg', 10, true),
  ('Sayjal', 'CDS OTA', 'students/sayjal.jpg', 11, true),
  ('Tanya', 'CDS OTA (W)', 'students/tanya.jpg', 12, true),
  ('Prikshit', 'CDS OTA', 'students/prikshit.jpg', 13, true),
  ('Prashanth', 'SSC Tech 66', 'students/prashanth.jpg', 14, true),
  ('Nishant', 'AFCAT', 'students/nishant.jpg', 15, true),
  ('Mehboob', 'AFCAT', 'students/mehboob.jpg', 16, true),
  ('Dhirendra', 'SCO 58', 'students/dhirendra.jpg', 17, true),
  ('Harshvardhan', 'AFCAT', 'students/harshvardhan.jpg', 18, true),
  ('Deepak', 'CDS OTA', 'students/deepak.jpg', 19, true),
  ('Ravi', 'ACC 132', 'students/ravi.jpg', 20, true),
  ('Chaitanya', 'TGC 142', 'students/chaitanya.jpg', 21, true),
  ('Mohit', 'CDS OTA', 'students/mohit.jpg', 22, true),
  ('Priyanshu', 'Navy SSC (Logistics)', 'students/priyanshu.jpg', 23, true),
  ('Khushi', '10+2 Navy B.Tech', 'students/khushi.jpg', 24, true),
  ('Sarvesh', 'AFCAT', 'students/sarvesh.jpg', 25, true),
  ('Akanksha', 'Navy SSC (ATC)', 'students/akanksha.jpg', 26, true),
  ('Harsh', 'CDS IMA', 'students/harsh.jpg', 27, true),
  ('Daksh', '10+2 Navy B.Tech', 'students/daksh.jpg', 28, true),
  ('Preksha', 'Navy SSC (education)', 'students/preksha.jpg', 29, true),
  ('Abhisht', 'NCC-59', 'students/abhisht.jpg', 30, true),
  ('Sumit', 'CDS OTA', 'students/sumit.png', 31, true),
  ('Ved Prakash', 'CDS OTA', 'students/ved-prakash.png', 32, true),
  ('Yogesh', 'TGC', 'students/yogesh.png', 33, true),
  ('Abhinav', 'CDS OTA', 'students/abhinav.png', 34, true),
  ('Aditya', 'TES', 'students/aditya.png', 35, true);

-- Testimonials
insert into public.testimonials (name, rank, body, image_path, sort_order, published) values
  ('NC. KHUSHVANT SHARMA', 'INA (10+2 Navy Btech)', 'In October 2022, I, Naval Cadet Khushvant Sharma from Bulandshahr, enrolled in the SACA program at SSBWINGS. Following my classes, I received valuable feedback from Vishal Sir and Rajeev Sir on areas such as communication skills, personality development, and manner of expression. Over the next 6-7 months, I remained in close contact with my mentors and participated in numerous practice sessions. Gradually, I began to notice positive changes in my everyday life. Despite facing three setbacks, I persevered, and ultimately, I received a recommendation from the 12 SSB Bangalore for the 10+2 Indian Navy B.Tech entry.', 'testimonials/nc-khushvant-sharma.jpg', 0, true),
  ('GC. ASHOK SUTHAR', 'OTA GAYA (SSC Tech)', 'Jai Hind! I''m Ashok Suthar. After experiencing two setbacks in my SSB attempts, I decided to join SSBWINGS for an online workshop in November 2022. Following that, I achieved AIR-1 and AIR-8 consecutively. However, despite being on the brink of success, I was medically unfit. Determined to overcome this hurdle, I sought guidance from my mentor Vishal Sir and made a strong comeback in my next attempt. Finally, in January 2024, I received my third recommendation from 32 SSB Jalandhar, securing AIR-1. I''m thrilled to announce that I''ll be joining OTA Gaya for the April 2024 batch.', 'testimonials/gc-ashok-suthar.jpg', 1, true),
  ('GC. MAAN SINGH', 'IMA (ACC)', 'Jai Hind! I''m Man Singh, and I served as a Sipahi in the Army Medical Corps. During a temporary duty assignment at Meerut Military Hospital, I sought guidance from SSBWINGS. Whenever I had the opportunity, I made it a priority to meet with both of my mentors in Meerut and receive their invaluable guidance. Even after my duty in Meerut ended, I stayed connected with my mentors. There were times when I reached out to them for advice late at night, sometimes as late as midnight or even 1 AM. I''m thankful that my mentors were always available to encourage me and provide guidance at my convenience. I also participated in a couple of practice sessions to enhance my skills. On my third attempt, I received a recommendation from the 14 SSB Allahabad. Currently, I''m undergoing training as an officer at the Army Cadet College. I owe a great deal of gratitude to my mentors at SSBWINGS.', 'testimonials/gc-maan-singh.jpg', 2, true),
  ('GC. CHANDAN SAHANI', 'IMA (CDS IMA)', 'I went from being a Constable to becoming a Gentlemen Cadet, thanks to the help I received. I used to duty in the Uttar Pradesh Police Jail department, and I didn''t have much time to prepare for my SSB. Luckily, a friend told me about SSBWINGS, and I joined their online workshop in February 2022. Even though I was busy with work, I made sure to stay in touch with mentors from SSBWINGS. Sometimes, I traveled from Allahabad to Meerut to meet them and get extra help with my questions. I also did a few practice interviews to get better. My mentors were kind enough to give me additional time during this phase. Before joining SSBWINGS, I didn''t succeed in five attempts. But after I finished the classes, I tried again at the 14 SSB Allahabad, and this time I got recommended for the CDS-IMA entry. Now, I''m an undertraining officer at IMA, and I''ll soon get commissioned. I''m really grateful to the mentors and everyone at SSBWINGS who helped me along the way.', 'testimonials/gc-chandan-sahani.jpg', 3, true);

-- Mentors
insert into public.mentors (name, role, specialty, bio, image_path, sort_order, published) values
  ('Col. Arun', 'Ex-Interviewing Officer', 'Personal Interview & Conference', 'Sat across the table from thousands of aspirants as a serving Interviewing Officer. Now he trains you to face the very questions he once asked.', 'mentors/col-arun.png', 0, true),
  ('Ayush Tomar', 'Psychology Mentor', 'TAT · WAT · SRT · SD', 'Decodes what your pen tells the psychologist. Every dossier you write here comes back with line-by-line written feedback.', 'mentors/ayush-tomar-sir.png', 1, true),
  ('Vishal Kaushik', 'Group Testing Mentor · Director', 'GTO Ground & Outdoor Tasks', 'Runs the campus GTO ground like a real Board — whistle, load, rules and all. His command task variations are famous among alumni.', 'mentors/vishal-kaushik.png', 2, true);

-- ============================================================================
-- Seed complete: 36 candidates, 4 testimonials, 3 mentors, 2 content docs.
-- ============================================================================
