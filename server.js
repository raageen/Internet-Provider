const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const path = require('path');

const db = new sqlite3.Database('provider.db');

app.use(express.json());
app.use(express.static('public'));

app.get('/clients', (req, res) => {
    let { name, district, plan, status } = req.query;
    let query = `SELECT * FROM clients WHERE 1=1`;
    if (name) query += ` AND name LIKE '%${name}%'`;
    if (district) query += ` AND district = '${district}'`;
    if (plan) query += ` AND plan LIKE '%${plan}%'`;
    if (status) query += ` AND status = '${status}'`;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/clients', (req, res) => {
    const { name, address, district, plan, status } = req.body;
    const query = `INSERT INTO clients (name, address, district, plan, status) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [name, address, district, plan, status], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.put('/clients/:id', (req, res) => {
    const { id } = req.params;
    const { name, address, district, plan, status } = req.body;
    const query = `UPDATE clients SET name = ?, address = ?, district = ?, plan = ?, status = ? WHERE id = ?`;
    db.run(query, [name, address, district, plan, status, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ message: 'Client updated' });
    });
});

app.delete('/clients/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM clients WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ message: 'Client deleted' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
