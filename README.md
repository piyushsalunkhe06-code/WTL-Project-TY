# KBTCOE Connect

> **Tagline:** The Professional Network for KBTCOE Students  
> **Institution:** MVP Samaj's K.B.T. College of Engineering (KBTCOE), Nashik  
> **Project Scope:** Full-Stack Web Application developed progressively across 16 University Lab Practicals.

---

## 1. Project Overview

**KBTCOE Connect** is a centralized professional networking, opportunity-sharing, and portfolio-showcasing platform tailored for students, alumni, and faculty of MVP Samaj's K.B.T. College of Engineering, Nashik.

The platform bridges academia and career opportunities by enabling students to:
- **Build Professional Profiles:** Showcase academic branch, graduation year, verified skills, GitHub/LinkedIn links, bio, and portfolio projects.
- **Publish Technical Blogs & Insights:** Share technical tutorials, project write-ups, research findings, and interview experiences with markdown support.
- **Showcase Achievements & Certifications:** Log hackathon wins, academic honors, professional certifications, and club leadership roles.
- **Share Competitions & Hackathons:** Form teams, post competition announcements, and document project outcomes.
- **Discover Opportunities:** Real-time internship, project, and placement listings posted by campus placement coordinators, alumni, and peers.
- **Engage with the Community:** Interactive student feed with posts, project updates, likes, and comment threads.
- **Search & Filter:** Find peers by engineering department (Computer, IT, AI&DS, Mechanical, Civil, E&TC, Instrumentation), year of study, or technical skills (React, Python, Cloud, CAD, etc.).
- **Access Student Dashboard:** Metric cards tracking personal profile completion, published blogs, applications, and network engagement.
- **Administrative Moderation:** Basic review and content moderation to ensure an academic and professional environment.

---

## 2. Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | HTML5, Semantic Markup, CSS3 (Modern Flexbox, CSS Grid, Responsive Design), Vanilla JavaScript (ES6+), React 18+ (Functional Components, Hooks, JSX, Vite build tool) |
| **Backend** | Node.js (v24+), Express.js (Modular REST API architecture, JWT authentication, Middleware stack) |
| **Database** | MySQL (Relational Schema, Foreign Keys, Indexing, Parameterized Queries) |
| **Syllabus Practicals** | Native PHP 8+ (Form Handling, Server-side Validation, `$_SESSION` management), PHP Data Objects (PDO) for MySQL CRUD operations |
| **Development & Tools** | REST API testing, Vite Dev Server, Git version control, Environment Configuration (`.env`) |

---

## 3. Repository Directory Structure

