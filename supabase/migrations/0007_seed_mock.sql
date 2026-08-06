-- Starter OIR + SRT questions for the free mock-test page.
insert into public.mock_questions (type, question, options, answer, explanation, difficulty, sort_order, published) values
('OIR', 'Complete the series: 2, 6, 12, 20, ?', '["28","30","32","36"]'::jsonb, 1, 'Differences are 4, 6, 8, 10 → next is 20 + 10 = 30.', 'easy', 1, true),
('OIR', 'Find the odd one out.', '["Rose","Lotus","Marigold","Mango"]'::jsonb, 3, 'Mango is a fruit; the rest are flowers.', 'easy', 2, true),
('OIR', 'If FRIEND is coded as GSJFOE, how is MOTHER coded?', '["NPUIFS","NPUIGS","NQUIFS","NPTIFS"]'::jsonb, 0, 'Each letter shifts +1: M→N, O→P, T→U, H→I, E→F, R→S.', 'medium', 3, true),
('OIR', 'A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?', '["Uncle","Father","Brother","Grandfather"]'::jsonb, 0, 'A is C''s brother, and C is D''s father → A is D''s uncle.', 'medium', 4, true),
('OIR', 'Which number is a perfect square?', '["144","150","160","170"]'::jsonb, 0, '144 = 12². The others are not perfect squares.', 'easy', 5, true),
('OIR', 'Pointing to a photo, Rahul said, "She is the daughter of my grandfather''s only son." Who is she to Rahul?', '["Sister","Aunt","Mother","Cousin"]'::jsonb, 0, 'Grandfather''s only son is Rahul''s father; his daughter is Rahul''s sister.', 'medium', 6, true),
('SRT', 'He was going to an important interview when his bike broke down midway. He…', '[]'::jsonb, null, null, 'medium', 7, true),
('SRT', 'While swimming in a river, she suddenly felt a strong current pulling her. She…', '[]'::jsonb, null, null, 'medium', 8, true),
('SRT', 'His team was losing the match and morale was low. As captain, he…', '[]'::jsonb, null, null, 'medium', 9, true),
('SRT', 'He found a wallet full of cash on a deserted road. He…', '[]'::jsonb, null, null, 'medium', 10, true),
('SRT', 'During a trek, a fellow climber twisted his ankle far from base camp. She…', '[]'::jsonb, null, null, 'medium', 11, true)
on conflict do nothing;
