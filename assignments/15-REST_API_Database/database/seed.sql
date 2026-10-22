-- ==============================================================================
-- KBTCOE Connect — Relational Seed Data (seed.sql)
-- Assignment 15: REST API and Database
-- Database: kbtcoe_connect_api
-- ==============================================================================

USE `kbtcoe_connect_api`;

-- ------------------------------------------------------------------------------
-- 1. Seed Users (passwords hashed using Node.js crypto.scrypt: 'Password123!')
-- ------------------------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `branch`, `academic_year`)
VALUES
  (
    1,
    'Sanket Patil',
    'sanket.patil@kbtcoe.org',
    'scrypt$1a2b3c4d5e6f7a8b$927cef1017e39d717ac9a83e1c220f3441329a0d2d96e10e5b5af1ae695b518e004238cc1c4c40f9f374e7b62aa062adac763cdf046061a86e98d1086f1325f8',
    'Information Technology',
    'TE'
  ),
  (
    2,
    'Tanvi Kulkarni',
    'tanvi.kulkarni@kbtcoe.org',
    'scrypt$1a2b3c4d5e6f7a8b$927cef1017e39d717ac9a83e1c220f3441329a0d2d96e10e5b5af1ae695b518e004238cc1c4c40f9f374e7b62aa062adac763cdf046061a86e98d1086f1325f8',
    'Computer Engineering',
    'BE'
  );

-- ------------------------------------------------------------------------------
-- 2. Seed Opportunities (6 collegiate records across 4 categories)
-- ------------------------------------------------------------------------------
INSERT INTO `opportunities` (`id`, `title`, `organization`, `category`, `description`, `eligibility`, `application_url`, `deadline`)
VALUES
  (
    1,
    'Siemens Summer Research Internship 2026',
    'Siemens Technology India',
    'internship',
    'Eight-week industrial research internship focused on IoT telemetry, edge computing pipelines, and industrial automation.',
    'TE & BE Computer and IT engineering students with min 60% aggregate',
    'https://siemens.com/careers/students',
    '2026-11-15'
  ),
  (
    2,
    'Smart Campus Telemetry Hackathon 2026',
    'KBTCOE IEDC & Research Cell',
    'hackathon',
    'A 36-hour non-stop institutional hackathon to engineer smart water metering and energy telemetry across the college campus.',
    'Interdisciplinary collegiate teams of 3 to 4 members across all engineering branches',
    'https://kbtcoe.org/hackathon-2026',
    '2026-11-20'
  ),
  (
    3,
    'SPPU Regional Technical Paper & Project Competition',
    'Department of Information Technology, KBTCOE',
    'competition',
    'Annual peer-reviewed technical paper competition covering Distributed Systems, Applied AI/ML, and Cloud Architectures.',
    'All FE, SE, TE, and BE engineering undergraduates',
    'https://kbtcoe.org/tech-symposium',
    '2026-11-30'
  ),
  (
    4,
    'AWS Cloud Architecture & Kubernetes Masterclass',
    'KBTCOE Cloud Computing & DevOps Club',
    'workshop',
    'Three-day intensive technical boot camp featuring hands-on AWS labs, Docker containerization, and Kubernetes cluster orchestration.',
    'Open to all engineering students with basic Linux / CLI familiarity',
    'https://kbtcoe.org/workshops/cloud-2026',
    '2026-12-05'
  ),
  (
    5,
    'Bosch Embedded Systems & Automotive IoT Internship',
    'Bosch Global Software Technologies',
    'internship',
    'Six-month semester internship in automotive embedded firmware, CAN bus diagnostics, and sensor fusion telematics.',
    'BE E&TC, Computer, and Instrumentation students graduating in 2027',
    'https://bosch.in/careers/campus',
    '2026-12-10'
  ),
  (
    6,
    'National Collegiate CodeSprint 2026',
    'ACM Student Chapter',
    'competition',
    'Five-hour national competitive algorithmic programming challenge hosted on HackerRank, featuring data structures and dynamic programming.',
    'Individual participation open to all enrolled college students',
    'https://hackerrank.com/kbtcoe-codesprint-2026',
    '2026-12-15'
  );

-- ------------------------------------------------------------------------------
-- 3. Seed Posts (Community discussions authored by seed users)
-- ------------------------------------------------------------------------------
INSERT INTO `posts` (`id`, `user_id`, `title`, `content`, `category`)
VALUES
  (
    1,
    1,
    'Smart India Hackathon 2026 Finalist Selection!',
    'Thrilled to announce that our team SmartAgro has qualified for the National Grand Finale of SIH 2026! We developed an automated soil moisture and telemetry pipeline using LoRaWAN sensors and Node.js.',
    'achievement'
  ),
  (
    2,
    1,
    'Understanding REST API Error Handling & Status Codes',
    'A quick primer for TE IT peers: Always distinguish between 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), and 404 (Not Found). Never return 200 with an error object inside the body!',
    'technical'
  ),
  (
    3,
    2,
    'KBTCOE WebDev Workshop: Building with React 18',
    'Join us this Saturday in IT Lab 3 for an interactive peer code-along where we build a full-featured student directory using React 18 functional components and custom hooks.',
    'event'
  ),
  (
    4,
    2,
    'Tips for Cracking Off-Campus Engineering Internships',
    'Key recommendations for SE and TE students: Focus deeply on fundamental Data Structures, build 2 clean full-stack projects with live deployment links, and maintain a consistent GitHub commit graph.',
    'general'
  );
