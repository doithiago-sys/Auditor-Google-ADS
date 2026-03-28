// server.js – Express backend for Antigravity Auditor

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { scheduleAudits } = require('../utils/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend (Vercel will handle this, but for local dev we serve it)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Simple in‑memory SQLite DB (file persisted in project root)
const db = new sqlite3.Database(path.join(__dirname, 'audit_logs.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account TEXT,
    timestamp INTEGER,
    event TEXT,
    details TEXT
  )`);
});

// Dummy data generator – replace with real audit logic later
function getDummyStatus(account) {
  return {
    health: {
      site: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)],
      gtm: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)],
    },
    optimizations: [
      "Trocar título 2 do anúncio X por 'Laudo com Validade Jurídica'",
      "Adicionar termo 'Engenheiro' na descrição do anúncio Y",
      "Melhorar tempo de carregamento da página Z"
    ],
    waste: [
      "Palavra-chave 'preço barato' gerou 120 cliques sem conversão",
      "Termo 'oferta' não converteu – sugerir negativação"
    ],
    log: [
      { timestamp: Date.now() - 60000, message: 'Auditoria concluída' },
      { timestamp: Date.now() - 30000, message: 'Alerta de 404 detectado em /exemplo' }
    ]
  };
}

// API endpoint used by frontend
app.get('/api/status', (req, res) => {
  const account = req.query.account || 'default';
  const status = getDummyStatus(account);
  // Persist a log entry (for demo purposes)
  const stmt = db.prepare('INSERT INTO logs (account, timestamp, event, details) VALUES (?,?,?,?)');
  stmt.run(account, Date.now(), 'status_fetch', JSON.stringify(status));
  stmt.finalize();
  res.json(status);
});

// Start scheduler (placeholder – real audit jobs will be added later)
scheduleAudits(app, db);

app.listen(PORT, () => {
  console.log(`Antigravity Auditor backend listening on port ${PORT}`);
});

module.exports = app;
