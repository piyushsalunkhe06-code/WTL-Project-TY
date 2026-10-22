# Assignment 09: React Concepts — Interactive Community Post Feed

**Course:** Web Technology Laboratory / Full-Stack Web Development  
**Institution:** MVPS's KBT College of Engineering (KBTCOE), Nashik  
**Academic Year:** 2025–2026  
**Module:** Assignment 09 (`09-React_Concepts`)  
**Platform Track:** KBTCOE Connect — The Professional Network for KBTCOE Students  

---

## 1. Aim

To design, develop, and verify an interactive, responsive **Community Post Feed Module** for **KBTCOE Connect** using React functional components and hooks (`useState`, `useEffect`), demonstrating controlled form inputs, event handling, immutable state updates, reactive category filtering, list rendering with stable keys, like/unlike toggling, user post deletion with confirmation guards, live aggregate statistics, and graceful client-side browser persistence via `localStorage`.

---

## 2. Learning Objectives

By completing this assignment, students will be able to:
1. Master React state management using the `useState` hook to control dynamic user interfaces.
2. Employ the `useEffect` hook with dependency arrays to execute side effects, specifically synchronizing application state with browser `localStorage`.
3. Build controlled form components where input values are bound to React state and updated via `onChange` events.
4. Enforce immutable state updates when modifying arrays and objects, avoiding direct state mutation.
5. Implement reactive data filtering and derived statistical calculations without duplicating state.
6. Design reusable UI components (`PostComposer`, `FeedStats`, `CategoryFilter`, `PostFeed`, `PostCard`) connected via props and callback functions.
7. Understand the technical differences between browser-local client storage (`localStorage`) and production backend persistence.

---

## 3. Theoretical Background & React Concepts

### 3.1 React State & the `useState` Hook

In React, **state** represents data that changes over time and directly dictates what is rendered on screen. When state updates, React re-renders the component and its children.

The `useState` hook declares a state variable and a setter function:

```jsx
const [posts, setPosts] = useState(initialPosts);
const [selectedCategory, setSelectedCategory] = useState('All');
```

**Lazy State Initialization:**  
When initializing state from an expensive computation or browser API like `localStorage`, a function can be passed to `useState`. This initializer function runs only once during the initial mount:

```jsx
const [posts, setPosts] = useState(() => {
  try {
    const saved = localStorage.getItem('kbtcoe_connect_posts_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load saved posts:', err);
  }
  return initialPosts;
});
```

---

### 3.2 The `useEffect` Hook & Side Effects

The `useEffect` hook allows functional components to perform side effects (such as synchronizing data with browser APIs, timers, or network requests) after React renders the DOM.

**Syntax & Dependency Array:**
```jsx
useEffect(() => {
  // Side effect execution
  try {
    localStorage.setItem('kbtcoe_connect_posts_v1', JSON.stringify(posts));
  } catch (err) {
    console.warn('Storage sync failed:', err);
  }
}, [posts]); // Dependency array: Effect runs whenever `posts` changes
```

- **Empty Array `[]`:** Effect executes once after the initial render (equivalent to `componentDidMount`).
- **With Dependencies `[posts]`:** Effect executes after initial render and whenever any value in the dependency array changes.
- **No Array:** Effect executes after *every* single render (generally avoided for performance reasons).

---

### 3.3 Controlled Form Components

In standard HTML forms, DOM input elements maintain their own internal state. In a **Controlled Component**, React state serves as the "single source of truth." The input's displayed value is bound to state (`value={content}`), and user keystrokes update that state through an event handler (`onChange={(e) => setContent(e.target.value)}`):

```jsx
// src/components/PostComposer.jsx
<textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="Share your update..."
/>
```

**Benefits of Controlled Inputs:**
- Instant input validation and character counting (`content.length / 500`).
- Seamless form resetting upon submission (`setContent('')`).
- Elimination of out-of-sync DOM values.

