-- ============================================================
-- CAN Kavre — Seed Data Migration
-- Extracted from hardcoded frontend source files
-- Date: 2026-02-23
-- ============================================================

-- ============================================================
-- 1. CATEGORIES (used by press releases, downloads, etc.)
-- ============================================================
INSERT INTO categories (name, name_ne, slug, sort_order) VALUES
    ('Events',       'कार्यक्रमहरू',  'events',       1),
    ('IT Club',      'आईटी क्लब',     'it-club',       2),
    ('Training',     'तालिम',          'training',      3),
    ('Partnership',  'साझेदारी',       'partnership',   4),
    ('Organization', 'संगठन',          'organization',  5),
    ('Legal',        'कानूनी',         'legal',         6),
    ('Forms',        'फारमहरू',        'forms',         7),
    ('Reports',      'प्रतिवेदनहरू',   'reports',       8),
    ('Guidelines',   'निर्देशिकाहरू',  'guidelines',    9);


-- ============================================================
-- 2. HEADLINES (ticker from Index.tsx)
-- ============================================================
INSERT INTO headlines (title, title_ne, date, sort_order) VALUES
    ('Leading CAN for Future Growth',
     'भविष्यको विकासको लागि क्यान अगुवाई',
     '2023-06-29', 1),

    ('Career Opportunities in ICT 2080',
     'आईसीटी २०८० मा क्यारियर अवसरहरू',
     '2023-06-12', 2),

    ('ICT DAY (MAY 2, 2023) - Blood Donation Program',
     'आईसीटी दिवस (मे २, २०२३) - रक्तदान कार्यक्रम',
     '2023-05-02', 3),

    ('CAN Bagmati Province Program Participation',
     'क्यान बागमती प्रदेश कार्यक्रम सहभागिता',
     '2023-04-23', 4),

    ('Calendar Launch & New Year Celebration',
     'क्यालेन्डर विमोचन र नयाँ वर्ष समारोह',
     '2023-01-14', 5);


-- ============================================================
-- 3. HERO SLIDES (carousel from Index.tsx)
-- ============================================================
INSERT INTO hero_slides (image_url, title, title_ne, subtitle, subtitle_ne, sort_order) VALUES
    ('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80',
     '10th Executive Committee',
     '१०औं कार्यसमिति',
     'Leading CAN Kavre into the Digital Future',
     'क्यान काभ्रेलाई डिजिटल भविष्यतर्फ अग्रसर गर्दै',
     1),

    ('https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1920&q=80',
     'ICT Training Programs',
     'आईसीटी तालिम कार्यक्रमहरू',
     'Empowering Youth with Digital Skills',
     'युवालाई डिजिटल सीपले सशक्त बनाउँदै',
     2),

    ('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80',
     'Community Development',
     'सामुदायिक विकास',
     'Bridging the Digital Divide in Kavre',
     'काभ्रेमा डिजिटल खाडल पूर्ति गर्दै',
     3);


-- ============================================================
-- 4. PAST COMMITTEES (from About.tsx)
-- ============================================================
INSERT INTO past_committees (period, period_ne, category, start_year, end_year, sort_order) VALUES
    ('10th Committee (2079-2081)', '१०औं समिति (२०७९-२०८१)', '10th', 2079, 2081, 1),
    ('9th Committee (2077-2079)',  '९औं समिति (२०७७-२०७९)',  '9th',  2077, 2079, 2),
    ('8th Committee (2075-2077)',  '८औं समिति (२०७५-२०७७)',  '8th',  2075, 2077, 3),
    ('7th Committee (2073-2075)',  '७औं समिति (२०७३-२०७५)',  '7th',  2073, 2075, 4);


-- ============================================================
-- 5. COMMITTEE MEMBERS — Current (10th) Committee (from About.tsx)
--    term_id = 1 references the "10th Committee" row above
-- ============================================================
INSERT INTO committee_members (name, name_ne, position, position_ne, contact, sort_order, term_id, is_active) VALUES
    ('Ram Chandra Nyaupane',             'रामचन्द्र न्यौपाने',           'President',            'अध्यक्ष',          '+977-98XXXXXXXX',  1,  1, TRUE),
    ('Shrawan Kumar Acharya',            'श्रवण कुमार आचार्य',           'Senior Vice President','बरिष्ठ उपाध्यक्ष', '+977-98XXXXXXXX',  2,  1, TRUE),
    ('Dipak Sapkota',                    'दिपक सापकोटा',                 'Vice President',       'उपाध्यक्ष',        '+977-98XXXXXXXX',  3,  1, TRUE),
    ('Devaki Acharya',                   'देवकी आचार्य',                 'Secretary',            'सचिव',              '+977-98XXXXXXXX',  4,  1, TRUE),
    ('Kewal Prasad Timalsina',           'केवल प्रसाद तिमल्सिना',        'Treasurer',            'कोषाध्यक्ष',       '+977-98XXXXXXXX',  5,  1, TRUE),
    ('Rukesh Rajbhandari',               'रुकेश राजभण्डारी',             'Joint Secretary',      'सहसचिव',            '+977-98XXXXXXXX',  6,  1, TRUE),
    ('Rishi Ram Gautam',                 'ऋषिराम गौतम',                  'Member',               'सदस्य',             '+977-98XXXXXXXX',  7,  1, TRUE),
    ('Rita Shrestha',                    'रीता श्रेष्ठ',                  'Member',               'सदस्य',             '+977-98XXXXXXXX',  8,  1, TRUE),
    ('Vivek Timalsina',                  'विवेक तिमल्सिना',              'Member',               'सदस्य',             '+977-98XXXXXXXX',  9,  1, TRUE),
    ('Shyam Gopal Shrestha',             'श्याम गोपाल श्रेष्ठ',          'Member',               'सदस्य',             '+977-98XXXXXXXX', 10,  1, TRUE),
    ('Abodh Bhushan Khoju Shrestha',     'अवोध भुषण खोजु श्रेष्ठ',      'Member',               'सदस्य',             '+977-98XXXXXXXX', 11,  1, TRUE),
    ('Ujwal Thapa Magar',                'उज्वल थापा मगर',               'Member',               'सदस्य',             '+977-98XXXXXXXX', 12,  1, TRUE),
    ('Prakash Paudel',                   'प्रकाश पौडेल',                 'Member',               'सदस्य',             '+977-98XXXXXXXX', 13,  1, TRUE),
    ('Umesh Adhikari',                   'उमेश अधिकारी',                 'Member',               'सदस्य',             '+977-98XXXXXXXX', 14,  1, TRUE);


