require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const path    = require('path');

const app     = express();
const PORT    = process.env.PORT || 3000;
const TOKEN   = process.env.AIRTABLE_TOKEN;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}`;
const META_URL = `https://api.airtable.com/v0/meta/bases/${BASE_ID}`;

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Busca todos os registros com paginação
async function listarTodos(tabela, campos) {
  let registros = [];
  let offset    = null;
  do {
    const params = new URLSearchParams();
    if (campos) campos.forEach(c => params.append('fields[]', c));
    if (offset) params.append('offset', offset);
    const res = await axios.get(`${BASE_URL}/${encodeURIComponent(tabela)}?${params}`, { headers });
    registros = registros.concat(res.data.records);
    offset    = res.data.offset;
  } while (offset);
  return registros;
}

// ─── SCHEMA ────────────────────────────────────────────────
app.get('/api/schema', async (req, res) => {
  try {
    const r      = await axios.get(`${META_URL}/tables`, { headers });
    const campos = {};
    r.data.tables.forEach(t => {
      campos[t.name] = {};
      t.fields.forEach(f => {
        if (f.options?.choices) campos[t.name][f.name] = f.options.choices.map(c => c.name);
      });
    });
    res.json(campos);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// ─── AMOSTRAS ──────────────────────────────────────────────
app.get('/api/amostras', async (req, res) => {
  try {
    const registros = await listarTodos('Amostras', ['ID Amostra', 'Nome Amostra']);
    res.json(registros.map(r => ({ id: r.id, idAmostra: r.fields['ID Amostra'], nome: r.fields['Nome Amostra'] })));
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.get('/api/amostras/:id', async (req, res) => {
  try {
    const r = await axios.get(`${BASE_URL}/Amostras/${req.params.id}`, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.post('/api/amostras', async (req, res) => {
  try {
    const r = await axios.post(`${BASE_URL}/Amostras`, { fields: req.body }, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.response?.data || e.message }); }
});

app.patch('/api/amostras/:id', async (req, res) => {
  try {
    const r = await axios.patch(`${BASE_URL}/Amostras/${req.params.id}`, { fields: req.body }, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.response?.data || e.message }); }
});

app.delete('/api/amostras/:id', async (req, res) => {
  try {
    const r = await axios.delete(`${BASE_URL}/Amostras/${req.params.id}`, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// ─── CLIENTES ──────────────────────────────────────────────
app.get('/api/clientes', async (req, res) => {
  try {
    const registros = await listarTodos('Clientes', ['ID Cliente', 'Nome Cliente']);
    res.json(registros.map(r => ({ id: r.id, idCliente: r.fields['ID Cliente'], nome: r.fields['Nome Cliente'] })));
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.get('/api/clientes/:id', async (req, res) => {
  try {
    const r = await axios.get(`${BASE_URL}/Clientes/${req.params.id}`, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const r = await axios.post(`${BASE_URL}/Clientes`, { fields: req.body }, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.response?.data || e.message }); }
});

app.patch('/api/clientes/:id', async (req, res) => {
  try {
    const r = await axios.patch(`${BASE_URL}/Clientes/${req.params.id}`, { fields: req.body }, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.response?.data || e.message }); }
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const r = await axios.delete(`${BASE_URL}/Clientes/${req.params.id}`, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

// ─── ENSAIOS ───────────────────────────────────────────────
app.get('/api/ensaios', async (req, res) => {
  try {
    const registros = await listarTodos('Ensaios', ['ID Ensaio']);
    res.json(registros.map(r => ({ id: r.id, nome: r.fields['ID Ensaio'] })));
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.get('/api/ensaios/:id', async (req, res) => {
  try {
    const r = await axios.get(`${BASE_URL}/Ensaios/${req.params.id}`, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.post('/api/ensaios', async (req, res) => {
  try {
    const r = await axios.post(`${BASE_URL}/Ensaios`, { fields: req.body }, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.response?.data || e.message }); }
});

app.patch('/api/ensaios/:id', async (req, res) => {
  try {
    const r = await axios.patch(`${BASE_URL}/Ensaios/${req.params.id}`, { fields: req.body }, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.response?.data || e.message }); }
});

app.delete('/api/ensaios/:id', async (req, res) => {
  try {
    const r = await axios.delete(`${BASE_URL}/Ensaios/${req.params.id}`, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ erro: e.message }); }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
