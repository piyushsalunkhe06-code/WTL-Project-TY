-- ==============================================================================
-- KBTCOE Connect — Final Capstone Relational Seed Data
-- Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
-- Database: kbtcoe_connect_final
-- Department of Computer Engineering, MVP's KBTCOE Nashik
-- ==============================================================================

USE `kbtcoe_connect_final`;

-- ------------------------------------------------------------------------------
-- 1. Seed Users
-- Password for all accounts is: 'Password123!'
-- Hashed using Node.js crypto.scrypt (salt: 1a2b3c4d5e6f7a8b)
-- ------------------------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `branch`, `academic_year`, `role`, `bio`, `skills`, `interests`, `github_url`, `portfolio_url`)
VALUES
  (
    1,
    'Prof. Nitin Sonawane',
    'admin@kbtcoe.org',
    'scrypt$1a2b3c4d5e6f7a8b$927cef1017e39d717ac9a83e1c220f3441329a0d2d96e10e5b5af1ae695b518e004238cc1c4c40f9f374e7b62aa062adac763cdf046061a86e98d1086f1325f8',
    'Computer Engineering',
    'Faculty',
    'admin',
    'Assistant Professor and Training & Placement Coordinator at MVP\'s KBTCOE Nashik. Mentoring aspiring software engineers and coordinating campus hiring drives.',
    'System Design, Cloud Architecture, Database Management, Mentorship',
    'Placement Training, Technical Research, Open Source Outreach',
    'https://github.com/kbtcoe-tpo',
    'https://kbtcoe.org/department/computer'
  ),
  (
    2,
    'Sanket Patil',
    'sanket.patil@kbtcoe.org',
    'scrypt$1a2b3c4d5e6f7a8b$927cef1017e39d717ac9a83e1c220f3441329a0d2d96e10e5b5af1ae695b518e004238cc1c4c40f9f374e7b62aa062adac763cdf046061a86e98d1086f1325f8',
    'Information Technology',
    'TE',
    'student',
    'Third-year IT student passionate about full-stack web architectures, distributed systems, and real-time APIs. Open source contributor and tech lead of the Web Dev Club.',
    'JavaScript, React, Node.js, Express, MySQL, Docker, REST APIs',
    'Full-Stack Web, Cloud Native, Hackathons, DevRel',
    'https://github.com/sanketpatil-kbt',
    'https://sanketpatil.dev'
  ),
  (
    3,
    'Tanvi Kulkarni',
    'tanvi.kulkarni@kbtcoe.org',
    'scrypt$1a2b3c4d5e6f7a8b$927cef1017e39d717ac9a83e1c220f3441329a0d2d96e10e5b5af1ae695b518e004238cc1c4c40f9f374e7b62aa062adac763cdf046061a86e98d1086f1325f8',
    'Computer Engineering',
    'BE',
    'student',
    'Final-year Computer Engineering undergrad. AWS Certified Solutions Architect Associate with focus on cloud automation, serverless computing, and microservices.',
    'Python, AWS, Node.js, React, Kubernetes, PostgreSQL, TypeScript',
    'Cloud Architecture, DevOps, Distributed Databases, FinTech',
    'https://github.com/tanvik-comp',
    'https://tanvikulkarni.cloud'
  ),
  (
    4,
    'Aarav Sharma',
    'aarav.sharma@kbtcoe.org',
    'scrypt$1a2b3c4d5e6f7a8b$927cef1017e39d717ac9a83e1c220f3441329a0d2d96e10e5b5af1ae695b518e004238cc1c4c40f9f374e7b62aa062adac763cdf046061a86e98d1086f1325f8',
    'Computer Engineering',
    'TE',
    'student',
    'Junior Computer Engineering student with a strong passion for competitive programming, algorithms, and full-stack React systems. SIH 2025 finalist.',
    'C++, Data Structures, React, JavaScript, MySQL, TailwindCSS',
    'Competitive Programming, Algorithm Design, Frontend UX, SIH',
    'https://github.com/aaravsharma-kbt',
    'https://aaravsharma.tech'
  ),
  (
    5,
    'Priya Shinde',
    'priya.shinde@kbtcoe.org',
    'scrypt$1a2b3c4d5e6f7a8b$927cef1017e39d717ac9a83e1c220f3441329a0d2d96e10e5b5af1ae695b518e004238cc1c4c40f9f374e7b62aa062adac763cdf046061a86e98d1086f1325f8',
    'Artificial Intelligence & Data Science',
    'SE',
    'student',
    'Second-year AI&DS enthusiast exploring deep learning models, data visualization pipelines, and Python automation. Active member of KBTCOE Data Science Club.',
    'Python, Pandas, Scikit-Learn, PyTorch, SQL, Streamlit',
    'Machine Learning, Natural Language Processing, Computer Vision',
    'https://github.com/priyashinde-aids',
    'https://priyashinde.ai'
  );