-- ============================================================
-- 6. COMMITTEE MEMBERS — 9th Committee (past)
--    term_id = 2 references "9th Committee"
-- ============================================================
INSERT INTO committee_members (name, name_ne, position, position_ne, contact, sort_order, term_id, is_active) VALUES
    ('Jayram Humagain',   'जयराम हुमागाईं', 'President',                'अध्यक्ष',                '+977-98XXXXXXXX', 1, 2, FALSE),
    ('Nabaraj Bhurtel',   'नवराज भुर्तेल',  'Immediate Past President', 'तत्काल पूर्व अध्यक्ष',   '+977-98XXXXXXXX', 2, 2, FALSE);


-- ============================================================
-- 7. COMMITTEE MEMBERS — 8th Committee (past)
--    term_id = 3 references "8th Committee"
-- ============================================================
INSERT INTO committee_members (name, name_ne, position, position_ne, contact, sort_order, term_id, is_active) VALUES
    ('Nabaraj Bhurtel',      'नवराज भुर्तेल',     'President',     'अध्यक्ष',      '+977-98XXXXXXXX', 1, 3, FALSE),
    ('Kailash Palanchoke',   'कैलाश पलान्चोके',   'Past President','पूर्व अध्यक्ष', '+977-98XXXXXXXX', 2, 3, FALSE);


-- ============================================================
-- 8. COMMITTEE MEMBERS — 7th Committee (past)
--    term_id = 4 references "7th Committee"
-- ============================================================
INSERT INTO committee_members (name, name_ne, position, position_ne, contact, sort_order, term_id, is_active) VALUES
    ('Kailash Palanchoke',   'कैलाश पलान्चोके',   'President',     'अध्यक्ष',       '+977-98XXXXXXXX', 1, 4, FALSE),
    ('Niranjan Manandhar',   'निरञ्जन मानन्धर',    'Past President','पूर्व अध्यक्ष', '+977-98XXXXXXXX', 2, 4, FALSE);


-- ============================================================
-- 9. SUBCOMMITTEES (from About.tsx)
-- ============================================================
INSERT INTO subcommittees (name, name_ne, focus, focus_ne, member_count, type) VALUES
    ('Health IT Subcommittee',
     'स्वास्थ्य आईटी उपसमिति',
     'Digital health initiatives',
     'डिजिटल स्वास्थ्य पहलहरू',
     8, 'health'),

    ('Education IT Subcommittee',
     'शिक्षा आईटी उपसमिति',
     'E-learning & digital education',
     'ई-लर्निङ र डिजिटल शिक्षा',
     10, 'education'),

    ('Agriculture IT Subcommittee',
     'कृषि आईटी उपसमिति',
     'Smart farming technologies',
     'स्मार्ट कृषि प्रविधिहरू',
     6, 'agriculture'),

    ('Women IT Subcommittee',
     'महिला आईटी उपसमिति',
     'Women empowerment through ICT',
     'आईसीटी मार्फत महिला सशक्तिकरण',
     12, 'women'),

    ('E-Village Subcommittee',
     'ई-गाउँ उपसमिति',
     'Smart village & e-governance at local level',
     'स्थानीय तहमा स्मार्ट गाउँ र ई-शासन',
     7, 'evillage'),

    ('Business & ICT Meet Subcommittee',
     'व्यापार र आईसीटी मिट उपसमिति',
     'Connecting ICT entrepreneurs & business networking',
     'आईसीटी उद्यमी जडान र व्यापार नेटवर्किङ',
     9, 'business');


-- ============================================================
-- 10. IT CLUBS (from About.tsx)
-- ============================================================
INSERT INTO it_clubs (name, name_ne, students, established) VALUES
    ('Dhulikhel School IT Club',       'धुलिखेल विद्यालय आईटी क्लब',           45, 2019),
    ('Panauti Secondary IT Club',      'पनौती माध्यमिक आईटी क्लब',             38, 2020),
    ('Banepa HS IT Club',              'बनेपा उमावि आईटी क्लब',               52, 2018),
    ('Kavre Multiple Campus IT Club',  'काभ्रे बहुमुखी क्याम्पस आईटी क्लब',    65, 2017);


