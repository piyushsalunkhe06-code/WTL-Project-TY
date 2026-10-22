# Assignment 06: JavaScript Basics — Interactive Student Directory

**Course:** Web Technology Laboratory / Full-Stack Web Development  
**Institution:** MVPS's KBT College of Engineering (KBTCOE), Nashik  
**Academic Year:** 2025–2026  
**Module:** Assignment 06 (`06-JavaScript_Basics`)  
**Platform Track:** KBTCOE Connect — The Professional Network for KBTCOE Students  

---

## 1. Aim

To design, develop, and verify an interactive, standalone **Student Directory and Peer Networking Module** for **KBTCOE Connect** using vanilla JavaScript (ES6+), demonstrating fundamental programming constructs including variable declarations (`let`, `const`), data types, operators, conditional expressions, arrow functions, higher-order array methods (`map`, `filter`, `find`, `reduce`), event listeners, safe dynamic DOM manipulation without external libraries, and defensive error handling with `try...catch`.

---

## 2. Learning Objectives

By completing this assignment, students will be able to:
1. Explain the differences between `let`, `const`, and `var`, specifically concerning lexical block scoping, re-declaration, and temporal dead zone (TDZ).
2. Model real-world engineering student records using structured JavaScript data types (strings, numbers, booleans, arrays, and objects).
3. Apply higher-order array manipulation methods (`Array.prototype.map`, `Array.prototype.filter`, `Array.prototype.find`, and `Array.prototype.reduce`) to filter dataset records and calculate real-time aggregate statistics.
4. Implement dynamic and safe DOM manipulation techniques (`document.createElement`, `Element.textContent`, `Element.classList`, `Node.appendChild`, `Node.replaceChildren`) to prevent cross-site scripting (XSS) risks.
5. Handle user interaction events (`input`, `change`, `click`) to create a responsive, live-filtering directory interface with combined multi-criteria filters.
6. Manage in-memory mutable state to implement interactive toggles (such as following/unfollowing student peers).
7. Employ structured error handling (`try...catch`) to build fault-tolerant client-side applications.

---

## 3. Theoretical Background & Core JavaScript Concepts

### 3.1 Variables: `let` vs `const` vs `var`

JavaScript offers three keywords for variable declarations:

| Feature | `var` (ES5) | `let` (ES6) | `const` (ES6) |
| :--- | :--- | :--- | :--- |
| **Scope** | Function-scoped | Block-scoped (`{ ... }`) | Block-scoped (`{ ... }`) |
| **Hoisting** | Hoisted; initialized as `undefined` | Hoisted; kept in Temporal Dead Zone (TDZ) | Hoisted; kept in Temporal Dead Zone (TDZ) |
| **Re-declaration** | Permitted in same scope | SyntaxError | SyntaxError |
| **Re-assignment** | Permitted | Permitted | TypeError (assignment to constant) |
| **Mutation of Objects** | Permitted | Permitted | Permitted (properties can change) |

**Application in KBTCOE Connect:**
- `const` is used for immutable references such as DOM node lookups (`const searchInput = ...`), baseline datasets (`initialStudents`), and unchanging function expressions.
- `let` is used strictly for variables whose values change over time, such as current filter criteria (`let currentSearchTerm = ""`) and the working student list (`let students = [...]`).

### 3.2 Data Types

JavaScript possesses dynamic, weak typing with primitive and reference types:
- **String:** Textual data, e.g., student names (`"Aarav Sharma"`), IDs (`"KBT-2023-CS01"`), and department labels.
- **Number:** Double-precision 64-bit IEEE 754 floating-point values, e.g., unique IDs (`1`) and cumulative grade point averages (`cgpa: 9.15`).
- **Boolean:** Logical truth values (`true` or `false`), e.g., `isFollowing: false`.
- **Array:** Ordered collections of elements, e.g., skills list `["React", "Node.js", "TypeScript"]`.
- **Object:** Key-value pairs representing composite student entities with heterogeneous properties.

