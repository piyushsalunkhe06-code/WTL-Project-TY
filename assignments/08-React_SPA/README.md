# Assignment 08: React Single-Page Application (SPA) Shell

**Course:** Web Technology Laboratory / Full-Stack Web Development  
**Institution:** MVPS's KBT College of Engineering (KBTCOE), Nashik  
**Academic Year:** 2025–2026  
**Module:** Assignment 08 (`08-React_SPA`)  
**Platform Track:** KBTCOE Connect — The Professional Network for KBTCOE Students  

---

## 1. Aim

To design, develop, and verify an independently runnable **React Single-Page Application (SPA) Architectural Shell** for **KBTCOE Connect** using Vite, React 18, JSX, and reusable functional components, demonstrating component composition, props passing, unidirectional data flow, list rendering with stable keys, client-side view navigation without full-page reloads, and responsive layout design.

---

## 2. Learning Objectives

By completing this assignment, students will be able to:
1. Explain the architectural differences between traditional Multi-Page Applications (MPAs) and Single-Page Applications (SPAs).
2. Understand the declarative programming paradigm of React, the Virtual DOM, and the JSX syntax extension.
3. Construct modular, reusable functional components and compose them into an application tree.
4. Mount React applications using the React 18 `createRoot` API.
5. Pass data from parent components to child components via read-only `props`.
6. Implement conditional rendering to toggle UI views dynamically based on component state (`useState`).
7. Render collections of data using `Array.prototype.map()` and assign stable `key` attributes to optimize React reconciliation.
8. Build a multi-view application shell that transitions smoothly across navigation tabs without triggering browser network requests or full-page refreshes.

---

## 3. Theoretical Background

### 3.1 What is React and Why is it Used?

**React** is an open-source, component-based front-end JavaScript library developed by Meta for building dynamic user interfaces. Unlike imperative DOM manipulation (demonstrated in Assignments 06 and 07 using `document.createElement` and `appendChild`), React uses a **declarative model**: developers describe what the UI *should look like* for any given state, and React automatically updates the browser DOM when that state changes.

Key advantages of React include:
- **Virtual DOM (VDOM):** An in-memory representation of real DOM elements. When state changes occur, React performs a "diffing" algorithm against the previous VDOM tree and applies only the minimum necessary mutations to the real DOM (reconciliation), vastly improving performance.
- **Component-Based Architecture:** Applications are broken down into self-contained, reusable building blocks (`Header`, `Navbar`, `StudentCard`, `StatCard`, etc.), fostering maintainability and separation of concerns.
- **Unidirectional Data Flow:** Data flows strictly downwards from parent to child components via props, making data tracking predictable and debugging straightforward.

---

### 3.2 Single-Page Application (SPA) Concept

In a traditional **Multi-Page Application (MPA)**:
1. Clicking a navigation link sends a full HTTP `GET` request to the server.
2. The server renders and returns an entire new HTML page.
3. The browser flushes its memory, re-downloads stylesheets, scripts, and images, and renders the new document.
4. This results in noticeable screen flicker, latency, and redundant network bandwidth.

In a **Single-Page Application (SPA)**:
1. The browser requests `index.html`, JavaScript bundles, and styles once on initial load.
2. Subsequent view transitions (e.g., navigating from *Home* to *Student Directory*) are intercepted on the client side.
3. React swaps the visible component tree conditionally based on memory state (`currentView`).
4. View transitions occur instantaneously without a full-page browser reload, creating a seamless, desktop-application-like user experience.

---

### 3.3 JSX Syntax

**JSX (JavaScript XML)** is a syntax extension for JavaScript that allows developers to write HTML-like markup directly within JavaScript files:

```jsx
// Example JSX functional component
function WelcomeBadge({ name, department }) {
  return (
    <div className="welcome-card">
      <h3>Welcome, {name}!</h3>
      <p>Department: {department}</p>
    </div>
  );
}
```

**Key Differences between JSX and HTML:**
- Class attribute is written as `className` (`class` is a reserved keyword in JS).
- Inline styles are passed as JavaScript objects: `style={{ color: "#1E3A8A", fontSize: "1.2rem" }}`.
- JavaScript expressions are embedded within single curly braces `{expression}`.
- Every JSX element must return a single root element or React Fragment (`<>...</>`).
- Tags must be explicitly closed (e.g., `<img />`, `<br />`).

Vite transpile JSX into standard `React.createElement()` function calls during build time.

---

### 3.4 Functional Components & Props

Functional components are pure JavaScript functions that accept an arbitrary input object called **`props`** and return React elements (JSX):

```jsx
// Reusable StudentCard component receiving props
export default function StudentCard({ student }) {
  const { name, department, year, skills } = student;
  return (
    <article className="student-card">
      <h3>{name}</h3>
      <p>{year} • {department}</p>
      <div className="skills-wrap">
        {skills.map((skill, index) => (
          <span key={index} className="skill-pill">{skill}</span>
        ))}
      </div>
    </article>
  );
}
```

Props are **immutable (read-only)**. A component must never modify its own props.

---

