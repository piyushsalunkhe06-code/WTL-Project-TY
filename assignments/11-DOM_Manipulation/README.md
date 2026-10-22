# Assignment 11: DOM Manipulation — Live Like Counter & Comment Thread

**Course:** Web Technology Laboratory / Full-Stack Web Development  
**Institution:** MVPS's KBT College of Engineering (KBTCOE), Nashik  
**Academic Year:** 2025–2026  
**Module:** Assignment 11 (`11-DOM_Manipulation`)  
**Platform Track:** KBTCOE Connect — The Professional Network for KBTCOE Students  

---

## 1. Aim

To design, implement, and verify an interactive student networking post interface for **KBTCOE Connect** using plain HTML5, CSS3, and vanilla JavaScript (ES6+), demonstrating imperative **Document Object Model (DOM) manipulation**, dynamic element creation, event handling, event delegation, safe text rendering using `textContent`, input validation, and real-time counter synchronization without page reloads.

---

## 2. Learning Objectives

By completing this practical, students will be able to:
1. Understand the hierarchical structure of the Document Object Model (DOM) and browser tree traversal.
2. Query DOM nodes using `document.getElementById()`, `document.querySelector()`, and `document.querySelectorAll()`.
3. Dynamically instantiate DOM elements using `document.createElement()` and insert them into the live tree using `appendChild()` and `prepend()`.
4. Remove elements from the live DOM using the `node.remove()` API.
5. Understand and implement **Event Delegation** on a common parent container to handle dynamic child elements efficiently.
6. Enforce safe text rendering using `element.textContent` to prevent Cross-Site Scripting (XSS) vulnerabilities.
7. Manage element classes and state toggling using `classList.add()`, `classList.remove()`, and `classList.toggle()`.
8. Intercept form submissions via `event.preventDefault()` to build responsive Single-Page experiences.
9. Implement accessible status announcements using ARIA roles (`role="status"`, `aria-live="polite"`).

---

## 3. Software and Hardware Requirements

### Software Requirements
- **Operating System:** Windows 10/11, Linux, or macOS.
- **Web Browser:** Any modern ECMAScript 6+ compliant browser (Google Chrome, Mozilla Firefox, Microsoft Edge).
- **Code Editor:** Visual Studio Code or any standard text editor.
- **Runtime Environment (Optional for Testing):** Node.js `v18.0.0+` for running the automated unit test suite.

### Hardware Requirements
- Dual-core processor or higher.
- Minimum 4 GB RAM.
- Display resolution of 1280x720 or higher.

---

## 4. Theory of DOM Manipulation

### 4.1 What is the Document Object Model (DOM)?

The Document Object Model (DOM) is an object-oriented programmatic representation of an HTML document. When a browser loads an HTML file, its rendering engine parses the markup and constructs an in-memory tree of objects called the **DOM Tree**.

Each HTML tag becomes an **Element Node**, plain text becomes a **Text Node**, and attributes become **Attribute Nodes**. JavaScript interacts with this tree via standard Web APIs, enabling developers to dynamically read, modify, add, or delete nodes in real time.

```
                  Document
                     │
                   <html>
            ┌────────┴────────┐
         <head>             <body>
            │                 │
         <title>      ┌───────┴────────┐
                    <header>         <main>
                                       │
                                   <article>
                                ┌──────┴──────┐
                              <header>     <footer>
```

---

## 5. Explanation of Required DOM Methods Used

