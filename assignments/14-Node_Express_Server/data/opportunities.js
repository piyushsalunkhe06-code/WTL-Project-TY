/**
 * ==============================================================================
 * KBTCOE Connect — In-Memory Opportunity Data Store (opportunities.js)
 * Assignment 14: Node.js and Express Server
 *
 * NOTE: This is an in-memory mock repository for educational demonstration.
 * All modifications (additions, updates, deletions) are held in Node.js server
 * process memory and will naturally reset to the initial seed records upon
 * server restart. Persistent relational storage is covered in Assignment 15.
 * ==============================================================================
 */

'use strict';

/**
 * Whitelist of allowed collegiate opportunity categories.
 */
const ALLOWED_CATEGORIES = ['internship', 'hackathon', 'competition', 'workshop'];

/**
 * Initial seed collection containing 6 rich fictional campus opportunities.
 * Spans all four supported categories.
 */
const INITIAL_SEEDS = [
  {
    id: 1,
    title: 'Siemens Summer Research Internship 2026',
    organization: 'Siemens Technology India',
    category: 'internship',
    description: 'Eight-week hands-on industrial research internship focused on industrial IoT telemetry, edge computing, and predictive maintenance pipelines.',
    eligibility: 'TE & BE Computer & IT engineering students with min 60% aggregate',
    applicationUrl: 'https://siemens.com/careers/students',
    deadline: '2026-11-15',
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T09:00:00.000Z'
  },
  {
    id: 2,
    title: 'Smart Campus Telemetry Hackathon 2026',
    organization: 'KBTCOE Innovation & Entrepreneurship Development Centre (IEDC)',
    category: 'hackathon',
    description: 'A 36-hour non-stop institutional hackathon to engineer smart water metering, solar generation analytics, and energy monitoring across the college campus.',
    eligibility: 'Interdisciplinary collegiate teams of 3 to 4 members across all branches',
    applicationUrl: 'https://kbtcoe.org/hackathon-2026',
    deadline: '2026-11-20',
    createdAt: '2026-10-02T10:30:00.000Z',
    updatedAt: '2026-10-02T10:30:00.000Z'
  },
  {
    id: 3,
    title: 'SPPU Regional Technical Paper & Project Competition',
    organization: 'Department of Information Technology, KBTCOE',
    category: 'competition',
    description: 'Annual peer-reviewed technical paper competition covering Distributed Systems, Applied AI/ML, Cloud Architectures, and Cyber Security.',
    eligibility: 'All FE, SE, TE, and BE engineering undergraduates',
    applicationUrl: 'https://kbtcoe.org/tech-symposium',
    deadline: '2026-11-30',
    createdAt: '2026-10-03T11:15:00.000Z',
    updatedAt: '2026-10-03T11:15:00.000Z'
  },
  {
    id: 4,
    title: 'AWS Cloud Architecture & Kubernetes Masterclass',
    organization: 'KBTCOE Cloud Computing & DevOps Club',
    category: 'workshop',
    description: 'Three-day intensive technical boot camp featuring live AWS architecture labs, Docker containerization, and Kubernetes cluster orchestration.',
    eligibility: 'Open to all engineering students with basic Linux / CLI familiarity',
    applicationUrl: 'https://kbtcoe.org/workshops/cloud-2026',
    deadline: '2026-12-05',
    createdAt: '2026-10-04T14:00:00.000Z',
    updatedAt: '2026-10-04T14:00:00.000Z'
  },
  {
    id: 5,
    title: 'Bosch Embedded Systems & Automotive IoT Internship',
    organization: 'Bosch Global Software Technologies',
    category: 'internship',
    description: 'Six-month semester internship in automotive embedded firmware, CAN bus diagnostics, and sensor fusion telematics.',
    eligibility: 'BE E&TC, Computer, and Instrumentation students graduating in 2027',
    applicationUrl: 'https://bosch.in/careers/campus',
    deadline: '2026-12-10',
    createdAt: '2026-10-05T08:45:00.000Z',
    updatedAt: '2026-10-05T08:45:00.000Z'
  },
  {
    id: 6,
    title: 'National Collegiate CodeSprint 2026',
    organization: 'Association for Computing Machinery (ACM) Student Chapter',
    category: 'competition',
    description: 'Five-hour national competitive algorithmic programming challenge hosted on HackerRank, featuring data structures and dynamic programming.',
    eligibility: 'Individual participation open to all enrolled college students',
    applicationUrl: 'https://hackerrank.com/kbtcoe-codesprint-2026',
    deadline: '2026-12-15',
    createdAt: '2026-10-06T12:00:00.000Z',
    updatedAt: '2026-10-06T12:00:00.000Z'
  }
];

