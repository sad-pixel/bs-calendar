INSERT INTO "level" ("id", "name") VALUES
('1', 'Common'),
('2', 'Foundation'),
('3', 'Diploma'),
('4', 'Degree');

-- Foundation
INSERT INTO courses (id, name, level_id, calendar_url) VALUES
('BSMA1001', 'Mathematics for Data Science I', 2, 'https://calendar.google.com/calendar/u/5?cid=Y19lMjJnNTM4ZmpmOGxiZWtmbGt2MGNnNzVhZ0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSMA1002', 'Statistics for Data Science I', 2, 'https://calendar.google.com/calendar/u/5?cid=Y19wODRtMThyMXBhajhjY2psaGR2dGtqOXNia0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS1001', 'Computational Thinking', 2, 'https://calendar.google.com/calendar/u/5?cid=Y180dW9oY2RscmZxZDAxMGFtYW9tbTAzbHVzb0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSHS1001', 'English I', 2, 'https://calendar.google.com/calendar/u/5?cid=Y19ydml1dTd2NTVtdTc5bXEwaW0xc21wdGczb0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSMA1003', 'Mathematics for Data Science II', 2, 'https://calendar.google.com/calendar/u/5?cid=Y19oZmRqa2tqZjFlNGxqNzJqYzI2bXYwaTM1NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSMA1004', 'Statistics for Data Science II', 2, 'https://calendar.google.com/calendar/u/5?cid=Y180Y2wxN3AxZXRuYTNnYmJlaXZvdjBwNW1rb0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS1002', 'Programming in Python', 2, 'https://calendar.google.com/calendar/u/5?cid=Y19tbHUzZnY2ODduaGRzdGo2OGtwa29jcG9sY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSHS1002', 'English II', 2, 'https://calendar.google.com/calendar/u/5?cid=Y18zbTNtbjFxdmZzMnBtZjdkcDVjc2s2c2ppb0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t');

-- Diploma Programming
INSERT INTO courses (id, name, level_id, calendar_url) VALUES
('BSCS2001', 'Database Management Systems', 3, 'https://calendar.google.com/calendar/u/5?cid=Y19jdWM0NzNoa3Vka2xldWVjNnN2bDZzNHMxa0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS2002', 'Programming, Data Structures and Algorithms using Python', 3, 'https://calendar.google.com/calendar/u/5?cid=Y19sODdobDBhZWIwOHY3NzY5bjJiZmI0cHVvb0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS2003', 'Modern Application Development I', 3, 'https://calendar.google.com/calendar/u/5?cid=Y19obTdiZGxuazh0ZWFvZDBycGQzb2ZraDRkOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS2003P', 'Modern Application Development I - Project', 3, NULL),
('BSCS2005', 'Programming Concepts using Java', 3, 'https://calendar.google.com/calendar/u/2?cid=Y185cmIydmkyczNocTF2cGg5cG5oZGRpZGc4OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS2006', 'Modern Application Development II', 3, 'https://calendar.google.com/calendar/u/2?cid=Y185Ym1wODhxMGJ0aDE3b2tuc2RlbmFucmxqa0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS2006P', 'Modern Application Development II - Project', 3, NULL),
('BSSE2001', 'System Commands', 3, 'https://calendar.google.com/calendar/u/2?cid=Y19uMDJwamZ1YzZ2bnF2a2FtYjM2M2Jsbms5OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t');

