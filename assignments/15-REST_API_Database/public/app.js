/**
 * ==============================================================================
 * KBTCOE Connect — Test Client Interactive Controller (public/app.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

// In-Memory Token & Session Store (Never exposed or stored unencrypted)
let authToken = null;
let currentUser = null;

// DOM References
const dbBadge = document.getElementById('dbBadge');
const dbDot = document.getElementById('dbDot');
const dbText = document.getElementById('dbText');
const authBadge = document.getElementById('authBadge');
const authText = document.getElementById('authText');
const authSessionInfo = document.getElementById('authSessionInfo');

const responseStatusBadge = document.getElementById('responseStatusBadge');
const responseMeta = document.getElementById('responseMeta');
const responseOutput = document.getElementById('responseOutput');

// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Opportunities Elements
const opportunitiesList = document.getElementById('opportunitiesList');
const oppsListHeader = document.getElementById('oppsListHeader');
const createOppForm = document.getElementById('createOppForm');
const oppSearchQuery = document.getElementById('oppSearchQuery');
const oppFilterCategory = document.getElementById('oppFilterCategory');
const btnFilterOpps = document.getElementById('btnFilterOpps');
const btnResetOpps = document.getElementById('btnResetOpps');

// Auth Elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const btnQuickLoginSanket = document.getElementById('btnQuickLoginSanket');
const btnQuickLoginTanvi = document.getElementById('btnQuickLoginTanvi');
const btnFetchMe = document.getElementById('btnFetchMe');
const btnLogout = document.getElementById('btnLogout');

// Posts Elements
const postsList = document.getElementById('postsList');
const postsListHeader = document.getElementById('postsListHeader');
const createPostForm = document.getElementById('createPostForm');
const btnRefreshPosts = document.getElementById('btnRefreshPosts');

/**
 * Updates Inspector Console with HTTP metadata and formatted JSON response.
 */
function updateInspector(method, url, status, statusText, durationMs, body) {
  responseStatusBadge.className = 'status-badge';
  if (status >= 200 && status < 300) {
    responseStatusBadge.classList.add('status-2xx');
  } else if (status >= 400 && status < 500) {
    responseStatusBadge.classList.add('status-4xx');
  } else {
    responseStatusBadge.classList.add('status-5xx');
  }

  responseStatusBadge.textContent = `HTTP ${status} ${statusText || ''}`;
  responseMeta.textContent = `Endpoint: ${method} ${url} • Latency: ${durationMs}ms`;
  responseOutput.textContent = JSON.stringify(body, null, 2);
}

/**
 * Escapes strings safely for HTML rendering to prevent DOM XSS.
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Tab switching controller.
 */
tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-tab');
    tabButtons.forEach((b) => b.classList.remove('active'));
    tabContents.forEach((c) => {
      c.style.display = 'none';
      c.classList.remove('active');
    });

    btn.classList.add('active');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.style.display = 'block';
      targetPanel.classList.add('active');
    }
  });
});

/**
 * Queries GET /api/health to inspect server and database status.
 */
async function checkHealth() {
  const start = Date.now();
  try {
    const res = await fetch('/api/health');
    const duration = Date.now() - start;
    const data = await res.json();

    if (res.ok && data.success && data.data.database.connected) {
      dbBadge.className = 'pill-badge badge-online';
      dbDot.className = 'status-dot dot-green';
      dbText.textContent = `🟢 MySQL Connected (${data.data.database.schema})`;
    } else {
      dbBadge.className = 'pill-badge badge-offline';
      dbDot.className = 'status-dot dot-red';
      dbText.textContent = '🔴 MySQL Disconnected';
    }

    return { res, data, duration };
  } catch (err) {
    dbBadge.className = 'pill-badge badge-offline';
    dbDot.className = 'status-dot dot-red';
    dbText.textContent = '🔴 Server Offline';
    return {
      res: { status: 503, statusText: 'Service Unavailable' },
      data: { success: false, error: err.message },
      duration: Date.now() - start
    };
  }
}

/**
 * Updates UI to reflect current user session state.
 */
function updateAuthUI() {
  if (currentUser && authToken) {
    authText.textContent = `👤 ${currentUser.name} (${currentUser.branch})`;
    authSessionInfo.innerHTML = `
      <div style="background: #F1F5F9; padding: 0.75rem; border-radius: 0.375rem; border: 1px solid #CBD5E1;">
        <strong>Authenticated as:</strong> ${escapeHtml(currentUser.name)}<br>
        <strong>Email:</strong> ${escapeHtml(currentUser.email)}<br>
        <strong>Branch:</strong> ${escapeHtml(currentUser.branch)} &bull; Year: ${escapeHtml(currentUser.academic_year || '')}<br>
        <span style="font-size: 0.75rem; color: #64748B; word-break: break-all; margin-top: 0.35rem; display: block;">
          <strong>Bearer Token:</strong> <code>${authToken.slice(0, 24)}...${authToken.slice(-12)}</code>
        </span>
      </div>
    `;
  } else {
    authText.textContent = 'Guest User';
    authSessionInfo.innerHTML = 'No active session. You are browsing as a guest.';
  }
}

