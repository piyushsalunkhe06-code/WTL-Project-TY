# Assignment 01 — HTML Basics

## 1. Assignment Metadata

- **Assignment Number:** 01
- **Title:** HTML Basics
- **Module:** KBTCOE Connect — Student Welcome Hub & Opportunities Bulletin
- **Course / Lab:** Web Development Laboratory
- **Institution:** MVP Samaj's K.B.T. College of Engineering (KBTCOE), Nashik
- **Status:** Complete & Verified

---

## 2. Aim

To design, structure, and implement a foundational, accessible web page for **KBTCOE Connect** using core HTML5 elements, demonstrating structural document hierarchy, lists, tables with cell-spanning, images, hyperlinks, and form controls without using CSS or JavaScript.

---

## 3. Objectives

1. Understand the core syntax of HTML5, including doctype declaration, document head, body, and character encoding.
2. Structure page content with a logical typographic hierarchy (`<h1>` through `<h3>`) and text formatting tags (`<strong>`, `<em>`, `<abbr>`, `<mark>`, `<code>`).
3. Implement ordered (`<ol>`), unordered (`<ul>`), and description (`<dl>`) lists to present college departments, skills, and achievements.
4. Embed local vector graphics (`<img>`) using proper dimensioning and accessibility attributes (`alt`).
5. Build navigation mechanisms using internal anchor links (`#id`), external hyperlinks (`target="_blank"`), and mailto protocols (`mailto:`).
6. Design an accessible, structured tabular bulletin using `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `colspan`, `rowspan`, and `scope` attributes.
7. Collect prospective opportunity data and user feedback using standard HTML form controls (`<form>`, `<fieldset>`, `<input>`, `<select>`, `<textarea>`).

---

## 4. Software & Technologies Used

| Tool / Technology | Version / Specification | Purpose |
| :--- | :--- | :--- |
| **HTML5** | W3C Standard Living Specification | Page structure and semantic markup |
| **Web Browser** | Google Chrome / Microsoft Edge / Mozilla Firefox | Rendering and document inspection |
| **Local Vector Asset** | Scalable Vector Graphics (SVG) | High-definition college branding logo |
| **Operating System** | Windows 10 / 11 | Execution environment |

---

## 5. Important Code Explanation

### 5.1 Document Skeleton & Meta Configuration
The document begins with the modern HTML5 doctype declaration:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KBTCOE Connect — The Professional Network for KBTCOE Students</title>
</head>
```
- `<!DOCTYPE html>` informs modern browsers to render in standards-compliant mode rather than quirks mode.
- `<meta charset="UTF-8">` ensures proper encoding for symbols, dashes, and international character sets.
- `<meta name="viewport" ...>` sets viewport scaling parameters for responsive readiness.

### 5.2 Header & Image Integration
```html
<img src="kbtcoe-logo.svg" alt="KBTCOE Connect Official Banner Logo" width="480" height="100">
```
- Demonstrates embedding local graphic assets (`kbtcoe-logo.svg`).
- The `alt` attribute provides descriptive text for screen readers or when images fail to load.
- Explicit `width` and `height` dimensions prevent cumulative layout shift (CLS).

### 5.3 Internal Page Navigation (Fragment Identifiers)
```html
<!-- Anchor destination -->
<a id="top"></a>

<!-- Anchor jump trigger -->
<a href="#bulletin-table">Training, Placement & Opportunities Bulletin</a>
```
- By prefixing an anchor link with `#`, the browser scrolls directly to the element with matching `id`, facilitating in-page navigation without external network calls.

### 5.4 List Types Implementation
The practical demonstrates three distinct list types:
1. **Unordered List (`<ul>`):** Used for platform benefits and technical skill tags where sequence is non-ordinal.
2. **Ordered List (`<ol>`):** Used for academic engineering departments to represent an enumerated catalog.
3. **Description List (`<dl>`, `<dt>`, `<dd>`):** Used in the student spotlight section to map project names (`<dt>`) to their detailed outcome summaries (`<dd>`).