-- Diploma Data Science
INSERT INTO courses (id, name, level_id, calendar_url) VALUES
('BSCS2004', 'Machine Learning Foundations', 3, 'https://calendar.google.com/calendar/u/5?cid=Y18zZzRhamQ3cGpiYm90MmVoZmlodjNwZWM1b0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSMS2001', 'Business Data Management', 3, 'https://calendar.google.com/calendar/u/5?cid=Y19xdWY3OXAyYXRva250MXRodm92N2dmcmJhMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS2007', 'Machine Learning Techniques', 3, 'https://calendar.google.com/calendar/u/2?cid=Y19vODg1amdtMTVrbjJzZW01dGlkM2szcjhnNEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS2008', 'Machine Learning Practice', 3, 'https://calendar.google.com/calendar/u/2?cid=Y181MHNqYjI5dXRzdHI1MnBkMGQxdWhzYnBoY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS2008P', 'Machine Learning Practice - Project', 3, NULL),
('BSSE2002', 'Tools in Data Science', 3, 'https://calendar.google.com/calendar/u/2?cid=Y19ib2Y3bnMxbDduNm84azA1dHA4YTlxNWIwZ0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSMS2001P', 'Business Data Management - Project', 3, NULL),
('BSMS2002', 'Business Analytics', 3, 'https://calendar.google.com/calendar/u/2?cid=Y19xODRjZGloYW5samFiYmloNnFnb3V2Nm5yOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSDA2001', 'Introduction to Deep Learning and Generative AI', 3, NULL),
('BSDA2001P', 'Deep Learning and Generative AI - Project', 3, NULL);