// ==============================================================================
// Opportunities Module
// ==============================================================================

async function loadOpportunities() {
  const start = Date.now();
  const q = oppSearchQuery.value.trim();
  const cat = oppFilterCategory.value.trim();

  let url = '/api/opportunities?';
  if (q) url += `q=${encodeURIComponent(q)}&`;
  if (cat) url += `category=${encodeURIComponent(cat)}&`;

  try {
    const res = await fetch(url);
    const duration = Date.now() - start;
    const data = await res.json();

    if (res.ok && data.success) {
      renderOpportunities(data.data);
      oppsListHeader.textContent = `Persistent Opportunities (${data.count} in MySQL)`;
    }

    return { res, data, duration };
  } catch (err) {
    opportunitiesList.innerHTML = `<p style="color: #DC2626;">Failed to load opportunities: ${escapeHtml(err.message)}</p>`;
    return null;
  }
}

function renderOpportunities(items) {
  opportunitiesList.innerHTML = '';

  if (!items || items.length === 0) {
    opportunitiesList.innerHTML = '<p style="color: #64748B;">No opportunities found in the database.</p>';
    return;
  }

  items.forEach((opp) => {
    const card = document.createElement('div');
    card.className = 'item-card';

    const catClass = `cat-${(opp.category || '').toLowerCase()}`;

    card.innerHTML = `
      <div class="item-card-header">
        <span class="cat-badge ${catClass}">${escapeHtml(opp.category)}</span>
        <span style="font-size: 0.75rem; color: #64748B; font-family: monospace;">ID #${opp.id}</span>
      </div>
      <h4 class="item-card-title">${escapeHtml(opp.title)}</h4>
      <div class="item-card-meta">🏢 ${escapeHtml(opp.organization)} &bull; 🎓 ${escapeHtml(opp.eligibility)}</div>
      <div class="item-card-body">${escapeHtml(opp.description)}</div>
      <div class="item-card-actions">
        <span style="font-size: 0.75rem; color: #64748B;">
          📅 Deadline: <strong>${opp.deadline ? escapeHtml(opp.deadline) : 'Ongoing'}</strong>
        </span>
        <button type="button" class="btn-card-delete btn-del-opp" data-id="${opp.id}">
          Delete (DELETE)
        </button>
      </div>
    `;

    opportunitiesList.appendChild(card);
  });

  // Attach delete listeners
  document.querySelectorAll('.btn-del-opp').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (!confirm(`Permanently delete opportunity #${id} from MySQL?`)) return;

      const start = Date.now();
      const res = await fetch(`/api/opportunities/${id}`, { method: 'DELETE' });
      const duration = Date.now() - start;
      const data = await res.json();
      updateInspector('DELETE', `/api/opportunities/${id}`, res.status, res.statusText, duration, data);
      loadOpportunities();
    });
  });
}

btnFilterOpps.addEventListener('click', async () => {
  const result = await loadOpportunities();
  if (result) {
    updateInspector('GET', '/api/opportunities', result.res.status, result.res.statusText, result.duration, result.data);
  }
});

btnResetOpps.addEventListener('click', async () => {
  oppSearchQuery.value = '';
  oppFilterCategory.value = '';
  const result = await loadOpportunities();
  if (result) {
    updateInspector('GET', '/api/opportunities', result.res.status, result.res.statusText, result.duration, result.data);
  }
});

createOppForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    title: document.getElementById('oppTitle').value.trim(),
    organization: document.getElementById('oppOrg').value.trim(),
    category: document.getElementById('oppCat').value,
    description: document.getElementById('oppDesc').value.trim(),
    eligibility: document.getElementById('oppElig').value.trim(),
    deadline: document.getElementById('oppDeadline').value || null
  };

  const start = Date.now();
  const res = await fetch('/api/opportunities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const duration = Date.now() - start;
  const data = await res.json();

  updateInspector('POST', '/api/opportunities', res.status, res.statusText, duration, data);

  if (res.status === 201 && data.success) {
    createOppForm.reset();
    loadOpportunities();
  }
});

// ==============================================================================
// Authentication Module
// ==============================================================================

async function executeLogin(email, password) {
  const start = Date.now();
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const duration = Date.now() - start;
  const data = await res.json();

  updateInspector('POST', '/api/auth/login', res.status, res.statusText, duration, data);

  if (res.ok && data.success) {
    authToken = data.data.token;
    currentUser = data.data.user;
    updateAuthUI();
    loadPosts();
  } else {
    alert('Authentication failed: ' + (data.message || 'Invalid credentials'));
  }
}

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById('regName').value.trim(),
    email: document.getElementById('regEmail').value.trim(),
    password: document.getElementById('regPass').value,
    branch: document.getElementById('regBranch').value,
    academic_year: document.getElementById('regYear').value
  };

  const start = Date.now();
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const duration = Date.now() - start;
  const data = await res.json();

  updateInspector('POST', '/api/auth/register', res.status, res.statusText, duration, data);

  if (res.status === 201 && data.success) {
    authToken = data.data.token;
    currentUser = data.data.user;
    updateAuthUI();
    registerForm.reset();
    loadPosts();
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  await executeLogin(email, pass);
});

