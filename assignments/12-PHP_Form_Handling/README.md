# Assignment 12: PHP Form Handling & Session Authentication

**Course:** Web Technology Laboratory / Full-Stack Web Development  
**Institution:** MVPS's KBT College of Engineering (KBTCOE), Nashik  
**Academic Year:** 2025–2026  
**Module:** Assignment 12 (`12-PHP_Form_Handling`)  
**Platform Track:** KBTCOE Connect — The Professional Network for KBTCOE Students  

---

## 1. Aim

To design, develop, and verify a secure student registration, authentication, and session management module for **KBTCOE Connect** using native PHP 8+, demonstrating server-side form handling, input sanitization, data validation with `filter_var()`, BCrypt password hashing and verification, session lifecycle management (`session_start()`, `session_regenerate_id()`, `session_destroy()`), output escaping via `htmlspecialchars()`, and access control guards.

---

## 2. Learning Objectives

By completing this practical, students will be able to:
1. Understand the difference between HTTP `GET` and `POST` methods in form submissions.
2. Implement strict **server-side validation** that operates independently of client-side browser checks.
3. Validate email addresses using PHP's native `filter_var()` and regular expression pattern matching for student PRNs.
4. Securely hash and verify passwords using industry-standard `password_hash()` and `password_verify()`.
5. Implement stateful web authentication using PHP **Sessions** (`$_SESSION`).
6. Prevent **Session Fixation** attacks by regenerating session identifiers upon authentication via `session_regenerate_id()`.
7. Protect against **Cross-Site Scripting (XSS)** by escaping dynamic HTML output using `htmlspecialchars()`.
8. Implement the **POST/Redirect/GET (PRG)** design pattern to prevent duplicate form submissions upon browser refresh.
9. Distinguish between clearing session data and destroying the active session.

---

## 3. Software and Hardware Requirements

### Software Requirements
- **Operating System:** Windows 10/11, Linux, or macOS.
- **PHP Interpreter:** PHP `8.1+` (Verified on PHP `8.3.33`).
- **Web Server:** PHP Built-in CLI Web Server (`php -S localhost:8000`), Apache HTTP Server, or Nginx.
- **Web Browser:** Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge).
- **Code Editor:** Visual Studio Code or any standard text editor.

### Hardware Requirements
- 64-bit multi-core processor.
- Minimum 4 GB RAM.
- 500 MB free storage for local development tools.

---

## 4. Theory of PHP Form Handling

When a user submits an HTML form, the browser packages form controls and values into an HTTP request directed at the server script specified in the `<form action="...">` attribute.

PHP automatically parses incoming HTTP request payloads into superglobal associative arrays:
- **`$_GET`:** Collects form values appended to the request URL as query parameters (`?key=val`).
- **`$_POST`:** Collects values transmitted in the HTTP request body.
- **`$_SERVER`:** Contains headers, paths, script locations, and request method metadata (e.g., `$_SERVER['REQUEST_METHOD']`).

---

## 5. HTTP GET vs. HTTP POST

| Feature | HTTP GET | HTTP POST |
| :--- | :--- | :--- |
| **Data Transmission** | Appended to the URL in the query string (`?email=user%40kbtcoe.org`). | Encapsulated in the body of the HTTP request. |
| **Visibility** | Visible in browser address bar, server access logs, and browser history. | Hidden from address bar and casual inspection. |
| **Data Length** | Limited by URL length restrictions (typically ~2,048 characters). | No strict limit; configurable via `post_max_size` in `php.ini`. |
| **Caching & Bookmarking**| Can be cached and bookmarked. | Cannot be cached or bookmarked safely. |
| **Idempotence** | **Idempotent:** Safe for search queries and read-only lookups. | **Non-Idempotent:** Used for state-modifying actions (create, update, delete). |
| **Usage for Authentication**| **UNSAFE:** Never send passwords or sensitive credentials via GET. | **MANDATORY:** Always transmit login credentials and registration data via POST. |

---

## 6. Server-Side Input Validation

Client-side validation (HTML5 attributes and JavaScript) improves user experience by catching errors quickly, but it provides **zero security**. A malicious user can disable JavaScript, modify client scripts, or submit arbitrary payloads using command-line tools like `curl` or Postman.

Therefore, **server-side validation is mandatory**:
1. **Presence Verification:** Check that required fields are submitted and non-empty using `trim($val) === ''`.
2. **Data Sanitization & Trimming:** Strip leading and trailing whitespace using `trim()`.
3. **Email Validation:** Use `filter_var($email, FILTER_VALIDATE_EMAIL)` to verify RFC-compliant email syntax.
4. **Pattern Matching:** Validate student PRNs against configurable institutional patterns using `preg_match()`.
5. **Whitelist Verification:** Check branch and academic year selections against strictly allowed arrays using `in_array($val, ALLOWED_LIST, true)`.
6. **Password Matching:** Compare passwords using strict identity (`$password === $confirm_password`).