// In-memory working collection (deep-cloned from INITIAL_SEEDS)
let opportunities = JSON.parse(JSON.stringify(INITIAL_SEEDS));

/**
 * Retrieves all opportunities with optional filtering by search query and category.
 *
 * @param {Object} [filters]
 * @param {string} [filters.q] - Keyword to search in title, organization, or description
 * @param {string} [filters.category] - Opportunity category filter
 * @returns {Array<Object>}
 */
function getAll(filters = {}) {
  let results = [...opportunities];

  if (filters.category) {
    const targetCat = filters.category.toLowerCase().trim();
    results = results.filter((opp) => opp.category.toLowerCase() === targetCat);
  }

  if (filters.q) {
    const query = filters.q.toLowerCase().trim();
    results = results.filter(
      (opp) =>
        opp.title.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query)
    );
  }

  // Sort by deadline ascending (earliest upcoming first)
  results.sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return results;
}

/**
 * Retrieves a single opportunity by its numeric identifier.
 *
 * @param {number} id
 * @returns {Object|null}
 */
function getById(id) {
  const numericId = Number(id);
  const found = opportunities.find((opp) => opp.id === numericId);
  return found ? { ...found } : null;
}

/**
 * Creates and appends a new opportunity to the in-memory array.
 * Autogenerates a unique numeric ID and timestamps.
 * Client-provided IDs and timestamps are deliberately ignored.
 *
 * @param {Object} data
 * @returns {Object} Newly created opportunity object
 */
function create(data) {
  const maxId = opportunities.reduce((max, opp) => Math.max(max, opp.id), 0);
  const now = new Date().toISOString();

  const newRecord = {
    id: maxId + 1,
    title: String(data.title).trim(),
    organization: String(data.organization).trim(),
    category: String(data.category).toLowerCase().trim(),
    description: String(data.description).trim(),
    eligibility: data.eligibility ? String(data.eligibility).trim() : 'Open to all KBTCOE students',
    applicationUrl: data.applicationUrl ? String(data.applicationUrl).trim() : '',
    deadline: data.deadline ? String(data.deadline).trim() : null,
    createdAt: now,
    updatedAt: now
  };

  opportunities.push(newRecord);
  return { ...newRecord };
}

/**
 * Updates an existing opportunity by ID in the in-memory array.
 *
 * @param {number} id
 * @param {Object} data
 * @returns {Object|null} Updated opportunity object, or null if not found
 */
function update(id, data) {
  const numericId = Number(id);
  const index = opportunities.findIndex((opp) => opp.id === numericId);

  if (index === -1) {
    return null;
  }

  const existing = opportunities[index];
  const now = new Date().toISOString();

  const updatedRecord = {
    ...existing,
    title: data.title !== undefined ? String(data.title).trim() : existing.title,
    organization: data.organization !== undefined ? String(data.organization).trim() : existing.organization,
    category: data.category !== undefined ? String(data.category).toLowerCase().trim() : existing.category,
    description: data.description !== undefined ? String(data.description).trim() : existing.description,
    eligibility: data.eligibility !== undefined ? String(data.eligibility).trim() : existing.eligibility,
    applicationUrl: data.applicationUrl !== undefined ? String(data.applicationUrl).trim() : existing.applicationUrl,
    deadline: data.deadline !== undefined ? String(data.deadline).trim() : existing.deadline,
    updatedAt: now
  };

  opportunities[index] = updatedRecord;
  return { ...updatedRecord };
}

/**
 * Deletes an opportunity by ID from the in-memory array.
 *
 * @param {number} id
 * @returns {boolean} True if deleted, false if record not found
 */
function remove(id) {
  const numericId = Number(id);
  const index = opportunities.findIndex((opp) => opp.id === numericId);

  if (index === -1) {
    return false;
  }

  opportunities.splice(index, 1);
  return true;
}

/**
 * Resets the working collection to the initial seed dataset.
 *
 * @returns {void}
 */
function reset() {
  opportunities = JSON.parse(JSON.stringify(INITIAL_SEEDS));
}

module.exports = {
  ALLOWED_CATEGORIES,
  getAll,
  getById,
  create,
  update,
  remove,
  reset
};