---

### 3.4 Immutable State Updates

In React, state must **never be mutated directly** (e.g., `posts.push(newPost)` or `post.likes++`). Direct mutation violates React's purity model, prevents shallow comparison optimizations, and can cause missed re-renders.

#### 1. Adding a Post (Prepending Immutably):
```jsx
// Spread operator creates a brand new array with newPost placed first
const handleAddPost = (newPost) => {
  setPosts((prevPosts) => [newPost, ...prevPosts]);
};
```

#### 2. Toggling Like / Unlike (Mapping Immutably):
```jsx
// map() returns a new array with only the targeted post replaced by an updated clone
const handleToggleLike = (postId) => {
  setPosts((prevPosts) =>
    prevPosts.map((post) => {
      if (post.id === postId) {
        const nextLiked = !post.isLiked;
        return {
          ...post,
          isLiked: nextLiked,
          likes: nextLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
        };
      }
      return post;
    })
  );
};
```

#### 3. Deleting a Post (Filtering Immutably):
```jsx
// filter() returns a new array omitting the target post ID
const handleDeletePost = (postId) => {
  setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
};
```

---

### 3.5 Reactive Category Filtering & Derived State

Rather than maintaining a separate `filteredPosts` state array (which risks synchronization errors), the list of visible posts and live statistics are **derived calculations** computed during render:

```jsx
// Derived visible posts based on active category
const visiblePosts = selectedCategory === 'All'
  ? posts
  : posts.filter((post) => post.category === selectedCategory);

// Derived live statistics
const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
const userPostsCount = posts.filter((p) => p.isUserCreated).length;
```

---

### 3.6 LocalStorage Persistence & Educational Scope

`localStorage` is a synchronous key-value browser storage mechanism limited to approximately 5MB of string data per origin.

> [!NOTE]
> **Educational Scope Disclaimer:**  
> In this practical, `localStorage` is used to demonstrate React's `useEffect` side-effect synchronization and to preserve user experiments across browser refreshes. In production applications (covered in later modules), data is sent to a backend API (Express/PHP) and saved in a persistent relational database (MySQL).

---

## 4. Project Folder Structure

```
assignments/09-React_Concepts/
├── index.html              # HTML mount document
├── package.json            # Vite and React dependencies
├── vite.config.js          # Vite configuration
├── kbtcoe-logo.svg         # Official college vector logo
├── README.md               # Laboratory documentation and viva guide
├── public/
│   └── kbtcoe-logo.svg     # Public static logo
└── src/
    ├── main.jsx            # Entry point mounting root via createRoot
    ├── App.jsx             # Top-level state orchestration, effects, and handlers
    ├── index.css           # Styling conforming to KBTCOE design system
    ├── data/
    │   └── mockPosts.js    # Fictional seed posts and category definitions
    └── components/
        ├── Header.jsx      # Top header with logo and lab badge
        ├── FeedStats.jsx   # Live reactive metrics card with reset button
        ├── PostComposer.jsx# Controlled form for publishing community updates
        ├── CategoryFilter.jsx # Pill navigation bar with active category indicator
        ├── PostFeed.jsx    # Stream container with empty-state handling
        ├── PostCard.jsx    # Post card with like/unlike, delete guard, and tags
        └── Footer.jsx      # Institutional copyright and tech metadata
```

---

## 5. Prerequisites & Local Execution

### 5.1 Prerequisites
- **Node.js:** v18.0.0 or higher (Current: `v24.20.0`)
- **NPM:** v9.0.0 or higher (Current: `11.19.0`)
- Modern web browser

### 5.2 Installation & Development Server

Open PowerShell or Command Prompt, navigate to the Assignment 09 folder, and run:

```powershell
cd "c:\Users\administrator.FABEXENG\Desktop\Projecy\assignments\09-React_Concepts"

# Install dependencies (use npm.cmd on Windows if script execution is restricted)
npm.cmd install

# Start Vite hot-reloading development server
npm.cmd run dev
```

