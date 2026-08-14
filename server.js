const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'virgula2026';

app.use(bodyParser.json());
app.use(express.static(__dirname));

const localDb = path.join(__dirname, 'database.sqlite');
let dbDir = path.join(__dirname, 'backup');

if (fs.existsSync('/backup')) {
    dbDir = '/backup';
} else if (fs.existsSync('/app/backup')) {
    dbDir = '/app/backup';
} else if (fs.existsSync('/data')) {
    dbDir = '/data';
}

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

let dbPath = path.join(dbDir, 'database.sqlite');

// Migrate old local db if it exists and the new one doesn't
if (fs.existsSync(localDb) && !fs.existsSync(dbPath)) {
    fs.copyFileSync(localDb, dbPath);
}

const db = new sqlite3.Database(dbPath);

function saveBackupJSON() {
    db.all("SELECT * FROM proposals", (err, rows) => {
        if (!err && rows) {
            fs.writeFileSync(path.join(dbDir, 'proposals.json'), JSON.stringify(rows, null, 2));
        }
    });
}

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY, key TEXT UNIQUE, data TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS proposals (id TEXT PRIMARY KEY, data TEXT, status TEXT, created_at DATETIME, expires_at DATETIME, viewed_at DATETIME, accepted_at DATETIME, acceptance_data TEXT)");
});

// Middleware de Autenticação
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer auth-ok') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Login
app.post('/api/login', (req, res) => {
    if (req.body.password === ADMIN_PASSWORD) {
        res.json({ success: true, token: 'auth-ok' });
    } else {
        res.status(401).json({ success: false, error: 'Senha incorreta' });
    }
});

// Dados públicos do escritório (usados pela proposta pública)
app.get('/api/data', (req, res) => {
    db.get("SELECT data FROM app_state WHERE key = 'main_config'", (err, row) => {
        if (err) return res.status(500).send(err.message);
        res.json(row ? JSON.parse(row.data) : null);
    });
});

// Salvar configurações do escritório (Protegido)
app.post('/api/save', authMiddleware, (req, res) => {
    const data = JSON.stringify(req.body);
    db.run("INSERT OR REPLACE INTO app_state (id, key, data) VALUES (1, 'main_config', ?)", [data], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ success: true });
    });
});

// Criar nova proposta (Protegido)
app.post('/api/proposals', authMiddleware, (req, res) => {
    const id = Math.random().toString(36).substring(2, 10);
    const proposalData = req.body.data;
    const expiresAt = req.body.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    db.run("INSERT INTO proposals (id, data, status, created_at, expires_at) VALUES (?, ?, ?, ?, ?)", 
        [id, JSON.stringify(proposalData), 'Enviada', new Date().toISOString(), expiresAt], 
        function(err) {
            if (err) return res.status(500).send(err.message);
            saveBackupJSON();
            res.json({ success: true, id: id });
        }
    );
});

// Listar todas as propostas (Protegido)
app.get('/api/proposals', authMiddleware, (req, res) => {
    db.all("SELECT * FROM proposals ORDER BY created_at DESC", (err, rows) => {
        if (err) return res.status(500).send(err.message);
        const proposals = rows.map(row => ({
            id: row.id,
            data: JSON.parse(row.data),
            status: row.status,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
            viewedAt: row.viewed_at,
            acceptedAt: row.accepted_at,
            acceptanceData: row.acceptance_data ? JSON.parse(row.acceptance_data) : null
        }));
        res.json(proposals);
    });
});

// Buscar proposta específica (Público - para o cliente)
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

// Marcar como visualizada (Público)
app.post('/api/proposals/:id/view', (req, res) => {
    db.run("UPDATE proposals SET status = 'Visualizada', viewed_at = ? WHERE id = ? AND status = 'Enviada'", 
        [new Date().toISOString(), req.params.id], 
        function(err) {
            if (err) return res.status(500).send(err.message);
            saveBackupJSON();
            res.json({ success: true });
        }
    );
});

// Aceitar proposta (Público)
app.post('/api/proposals/:id/accept', (req, res) => {
    const acceptanceData = JSON.stringify(req.body);
    db.run("UPDATE proposals SET status = 'Aceita', accepted_at = ?, acceptance_data = ? WHERE id = ?", 
        [new Date().toISOString(), acceptanceData, req.params.id], 
        function(err) {
            if (err) return res.status(500).send(err.message);
            saveBackupJSON();
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
});
