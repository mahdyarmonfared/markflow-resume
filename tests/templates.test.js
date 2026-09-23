import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATES } from '../src/templates.js';
import { parseMarkdown, parseFrontmatter } from '../src/parser.js';

describe('MarkFlow Templates Tests', () => {
  test('all required starter templates exist', () => {
    const keys = Object.keys(TEMPLATES);
    assert.ok(keys.includes('resume'), 'Missing resume template');
    assert.ok(keys.includes('rfc'), 'Missing RFC template');
    assert.ok(keys.includes('meeting'), 'Missing meeting template');
    assert.ok(keys.includes('academic'), 'Missing academic template');
  });

  test('templates have valid metadata and render without errors', () => {
    for (const [id, t] of Object.entries(TEMPLATES)) {
      assert.ok(t.name, `Template ${id} missing name`);
      assert.ok(t.description, `Template ${id} missing description`);
      assert.ok(t.content && t.content.length > 50, `Template ${id} content too short`);

      const { metadata, content } = parseFrontmatter(t.content);
      assert.ok(metadata.title, `Template ${id} missing frontmatter title`);

      const html = parseMarkdown(t.content);
      assert.ok(html.length > 100, `Template ${id} produced empty HTML`);
      assert.match(html, /<h1/);
    }
  });
});
