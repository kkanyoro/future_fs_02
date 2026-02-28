const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Import db pool
const leadRoutes = require('./routes/leads'); // import leads routes
const authRoutes = require('./routes/auth'); // import auth routes

const app = express();

// test-db route to test connection to database
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ message: "Database connection successful!", data: rows });
    } catch (err) {
        res.status(500).json({ error: "Database connection failed", details: err.message });
    }
});

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // to parse JSON bodies

app.use('/api', leadRoutes); // /api/public/leads
app.use('/api/auth', authRoutes); // /api/auth/login

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});