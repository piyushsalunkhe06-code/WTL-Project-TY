/**
 * ==============================================================================
 * KBTCOE Connect — Test Client Interactive Controller (public/app.js)
 * Assignment 14: Node.js and Express Server
 * ==============================================================================
 */

'use strict';

// DOM Element References
const healthBadge = document.getElementById('healthBadge');
const healthDot = document.getElementById('healthDot');
const healthText = document.getElementById('healthText');

const responseStatusBadge = document.getElementById('responseStatusBadge');
const responseMeta = document.getElementById('responseMeta');
const responseOutput = document.getElementById('responseOutput');

const opportunitiesGrid = document.getElementById('opportunitiesGrid');
const recordCountText = document.getElementById('recordCountText');
const createForm = document.getElementById('createForm');

// Quick Action Trigger Buttons
const btnGetAll = document.getElementById('btnGetAll');
const btnGetHealth = document.getElementById('btnGetHealth');
const btnGetSingle = document.getElementById('btnGetSingle');
const btnGet404 = document.getElementById('btnGet404');
const btnTestRoute404 = document.getElementById('btnTestRoute404');
const btnTestBadJson = document.getElementById('btnTestBadJson');
const btnRefreshList = document.getElementById('btnRefreshList');

/**
 * Updates the Inspector Console display with HTTP metadata and formatted JSON.
 *
 * @param {string} method
 * @param {string} url
 * @param {number} status
 * @param {string} statusText
 * @param {number} durationMs
 * @param {any} body
 */
function updateInspector(method, url, status, statusText, durationMs, body) {
  // Update badge color class
  responseStatusBadge.className = 'status-tag';
  if (status >= 200 && status < 300) {
    responseStatusBadge.classList.add('status-2xx');
  } else if (status >= 400 && status < 500) {
    responseStatusBadge.classList.add('status-4xx');
  } else {
    responseStatusBadge.classList.add('status-5xx');
  }

  responseStatusBadge.textContent = `HTTP ${status} ${statusText || ''}`;
  responseMeta.textContent = `Endpoint: ${method} ${url} • Execution Duration: ${durationMs}ms`;
  responseOutput.textContent = JSON.stringify(body, null, 2);
}

/**
 * Fetches server health status from GET /api/health and updates UI.
 */
async function checkHealth() {
  const startTime = Date.now();
  try {
    const res = await fetch('/api/health');
    const duration = Date.now() - startTime;
    const data = await res.json();

    if (res.ok && data.success) {
      healthBadge.className = 'api-pill api-online';
      healthDot.className = 'status-dot green-dot';
      healthText.textContent = `🟢 API Online (Uptime: ${data.data.uptimeFormatted})`;
    } else {
      throw new Error(data.message || 'Health check reported unhealthy');
    }

    return { res, data, duration };
  } catch (err) {
    healthBadge.className = 'api-pill api-offline';
    healthDot.className = 'status-dot red-dot';
    healthText.textContent = '🔴 API Offline';
    return {
      res: { status: 503, statusText: 'Service Unavailable' },
      data: { success: false, error: err.message },
      duration: Date.now() - startTime
    };
  }
}

/**
 * Renders the list of opportunities in the dashboard card grid.
 *
 * @param {Array<Object>} items
 */
function renderOpportunitiesGrid(items) {
  opportunitiesGrid.innerHTML = '';

  if (!items || items.length === 0) {
    recordCountText.textContent = '0 active opportunities in memory.';
    opportunitiesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; background: #FFFFFF; border: 2px dashed #CBD5E1; border-radius: 0.75rem; padding: 2.5rem; text-align: center; color: #64748B;">
        <p style="font-size: 1.1rem; font-weight: 700; color: #1E3A8A; margin-bottom: 0.35rem;">No Opportunities in Memory</p>
        <p style="font-size: 0.85rem;">Use the form to create a new opportunity or restart the server to restore default seeds.</p>
      </div>
    `;
    return;
  }

  recordCountText.textContent = `Showing ${items.length} in-memory opportunities (resets on server restart)`;

  items.forEach((opp) => {
    const card = document.createElement('article');
    card.className = 'opp-card';

    const catSlug = (opp.category || '').toLowerCase();
    const badgeClass = `badge-${catSlug}`;

    card.innerHTML = `
      <div class="opp-top-row">
        <span class="category-badge ${badgeClass}">${escapeHtml(opp.category)}</span>
        <span class="opp-id-tag">ID #${opp.id}</span>
      </div>
      <h3 class="opp-title">${escapeHtml(opp.title)}</h3>
      <p class="opp-org">🏢 ${escapeHtml(opp.organization)}</p>
      <p class="opp-desc">${escapeHtml(opp.description)}</p>
      <div class="opp-footer">
        <span class="opp-deadline">📅 ${opp.deadline ? escapeHtml(opp.deadline) : 'Open'}</span>
        <button type="button" class="btn-card-del" data-id="${opp.id}">
          Delete (DELETE)
        </button>
      </div>
    `;

    opportunitiesGrid.appendChild(card);
  });

  // Attach event delegation for delete buttons
  attachDeleteListeners();
}

/**
 * Attaches event listeners to all dynamic Delete buttons on opportunity cards.
 */
function attachDeleteListeners() {
  const deleteBtns = opportunitiesGrid.querySelectorAll('.btn-card-del');
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (!confirm(`Are you sure you want to send HTTP DELETE for opportunity #${id}?`)) {
        return;
      }

      const startTime = Date.now();
      try {
        const res = await fetch(`/api/opportunities/${id}`, { method: 'DELETE' });
        const duration = Date.now() - startTime;
        const data = await res.json();
        updateInspector('DELETE', `/api/opportunities/${id}`, res.status, res.statusText, duration, data);
        loadOpportunities();
      } catch (err) {
        alert('Network request failed: ' + err.message);
      }
    });
  });
}

