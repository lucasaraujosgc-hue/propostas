const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 80;

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

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Banco de dados em: ${dbPath}`);
});