---

## 7. PHP Sessions & Lifecycle

HTTP is a **stateless protocol**—each request is independent, and the server does not inherently remember previous requests from the same client. **PHP Sessions** solve this by associating a client with persistent server-side storage:

1. When `session_start()` executes, PHP checks for a session cookie named `PHPSESSID` in incoming request headers.
2. If none exists, PHP generates a cryptographically random session ID and sends a `Set-Cookie: PHPSESSID=...` response header.
3. On subsequent requests, the browser transmits the `PHPSESSID` cookie. PHP locates the corresponding session data on disk or memory and populates the `$_SESSION` superglobal.
4. **Session Fixation Prevention:** Calling `session_regenerate_id(true)` upon login creates a fresh session identifier and deletes the old session record, preventing session hijacking.

---

## 8. Password Hashing & Verification (BCrypt)

> [!CAUTION]
> **Never store plaintext passwords or obsolete hashes (MD5 / SHA1) in application storage!**

Native PHP provides modern, cryptographically secure password handling:

```php
// 1. Password Hashing upon Registration
$hash = password_hash($plaintext_password, PASSWORD_BCRYPT, ['cost' => 10]);

// 2. Password Verification upon Sign In
if (password_verify($submitted_password, $stored_hash)) {
    // Password is valid
} else {
    // Invalid credentials
}
```

- **Salt Included Automatically:** `password_hash()` generates a cryptographically random 128-bit salt and bundles it directly into the resulting 60-character hash string.
- **Timing-Attack Resistance:** `password_verify()` compares credentials using a constant-time algorithm, preventing side-channel timing attacks.

---

## 9. Authentication Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Browser
    participant Server as PHP Engine
    participant Session as $_SESSION Store

    Note over Student,Session: 1. Student Registration Flow
    Student->>Browser: Enters profile & password (register.php)
    Browser->>Server: HTTP POST (name, email, PRN, branch, password)
    Server->>Server: Server-side validation (filter_var, preg_match)
    Server->>Server: password_hash(password, PASSWORD_BCRYPT)
    Server->>Session: Store user record in $_SESSION['registered_users']
    Server->>Browser: HTTP 302 Redirect to login.php (PRG pattern)

    Note over Student,Session: 2. Student Authentication Flow
    Student->>Browser: Enters email & password (login.php)
    Browser->>Server: HTTP POST (email, password)
    Server->>Session: Lookup user by normalized email
    Server->>Server: password_verify(password, hash)
    Server->>Server: session_regenerate_id(true) [Fixation Defense]
    Server->>Session: Store authenticated payload in $_SESSION['user']
    Server->>Browser: HTTP 302 Redirect to dashboard.php

    Note over Student,Session: 3. Protected Dashboard Access
    Student->>Browser: Accesses dashboard.php
    Browser->>Server: HTTP GET with PHPSESSID cookie
    Server->>Session: require_auth() checks $_SESSION['user']
    Server->>Browser: Render student console with htmlspecialchars()

    Note over Student,Session: 4. Student Sign Out
    Student->>Browser: Clicks "Sign Out" (logout.php)
    Browser->>Server: HTTP GET /logout.php
    Server->>Server: $_SESSION = []; setcookie(); session_destroy()
    Server->>Browser: HTTP 302 Redirect to login.php
```

---

## 10. Explanation of Project Files

```text
assignments/12-PHP_Form_Handling/
├── index.php                # Landing page introducing practical modules and test credentials
├── register.php             # Registration form controller with server-side validation & hashing
├── login.php                # Authentication controller with password_verify & session regeneration
├── dashboard.php            # Protected student dashboard console enforcing require_auth()
├── logout.php               # Session termination controller clearing cookies and session state
├── includes/
│   ├── bootstrap.php        # Configures secure session cookies and initializes session store
│   ├── functions.php        # Core utility library (escaping, validation, hashing, flash messages)
│   └── header.php           # Shared semantic navigation, branding, and flash alert renderer
├── assets/
│   ├── style.css            # Responsive styling following KBTCOE design system
│   └── kbtcoe-logo.svg      # Official KBTCOE Connect brand vector logo
└── README.md                # Practical laboratory manual and examination guide
```

---

## 11. Important PHP Functions Used

| PHP Function | Purpose in Practical |
| :--- | :--- |
| **`htmlspecialchars()`** | Escapes special characters (`<`, `>`, `&`, `"`, `'`) to prevent Cross-Site Scripting (XSS). |
| **`filter_var()`** | Validates email syntax against RFC standards with `FILTER_VALIDATE_EMAIL`. |
| **`password_hash()`** | Generates a salted, computational-cost BCrypt hash of the plaintext password. |
| **`password_verify()`** | Securely compares submitted plaintext passwords against the stored hash in constant time. |
| **`session_start()`** | Initializes session environment or resumes existing session via `PHPSESSID`. |
| **`session_regenerate_id()`** | Generates a new session ID to defend against session fixation attacks. |
| **`session_destroy()`** | Destroys all registered session data on the server. |
| **`header("Location: ...")`** | Sends HTTP redirection header to implement the Post/Redirect/Get (PRG) pattern. |
| **`preg_match()`** | Evaluates regular expressions for PRN and student ID format validation. |
| **`in_array()`** | Verifies submitted dropdown options against whitelisted arrays with strict type checking. |