-- ============================================================
-- 11. EVENTS (from Events.tsx)
-- ============================================================
INSERT INTO events (title, title_ne, date, time, location, location_ne, description, description_ne, attendees, status, organizer, organizer_ne) VALUES
    ('18th AGM & 10th Convention',
     '१८ औं साधारण सभा तथा १० औं अधिवेशन',
     '2022-12-03', '10:00 AM',
     'Banepa, Kavrepalanchok',
     'बनेपा, काभ्रेपलाञ्चोक',
     'The 18th Annual General Meeting and 10th Convention of CAN Federation Kavre was successfully completed. New executive committee was elected with Ramchandra Neupane as President.',
     'कम्प्युटर एशोसियसन अफ नेपाल (क्यान) महासंघ काभ्रेको १८ औं साधारण सभा तथा १० औं अधिवेशन सम्पन्न। अध्यक्षमा रामचन्द्र न्यौपाने निर्विरोध निर्वाचित।',
     152, 'completed',
     'CAN Federation Kavre', 'क्यान महासंघ काभ्रे'),

    ('ICT Day 2080 - Blood Donation Program',
     'आईसीटी दिवस २०८० - रक्तदान कार्यक्रम',
     '2023-04-29', '9:00 AM',
     'Banepa Chardawato',
     'बनेपा चारदोबाटो',
     'On the occasion of National ICT Day (May 2, 2023), CAN Kavre organized a blood donation program in collaboration with Nepal Red Cross Society Kavrepalanchok Banepa Branch. 34 people donated blood out of 45 attendees.',
     'राष्ट्रिय सूचना तथा सञ्चार प्रविधि दिवसको उपलक्ष्यमा क्यान काभ्रे शाखा र नेपाल रेडक्रस सोसाईटि काभ्रेपलाञ्चोक बनेपा शाखाको सहकार्यमा रक्तदान कार्यक्रम सम्पन्न। ४५ जना उपस्थित मध्ये ३४ जनाले रक्तदान गरे।',
     45, 'completed',
     'CAN Federation Kavre', 'क्यान महासंघ काभ्रे'),

    ('Career Opportunities in ICT 2080',
     'आईसीटीमा क्यारियर अवसरहरू २०८०',
     '2023-06-03', '2:00 PM',
     'Banepa, Kavrepalanchok',
     'बनेपा, काभ्रेपलाञ्चोक',
     'A grand seminar on career opportunities in ICT attended by students, teachers, and IT professionals from across Kavre district. Speakers included CAN Federation President Ranjit Kumar Poddar and resource persons Sarita Neupane and Nilmani Neupane.',
     'काभ्रे जिल्लाभरका विद्यार्थी, शिक्षक र सूचना प्रविधि व्यवसायीहरूको उपस्थितिमा आईसीटीमा क्यारियर अवसरहरू विषयमा भव्य सेमिनार सम्पन्न। क्यान महासंघका अध्यक्ष रणजित कुमार पोद्दार र स्रोत व्यक्ति सरिता न्यौपाने तथा निलमणी न्यौपानेको सहभागिता।',
     150, 'completed',
     'CAN Federation Kavre', 'क्यान महासंघ काभ्रे'),

    ('ICT Business Meet with Entrepreneurs',
     'व्यावसायी सँग आईसीटी बिजनेस मिट',
     '2023-06-29', '10:00 AM',
     'Banepa, Kavrepalanchok',
     'बनेपा, काभ्रेपलाञ्चोक',
     'CAN Kavre organized an ICT Business Meet bringing together 25+ ICT entrepreneurs and business professionals from Banepa and surrounding areas to discuss ICT promotion, rights, and networking opportunities.',
     'क्यान काभ्रेले बनेपा र आसपासका २५ भन्दा बढी आईसीटी उद्यमी र व्यवसायीहरूलाई एकत्रित गरी आईसीटी प्रवर्द्धन, हकहित र नेटवर्किङ अवसरहरूबारे छलफल गरेको बिजनेस मिट कार्यक्रम आयोजना गर्यो।',
     30, 'completed',
     'CAN Federation Kavre', 'क्यान महासंघ काभ्रे');


-- ============================================================
-- 12. GALLERY IMAGES (from Events.tsx)
-- ============================================================
INSERT INTO gallery_images (src, title, title_ne, sort_order) VALUES
    ('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', 'ICT Day 2080',       'आईसीटी दिवस २०८०',   1),
    ('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400', 'Workshop Session',   'कार्यशाला सत्र',      2),
    ('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400', 'Training Program',   'तालिम कार्यक्रम',     3),
    ('https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400', 'Blood Donation',     'रक्तदान',              4),
    ('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400', 'Team Meeting',       'टोली बैठक',            5),
    ('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400', 'Conference',         'सम्मेलन',              6);