Open `http://localhost:3001/` in your browser.

### 5.3 Production Build

To verify compilation into optimized static distribution files:

```powershell
npm.cmd run build
```

---

## 6. Verification & Test Matrix

| Feature | Action Performed | Expected Behavior |
| :--- | :--- | :--- |
| **Initial Feed Load** | Load application in browser | Displays 6 initial demonstration community posts across Technical, Achievements, Events, and General categories. |
| **Live Statistics** | Inspect `FeedStats` card | Displays 6 Visible Posts, 6 Total Posts, 122 Total Likes, and 0 User Created Posts. |
| **Empty Post Prevention** | Click "Publish Post" with empty textarea | Form submission blocked; error banner displays: *"Post content cannot be empty or contain only whitespace."* |
| **Publishing a Post** | Fill author, choose category, enter valid text, click Publish | Post prepends to the top of the feed immediately with "Just now" timestamp, a "You" badge, and a Delete button. Visible posts and total posts increment by 1. |
| **Like Toggle** | Click the Like button on any post | Heart changes from `🤍` to `❤️`, like count increments by 1, button highlights in rose pink, and Total Community Likes stat increments by 1. |
| **Unlike Toggle** | Click the Liked button again | Heart reverts to `🤍`, like count decrements by 1, button returns to neutral state, and Total Community Likes decrements by 1. |
| **Category Filter** | Click "Technical" filter pill | Feed updates immediately to display only Technical posts. "Showing X of Y posts" indicator updates. Inactive categories hidden. |
| **Empty Filter State** | Filter to a category with no posts | Clean empty-state card appears with an empty mailbox icon (`📭`) and a "View All Community Posts" reset button. |
| **User Post Deletion** | Click "Delete" on user-created post and confirm browser prompt | Post removes from state and localStorage. User Created Posts stat decrements. Sample posts cannot be deleted (protected badge shown). |
| **LocalStorage Persistence**| Refresh the browser window | All published posts and updated like states remain intact from localStorage. |
| **Seed Reset** | Click "🔄 Reset Default Posts" in stats header | Clears localStorage and restores initial 6 seed posts cleanly. |

---

## 7. Viva Voce Questions and In-Depth Answers

### Q1: What is the purpose of React state, and how does it differ from props?
**Answer:**
- **State:** Represents internal, mutable data managed *within* a component that changes over time (e.g., user inputs, active filters, like counts). When state changes via its setter function, React re-renders the component.
- **Props:** External, read-only configuration passed *into* a child component from its parent. Child components cannot modify their incoming props; props enforce unidirectional data flow.

---

### Q2: Why is it forbidden to mutate state directly (e.g., `posts.push(newPost)`) in React?
**Answer:**
Direct state mutation violates React's functional purity and shallow comparison mechanism. React compares previous and next state references to determine whether a re-render is necessary. If you mutate an existing array in place, its memory reference remains identical, causing React to miss the update. Mutating state directly can also corrupt historical state records during concurrent rendering or time-travel debugging.

---

### Q3: Explain how the dependency array in `useEffect` controls effect execution.
**Answer:**
The dependency array tells React when to re-run the effect:
1. `useEffect(fn, [posts])`: Runs after the initial mount, and then runs *only* when the reference or value of `posts` changes between renders.
2. `useEffect(fn, [])`: Runs exactly once after the component mounts into the DOM.
3. `useEffect(fn)`: Runs after *every single render*, which can cause severe performance issues or infinite loops if the effect modifies state.

---

### Q4: What is a Controlled Component in React?
**Answer:**
A Controlled Component is an input form element (like `<input>`, `<textarea>`, or `<select>`) whose value is governed entirely by React state rather than the browser's DOM. The input receives its current value via `value={state}`, and any user interaction triggers an `onChange` handler that updates the state through `setState`.

