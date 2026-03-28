// server.js – Express backend for Antigravity Auditor

const express = require('express');
const path = require('path');

// Simple in‑memory log store (no native dependencies)
const logs = [];

const { scheduleAudits } = require('../utils/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend (Vercel will handle this, but for local dev we serve it)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

/**
 * Helper to persist a log entry in the in‑memory array.
 * @param {string} account
 * @param {string} event
 * @param {any} details
 */
function addLog(account, event, details) {
  logs.push({
    id: logs.length + 1,
    account,
    timestamp: Date.now(),
    event,
    details,
  });
}

/**
 * Dummy data generator – replace with real audit logic later
 */
function getDummyStatus(account) {
  return {
    health: {
      site: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)],
      gtm: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)],
    },
    optimizations: [
      "Trocar título 2 do anúncio X por 'Laudo com Validade Jurídica'",
      "Adicionar termo 'Engenheiro' na descrição do anúncio Y",
      "Melhorar tempo de carregamento da página Z",
    ],
    waste: [
      "Palavra‑chave 'preço barato' gerou 120 cliques sem conversão",
      "Termo 'oferta' não converteu – sugerir negativação",
    ],
    log: [
      { timestamp: Date.now() - 60000, message: 'Auditoria concluída' },
      { timestamp: Date.now() - 30000, message: 'Alerta de 404 detectado em /exemplo' },
    ],
  };
}

// API endpoint used by frontend
app.get('/api/status', (req, res) => {
  const account = req.query.account || 'default';
  const status = getDummyStatus(account);

  // Persist a log entry (demo purposes) – using the in‑memory array
  addLog(account, 'status_fetch', JSON.stringify(status));

  res.json(status);
});

// Start scheduler (placeholder – real audit jobs will be added later)
// Pass the in‑memory logs array instead of a DB object
scheduleAudits(app, logs);

/* OAuth callback – recebe o código de autorização do Google */
app.get('/api/oauth/callback', (req, res) => {
  const { code, state } = req.query; // `code` é o token temporário
  // Aqui você trocaria o `code` por um access_token usando a API do Google
  // Por enquanto, apenas exibe o código recebido:
  res.send(`
    <h2>OAuth Callback recebido</h2>
    <p><strong>Code:</strong> ${code}</p>
    <p><strong>State:</strong> ${state || '—'}</p>
    <p>Agora você pode trocar esse código por um access token no seu fluxo backend.</p>
  `);
});

app.listen(PORT, () => {
  console.log(`Antigravity Auditor backend listening on port ${PORT}`);
});

module.exports = app;