-- ============================================================
-- 13. NOTICES (from Notice.tsx)
-- ============================================================
INSERT INTO notices (title, title_ne, content, content_ne, date, priority, type) VALUES
    ('19th Annual General Meeting Notice',
     '१९ औं वार्षिक साधारण सभा सूचना',
     'The 19th Annual General Meeting of CAN Federation Kavre will be held soon. All 152+ members are requested to attend. Venue and date details will be published shortly.',
     'क्यान महासंघ काभ्रे शाखाको १९ औं वार्षिक साधारण सभा चाँडै नै हुनेछ। सबै १५२+ सदस्यहरूलाई उपस्थित हुन अनुरोध छ। स्थान र मिति विवरण चाँडै प्रकाशित हुनेछ।',
     '2023-09-15', 'high', 'announcement'),

    ('Membership Renewal Deadline',
     'सदस्यता नवीकरण म्याद',
     'All CAN Kavre members are requested to renew their membership before the deadline. Contact the CAN Kavre office at Banepa for renewal procedures.',
     'सबै क्यान काभ्रे सदस्यहरूलाई म्याद अघि नै सदस्यता नवीकरण गर्न अनुरोध छ। नवीकरण प्रक्रियाको लागि बनेपास्थित क्यान काभ्रे कार्यालयमा सम्पर्क गर्नुहोस्।',
     '2023-08-20', 'high', 'deadline'),

    ('ICT Day 2080 Blood Donation Program',
     'आईसीटी दिवस २०८० रक्तदान कार्यक्रम',
     'CAN Kavre organized a blood donation program at Banepa Chardawato on the occasion of ICT Day 2080 in collaboration with Nepal Red Cross Society. 34 people donated blood.',
     'क्यान काभ्रेले आईसीटी दिवस २०८० को उपलक्ष्यमा नेपाल रेडक्रस सोसाईटिको सहकार्यमा बनेपा चारदोबाटोमा रक्तदान कार्यक्रम आयोजना गर्यो। ३४ जनाले रक्तदान गरे।',
     '2023-04-29', 'medium', 'announcement'),

    ('Call for IT Club Coordinator Applications',
     'आईटी क्लब संयोजक आवेदन आह्वान',
     'Applications are invited for the position of District IT Club Coordinator. Interested candidates from Kavrepalanchok may submit their applications to the CAN Kavre office at Banepa.',
     'जिल्ला आईटी क्लब संयोजक पदको लागि आवेदन आह्वान गरिएको छ। काभ्रेपलाञ्चोकका इच्छुक उम्मेदवारहरूले बनेपास्थित क्यान काभ्रे कार्यालयमा आवेदन पेश गर्न सक्नुहुन्छ।',
     '2023-07-05', 'medium', 'deadline'),

    ('New Year 2080 Calendar Launch',
     'नव वर्ष २०८० क्यालेन्डर लोकार्पण',
     'CAN Kavre successfully completed the New Year 2080 greetings exchange and calendar launch program at Banepa. Chief guest was District Coordination Committee Chief Deepak Kumar Gautam.',
     'क्यान काभ्रेले बनेपामा नव वर्ष २०८० को शुभकामना आदानप्रदान तथा क्यालेन्डर लोकार्पण कार्यक्रम सम्पन्न गर्यो। प्रमुख अतिथि काभ्रे जिल्ला समन्वय समितिका प्रमुख दीपक कुमार गौतम।',
     '2023-04-14', 'low', 'info');


-- ============================================================
-- 14. PRESS RELEASES (from PressReleases.tsx)
-- ============================================================
INSERT INTO press_releases (title, title_ne, excerpt, excerpt_ne, date, link) VALUES
    ('Leading CAN for Future Growth',
     'भविष्यको विकासको लागि क्यान अगुवाई',
     'CAN Federation Kavre outlines its vision for future growth and ICT development in Kavrepalanchok district under the leadership of the 10th Executive Committee.',
     'क्यान महासंघ काभ्रेले १० औं कार्यसमितिको नेतृत्वमा काभ्रेपलाञ्चोक जिल्लामा भविष्यको विकास र आईसीटी विकासको दृष्टिकोण प्रस्तुत गर्दछ।',
     '2023-06-08',
     'https://www.cankavre.org.np/?p=681'),

    ('Career Opportunities in ICT 2080 Seminar Completed',
     'आईसीटीमा क्यारियर अवसरहरू २०८० सेमिनार सम्पन्न',
     'A grand seminar on Career Opportunities in ICT 2080 was conducted with participation of CAN Federation President Ranjit Kumar Poddar, resource persons, and students from across Kavre district.',
     'क्यान महासंघका अध्यक्ष रणजित कुमार पोद्दार, स्रोत व्यक्तिहरू र काभ्रे जिल्लाभरका विद्यार्थीहरूको सहभागितामा आईसीटीमा क्यारियर अवसरहरू २०८० विषयमा भव्य सेमिनार सम्पन्न।',
     '2023-06-08',
     'https://www.cankavre.org.np/?p=676'),

    ('ICT Day Blood Donation Program Completed',
     'आईसीटी दिवस रक्तदान कार्यक्रम सम्पन्न',
     'CAN Kavre organized a blood donation program at Banepa Chardawato on the occasion of National ICT Day in collaboration with Nepal Red Cross Society. 34 people donated blood.',
     'क्यान काभ्रेले राष्ट्रिय सूचना प्रविधि दिवसको उपलक्ष्यमा नेपाल रेडक्रस सोसाईटिको सहकार्यमा बनेपा चारदोबाटोमा रक्तदान कार्यक्रम आयोजना गर्यो। ३४ जनाले रक्तदान गरे।',
     '2023-06-08',
     'https://www.cankavre.org.np/?p=668'),

    ('CAN Kavre Participates in Bagmati Province Program',
     'क्यान काभ्रे बागमती प्रदेश कार्यक्रममा सहभागी',
     'CAN Federation Kavre representatives participated in a program organized by CAN Federation Bagmati Province to discuss ICT development at the provincial level.',
     'क्यान महासंघ काभ्रेका प्रतिनिधिहरू प्रदेश स्तरमा आईसीटी विकासबारे छलफल गर्न क्यान महासंघ बागमती प्रदेशद्वारा आयोजित कार्यक्रममा सहभागी भए।',
     '2023-06-08',
     'https://www.cankavre.org.np/?p=664'),

    ('New Year 2080 Greetings Exchange & Calendar Launch',
     'नव वर्ष २०८० शुभकामना आदानप्रदान तथा क्यालेन्डर लोकार्पण',
     'CAN Kavre completed the New Year 2080 greetings exchange and calendar launch program at Banepa with District Coordination Committee Chief Deepak Kumar Gautam as chief guest.',
     'क्यान काभ्रेले बनेपामा जिल्ला समन्वय समितिका प्रमुख दीपक कुमार गौतमको प्रमुख आतिथ्यतामा नव वर्ष २०८० शुभकामना आदानप्रदान तथा क्यालेन्डर लोकार्पण कार्यक्रम सम्पन्न गर्यो।',
     '2023-06-07',
     'https://www.cankavre.org.np/?p=659'),

    ('ICT Business Meet with Entrepreneurs Completed',
     'व्यावसायी सँग आईसीटी बिजनेस मिट सम्पन्न',
     'CAN Kavre organized an ICT Business Meet bringing together 25+ ICT entrepreneurs and business professionals from Banepa to discuss ICT promotion and business networking.',
     'क्यान काभ्रेले बनेपाका २५ भन्दा बढी आईसीटी उद्यमी र व्यवसायीहरूलाई एकत्रित गरी आईसीटी प्रवर्द्धन र व्यापार नेटवर्किङबारे छलफलको लागि बिजनेस मिट कार्यक्रम आयोजना गर्यो।',
     '2023-06-07',
     'https://www.cankavre.org.np/?p=565');

