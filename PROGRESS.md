# KBTCOE Connect — Practical Progress Tracker

> **Project:** KBTCOE Connect (The Professional Network for KBTCOE Students)  
> **Repository:** `KBTCOE-Connect`  
> **Total Practicals:** 16  
> **Completed:** 16 / 16 (100.00%)  
> **Current Status:** All 16 Practicals Verified and Completed. Full-Stack Capstone Ready for Laboratory Examination.

---

## 1. Practical Execution Matrix

| No. | Assignment Folder | Syllabus Topic | KBTCOE Connect Module | Status | Verified Date | Test Results & Deliverables |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **01** | `01-HTML_Basics` | Core HTML tags, tables, forms | Student Welcome Hub & Bulletin Table | ✅ Completed | 2026-10-14 | **12/12 Automated Checks Passed:** Pure HTML verified (0 CSS, 0 JS), hierarchical headings (`h1`-`h3`), lists (`ul`, `ol`, `dl`), local SVG logo integration, hyperlinks (internal jump anchors `#top`/`#bulletin-table`, external, mailto), opportunity bulletin table (`caption`, `thead`, `tbody`, `tfoot`, `colspan="8"`, `rowspan="2"`), student inquiry form (`fieldset`, `legend`, inputs). Complete README with 6 viva questions. |
| **02** | `02-Semantic_HTML` | HTML5 semantic elements | Profile & Technical Blog Hierarchy | ✅ Completed | 2026-10-14 | **All Structural Checks Passed:** Meaningful semantic structure verified across 10 tags (`header` [11], `nav` [1], `main` [1], `section` [13], `article` [5], `aside` [1], `footer` [4], `figure` [1], `figcaption` [1], `time` [12]). Self-contained articles for student profile, REST API architecture blog with vector figure, Git branching blog, SIH achievement, CodeSprint contest, and demonstration opportunities catalog. Prohibitions verified (0 CSS, 0 JS). Comprehensive README with 6 viva questions. |
| **03** | `03-CSS_Styling` | CSS selectors, Box Model, styling | Design System, Badges & Profile Card Deck | ✅ Completed | 2026-10-14 | **All Automated & Visual Checks Passed:** All 3 CSS insertion methods demonstrated and verified (Inline on `#inline-css-announcement`, Internal in `<style>` block, External via `style.css`). Selectors verified (element: `body`, `h1`, `p`, `table`, `th`, `td`; class: `.card`, `.badge`, `.skill-tag`, `.btn-primary`, `.opportunity-table`, `.site-footer`; ID: `#main-header`, `#portal-nav`, `#student-profile-section`, `#featured-blog`, `#opportunities-section`). CSS Box Model with `border-box`, palette (`#1E3A8A`, `#2563EB`, `#F8FAFC`, `#E2E8F0`), and interactive pseudo-classes (`:hover`, `:active`, `:nth-child`). Headless Chrome visual rendering captured and verified (`screenshot.png`). 0 JavaScript. Comprehensive README with 6 viva questions. |
| **04** | `04-Responsive_Design` | Flexbox, Grid, media queries | Responsive Multi-Device Feed & Grid Reflow | ✅ Completed | 2026-10-14 | **All Multi-Device Checks Passed:** Flexbox verified for header (`.header-flex`), navigation (`.nav-flex`), profile card (`.profile-flex`), stats row (`.stats-flex`), skill tags (`.tags-flex`), and button groups. CSS Grid verified for 3-column desktop layout (`280px 1fr 280px`), tablet 2-column reflow (`260px 1fr`), and mobile 1-column stack (`1fr`). Media queries verified across Mobile (`<640px`), Tablet (`640-1024px`), and Desktop (`>1024px`). Mobile horizontal overflow prevention verified (`.table-responsive` with `overflow-x: auto`). Minimal vanilla JS hamburger toggle verified. Headless Chrome screenshots captured across mobile (`screenshot-mobile.png`), tablet (`screenshot-tablet.png`), and desktop (`screenshot-desktop.png`). Comprehensive README with 6 viva questions. |
| **05** | `05-CSS_Positioning` | Positioning schemes, transforms, modals | Sticky Nav, Floating Action Button, Modal | ✅ Completed | 2026-10-15 | **All 11 Positioning & Property Checks Passed:** All 5 positioning schemes verified (`static` in `.demo-card-static`, `relative` in `.avatar-container` & `.card-relative`, `absolute` in `.status-badge-absolute` & `.ribbon-absolute` & `.modal-close-btn`, `fixed` in `.fab-button` & `.modal-overlay`, `sticky` in `.sticky-nav-wrapper` with `top: 0`). z-index stacking layers verified (100 sticky nav, 500 FAB, 1000 backdrop, 1001 modal box). `overflow-y: auto` verified on `.scrollable-preview-box`. `opacity`, `box-shadow`, `transform` (scale, rotate, translate), and `transition` verified. Accessible modal with ARIA roles and Escape key handler verified. Chrome browser visual rendering verified (`screenshot.png`). Comprehensive README with 8 viva questions. |
| **06** | `06-JavaScript_Basics` | ES6 arrays, filter/map, events | Student Directory & Search Filtering | ✅ Completed | 2026-10-15 | **All Automated & Visual Checks Passed:** 12 student records verified with structured schema (`id`, `studentId`, `name`, `department`, `deptCode`, `year`, `cgpa`, `skills`, `bio`, `achievement`, `isFollowing`). Higher-order array methods verified: `map()` and `new Set()` for distinct branches (7), `reduce()` for unique skills (48) and average CGPA (8.82), `filter()` with combined multi-criteria search (name, skills, bio) and department dropdown, `find()` for in-memory follow/unfollow state toggle. Safe dynamic DOM manipulation verified via `document.createElement`, `textContent`, `classList`, and `appendChild` (zero unsanitized `innerHTML` injection). Friendly empty state verified on non-matching query. Visual rendering verified and screenshot captured via headless Chrome (`screenshot.png`). Comprehensive README with 10 viva questions. |
| **07** | `07-Frontend_Validation` | Configurable RegEx & form validation | Registration Form with Configurable PRN/Email Rules | ✅ Completed | 2026-10-15 | **All Automated & Visual Checks Passed:** Pure validation functions verified across all fields (Full Name length and characters, configurable demonstration Student ID `/^KBT-\d{4}-[A-Z0-9]{2,4}$/i`, sensible email regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, recognized branch and year dropdowns, password complexity >= 8 with letters & digits, cross-field password matching, and mandatory terms checkbox). Intercepted form submit via `preventDefault()`. Accessible UI states verified with `aria-invalid`, `aria-describedby`, and `role="alert"`. Focus shifts to first invalid field on error. Immediate error clearing on `input`/`change`. Safe DOM summary rendered using `textContent` (zero unsafe `innerHTML`). Headless Chrome screenshot verified (`screenshot.png`). Comprehensive README with 10 viva questions. |
| **08** | `08-React_SPA` | React Vite setup, JSX, components | React SPA Shell & Multi-view Routing | ✅ Completed | 2026-10-15 | **All Automated & Build Checks Passed:** Vite + React 18 SPA project scaffolded and built successfully. Functional components created and verified (`Header`, `Navbar`, `Footer`, `StatCard`, `StudentCard`, `BlogCard`, `OpportunityCard`). Client-side view routing implemented via React state (`useState`) across Home, Students, Blogs, and Opportunities with smooth transitions (0 page reloads). Lists mapped over synthetic datasets with stable keys (6 students, 3 blogs, 3 opportunities, 4 metric cards, 4 activities). Props passing verified. Fallback view provided. Production build verified (`dist/` generated in 2.06s with 43 modules, 0 errors). Comprehensive README with 10 viva questions. |
| **09** | `09-React_Concepts` | `useState`, `useEffect`, props | Stateful Post Feed & Filter Tag Deck | ✅ Completed | 2026-10-15 | **All Automated & Build Checks Passed:** React community post feed created with full state management. Controlled form input validated with whitespace trimming (`PostComposer`). Reactive category filtering across 5 categories (All, Technical, Achievements, Events, General) with live pill count badges. Immutable like/unlike toggling with instantaneous reactive statistics updates (total posts, visible posts, total likes, user posts). User post deletion with confirmation guard and sample post protection. Client-side persistence via `useEffect` synchronizing with `localStorage` (lazy initialization, graceful error fallback, and seed reset button). Production build compiled in 2.16s (39 modules, 0 errors). Comprehensive README with 12 viva questions. |
| **10** | `10-Fetch_API_JSON` | Asynchronous Fetch API, JSON | Opportunity Board with Loading & Errors | ✅ Completed | 2026-10-15 | **All 37 Automated & Functional Checks Passed:** Plain HTML5, CSS3, vanilla JS (0 React/backend). Synthetic JSON dataset of 9 opportunity records spanning 4 categories (`Internship`, `Hackathon`, `Competition`, `Workshop`). Asynchronous Fetch engine using `async`/`await`, Promises, explicit `response.ok` check, `response.json()`, and defensive JSON schema validation. Asynchronous UI state machine implementing 5 distinct states: Loading (CSS spinner), Success (card grid), Empty Data, Empty Filter (no matches found), and Error (HTTP 404 simulation with functional Retry button). Concurrent multi-criteria search and category filtering with instant UI reset. Safe DOM construction via `document.createElement` and `textContent` (zero unsafe `innerHTML`). Browser `file://` CORS protocol check with actionable warning alert and local HTTP server guide (`python -m http.server 8000` / `npx.cmd serve . -p 8000`). Comprehensive laboratory manual with 12 in-depth viva voce Q&As. |
| **11** | `11-DOM_Manipulation` | DOM element creation, delegation | Live Like Counter & Comment Thread | ✅ Completed | 2026-10-15 | **All 49 Automated & Functional Checks Passed:** Plain HTML5, CSS3, vanilla JS (0 React/backend). Interactive student networking post card with author metadata, post body, and topic tags. Live toggling Like Counter (24 -> 25 -> 24) with `aria-pressed`, active `.liked` styling, heart-pulse animation, non-negative boundary guard, and real-time counter synchronization across stat bars and toolbar badges. Dynamic comment thread with client-side form validation (rejection of empty/whitespace submissions, character counter `0/400`, inline accessible error banner). Safe dynamic node creation via `document.createElement()` and strict `textContent` text injection (zero `innerHTML` injection, preventing XSS). Comment deletion powered by Event Delegation on `#commentsList` (`e.target.closest()`, `element.remove()`). Conditional empty state rendering when comments reach 0. Clear All Comments with confirmation dialog. 49 automated checks verified. Comprehensive manual with 12 in-depth viva voce Q&As. |
| **12** | `12-PHP_Form_Handling` | PHP `$_POST`, sanitization, session | Registration & Session Auth Portal | ✅ Completed | 2026-10-15 | **All 41 Unit Tests & 4 Live Server Request Checks Passed:** Built with native PHP 8.3.33 (0 React/Node). Complete student registration, login, protected dashboard, and logout workflow. Server-side validation via `filter_var(FILTER_VALIDATE_EMAIL)`, configurable PRN regex (`/^KBT-\d{4}-[A-Z0-9]{2,6}$/i`), whitelist verification for departments and academic years. BCrypt password hashing via `password_hash(PASSWORD_BCRYPT, cost=10)` and timing-attack resistant `password_verify()`. Session security with `session_regenerate_id(true)` preventing session fixation, `HttpOnly` and `SameSite=Lax` cookie flags. Generic error messaging preventing email enumeration. Protected dashboard guarded by `require_auth()` (HTTP 302 redirect). POST/Redirect/GET pattern and flash messaging. Safe HTML escaping via `htmlspecialchars()`. Complete manual with 12 in-depth viva voce Q&As. |
| **13** | `13-PHP_MySQL_CRUD` | PHP PDO, SQL prepared statements | Opportunity Management Portal (CRUD) | ✅ Completed | 2026-10-15 | **All 68 Unit & Live MariaDB Tests Passed:** Complete CRUD portal using PHP 8.3 & MariaDB. Relational schema `kbtcoe_connect_crud` with indexed `opportunities` table (indexes on category, deadline, organization). 6 realistic collegiate seed records. Native PDO prepared statements (zero SQL concatenation). Cryptographic CSRF session tokens (`random_bytes(32)`, `hash_equals()`). XSS defense via `e()` (`htmlspecialchars(..., ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`). Strictly POST-only deletion with confirmation guard. Post/Redirect/Get pattern with flash messages. Dynamic header DB connection status (`🟢 Connected` / `🔴 Disconnected`) with offline resilience. 12 comprehensive viva voce Q&As. |
| **14** | `14-Node_Express_Server` | Express.js, middleware, routing | REST API Gateway (`/api/opportunities`, etc.) | ✅ Completed | 2026-10-15 | **All 60 Unit & Live HTTP Integration Tests Passed:** Standalone Express 4.21.1 REST backend with in-memory store (6 seed opportunities across internship, hackathon, competition, workshop). Endpoints: `GET /` (static test dashboard), `GET /api/health` (uptime/status), `GET /api/opportunities` (read all/filter), `GET /api/opportunities/:id` (read single, 400 invalid ID, 404 missing), `POST /api/opportunities` (201 Created, generated ID, validation errors array 400), `PUT /api/opportunities/:id` (200 update, 404 missing), `DELETE /api/opportunities/:id` (200 delete, 404 missing). Middleware: custom request logger, `express.json()`, `express.static()`, route-level ID validator, `notFound` catch-all, and centralized 4-parameter `errorHandler` safely capturing malformed JSON without exposing stack traces. Interactive test dashboard in `public/`. 12 comprehensive viva voce Q&As. |
| **15** | `15-REST_API_Database` | Node + MySQL (`mysql2`), JWT auth, bcrypt | Authenticated Endpoints & Persistence | ✅ Completed | 2026-10-15 | **All 89 Automated & Live Database Checks Passed:** Full-stack REST service with Express 4.21, MariaDB (`mysql2/promise`), connection pool, and parameterized queries. Schema `kbtcoe_connect_api` with `opportunities`, `users`, and `posts` tables with `ON DELETE CASCADE`. Cryptographic password hashing with Node native `crypto.scrypt` and timing attack protection (`crypto.timingSafeEqual`). Stateless JWT authentication (`jsonwebtoken`) with Bearer token middleware (`authMiddleware`). Complete CRUD on Opportunities, Users/Auth (`/register`, `/login`, `/me`), and Community Posts with author ownership guards (`403 Forbidden` on non-owner edit/delete). Static interactive test dashboard in `public/`. Centralized 4-param error handler capturing malformed JSON (400) without leaking stack traces. Comprehensive manual with 20 sections and 12 viva voce Q&As. |
| **16** | `16-KBTCOE_Connect_Final` | Full-stack capstone integration (React + Node + MariaDB) | Complete Integrated Capstone Platform | ✅ Completed | 2026-10-15 | **All 100 Backend Integration Tests & 15 Regression Checks Passed + Vite Build Succeeded:** End-to-end full-stack networking platform integrating React 18, Vite, Node.js, Express, and MariaDB (`kbtcoe_connect_final`). Relational schema with 6 tables (`users`, `opportunities`, `posts`, `comments`, `likes`, `achievements`) enforcing `ON DELETE CASCADE` and duplicate like prevention (`uk_post_user_like`). Cryptographic salted scrypt hashing and timing attack resistance (`crypto.timingSafeEqual`). Stateless JWT authentication and role-based / author ownership authorization (`403 Forbidden` on non-owner mutation). Interactive dashboard with live dynamic metrics. Responsive student directory, public portfolios, community discussion feed with live like toggle & comment thread, student achievements showcase, and campus opportunities board with deadline tracking. React production bundle compiled in 2.22s (49 modules, 0 errors). Comprehensive manual with 21 sections and 16 viva voce Q&As. |

