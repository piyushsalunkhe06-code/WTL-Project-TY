# Assignment 03 — CSS Styling

## 1. Assignment Metadata

- **Assignment Number:** 03
- **Title:** CSS Styling & The KBTCOE Design System
- **Module:** KBTCOE Connect — Component Cards, Typography, Selectors & The Box Model
- **Course / Lab:** Web Development Laboratory
- **Institution:** MVP Samaj's K.B.T. College of Engineering (KBTCOE), Nashik
- **Status:** Complete & Verified

---

## 2. Aim

To design, style, and visually format **KBTCOE Connect** using fundamental and intermediate CSS3 concepts, demonstrating:
1. All three CSS insertion methods (**Inline CSS**, **Internal CSS**, and **External CSS**).
2. Fundamental selector types (**Element**, **Class**, and **ID** selectors).
3. The **CSS Box Model** (content, padding, border, margin) with `box-sizing: border-box`.
4. Interactive **pseudo-classes** (`:hover`, `:active`, and `:nth-child(even)`).
5. The official **KBTCOE Connect Design System** (Primary Navy `#1E3A8A`, Secondary Blue `#2563EB`, Neutral Surface `#F8FAFC`, and Border `#E2E8F0`).

---

## 3. Objectives

1. Understand the syntax, scope, and cascading precedence of Inline, Internal, and External CSS.
2. Establish a consistent institutional color palette and typographic hierarchy.
3. Apply element selectors for resets and base typography, class selectors for modular components (cards, badges, skill pills, buttons), and ID selectors for unique landmark containers.
4. Apply the CSS Box Model across cards and container sections to control spacing and eliminate margin collapse issues.
5. Provide visual feedback on interactive elements using hover and active pseudo-classes.
6. Style tabular data using borders, padding, header backgrounds, and alternating row zebra striping.
7. Maintain strict separation of concerns without introducing JavaScript, React, or complex responsive layouts (which are reserved for Assignment 04).

---

## 4. Software & Technologies Used

| Tool / Technology | Version / Specification | Purpose |
| :--- | :--- | :--- |
| **HTML5** | W3C Standard | Document semantic structure |
| **CSS3** | W3C Standard | Visual presentation, box model, and layout |
| **Web Browser** | Google Chrome / Microsoft Edge / Mozilla Firefox | Rendering, visual inspection, and DevTools Box Model analysis |
| **Local Assets** | Scalable Vector Graphics (SVG) | `kbtcoe-logo.svg` and `rest-architecture.svg` |
| **Operating System** | Windows 10 / 11 | Practical development and testing environment |

---

## 5. Demonstration of the Three CSS Methods

This practical explicitly demonstrates all three techniques for applying CSS:

```
+-------------------------------------------------------------------------------+
|                             CSS SPECIFICITY CASCADE                           |
|                                                                               |
|   1. INLINE CSS (Highest Precedence - Specificity: 1,0,0,0)                   |
|      <div style="background-color: #FFFBEB; border-left: 8px solid ...">      |
|                                                                               |
|   2. INTERNAL CSS (Embedded in <head> - Specificity depends on selector)     |
|      <style> .internal-spotlight-ribbon { background-color: ... } </style>   |
|                                                                               |
|   3. EXTERNAL CSS (Linked via external file - Recommended for production)     |
|      <link rel="stylesheet" href="style.css">                                |
+-------------------------------------------------------------------------------+
```

### 5.1 Method 1: Inline CSS
- **Syntax:** Applied directly to an HTML element via the `style` attribute:
  ```html
  <div id="inline-css-announcement" 
       style="background-color: #FFFBEB; color: #92400E; border: 2px solid #F59E0B; border-left: 8px solid #B45309; padding: 14px 18px; margin-bottom: 24px; border-radius: 6px; font-size: 0.95rem; line-height: 1.5;">
    <strong>[DEMONSTRATION: INLINE CSS APPLIED] Notice from KBTCOE Placement Cell...</strong>
  </div>
  ```
- **Characteristics:** Highest selector specificity. Extremely difficult to maintain across multiple pages, but useful for one-off dynamic overrides or rapid debugging.

### 5.2 Method 2: Internal CSS
- **Syntax:** Defined within the `<head>` of the document enclosed inside a `<style>` block:
  ```html
  <style>
    .internal-header-subtext {
      color: #1E3A8A;
      background-color: #EFF6FF;
      display: inline-block;
      padding: 4px 12px;
      border: 1px dashed #93C5FD;
    }
    .internal-spotlight-ribbon {
      background-color: #FEF3C7;
      color: #92400E;
      border: 1px solid #FCD34D;
    }
  </style>
  ```
- **Characteristics:** Applies styles to the single HTML page where it is defined. Useful for page-specific layout exceptions or email templates.

### 5.3 Method 3: External CSS (Production Standard)
- **Syntax:** Linked in the `<head>` using `<link rel="stylesheet" href="style.css">`.
- **Characteristics:** Completely decouples content (HTML) from presentation (CSS). A single stylesheet can control the look and feel of thousands of pages across the enterprise platform, reducing bandwidth via browser caching.