-- Link press releases to categories (via category_id FK)
-- Assumes category IDs from the insert above: 1=Events, 4=Partnership, 5=Organization
UPDATE press_releases SET category_id = 5 WHERE title = 'Leading CAN for Future Growth';
UPDATE press_releases SET category_id = 1 WHERE title = 'Career Opportunities in ICT 2080 Seminar Completed';
UPDATE press_releases SET category_id = 1 WHERE title = 'ICT Day Blood Donation Program Completed';
UPDATE press_releases SET category_id = 4 WHERE title = 'CAN Kavre Participates in Bagmati Province Program';
UPDATE press_releases SET category_id = 5 WHERE title = 'New Year 2080 Greetings Exchange & Calendar Launch';
UPDATE press_releases SET category_id = 1 WHERE title = 'ICT Business Meet with Entrepreneurs Completed';


-- ============================================================
-- 15. PROGRAMS — Featured / Static (from Programs.tsx)
-- ============================================================
INSERT INTO programs (title, title_ne, description, description_ne, icon, color, features, features_ne, image_url, category, sort_order, is_featured) VALUES
    ('Digital Literacy Campaign',
     'डिजिटल साक्षरता अभियान',
     'Empowering citizens of all ages with basic computer and internet skills. Our comprehensive training covers essential digital skills needed in today''s world.',
     'सबै उमेरका नागरिकहरूलाई आधारभूत कम्प्युटर र इन्टरनेट सीपहरूले सशक्त बनाउँदै। हाम्रो व्यापक तालिमले आजको संसारमा आवश्यक आवश्यक डिजिटल सीपहरू समेट्छ।',
     'laptop', 'primary',
     '["Basic Computer Training", "Internet Safety", "Email & Social Media", "Online Banking Basics"]'::JSONB,
     '["आधारभूत कम्प्युटर तालिम", "इन्टरनेट सुरक्षा", "इमेल र सोशल मिडिया", "अनलाइन बैंकिङ आधारभूत"]'::JSONB,
     'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
     'digital-literacy', 1, TRUE),

    ('IT Club Development',
     'आईटी क्लब विकास',
     'Establishing and supporting IT clubs in schools across Kavrepalanchok to nurture the next generation of tech leaders.',
     'अर्को पुस्ताका टेक नेताहरूलाई पोषण गर्न काभ्रेपलाञ्चोकभरका विद्यालयहरूमा आईटी क्लबहरू स्थापना र समर्थन गर्दै।',
     'graduationCap', 'secondary',
     '["School IT Club Setup", "Student Mentorship", "Coding Workshops", "Inter-school Competitions"]'::JSONB,
     '["विद्यालय आईटी क्लब स्थापना", "विद्यार्थी मेन्टरशिप", "कोडिङ कार्यशालाहरू", "अन्तर-विद्यालय प्रतियोगिताहरू"]'::JSONB,
     'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
     'it-club', 2, TRUE),

    ('ICT in Agriculture',
     'कृषिमा आईसीटी',
     'Introducing modern farming techniques through technology. Helping farmers adopt digital tools for better productivity and market access.',
     'प्रविधि मार्फत आधुनिक कृषि प्रविधिहरू परिचय गराउँदै। राम्रो उत्पादकत्व र बजार पहुँचको लागि किसानहरूलाई डिजिटल उपकरणहरू अपनाउन मद्दत गर्दै।',
     'globe', 'accent',
     '["Digital Farming Tools", "Market Connectivity", "Weather Information", "E-Commerce Training"]'::JSONB,
     '["डिजिटल कृषि उपकरणहरू", "बजार जडान", "मौसम जानकारी", "ई-कमर्स तालिम"]'::JSONB,
     'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&q=80',
     'agriculture', 3, TRUE),

    ('Women in Tech',
     'प्रविधिमा महिला',
     'Special programs designed to increase female participation in the ICT sector, providing skills training and career guidance.',
     'आईसीटी क्षेत्रमा महिला सहभागिता बढाउन, सीप तालिम र क्यारियर मार्गदर्शन प्रदान गर्न डिजाइन गरिएका विशेष कार्यक्रमहरू।',
     'users', 'primary',
     '["Skills Training", "Career Guidance", "Networking Events", "Entrepreneurship Support"]'::JSONB,
     '["सीप तालिम", "क्यारियर मार्गदर्शन", "नेटवर्किङ कार्यक्रमहरू", "उद्यमशीलता समर्थन"]'::JSONB,
     'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80',
     'women-in-tech', 4, TRUE),

    ('E-Governance Support',
     'ई-गभर्नेन्स समर्थन',
     'Assisting local government bodies in implementing digital solutions for better public service delivery.',
     'राम्रो सार्वजनिक सेवा प्रदानको लागि डिजिटल समाधानहरू कार्यान्वयन गर्न स्थानीय सरकारी निकायहरूलाई सहयोग गर्दै।',
     'building2', 'secondary',
     '["Digital Documentation", "Online Services", "Staff Training", "Infrastructure Support"]'::JSONB,
     '["डिजिटल कागजात", "अनलाइन सेवाहरू", "कर्मचारी तालिम", "पूर्वाधार समर्थन"]'::JSONB,
     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
     'e-governance', 5, TRUE),

    ('Health & ICT',
     'स्वास्थ्य र आईसीटी',
     'Promoting digital health solutions and telemedicine awareness in remote areas of the district.',
     'जिल्लाको टाढाका क्षेत्रहरूमा डिजिटल स्वास्थ्य समाधानहरू र टेलिमेडिसिन जागरूकता प्रवर्द्धन गर्दै।',
     'heart', 'accent',
     '["Telemedicine Awareness", "Health App Training", "Digital Health Records", "Emergency Response Systems"]'::JSONB,
     '["टेलिमेडिसिन जागरूकता", "स्वास्थ्य एप तालिम", "डिजिटल स्वास्थ्य रेकर्डहरू", "आपतकालीन प्रतिक्रिया प्रणालीहरू"]'::JSONB,
     'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80',
     'health-ict', 6, TRUE);