### 3.3 Operators and Expressions

- **Arithmetic Operators:** Used in statistical aggregation, such as calculating average CGPA (`totalCgpa / studentList.length`).
- **Strict Equality (`===`) and Inequality (`!==`):** Compared without implicit type coercion, preventing subtle runtime bugs (e.g., `s.id === studentId` instead of `==`).
- **Logical Operators:**
  - Logical AND (`&&`): Ensures cards only appear if they meet *both* branch and search term constraints (`matchesBranch && matchesSearch`).
  - Logical OR (`||`): Enables multi-field matching (`matchesName || matchesDept || matchesBio || matchesSkills`).
  - Logical NOT (`!`): Cleanly flips binary state (`student.isFollowing = !student.isFollowing`).

### 3.4 Conditionals & Ternary Operator

- Traditional `if...else if...else` blocks handle complex branching:
```javascript
if (!studentList || studentList.length === 0) {
  // Render empty state
} else {
  // Render cards
}
```
- Ternary Operator (`condition ? exprIfTrue : exprIfFalse`) simplifies inline assignments:
```javascript
const branchLabel = currentSelectedBranch === "all" ? "All Branches" : currentSelectedBranch;
```

### 3.5 Higher-Order Array Methods

Array methods accept callback functions and eliminate imperative `for` loops:

#### 1. `Array.prototype.filter(callback)`
Returns a new array containing all elements that satisfy the truth condition tested by the callback.
```javascript
// Filter students matching selected department
const filtered = students.filter(student => 
  selectedBranch === "all" || student.department === selectedBranch
);
```

#### 2. `Array.prototype.map(callback)`
Creates a new array populated with the results of calling the provided function on every element in the calling array.
```javascript
// Extract all department names
const branchNames = students.map(student => student.department);
```

#### 3. `Array.prototype.find(callback)`
Returns the value of the *first* element in the array that satisfies the provided testing function, or `undefined` if none is found.
```javascript
// Find student by unique ID
const targetStudent = students.find(s => s.id === studentId);
```

#### 4. `Array.prototype.reduce(callback, initialValue)`
Executes a user-supplied "reducer" callback function on each element of the array, passing in the return value from the calculation on the preceding element.
```javascript
// Calculate aggregate total CGPA
const totalCgpa = students.reduce((sum, s) => sum + s.cgpa, 0);

// Collect all unique skills into a Set
const uniqueSkillCount = students.reduce((skillSet, student) => {
  student.skills.forEach(skill => skillSet.add(skill));
  return skillSet;
}, new Set()).size;
```

### 3.6 Safe DOM Manipulation & Security (Preventing XSS)

In naive web applications, developers frequently interpolate unsanitized strings directly into `element.innerHTML = ...`. If student input or external data contains malicious script injections (e.g., `<img src=x onerror=alert(1)>`), this creates a Cross-Site Scripting (XSS) vulnerability.

In this practical, all dynamic cards are generated using **safe programmatic DOM methods**:
1. `document.createElement(tagName)` creates dedicated DOM element nodes.
2. `element.textContent = text` assigns plain text without HTML parsing, automatically escaping any special characters (`<`, `>`, `&`, `"`).
3. `element.classList.add(...)` / `element.className` applies styling classes safely.
4. `container.appendChild(node)` attaches elements into the document hierarchy.
5. `container.replaceChildren()` swiftly flushes existing children before re-rendering.

---

## 4. Code Architecture & File Structure

```
assignments/06-JavaScript_Basics/
├── index.html          # Semantic HTML5 layout, controls bar, and card grid container
├── style.css           # Responsive styles using CSS Grid, Flexbox, and KBTCOE design system
├── app.js              # Core application logic, dataset, filter algorithms, and event handling
├── kbtcoe-logo.svg     # Official vector branding emblem
└── README.md           # Laboratory documentation and viva voce guide
```

### 4.1 Data Structure Specification

Each student record in `app.js` adheres to the following interface:

```typescript
interface Student {
  id: number;              // Unique numerical identifier
  studentId: string;       // Formatted campus roll/ID (e.g., "KBT-2023-CS01")
  name: string;            // Full student name
  department: string;      // Engineering department
  deptCode: string;        // CSS badge token ("comp", "it", "aids", "entc", "mech", etc.)
  year: string;            // Academic standing ("Second Year (SE)", "Third Year (TE)", etc.)
  cgpa: number;            // Cumulative Grade Point Average (0.00 to 10.00)
  skills: string[];        // Array of technical competencies
  bio: string;             // Professional biography / summary
  achievement: string;     // Notable competition, paper, or hackathon award
  isFollowing: boolean;    // Interactive peer connection state
}
```

---

## 5. Execution & Verification Steps

### 5.1 Local Execution via Browser

1. Navigate to the project root directory:
   ```powershell
   cd "c:\Users\administrator.FABEXENG\Desktop\Projecy\assignments\06-JavaScript_Basics"
   ```
2. Double-click `index.html` or open it directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge):
   ```powershell
   Start-Process chrome.exe "index.html"
   ```

### 5.2 Interactive Feature Verification

| Feature | Action to Test | Expected Behavior |
| :--- | :--- | :--- |
| **Initial Dashboard** | Open `index.html` | All 12 student cards display. Dashboard cards show 12 Total, 12 Matching, 7 Active Branches, 35+ Unique Skills. |
| **Live Search** | Type `"Python"` into Search box | Only students having Python in their skills, name, or bio are displayed. Matching count updates in real time. |
| **Branch Filter** | Select `"Computer Engineering"` | Grid displays only Computer Engineering students. |
| **Combined Filters** | Select `"Computer Engineering"` and type `"Docker"` | Only Computer Engineering students skilled in Docker are displayed. |
| **Follow Toggle** | Click `+ Follow` on any student card | Button text immediately changes to `✓ Following` with green badge styling; state persists during current session. |
| **Unfollow Toggle**| Click `✓ Following` on followed card | Button reverts to `+ Follow` with navy outline. |
| **Reset Filters** | Click `Reset Filters` button | Search box clears, branch dropdown reverts to "All Branches", all 12 cards re-render. |
| **Empty State** | Type `"zzzzz"` into Search box | Clean empty state displays with magnifying glass icon, message, and a "Clear All Filters" button. |

---

## 6. Viva Voce Questions and In-Depth Answers

### Q1: What is the difference between `let`, `const`, and `var` in JavaScript?
**Answer:**
- `var` was introduced in ES5; it is function-scoped (or globally scoped if declared outside a function) and permits re-declaration within the same scope. Its declaration is hoisted to the top and initialized with `undefined`.
- `let` is block-scoped (confined to `{ ... }`), cannot be re-declared in the same scope, and is hoisted into a "Temporal Dead Zone" (TDZ) where accessing it before initialization causes a `ReferenceError`. It allows re-assignment.
- `const` is also block-scoped and subject to TDZ, but it cannot be re-assigned once initialized. For primitive types (numbers, strings), the value cannot change; for reference types (objects, arrays), the reference pointer is constant, but internal properties or elements can still be mutated.

---

### Q2: How does `Array.prototype.map()` differ from `Array.prototype.forEach()`?
**Answer:**
- `forEach()` executes a provided callback function once for each array element. It always returns `undefined` and is used solely for executing side effects (e.g., logging or mutating external state).
- `map()` transforms an array into a new array of the exact same length by returning the transformed value from each callback execution. It is pure and does not mutate the original array.

---

### Q3: Explain how `Array.prototype.reduce()` works with an example.
**Answer:**
`reduce()` executes a reducer function on each element of the array, resulting in a single output value (which can be a number, object, string, or set).
The syntax is: `array.reduce((accumulator, currentValue, currentIndex, array) => { ... }, initialValue)`.
For example, to calculate the sum of CGPAs:
```javascript
const totalCgpa = students.reduce((sum, s) => sum + s.cgpa, 0);
```
Here, `sum` begins at `0`. On each iteration, `s.cgpa` is added to `sum`. The final return value is the cumulative sum.