```text
KBTCOE-Connect/
│
├── assignments/                          # 16 Standalone University Practical Submissions
│   ├── 01-HTML_Basics/                   # Practical 01: Core HTML markup & table/list elements
│   ├── 02-Semantic_HTML/                 # Practical 02: Semantic HTML5 document hierarchy
│   ├── 03-CSS_Styling/                   # Practical 03: KBTCOE styling, typography & component cards
│   ├── 04-Responsive_Design/             # Practical 04: Mobile-first media queries & responsive nav
│   ├── 05-CSS_Positioning/               # Practical 05: Flexbox, Grid, sticky headers & overlay modals
│   ├── 06-JavaScript_Basics/             # Practical 06: JS data structures, array filters & DOM events
│   ├── 07-Frontend_Validation/           # Practical 07: Client-side RegEx validation & PRN check
│   ├── 08-React_SPA/                     # Practical 08: React SPA setup, routing & component structure
│   ├── 09-React_Concepts/                # Practical 09: Props, State, Hooks & controlled components
│   ├── 10-Fetch_API_JSON/                # Practical 10: Asynchronous Fetch API & JSON consumption
│   ├── 11-DOM_Manipulation/              # Practical 11: Dynamic DOM updates, live counters & comments
│   ├── 12-PHP_Form_Handling/             # Practical 12: Server-side PHP validation & session management
│   ├── 13-PHP_MySQL_CRUD/                # Practical 13: PHP-MySQL PDO CRUD operations for opportunities
│   ├── 14-Node_Express_Server/           # Practical 14: Express REST API architecture & middleware
│   ├── 15-REST_API_Database/             # Practical 15: Node/Express + MySQL pool & authenticated CRUD
│   └── 16-KBTCOE_Connect_Final_Project/  # Practical 16: Complete integrated full-stack capstone
│
├── frontend/                             # Progressive React SPA application (Vite + React)
│   ├── public/                           # Static assets, logos, and college crest
│   ├── src/                              # React source code (components, pages, context, hooks)
│   ├── package.json                      # Frontend dependencies & scripts
│   └── vite.config.js                    # Vite configuration
│
├── backend/                              # Progressive Node.js + Express REST API
│   ├── src/                              # Controllers, routes, middlewares, config
│   ├── .env.example                      # Sample environment variables
│   └── package.json                      # Backend dependencies & scripts
│
├── php-practicals/                       # Dedicated standalone PHP lab implementations
│   ├── practical-12/                     # PHP form handling and session authentication
│   └── practical-13/                     # PHP + MySQL PDO CRUD platform
│
├── database/                             # Relational database scripts
│   ├── schema.sql                        # DDL table creation scripts with foreign keys
│   ├── seed.sql                          # Synthetic seed data for KBTCOE students & posts
│   └── er-diagram.png                    # Entity-Relationship diagram
│
├── docs/                                 # Documentation & Presentation Artifacts
│   ├── architecture.md                   # System architecture & component interaction
│   ├── assignment-mapping.md             # Syllabus-to-feature mapping matrix
│   ├── viva-preparation.md               # Comprehensive Q&A guide for practical review
│   └── setup-guide.md                    # Zero-to-running setup guide
│
├── DEVELOPMENT_PLAN.md                   # Master engineering roadmap & design specifications
├── PROGRESS.md                           # Live practical progress tracker & test verification log
└── README.md                             # Repository home & documentation root
```

---

## 4. 16 Practical Assignments Roadmap (100% Completed)

| No. | Practical Name | Syllabus Focus | KBTCOE Connect Feature Demonstrated | Status |
| :---: | :--- | :--- | :--- | :---: |
| **01** | `01-HTML_Basics` | Core HTML tags, structure, tables, forms | Student Welcome Hub & Opportunity Bulletin Table | ✅ Completed |
| **02** | `02-Semantic_HTML` | HTML5 semantic elements (`<header>`, `<nav>`, `<article>`) | Technical Blog & Student Profile Document Hierarchy | ✅ Completed |
| **03** | `03-CSS_Styling` | CSS Selectors, Colors, Fonts, Card Components | KBTCOE Design System, Badges & Profile Card Deck | ✅ Completed |
| **04** | `04-Responsive_Design` | Flexbox, Grid, Media Queries | Responsive Multi-Device Feed & Grid Reflow | ✅ Completed |
| **05** | `05-CSS_Positioning` | Positioning Schemes, Transforms, Modals | Feed Stacking, Sticky Header & Post Modal | ✅ Completed |
| **06** | `06-JavaScript_Basics` | JS Functions, ES6 Array Methods (`filter`, `map`) | Dynamic Student Directory & Skill-based Search Filter | ✅ Completed |
| **07** | `07-Frontend_Validation` | Configurable RegEx, Form Events, Feedback | Student Registration & Configurable PRN/Email Validation | ✅ Completed |
| **08** | `08-React_SPA` | React Tooling, JSX, SPA Structure, Routing | KBTCOE Connect SPA Core & Multi-page Navigation | ✅ Completed |
| **09** | `09-React_Concepts` | `useState`, `useEffect`, Custom Hooks, Props | Interactive Post Feed, Filter State & Skill Tag Deck | ✅ Completed |
| **10** | `10-Fetch_API_JSON` | Promises, `async/await`, Fetch API, JSON Handling | Dynamic Opportunity Board & Blog Reader with Loading States | ✅ Completed |
| **11** | `11-DOM_Manipulation` | DOM Element Creation, Event Delegation, Mutation | Live Like Counter, Instant Comment Poster & Bookmark UI | ✅ Completed |
| **12** | `12-PHP_Form_Handling` | PHP `$_POST`, Sanitization, Validation, `$_SESSION` | Student Blog Submission Engine & Session Auth | ✅ Completed |
| **13** | `13-PHP_MySQL_CRUD` | PHP Data Objects (PDO), SQL Prepared Statements | Opportunity Management Portal (Post, Edit, Delete Jobs) | ✅ Completed |
| **14** | `14-Node_Express_Server` | Express.js, Custom Middleware, REST Routing | Core REST API Gateway (`/api/opportunities`) | ✅ Completed |
| **15** | `15-REST_API_Database` | Node + MySQL (`mysql2/promise`), JWT Auth, Scrypt | Authenticated Endpoints, Profile CRUD & Persistence | ✅ Completed |
| **16** | `16-KBTCOE_Connect_Final_Project` | Full-Stack Integration, Testing, Production Build | Complete Integrated Full-Stack Capstone (React + Express + MariaDB) | ✅ Completed |