-- ============================================================
-- 16. DOWNLOADS — General Resources (from Downloads.tsx)
-- ============================================================
INSERT INTO downloads (title, title_ne, description, description_ne, file_type, file_size, date, download_url, category_id) VALUES
    ('CAN Kavre Constitution',
     'क्यान काभ्रे विधान',
     'Official constitution document',
     'आधिकारिक विधान कागजात',
     'pdf', '2.4 MB', '2024-01-15', '#',
     (SELECT id FROM categories WHERE slug = 'legal')),

    ('Membership Form',
     'सदस्यता फारम',
     'Application form for new members',
     'नयाँ सदस्यहरूको लागि आवेदन फारम',
     'pdf', '156 KB', '2024-02-01', '#',
     (SELECT id FROM categories WHERE slug = 'forms')),

    ('Annual Report 2080',
     'वार्षिक प्रतिवेदन २०८०',
     'Complete annual report',
     'पूर्ण वार्षिक प्रतिवेदन',
     'pdf', '5.2 MB', '2024-03-15', '#',
     (SELECT id FROM categories WHERE slug = 'reports')),

    ('IT Club Guidelines',
     'आईटी क्लब निर्देशिका',
     'Guidelines for school IT clubs',
     'विद्यालय आईटी क्लबहरूको लागि निर्देशिका',
     'pdf', '890 KB', '2024-02-20', '#',
     (SELECT id FROM categories WHERE slug = 'guidelines'));


-- ============================================================
-- 17. REPORTS (from Downloads.tsx)
-- ============================================================

-- Secretary Reports
INSERT INTO reports (title, title_ne, author, author_ne, date, report_type, file_type, file_size, download_url) VALUES
    ('Secretary Report - Fiscal Year 2080',
     'सचिव प्रतिवेदन - आर्थिक वर्ष २०८०',
     'Secretary Office', 'सचिव कार्यालय',
     '2024-03-01', 'secretary', 'pdf', '1.2 MB', '#'),

    ('Secretary Report - Fiscal Year 2079',
     'सचिव प्रतिवेदन - आर्थिक वर्ष २०७९',
     'Secretary Office', 'सचिव कार्यालय',
     '2023-03-01', 'secretary', 'pdf', '980 KB', '#');

-- Treasurer Reports
INSERT INTO reports (title, title_ne, author, author_ne, date, report_type, file_type, file_size, download_url) VALUES
    ('Financial Statement 2080',
     'वित्तीय विवरण २०८०',
     'Treasurer Office', 'कोषाध्यक्ष कार्यालय',
     '2024-03-15', 'treasurer', 'pdf', '2.1 MB', '#'),

    ('Audit Report 2079',
     'लेखा परीक्षण प्रतिवेदन २०७९',
     'External Auditor', 'बाह्य लेखा परीक्षक',
     '2023-04-01', 'treasurer', 'pdf', '1.5 MB', '#');

-- Coordinator Reports
INSERT INTO reports (title, title_ne, author, author_ne, date, report_type, file_type, file_size, download_url) VALUES
    ('Program Coordinator Report 2080',
     'कार्यक्रम संयोजक प्रतिवेदन २०८०',
     'Program Coordinator', 'कार्यक्रम संयोजक',
     '2024-02-28', 'coordinator', 'pdf', '1.8 MB', '#'),

    ('IT Club Coordinator Report',
     'आईटी क्लब संयोजक प्रतिवेदन',
     'IT Club Coordinator', 'आईटी क्लब संयोजक',
     '2024-01-15', 'coordinator', 'pdf', '750 KB', '#');