---

## 6. Important Selectors & CSS Properties Explained

### 6.1 The CSS Box Model & `box-sizing: border-box`
```
+-----------------------------------------------------------+
| MARGIN (External spacing separating element from peers)   |
|   +-----------------------------------------------------+ |
|   | BORDER (Visible boundary around padding and content)| |
|   |   +-----------------------------------------------+ | |
|   |   | PADDING (Internal clear space around content) | | |
|   |   |   +-----------------------------------------+ | | |
|   |   |   | CONTENT (Text, images, child elements)  | | | |
|   |   |   +-----------------------------------------+ | | |
|   |   +-----------------------------------------------+ | |
|   +-----------------------------------------------------+ |
+-----------------------------------------------------------+
```
- By setting `* { box-sizing: border-box; }`, padding and border dimensions are included inside the element's total declared width and height, preventing unexpected horizontal overflow bugs.

### 6.2 Selectors Implemented
1. **Element Selectors:** `body`, `h1`, `h2`, `h3`, `p`, `a`, `ul`, `ol`, `li`, `table`, `th`, `td` — Establish clean typographic defaults, standard margins, and brand colors.
2. **Class Selectors (`.name`):**
   - `.card`: White background (`#FFFFFF`), rounded border (`border-radius: 8px`), subtle drop shadow (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06)`).
   - `.badge-primary`, `.badge-success`, `.badge-warning`: Small uppercase status pills.
   - `.skill-tag`: Light-blue pill tags with subtle borders for student skills.
   - `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`: Reusable call-to-action buttons.
   - `.opportunity-table`: Custom table styling with header contrast.
3. **ID Selectors (`#id`):**
   - `#main-header`: Unique styling for the institutional top banner.
   - `#portal-nav`: Deep navy navigation bar (`#1E3A8A`).
   - `#student-profile-section`: Unique profile showcase container.
   - `#featured-blog`: Highlighted blog with a prominent left accent border (`border-left: 5px solid #2563EB`).
4. **Pseudo-Classes:**
   - `:hover`: Changes button backgrounds (`.btn-primary:hover`), lifts cards (`.card:hover { transform: translateY(-2px); }`), and darkens links on mouse hover.
   - `:active`: Visual feedback when clicking a button or navigation link (`.btn-primary:active`).
   - `:nth-child(even)`: Implements zebra striping on table data rows for improved reading comfort.

---

## 7. How to Run the Practical

### Method 1: Direct File Launch
1. Open the file directly in your browser:
   `c:\Users\administrator.FABEXENG\Desktop\Projecy\assignments\03-CSS_Styling\index.html`
2. Double-click to launch in Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Method 2: Command Line (PowerShell)
```powershell
Start-Process "assignments\03-CSS_Styling\index.html"
```

### Method 3: Local HTTP Static Server
```bash
npx serve assignments/03-CSS_Styling
```
Open `http://localhost:3000` in your web browser.

---

## 8. Expected Visual Output

When loaded in a browser, the user will observe:
1. **Clean Professional Layout:** Centered 960px container on a soft slate background (`#F8FAFC`).
2. **Top Institutional Banner:** Pure white header with crisp KBTCOE vector logo, college affiliation subtext, and an internally styled lab badge.
3. **Deep Navy Navigation Bar:** Solid `#1E3A8A` background with crisp white links that highlight in vivid blue (`#2563EB`) on hover.
4. **Method Verification Notice:** Green-bordered callout box explaining the 3 CSS methods.
5. **Inline CSS Alert Banner:** Prominent warm amber alert box with a thick left border (`border-left: 8px solid #B45309`) showcasing inline CSS.
6. **Elevated Card Deck:**
   - Student profile card featuring a green verified badge, batch ribbon, clean typography, interactive skill tags, and action buttons.
   - Technical blog cards featuring a prominent left blue accent border, author bylines, and the styled 3-tier architecture diagram.
   - Student achievement card with amber honors badge.
7. **Styled Opportunities Table:** Deep navy header with white text, alternating row zebra striping (`#F8FAFC`), and subtle light-slate highlight (`#F1F5F9`) when hovering over any table row.
8. **Dark Footer:** Slate-navy footer (`#0F172A`) with light-blue hyperlinks (`#60A5FA`) and copyright details.

---

## 9. Concepts Demonstrated

- Comprehensive CSS syntax and ruleset structure.
- Comparative understanding of Inline, Internal, and External CSS.
- Cascading order, inheritance, and specificity hierarchy.
- The CSS Box Model and border-box sizing calculation.
- Modular component-based design (Cards, Badges, Buttons, Tags).
- Interactive states via CSS pseudo-classes (`:hover`, `:active`, `:nth-child`).

---

## 10. Viva Questions and Answers

### Q1: Explain the three ways to insert CSS into an HTML document. Which method is recommended for production enterprise platforms, and why?
**Answer:**  
The three methods are:
1. **Inline CSS:** Declared directly inside an HTML tag using the `style` attribute (e.g., `<p style="color: blue;">`).
2. **Internal CSS:** Written inside a `<style>` block within the document's `<head>`.
3. **External CSS:** Written in a standalone `.css` file and imported using `<link rel="stylesheet" href="style.css">`.