-- ------------------------------------------------------------------------------
-- 2. Seed Opportunities
-- ------------------------------------------------------------------------------
INSERT INTO `opportunities` (`id`, `title`, `organization`, `category`, `description`, `eligibility`, `application_url`, `deadline`, `created_by`)
VALUES
  (
    1,
    'Siemens Summer Research Internship 2026',
    'Siemens Technology India',
    'internship',
    'Eight-week industrial research internship focused on IoT telemetry, edge computing pipelines, and industrial automation algorithms.',
    'TE & BE Computer and IT engineering students with min 60% aggregate',
    'https://siemens.com/careers/students',
    '2026-11-15',
    1
  ),
  (
    2,
    'Smart Campus Telemetry Hackathon 2026',
    'KBTCOE IEDC & Research Cell',
    'hackathon',
    'A 36-hour non-stop institutional hackathon to engineer smart water metering, energy conservation, and parking telemetry across the campus.',
    'Interdisciplinary collegiate teams of 3 to 4 members across all engineering branches',
    'https://kbtcoe.org/hackathon-2026',
    '2026-11-20',
    1
  ),
  (
    3,
    'SPPU Regional Technical Paper & Project Competition',
    'Department of Information Technology, KBTCOE',
    'competition',
    'Annual state-level university technical symposium for undergraduate researchers to present innovative engineering prototypes and peer-reviewed papers.',
    'All enrolled SE, TE, and BE engineering students across SPPU affiliated colleges',
    'https://kbtcoe.org/sppu-tech-symposium',
    '2026-12-05',
    1
  ),
  (
    4,
    'AWS Cloud Architecture & DevOps Hands-on Workshop',
    'AWS Academic Alliance & KBTCOE CSI Student Chapter',
    'workshop',
    'Comprehensive 2-day hands-on bootcamp covering AWS EC2, S3, RDS, Lambda serverless microservices, and Dockerized CI/CD GitHub Actions pipelines.',
    'Open to all SE, TE, and BE engineering undergraduates with basic Linux knowledge',
    'https://kbtcoe.org/workshops/aws-cloud',
    '2026-11-28',
    1
  ),
  (
    5,
    'Mahindra & Mahindra Electric Mobility Internship',
    'Mahindra Research Valley (Nashik Plant)',
    'internship',
    'Industrial software and embedded systems internship working on EV battery management systems (BMS) telemetry and dashboard interfaces.',
    'TE & BE Mechanical, E&TC, and Computer Engineering students',
    'https://mahindra.com/careers/ev-internship',
    '2026-12-15',
    1
  ),
  (
    6,
    'Nashik Tech Innovators Open Source Hackathon',
    'Nashik IT Association (NITA)',
    'hackathon',
    'Collaborate on civic-tech and smart city open-source tools with professional software engineers from top Nashik IT enterprises.',
    'All engineering and polytechnic students resident in Nashik district',
    'https://nita-nashik.org/hackathon',
    '2026-12-20',
    1
  );

-- ------------------------------------------------------------------------------
-- 3. Seed Community Posts
-- ------------------------------------------------------------------------------
INSERT INTO `posts` (`id`, `user_id`, `title`, `content`, `category`, `created_at`)
VALUES
  (
    1,
    2,
    'Building Scalable RESTful Services with Node.js & MariaDB Connection Pools',
    'During our Semester VI Web Dev lab, we explored how single-socket database connections bottleneck high-concurrency requests. By configuring a managed connection pool with `mysql2/promise`, connection re-use cut response latencies from 45ms to under 4ms! Highly recommend testing connection pools under concurrent load with ApacheBench.',
    'technical',
    DATE_SUB(NOW(), INTERVAL 3 DAY)
  ),
  (
    2,
    3,
    'KBTCOE Team Secures 1st Runner-Up at Smart India Hackathon (SIH 2025)!',
    'Thrilled to share that our 6-member interdisciplinary team from KBTCOE won 1st Runner-Up in the Smart Automation category at SIH 2025! We engineered an automated grain quality inspection pipeline using edge computer vision and real-time cloud analytics. Huge thanks to our faculty mentors and the KBTCOE IEDC cell for continuous support!',
    'achievement',
    DATE_SUB(NOW(), INTERVAL 2 DAY)
  ),
  (
    3,
    4,
    'Workshop Alert: Free Git, GitHub Actions & CI/CD Hands-on Session this Saturday',
    'The KBTCOE Open Source Club is organizing a 3-hour practical session on Git branch protection, merge strategies, and setting up automated CI/CD pipelines with GitHub Actions. Bring your laptops! Venue: Computer Lab 3, 10:00 AM onwards.',
    'event',
    DATE_SUB(NOW(), INTERVAL 1 DAY)
  ),
  (
    4,
    5,
    'Demystifying Vector Embeddings for Semantic Code Search in Engineering Projects',
    'For our BE capstone research project, we implemented semantic code search across our college repository using sentence transformers and cosine similarity. It allows students to find relevant algorithm implementations using plain English queries rather than exact keyword matches.',
    'technical',
    DATE_SUB(NOW(), INTERVAL 12 HOUR)
  ),
  (
    5,
    1,
    'Important Notice: Campus Recruitment Drive Registration for 2026 Batch',
    'Final-year students of Computer, IT, and AI&DS branches are requested to update their technical portfolios, verify project GitHub repositories, and ensure their KBTCOE Connect profiles are 100% complete before the upcoming campus recruitment cycle beginning next week.',
    'general',
    DATE_SUB(NOW(), INTERVAL 4 HOUR)
  );