---

## 12. Installation and Execution Steps

### 12.1 Verify PHP Installation
Open PowerShell and verify your PHP version:
```powershell
php -v
```
*(Expected: PHP 8.1.0 or higher. Environment verified on PHP 8.3.33).*

### 12.2 Launch PHP Built-In Web Server
Navigate to the practical directory and start the local development server:
```powershell
cd "c:\Users\administrator.FABEXENG\Desktop\Projecy\assignments\12-PHP_Form_Handling"
php -S localhost:8000
```

### 12.3 Open in Web Browser
Navigate to:
```
http://localhost:8000/
```

---

## 13. Sample Testing Procedure

### Test 1: Testing Pre-Seeded Demonstration Account
1. Open `http://localhost:8000/login.php`.
2. Enter the pre-seeded credentials:
   - **Email:** `sanket.patil@kbtcoe.org`
   - **Password:** `Password@123`
3. Click **Sign In**.
4. **Expected Result:** Successfully redirects to `dashboard.php`, displaying Sanket Patil's name, Computer Engineering department, and Third Year status.

### Test 2: Testing Registration Validation
1. Open `http://localhost:8000/register.php`.
2. Submit with empty fields.
3. **Expected Result:** Rejects submission; displays inline field-level errors for all mandatory inputs.
4. Enter an invalid email `test@invalid` and password of 4 characters.
5. **Expected Result:** Flags invalid email syntax and enforces minimum 8 characters password length.

### Test 3: Testing Duplicate Registration Prevention
1. In `register.php`, attempt to register with `sanket.patil@kbtcoe.org`.
2. **Expected Result:** Rejects registration with error: *"A student account with this email address already exists."*

### Test 4: Testing Unauthenticated Dashboard Interception
1. Sign out by clicking **Sign Out** or navigating to `logout.php`.
2. Manually enter `http://localhost:8000/dashboard.php` into the address bar.
3. **Expected Result:** Intercepted by `require_auth()`; redirects immediately to `login.php` with a danger alert banner: *"Access restricted. Please sign in with your student credentials..."*

---

## 14. Clearing Session Data vs. Destroying a Session

- **Clearing Session Data (`$_SESSION = []`):** Empties the in-memory array of session variables for the current script execution. The session file still exists on disk and the client continues using the same session ID.
- **Destroying a Session (`session_destroy()`):** Deletes the underlying session data file from the server storage. To ensure a complete logout, developers must:
  1. Empty `$_SESSION = [];`
  2. Expire the client's session cookie with `setcookie(session_name(), '', time() - 42000, ...)`.
  3. Call `session_destroy()`.

---

## 15. Security Limitations of Session-Only Account Storage

In this laboratory practical, demonstration user accounts are stored inside PHP session memory (`$_SESSION['registered_users']`) to maintain zero external dependencies before Assignment 13.

**Production Limitations:**
1. **Volatile Lifecycle:** If the session expires, the browser closes, or the server restarts, registered accounts are lost.
2. **Single-Client Isolation:** Different browsers or devices do not share sessions, preventing multi-user interaction.
3. **Scalability:** Production systems require durable relational databases (MySQL / PostgreSQL) with indexing, transactions, and foreign key constraints (implemented in Assignment 13 and 15).

---

## 16. Testing Checklist

- [x] All 8 PHP files pass `php -l` lint checks with zero syntax errors.
- [x] Home page (`index.php`) renders branding, action cards, and seed account credentials.
- [x] Empty registration fields are rejected with descriptive field-level error messages.
- [x] Invalid email syntax is rejected via `filter_var()`.
- [x] Passwords shorter than 8 characters are rejected.
- [x] Mismatched password confirmations are rejected.
- [x] Invalid department and academic year dropdown values are rejected.
- [x] Duplicate emails within the session are rejected.
- [x] Registered passwords are encrypted as BCrypt hashes (never stored as plaintext).
- [x] Correct credentials allow successful login.
- [x] Incorrect credentials output a generic error message (preventing email enumeration).
- [x] Session ID is regenerated on login (`session_regenerate_id(true)`).
- [x] Unauthenticated visits to `dashboard.php` are intercepted and redirected to `login.php`.
- [x] Logging out destroys the authenticated session and cookie.
- [x] Dashboard is inaccessible after logout without re-authenticating.
- [x] User-provided inputs are escaped with `htmlspecialchars()` before output rendering.
- [x] Assignments 01 through 11 remain completely intact and unmodified.

