# KBTCOE Connect — Assignment Mapping Matrix

This document maps each of the 16 university practicals directly to:
1. **Syllabus Topic & Core Web Concept**
2. **KBTCOE Connect Feature Implemented**
3. **Primary Deliverables & Files**
4. **Contribution to the Final Integrated Platform**

---

| Practical | Syllabus Topic | KBTCOE Connect Feature | Deliverable Files | Contribution to Final Platform |
| :---: | :--- | :--- | :--- | :--- |
| **01** | HTML Basics | Student Welcome Hub & Bulletin Table | `index.html`, `README.md` | Establishes raw content structure for student profiles and opportunity tables. |
| **02** | Semantic HTML | Technical Blog & Profile Structure | `index.html`, `README.md` | Provides accessible semantic markup (`<header>`, `<nav>`, `<article>`, `<aside>`) reused in React templates. |
| **03** | CSS Styling | KBTCOE Design System & Card Components | `index.html`, `style.css`, `README.md` | Establishes color palette (`#1E3A8A`), typography, badge styles, and card aesthetics. |
| **04** | Responsive Design (Flexbox, Grid & Media Queries) | Multi-Device Feed, Grid Layout & Adaptive Menu | `index.html`, `responsive.css`, `README.md` | Supplies Flexbox, Grid, and mobile-first media queries for the React client. |
| **05** | CSS Positioning & Other CSS Properties | Sticky Nav, Floating Action Button, Post Modal & Transforms | `index.html`, `positioning.css`, `README.md` | Supplies positioning schemes (sticky/fixed/absolute), transforms, and modal layering. |
| **06** | JavaScript Basics | Student Directory & Search Filter | `index.html`, `app.js`, `style.css`, `README.md` | Implements array filtering (`filter`, `map`) logic reused in frontend search hooks. |
| **07** | Frontend Validation | Registration Form with Configurable RegEx Validation | `index.html`, `validation.js`, `README.md` | Enforces configurable institutional email (`@kbtcoe.org`) and PRN validation rules. |
| **08** | React SPA | React Tooling, JSX & SPA Structure | `src/`, `package.json`, `README.md` | Initializes the core React SPA project shell with Vite. |
| **09** | React Concepts | Props, State, Hooks (`useState`, `useEffect`) | `src/components/`, `README.md` | Adds interactive post feed, like triggers, and state management. |
| **10** | Fetch API & JSON | Asynchronous Promises & JSON Handling | `index.html`, `style.css`, `app.js`, `data/`, `README.md` | Establishes async data fetching patterns with loading spinners and error handling. |
| **11** | DOM Manipulation | Dynamic DOM Events & Live Counters | `index.html`, `style.css`, `app.js`, `assets/`, `README.md` | Demonstrates imperative DOM manipulation for comment threads and live reaction counts. |
| **12** | PHP Form Handling | Server-side Validation & Sessions | `index.php`, `register.php`, `login.php`, `dashboard.php`, `logout.php`, `includes/`, `assets/`, `README.md` | Demonstrates PHP form sanitization and `$_SESSION` authentication. |
| **13** | PHP-MySQL CRUD | PHP PDO & SQL Prepared Statements | `index.php`, `view.php`, `create.php`, `edit.php`, `delete.php`, `database/`, `includes/`, `config/`, `README.md` | Full standalone CRUD engine for managing campus opportunities in MySQL. |
| **14** | Node Express Server | Express REST API Architecture & Middleware | `server.js`, `routes/`, `middleware/`, `data/`, `public/`, `README.md` | Creates the standalone REST API backend with middleware and in-memory CRUD for opportunities. |
| **16** | Full-Stack Capstone | Integrated Full-Stack Student Network Platform (React + Express + MariaDB) | `assignments/16-KBTCOE_Connect_Final_Project/` (`client/`, `server/`, `database/`, `tests/`, `README.md`) | Assembles all 15 previous practical concepts into an end-to-end, decoupled full-stack platform featuring React 18 SPA, Node/Express REST API, MariaDB relational persistence, JWT & scrypt security, 100 passed backend tests, and complete 15-assignment regression verification. |