| DOM Method / Property | Description | Usage in Assignment 11 |
| :--- | :--- | :--- |
| **`document.getElementById(id)`** | Retrieves a single element matching the unique `id`. | Locates `#btnLike`, `#commentForm`, `#commentInput`, `#commentsList`, `#btnClearComments`. |
| **`document.querySelector(selector)`** | Returns the first matching element for a CSS selector. | Finds sub-elements like `.heart-icon` and `.btn-like-text` inside `#btnLike`. |
| **`document.querySelectorAll(selector)`** | Returns a static `NodeList` of all matching elements. | Queries all `.comment-card` elements to compute the live comment count and clear all nodes. |
| **`document.createElement(tagName)`** | Creates a new HTML element node in memory. | Instantiates dynamic `<article>`, `<header>`, `<div>`, `<h4>`, `<time>`, `<button>`, and `<p>` nodes. |
| **`parent.appendChild(child)`** | Appends a node as the last child of a parent. | Assembles comment card elements into the card structure. |
| **`parent.prepend(child)`** | Inserts a node as the first child of a parent. | Places the newly submitted comment at the top of the comment feed. |
| **`node.remove()`** | Removes the element node directly from the live DOM tree. | Removes a deleted comment or removes all comments during thread clearing. |
| **`node.textContent`** | Reads or sets the literal textual content of an element. | **Security Crucial:** Injects user comments and author names strictly as text, escaping any HTML tags. |
| **`node.classList`** | Provides `.add()`, `.remove()`, and `.toggle()` for CSS classes. | Toggles `.liked` on the like button, manages `.is-invalid` on textarea, and toggles `.visually-hidden`. |
| **`element.setAttribute(name, val)`** | Sets or updates an attribute on an element. | Updates accessibility attributes: `aria-pressed`, `aria-label`, and `aria-invalid`. |
| **`element.dataset`** | Provides access to custom `data-*` attributes. | Stores and reads unique comment identifiers (`data-comment-id`) and action flags (`data-action="delete"`). |
| **`element.closest(selector)`** | Traverses up the DOM tree to find the nearest matching ancestor. | Used in event delegation to locate the parent `.comment-card` from the clicked delete button. |

---

## 6. Event Listeners and Event Delegation

### 6.1 Event Listeners (`addEventListener`)
An event listener registers an event callback function on a specific DOM element. When the specified event (e.g., `click`, `submit`, `input`) occurs on the target element, the browser triggers the callback.

```javascript
btnLike.addEventListener("click", handleLikeClick);
```

### 6.2 Event Delegation
**Event Delegation** is an efficient design pattern that leverages the browser's **Event Bubbling** mechanism. When an event fires on a nested child element, it travels upwards through its ancestor elements in the DOM tree.

Instead of attaching individual click listeners to every Delete button (which consumes unnecessary memory and fails for dynamically inserted future nodes), we attach a **single click listener to the parent container (`#commentsList`)**:

```javascript
commentsList.addEventListener("click", function(e) {
  // Check if click originated from or inside a delete button
  const deleteBtn = e.target.closest(".btn-delete-comment");
  if (!deleteBtn) return;

  // Identify and remove the parent comment card
  const commentCard = deleteBtn.closest(".comment-card");
  if (commentCard) {
    commentCard.remove();
    syncCommentCounters();
  }
});
```

#### Advantages of Event Delegation:
1. **Low Memory Footprint:** 1 event listener on the container instead of 100+ listeners on individual buttons.
2. **Dynamic Compatibility:** Automatically works for newly added comments without requiring new listener attachments.
3. **No Memory Leaks:** Removing a child element does not leave orphaned event listener references in memory.

---

## 7. Working of the Like Counter

1. **Initial State:** The post displays an initial count of 24 likes (`isLiked = false`).
2. **First Click (Like):**
   - Inverts boolean state: `isLiked = true`.
   - Increments displayed count to 25.
   - Adds `.liked` CSS class to `#btnLike` (renders blue highlight and heart beat animation).
   - Updates icon from `🤍` to `❤️` and text from `Like` to `Liked`.
   - Updates `aria-pressed="true"` and accessible label.
   - Synchronizes stats bar counter (`#statLikeCount`).
3. **Second Click (Unlike):**
   - Inverts boolean state: `isLiked = false`.
   - Decrements displayed count back to 24.
   - Removes `.liked` class, restores `🤍 Like`.
   - Updates `aria-pressed="false"`.
4. **Boundary Guard:** The counter enforces `Math.max(0, count)`, preventing negative likes under any circumstance.

---

## 8. Working of the Comment Thread

```
[ User types in textarea ]
           │
           ▼
[ User clicks 'Post Comment' ]
           │
           ├─► event.preventDefault() (Halts page refresh)
           │
           ├─► Trim whitespace (commentInput.value.trim())
           │
           ├─── Is input empty?
           │      ├── YES ──► Display #commentError, add .is-invalid, focus input, STOP.
           │      │
           │      └── NO  ──► Hide #commentError, proceed:
           │
           ├─► Create structured comment object (author, time, text)
           ├─► Instantiate DOM node via document.createElement()
           ├─► Set comment text safely via textContent (Zero innerHTML)
           ├─► Prepend node to #commentsList (Newest appears at top)
           ├─► Clear textarea & reset character counter
           ├─► Update all comment count badges (stat bar, toolbar, header)
           ├─► Hide empty state card
           └─► Announce success to screen readers via aria-live status
```

---

## 9. Input Validation and Safe Text Rendering