**Recommendation:** External CSS is universally recommended for enterprise production platforms because:
- It enforces strict **Separation of Concerns** (HTML for structure, CSS for presentation).
- A single external stylesheet can style hundreds of pages across an entire platform simultaneously.
- **Browser Caching:** Browsers download the external `.css` file once and cache it locally, drastically improving subsequent page load speeds and reducing server bandwidth.

---

### Q2: What is the CSS Box Model, and why is `box-sizing: border-box` considered a best practice?
**Answer:**  
Every HTML element rendered on a web page is modeled as a rectangular box comprising four concentric layers:
1. **Content:** The core area where text, images, or child elements appear.
2. **Padding:** Transparent spacing between the content and the element's border.
3. **Border:** The perimeter line enclosing the padding and content.
4. **Margin:** Transparent spacing outside the border separating the element from neighboring elements.

**Why `box-sizing: border-box` is essential:**  
In the default Box Model (`box-sizing: content-box`), setting `width: 300px; padding: 20px; border: 2px solid;` produces a total rendered width of `300 + 40 + 4 = 344px`. This often causes horizontal scrolling and broken grid columns.  
With `box-sizing: border-box`, the specified `width: 300px` is the **final outer width**; the browser automatically contracts the content area to accommodate the padding and border.

---

### Q3: How is CSS Specificity calculated? What happens when a conflict arises between an inline style, an ID selector, and a class selector?
**Answer:**  
CSS Specificity is a weight-based scoring system used by browsers to determine which rule applies when multiple conflicting rules target the same element. It is calculated as a four-part score `(a, b, c, d)`:
- `a`: Inline styles (Weight: 1000)
- `b`: ID selectors (Weight: 100)
- `c`: Class selectors, attribute selectors, and pseudo-classes (Weight: 10)
- `d`: Element (type) selectors and pseudo-elements (Weight: 1)

**Resolution:**  
If an element is targeted by an inline style `style="color: red;"`, an ID rule `#profile { color: blue; }`, and a class rule `.card { color: green; }`, the **inline style wins** (specificity 1000 > 100 > 10). If inline styles are absent, the ID selector overrides the class selector.

---

### Q4: What are CSS pseudo-classes? Explain how `:hover`, `:active`, and `:nth-child()` were used in this practical.
**Answer:**  
A CSS pseudo-class is a keyword added to a selector that specifies a special state of the targeted element.
- **`:hover`:** Triggers when the user moves their mouse pointer over an element. In this practical, `.btn-primary:hover` darkens the button background to `#1E40AF` and adds a subtle shadow, while `.card:hover` lifts the card slightly (`transform: translateY(-2px)`).
- **`:active`:** Triggers during the moment the user clicks down on an element, providing immediate tactile response (e.g., `.btn-primary:active` darkens further to `#172554`).
- **`:nth-child(even)`:** Selects elements based on their numeric index among siblings. We used `.opportunity-table tbody tr:nth-child(even)` to apply a light-slate background (`#F8FAFC`) to alternate rows, creating zebra striping without adding classes to individual `<tr>` tags.

---

### Q5: What is the difference between an ID selector and a class selector, and why should IDs be used sparingly in CSS styling?
**Answer:**  
- **ID Selector (`#id`):** Must be unique to exactly one element within an HTML document. Has a high specificity weight (100).
- **Class Selector (`.class`):** Can be reused across any number of elements throughout the entire application. Has a moderate specificity weight (10).

**Why IDs should be used sparingly in CSS:**  
IDs create high specificity barriers. Overusing ID selectors makes it very difficult to override styles with classes, reduces code reusability, and defeats modular design systems. Best practice dictates using classes for 95%+ of component styling, reserving IDs for top-level landmark containers or JavaScript DOM queries.

---

### Q6: What is the Cascade in CSS, and what factors determine the final computed style of an element?
**Answer:**  
The "Cascade" is the algorithm browsers use to resolve conflicting CSS property declarations. The cascade evaluates rules in the following order of precedence:
1. **Importance:** Declarations with `!important` win over normal declarations.
2. **Origin:** Developer author styles override user styles, which in turn override browser default (user-agent) stylesheets.
3. **Specificity:** The rule with the highest specificity score `(inline > ID > class > element)` wins.
4. **Source Order:** If two rules have identical importance, origin, and specificity, the **last rule declared in the stylesheet** overrides previous ones.

---

## 11. Contribution to the Final KBTCOE Connect Platform

- The CSS rules, palette variables, button styles, and card components developed in this practical form the core styling foundation for the React application in **Assignment 08** and the full-stack capstone in **Assignment 16**.
- The component classes (`.card`, `.btn-primary`, `.badge`, `.skill-tag`, `.opportunity-table`) will be imported directly into React JSX components.
- In **Assignment 04**, these styled components will be made fluid and adaptive across mobile, tablet, and desktop viewports using CSS media queries, Flexbox, and CSS Grid.
