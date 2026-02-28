const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// @route   POST /api/public/leads
// @desc    Capture a new lead from the public website form
router.post('/public/leads', async (req, res) => {
    const { name, email, phone, source } = req.body;

    // Basic Validation
    if (!name || !email) {
        return res.status(400).json({ message: "Name and Email are required." });
    }

    try {
        // Insert into MySQL
        // status defaults to new in SQL schema
        const query = `
            INSERT INTO leads (name, email, phone, source) 
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            name,
            email,
            phone || null,
            source || 'Website Form'
        ]);

        // Respond to the frontend
        res.status(201).json({
            message: "Lead captured successfully!",
            leadId: result.insertId
        });

    } catch (err) {
        console.error("Error saving lead:", err.message);
        res.status(500).json({ message: "Server error. Could not save lead." });
    }
});

// @route   GET /api/admin/leads
// @desc    Get all leads (PROTECTED)
router.get('/admin/leads', auth, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH /api/admin/leads/:id
// @desc    Update lead status (PROTECTED)
router.patch('/admin/leads/:id', auth, async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ['new', 'contacted', 'converted'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        await db.execute('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Lead ${id} updated to ${status}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/admin/leads/:id/notes
// @desc    Add a note to a specific lead (PROTECTED)
router.post('/admin/leads/:id/notes', auth, async (req, res) => {
    const { content } = req.body;
    const lead_id = req.params.id;
    const admin_id = req.admin.id; // Taken from token by the auth middleware

    if (!content) {
        return res.status(400).json({ message: "Note content is required." });
    }

    try {
        const query = 'INSERT INTO notes (lead_id, admin_id, content) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [lead_id, admin_id, content]);

        res.status(201).json({
            message: "Note added successfully!",
            noteId: result.insertId
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/leads/:id/notes
// @desc    Get all notes for a specific lead (PROTECTED)
router.get('/admin/leads/:id/notes', auth, async (req, res) => {
    const lead_id = req.params.id;

    try {
        const query = `
            SELECT notes.*, admins.username AS admin_name 
            FROM notes 
            JOIN admins ON notes.admin_id = admins.id 
            WHERE lead_id = ? 
            ORDER BY created_at DESC
        `;
        const [rows] = await db.execute(query, [lead_id]);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;