### 3.5 React 18 `createRoot`

Prior to React 18, React applications were mounted using `ReactDOM.render()`. React 18 introduced the modern `createRoot` API from `react-dom/client`:

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`createRoot` enables concurrent rendering features, automatic batching of state updates, and smoother transitions under heavy rendering loads.

---

### 3.6 List Rendering & Reconciliation Keys

When rendering lists from data arrays, developers use `Array.prototype.map()`:

```jsx
{studentsData.map((student) => (
  <StudentCard key={student.id} student={student} />
))}
```

> [!IMPORTANT]
> **Why are stable keys essential?**  
> React uses the `key` prop to identify which items in a list have changed, been added, or been removed. Without stable unique keys (e.g. `student.id`), React cannot efficiently match Virtual DOM nodes during reconciliation, resulting in component re-mounting, loss of internal state, and console warnings.

---

### 3.7 Client-Side Navigation State

In this foundational assignment, navigation between application views is achieved using React component state (`useState`) in `App.jsx`:

```jsx
const [currentView, setCurrentView] = useState('home');

return (
  <div className="app-shell">
    <Header />
    <Navbar currentView={currentView} onNavigate={setCurrentView} />
    <main>
      {currentView === 'home' && <HomeView onNavigate={setCurrentView} />}
      {currentView === 'students' && <StudentsView />}
      {currentView === 'blogs' && <BlogsView />}
      {currentView === 'opportunities' && <OpportunitiesView />}
    </main>
    <Footer />
  </div>
);
```

When a user clicks a button in `Navbar`, `onNavigate('students')` updates `currentView`. React triggers a re-render of `App`, unmounting the previous view and mounting `StudentsView` with zero network overhead.

---

## 4. Project Folder Structure

```
assignments/08-React_SPA/
├── index.html              # HTML shell containing <div id="root">
├── package.json            # Vite & React dependencies and build scripts
├── vite.config.js          # Vite build and plugin configuration
├── kbtcoe-logo.svg         # Official college platform branding emblem
├── README.md               # Laboratory documentation and viva voce guide
├── public/                 # Static assets served at root
│   └── kbtcoe-logo.svg     # Public vector branding
└── src/
    ├── main.jsx            # React 18 createRoot mount entry point
    ├── App.jsx             # Top-level application shell and view state manager
    ├── index.css           # Global stylesheet conforming to KBTCOE design system
    ├── data/
    │   └── mockData.js     # Synthetic datasets for stats, students, blogs, and opportunities
    ├── components/
    │   ├── Header.jsx      # Global header with logo and lab badge
    │   ├── Navbar.jsx      # Navigation tab bar with active indicator
    │   ├── StatCard.jsx    # Reusable metric card
    │   ├── StudentCard.jsx # Reusable student profile card
    │   ├── BlogCard.jsx    # Reusable technical blog card
    │   ├── OpportunityCard.jsx # Reusable internship/competition card
    │   └── Footer.jsx      # Institutional copyright and SPA metadata
    └── pages/
        ├── HomeView.jsx    # Dashboard view with hero, stats, and campus activity
        ├── StudentsView.jsx# Student directory view mapping 6 student cards
        ├── BlogsView.jsx   # Technical articles view mapping 3 blog cards
        └── OpportunitiesView.jsx # Campus opportunities view mapping 3 cards
```

---

## 5. Prerequisites & Local Installation

### 5.1 Prerequisites
- **Node.js:** v18.0.0 or higher (Current environment: `v24.20.0`)
- **NPM:** v9.0.0 or higher (Current environment: `11.19.0`)
- Modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge)

### 5.2 Installation Steps

Open PowerShell or Command Prompt, navigate to the Assignment 08 directory, and install dependencies:

```powershell
cd "c:\Users\administrator.FABEXENG\Desktop\Projecy\assignments\08-React_SPA"

# Note on Windows PowerShell: If script execution policies block `npm`, run `npm.cmd`:
npm.cmd install
```

### 5.3 Starting the Development Server

To launch the local Vite hot-reloading development server:

```powershell
npm.cmd run dev
```

The terminal will display the local preview URL:
```text
  VITE v5.4.2  ready in 280 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open `http://localhost:3000/` in your browser.

### 5.4 Production Build & Local Preview

To verify that the application compiles into optimized static assets:

```powershell
# Compile production bundle into dist/
npm.cmd run build

# Preview the production build locally
npm.cmd run preview
```

---

## 6. Expected Output & View Walkthrough

| View Name | Navigation Action | Content Rendered |
| :--- | :--- | :--- |
| **Home / Dashboard** | Click "Home / Dashboard" tab (Default view on load) | Welcome hero banner with platform description, 4 metric cards (150+ Students, 45+ Blogs, 30+ Achievements, 12+ Opportunities), and 4 recent campus activity items. |
| **Student Directory** | Click "Student Directory" tab | 6 detailed student profile cards across multiple engineering disciplines with department badges, CGPAs, and skill pills. |
| **Technical Blogs** | Click "Technical Blogs" tab | 3 peer technical articles with category tags (Cloud Architecture, AI, Automotive EV), reading times, authors, and dates. |
| **Opportunities** | Click "Opportunities" tab | 3 student opportunities with competition/internship/grant badges, eligibility requirements, locations, and application deadlines. |
| **Fallback View** | Triggered if invalid state is set | Clean message card with a "Return to Home Dashboard" button. |

