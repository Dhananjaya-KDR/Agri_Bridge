import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./agribridge.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            role TEXT NOT NULL,
            location TEXT,
            contact TEXT
        )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER,
            receiver_id INTEGER,
            content TEXT,
            type TEXT DEFAULT 'text',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            read_status INTEGER DEFAULT 0
        )`, (err) => {
      if (err) {
        console.error('Error creating messages table:', err.message);
      } else {
        // Add type column if it doesn't exist (for existing databases)
        db.run(`ALTER TABLE messages ADD COLUMN type TEXT DEFAULT 'text'`, (err) => {
            // Ignore error if column already exists
            if (err && !err.message.includes("duplicate column name")) {
                console.error("Error adding type column:", err.message);
            }
        });
      }
    });
  }
});

export default db;