### 9.1 Defensive Validation
- **Whitespace Trimming:** `text.trim()` prevents empty comments containing only spacebar or newline inputs.
- **Length Constraint:** Maxlength of 400 characters enforces concise commentary.
- **Accessible Feedback:** Invalid submissions display an alert banner (`role="alert"`), apply `.is-invalid` borders, and set `aria-invalid="true"`.

### 9.2 Cross-Site Scripting (XSS) Prevention
If a malicious user submits text such as:
```html
<script>alert('XSS attack!');</script><img src="x" onerror="stealData()">
```
- If rendered using `element.innerHTML = commentText`, the browser would parse the tags and execute the injected script.
- By using **`element.textContent = commentText`**, the browser treats the input strictly as literal text. The characters `<` and `>` are displayed safely on the screen without HTML execution.

---

## 10. File Structure

```text
assignments/11-DOM_Manipulation/
├── index.html          # Semantic layout for student post, actions, and comment thread
├── style.css           # Styling using KBTCOE navy-blue palette, responsive breakpoints
├── app.js              # Vanilla JavaScript DOM manipulation engine & event delegation
├── README.md           # Laboratory manual and viva voce examination guide
└── assets/
    └── kbtcoe-logo.svg # Official KBTCOE Connect brand vector logo
```

---

## 11. Step-by-Step Execution Instructions

### Running in a Web Browser
1. Open PowerShell or Command Prompt:
   ```powershell
   cd "c:\Users\administrator.FABEXENG\Desktop\Projecy\assignments\11-DOM_Manipulation"
   ```
2. Because Assignment 11 operates entirely on client-side DOM events and does not make external `fetch()` calls, it can be launched directly:
   - Double-click `index.html` in Windows Explorer, OR
   - Run:
     ```powershell
     start index.html
     ```
3. Alternatively, serve via a local HTTP server:
   ```powershell
   npx.cmd serve . -p 8000
   ```
   and navigate to `http://localhost:8000/`.

---

## 12. Expected Output & Application Behavior

1. **Initial Page Display:**
   - Header shows KBTCOE Connect logo, navigation, and active student profile pill (`Tanmay Shinde • BE Comp`).
   - Post card displays student Sanket Patil's SIH 2026 win with 24 initial likes and 2 seed comments.
2. **Toggling Like:**
   - Clicking **Like** increases the counter to 25, heart turns red `❤️`, button becomes highlighted, and toast announces: *"You liked this post."*
   - Clicking **Liked** again reverts count to 24, heart turns white `🤍`, and toast announces: *"You unliked this post."*
3. **Submitting a Comment:**
   - Submitting without typing shows a red error banner: *"Please enter a comment before submitting."*
   - Typing `"Awesome work team! Proud of KBTCOE!"` and clicking **Post Comment** adds the comment smoothly at the top with a "Just now" timestamp.
   - Comment counter updates from 2 to 3.
4. **Deleting a Comment:**
   - Clicking **🗑️ Delete** on any comment removes that specific card from the DOM immediately.
   - Comment counter updates from 3 to 2.
5. **Empty State & Clear All:**
   - Clicking **🗑️ Clear All Comments** triggers a browser confirmation dialog.
   - If confirmed, all comments are removed, counter updates to 0, and the empty state card (*"No comments yet"*) becomes visible.
   - If cancelled, existing comments remain unaffected.

---

## 13. Testing Checklist

- [x] Page loads cleanly without console errors or warnings.
- [x] Initial like counter displays 24.
- [x] Clicking Like increments counter to 25 and toggles active styling.
- [x] Clicking again decrements counter back to 24 and removes active styling.
- [x] Empty comment submission displays inline validation alert.
- [x] Valid comment prepends cleanly to the comments list.
- [x] HTML and script tags in comments are rendered safely as literal text (0 XSS).
- [x] Comment count badge and stats update immediately upon addition.
- [x] Delete button removes the exact comment card via event delegation.
- [x] Deleting all comments triggers the visible Empty State card.
- [x] Clear All Comments prompts for confirmation and empties the thread.
- [x] Cancelling Clear All preserves existing comments.
- [x] Mobile layout reflows buttons and header cleanly at `<640px`.
- [x] All interactive controls feature accessible ARIA attributes and labels.
- [x] Assignments 01 through 10 remain completely intact and unmodified.

---

## 14. Viva Voce Questions and Concise Answers

