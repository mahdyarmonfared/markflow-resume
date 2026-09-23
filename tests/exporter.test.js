import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateStandaloneHtml, getEmbeddedStyles } from '../src/exporter.js';

describe('MarkFlow Exporter Tests', () => {
  test('getEmbeddedStyles returns valid A4 print styles', () => {
    const css = getEmbeddedStyles();
    assert.match(css, /@page/);
    assert.match(css, /size:\s*A4\s*portrait/i);
    assert.match(css, /@media print/);
    assert.match(css, /page-break-after:\s*always/);
  });

  test('generateStandaloneHtml embeds title and A4 markup', () => {
    const md = `# Document Title\n\nSome body text`;
    const html = generateStandaloneHtml(md, { title: 'Custom Title' });
    assert.match(html, /<!DOCTYPE html>/);
    assert.match(html, /<title>Custom Title<\/title>/);
    assert.match(html, /<main class="a4-page">/);
    assert.match(html, /<h1 id="document-title"/);
  });
});
