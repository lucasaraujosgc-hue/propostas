const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Determina o caminho do banco de dados (prioriza a montagem /backup do Easypanel)
const backupDir = '/backup';
const dbPath = fs.existsSync(backupDir) 
    ? path.join(backupDir, 'database.db') 
    : path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Inicializa o banco de dados
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY, key TEXT UNIQUE, data TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS proposals (id TEXT PRIMARY KEY, data TEXT, status TEXT, created_at DATETIME, expires_at DATETIME, viewed_at DATETIME, accepted_at DATETIME, acceptance_data TEXT)");
});

// Endpoint para buscar dados
app.get('/api/data', (req, res) => {
    db.get("SELECT data FROM app_state WHERE key = 'current_state'", (err, row) => {
        if (err) return res.status(500).send(err.message);
        res.json(row ? JSON.parse(row.data) : null);
    });
});

// Endpoint para salvar dados
app.post('/api/save', (req, res) => {
    const data = JSON.stringify(req.body);
    db.run("INSERT OR REPLACE INTO app_state (key, data) VALUES ('current_state', ?)", [data], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ success: true });
    });
});

// PROPOSALS ENDPOINTS

// Create proposal
app.post('/api/proposals', (req, res) => {
    const id = Math.random().toString(36).substring(2, 10);
    const proposalData = req.body.data;
    const expiresAt = req.body.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    db.run("INSERT INTO proposals (id, data, status, created_at, expires_at) VALUES (?, ?, ?, ?, ?)", 
        [id, JSON.stringify(proposalData), 'Enviada', new Date().toISOString(), expiresAt], 
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.json({ success: true, id: id });
        }
    );
});

// Get proposal by id
app.get('/api/proposals/:id', (req, res) => {
    db.get("SELECT * FROM proposals WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (!row) return res.status(404).send('Not found');
        
        const proposal = {
            id: row.id,
            data: JSON.parse(row.data),
            status: row.status,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
            viewedAt: row.viewed_at,
            acceptedAt: row.accepted_at,
            acceptanceData: row.acceptance_data ? JSON.parse(row.acceptance_data) : null
        };
        res.json(proposal);
    });
});

// List all proposals
app.get('/api/proposals', (req, res) => {
    db.all("SELECT * FROM proposals ORDER BY created_at DESC", (err, rows) => {
        if (err) return res.status(500).send(err.message);
        const proposals = rows.map(row => ({
            id: row.id,
            data: JSON.parse(row.data),
            status: row.status,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
            viewedAt: row.viewed_at,
            acceptedAt: row.accepted_at
        }));
        res.json(proposals);
    });
});

// Mark as viewed
app.post('/api/proposals/:id/view', (req, res) => {
    db.run("UPDATE proposals SET status = 'Visualizada', viewed_at = ? WHERE id = ? AND status = 'Enviada'", 
        [new Date().toISOString(), req.params.id], 
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.json({ success: true });
        }
    );
});

// Accept proposal
app.post('/api/proposals/:id/accept', (req, res) => {
    const acceptanceData = JSON.stringify(req.body);
    db.run("UPDATE proposals SET status = 'Aceita', accepted_at = ?, acceptance_data = ? WHERE id = ?", 
        [new Date().toISOString(), acceptanceData, req.params.id], 
        function(err) {
            if (err) return res.status(500).send(err.message);
            res.json({ success: true });
        }
    );
});

// SPA fallback - all other routes serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Banco de dados em: ${dbPath}`);
});