---

### Q5: How does the functional state updater syntax (`setPosts(prev => ...)`) prevent race conditions?
**Answer:**
State updates in React are batched and processed asynchronously. If an update relies on the previous state value (such as incrementing a counter or filtering an array), passing a callback function `setCount(prevCount => prevCount + 1)` ensures that React passes the most up-to-date state at the moment the update is actually applied, preventing stale closure bugs.

---

### Q6: What is "Derived State", and why is it preferred over duplicate state?
**Answer:**
Derived state refers to values that can be computed on-the-fly during the render cycle from existing state or props (for example, `visiblePosts = posts.filter(...)` or `totalLikes = posts.reduce(...)`). Storing `visiblePosts` as a separate state variable leads to duplicate state, which requires manual synchronization and frequently introduces out-of-sync data bugs.

---

### Q7: Why is `localStorage` used with a `try...catch` block in React applications?
**Answer:**
Accessing `localStorage` can throw runtime exceptions in several real-world scenarios:
1. If the user is browsing in Private/Incognito mode with third-party storage blocked.
2. If the device disk is full, throwing a `QuotaExceededError`.
3. If stored JSON data is corrupted or malformed, causing `JSON.parse()` to throw a `SyntaxError`.
Wrapping storage access in `try...catch` ensures the application falls back safely to default memory data without crashing.

---

### Q8: What is the significance of the `key` prop in the `PostFeed` component?
**Answer:**
In `PostFeed`, each post is rendered using `posts.map(post => <PostCard key={post.id} ... />)`. The `key` prop provides a unique, persistent identifier for each element. When posts are added to the top or removed from the middle, React uses these keys during reconciliation to reorder DOM nodes rather than destructively re-creating the entire list.

---

### Q9: How does event handling in React (Synthetic Events) differ from native HTML event handling?
**Answer:**
React wraps native browser events in a cross-browser wrapper called `SyntheticEvent`. Synthetic events have the exact same interface across all browsers (like `e.preventDefault()` and `e.target.value`), normalizing inconsistencies between different browser engines. Furthermore, React uses event delegation at the root container to optimize memory rather than attaching separate event listeners to every individual DOM node.

---

### Q10: What is component composition, and how is it used in this post feed?
**Answer:**
Component composition is the design pattern of assembling specialized components together to build complex UIs. In Assignment 09, `App` does not render raw HTML for every feature; instead, it coordinates `Header`, `FeedStats`, `PostComposer`, `CategoryFilter`, `PostFeed`, and `Footer`. This modularity allows components like `PostCard` to be reused, tested, and modified independently.

---

### Q11: Why is client-side `localStorage` not a substitute for a backend database?
**Answer:**
`localStorage` is strictly isolated to a single browser on a single physical machine. It cannot share data across different users or devices, offers no relational querying or indexing, is limited to ~5MB, lacks encryption or access control, and can be wiped at any time by the user. A production network like KBTCOE Connect requires a server-side database (such as MySQL or PostgreSQL) to share updates across the entire student body.

---

### Q12: How does conditional rendering enable the empty-state feature in `PostFeed`?
**Answer:**
Inside `PostFeed.jsx`, conditional rendering checks whether `posts.length === 0`:
```jsx
if (!posts || posts.length === 0) {
  return <div className="feed-empty-state">...</div>;
}
return <div className="posts-stream">{posts.map(...)}</div>;
```
If the active category filter yields no matching posts, React early-returns the friendly empty-state markup with an action button, providing a helpful user experience rather than displaying a blank void.

---

## 8. Conclusion

Assignment 09 successfully introduces essential React development paradigms to KBTCOE Connect. By implementing dynamic state (`useState`), side-effect persistence (`useEffect`), controlled form inputs, immutable array transformations, and reactive category filtering, the Community Post Feed functions as a robust, stateful single-page module prepared for subsequent asynchronous data fetching and API integration.
