# KBTCOE Connect — Architecture & System Design

## 1. System Overview

**KBTCOE Connect** is architected as an enterprise-grade, decoupled three-tier web application built with **React 18**, **Node.js / Express**, and **MariaDB / MySQL**. Developed progressively through a 16-practical syllabus series, the platform synthesizes all foundational web development concepts into a production-grade student networking portal.

```mermaid
graph TD
    subgraph ClientTier ["Presentation Layer (React 18 SPA — Port 5173)"]
        Browser["User Web Browser"]
        Router["Client-Side View Router (React State)"]
        AuthCtx["AuthContext (JWT Session & Current User)"]
        Pages["Views:\n- DashboardPage\n- FeedPage & PostDetail\n- DirectoryPage & Profile\n- AchievementsPage\n- OpportunitiesPage\n- SettingsPage\n- Auth Pages (Login/Register)"]
        Components["Reusable UI Components\n- Navbar & Footer\n- StatCard & Modal\n- Alert & LoadingSpinner"]
        APIClient["Centralized API Client\n(Fetch API + Bearer Token)"]

        Browser --> Router
        Router --> AuthCtx
        Router --> Pages
        Pages --> Components
        Pages --> APIClient
    end

    subgraph APITier ["Application Layer (Node.js & Express — Port 5000)"]
        ExpressApp["Express Application Server"]
        MiddlwareStack["Middleware Pipeline:\n- CORS & JSON Body Parser\n- Request Logger (Sanitized)\n- JWT Auth Guard (requireAuth / optionalAuth)\n- Centralized Error Handler (4-Param)"]
        Routers["REST API Routers:\n- /api/auth\n- /api/dashboard\n- /api/users\n- /api/posts\n- /api/comments\n- /api/achievements\n- /api/opportunities"]
        Controllers["Controller Layer:\n- authController\n- dashboardController\n- userController\n- postController\n- commentController\n- likeController\n- achievementController\n- opportunityController"]
        SecurityUtils["Security & Cryptography:\n- Salted scrypt Hashing\n- crypto.timingSafeEqual\n- JWT Sign & Verify"]

        APIClient -- "HTTP / REST JSON (Proxy /api)" --> ExpressApp
        ExpressApp --> MiddlwareStack
        MiddlwareStack --> Routers
        Routers --> Controllers
        Controllers --> SecurityUtils
    end

    subgraph DataTier ["Persistence Layer (MariaDB / MySQL — Port 3306)"]
        DBPool["mysql2/promise Connection Pool\n(Database: kbtcoe_connect_final)"]
        Tables["Relational Schema (6 Normalized Tables):\n- users (Accounts & Profiles)\n- opportunities (Internships/Jobs/Contests)\n- posts (Community Feed & Articles)\n- comments (Hierarchical Discussion Threads)\n- likes (uk_post_user_like Guard)\n- achievements (Verified Honors & Proofs)"]

        Controllers -- "Parameterized SQL (Prepared Statements)" --> DBPool
        DBPool --- Tables
    end
```

---

## 2. Directory & Component Mapping

The integrated capstone application is located within `assignments/16-KBTCOE_Connect_Final_Project/` and structured cleanly into four core sub-systems:

```text
assignments/16-KBTCOE_Connect_Final_Project/
├── client/                     # Presentation Layer (React 18 + Vite)
│   ├── public/                 # Static branding assets & SVG icons
│   ├── src/
│   │   ├── api/client.js       # Centralized Fetch wrapper with Bearer token injection
│   │   ├── context/AuthContext # React Auth Provider & Session State
│   │   ├── components/         # Reusable modular UI components (Navbar, Modal, StatCard, etc.)
│   │   ├── pages/              # 10 Application pages (Dashboard, Feed, Directory, etc.)
│   │   ├── styles/main.css     # KBTCOE Design System (#1E3A8A, #2563EB, #F8FAFC)
│   │   ├── App.jsx             # Main App layout & client-side routing
│   │   └── main.jsx            # React 18 DOM root mount
│   ├── package.json            # Client dependencies (React 18, Vite)
│   └── vite.config.js          # Vite config with /api proxy to Port 5000
│
├── server/                     # Application Layer (Node.js + Express)
│   ├── config/database.js      # mysql2/promise connection pool & health ping
│   ├── controllers/            # 8 Modular controllers encapsulating business logic
│   ├── middleware/             # authMiddleware, errorHandler, logger, notFound
│   ├── routes/                 # Express REST endpoint routes
│   ├── utils/validators.js     # Cryptographic scrypt hashing & schema validators
│   ├── .env                    # Active runtime environment configuration
│   ├── .env.example            # Template environment variables
│   ├── package.json            # Server dependencies (express, mysql2, jsonwebtoken, cors)
│   └── server.js               # Express application entrypoint & lifecycle
│
├── database/                   # Persistence Layer (MariaDB / MySQL)
│   ├── schema.sql              # DDL schema for kbtcoe_connect_final (6 tables)
│   └── seed.sql                # Synthetic seed dataset (5 users, 6 opps, 5 posts, 6 achievements)
│
├── tests/                      # Verification & Integration Test Suite
│   ├── backend.test.js         # 100/100 End-to-end integration test suite
│   └── regression.test.js      # 15/15 Regression test suite preserving Assignments 01-15
│
└── README.md                   # Complete 21-section laboratory manual & 16 Viva Voce Q&As
```

---

## 3. Communication & Security Architecture

| Interface | Protocol | Data Format | Authentication / Protection |
| :--- | :--- | :--- | :--- |
| **Client -> API Server** | HTTP/1.1 (REST) | JSON | Stateless Bearer JWT (`Authorization: Bearer <token>`) |
| **API Server -> Database** | MySQL Binary Protocol | Parameterized Queries | `mysql2/promise` connection pool with zero SQL string concatenation |
| **Password Storage** | Cryptographic KDF | Salted scrypt hex strings | 32-byte salt, 64-byte key, `crypto.timingSafeEqual` comparison |
| **Ownership Authorization** | Role & ID verification | JSON 403 Forbidden | Author ownership checks (`record.user_id === req.user.id \|\| req.user.role === 'admin'`) |
| **Duplicate Prevention** | Relational Constraint | MySQL ER_DUP_ENTRY | `UNIQUE KEY uk_post_user_like (post_id, user_id)` |
| **Error Handling** | Centralized 4-Param Middleware | Sanitized JSON | Strips stack traces in production; captures syntax & malformed JSON errors |

---

## 4. Database Relational Model (`kbtcoe_connect_final`)

```mermaid
erDiagram
    USERS ||--o{ POSTS : "authors"
    USERS ||--o{ COMMENTS : "writes"
    USERS ||--o{ LIKES : "reacts"
    USERS ||--o{ ACHIEVEMENTS : "earns"
    USERS ||--o{ OPPORTUNITIES : "posts"
    POSTS ||--o{ COMMENTS : "contains"
    POSTS ||--o{ LIKES : "receives"

    USERS {
        int id PK
        varchar student_id UK
        varchar full_name
        varchar email UK
        varchar password_hash
        varchar department
        varchar year_of_study
        decimal cgpa
        text bio
        text skills
        varchar github_url
        varchar linkedin_url
        enum role
        timestamp created_at
    }

    POSTS {
        int id PK
        int user_id FK
        varchar title
        text content
        enum category
        int likes_count
        timestamp created_at
    }

    COMMENTS {
        int id PK
        int post_id FK
        int user_id FK
        text content
        timestamp created_at
    }

    LIKES {
        int id PK
        int post_id FK
        int user_id FK
        timestamp created_at
    }

    ACHIEVEMENTS {
        int id PK
        int user_id FK
        varchar title
        enum category
        text description
        varchar proof_url
        date achievement_date
        timestamp created_at
    }

    OPPORTUNITIES {
        int id PK
        int posted_by FK
        varchar title
        varchar company
        enum category
        varchar location
        varchar deadline
        varchar stipend
        text description
        text requirements
        varchar apply_url
        enum status
        timestamp created_at
    }
```