---

## 5. Development Strategy & Guidelines

1. **Step-by-Step Rigor:** Every assignment is developed independently, tested against concrete acceptance criteria, documented with viva questions, and verified before advancing to the next.
2. **Dual Preservation:** All 16 assignment directories (`assignments/01-*` to `assignments/16-*`) remain 100% self-contained, standalone, and easily demonstrable for lab evaluations.
3. **Security Standards:** Parameterized queries for SQL injection prevention, salted scrypt password hashing, timing-safe equality checks, JWT stateless authorization, strict input validation, and zero hardcoded secrets.
4. **Assessment Preparedness:** Every assignment README includes targeted viva questions with in-depth answers, learning objectives, and run commands.

---

## 6. Running the Final Capstone Application (Assignment 16)

The final capstone integrates React 18, Node.js, Express, and MariaDB into an end-to-end full-stack networking platform located in `assignments/16-KBTCOE_Connect_Final_Project/`.

### Prerequisites
- **Node.js**: v18.0.0+ (Tested on v24.20.0)
- **NPM**: v9.0.0+ (Use `npm.cmd` on Windows PowerShell)
- **MariaDB / MySQL**: v10.5+ / v8.0+ (Database: `kbtcoe_connect_final` on Port 3306)

### 1. Database Initialization
```powershell
# From the project root or assignments/16-KBTCOE_Connect_Final_Project/database/
& "C:\Program Files\MariaDB 13.0\bin\mysql.exe" -u root kbtcoe_connect_final < assignments/16-KBTCOE_Connect_Final_Project/database/schema.sql
& "C:\Program Files\MariaDB 13.0\bin\mysql.exe" -u root kbtcoe_connect_final < assignments/16-KBTCOE_Connect_Final_Project/database/seed.sql
```

### 2. Start the Backend API Server (Port 5000)
```powershell
cd assignments/16-KBTCOE_Connect_Final_Project/server
npm.cmd start
# API Server runs at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 3. Start the Frontend React SPA (Port 5173)
```powershell
cd assignments/16-KBTCOE_Connect_Final_Project/client
npm.cmd run dev
# React Vite development server runs at http://localhost:5173
```

### 4. Run the Automated Test Suites
```powershell
# Run 100/100 Backend Integration Tests
cd assignments/16-KBTCOE_Connect_Final_Project/tests
node backend.test.js

# Run 15/15 Regression Verification Suite (Checking Practicals 01-15)
node regression.test.js
```

### 5. Build for Production
```powershell
cd assignments/16-KBTCOE_Connect_Final_Project/client
npm.cmd run build
# Production build output is emitted to client/dist/
```

### 6. Demonstration Seed Accounts
| Account Type | Email Address | Password | Role |
| :--- | :--- | :--- | :--- |
| **Student** | `rahul.sharma@kbtcoe.org` | `Student@123` | Student (Computer Engg, TE) |
| **Student** | `priya.patil@kbtcoe.org` | `Student@123` | Student (IT, BE) |
| **Admin** | `admin@kbtcoe.org` | `Admin@123` | Admin (Faculty / Coordinator) |

