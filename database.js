const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create tables
db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS app_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS app_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      app_name TEXT NOT NULL,
      category_id INTEGER,
      duration INTEGER NOT NULL,
      usage_date DATE DEFAULT (DATE('now')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS career_profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      skills TEXT,
      projects INTEGER,
      coding_hours_per_week INTEGER,
      learning_hours_per_week INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default categories
  db.run(`INSERT OR IGNORE INTO app_categories (id, name) VALUES (1, 'Productive')`);
  db.run(`INSERT OR IGNORE INTO app_categories (id, name) VALUES (2, 'Learning')`);
  db.run(`INSERT OR IGNORE INTO app_categories (id, name) VALUES (3, 'Entertainment')`);
  db.run(`INSERT OR IGNORE INTO app_categories (id, name) VALUES (4, 'Neutral')`);

});

module.exports = db;