### Q1: What is the DOM, and how does the browser construct it?
**Answer:**
The Document Object Model (DOM) is an in-memory, tree-structured API representing an HTML document. The browser constructs it during HTML parsing by tokenizing tags into Element Nodes, text into Text Nodes, and attributes into Attribute Nodes, allowing JavaScript to dynamically manipulate page content and structure.

---

### Q2: What is the difference between `document.getElementById()` and `document.querySelector()`?
**Answer:**
`getElementById()` is an older, highly optimized method that retrieves a single element strictly by its unique ID attribute without CSS selector parsing. `querySelector()` accepts any valid CSS selector (`#id`, `.class`, `element[attr]`), returning the first matching element, providing greater query flexibility.

---

### Q3: What is Event Delegation, and why is it preferred for dynamic lists?
**Answer:**
Event Delegation is an optimization pattern where a single event listener is attached to a static parent container rather than attaching individual listeners to multiple child elements. By taking advantage of event bubbling (`e.target`), dynamically added children can trigger actions (like Delete) immediately without requiring new listeners, saving memory and preventing listener leaks.

---

### Q4: Why should user-submitted comments be rendered using `textContent` instead of `innerHTML`?
**Answer:**
`textContent` parses the assigned string purely as character data and escapes special characters like `<` and `>`, preventing the browser from interpreting them as HTML tags. In contrast, `innerHTML` parses markup and executes embedded scripts (e.g., `<img onerror="...">`), exposing the application to Cross-Site Scripting (XSS) vulnerabilities.

---

### Q5: What is the purpose of `event.preventDefault()` inside a form submit handler?
**Answer:**
By default, submitting an HTML `<form>` causes the browser to initiate a full-page reload and send an HTTP request to the URL specified in the `action` attribute. Calling `event.preventDefault()` suppresses this default behavior, allowing JavaScript to validate inputs and manipulate the DOM asynchronously without reloading the page.

---

### Q6: What is the difference between `element.remove()` and `parentElement.removeChild(child)`?
**Answer:**
`element.remove()` is a modern DOM API method (DOM Level 4) that can be called directly on the target element to remove itself from the tree. `removeChild()` is an older method that requires a reference to the parent node (`node.parentNode.removeChild(node)`).

---

### Q7: How does `classList.toggle()` work?
**Answer:**
`classList.toggle(className, [force])` adds the specified CSS class if it is not present on the element, or removes it if it is already present. An optional second boolean parameter (`force`) can be supplied: if `true`, it unconditionally adds the class; if `false`, it unconditionally removes it.

---

### Q8: What is the difference between `prepend()` and `appendChild()`?
**Answer:**
- `appendChild(node)` inserts the specified node as the **last child** of the parent element.
- `prepend(node)` inserts the specified node as the **first child** of the parent element, which is ideal for social feeds where newer posts or comments should appear at the top.

---

### Q9: How do custom `data-*` attributes and the `dataset` property function in the DOM?
**Answer:**
`data-*` attributes allow developers to embed custom metadata on HTML elements (e.g. `data-comment-id="123"`). In JavaScript, these values can be read and modified cleanly via the element's `dataset` property in camelCase (e.g. `element.dataset.commentId`).

---

### Q10: How does `Element.closest()` assist in event delegation?
**Answer:**
`closest(selector)` traverses the element itself and its ancestors upwards toward the root of the document, returning the first element that matches the given CSS selector. In event delegation, if a user clicks an icon or text inside a button, `e.target.closest('.btn-delete-comment')` ensures the button element is identified reliably.

---

### Q11: Why is an accessible live region (`aria-live="polite"`) important for dynamic DOM updates?
**Answer:**
Because dynamic DOM changes (like incrementing likes or adding comments) do not cause full-page reloads, assistive technologies (screen readers) would otherwise remain unaware of them. `aria-live="polite"` instructs the screen reader to announce updates to visually impaired users at the next natural conversational pause.

---

### Q12: Why is it best practice to wait for `DOMContentLoaded` before running DOM scripts?
**Answer:**
`DOMContentLoaded` fires when the initial HTML document has been completely parsed and the DOM tree is built, without waiting for stylesheets or images to load. Running scripts before this event can result in `null` errors when attempting to query elements that have not yet been parsed into the tree.

---

## 15. Conclusion

Assignment 11 successfully implements native client-side interactivity for KBTCOE Connect. Through disciplined DOM querying, event delegation on dynamic nodes, safe text rendering with `textContent`, responsive CSS state updates, and accessible counter synchronizations, this practical establishes the foundational DOM interaction mechanisms essential for modern web application engineering.
