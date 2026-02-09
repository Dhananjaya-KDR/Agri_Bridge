import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './database.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('AgriBridge Backend is running');
});

// Register User
app.post('/api/register', (req, res) => {
    const { name, email, role, location, contact } = req.body;
    
    if (!name || !role) {
        return res.status(400).json({ error: "Name and Role are required" });
    }

    const sql = 'INSERT INTO users (name, email, role, location, contact) VALUES (?, ?, ?, ?, ?)';
    const params = [name, email, role, location, contact];
    
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: req.body,
            id: this.lastID
        });
    });
});

// Get Users by Role
app.get('/api/users/:role', (req, res) => {
    const { role } = req.params;
    const sql = 'SELECT * FROM users WHERE role = ?';
    db.all(sql, [role], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Simple login by username for demo
    const sql = "SELECT * FROM users WHERE name = ?";
    db.get(sql, [username], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (row) {
            res.json({
                message: "success",
                user: row
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});

// Social Login Check
app.post('/api/social-login', (req, res) => {
    const { email } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (row) {
            res.json({
                message: "success",
                user: row
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});

// --- Chat APIs ---

// Send Message
app.post('/api/messages', (req, res) => {
    const { sender_id, receiver_id, content, type = 'text' } = req.body;
    const sql = 'INSERT INTO messages (sender_id, receiver_id, content, type) VALUES (?, ?, ?, ?)';
    const params = [sender_id, receiver_id, content, type];
    
    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            id: this.lastID
        });
    });
});

// Get Messages between two users
app.get('/api/messages/:user1/:user2', (req, res) => {
    const { user1, user2 } = req.params;
    const sql = `
        SELECT * FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) 
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY timestamp ASC
    `;
    db.all(sql, [user1, user2, user2, user1], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get Unread Count for a user (Global count)
app.get('/api/messages/unread/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND read_status = 0`;
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ count: row.count });
    });
});

// Get Unread Senders with details (For notification dropdown)
app.get('/api/messages/unread-senders/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = `
        SELECT m.sender_id, u.name as sender_name, COUNT(*) as count 
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.receiver_id = ? AND m.read_status = 0
        GROUP BY m.sender_id
    `;
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Mark messages as read
app.post('/api/messages/mark-read', (req, res) => {
    const { user_id, sender_id } = req.body;
    const sql = `UPDATE messages SET read_status = 1 WHERE receiver_id = ? AND sender_id = ?`;
    db.run(sql, [user_id, sender_id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'success', changes: this.changes });
    });
});

// --- Notification APIs ---

// Create Notification
app.post('/api/notifications', (req, res) => {
    const { user_id, message, type = 'info' } = req.body;
    const sql = 'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)';
    db.run(sql, [user_id, message, type], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'success', id: this.lastID });
    });
});

// Get Notifications for User
app.get('/api/notifications/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC';
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Get Unread Notification Count
app.get('/api/notifications/unread-count/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0';
    db.get(sql, [userId], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ count: row.count });
    });
});

// Mark Notification as Read
app.post('/api/notifications/mark-read', (req, res) => {
    const { id } = req.body;
    const sql = 'UPDATE notifications SET is_read = 1 WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'success' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
