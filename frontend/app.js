// app.js – Frontend logic for Antigravity Auditor Dashboard

// Helper to format timestamps
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function loadDashboard(accountId) {
  try {
    const resp = await fetch(`/api/status?account=${accountId}`);
    if (!resp.ok) throw new Error('Network response was not ok');
    const data = await resp.json();
    renderHealth(data.health);
    renderOptimizations(data.optimizations);
    renderWaste(data.waste);
    renderLog(data.log);
  } catch (e) {
    console.error('Failed to load dashboard:', e);
    document.getElementById('actionLog').textContent = 'Erro ao carregar dados: ' + e.message;
  }
}

function renderHealth(health) {
  const container = document.getElementById('healthStatus');
  container.innerHTML = '';
  const statuses = ['site', 'gtm'];
  statuses.forEach(key => {
    const status = health[key];
    const div = document.createElement('div');
    div.className = `icon ${status}`; // green / yellow / red
    div.title = `${key.toUpperCase()}: ${status.toUpperCase()}`;
    div.textContent = key[0].toUpperCase();
    container.appendChild(div);
  });
}

function renderOptimizations(list) {
  const ul = document.getElementById('optimizations');
  ul.innerHTML = '';
  list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

function renderWaste(list) {
  const ul = document.getElementById('wasteAlerts');
  ul.innerHTML = '';
  list.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
}

function renderLog(entries) {
  const pre = document.getElementById('actionLog');
  pre.textContent = '';
  entries.forEach(e => {
    pre.textContent += `[${formatTime(e.timestamp)}] ${e.message}\n`;
  });
}

// Event listeners
document.getElementById('accountSelect').addEventListener('change', (e) => {
  loadDashboard(e.target.value);
});

// Initial load for default selected account
loadDashboard(document.getElementById('accountSelect').value);
