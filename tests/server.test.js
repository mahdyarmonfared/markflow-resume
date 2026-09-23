import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createServer } from '../src/server.js';

describe('MarkFlow Server API Tests', () => {
  let server;
  let baseUrl;
  const testPort = 3691;

  before(async () => {
    server = createServer({ port: testPort });
    await new Promise((resolve) => server.listen(testPort, resolve));
    baseUrl = `http://localhost:${testPort}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  const request = (path, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const req = http.request(url, {
        method,
        headers: { 'Content-Type': 'application/json' }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data), raw: data });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });
      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  };

  test('GET /api/health responds with 200 OK', async () => {
    const res = await request('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.service, 'markflow-resume');
  });

  test('GET /api/templates lists available templates', async () => {
    const res = await request('/api/templates');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.templates));
    assert.ok(res.body.templates.some(t => t.id === 'resume'));
  });

  test('GET /api/templates/resume returns template content', async () => {
    const res = await request('/api/templates/resume');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'resume');
    assert.match(res.body.content, /Alex Morgan/);
  });

  test('POST /api/render converts markdown to html and returns stats', async () => {
    const res = await request('/api/render', 'POST', {
      markdown: '# Test Header\n\nSome test sentence with words.'
    });
    assert.equal(res.status, 200);
    assert.match(res.body.html, /<h1 id="test-header"/);
    assert.ok(res.body.stats.words > 0);
  });

  test('POST /api/export produces standalone printable HTML', async () => {
    const res = await request('/api/export', 'POST', {
      markdown: '# Export Doc',
      title: 'Export Test'
    });
    assert.equal(res.status, 200);
    assert.match(res.body.html, /<!DOCTYPE html>/);
    assert.match(res.body.html, /Export Test/);
  });
});