### 5.5 Advanced Tabular Data (`<table>`)
```html
<table border="1" cellpadding="10" cellspacing="0" width="100%">
  <caption><strong>Table 1.1: Official KBTCOE Opportunities Bulletin</strong></caption>
  <thead>
    <tr bgcolor="#E2E8F0">
      <th scope="col">ID</th>
      ...
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" rowspan="2"><strong>OPP-102</strong></td>
      <td align="center" rowspan="2">Summer Internship</td>
      <td>Frontend Web Development Intern</td>
      <td rowspan="2">Nashik Engineering Cluster (NEC) Innovation Hub</td>
      ...
    </tr>
    ...
    <tr bgcolor="#FEF3C7">
      <td colspan="8" align="center">
        <strong>Mandatory Notice:</strong> Minimum 75% attendance required...
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr bgcolor="#E2E8F0">
      <th colspan="6">Total Active Opportunities Displayed: 5 ...</th>
      <th colspan="2">Status: Open</th>
    </tr>
  </tfoot>
</table>
```
- **Semantic Partitioning:** Structured via `<thead>`, `<tbody>`, and `<tfoot>`.
- **`rowspan="2"`:** Groups two distinct internship roles under a single sponsoring company and ID.
- **`colspan="8"`:** Expands a priority institutional notification across all 8 columns.
- **`colspan="6"` and `colspan="2"`:** Partitions the table footer into a summary block and application status block.
- **Accessibility:** Uses `scope="col"` and `scope="row"` so assistive screen readers accurately pair data cells with their respective headers.

### 5.6 Student Submission & Inquiry Form
```html
<form action="#" method="post">
  <fieldset>
    <legend><strong>Student & Inquiry Information</strong></legend>
    <label for="student-name">Full Name:</label>
    <input type="text" id="student-name" name="student_name" required>
    ...
  </fieldset>
</form>
```
- `<fieldset>` and `<legend>` semantically group form controls.
- `<label for="...">` explicitly links descriptive labels to input fields via the `id` attribute, expanding the interactive click target.
- Includes `text`, `email`, `radio`, `checkbox`, `select`, `textarea`, `submit`, and `reset` elements.

---

## 6. How to Run the Practical

### Method 1: Direct Browser Launch (Easiest)
1. Locate the file on your local machine:
   `c:\Users\administrator.FABEXENG\Desktop\Projecy\assignments\01-HTML_Basics\index.html`
2. Double-click the file to open it in your default web browser (Chrome, Edge, or Firefox).
3. Alternatively, open your browser and press `Ctrl + O`, then select `index.html`.

### Method 2: Command Line via Windows PowerShell
Run the following command from the project root:
```powershell
Start-Process "assignments\01-HTML_Basics\index.html"
```

### Method 3: Static HTTP Server (Node.js)
If you wish to test via HTTP:
```bash
npx serve assignments/01-HTML_Basics
```
Open `http://localhost:3000` in your web browser.

---

## 7. Expected Output

When opened in any modern browser, the user will observe:
1. **Header:** Top banner with the KBTCOE Connect blue vector badge, affiliation details (SPPU, AICTE), and campus location.
2. **Main Title & Intro:** "KBTCOE Connect — The Professional Network for KBTCOE Students" with descriptive paragraphs.
3. **Quick Navigation:** Bulleted list of hyperlinks that instantly jump to page sections when clicked.
4. **About Section:** Background on MVP Samaj and KBTCOE, key benefits list, and institutional notice.
5. **Departments Section:** An ordered list from 1 to 7 detailing all engineering branches (Computer, IT, AI&DS, E&TC, Mechanical, Civil, Instrumentation).
6. **Featured Student Spotlight:** A structured table displaying a synthetic student profile (Rohit Patil, PRN `72183921B`), skills, and milestones using description lists.
7. **Opportunities Bulletin Table:** A prominent border-defined table with light-slate header (`#E2E8F0`), alternating multi-row cells for NEC Innovation Hub internships (`rowspan="2"`), a highlighted yellow institutional notice (`colspan="8"`), and a summary footer.
8. **Inquiry Form:** A boxed fieldset containing labels, text inputs, radio buttons for study year, checkboxes for inquiry type, a multi-line textarea, and submit/reset buttons.
9. **Footer:** Contact hyperlinks (`mailto:support@kbtcoe.org`), external link to official college portal (`kbtcoe.org`), and a "Back to Top" jump link.

---

## 8. Concepts Demonstrated

- **Pure Structural HTML:** Strict separation of content from presentation (zero inline or external CSS).
- **Document Outline & Semantics:** Hierarchical heading usage (`<h1>`, `<h2>`, `<h3>`).
- **Table Design & Accessibility:** Complex cell merging (`colspan`, `rowspan`), scoping (`scope="col"`), and structural division (`<thead>`, `<tbody>`, `<tfoot>`).
- **Hyperlink Archetypes:** Internal page anchors (`#top`, `#bulletin-table`), external references (`target="_blank"` with `rel="noopener noreferrer"`), and email triggers (`mailto:`).
- **Form Controls:** Semantic forms with inputs, textareas, drop-down menus, and reset controls.

