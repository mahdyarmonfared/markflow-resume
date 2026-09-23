import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseMarkdown, parseFrontmatter, parseInline, calculateStats, escapeHtml, sanitizeUrl } from '../src/parser.js';

describe('MarkFlow Parser Tests', () => {
  test('escapeHtml handles dangerous characters', () => {
    assert.equal(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    assert.equal(escapeHtml('foo & bar'), 'foo &amp; bar');
  });

  test('sanitizeUrl neutralizes javascript: URIs', () => {
    assert.equal(sanitizeUrl('javascript:alert(1)'), '#');
    assert.equal(sanitizeUrl('JAVASCRIPT:void(0)'), '#');
    assert.equal(sanitizeUrl('https://example.com'), 'https://example.com');
  });

  test('parseFrontmatter extracts YAML-like metadata and body', () => {
    const md = `---
title: "Senior Engineer"
author: "Alex"
---

# Hello World`;
    const { metadata, content } = parseFrontmatter(md);
    assert.equal(metadata.title, 'Senior Engineer');
    assert.equal(metadata.author, 'Alex');
    assert.match(content, /# Hello World/);
  });

  test('parseInline transforms custom resume tags', () => {
    const input = 'Experienced in [skill: TypeScript] and [tag: Docker]';
    const output = parseInline(input);
    assert.match(output, /<span class="inline-badge badge-skill">TypeScript<\/span>/);
    assert.match(output, /<span class="inline-badge badge-tag">Docker<\/span>/);
  });

  test('parseInline transforms contact bar', () => {
    const input = '[contact: user@mail.com | +123456 | Earth]';
    const output = parseInline(input);
    assert.match(output, /class="resume-contact-bar"/);
    assert.match(output, /user@mail\.com/);
  });

  test('parseMarkdown renders headings, lists, and tables', () => {
    const md = `# Main Title
## Section

- Item 1
- Item 2

| Col 1 | Col 2 |
| :--- | :---: |
| A | B |`;

    const html = parseMarkdown(md);
    assert.match(html, /<h1 id="main-title" class="heading-lvl-1">Main Title<\/h1>/);
    assert.match(html, /<h2 id="section" class="heading-lvl-2">Section<\/h2>/);
    assert.match(html, /<ul class="doc-list">/);
    assert.match(html, /<li>Item 1<\/li>/);
    assert.match(html, /<table class="doc-table">/);
    assert.match(html, /<th style="text-align:left">Col 1<\/th>/);
  });

  test('parseMarkdown converts page break delimiter into A4 print break', () => {
    const md = `Page 1\n\n---pagebreak---\n\nPage 2`;
    const html = parseMarkdown(md);
    assert.match(html, /<div class="page-break"/);
  });

  test('calculateStats produces accurate metrics', () => {
    const text = `# Title\n\nOne two three four five six seven eight nine ten.`;
    const stats = calculateStats(text);
    assert.equal(stats.words, 11);
    assert.equal(stats.headings, 1);
    assert.equal(stats.pagesEst, 1);
    assert.equal(stats.readingTimeMinutes, 1);
  });
});
