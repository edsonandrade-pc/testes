const http = require('http');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3333;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'leads.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readLeads() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeLeads(leads) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf8');
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('JSON inválido.'));
      }
    });
  });
}

function notFound(res) {
  sendJson(res, 404, { message: 'Rota não encontrada.' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, { status: 'ok', service: 'microcrm-api' });
  }

  if (req.method === 'GET' && url.pathname === '/leads') {
    const leads = readLeads();
    return sendJson(res, 200, leads);
  }

  if (req.method === 'POST' && url.pathname === '/leads') {
    try {
      const body = await parseBody(req);
      if (!body.name || !body.email) {
        return sendJson(res, 400, { message: 'name e email são obrigatórios.' });
      }

      const leads = readLeads();
      const lead = {
        id: randomUUID(),
        name: body.name,
        email: body.email,
        source: body.source || 'unknown',
        status: 'new',
        createdAt: new Date().toISOString()
      };

      leads.push(lead);
      writeLeads(leads);
      return sendJson(res, 201, lead);
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  if (req.method === 'PATCH' && /^\/leads\/[^/]+\/status$/.test(url.pathname)) {
    try {
      const id = url.pathname.split('/')[2];
      const body = await parseBody(req);
      const validStatus = ['new', 'contacted', 'proposal', 'won', 'lost'];

      if (!validStatus.includes(body.status)) {
        return sendJson(res, 400, { message: `status deve ser um de: ${validStatus.join(', ')}` });
      }

      const leads = readLeads();
      const index = leads.findIndex((lead) => lead.id === id);
      if (index === -1) {
        return sendJson(res, 404, { message: 'Lead não encontrado.' });
      }

      leads[index].status = body.status;
      leads[index].updatedAt = new Date().toISOString();
      writeLeads(leads);

      return sendJson(res, 200, leads[index]);
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  if (req.method === 'DELETE' && url.pathname.startsWith('/leads/')) {
    const id = url.pathname.split('/')[2];
    const leads = readLeads();
    const filtered = leads.filter((lead) => lead.id !== id);

    if (filtered.length === leads.length) {
      return sendJson(res, 404, { message: 'Lead não encontrado.' });
    }

    writeLeads(filtered);
    return sendJson(res, 200, { message: 'Lead removido com sucesso.' });
  }

  return notFound(res);
});

server.listen(PORT, () => {
  console.log(`MicroCRM API rodando em http://localhost:${PORT}`);
});
