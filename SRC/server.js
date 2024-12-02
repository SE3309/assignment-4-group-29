const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files (index.html, CSS, JS)

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',      // MySQL host (localhost for local setup)
    user: 'root',           // Your MySQL username
    password: 'password',   // Your MySQL password
    database: 'job_portal', // The name of your database
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit process on connection failure
    }
    console.log('Connected to MySQL Database');
});

// ROUTES

// 1. Search Jobs
app.get('/jobs', (req, res) => {
    const { title = '', location = '', salary = 0 } = req.query;
    const sql = `
        SELECT * FROM Jobs 
        WHERE title LIKE ? AND location LIKE ? AND salary >= ?;
    `;
    db.query(sql, [`%${title}%`, `%${location}%`, salary], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// 2. Apply for a Job
app.post('/apply', (req, res) => {
    const { user_id, job_id, resume_link } = req.body;

    // Validate inputs
    if (!user_id || !job_id || !resume_link) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `
        INSERT INTO Applications (user_id, job_id, resume_link, date_applied)
        VALUES (?, ?, ?, NOW());
    `;
    db.query(sql, [user_id, job_id, resume_link], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to apply for the job' });
        }
        res.json({ message: 'Application submitted successfully', id: results.insertId });
    });
});

// 3. Post a Job
app.post('/post-job', (req, res) => {
    const { employer_id, title, location, salary, description } = req.body;

    // Validate inputs
    if (!employer_id || !title || !location || !salary || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `
        INSERT INTO Jobs (employer_id, title, location, salary, description, status)
        VALUES (?, ?, ?, ?, ?, 'active');
    `;
    db.query(sql, [employer_id, title, location, salary, description], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to post the job' });
        }
        res.json({ message: 'Job posted successfully', id: results.insertId });
    });
});

// 4. Update Job Status
app.patch('/update-job-status', (req, res) => {
    const { job_id, status } = req.body;

    // Validate inputs
    if (!job_id || !status) {
        return res.status(400).json({ error: 'Job ID and status are required' });
    }

    const sql = `
        UPDATE Jobs
        SET status = ?
        WHERE job_id = ?;
    `;
    db.query(sql, [status, job_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update job status' });
        }
        res.json({ message: 'Job status updated successfully' });
    });
});

// 5. View Applications for a Job
app.get('/view-applications/:job_id', (req, res) => {
    const { job_id } = req.params;

    // Validate input
    if (!job_id) {
        return res.status(400).json({ error: 'Job ID is required' });
    }

    const sql = `
        SELECT a.application_id, u.name AS applicant_name, a.resume_link, a.date_applied
        FROM Applications a
        JOIN Users u ON a.user_id = u.user_id
        WHERE a.job_id = ?;
    `;
    db.query(sql, [job_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch applications' });
        }
        res.json(results);
    });
});

// 6. Generate Reports
app.get('/generate-reports/:employer_id', (req, res) => {
    const { employer_id } = req.params;

    // Validate input
    if (!employer_id) {
        return res.status(400).json({ error: 'Employer ID is required' });
    }

    const sql = `
        SELECT j.title, COUNT(a.application_id) AS applications_count
        FROM Jobs j
        LEFT JOIN Applications a ON j.job_id = a.job_id
        WHERE j.employer_id = ?
        GROUP BY j.job_id;
    `;
    db.query(sql, [employer_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to generate report' });
        }
        res.json(results);
    });
});

// Default Route for Invalid Endpoints
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