---

### Q4: Why is using `document.createElement()` and `textContent` preferred over `innerHTML`?
**Answer:**
1. **Security (XSS Prevention):** `innerHTML` parses strings as HTML. If data contains user-supplied characters like `<script>` or `<img onerror=...>`, malicious code can execute in the user's browser. `textContent` treats all input strictly as plain text, ensuring safe rendering.
2. **Performance & Node Preservation:** Assigning to `innerHTML` destroys and reconstructs all child DOM nodes, disconnecting existing event listeners and losing element focus. `createElement()` and `appendChild()` surgically insert specific nodes into the DOM tree without disturbing sibling nodes.

---

### Q5: What is the Temporal Dead Zone (TDZ) in JavaScript?
**Answer:**
The Temporal Dead Zone refers to the period between the start of a block's execution and the moment a `let` or `const` variable is declared and initialized. Although variable declarations are hoisted during the creation phase of the execution context, they remain uninitialized. Accessing them during the TDZ throws an explicit `ReferenceError`, preventing subtle bugs caused by using variables before their intended definition.

---

### Q6: What is the difference between `==` and `===`?
**Answer:**
- `==` (Abstract Equality) performs type coercion before comparison if the operands are of different types (e.g., `'5' == 5` evaluates to `true`).
- `===` (Strict Equality) checks both value and type without coercion (e.g., `'5' === 5` evaluates to `false`). Strict equality should almost always be preferred in production code to avoid unpredictable coercion edge cases.

---

### Q7: What are Arrow Functions, and how do they differ from regular function declarations?
**Answer:**
Arrow functions provide a concise syntax introduced in ES6 (`() => {}`). Key differences include:
1. **`this` Binding:** Arrow functions do not bind their own `this`; they inherit `this` lexically from the enclosing scope.
2. **`arguments` Object:** Arrow functions do not possess their own `arguments` object.
3. **Constructor Capability:** Arrow functions cannot be called with `new` and lack a `prototype` property.
4. **Implicit Return:** If the function body consists of a single expression without braces, that expression is returned implicitly: `const double = x => x * 2;`.

---

### Q8: What is event delegation, and why is it useful in dynamic lists?
**Answer:**
Event delegation is an event-handling pattern that leverages the event bubbling phase. Instead of attaching individual event listeners to dozens or hundreds of child elements (e.g., every button in a dynamic student grid), a single event listener is attached to their common parent container. When an event fires, `event.target` is inspected to identify which specific child was clicked. This optimizes memory consumption and automatically handles elements added dynamically in the future.

---

### Q9: How do JavaScript Objects store data, and how do you access properties dynamically?
**Answer:**
JavaScript objects store key-value pairs where keys are strings (or Symbols) and values can be any data type. Properties can be accessed in two ways:
1. **Dot notation (`student.name`):** Used when the property key is a known, valid identifier.
2. **Bracket notation (`student["name"]` or `student[dynamicKey]`):** Used when property keys contain special characters, spaces, or when the key is evaluated dynamically at runtime from a variable.

---

### Q10: Why is `try...catch` important in client-side JavaScript?
**Answer:**
`try...catch` blocks provide defensive programming by catching runtime exceptions that would otherwise halt script execution and leave the web page in an unresponsive or broken state. In interactive applications like KBTCOE Connect, wrapping DOM queries, event bindings, and parsing routines inside `try...catch` ensures that any failure is logged gracefully without breaking adjacent features or freezing the user interface.

---

## 7. Conclusion

Assignment 06 successfully establishes the interactive JavaScript foundation for KBTCOE Connect. By implementing pure vanilla JavaScript constructs—ranging from higher-order array algorithms (`map`, `filter`, `find`, `reduce`) to safe dynamic DOM manipulation—the Student Directory operates seamlessly as an independently runnable, responsive, and robust university practical module.
