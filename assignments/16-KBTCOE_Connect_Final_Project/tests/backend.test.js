/**
 * Comprehensive Backend & Database Integration Test Suite
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const fs = require('fs');
const path = require('path');
const { pool, checkConnection } = require('../server/config/database');
const { app } = require('../server/server');

const TEST_PORT = 5002;
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
  console.log('  KBTCOE Connect - Assignment 16 Backend Test Suite');
  console.log('============================================================\n');

  // SUITE 1: Deliverable Files Verification
  console.log('--- Suite 1: Deliverable Files Verification ---');
  const requiredFiles = [
    'database/schema.sql',
    'database/seed.sql',
    'server/package.json',
    'server/.env',
    'server/.env.example',
    'server/.gitignore',
    'server/server.js',
    'server/config/database.js',
    'server/utils/validators.js',
    'server/middleware/authMiddleware.js',
    'server/middleware/errorHandler.js',
    'server/middleware/logger.js',
    'server/middleware/notFound.js',
    'server/controllers/authController.js',
    'server/controllers/dashboardController.js',
    'server/controllers/userController.js',
    'server/controllers/postController.js',
    'server/controllers/commentController.js',
    'server/controllers/likeController.js',
    'server/controllers/achievementController.js',
    'server/controllers/opportunityController.js',
    'server/routes/auth.js',
    'server/routes/dashboard.js',
    'server/routes/users.js',
    'server/routes/posts.js',
    'server/routes/comments.js',
    'server/routes/achievements.js',
    'server/routes/opportunities.js'
  ];

  for (const relPath of requiredFiles) {
    const fullPath = path.join(__dirname, '..', relPath);
    const exists = fs.existsSync(fullPath);
    const size = exists ? fs.statSync(fullPath).size : 0;
    assert(exists && size > 0, `File exists & non-empty: ${relPath}`, `Size: ${size} bytes`);
  }

  // SUITE 2: MariaDB Database Connection & Schema Verification
  console.log('\n--- Suite 2: MariaDB Connection & Schema Verification ---');
  const dbHealth = await checkConnection();
  assert(dbHealth.isConnected, `Database connected: ${dbHealth.database} (${dbHealth.version})`);
  assert(dbHealth.database === 'kbtcoe_connect_final', 'Connected to dedicated database: kbtcoe_connect_final');

  const [tables] = await pool.query('SHOW TABLES');
  const tableNames = tables.map(t => Object.values(t)[0]);
  const expectedTables = ['users', 'opportunities', 'posts', 'comments', 'likes', 'achievements'];
  for (const tbl of expectedTables) {
    assert(tableNames.includes(tbl), `Relational table '${tbl}' exists`);
  }

  // SUITE 3: Server Startup on Port 5002
  console.log('\n--- Suite 3: Express Server Startup ---');
  await new Promise((resolve, reject) => {
    server = app.listen(TEST_PORT, (err) => {
      if (err) return reject(err);
      console.log(`  Test server listening on port ${TEST_PORT}`);
      resolve();
    });
  });
  assert(server && server.listening, `Server listening on port ${TEST_PORT}`);

  // SUITE 4: Health & Dashboard Statistics
  console.log('\n--- Suite 4: System Health & Dashboard API ---');
  const healthRes = await request('GET', '/api/health');
  assert(healthRes.status === 200, 'GET /api/health returns 200 OK');
  assert(healthRes.json.data.status === 'UP', 'Service status reports UP');
  assert(healthRes.json.data.database.connected === true, 'Database connected flag is true');

  const dashRes = await request('GET', '/api/dashboard/stats');
  assert(dashRes.status === 200, 'GET /api/dashboard/stats returns 200 OK');
  assert(dashRes.json.data.metrics.students >= 4, 'Reports dynamic student metric count');
  assert(dashRes.json.data.metrics.posts >= 5, 'Reports dynamic post metric count');
  assert(dashRes.json.data.metrics.opportunities >= 6, 'Reports dynamic opportunity metric count');
  assert(dashRes.json.data.metrics.achievements >= 6, 'Reports dynamic achievement metric count');
  assert(Array.isArray(dashRes.json.data.recentPosts), 'Returns recent posts preview array');
  assert(Array.isArray(dashRes.json.data.recentOpportunities), 'Returns recent opportunities preview array');

  // SUITE 5: Authentication & Registration Endpoints
  console.log('\n--- Suite 5: Authentication & Access Control ---');
  const testStudentEmail = `student.test.${Date.now()}@kbtcoe.org`;
  const registerPayload = {
    name: 'Harshada Patil',
    email: testStudentEmail,
    password: 'SecurePassword123!',
    branch: 'Computer Engineering',
    academic_year: 'TE',
    bio: 'Junior Computer Engineering student enthusiastic about cloud and microservices.',
    skills: 'Java, Python, Spring Boot, MySQL'
  };

  const regRes = await request('POST', '/api/auth/register', { body: registerPayload });
  assert(regRes.status === 201, 'POST /api/auth/register returns 201 Created');
  assert(regRes.json.data.token, 'Registration returns signed JWT token');
  assert(regRes.json.data.user.role === 'student', 'Public registration assigns student role');
  const testStudentId = regRes.json.data.user.id;

  // Duplicate email check
  const dupRegRes = await request('POST', '/api/auth/register', { body: registerPayload });
  assert(dupRegRes.status === 409, 'Duplicate registration rejected with 409 Conflict');

  // Login as seeded student (Sanket Patil)
  const loginStudentRes = await request('POST', '/api/auth/login', {
    body: {
      email: 'sanket.patil@kbtcoe.org',
      password: 'Password123!'
    }
  });
  assert(loginStudentRes.status === 200, 'POST /api/auth/login for student returns 200 OK');
  const sanketToken = loginStudentRes.json.data.token;
  const sanketUser = loginStudentRes.json.data.user;

  // Login as seeded student 2 (Tanvi Kulkarni)
  const loginTanviRes = await request('POST', '/api/auth/login', {
    body: {
      email: 'tanvi.kulkarni@kbtcoe.org',
      password: 'Password123!'
    }
  });
  assert(loginTanviRes.status === 200, 'POST /api/auth/login for Tanvi returns 200 OK');
  const tanviToken = loginTanviRes.json.data.token;

  // Login as admin (Prof. Nitin Sonawane)
  const loginAdminRes = await request('POST', '/api/auth/login', {
    body: {
      email: 'admin@kbtcoe.org',
      password: 'Password123!'
    }
  });
  assert(loginAdminRes.status === 200, 'POST /api/auth/login for admin returns 200 OK');
  assert(loginAdminRes.json.data.user.role === 'admin', 'Admin user correctly carries role=admin');
  const adminToken = loginAdminRes.json.data.token;

  // Invalid password check
  const badLoginRes = await request('POST', '/api/auth/login', {
    body: {
      email: 'sanket.patil@kbtcoe.org',
      password: 'WrongPassword999!'
    }
  });
  assert(badLoginRes.status === 401, 'Wrong password rejected with 401 Unauthorized');

  // Profile retrieval (/api/auth/me)
  const meRes = await request('GET', '/api/auth/me', {
    headers: { Authorization: `Bearer ${sanketToken}` }
  });
  assert(meRes.status === 200, 'GET /api/auth/me returns 200 OK');
  assert(meRes.json.data.email === 'sanket.patil@kbtcoe.org', 'Identifies authenticated user profile');

  const unauthMeRes = await request('GET', '/api/auth/me');
  assert(unauthMeRes.status === 401, 'GET /api/auth/me without token returns 401 Unauthorized');

  // SUITE 6: User Directory & Profile Update
  console.log('\n--- Suite 6: Student Directory & Profile Management ---');
  const usersRes = await request('GET', '/api/users');
  assert(usersRes.status === 200, 'GET /api/users returns 200 OK');
  assert(Array.isArray(usersRes.json.data) && usersRes.json.data.length >= 4, 'Returns array of students');

  const userDetailRes = await request('GET', `/api/users/${sanketUser.id}`);
  assert(userDetailRes.status === 200, `GET /api/users/${sanketUser.id} returns 200 OK`);
  assert(Array.isArray(userDetailRes.json.data.achievements), 'Includes student achievements');
  assert(Array.isArray(userDetailRes.json.data.posts), 'Includes student posts');

  const updateProfileRes = await request('PUT', '/api/users/profile', {
    headers: { Authorization: `Bearer ${sanketToken}` },
    body: {
      bio: 'Updated bio: Full-stack engineer with cloud experience.',
      skills: 'React, Node, Express, MySQL, Docker, Kubernetes'
    }
  });
  assert(updateProfileRes.status === 200, 'PUT /api/users/profile returns 200 OK');
  assert(updateProfileRes.json.data.skills.includes('Kubernetes'), 'Profile skills updated in database');

  // SUITE 7: Community Posts CRUD & Ownership Enforcement
  console.log('\n--- Suite 7: Community Posts & Authorization Guards ---');
  const postsRes = await request('GET', '/api/posts');
  assert(postsRes.status === 200, 'GET /api/posts returns 200 OK');
  assert(Array.isArray(postsRes.json.data) && postsRes.json.data.length >= 5, 'Returns list of posts');
  const samplePost = postsRes.json.data[0];
  assert(samplePost.author_name !== undefined, 'Post joins author_name');
  assert(samplePost.likes_count !== undefined, 'Post computes dynamic likes_count');
  assert(samplePost.comments_count !== undefined, 'Post computes dynamic comments_count');

  // Create post as Sanket
  const createPostRes = await request('POST', '/api/posts', {
    headers: { Authorization: `Bearer ${sanketToken}` },
    body: {
      title: 'Automated Capstone Integration Post',
      content: 'This post is created via automated integration tests to verify full relational consistency and ownership boundaries.',
      category: 'technical'
    }
  });
  assert(createPostRes.status === 201, 'POST /api/posts returns 201 Created');
  const testPostId = createPostRes.json.data.id;
  assert(createPostRes.json.data.user_id === sanketUser.id, 'Post user_id securely bound to authenticated token');

  // Tanvi attempts to edit Sanket's post -> 403 Forbidden
  const forbiddenPostUpdate = await request('PUT', `/api/posts/${testPostId}`, {
    headers: { Authorization: `Bearer ${tanviToken}` },
    body: {
      title: 'Hacked post title attempt',
      content: 'Should be rejected by ownership guard.'
    }
  });
  assert(forbiddenPostUpdate.status === 403, 'PUT /api/posts/:id by non-owner returns 403 Forbidden');

  // Sanket edits own post -> 200 OK
  const authorizedPostUpdate = await request('PUT', `/api/posts/${testPostId}`, {
    headers: { Authorization: `Bearer ${sanketToken}` },
    body: {
      title: 'Updated Capstone Post Title',
      content: 'Successfully updated by authorized author.'
    }
  });
  assert(authorizedPostUpdate.status === 200, 'PUT /api/posts/:id by author returns 200 OK');

  // SUITE 8: Comments & Discussion Thread
  console.log('\n--- Suite 8: Comments & Interactivity ---');
  const createCommentRes = await request('POST', `/api/posts/${testPostId}/comments`, {
    headers: { Authorization: `Bearer ${tanviToken}` },
    body: {
      content: 'Great test post! Leaving an automated verification comment.'
    }
  });
  assert(createCommentRes.status === 201, 'POST /api/posts/:id/comments returns 201 Created');
  const testCommentId = createCommentRes.json.data.id;

  const getCommentsRes = await request('GET', `/api/posts/${testPostId}/comments`);
  assert(getCommentsRes.status === 200, 'GET /api/posts/:id/comments returns 200 OK');
  assert(getCommentsRes.json.data.some(c => c.id === testCommentId), 'Created comment appears in thread');

  // Sanket attempts to delete Tanvi's comment -> 403 Forbidden
  const forbiddenCommentDelete = await request('DELETE', `/api/comments/${testCommentId}`, {
    headers: { Authorization: `Bearer ${sanketToken}` }
  });
  assert(forbiddenCommentDelete.status === 403, 'DELETE /api/comments/:id by non-owner returns 403 Forbidden');

  // Tanvi deletes own comment -> 200 OK
  const authorizedCommentDelete = await request('DELETE', `/api/comments/${testCommentId}`, {
    headers: { Authorization: `Bearer ${tanviToken}` }
  });
  assert(authorizedCommentDelete.status === 200, 'DELETE /api/comments/:id by owner returns 200 OK');

  // SUITE 9: Like/Unlike Toggle & Duplicate Guard
  console.log('\n--- Suite 9: Post Likes & Duplication Guard ---');
  // Like post
  const likeRes1 = await request('POST', `/api/posts/${testPostId}/like`, {
    headers: { Authorization: `Bearer ${tanviToken}` }
  });
  assert(likeRes1.status === 200, 'POST /api/posts/:id/like returns 200 OK');
  assert(likeRes1.json.data.liked === true, 'Response reports post is liked');
  assert(likeRes1.json.data.likes_count === 1, 'Likes count incremented to 1');

  // Unlike post
  const likeRes2 = await request('POST', `/api/posts/${testPostId}/like`, {
    headers: { Authorization: `Bearer ${tanviToken}` }
  });
  assert(likeRes2.status === 200, 'Second POST /api/posts/:id/like returns 200 OK');
  assert(likeRes2.json.data.liked === false, 'Response reports post is unliked');
  assert(likeRes2.json.data.likes_count === 0, 'Likes count decremented to 0');

  // Clean up post: Tanvi attempts delete -> 403 Forbidden
  const forbiddenPostDelete = await request('DELETE', `/api/posts/${testPostId}`, {
    headers: { Authorization: `Bearer ${tanviToken}` }
  });
  assert(forbiddenPostDelete.status === 403, 'DELETE /api/posts/:id by non-owner returns 403 Forbidden');

  // Sanket deletes own post -> 200 OK
  const authorizedPostDelete = await request('DELETE', `/api/posts/${testPostId}`, {
    headers: { Authorization: `Bearer ${sanketToken}` }
  });
  assert(authorizedPostDelete.status === 200, 'DELETE /api/posts/:id by author returns 200 OK');

  // SUITE 10: Student Achievements CRUD
  console.log('\n--- Suite 10: Student Achievements CRUD ---');
  const createAchRes = await request('POST', '/api/achievements', {
    headers: { Authorization: `Bearer ${sanketToken}` },
    body: {
      title: 'Automated Test Certification Award',
      category: 'certification',
      description: 'Passed automated cloud certification verification exam.',
      date_achieved: '2026-04-15',
      external_url: 'https://kbtcoe.org/test'
    }
  });
  assert(createAchRes.status === 201, 'POST /api/achievements returns 201 Created');
  const testAchId = createAchRes.json.data.id;

  // Tanvi attempts to edit Sanket's achievement -> 403 Forbidden
  const forbiddenAchUpdate = await request('PUT', `/api/achievements/${testAchId}`, {
    headers: { Authorization: `Bearer ${tanviToken}` },
    body: {
      title: 'Hacked achievement',
      category: 'academic',
      description: 'Unauthorized edit attempt.',
      date_achieved: '2026-04-15'
    }
  });
  assert(forbiddenAchUpdate.status === 403, 'PUT /api/achievements/:id by non-owner returns 403 Forbidden');

  // Sanket updates own achievement -> 200 OK
  const authorizedAchUpdate = await request('PUT', `/api/achievements/${testAchId}`, {
    headers: { Authorization: `Bearer ${sanketToken}` },
    body: {
      title: 'Updated Test Certification Award',
      category: 'certification',
      description: 'Updated description for cloud certification.',
      date_achieved: '2026-04-15'
    }
  });
  assert(authorizedAchUpdate.status === 200, 'PUT /api/achievements/:id by author returns 200 OK');

  // Sanket deletes own achievement -> 200 OK
  const deleteAchRes = await request('DELETE', `/api/achievements/${testAchId}`, {
    headers: { Authorization: `Bearer ${sanketToken}` }
  });
  assert(deleteAchRes.status === 200, 'DELETE /api/achievements/:id by author returns 200 OK');

  // SUITE 11: Opportunities CRUD & Admin Operations
  console.log('\n--- Suite 11: Opportunities CRUD & Admin Operations ---');
  const createOppRes = await request('POST', '/api/opportunities', {
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      title: 'Google Summer of Code 2026 Mentorship',
      organization: 'Google Open Source & KBTCOE',
      category: 'internship',
      description: 'Student developer stipend program pairing students with open source mentor organizations.',
      eligibility: 'All collegiate engineering students',
      application_url: 'https://summerofcode.withgoogle.com',
      deadline: '2026-12-31'
    }
  });
  assert(createOppRes.status === 201, 'POST /api/opportunities returns 201 Created');
  const testOppId = createOppRes.json.data.id;

  const updateOppRes = await request('PUT', `/api/opportunities/${testOppId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      title: 'Google Summer of Code 2026 (Updated)',
      organization: 'Google Open Source & KBTCOE',
      category: 'internship',
      description: 'Updated eligibility and project guidelines.',
      eligibility: 'Open to all SPPU engineering students',
      application_url: 'https://summerofcode.withgoogle.com',
      deadline: '2026-12-31'
    }
  });
  assert(updateOppRes.status === 200, 'PUT /api/opportunities/:id returns 200 OK');

  const deleteOppRes = await request('DELETE', `/api/opportunities/${testOppId}`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert(deleteOppRes.status === 200, 'DELETE /api/opportunities/:id returns 200 OK');

  // SUITE 12: Centralized Error Handling & Safety
  console.log('\n--- Suite 12: Centralized Error Handling & Diagnostics Scrubbing ---');
  const malformedRes = await request('POST', '/api/posts', {
    headers: { 'Content-Type': 'application/json' },
    body: '{ "invalid_json": '
  });
  assert(malformedRes.status === 400, 'Malformed JSON returns 400 Bad Request');
  assert(malformedRes.json.message.includes('Malformed JSON'), 'Safe client error message without stack trace');
  assert(!malformedRes.text.includes('node_modules'), 'Zero internal file paths or stack traces leaked');

  const notFoundRes = await request('GET', '/api/nonexistent-endpoint-xyz');
  assert(notFoundRes.status === 404, 'Unmapped endpoint returns 404 Not Found');
  assert(Array.isArray(notFoundRes.json.availableEndpoints), 'Lists available endpoint directory');

  // Clean up registered test student
  await pool.query('DELETE FROM users WHERE id = ?', [testStudentId]);

  console.log('\n============================================================');
  console.log(`  Backend Test Run Complete: ${passedCount} Passed, ${failedCount} Failed`);
  console.log('============================================================\n');

  // Clean shutdown
  server.close(() => {
    pool.end().then(() => {
      process.exit(failedCount === 0 ? 0 : 1);
    });
  });
}

runTests().catch(err => {
  console.error('Fatal backend test runner error:', err);
  if (server) server.close();
  if (pool) pool.end();
  process.exit(1);
});
