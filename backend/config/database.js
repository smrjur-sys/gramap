const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './db/gramap.db';

let db = null;

/**
 * Inicializa a conexão com o banco de dados
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err.message);
        reject(err);
      } else {
        console.log('✅ Conectado ao SQLite');
        resolve(db);
      }
    });
  });
}

/**
 * Obtém a conexão com o banco de dados
 */
function getDatabase() {
  if (!db) {
    throw new Error('Banco de dados não foi inicializado!');
  }
  return db;
}

/**
 * Fecha a conexão com o banco de dados
 */
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Conexão com banco de dados fechada');
          db = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  db: () => getDatabase()
};
