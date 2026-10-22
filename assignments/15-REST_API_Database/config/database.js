/**
 * ==============================================================================
 * KBTCOE Connect — MySQL Connection Pool (config/database.js)
 * Assignment 15: REST API and Database
 * ==============================================================================
 */

'use strict';

const mysql = require('mysql2/promise');
require('dotenv').config();

// Construct MySQL connection pool configuration from environment variables
const poolConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kbtcoe_connect_api',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// Create the reusable connection pool
const pool = mysql.createPool(poolConfig);

/**
 * Tests database connectivity by leasing a connection and executing a lightweight query.
 *
 * @returns {Promise<{ isConnected: boolean, version?: string, error?: string }>}
 */
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT VERSION() AS version, DATABASE() AS currentDb');
      return {
        isConnected: true,
        version: rows[0].version,
        database: rows[0].currentDb
      };
    } finally {
      connection.release();
    }
  } catch (err) {
    return {
      isConnected: false,
      error: err.code || err.message
    };
  }
}

module.exports = {
  pool,
  checkConnection
};
