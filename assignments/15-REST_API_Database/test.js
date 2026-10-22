/**
 * Automated Verification & Integration Test Suite
 * Assignment 15: REST API & Database - Persistent KBTCOE Connect Backend
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const fs = require('fs');
const path = require('path');
const { pool, checkConnection } = require('./config/database');
const { app } = require('./server');

const TEST_PORT = 5001;
let server;
let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  [FAIL] ${testName} ${details ? '- ' + details : ''}`);
    failedCount++;
  }
}

async function request(method, routePath, options = {}) {
  const { body, headers = {} } = options;
  const url = `http://localhost:${TEST_PORT}${routePath}`;
  const fetchOptions = {
    method,
    headers: { ...headers }
  };

  if (body !== undefined) {
    if (typeof body === 'string') {
      fetchOptions.body = body;
    } else {
      fetchOptions.body = JSON.stringify(body);
      fetchOptions.headers['Content-Type'] = 'application/json';
    }
  }

  const res = await fetch(url, fetchOptions);
  let json = null;
  let text = '';
  try {
    text = await res.text();
    json = JSON.parse(text);
  } catch (e) {
    // not JSON
  }

  return { status: res.status, headers: res.headers, json, text };
}

async function runTests() {
  console.log('============================================================');
  console.log('  KBTCOE Connect - Assignment 15 Test Suite Execution');
  console.log('============================================================\n');

  // SUITE 1: Deliverables & Directory Structure
  console.log('--- Suite 1: Deliverables & Directory Structure ---');
  const requiredFiles = [
    'package.json',
    '.env',
    '.env.example',
    '.gitignore',
    'README.md',
    'server.js',
    'config/database.js',
    'database/schema.sql',
    'database/seed.sql',
    'controllers/authController.js',
    'controllers/opportunityController.js',
    'controllers/postController.js',
    'middleware/authMiddleware.js',
    'middleware/errorHandler.js',
    'middleware/notFound.js',
    'routes/auth.js',
    'routes/opportunities.js',
    'routes/posts.js',
    'utils/validators.js',
    'public/index.html',
    'public/style.css',
    'public/app.js',
    'public/kbtcoe-logo.svg'
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(__dirname, relPath);
    const exists = fs.existsSync(fullPath);
    const size = exists ? fs.statSync(fullPath).size : 0;
    assert(exists && size > 0, `File exists & non-empty: ${relPath}`, `Size: ${size} bytes`);
  }

  // SUITE 2: Previous Assignments Preservation Check
  console.log('\n--- Suite 2: Assignments 01-14 Preservation Check ---');
  const previousAssignments = [
    'assignments/01-HTML_Basics/index.html',
    'assignments/02-Semantic_HTML/index.html',
    'assignments/03-CSS_Styling/index.html',
    'assignments/04-Responsive_Design/index.html',
    'assignments/05-CSS_Positioning/index.html',
    'assignments/06-JavaScript_Basics/index.html',
    'assignments/07-Frontend_Validation/index.html',
    'assignments/08-React_SPA/package.json',
    'assignments/09-React_Concepts/package.json',
    'assignments/10-Fetch_API_JSON/index.html',
    'assignments/11-DOM_Manipulation/index.html',
    'assignments/12-PHP_Form_Handling/index.php',
    'assignments/13-PHP_MySQL_CRUD/index.php',
    'assignments/14-Node_Express_Server/server.js'
  ];

  for (const prevPath of previousAssignments) {
    const fullPath = path.join(__dirname, '..', '..', prevPath);
    const exists = fs.existsSync(fullPath);
    assert(exists, `Preserved previous assignment: ${prevPath}`);
  }

  // SUITE 3: MariaDB Connection & Schema Verification
  console.log('\n--- Suite 3: MariaDB Connection & Schema Verification ---');
  const dbHealth = await checkConnection();
  assert(dbHealth.isConnected, `Database connected: ${dbHealth.database} (${dbHealth.version})`);

  const [tables] = await pool.query('SHOW TABLES');
  const tableNames = tables.map(t => Object.values(t)[0]);
  assert(tableNames.includes('opportunities'), "Table 'opportunities' exists in kbtcoe_connect_api");
  assert(tableNames.includes('users'), "Table 'users' exists in kbtcoe_connect_api");
  assert(tableNames.includes('posts'), "Table 'posts' exists in kbtcoe_connect_api");

  // SUITE 4: Start Express Server for Integration Tests
  console.log('\n--- Suite 4: Starting Express Server on Port 5001 ---');
  await new Promise((resolve, reject) => {
    server = app.listen(TEST_PORT, (err) => {
      if (err) return reject(err);
      console.log(`  Test server listening on port ${TEST_PORT}`);
      resolve();
    });
  });
  assert(server && server.listening, `Express server started on port ${TEST_PORT}`);

  // SUITE 5: Health Check Endpoint
  console.log('\n--- Suite 5: System Health Endpoint ---');
  const healthRes = await request('GET', '/api/health');
  assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
  assert(healthRes.json && healthRes.json.data && healthRes.json.data.status === 'UP', 'GET /api/health reports UP status');
  assert(healthRes.json && healthRes.json.data && healthRes.json.data.database.connected === true, 'GET /api/health reports database connected');

  // SUITE 6: Static Frontend Dashboard
  console.log('\n--- Suite 6: Static Frontend Dashboard ---');
  const indexRes = await request('GET', '/');
  assert(indexRes.status === 200, 'GET / serves index.html (200 OK)');
  assert(indexRes.text.includes('KBTCOE Connect'), 'Dashboard HTML contains KBTCOE Connect branding');

  // SUITE 7: Opportunities REST CRUD Endpoints
  console.log('\n--- Suite 7: Opportunities REST CRUD Endpoints ---');
  // List
  const oppsRes = await request('GET', '/api/opportunities');
  assert(oppsRes.status === 200, 'GET /api/opportunities returns 200 OK');
  assert(Array.isArray(oppsRes.json.data) && oppsRes.json.data.length > 0, 'Returns array of opportunities');

  // Search & Filter (category 'internship')
  const filterRes = await request('GET', '/api/opportunities?category=internship');
  assert(filterRes.status === 200, 'GET /api/opportunities?category=internship returns 200 OK');
  const allInternships = filterRes.json.data.every(o => o.category.toLowerCase() === 'internship');
  assert(allInternships, 'Category filter accurately filtered internship results');

  // Read single
  const sampleOpp = oppsRes.json.data[0];
  const singleOppRes = await request('GET', `/api/opportunities/${sampleOpp.id}`);
  assert(singleOppRes.status === 200, `GET /api/opportunities/${sampleOpp.id} returns 200 OK`);
  assert(singleOppRes.json.data.title === sampleOpp.title, 'Opportunity title matches');

  // 404 for nonexistent
  const notFoundOpp = await request('GET', '/api/opportunities/99999');
  assert(notFoundOpp.status === 404, 'GET /api/opportunities/99999 returns 404 Not Found');

  // 400 for invalid ID format
  const badIdOpp = await request('GET', '/api/opportunities/invalid-id');
  assert(badIdOpp.status === 400, 'GET /api/opportunities/invalid-id returns 400 Bad Request');

  // Create Opportunity
  const newOppPayload = {
    title: 'Automated QA Engineer Intern',
    organization: 'Persistent Systems Nashik',
    category: 'internship',
    description: 'Automated testing and QA pipeline maintenance using Playwright and Jest for enterprise clients.',
    eligibility: 'TE & BE Computer / IT students with 60% aggregate',
    application_url: 'https://persistent.com/careers/intern-qa',
    deadline: '2026-12-31'
  };
  const createOppRes = await request('POST', '/api/opportunities', { body: newOppPayload });
  assert(createOppRes.status === 201, 'POST /api/opportunities returns 201 Created');
  assert(createOppRes.json.data && createOppRes.json.data.id, 'Created opportunity has assigned ID');
  const createdOppId = createOppRes.json.data.id;

  // Update Opportunity
  const updateOppPayload = {
    title: 'Senior Automated QA Intern',
    eligibility: 'TE & BE Computer / IT students with 65% aggregate'
  };
  const updateOppRes = await request('PUT', `/api/opportunities/${createdOppId}`, { body: updateOppPayload });
  assert(updateOppRes.status === 200, `PUT /api/opportunities/${createdOppId} returns 200 OK`);
  assert(updateOppRes.json.data.title === 'Senior Automated QA Intern', 'Opportunity title successfully updated');

  // Delete Opportunity
  const deleteOppRes = await request('DELETE', `/api/opportunities/${createdOppId}`);
  assert(deleteOppRes.status === 200, `DELETE /api/opportunities/${createdOppId} returns 200 OK`);

  const verifyDeleteRes = await request('GET', `/api/opportunities/${createdOppId}`);
  assert(verifyDeleteRes.status === 404, 'Verified opportunity is removed (404)');

  // SUITE 8: Authentication Endpoints
  console.log('\n--- Suite 8: Authentication & Cryptographic Hashing ---');
  // Register new student
  const testEmail = `student.test.${Date.now()}@kbtcoe.org`;
  const registerPayload = {
    name: 'Test Student',
    email: testEmail,
    password: 'SecurePassword123!',
    branch: 'Computer Engineering',
    academic_year: 'TE'
  };
  const registerRes = await request('POST', '/api/auth/register', { body: registerPayload });
  assert(registerRes.status === 201, 'POST /api/auth/register returns 201 Created');
  assert(registerRes.json.data && registerRes.json.data.token, 'Register returns signed JWT token');
  assert(registerRes.json.data && registerRes.json.data.user.email === testEmail, 'Register returns user metadata');
  const testStudentId = registerRes.json.data.user.id;

  // Duplicate email registration should fail (409 Conflict)
  const dupRegisterRes = await request('POST', '/api/auth/register', { body: registerPayload });
  assert(dupRegisterRes.status === 409, 'POST /api/auth/register duplicate email returns 409 Conflict');

  // Login with seeded user 1 (Sanket Patil)
  const loginRes = await request('POST', '/api/auth/login', {
    body: {
      email: 'sanket.patil@kbtcoe.org',
      password: 'Password123!'
    }
  });
  assert(loginRes.status === 200, 'POST /api/auth/login with valid credentials returns 200 OK');
  assert(loginRes.json.data && loginRes.json.data.token, 'Login returns valid JWT token');
  const sanketToken = loginRes.json.data.token;
  const sanketUser = loginRes.json.data.user;

  // Login with seeded user 2 (Tanvi Kulkarni)
  const loginTanviRes = await request('POST', '/api/auth/login', {
    body: {
      email: 'tanvi.kulkarni@kbtcoe.org',
      password: 'Password123!'
    }
  });
  assert(loginTanviRes.status === 200, 'POST /api/auth/login for Tanvi Kulkarni returns 200 OK');
  const tanviToken = loginTanviRes.json.data.token;

  // Login with invalid credentials
  const badLoginRes = await request('POST', '/api/auth/login', {
    body: {
      email: 'sanket.patil@kbtcoe.org',
      password: 'WrongPassword999!'
    }
  });
  assert(badLoginRes.status === 401, 'POST /api/auth/login with wrong password returns 401 Unauthorized');

  // GET /api/auth/me with Bearer token
  const meRes = await request('GET', '/api/auth/me', {
    headers: { Authorization: `Bearer ${sanketToken}` }
  });
  assert(meRes.status === 200, 'GET /api/auth/me with Bearer token returns 200 OK');
  assert(meRes.json.data.email === 'sanket.patil@kbtcoe.org', 'GET /api/auth/me correctly identifies Sanket');

  // GET /api/auth/me without token (401)
  const unauthMeRes = await request('GET', '/api/auth/me');
  assert(unauthMeRes.status === 401, 'GET /api/auth/me without token returns 401 Unauthorized');

  // SUITE 9: Community Posts CRUD & Ownership Verification
  console.log('\n--- Suite 9: Community Posts & Authorization Ownership Guards ---');
  // List posts (should include author join)
  const postsRes = await request('GET', '/api/posts');
  assert(postsRes.status === 200, 'GET /api/posts returns 200 OK');
  assert(Array.isArray(postsRes.json.data) && postsRes.json.data.length > 0, 'Posts list returns array');
  const firstPost = postsRes.json.data[0];
  assert(firstPost.author_name !== undefined, 'Posts query joins author_name');
  assert(firstPost.author_branch !== undefined, 'Posts query joins author_branch');

  // Create post as Sanket
  const createPostRes = await request('POST', '/api/posts', {
    headers: { Authorization: `Bearer ${sanketToken}` },
    body: {
      title: 'Automated Test Post by Sanket',
      content: 'This post is created via automated integration testing to verify JWT and ownership validation.',
      category: 'technical'
    }
  });
  assert(createPostRes.status === 201, 'POST /api/posts with Bearer token returns 201 Created');
  assert(createPostRes.json.data && createPostRes.json.data.id, 'Created post has ID');
  const createdPostId = createPostRes.json.data.id;
  assert(createPostRes.json.data.user_id === sanketUser.id, 'Post user_id securely bound to req.user.id');

  // Attempt to edit Sanket's post as Tanvi (Ownership check - MUST BE 403)
  const forbiddenUpdateRes = await request('PUT', `/api/posts/${createdPostId}`, {
    headers: { Authorization: `Bearer ${tanviToken}` },
    body: {
      title: 'Unauthorized Modification Attempt by Tanvi',
      content: 'Should be rejected with 403 Forbidden.'
    }
  });
  assert(forbiddenUpdateRes.status === 403, 'PUT /api/posts/:id by non-owner returns 403 Forbidden');

  // Update Sanket's post as Sanket (Owner - MUST BE 200)
  const authorizedUpdateRes = await request('PUT', `/api/posts/${createdPostId}`, {
    headers: { Authorization: `Bearer ${sanketToken}` },
    body: {
      title: 'Updated Test Post by Author Sanket',
      content: 'Updated content successfully verified.'
    }
  });
  assert(authorizedUpdateRes.status === 200, 'PUT /api/posts/:id by author returns 200 OK');
  assert(authorizedUpdateRes.json.data.title === 'Updated Test Post by Author Sanket', 'Post title updated');

  // Attempt to delete Sanket's post as Tanvi (Ownership check - MUST BE 403)
  const forbiddenDeleteRes = await request('DELETE', `/api/posts/${createdPostId}`, {
    headers: { Authorization: `Bearer ${tanviToken}` }
  });
  assert(forbiddenDeleteRes.status === 403, 'DELETE /api/posts/:id by non-owner returns 403 Forbidden');

  // Delete Sanket's post as Sanket (Owner - MUST BE 200)
  const authorizedDeleteRes = await request('DELETE', `/api/posts/${createdPostId}`, {
    headers: { Authorization: `Bearer ${sanketToken}` }
  });
  assert(authorizedDeleteRes.status === 200, 'DELETE /api/posts/:id by author returns 200 OK');

  // SUITE 10: Error Handling & Malformed Payload Scrubbing
  console.log('\n--- Suite 10: Centralized Error Handling & Safety ---');
  // Malformed JSON body
  const malformedRes = await request('POST', '/api/opportunities', {
    headers: { 'Content-Type': 'application/json' },
    body: '{ "invalid_json_syntax": '
  });
  assert(malformedRes.status === 400, 'Malformed JSON request returns 400 Bad Request');
  assert(malformedRes.json.message.includes('Malformed JSON'), 'Safe client error message returned');
  assert(!malformedRes.text.includes('node_modules'), 'No stack trace leaked to client');

  // 404 Route Not Found
  const unknownRouteRes = await request('GET', '/api/nonexistent-endpoint-xyz');
  assert(unknownRouteRes.status === 404, 'Unknown endpoint returns 404 Not Found');
  assert(unknownRouteRes.json.availableEndpoints, '404 response lists available API endpoints');

  // Clean up created test user from database
  await pool.query('DELETE FROM users WHERE id = ?', [testStudentId]);

  console.log('\n============================================================');
  console.log(`  Test Run Complete: ${passedCount} Passed, ${failedCount} Failed`);
  console.log('============================================================\n');

  // Clean shutdown
  server.close(() => {
    pool.end().then(() => {
      process.exit(failedCount === 0 ? 0 : 1);
    });
  });
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  if (server) server.close();
  if (pool) pool.end();
  process.exit(1);
});