---

## 2. Activity & Milestone Log

- **2026-10-14:**
  - Workspace inspection completed: Workspace is clean, Node.js (v24.20.0), NPM (11.19.0), and winget (v1.29.380) verified.
  - Primary directory structure created (`assignments/`, `frontend/`, `backend/`, `php-practicals/`, `database/`, `docs/`).
  - Created 16 practical subdirectories under `assignments/`.
  - Authored Master Development Plan (`DEVELOPMENT_PLAN.md`), Repository README (`README.md`), Architecture Document (`docs/architecture.md`), and Assignment Mapping Matrix (`docs/assignment-mapping.md`).
  - Refined Assignment 04 (Flexbox, Grid, Media Queries), Assignment 05 (Positioning Schemes & CSS Properties), and Assignment 07 (Configurable Institutional Validation) across all documentation.
  - **Assignment 01 (`01-HTML_Basics`) Completed:**
    - Authored `assignments/01-HTML_Basics/index.html` featuring KBTCOE branding, department catalog, student profile spotlight with skills and achievements, official opportunity bulletin table with cell merging (`colspan`/`rowspan`), and student submission form.
    - Added crisp local vector logo `assignments/01-HTML_Basics/kbtcoe-logo.svg`.
    - Enforced strict HTML-only constraints (0 inline or external CSS, 0 JS).
    - Passed 12/12 automated structural and syntax validation tests.
    - Documented `assignments/01-HTML_Basics/README.md` with detailed code breakdown and 6 viva questions and answers.
  - **Assignment 02 (`02-Semantic_HTML`) Completed:**
    - Re-architected KBTCOE Connect into a semantic HTML5 portal using landmark tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`, `<time>`).
    - Organized the page into 5 core content areas: Student Profile Showcase, Technical Blog Articles, Student Achievements & Competitions, Demonstrative Opportunities Bulletin, and Campus Notices.
    - Added high-definition local vector diagram `rest-architecture.svg` and paired with `<figure>` and `<figcaption>`.
    - Integrated machine-readable `<time datetime="...">` tags across publication dates and deadlines.
    - Preserved HTML-only constraint (0 inline/external CSS, 0 JS).
    - Passed all 10 semantic tag verification checks and asset path checks.
    - Documented `assignments/02-Semantic_HTML/README.md` with full code explanation and 6 viva questions and answers.
  - **Assignment 03 (`03-CSS_Styling`) Completed:**
    - Established KBTCOE Connect visual design system with primary navy (`#1E3A8A`), secondary blue (`#2563EB`), neutral surface (`#F8FAFC`), and borders (`#E2E8F0`).
    - Demonstrated all 3 CSS inclusion methods: External stylesheet (`style.css`), Internal stylesheet (`<style>` in `<head>`), and Inline CSS on `#inline-css-announcement`.
    - Implemented element selectors, class selectors (`.card`, `.badge`, `.btn-primary`, `.skill-tag`, etc.), and ID selectors (`#main-header`, `#portal-nav`, `#student-profile-section`, `#featured-blog`, `#opportunities-section`).
    - Implemented CSS Box Model with `box-sizing: border-box`, margins, paddings, shadows, and interactive pseudo-classes (`:hover`, `:active`, `:nth-child`).
    - Verified visual rendering via real headless Google Chrome browser and captured full visual screenshot `assignments/03-CSS_Styling/screenshot.png`.
    - Documented `assignments/03-CSS_Styling/README.md` with complete selector guide, box model diagram, and 6 viva questions and answers.
  - **Assignment 04 (`04-Responsive_Design`) Completed:**
    - Developed a responsive multi-device student networking dashboard using CSS Flexbox, CSS Grid, and media queries across Mobile (`< 640px`), Tablet (`640px – 1024px`), and Desktop (`> 1024px`).
    - Demonstrated Flexbox across header (`.header-flex`), navigation (`.nav-flex`), profile layout (`.profile-flex`), metric counters (`.stats-flex`), skill tags (`.tags-flex`), button groups, and footer (`.footer-flex`).
    - Demonstrated CSS Grid for 3-column desktop layout (`280px 1fr 280px`), tablet 2-column reflow (`260px 1fr`), and mobile 1-column vertical stack (`1fr`).
    - Implemented mobile horizontal overflow safeguards with fluid containers and `.table-responsive` (`overflow-x: auto;`).
    - Added minimal vanilla JavaScript mobile hamburger toggle button with accessible ARIA states.
    - Verified visual rendering across 3 viewports and captured screenshots via headless Google Chrome (`screenshot-mobile.png`, `screenshot-tablet.png`, `screenshot-desktop.png`).
    - Authored `assignments/04-Responsive_Design/README.md` with full breakpoint analysis, Flexbox/Grid breakdown, and 6 viva questions and answers.
  - **Assignment 05 (`05-CSS_Positioning`) Completed:**
    - Developed KBTCOE Connect Positioning Laboratory demonstrating all 5 positioning schemes: `static` in `.demo-card-static`, `relative` in `.card-relative` & `.avatar-container`, `absolute` in `.status-badge-absolute` & `.ribbon-absolute` & `.modal-close-btn`, `fixed` in `.fab-button` & `.modal-overlay`, and `sticky` in `.sticky-nav-wrapper`.
    - Implemented a 6-layer `z-index` stacking context hierarchy (1 static -> 5 dot -> 10 ribbon -> 100 sticky nav -> 500 fixed FAB -> 1000 backdrop -> 1001 modal dialog).
    - Demonstrated `overflow-y: auto` with custom WebKit scrollbars on `.scrollable-preview-box`.
    - Added micro-interactions with `transform` (rotate, translateY, scale), multi-layer `box-shadow`, and `transition`.
    - Implemented accessible modal open/close interactions via lightweight vanilla JS (button click, backdrop click, Escape key dismiss).
    - Verified visual rendering via headless Google Chrome (`screenshot.png`).
    - Authored `assignments/05-CSS_Positioning/README.md` with property guide, stacking diagram, and 8 viva questions and answers.
  - **Assignment 06 (`06-JavaScript_Basics`) Completed:**
    - Developed KBTCOE Connect Student Directory & Peer Network interactive module in `assignments/06-JavaScript_Basics/`.
    - Synthesized a dataset of 12 realistic engineering student profiles across 7 college engineering departments.
    - Demonstrated ES6 `let` and `const`, data types (strings, numbers, booleans, arrays, objects), strict comparison (`===`), logical operators (`&&`, `||`, `!`), and arrow functions.
    - Implemented statistical dashboard calculating total profiles (12), matching profiles (12), active branches count (7), and unique skills count (48) via `map()`, `reduce()`, and `Set`.
    - Implemented combined live search and branch filter logic that operate concurrently.
    - Built interactive "Follow" / "Following" button state toggle with instant UI updates and session state persistence.
    - Implemented safe DOM rendering pipeline using `createElement`, `textContent`, and `appendChild` to eliminate XSS vectors.
    - Built friendly empty state when no students match active search criteria with one-click reset action.
    - Verified all logic and DOM hooks through automated test suite (`scratch/test_assignment_06.js`).
    - Verified visual layout and captured headless Google Chrome screenshot (`screenshot.png`).
    - Authored comprehensive laboratory manual (`assignments/06-JavaScript_Basics/README.md`) featuring 10 in-depth viva voce questions and answers.
  - **Assignment 07 (`07-Frontend_Validation`) Completed:**
    - Developed KBTCOE Connect Student Account Registration Module in `assignments/07-Frontend_Validation/`.
    - Implemented modular, pure validation functions with descriptive return interfaces for Full Name, Student ID, Email, Department, Year, Password, Confirm Password, and Terms Agreement.
    - Configured demonstration format for Student ID (`/^KBT-\d{4}-[A-Z0-9]{2,4}$/i`) and sensible email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`) without assuming rigid institutional PRN formats.
    - Implemented password complexity checks and strict relational matching (`password === confirmPassword`) without exposing or logging credentials.
    - Integrated accessible UI feedback: `novalidate` on form, `aria-invalid`, `aria-describedby` linking to error spans and format hints, and `role="alert"` for assistive announcements.
    - Added automated focus management to shift cursor focus to the first invalid field upon rejected submission.
    - Implemented instant error clearing on keystroke (`input`) and selection changes (`change`).
    - Built accessible post-validation success card displaying safe, sanitized summary preview generated strictly via `textContent` (zero `innerHTML` injection).
    - Added explicit educational disclaimers stating that client-side validation is a UX feature rather than a security boundary, and that server-side validation remains mandatory.
    - Verified all validation functions, HTML hooks, and ARIA roles via automated test suite (`scratch/test_assignment_07.js`).
    - Verified visual rendering and captured headless Google Chrome screenshot (`screenshot.png`).
    - Authored comprehensive laboratory manual (`assignments/07-Frontend_Validation/README.md`) featuring theory, security analysis, execution matrix, and 10 viva voce Q&As.
  - **Assignment 08 (`08-React_SPA`) Completed:**
    - Scaffolded modern React 18 Single-Page Application (SPA) using Vite in `assignments/08-React_SPA/`.
    - Implemented modular component architecture with functional components: `Header`, `Navbar`, `Footer`, `StatCard`, `StudentCard`, `BlogCard`, and `OpportunityCard`.
    - Implemented client-side SPA navigation powered by React component state (`useState`) without full browser reloads.
    - Built four distinct application views: `HomeView` (hero banner, 4 metric cards, recent highlights), `StudentsView` (6 student cards across engineering branches), `BlogsView` (3 technical articles), and `OpportunitiesView` (3 internships, competitions, and grants).
    - Passed data via read-only props and rendered arrays using `.map()` with stable unique keys.
    - Configured responsive styling in `src/index.css` following KBTCOE design system with accessible focus outlines and active navigation indicators.
    - Installed dependencies via `npm.cmd install` (63 packages, 0 errors).
    - Verified production build via `npm.cmd run build` (compiled 43 modules into `dist/` in 2.06s with 0 errors).
    - Authored comprehensive laboratory manual (`assignments/08-React_SPA/README.md`) covering React/SPA theory, JSX, `createRoot`, list reconciliation, and 10 viva voce Q&As.
  - **Assignment 09 (`09-React_Concepts`) Completed:**
    - Scaffolded standalone interactive Community Post Feed module using React 18 & Vite in `assignments/09-React_Concepts/`.
    - Synthesized initial seed dataset of 6 community posts across Technical, Achievements, Events, and General categories (`mockPosts.js`).
    - Implemented stateful post management via `useState` and synchronized updates with browser `localStorage` using `useEffect` with lazy state initialization.
    - Built controlled form component `PostComposer` with multi-field inputs, whitespace trimming validation, character counter, and instant visual alerts.
    - Implemented immutable like/unlike toggling with instantaneous reactive statistics updates (total posts, visible posts, total likes, user posts).
    - Added user-created post deletion guarded by browser confirmation, while protecting initial seed demonstration posts.
    - Implemented reactive topic filtering across 5 categories (`CategoryFilter`) with dynamic count badges and empty-state fallback (`PostFeed`).
    - Verified production build via `npm.cmd run build` (39 modules compiled in 2.16s, 0 errors).
    - Executed automated structural and functional test suite (`scratch/test_assignment_09.js`).
  - **Assignment 10 (`10-Fetch_API_JSON`) Completed:**
    - Developed KBTCOE Connect Campus Opportunity Explorer in `assignments/10-Fetch_API_JSON/`.
    - Synthesized a realistic dataset of 9 collegiate engineering opportunities (`data/opportunities.json`) across Internships, Hackathons, Competitions, and Workshops.
    - Implemented asynchronous data retrieval using native `window.fetch()` with `async`/`await` and Promises.
    - Enforced mandatory verification of `response.ok` (HTTP status 200–299) to catch non-throwing HTTP errors such as 404 and 500.
    - Implemented defensive data validation (`validateOpportunitySchema`) ensuring array integrity and required field presence.
    - Engineered a 5-state asynchronous UI state machine: Loading (CSS spinner), Success (responsive grid), Empty Data (`[]`), Empty Filter (no match), and Error state.
    - Added interactive error handling with a functional "🔄 Retry Fetching" recovery mechanism and a "⚡ Simulate Error" test trigger.
    - Implemented live keyword search and opportunity type filtering that operate concurrently.
    - Enforced safe DOM rendering using `document.createElement()` and `textContent` to prevent Cross-Site Scripting (XSS).
    - Integrated automated browser protocol inspection to alert users when running on `file://` and provide local HTTP server instructions (`python -m http.server 8000` / `npx.cmd serve . -p 8000`).
    - Verified all 37 structural, schema, logic, and previous-assignment integrity tests (`scratch/test_assignment_10.js`).
  - **Assignment 11 (`11-DOM_Manipulation`) Completed:**
    - Developed KBTCOE Connect Live Like Counter & Dynamic Comment Thread in `assignments/11-DOM_Manipulation/`.
    - Built accessible, responsive student post card featuring Sanket Patil's Smart India Hackathon (SIH 2026) achievement.
    - Implemented state-synchronized Like Counter toggling (`isLiked = !isLiked`) with real-time DOM counter updates (`#likeCountBadge`, `#statLikeCount`), non-negative guard, and active heart-pulse CSS animation.
    - Implemented dynamic Comment Composer form with whitespace trimming, empty submission rejection, inline alert banner (`role="alert"`), and character counter (`0 / 400`).
    - Enforced strict safe text rendering using `element.textContent` for all user-entered comments, completely preventing Cross-Site Scripting (XSS).
    - Demonstrated dynamic node instantiation (`document.createElement()`) and thread insertion (`prepend()`).
    - Implemented comment deletion using Event Delegation on `#commentsList` (`e.target.closest(".btn-delete-comment")`, `node.remove()`), eliminating redundant listeners and preventing memory leaks.
    - Added conditional empty state rendering (*"No comments yet"*) triggered when the comment count reaches 0.
    - Added "Clear All Comments" button with `window.confirm()` confirmation dialog.
    - Added accessible status announcement banner (`#actionStatus`, `role="status"`, `aria-live="polite"`).
    - Verified all 49 structural, logic, security, and previous-assignment integrity tests (`scratch/test_assignment_11.js`).
  - **Assignment 12 (`12-PHP_Form_Handling`) Completed:**
    - Verified and configured local PHP 8.3 runtime (`PHP 8.3.33`).
    - Developed KBTCOE Connect Student Registration & Session Authentication Portal in `assignments/12-PHP_Form_Handling/`.
    - Implemented server-side form handling and validation in `register.php` checking field presence, email formatting (`filter_var()`), configurable PRN pattern (`/^KBT-\d{4}-[A-Z0-9]{2,6}$/i`), password length (>= 8 chars), password confirmation match, and department/year whitelists.
    - Implemented secure password cryptography with native `password_hash(PASSWORD_BCRYPT)` and `password_verify()`, ensuring zero plaintext credentials.
    - Implemented login controller (`login.php`) with generic error messages preventing user enumeration and session ID regeneration (`session_regenerate_id(true)`) to mitigate session fixation attacks.
    - Implemented protected student dashboard (`dashboard.php`) guarded by `require_auth()` that intercepts unauthenticated requests and redirects to `login.php`.
    - Implemented complete session termination (`logout.php`) clearing `$_SESSION`, expiring session cookies, and invoking `session_destroy()`.
    - Enforced the POST/Redirect/GET pattern and session flash messages (`set_flash()`, `get_flash()`).
    - Enforced safe HTML rendering across all templates using `e()` helper based on `htmlspecialchars(..., ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`.
    - Passed all 8 PHP syntax lint checks (`php -l`), all 41 automated functional unit tests (`scratch/test_assignment_12.php`), and verified live HTTP responses over the PHP CLI web server (`scratch/test_php_server.js`).
  - **Assignment 13 (`13-PHP_MySQL_CRUD`) Completed:**
    - Configured local MariaDB Server (13.0.2) running on port 3306 and verified PHP 8.3 PDO with native `pdo_mysql` extension.
    - Designed relational database schema `kbtcoe_connect_crud` with indexed `opportunities` table (B-Tree indexes on `category`, `deadline`, and `organization`) in `database/schema.sql`.
    - Synthesized 6 realistic collegiate opportunities in `database/seed.sql` across Internships, Hackathons, Competitions, and Workshops.
    - Implemented secure, fault-tolerant PDO connection factory in `config/database.php` with `PDO::ERRMODE_EXCEPTION`, `PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`, and disabled emulated prepares (`PDO::ATTR_EMULATE_PREPARES => false`).
    - Engineered security and helper layer in `includes/functions.php`:
      - Complete XSS output encoding via `e()` using `htmlspecialchars(..., ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`.
      - Cryptographic CSRF session token generation (`random_bytes(32)`) and constant-time validation (`hash_equals()`).
      - Whitelist category validation (`is_valid_category()`), URL validation (`validate_url()`), and ISO date validation (`validate_date()`).
      - Flash messaging system (`set_flash()`, `get_flash()`) and safe redirect helper (`redirect()`).
      - Parameterized CRUD methods (`get_all_opportunities()`, `get_opportunity_by_id()`, `create_opportunity()`, `update_opportunity()`, `delete_opportunity()`) with zero SQL string concatenation.
    - Built responsive frontend views matching KBTCOE design system:
      - `index.php`: Opportunity directory with live keyword search, category filter dropdown, active results counter, card grid, and empty-state fallback.
      - `view.php`: Comprehensive detail view with metadata grid, multiline description/eligibility, and external application link.
      - `create.php`: Accessible opportunity creation form with multi-field server-side validation, sticky inputs, and CSRF token.
      - `edit.php`: Pre-populated edit form with record retrieval by ID, change validation, and update execution.
      - `delete.php`: Strictly POST-only deletion workflow with confirmation prompt on GET and CSRF token verification.
    - Implemented database resilience: if MySQL service is offline, application degrades gracefully with a `🔴 MySQL Disconnected` header badge and friendly guidance without fatal errors.
    - Passed all 11 PHP syntax lint checks (`php -l`), all 68 automated unit & live MariaDB CRUD integration tests (`test_assignment_13.php`), and verified integrity of all 12 prior assignments.
    - Authored university-grade laboratory manual (`assignments/13-PHP_MySQL_CRUD/README.md`) featuring 18 sections including architecture diagrams, SQLi/CSRF/XSS analysis, and 12 in-depth viva voce Q&As.
  - **Assignment 14 (`14-Node_Express_Server`) Completed:**
    - Initialized independent Node.js & Express REST application in `assignments/14-Node_Express_Server/` using Express `^4.21.1`.
    - Implemented in-memory opportunity repository (`data/opportunities.js`) containing 6 rich fictional collegiate seed opportunities spanning all 4 categories (`internship`, `hackathon`, `competition`, `workshop`), with helper methods (`getAll`, `getById`, `create`, `update`, `remove`, `reset`).
    - Engineered modular REST endpoints (`routes/opportunities.js`):
      - `GET /api/opportunities`: Returns all records with support for query filters (`?q=...`, `?category=...`).
      - `GET /api/opportunities/:id`: Retrieves single record by numeric ID; returns 400 for invalid/non-numeric format, 404 for missing records.
      - `POST /api/opportunities`: Creates opportunity with server-side field validation, category whitelist, length restrictions, and server-generated unique IDs (returns HTTP 201 Created).
      - `PUT /api/opportunities/:id`: Updates existing opportunity with validation; returns 404 for non-existent IDs.
      - `DELETE /api/opportunities/:id`: Removes opportunity from memory and returns deleted confirmation; returns 404 for missing records.
    - Implemented robust middleware pipeline (`server.js`):
      - Custom request logger outputting timestamp, method, URL, status code, and duration in ms.
      - Built-in body parsing via `express.json()` and `express.urlencoded()`.
      - Built-in static asset serving via `express.static()` pointing to `public/`.
      - Route-level parameter validation middleware `validateIdParam` for `:id` parameter safety.
      - Catch-all 404 middleware (`middleware/notFound.js`) for unmapped routes with suggested endpoints.
      - Centralized 4-parameter error handler (`middleware/errorHandler.js`) that captures JSON parsing syntax errors (HTTP 400) and unexpected exceptions (HTTP 500) **without exposing stack traces**.
    - Designed interactive browser dashboard in `public/` (`index.html`, `style.css`, `app.js`, `kbtcoe-logo.svg`) following KBTCOE design system with health status pill, live JSON response inspector console, opportunity creation form, and card deletion controls.
    - Automated test suite (`test.js`) executed with 60 / 60 tests passed covering file existence, in-memory store logic, live HTTP server endpoints on dynamic ports, and integrity verification of all 13 prior assignments.
  - **Assignment 15 (`15-REST_API_Database`) Completed:**
    - Initialized independent Node.js, Express, and MySQL/MariaDB persistent REST service in `assignments/15-REST_API_Database/`.
    - Created relational schema `kbtcoe_connect_api` (`database/schema.sql`) with tables `opportunities`, `users`, and `posts` with foreign key constraints (`ON DELETE CASCADE`), indexes, and UTF-8 encoding.
    - Populated realistic seed dataset (`database/seed.sql`) containing 2 users (hashed passwords), 6 opportunities across 4 categories (`internship`, `hackathon`, `competition`, `workshop`), and 4 community posts.
    - Configured enterprise connection pooling using `mysql2/promise` (`config/database.js`) with health verification (`checkConnection()`).
    - Implemented cryptographic password hashing using Node.js native `crypto.scrypt` with 16-byte random salts and constant-time verification (`crypto.timingSafeEqual`) preventing timing attacks.
    - Implemented stateless JSON Web Token (JWT) issuance and validation (`jsonwebtoken`), with `authMiddleware.js` checking Bearer tokens on protected routes.
    - Engineered modular RESTful controllers and routes:
      - Opportunities: `GET /api/opportunities` (with category and query filters), `GET /api/opportunities/:id` (400 on non-numeric, 404 on missing), `POST /api/opportunities` (201 Created), `PUT /api/opportunities/:id` (200), `DELETE /api/opportunities/:id` (200).
      - Authentication: `POST /api/auth/register` (201 with JWT, 409 duplicate email conflict), `POST /api/auth/login` (200 with JWT, 401 on invalid credentials with constant-time dummy verify), `GET /api/auth/me` (200 with Bearer token, 401 without token).
      - Community Posts: `GET /api/posts` (multi-table SQL join with author name and branch), `POST /api/posts` (requires Bearer token, user ID derived strictly from token), `PUT /api/posts/:id` (author ownership verification, 403 Forbidden on non-owner), `DELETE /api/posts/:id` (author ownership verification, 403 Forbidden on non-owner).
    - Implemented middleware pipeline: sanitized request logger (stripping Authorization tokens and passwords), `express.json()`, `express.static()` for dashboard, `notFound.js` catch-all listing available endpoints, and centralized `errorHandler.js` safely returning 400 for malformed JSON without leaking stack traces.
    - Created interactive browser testing dashboard in `public/` (`index.html`, `style.css`, `app.js`, `kbtcoe-logo.svg`) supporting health heartbeat, one-click demo student logins, JWT storage, opportunity explorer/creation, and community post feed with dynamic ownership-aware Edit/Delete actions.
    - Executed automated integration test suite (`test.js`) with **89 / 89 checks passed** covering deliverables, database connectivity, full HTTP REST CRUD lifecycle, JWT auth, ownership enforcement (403 Forbidden), error handling, and preservation of all 14 prior assignments.
  - **Assignment 16 (`16-KBTCOE_Connect_Final_Project`) Completed:**
    - Delivered the complete, integrated full-stack capstone platform in `assignments/16-KBTCOE_Connect_Final_Project/`.
    - Initialized dedicated relational database `kbtcoe_connect_final` with 6 relational tables (`users`, `opportunities`, `posts`, `comments`, `likes`, `achievements`) enforcing `ON DELETE CASCADE` and duplicate like prevention (`uk_post_user_like`).
    - Populated realistic seed dataset (`database/seed.sql`) containing 5 users (1 admin + 4 students), 6 opportunities, 5 posts, 6 comments, 8 likes, and 6 verified achievements.
    - Engineered robust Node/Express REST API in `server/` featuring connection pooling (`mysql2/promise`), cryptographic salted scrypt hashing, constant-time verification (`crypto.timingSafeEqual`), stateless JWT Bearer token guards (`authMiddleware.js`), sanitized logging, and centralized error handling (no leaked stack traces).
    - Built comprehensive RESTful controllers and routes:
      - Health: `GET /api/health`
      - Dashboard: `GET /api/dashboard/stats` (dynamic live database counts & recent previews)
      - Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
      - Students & Profiles: `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/profile`
      - Community Posts: `GET /api/posts`, `GET /api/posts/:id`, `POST /api/posts`, `PUT /api/posts/:id`, `DELETE /api/posts/:id` (with strict author ownership guards returning 403 Forbidden on non-owner mutations)
      - Discussion Comments: `GET /api/posts/:id/comments`, `POST /api/posts/:id/comments`, `DELETE /api/comments/:id` (ownership guarded)
      - Likes: `POST /api/posts/:id/like` (optimistic toggle with duplicate prevention)
      - Achievements: `GET /api/achievements`, `GET /api/achievements/:id`, `POST /api/achievements`, `PUT /api/achievements/:id`, `DELETE /api/achievements/:id` (ownership guarded)
      - Opportunities: `GET /api/opportunities`, `GET /api/opportunities/:id`, `POST /api/opportunities`, `PUT /api/opportunities/:id`, `DELETE /api/opportunities/:id` (creator/admin guarded)
    - Developed modern React 18 Single-Page Application with Vite in `client/` featuring:
      - Global `AuthContext` with JWT session persistence
      - Centralized API client service (`api/client.js`)
      - Ten responsive page views: Dashboard, Feed, Post Detail, Student Directory, Public Portfolio, Achievements Showcase, Opportunities Explorer, Profile Settings, Login, Register
      - Institutional design system matching KBTCOE palette (`#1E3A8A`, `#2563EB`, `#F8FAFC`, `#E2E8F0`)
      - Vite production build verified (`npm.cmd run build` transformed 49 modules in 2.22s, 0 errors).
    - Automated test suites executed:
      - Backend Integration Tests (`tests/backend.test.js`): **100 / 100 passed** covering all endpoints, authentication, ownership boundaries, and MariaDB constraints.
      - Academic Regression Tests (`tests/regression.test.js`): **15 / 15 passed** confirming Assignments 01–15 are completely preserved and untouched.
      - Assignment 15 re-verification: **89 / 89 passed**.
    - Authored university-grade laboratory manual (`README.md`) featuring 21 detailed sections, Mermaid architecture and ER diagrams, and **16 in-depth viva voce examination questions with answers**.
  - **ALL 16 PRACTICALS COMPLETED, VERIFIED, AND DOCUMENTED.**

---

## 3. Verification Protocol

Before any practical is marked as **✅ Completed**:
1. Complete source code must reside inside `assignments/<Practical_Name>/`.
2. Dedicated `README.md` must be present with:
   - Aim & Objectives.
   - Technologies used.
   - Code explanation.
   - Step-by-step instructions on how to run.
   - Expected output.
   - Concepts demonstrated.
   - Minimum 5 viva questions with thorough answers.
3. The code must be executed and tested via documented commands.
4. Actual test outputs and verification notes must be recorded in this tracker.
5. Integration pathway into `frontend/`, `backend/`, or `database/` must be noted.