btnQuickLoginSanket.addEventListener('click', () => {
  executeLogin('sanket.patil@kbtcoe.org', 'Password123!');
});

btnQuickLoginTanvi.addEventListener('click', () => {
  executeLogin('tanvi.kulkarni@kbtcoe.org', 'Password123!');
});

btnFetchMe.addEventListener('click', async () => {
  if (!authToken) {
    alert('Please log in first to obtain a Bearer JWT token.');
    return;
  }

  const start = Date.now();
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  const duration = Date.now() - start;
  const data = await res.json();

  updateInspector('GET', '/api/auth/me', res.status, res.statusText, duration, data);
});

btnLogout.addEventListener('click', () => {
  authToken = null;
  currentUser = null;
  updateAuthUI();
  loadPosts();
  updateInspector('LOGOUT', 'Local Session', 200, 'OK', 0, { success: true, message: 'Session cleared.' });
});

// ==============================================================================
// Community Posts Module
// ==============================================================================

async function loadPosts() {
  const start = Date.now();
  try {
    const res = await fetch('/api/posts');
    const duration = Date.now() - start;
    const data = await res.json();

    if (res.ok && data.success) {
      renderPosts(data.data);
      postsListHeader.textContent = `Community Discussions (${data.count} in MySQL)`;
    }

    return { res, data, duration };
  } catch (err) {
    postsList.innerHTML = `<p style="color: #DC2626;">Failed to load posts: ${escapeHtml(err.message)}</p>`;
    return null;
  }
}

function renderPosts(items) {
  postsList.innerHTML = '';

  if (!items || items.length === 0) {
    postsList.innerHTML = '<p style="color: #64748B;">No community posts found in the database.</p>';
    return;
  }

  items.forEach((post) => {
    const card = document.createElement('div');
    card.className = 'item-card';

    const catClass = `cat-${(post.category || 'general').toLowerCase()}`;
    const isOwner = currentUser && Number(currentUser.id) === Number(post.user_id);

    card.innerHTML = `
      <div class="item-card-header">
        <span class="cat-badge ${catClass}">${escapeHtml(post.category)}</span>
        <span style="font-size: 0.75rem; color: #64748B;">Post #${post.id}</span>
      </div>
      <h4 class="item-card-title">${escapeHtml(post.title)}</h4>
      <div class="item-card-meta">
        👤 <strong>${escapeHtml(post.author_name)}</strong> (${escapeHtml(post.author_branch)})
        &bull; ${new Date(post.created_at).toLocaleDateString()}
      </div>
      <div class="item-card-body">${escapeHtml(post.content)}</div>
      <div class="item-card-actions">
        <span style="font-size: 0.75rem; color: #64748B;">
          ${isOwner ? '<span style="color: #059669; font-weight: 700;">✓ Your Post</span>' : ''}
        </span>
        ${
          isOwner
            ? `<button type="button" class="btn-card-delete btn-del-post" data-id="${post.id}">Delete (Author Only)</button>`
            : `<button type="button" class="btn-card-delete btn-del-post" data-id="${post.id}" title="Test 403 Forbidden">Delete</button>`
        }
      </div>
    `;

    postsList.appendChild(card);
  });

  // Attach delete post listeners
  document.querySelectorAll('.btn-del-post').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (!authToken) {
        alert('Authentication required. Please log in first to delete a post.');
        return;
      }

      if (!confirm(`Send DELETE /api/posts/${id} with your Bearer token?`)) return;

      const start = Date.now();
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const duration = Date.now() - start;
      const data = await res.json();

      updateInspector('DELETE', `/api/posts/${id}`, res.status, res.statusText, duration, data);
      loadPosts();
    });
  });
}

createPostForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!authToken) {
    alert('Authentication required. Please log in on the Authentication tab first.');
    return;
  }

  const payload = {
    title: document.getElementById('postTitle').value.trim(),
    category: document.getElementById('postCat').value,
    content: document.getElementById('postContent').value.trim()
  };

  const start = Date.now();
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify(payload)
  });
  const duration = Date.now() - start;
  const data = await res.json();

  updateInspector('POST', '/api/posts', res.status, res.statusText, duration, data);

  if (res.status === 201 && data.success) {
    createPostForm.reset();
    loadPosts();
  }
});

btnRefreshPosts.addEventListener('click', async () => {
  const result = await loadPosts();
  if (result) {
    updateInspector('GET', '/api/posts', result.res.status, result.res.statusText, result.duration, result.data);
  }
});

// ==============================================================================
// Initialization
// ==============================================================================
(async function init() {
  const health = await checkHealth();
  updateInspector('GET', '/api/health', health.res.status, health.res.statusText, health.duration, health.data);
  await loadOpportunities();
  await loadPosts();
})();
