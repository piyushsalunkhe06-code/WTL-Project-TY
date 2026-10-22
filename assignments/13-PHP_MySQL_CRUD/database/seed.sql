-- ==============================================================================
-- KBTCOE Connect — Demonstration Seed Dataset (seed.sql)
-- Assignment 13: PHP and MySQL CRUD — Campus Opportunity Management Portal
-- ==============================================================================

USE `kbtcoe_connect_crud`;

-- Optional: Clean existing demonstration records if re-running seed
-- TRUNCATE TABLE `opportunities`;

INSERT INTO `opportunities` 
  (`title`, `organization`, `category`, `description`, `eligibility`, `application_url`, `deadline`) 
VALUES
(
  'Smart Campus Telemetry Hackathon 2026',
  'KBTCOE Institution Innovation Council (IIC)',
  'hackathon',
  'A 36-hour continuous collegiate hackathon challenging multidisciplinary student squads to prototype IoT telemetry and edge-AI solutions for smart water metering, solar grid monitoring, and library automation on campus.',
  'Open to all FE, SE, TE & BE Engineering Undergraduates',
  'https://kbtcoe.org/hackathon-2026',
  '2026-11-25'
),
(
  'Full-Stack Cloud Infrastructure Summer Internship',
  'TechSprint Cloud Labs (Industry Academic Partner)',
  'internship',
  'An intensive 8-week paid summer internship program working alongside senior cloud architects to build high-throughput microservices using Node.js, Docker, Kubernetes, and AWS cloud primitives.',
  'TE & BE Students (Computer, IT, and AI & Data Science)',
  'https://techsprint.io/careers/internships',
  '2026-12-05'
),
(
  'Inter-Collegiate Bridge Structural Modeling Championship',
  'Maharashtra Civil Engineering Student Chapter',
  'competition',
  'Inter-college engineering contest evaluating student teams on structural load simulation, seismic analysis, and sustainable drafting of cable-stayed pedestrian bridges using modern CAD and FEM tools.',
  'SE, TE & BE Students (Civil & Mechanical Engineering)',
  'https://mcesc.org.in/bridge-challenge',
  '2026-12-18'
),
(
  'Hands-On Industrial Automation & PLC/SCADA Bootcamp',
  'Department of Instrumentation & Control',
  'workshop',
  'A comprehensive 3-day practical bootcamp covering programmable logic controllers (PLCs), ladder logic programming, industrial sensor telemetry, and SCADA supervisory control screens.',
  'All Engineering Undergraduates (Limited to 60 seats)',
  'https://kbtcoe.org/events/plc-scada-workshop',
  '2026-12-22'
),
(
  'Applied Computer Vision & Edge AI Fellowship',
  'AgriVision AI Research Labs',
  'internship',
  'A 10-week technical research internship training deep learning vision models on drone imagery for early crop pest detection and deploying quantized neural networks onto Raspberry Pi edge hardware.',
  'TE & BE Students (AI & DS, Comp, IT, or E&TC)',
  'https://agrivision.ai/fellowship',
  '2027-01-10'
),
(
  'Formula Student Electric Vehicle Space-Frame Challenge',
  'SAE Western India Collegiate Section',
  'competition',
  'Design competition challenging student engineers to model an aerodynamic, lightweight battery enclosure and composite chassis space frame adhering to formula student EV safety regulations.',
  'Undergraduate Teams of 2–4 Students (Mech, E&TC, Auto)',
  'https://saeindia.org/ev-challenge-2027',
  '2027-01-15'
);
