/**
 * MarkFlow Web Server & REST API
 * Lightweight Node native HTTP server providing the web UI and live markdown parsing endpoints.
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMarkdown, calculateStats } from './parser.js';
import { TEMPLATES } from './templates.js';
import { generateStandaloneHtml } from './exporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WEB_DIR = path.resolve(__dirname, '../web');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

/**
 * Creates and configures the MarkFlow HTTP server.
 * @param {object} [options]
 * @returns {http.Server}
 */
export function createServer(options = {}) {
  return http.createServer(async (req, res) => {
    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // Helper: JSON response
    const sendJson = (statusCode, data) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify(data));
    };

    // Helper: Read request body
    const readBody = async () => {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (!raw) return {};
      try {
        return JSON.parse(raw);
      } catch {
        return { raw };
      }
    };

    try {
      // 1. Health check
      if (pathname === '/api/health') {
        return sendJson(200, {
          status: 'ok',
          service: 'markflow-resume',
          port: options.port || 3006,
          timestamp: new Date().toISOString()
        });
      }

      // 2. Templates list
      if (pathname === '/api/templates' && req.method === 'GET') {
        const list = Object.values(TEMPLATES).map(({ id, name, category, description }) => ({
          id, name, category, description
        }));
        return sendJson(200, { templates: list });
      }

      // 3. Get single template content
      if (pathname.startsWith('/api/templates/') && req.method === 'GET') {
        const id = pathname.replace('/api/templates/', '').trim();
        const template = TEMPLATES[id];
        if (!template) {
          return sendJson(404, { error: 'Template not found' });
        }
        return sendJson(200, template);
      }

      // 4. Render markdown to HTML + stats
      if (pathname === '/api/render' && req.method === 'POST') {
        const body = await readBody();
        const markdown = body.markdown || '';
        const html = parseMarkdown(markdown);
        const stats = calculateStats(markdown);
        return sendJson(200, { html, stats });
      }

      // 5. Calculate statistics only
      if (pathname === '/api/stats' && req.method === 'POST') {
        const body = await readBody();
        const markdown = body.markdown || '';
        const stats = calculateStats(markdown);
        return sendJson(200, { stats });
      }

      // 6. Export as standalone printable HTML
      if (pathname === '/api/export' && req.method === 'POST') {
        const body = await readBody();
        const markdown = body.markdown || '';
        const title = body.title || 'MarkFlow Document';
        const standaloneHtml = generateStandaloneHtml(markdown, { title });
        return sendJson(200, { html: standaloneHtml, title });
      }

      // 7. Static file serving from web/
      let filePath = path.join(WEB_DIR, pathname === '/' ? 'index.html' : pathname);
      
      // Prevent directory traversal
      if (!filePath.startsWith(WEB_DIR)) {
        res.writeHead(403);
        return res.end('Access Denied');
      }

      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      } catch (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        }
      }
    } catch (err) {
      sendJson(500, { error: err.message || 'Internal server error' });
    }
  });
}

/**
 * Starts the server on the specified port.
 * @param {number} [port=3006]
 * @returns {Promise<{ server: http.Server, port: number }>}
 */
export function startServer(port = 3006) {
  return new Promise((resolve, reject) => {
    const server = createServer({ port });
    server.listen(port, () => {
      resolve({ server, port });
    });
    server.on('error', reject);
  });
}