---

## 17. Viva Voce Questions and Concise Answers

### Q1: What is the main difference between HTTP GET and POST methods?
**Answer:**
GET passes form data in the URL query string, making it visible in browser history and server logs with limited length, whereas POST transmits data in the HTTP request body without exposing it in the URL, making it mandatory for passwords and sensitive operations.

---

### Q2: Why is client-side validation alone insufficient for web security?
**Answer:**
Client-side validation runs in the user's browser and can be completely bypassed by disabling JavaScript, modifying DOM inputs, or sending forged HTTP requests directly using tools like `curl`. Server-side validation guarantees that only clean, valid data is accepted regardless of the client.

---

### Q3: How does PHP handle sessions across stateless HTTP requests?
**Answer:**
When `session_start()` is called, PHP sends a session cookie (`PHPSESSID`) containing a unique identifier to the browser. On subsequent requests, the browser sends this cookie back, allowing PHP to look up the corresponding session data stored on the server and populate `$_SESSION`.

---

### Q4: Why should passwords never be hashed with MD5 or SHA1?
**Answer:**
MD5 and SHA1 are general-purpose, high-speed cryptographic algorithms. Modern GPUs can calculate billions of MD5 hashes per second, making them extremely vulnerable to brute-force attacks and precomputed rainbow tables. BCrypt (`password_hash`) uses a slow, adaptive work factor designed specifically for passwords.

---

### Q5: What is Session Fixation, and how does `session_regenerate_id()` prevent it?
**Answer:**
In a session fixation attack, an attacker tricks a victim into authenticating with a known session ID. If the server does not change the ID upon login, the attacker can use that fixed ID to hijack the session. `session_regenerate_id(true)` replaces the session ID with a new random identifier and deletes the old session upon authentication.

---

### Q6: What does `filter_var($email, FILTER_VALIDATE_EMAIL)` do?
**Answer:**
It evaluates an email string against the RFC 822/5322 syntax standards, checking for valid local parts, the `@` symbol, and a properly structured domain name, returning the validated email or `false` if invalid.

---

### Q7: Explain the Post/Redirect/Get (PRG) pattern and its benefit.
**Answer:**
PRG is a web development pattern where a form processed via POST finishes by returning an HTTP redirect (302/303) to a GET endpoint (e.g., `login.php` or `dashboard.php`). This prevents accidental duplicate form submissions if the user refreshes the page or presses the browser back button.

---

### Q8: How does `htmlspecialchars()` protect against Cross-Site Scripting (XSS)?
**Answer:**
`htmlspecialchars()` converts special characters like `<`, `>`, `&`, `"`, and `'` into their corresponding HTML entities (`&lt;`, `&gt;`, `&amp;`, `&quot;`, `&#039;`). This ensures the browser displays them as literal text rather than parsing them as executable HTML tags or scripts.

---

### Q9: What parameters are required to completely destroy a session in PHP?
**Answer:**
To terminate a session completely:
1. Clear the session array: `$_SESSION = []`
2. Expire the session cookie in the past: `setcookie(session_name(), '', time() - 42000, ...)`
3. Destroy the server session file: `session_destroy()`

---

### Q10: Why should a login failure message be generic rather than specific?
**Answer:**
A specific error message like *"Email does not exist"* allows attackers to perform account enumeration (harvesting valid email addresses). A generic message like *"Invalid email address or password"* protects user privacy by revealing nothing about the existence of the account.

---

### Q11: What is a Flash Message in web applications?
**Answer:**
A flash message is a temporary notification stored in the session that is displayed to the user on the subsequent request and immediately removed from storage, ensuring it is only shown once (e.g., *"Registration completed successfully"*).

---

### Q12: Why are session cookie flags like `HttpOnly` and `SameSite` critical?
**Answer:**
- `HttpOnly`: Prevents client-side scripts (JavaScript) from accessing `document.cookie`, mitigating cookie theft via XSS.
- `SameSite=Lax`: Restricts cookie transmission on cross-site requests, protecting against Cross-Site Request Forgery (CSRF).

---

## 18. Conclusion

Assignment 12 establishes essential server-side web application security concepts for KBTCOE Connect. By demonstrating strict server-side validation, BCrypt password hashing, session regeneration, access control guards, and output escaping, this practical bridges client-side interfaces with robust server architectures, preparing the project for persistent database integration in Assignment 13.
