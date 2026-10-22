/**
 * Academic Regression Verification Suite
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name}`);
    failed++;
  }
}

console.log('============================================================');
console.log('  KBTCOE Connect - Assignments 01-15 Regression Verification');
console.log('============================================================\n');

const previousPracticals = [
  { no: '01', dir: '01-HTML_Basics', keyFile: 'index.html', title: 'HTML Basics' },
  { no: '02', dir: '02-Semantic_HTML', keyFile: 'index.html', title: 'Semantic HTML5 Hierarchy' },
  { no: '03', dir: '03-CSS_Styling', keyFile: 'style.css', title: 'CSS Box Model & Design System' },
  { no: '04', dir: '04-Responsive_Design', keyFile: 'responsive.css', title: 'Responsive Flexbox & Grid' },
  { no: '05', dir: '05-CSS_Positioning', keyFile: 'positioning.css', title: 'CSS Positioning & Modals' },
  { no: '06', dir: '06-JavaScript_Basics', keyFile: 'app.js', title: 'ES6 Array Filtering & Directory' },
  { no: '07', dir: '07-Frontend_Validation', keyFile: 'validation.js', title: 'Client Form Validation & RegEx' },
  { no: '08', dir: '08-React_SPA', keyFile: 'package.json', title: 'React 18 SPA Shell & Vite' },
  { no: '09', dir: '09-React_Concepts', keyFile: 'package.json', title: 'React Hooks & State Management' },
  { no: '10', dir: '10-Fetch_API_JSON', keyFile: 'app.js', title: 'Asynchronous Fetch API & JSON' },
  { no: '11', dir: '11-DOM_Manipulation', keyFile: 'app.js', title: 'DOM Events, Likes & Comments' },
  { no: '12', dir: '12-PHP_Form_Handling', keyFile: 'index.php', title: 'PHP Form Sanitization & Sessions' },
  { no: '13', dir: '13-PHP_MySQL_CRUD', keyFile: 'index.php', title: 'PHP PDO MySQL CRUD Portal' },
  { no: '14', dir: '14-Node_Express_Server', keyFile: 'server.js', title: 'Express REST Server & Middleware' },
  { no: '15', dir: '15-REST_API_Database', keyFile: 'server.js', title: 'Persistent Node + MariaDB REST API' }
];

for (const p of previousPracticals) {
  const fullDir = path.join(__dirname, '..', '..', p.dir);
  const fullKey = path.join(fullDir, p.keyFile);
  const fullReadme = path.join(fullDir, 'README.md');

  const dirExists = fs.existsSync(fullDir);
  const keyExists = fs.existsSync(fullKey) && fs.statSync(fullKey).size > 0;
  const readmeExists = fs.existsSync(fullReadme) && fs.statSync(fullReadme).size > 0;

  assert(dirExists && keyExists && readmeExists, `Practical ${p.no} (${p.title}): Verified intact with ${p.keyFile} & README.md`);
}

console.log('\n============================================================');
console.log(`  Regression Verification: ${passed} Passed, ${failed} Failed`);
console.log('============================================================\n');

process.exit(failed === 0 ? 0 : 1);
