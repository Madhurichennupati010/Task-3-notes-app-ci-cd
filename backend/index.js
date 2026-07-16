require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check MySQL Connection
function connectDB() {
    db.getConnection((err, connection) => {
        if (err) {
            console.log("⏳ Waiting for MySQL...");
            console.log(err.message);
            return setTimeout(connectDB, 5000);
        }

        console.log("✅ Connected to MySQL");

        connection.release();

        db.query(
            `CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            (err) => {
                if (err) {
                    console.log("Table Creation Error:", err.message);
                } else {
                    console.log("✅ Notes table ready");
                }
            }
        );
    });
}

connectDB();

// Health Check
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Notes Backend API is running..."
    });
});

// Get All Notes
app.get("/api/notes", (req, res) => {
    db.query(
        "SELECT * FROM notes ORDER BY id DESC",
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(results);
        }
    );
});

// Get Note By ID
app.get("/api/notes/:id", (req, res) => {
    db.query(
        "SELECT * FROM notes WHERE id=?",
        [req.params.id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Note Not Found"
                });
            }

            res.json(results[0]);
        }
    );
});

// Create Note
app.post("/api/notes", (req, res) => {

    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and Content are required"
        });
    }

    db.query(
        "INSERT INTO notes(title,content) VALUES(?,?)",
        [title, content],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Note Created Successfully",
                id: result.insertId
            });

        }
    );
});

// Update Note
app.put("/api/notes/:id", (req, res) => {

    const { title, content } = req.body;

    db.query(
        "UPDATE notes SET title=?, content=? WHERE id=?",
        [title, content, req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Note Not Found"
                });
            }

            res.json({
                message: "Note Updated Successfully"
            });

        }
    );
});

// Delete Note
app.delete("/api/notes/:id", (req, res) => {

    db.query(
        "DELETE FROM notes WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Note Not Found"
                });
            }

            res.json({
                message: "Note Deleted Successfully"
            });

        }
    );
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Backend API running on port ${PORT}`);
});