-- ------------------------------------------------------------------------------
-- 4. Seed Comments
-- ------------------------------------------------------------------------------
INSERT INTO `comments` (`id`, `post_id`, `user_id`, `content`, `created_at`)
VALUES
  (
    1,
    1,
    3,
    'Great write-up Sanket! We also saw huge gains when tuning connection pool limits (`connectionLimit: 10`) alongside query caching.',
    DATE_SUB(NOW(), INTERVAL 2 DAY)
  ),
  (
    2,
    1,
    4,
    'Super helpful! Did you encounter any deadlocks when testing concurrent update transactions?',
    DATE_SUB(NOW(), INTERVAL 2 DAY)
  ),
  (
    3,
    2,
    2,
    'Congratulations Tanvi and the entire SIH team! You made KBTCOE proud on the national stage!',
    DATE_SUB(NOW(), INTERVAL 1 DAY)
  ),
  (
    4,
    2,
    5,
    'Heartiest congratulations! Would love to see a tech talk on your edge CV architecture in our next club meetup.',
    DATE_SUB(NOW(), INTERVAL 1 DAY)
  ),
  (
    5,
    3,
    2,
    'Registered! Looking forward to the GitHub Actions demonstration.',
    DATE_SUB(NOW(), INTERVAL 18 HOUR)
  ),
  (
    6,
    4,
    3,
    'Fascinating approach Priya. What transformer model did you select for embedding generation?',
    DATE_SUB(NOW(), INTERVAL 6 HOUR)
  );

-- ------------------------------------------------------------------------------
-- 5. Seed Likes
-- ------------------------------------------------------------------------------
INSERT INTO `likes` (`id`, `post_id`, `user_id`, `created_at`)
VALUES
  (1, 1, 3, DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (2, 1, 4, DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (3, 1, 5, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (4, 2, 2, DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (5, 2, 4, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (6, 2, 5, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (7, 3, 2, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (8, 4, 3, DATE_SUB(NOW(), INTERVAL 8 HOUR));

-- ------------------------------------------------------------------------------
-- 6. Seed Student Achievements
-- ------------------------------------------------------------------------------
INSERT INTO `achievements` (`id`, `user_id`, `title`, `category`, `description`, `date_achieved`, `external_url`)
VALUES
  (
    1,
    3,
    'Smart India Hackathon (SIH 2025) 1st Runner-Up',
    'hackathon',
    'National level 1st Runner-Up under the Smart Automation theme for developing an automated grain telemetry and vision inspection platform.',
    '2025-12-22',
    'https://sih.gov.in/sih2025'
  ),
  (
    2,
    3,
    'AWS Certified Solutions Architect – Associate',
    'certification',
    'Demonstrated expertise in architecting highly available, cost-effective, and secure distributed cloud systems on Amazon Web Services.',
    '2026-03-10',
    'https://aws.amazon.com/certification'
  ),
  (
    3,
    2,
    '1st Prize - SPPU Regional Web Development Hackathon',
    'competition',
    'Developed a decentralized real-time campus notice broadcast system using WebSockets and Express.',
    '2026-02-18',
    'https://kbtcoe.org/competitions'
  ),
  (
    4,
    2,
    'Meta Certified Front-End Developer Specialization',
    'certification',
    'Comprehensive professional certification covering React, responsive design systems, accessibility (WCAG), and modern JavaScript.',
    '2026-01-15',
    'https://coursera.org/verify/meta-frontend'
  ),
  (
    5,
    4,
    'CodeChef 4-Star Coder & Global Rank 84 in Starters 140',
    'academic',
    'Achieved maximum rating of 1842 (4-Star) on CodeChef solving advanced dynamic programming, graph algorithms, and number theory problems.',
    '2026-04-05',
    'https://codechef.com'
  ),
  (
    6,
    5,
    'Google Cloud Arcade Champion - Generative AI & ML Track',
    'workshop',
    'Completed intensive cloud learning milestones on Vertex AI, Gemini multimodal APIs, and BigQuery ML models.',
    '2026-05-20',
    'https://cloud.google.com/training'
  );