---

## 9. Viva Questions and Answers

### Q1: What is the significance of the `<!DOCTYPE html>` declaration?
**Answer:**  
`<!DOCTYPE html>` is not an HTML tag; it is an instruction to the web browser about the document type and version of HTML being used. In modern web standards (HTML5), it is case-insensitive and required at the very top of every document. It instructs the browser to render the page in **Standards Mode** according to W3C specifications, rather than **Quirks Mode** (which emulates legacy 1990s browser bugs).

---

### Q2: Explain the difference between block-level elements and inline elements in HTML, giving examples from this practical.
**Answer:**  
- **Block-level elements** always begin on a new line, take up the entire available width of their parent container by default, and can contain other block or inline elements. Examples used in this practical: `<h1>`, `<p>`, `<table>`, `<ol>`, `<ul>`, `<form>`, `<fieldset>`.
- **Inline elements** do not start on a new line; they occupy only as much width as required by their content and can be nested within block elements without breaking the flow. Examples used in this practical: `<a>`, `<strong>`, `<em>`, `<abbr>`, `<code>`, `<mark>`, `<img>`, `<input>`.

---

### Q3: How do `colspan` and `rowspan` attributes work in an HTML table? Explain using an example from the Opportunity Bulletin.
**Answer:**  
- **`colspan` (Column Span):** Defines the number of columns a single cell (`<td>` or `<th>`) should stretch horizontally across the table. In our Opportunity Bulletin table, the mandatory notice row uses `<td colspan="8">` to stretch across all eight columns of the table without requiring separate empty cells.
- **`rowspan` (Row Span):** Defines the number of rows a single cell should span vertically down the table. In the bulletin table, Opportunity ID `OPP-102` (NEC Innovation Hub) uses `<td rowspan="2">` so that the ID, Category ("Summer Internship"), and Organization cells vertically span two rows, each representing a distinct internship track (Web Development and Industrial IoT).

---

### Q4: Why is the `alt` attribute essential in the `<img>` tag?
**Answer:**  
The `alt` (alternative text) attribute serves three critical functions:
1. **Accessibility (Screen Readers):** Visually impaired users rely on assistive software (such as NVDA or JAWS) which reads the `alt` description aloud to convey what the image depicts.
2. **Fallback Rendering:** If an image fails to load due to a slow network, missing file, or broken path, the browser renders the `alt` text in place of the broken image.
3. **Search Engine Optimization (SEO):** Search engine web crawlers index `alt` text to understand the subject matter of graphics on the page.

---

### Q5: What is the difference between relative, absolute, and fragment hyperlink references?
**Answer:**  
- **Absolute URLs:** Contain the full protocol and domain name pointing to an external resource (e.g., `<a href="https://kbtcoe.org">`).
- **Relative URLs:** Point to a file or path relative to the current document's directory on the same server (e.g., `<img src="kbtcoe-logo.svg">`).
- **Fragment Identifiers (Anchor Links):** Begin with a hash symbol `#` followed by an element ID (e.g., `<a href="#bulletin-table">`). They instruct the browser to scroll internally to the element bearing the matching ID (`<section id="bulletin-table">`) without refreshing or issuing an HTTP GET request.

---

### Q6 (Bonus): What are the benefits of using `<thead>`, `<tbody>`, and `<tfoot>` in tables?
**Answer:**  
1. **Semantic Clarity:** They clearly segregate header rows, data rows, and calculated summary rows.
2. **Print Styles:** When printing long tables across multiple pages, browsers can repeat the `<thead>` and `<tfoot>` on every printed page.
3. **Independent Scrolling:** When CSS is applied later, `<tbody>` can be given an independent scrollbar while keeping `<thead>` and `<tfoot>` pinned.

---

## 10. Contribution to the Final KBTCOE Connect Platform

This practical provides the **structural blueprint** for KBTCOE Connect:
- The data fields designed here (student PRN, branch, year, skill sets, and opportunity categories) form the relational entities in the final MySQL database schema.
- The table structure developed here directly maps to the `OpportunitiesTable` and `StudentDirectory` React components implemented in Assignments 08, 09, and 16.
- The next step (Assignment 02) will replace traditional structural tags with HTML5 semantic elements (`<header>`, `<nav>`, `<article>`, `<section>`, `<aside>`, `<footer>`).