-- IT Club Reports
INSERT INTO reports (title, title_ne, author, author_ne, date, report_type, file_type, file_size, download_url) VALUES
    ('Dhulikhel School IT Club Report',
     'धुलिखेल विद्यालय आईटी क्लब प्रतिवेदन',
     'IT Club Coordinator', 'आईटी क्लब संयोजक',
     '2024-02-01', 'itclub', 'pdf', '650 KB', '#'),

    ('Banepa Campus IT Club Report',
     'बनेपा क्याम्पस आईटी क्लब प्रतिवेदन',
     'IT Club Coordinator', 'आईटी क्लब संयोजक',
     '2024-02-15', 'itclub', 'pdf', '820 KB', '#');


-- ============================================================
-- 18. MEMBERSHIP TYPES (from Membership.tsx)
-- ============================================================
INSERT INTO membership_types (type, type_ne, fee, fee_ne, fee_amount, is_recurring, renewal_period, description, description_ne, benefits, benefits_ne, icon, color, sort_order) VALUES
    ('Life Membership',
     'आजीवन सदस्यता',
     'NRS 6,000',
     'रु. ६,०००',
     6000.00, FALSE, NULL,
     'One-time fee for permanent membership with full voting rights and all benefits.',
     'पूर्ण मतदान अधिकार र सबै सुविधाहरूसहित स्थायी सदस्यताको लागि एकपटकको शुल्क।',
     '["Lifetime access to all CAN Kavre programs", "Voting rights in AGM & Convention", "Eligibility for committee positions", "Priority for training & workshops"]'::JSONB,
     '["क्यान काभ्रेका सबै कार्यक्रमहरूमा आजीवन पहुँच", "साधारण सभा र अधिवेशनमा मतदान अधिकार", "समिति पदहरूको लागि योग्यता", "तालिम र कार्यशालाहरूमा प्राथमिकता"]'::JSONB,
     'BadgeCheck', 'primary', 1),

    ('Individual Membership',
     'व्यक्तिगत सदस्यता',
     'NRS 800 / year',
     'रु. ८०० / वर्ष',
     800.00, TRUE, 'yearly',
     'Annual renewable membership for individuals interested in ICT community activities.',
     'आईसीटी समुदायिक गतिविधिहरूमा रुचि राख्ने व्यक्तिहरूको लागि वार्षिक नवीकरणीय सदस्यता।',
     '["Access to CAN Kavre events & programs", "Networking with ICT professionals", "Discounted training fees", "Member newsletter & updates"]'::JSONB,
     '["क्यान काभ्रे कार्यक्रम र गतिविधिहरूमा पहुँच", "आईसीटी पेशेवरहरूसँग नेटवर्किङ", "तालिम शुल्कमा छुट", "सदस्य न्यूजलेटर र अपडेटहरू"]'::JSONB,
     'User', 'secondary', 2),

    ('Institutional Membership',
     'संस्थागत सदस्यता',
     'NRS 5,000 / year',
     'रु. ५,००० / वर्ष',
     5000.00, TRUE, 'yearly',
     'For IT companies, educational institutions, and organizations in Kavrepalanchok.',
     'काभ्रेपलाञ्चोकका आईटी कम्पनी, शैक्षिक संस्था र संगठनहरूको लागि।',
     '["Organizational representation in CAN Kavre", "Participation in ICT Business Meet", "Staff access to training programs", "Logo display on CAN Kavre website"]'::JSONB,
     '["क्यान काभ्रेमा संगठनात्मक प्रतिनिधित्व", "आईसीटी व्यापार भेटमा सहभागिता", "कर्मचारीको तालिम कार्यक्रममा पहुँच", "क्यान काभ्रे वेबसाइटमा लोगो प्रदर्शन"]'::JSONB,
     'Building2', 'accent', 3);