-- Degree
INSERT INTO courses (id, name, level_id, calendar_url) VALUES
('BSCS3001', 'Software Engineering', 4, 'https://calendar.google.com/calendar/u/0?cid=Y181NmZ1NjRvaTZqbGgyNzJrajBnYzRibTQ2OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS3002', 'Software Testing', 4, 'https://calendar.google.com/calendar/u/0?cid=Y192ZzQ1Zjl0NHM1Z3VrZ2N0ZmwwZDl0Z2Q2c0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS3003', 'AI: Search Methods for Problem Solving', 4, 'https://calendar.google.com/calendar/u/0?cid=Y19oazA3dXRpc3UwaTVya2k2dHY0YmpnZXBvb0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSCS3004', 'Deep Learning', 4, 'https://calendar.google.com/calendar/u/0?cid=Y19hOWQ5MGc2ZnIzcmprcmhtcDB0NWdhcmVha0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSGN3001', 'Strategies for Professional Growth', 4, 'https://calendar.google.com/calendar/u/0?cid=Y185aGJuOW83a3J1NDdwdDkyb2Mxb2MydTJpZ0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSBT4001', 'Algorithmic Thinking in Bioinformatics', 4, 'https://calendar.google.com/calendar/u/0/r?cid=Y18wNjUwYTAzMjc1YjI3ZDk1NGU0Y2Y4NTM1M2NiMzMxNTZhNmI4MmFmYjc1NzMzMzk1OWM2YjUxZjI0MzNhZWFiQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSBT4002', 'Big Data and Biological Networks', 4, 'https://calendar.google.com/calendar/u/0?cid=Y181NDUwMTliYjkyZGE3MzJhZmI5NjA2YjI3MzU2YmU1NjUwYjE5OTkzY2YwNTk0MjE2OGUwMjY5OWYxMDVjMWE5QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSCS4001', 'Data Visualization Design', 4, 'https://calendar.google.com/calendar/u/0?cid=Y19jYWQyZDdlYzdkMDMzOGZhNTEyNTA2MjRmNTA3OWExY2M0NWY2YjlmMjBjMDU4Y2MyNWU1MjdiMDAzMTczZjk1QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSDA5007', 'Special topics in Machine Learning (Reinforcement Learning)', 4, NULL),
('BSEE4001', 'Speech Technology', 4, 'https://calendar.google.com/calendar/u/0?cid=Y19qZGg3cGcwdXVib250Y3U4czZzZzZrNG43OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSMS4002', 'Design Thinking for Data-Driven App Development', 4, 'https://calendar.google.com/calendar/u/0?cid=Y19mNTBrOWwza3Z2ZmFocDFzajlmYnFtZDNrZ0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t'),
('BSMS4001', 'Industry 4.0', 4, 'https://calendar.google.com/calendar/u/0?cid=Y18zNjFiNzEyODZhMDJiMzMyODg3YmY3ZGZlODNlNzYyMTkwYzhiOThhNGZhYTIwNzg2YmJlY2IyNGNiYmM4MjMwQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSDA6004', 'Sequential Decision Making', 4, NULL),
('BSMS3002', 'Market Research', 4, 'https://calendar.google.com/calendar/u/0?cid=Y181NWNkOGFhODBiYTViZmJkOWM3YmQzYTRiMmE5ZDNiOThhZjcwMWMyNzNkZDA2MzExNDNjNjI1OWRjOTdjNGE2QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSCS4003', 'Privacy & Security in Online Social Media', 4, 'https://calendar.google.com/calendar/u/0?cid=Y185YmZhMzRkM2YyNjM5OTNiYmQ4NjdhZmQ3MGJmODI4NTI3NGJhMTRkNDQ4MDI5M2UzOWU4NzY2ZGY3OWVhODc4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSDA5001', 'Introduction to Big Data', 4, 'https://calendar.google.com/calendar/u/0?cid=Y181YmYwYmQ2M2JhODAyNGQ0OGQ0YWM5NWI0ZWY4MDBkYzhkY2MxYzc2N2JmYTI1MTU5Y2QwODczZTIyYTI0YjYzQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSMS4003', 'Financial Forensics', 4, 'https://calendar.google.com/calendar/u/0?cid=Y19iZDg0OWIxNGQwYzVmNDdkN2I0ODc4YjQxZmMzNTQ0ZjJhMDcxMmRkMDRjMjY4ZTEyZGZmMTI3NGY0NmQwNjBjQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSMA3012', 'Linear Statistical Models', 4, 'https://calendar.google.com/calendar/u/0?cid=Y185YzBhOGFlZDQzNGU3NmMyNjc1ZmQ0NTdjNDIyZDVhMmMxOTQyNDRlMWU1M2YwZjI0Mzk2ZGIxZDdmMDM1Yjc2QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSCS4021', 'Advanced Algorithms', 4, NULL),
('BSMA3014', 'Statistical Computing', 4, NULL),
('BSCS3031', 'Computer Systems Design', 4, 'https://calendar.google.com/calendar/u/0?cid=Y180N2NjMzRhMjIxNzRhYzhiY2FjYjhiZTkwYjY3NjFmMDBlMzVmOWEwMzljZWZmMDU1NWIwMjM1ODRhM2NlZmJjQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSCS3005', 'Programming in C', 4, 'https://calendar.google.com/calendar/u/0?cid=Y18wM2Q5YTM0YWI2ZjY4MGFjZTAxZmM5MDVhOTMxNjNkNDJmYTEyMzM5ODMwZDJmZTcxNDMyZDBlNTI5ODdmMTI4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSMA2001', 'Mathematical Thinking', 4, NULL),
('BSDA5004', 'Large Language Models', 4, NULL),
('BSDA5005', 'Introduction to Natural Language Processing (i-NLP)', 4, NULL),
('BSDA5006', 'Deep Learning for Computer Vision', 4, NULL),
('BSMS3033', 'Managerial Economics', 4, NULL),
('BSMS4023', 'Game Theory and Strategy', 4, NULL),
('BSMS3034', 'Corporate Finance', 4, NULL),
('BSDA5013', 'Deep Learning Practice', 4, NULL),
('BSCS4022', 'Operating Systems', 4, 'https://calendar.google.com/calendar/u/0?cid=Y180MTA3NTIxNzRkNDBkNzAzY2FhZDE4ODM1ZDU4ZjEzMzFhYmFhMGJmZDQ5NDU3NWY1MTcyMDBmMmIxYWRkMjg0QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'),
('BSDA5002', 'Mathematical Foundations of Generative AI', 4, NULL),
('BSDA5003', 'Algorithms for Data Science (ADS)', 4, NULL),
('BSDA5014', 'Machine Learning Operations (MLOps)', 4, NULL),
('BSDA4001', 'Data Science and AI Lab', 4, NULL),
('BSCS4010', 'App Dev Lab', 4, NULL),
('BSCS4024', 'Computer Networks', 4, NULL);