---

## 7. Viva Voce Questions and In-Depth Answers

### Q1: What is a Single-Page Application (SPA), and how does it differ from a Multi-Page Application (MPA)?
**Answer:**
An SPA is a web application that interacts with the user by dynamically rewriting the current web page rather than loading entire new pages from a server. In an MPA, every hyperlink click triggers a full browser reload and a new round-trip HTTP request to fetch complete HTML documents. In an SPA, the browser loads the initial shell once; subsequent view changes are handled locally via client-side JavaScript, swapping components without refreshing the page.

---

### Q2: What is JSX, and is it valid JavaScript that browsers can execute directly?
**Answer:**
JSX stands for JavaScript XML. It is a syntactic sugar extension that allows writing HTML-like tags inside JavaScript. Browsers **cannot** execute JSX directly. Build tools like Vite, Babel, or esbuild transpile JSX into standard ECMAScript function calls (`React.createElement()` or the JSX runtime `_jsx()`) before execution in the browser.

---

### Q3: What is the Virtual DOM, and how does React reconciliation work?
**Answer:**
The Virtual DOM is an in-memory lightweight representation of the actual DOM tree. When a component's state or props change, React creates a new Virtual DOM tree and compares it to the previous tree using a process called **reconciliation** (the diffing algorithm). React calculates the minimum number of DOM operations required and applies only those specific changes to the real browser DOM, avoiding expensive layout reflows.

---

### Q4: What are React props, and can a child component modify its own props?
**Answer:**
Props (short for properties) are inputs passed from a parent component down to a child component to configure its content or behavior. Props are **strictly read-only and immutable**. In React's philosophy of pure functions, a component must never alter its incoming props. If data needs to change over time in response to user interaction, it must be stored in React **state** (`useState`).

---

### Q5: Why is the `key` prop mandatory when rendering lists in React?
**Answer:**
When mapping an array of items to JSX elements, React requires a unique and stable `key` prop for each child. Keys give elements a stable identity across renders. During reconciliation, React uses these keys to determine whether an item was added, deleted, or reordered. Omitting keys or using array indices can lead to UI rendering glitches, incorrect input focus, and severe performance degradation.

---

### Q6: What is the purpose of `React.StrictMode`?
**Answer:**
`React.StrictMode` is a development-only helper tool that wraps a component tree to highlight potential problems in an application. It does not render any visible UI. It intentionally invokes certain lifecycle functions and render phases twice to detect unexpected side effects, warns about deprecated APIs, and verifies that components adhere to React best practices.

---

### Q7: Explain the difference between Functional Components and Class Components in React.
**Answer:**
- **Functional Components:** Plain JavaScript functions that accept props and return JSX. With the introduction of React Hooks (like `useState`, `useEffect`) in React 16.8, functional components are the modern standard because they are concise, easier to test, and eliminate confusing `this` binding issues.
- **Class Components:** ES6 classes extending `React.Component` that require a `render()` method and store state via `this.state`. They are now considered legacy in modern React development.

---

### Q8: How does conditional rendering work in React? Provide two examples.
**Answer:**
Conditional rendering works using standard JavaScript logic:
1. **Logical AND (`&&`) operator:** Renders an element only if a condition is true:
   ```jsx
   {isActive && <span className="active-dot" />}
   ```
2. **Ternary operator (`? :`):** Renders one of two components based on a boolean condition:
   ```jsx
   {isLoading ? <Spinner /> : <Dashboard />}
   ```

---

### Q9: Why was `ReactDOM.createRoot` introduced in React 18 to replace `ReactDOM.render`?
**Answer:**
`ReactDOM.render` mounted React in synchronous mode, which could cause UI freezes during heavy rendering tasks. `ReactDOM.createRoot` enables React 18's **Concurrent Features**, allowing React to prepare multiple versions of the UI in the background, prioritize urgent updates (like typing in an input) over less urgent ones (like rendering a large list), and automatically batch multiple state updates.

---

### Q10: How does component composition improve maintainability in large applications?
**Answer:**
Component composition is the practice of combining smaller, focused components to construct complex user interfaces. Instead of building massive, monolithic files, developers break the interface into isolated units (`Header`, `Navbar`, `StudentCard`, `StatCard`). Each component handles its own presentation and logic, making the codebase modular, reusable across different pages, and much easier to unit test and maintain.

---

## 8. Conclusion

Assignment 08 establishes the modern frontend architecture for KBTCOE Connect. By migrating from static HTML pages to a Vite-powered React Single-Page Application, KBTCOE Connect demonstrates component composition, props passing, list rendering with stable keys, and seamless client-side navigation. This provides the modular component foundation required for stateful feeds (`useState`), data fetching (`useEffect`), and eventual full-stack integration.