-- ============================================================
-- 19. SETTINGS — Mission, Vision, Objectives & Organization Info
--     (from translations.ts and Index.tsx)
-- ============================================================
INSERT INTO settings (key, value, value_ne, category, description) VALUES
    -- Mission
    ('mission_text',
     'To promote ICT development and digital literacy in Kavrepalanchok district by organizing training programs, workshops, and awareness campaigns. We aim to bridge the digital divide and empower local communities with technological skills for economic and social development.',
     'तालिम कार्यक्रमहरू, कार्यशालाहरू र जागरूकता अभियानहरू आयोजना गरेर काभ्रेपलाञ्चोक जिल्लामा आईसीटी विकास र डिजिटल साक्षरता प्रवर्द्धन गर्ने। हामी डिजिटल खाडललाई पूर्ति गर्न र स्थानीय समुदायहरूलाई आर्थिक र सामाजिक विकासको लागि प्राविधिक सीपहरूले सशक्त बनाउने लक्ष्य राख्छौं।',
     'about', 'Organization mission statement'),

    -- Vision
    ('vision_text',
     'To establish Kavrepalanchok as a model district for ICT development in Nepal, where every citizen has access to digital resources and the skills to utilize them effectively for personal and community growth.',
     'नेपालमा आईसीटी विकासको लागि काभ्रेपलाञ्चोकलाई मोडेल जिल्लाको रूपमा स्थापित गर्ने, जहाँ प्रत्येक नागरिकसँग डिजिटल स्रोतहरूमा पहुँच र व्यक्तिगत र सामुदायिक विकासको लागि तिनीहरूलाई प्रभावकारी रूपमा प्रयोग गर्ने सीप छ।',
     'about', 'Organization vision statement'),

    -- Objectives (stored as JSON array in value)
    ('objectives_text',
     'Promote ICT education and digital literacy across all age groups||Support IT entrepreneurs and startups in the district||Establish and coordinate IT clubs in educational institutions||Organize workshops, seminars, and training programs||Collaborate with government and private sector for digital initiatives',
     'सबै उमेर समूहमा आईसीटी शिक्षा र डिजिटल साक्षरता प्रवर्द्धन गर्ने||जिल्लामा आईटी उद्यमी र स्टार्टअपहरूलाई समर्थन गर्ने||शैक्षिक संस्थाहरूमा आईटी क्लबहरू स्थापना र समन्वय गर्ने||कार्यशाला, सेमिनार र तालिम कार्यक्रमहरू आयोजना गर्ने||डिजिटल पहलहरूको लागि सरकार र निजी क्षेत्रसँग सहकार्य गर्ने',
     'about', 'Organization objectives (pipe-delimited)'),

    -- History
    ('history_text',
     'Computer Association of Nepal (CAN) Federation Kavre was established in 2065 B.S. as a district-level organization dedicated to promoting ICT development in Kavrepalanchok. With 152+ members and 18 Annual General Meetings completed, including the landmark 10th Convention in 2079 B.S. that elected the current executive committee, CAN Kavre has been at the forefront of digital literacy, ICT training, and technology awareness in the district. We operate from Banepa, Kavrepalanchok and coordinate with 13 municipalities across the district.',
     'कम्प्युटर एसोसिएसन अफ नेपाल (क्यान) महासंघ काभ्रे शाखा २०६५ बि.सं.मा काभ्रेपलाञ्चोकमा आईसीटी विकास प्रवर्द्धन गर्न समर्पित जिल्ला स्तरीय संगठनको रूपमा स्थापना भएको थियो। १५२+ सदस्यहरू र १८ वटा वार्षिक साधारण सभा सम्पन्न गरेको, २०७९ बि.सं.मा सम्पन्न १० औं अधिवेशनले वर्तमान कार्यसमिति निर्वाचित गरेको छ। हामी बनेपा, काभ्रेपलाञ्चोकबाट सञ्चालन गर्दछौं र जिल्लाभरका १३ पालिकाहरूसँग समन्वय गर्दछौं।',
     'about', 'Organization history text'),

    -- Stats
    ('stat_years_active',  '18+', '१८+',  'stats', 'Years active'),
    ('stat_it_clubs',      '13+', '१३+',  'stats', 'IT clubs count'),
    ('stat_members',       '152+','१५२+', 'stats', 'Total members'),
    ('stat_events',        '200+','२००+', 'stats', 'Total events conducted'),

    -- Achievement stats (from Programs.tsx)
    ('stat_citizens_trained',      '2000+', '२०००+',  'stats', 'Citizens trained'),
    ('stat_programs_conducted',    '100+',  '१००+',   'stats', 'Programs conducted'),
    ('stat_municipalities_covered','13+',   '१३+',    'stats', 'Municipalities covered'),

    -- Contact info
    ('address',       'Banepa, Kavrepalanchok, Nepal',  'बनेपा, काभ्रेपलाञ्चोक, नेपाल',  'contact', 'Office address'),
    ('established',   'Established 2065 B.S.',          'स्थापना २०६५ बि.सं.',              'contact', 'Establishment date');


-- ============================================================
-- 20. REQUIRED DOCUMENTS for membership (from Membership.tsx)
--     Stored as settings for flexibility
-- ============================================================
INSERT INTO settings (key, value, value_ne, category, description) VALUES
    ('required_doc_1',
     'Nepali Citizenship Certificate||Scanned copy of both sides',
     'नेपाली नागरिकता प्रमाणपत्र||दुवै पट्टिको स्क्यान प्रति',
     'membership', 'Required document 1'),

    ('required_doc_2',
     'Academic Certificates||Minimum SLC/SEE or equivalent',
     'शैक्षिक प्रमाणपत्र||न्यूनतम एस.एल.सी./एस.ई.ई. वा सो सरह',
     'membership', 'Required document 2'),

    ('required_doc_3',
     'Passport-size Photo||Recent photograph with white background',
     'पासपोर्ट साइजको फोटो||सेतो पृष्ठभूमिको हालसालैको फोटो',
     'membership', 'Required document 3'),

    ('required_doc_4',
     'Professional / IT Related Certificate (if any)||Optional — IT training or work experience proof',
     'व्यावसायिक / आईटी सम्बन्धी प्रमाणपत्र (भएमा)||ऐच्छिक — आईटी तालिम वा कार्य अनुभव प्रमाण',
     'membership', 'Required document 4');


-- ============================================================
-- 21. TAGS (common labels for content)
-- ============================================================
INSERT INTO tags (name, name_ne, slug) VALUES
    ('ICT',              'आईसीटी',          'ict'),
    ('Digital Literacy', 'डिजिटल साक्षरता', 'digital-literacy'),
    ('Blood Donation',   'रक्तदान',         'blood-donation'),
    ('AGM',              'साधारण सभा',       'agm'),
    ('Training',         'तालिम',            'training'),
    ('Workshop',         'कार्यशाला',        'workshop'),
    ('Career',           'क्यारियर',         'career'),
    ('Business Meet',    'बिजनेस मिट',      'business-meet'),
    ('Calendar Launch',  'क्यालेन्डर लोकार्पण', 'calendar-launch'),
    ('New Year',         'नव वर्ष',          'new-year'),
    ('Networking',       'नेटवर्किङ',        'networking'),
    ('Seminar',          'सेमिनार',          'seminar'),
    ('Agriculture',      'कृषि',             'agriculture'),
    ('Women in Tech',    'प्रविधिमा महिला',  'women-in-tech'),
    ('E-Governance',     'ई-गभर्नेन्स',      'e-governance'),
    ('Health',           'स्वास्थ्य',         'health');
