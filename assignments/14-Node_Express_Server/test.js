/**
 * ==============================================================================
 * Comprehensive Verification & Test Suite for Assignment 14 (Node & Express)
 * KBTCOE Connect Backend
 * ==============================================================================
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

let passed = 0;
let failed = 0;

function assertTest(name, condition, details = '') {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${name}`);
  } else {
    failed++;
    console.log(`  [FAIL] ${name} - ${details}`);
  }
}

/**
 * Lightweight helper to execute HTTP requests using native Node.js http module.
 *
 * @param {string} method
 * @param {string} urlPath
 * @param {any} [body]
 * @param {number} [port]
 * @returns {Promise<{ statusCode: number, headers: Object, body: string, json: Object|null }>}
 */
function makeRequest(method, urlPath, body = null, port = 3000) {
  return new Promise((resolve, reject) => {
    let payload = null;
    const headers = {};

    if (body !== null) {
      payload = typeof body === 'string' ? body : JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const options = {
      hostname: '127.0.0.1',
      port,
      path: urlPath,
      method,
      headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {
          // Non-JSON response (e.g. HTML)
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('======================================================================');
  console.log('KBTCOE Connect — Assignment 14 Automated Test Suite');
  console.log('======================================================================\n');

  const assignmentDir = __dirname;
  const workspaceRoot = path.resolve(assignmentDir, '..', '..');

  // ----------------------------------------------------------------------------
  // SUITE 1: Required Files Inventory
  // ----------------------------------------------------------------------------
  console.log('--- TEST SUITE 1: File Existence & Non-Empty Check ---');
  const requiredFiles = [
    'package.json',
    'package-lock.json',
    'server.js',
    'routes/opportunities.js',
    'middleware/errorHandler.js',
    'middleware/notFound.js',
    'data/opportunities.js',
    'public/index.html',
    'public/style.css',
    'public/app.js',
    'public/kbtcoe-logo.svg',
    'README.md'
  ];

  for (const rel of requiredFiles) {
    const fullPath = path.join(assignmentDir, rel);
    const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0;
    assertTest(`File ${rel} exists and is non-empty`, exists, `Missing or 0-bytes at ${fullPath}`);
  }

  // ----------------------------------------------------------------------------
  // SUITE 2: In-Memory Data Store Unit Tests
  // ----------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 2: In-Memory Data Store Methods ---');
  const store = require('./data/opportunities');

  // Reset to initial seeds
  store.reset();
  const initialRecords = store.getAll();
  assertTest('Initial seed contains at least 6 records', initialRecords.length >= 6, `Count: ${initialRecords.length}`);

  const item1 = store.getById(1);
  assertTest('getById(1) returns record with id: 1', item1 !== null && item1.id === 1);
  assertTest('getById(9999) returns null for missing ID', store.getById(9999) === null);

  // Test Creation
  const newCreated = store.create({
    title: 'Unit Test Hackathon',
    organization: 'KBTCOE AI Club',
    category: 'hackathon',
    description: 'Unit test description for in-memory store',
    deadline: '2026-11-25'
  });
  assertTest('create() generates new unique numeric ID', typeof newCreated.id === 'number' && newCreated.id > 6);
  assertTest('create() sets createdAt and updatedAt ISO strings', Boolean(newCreated.createdAt && newCreated.updatedAt));

  // Test Update
  const updatedItem = store.update(newCreated.id, { title: 'Updated Unit Test Hackathon' });
  assertTest('update() updates title', updatedItem !== null && updatedItem.title === 'Updated Unit Test Hackathon');

  // Test Delete
  const deleteResult = store.remove(newCreated.id);
  assertTest('remove() returns true for existing record', deleteResult === true);
  assertTest('getById() returns null after deletion', store.getById(newCreated.id) === null);

  // Reset store for HTTP integration tests
  store.reset();

  // ----------------------------------------------------------------------------
  // SUITE 3: Live Express Server HTTP Integration Tests
  // ----------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 3: Live HTTP Server Integration Tests ---');
  const { app } = require('./server');

  // Bind app to an available dynamic port (port 0 lets OS assign free port)
  const testServer = http.createServer(app);
  await new Promise((resolve) => testServer.listen(0, '127.0.0.1', resolve));
  const testPort = testServer.address().port;
  console.log(`  [INFO] Test Express server listening on ephemeral port ${testPort}`);

  try {
    // 3.1 GET / (Static delivery)
    const resRoot = await makeRequest('GET', '/', null, testPort);
    assertTest('GET / returns HTTP 200', resRoot.statusCode === 200);
    assertTest('GET / serves HTML landing page', resRoot.body.includes('KBTCOE Connect'));

    // 3.2 GET /api/health
    const resHealth = await makeRequest('GET', '/api/health', null, testPort);
    assertTest('GET /api/health returns HTTP 200', resHealth.statusCode === 200);
    assertTest('GET /api/health JSON contains status UP', resHealth.json && resHealth.json.data && resHealth.json.data.status === 'UP');

    // 3.3 GET /api/opportunities (Read All)
    const resAll = await makeRequest('GET', '/api/opportunities', null, testPort);
    assertTest('GET /api/opportunities returns HTTP 200', resAll.statusCode === 200);
    assertTest('GET /api/opportunities returns 6 seed records', resAll.json && resAll.json.count === 6);

    // 3.4 GET /api/opportunities?category=internship (Filtered)
    const resFilter = await makeRequest('GET', '/api/opportunities?category=internship', null, testPort);
    assertTest('GET /api/opportunities?category=internship returns HTTP 200', resFilter.statusCode === 200);
    const allInternships = resFilter.json.data.every((o) => o.category === 'internship');
    assertTest('All returned records have category: internship', allInternships);

    // 3.5 GET /api/opportunities/:id (Read Single)
    const resSingle = await makeRequest('GET', '/api/opportunities/1', null, testPort);
    assertTest('GET /api/opportunities/1 returns HTTP 200', resSingle.statusCode === 200);
    assertTest('GET /api/opportunities/1 returns opportunity #1 data', resSingle.json.data.id === 1);

    // 3.6 GET /api/opportunities/999 (Missing Single)
    const resMissing = await makeRequest('GET', '/api/opportunities/999', null, testPort);
    assertTest('GET /api/opportunities/999 returns HTTP 404', resMissing.statusCode === 404);
    assertTest('GET /api/opportunities/999 returns success: false', resMissing.json.success === false);

    // 3.7 GET /api/opportunities/invalid_id (Invalid ID parameter)
    const resInvalidId = await makeRequest('GET', '/api/opportunities/not-a-number', null, testPort);
    assertTest('GET /api/opportunities/not-a-number returns HTTP 400', resInvalidId.statusCode === 400);

    // 3.8 POST /api/opportunities (Create Valid)
    const newOpportunityPayload = {
      title: 'TCS Inframind Innovation Challenge 2026',
      organization: 'Tata Consultancy Services',
      category: 'competition',
      description: 'Collegiate enterprise infrastructure design and cloud automation hackathon.',
      deadline: '2026-12-28'
    };
    const resCreate = await makeRequest('POST', '/api/opportunities', newOpportunityPayload, testPort);
    assertTest('POST /api/opportunities returns HTTP 201 Created', resCreate.statusCode === 201);
    assertTest('POST /api/opportunities returns created opportunity with ID 7', resCreate.json && resCreate.json.data.id === 7);

    // 3.9 POST /api/opportunities (Reject Invalid Payload)
    const resCreateInvalid = await makeRequest('POST', '/api/opportunities', { title: 'AB' }, testPort);
    assertTest('POST /api/opportunities with incomplete body returns HTTP 400', resCreateInvalid.statusCode === 400);
    assertTest('Validation errors array is returned in response', Array.isArray(resCreateInvalid.json.errors));

    // 3.10 PUT /api/opportunities/:id (Update Valid)
    const updatePayload = {
      title: 'TCS Inframind Challenge 2026 (Updated Title)',
      deadline: '2026-12-30'
    };
    const resUpdate = await makeRequest('PUT', '/api/opportunities/7', updatePayload, testPort);
    assertTest('PUT /api/opportunities/7 returns HTTP 200', resUpdate.statusCode === 200);
    assertTest('Record reflects updated title', resUpdate.json.data.title === 'TCS Inframind Challenge 2026 (Updated Title)');

    // 3.11 PUT /api/opportunities/999 (Update Missing)
    const resUpdateMissing = await makeRequest('PUT', '/api/opportunities/999', { title: 'Ghost' }, testPort);
    assertTest('PUT /api/opportunities/999 returns HTTP 404', resUpdateMissing.statusCode === 404);

    // 3.12 DELETE /api/opportunities/:id (Delete Valid)
    const resDelete = await makeRequest('DELETE', '/api/opportunities/7', null, testPort);
    assertTest('DELETE /api/opportunities/7 returns HTTP 200', resDelete.statusCode === 200);
    assertTest('DELETE returns confirmation with deleted record ID', resDelete.json.data.id === 7);

    // 3.13 DELETE /api/opportunities/7 (Delete Already Deleted Record)
    const resDeleteAgain = await makeRequest('DELETE', '/api/opportunities/7', null, testPort);
    assertTest('DELETE /api/opportunities/7 on non-existent record returns HTTP 404', resDeleteAgain.statusCode === 404);

    // 3.14 Unmapped Route (404 Catch-All Middleware)
    const res404 = await makeRequest('GET', '/api/unknown-service-endpoint', null, testPort);
    assertTest('GET /api/unknown-service-endpoint returns HTTP 404', res404.statusCode === 404);
    assertTest('404 response contains list of available endpoints', Array.isArray(res404.json.availableEndpoints));

    // 3.15 Malformed JSON Body (Centralized Error Handler)
    const resBadJson = await makeRequest('POST', '/api/opportunities', '{"title": "broken JSON missing quote}', testPort);
    assertTest('Malformed JSON request returns HTTP 400 Bad Request', resBadJson.statusCode === 400);
    assertTest('Malformed JSON error does not expose stack trace', resBadJson.json.stack === undefined);
  } finally {
    // Close test server
    await new Promise((resolve) => testServer.close(resolve));
  }

  // ----------------------------------------------------------------------------
  // SUITE 4: Assignments 01–13 Integrity Check
  // ----------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 4: Assignments 01–13 Integrity Verification ---');
  const previousAssignments = [
    '01-HTML_Basics',
    '02-Semantic_HTML',
    '03-CSS_Styling',
    '04-Responsive_Design',
    '05-CSS_Positioning',
    '06-JavaScript_Basics',
    '07-Frontend_Validation',
    '08-React_SPA',
    '09-React_Concepts',
    '10-Fetch_API_JSON',
    '11-DOM_Manipulation',
    '12-PHP_Form_Handling',
    '13-PHP_MySQL_CRUD'
  ];

  for (const assign of previousAssignments) {
    const dir = path.join(workspaceRoot, 'assignments', assign);
    const exists = fs.existsSync(dir) && fs.statSync(dir).isDirectory();
    assertTest(`Preserved previous assignment: ${assign}`, exists, `Missing directory: ${dir}`);
  }

  // ----------------------------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log('TEST RESULTS SUMMARY');
  console.log(`Total Passed: ${passed}`);
  console.log(`Total Failed: ${failed}`);
  console.log('======================================================================');

  if (failed === 0) {
    console.log('>>> ALL TESTS PASSED SUCCESSFULLY! Assignment 14 is 100% verified. <<<');
    process.exit(0);
  } else {
    console.log('>>> SOME TESTS FAILED. Please review the output above. <<<');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed fatally:', err);
  process.exit(1);
});