/**
 * Fetches all opportunities from GET /api/opportunities and refreshes the grid.
 */
async function loadOpportunities() {
  const startTime = Date.now();
  try {
    const res = await fetch('/api/opportunities');
    const duration = Date.now() - startTime;
    const data = await res.json();

    if (res.ok && data.success) {
      renderOpportunitiesGrid(data.data);
    }

    return { res, data, duration };
  } catch (err) {
    recordCountText.textContent = 'Error connecting to Express server.';
    return null;
  }
}

/**
 * Helper to escape HTML characters safely for rendering.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==============================================================================
// Event Listeners for Interactive Dashboard Controls
// ==============================================================================

// 1. GET /api/opportunities
btnGetAll.addEventListener('click', async () => {
  const result = await loadOpportunities();
  if (result) {
    updateInspector('GET', '/api/opportunities', result.res.status, result.res.statusText, result.duration, result.data);
  }
});

// 2. GET /api/health
btnGetHealth.addEventListener('click', async () => {
  const result = await checkHealth();
  updateInspector('GET', '/api/health', result.res.status, result.res.statusText, result.duration, result.data);
});

// 3. GET /api/opportunities/1
btnGetSingle.addEventListener('click', async () => {
  const startTime = Date.now();
  const res = await fetch('/api/opportunities/1');
  const duration = Date.now() - startTime;
  const data = await res.json();
  updateInspector('GET', '/api/opportunities/1', res.status, res.statusText, duration, data);
});

// 4. GET /api/opportunities/999 (404 Not Found)
btnGet404.addEventListener('click', async () => {
  const startTime = Date.now();
  const res = await fetch('/api/opportunities/999');
  const duration = Date.now() - startTime;
  const data = await res.json();
  updateInspector('GET', '/api/opportunities/999', res.status, res.statusText, duration, data);
});

// 5. GET /api/undefined-endpoint (404 Route Not Found Middleware)
btnTestRoute404.addEventListener('click', async () => {
  const startTime = Date.now();
  const res = await fetch('/api/undefined-endpoint');
  const duration = Date.now() - startTime;
  const data = await res.json();
  updateInspector('GET', '/api/undefined-endpoint', res.status, res.statusText, duration, data);
});

// 6. POST Malformed JSON to trigger Centralized Error Handler (400)
btnTestBadJson.addEventListener('click', async () => {
  const startTime = Date.now();
  const res = await fetch('/api/opportunities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"title": "Broken JSON missing closing quote}'
  });
  const duration = Date.now() - startTime;
  const data = await res.json();
  updateInspector('POST', '/api/opportunities (malformed JSON)', res.status, res.statusText, duration, data);
});

// 7. Refresh Button
btnRefreshList.addEventListener('click', async () => {
  const result = await loadOpportunities();
  if (result) {
    updateInspector('GET', '/api/opportunities', result.res.status, result.res.statusText, result.duration, result.data);
  }
});

// 8. Handle Create Opportunity Form Submission
createForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    title: document.getElementById('title').value.trim(),
    organization: document.getElementById('organization').value.trim(),
    category: document.getElementById('category').value,
    description: document.getElementById('description').value.trim(),
    deadline: document.getElementById('deadline').value || null
  };

  const startTime = Date.now();
  try {
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const duration = Date.now() - startTime;
    const data = await res.json();

    updateInspector('POST', '/api/opportunities', res.status, res.statusText, duration, data);

    if (res.status === 201 && data.success) {
      createForm.reset();
      loadOpportunities();
    }
  } catch (err) {
    alert('Failed to post opportunity: ' + err.message);
  }
});

// Initial boot
(async function init() {
  const health = await checkHealth();
  updateInspector('GET', '/api/health', health.res.status, health.res.statusText, health.duration, health.data);
  await loadOpportunities();
})();
