/**
 * Relational Database Configuration & Connection Pool
 * Assignment 16: KBTCOE Connect Final Full-Stack Web Development Project
 * Database: kbtcoe_connect_final
 * Department of Computer Engineering, MVP's KBTCOE Nashik
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kbtcoe_connect_final',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  timezone: '+00:00'
});

/**
 * Verifies active database connectivity and returns metadata.
 *
 * @returns {Promise<{ isConnected: boolean, database?: string, version?: string, error?: string }>}
 */
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT DATABASE() AS currentDb, VERSION() AS version');
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
