/**
 * MarkFlow Core Markdown Parser & Sanitizer
 * High-performance, zero-dependency CommonMark + GFM parser tailored for resumes and technical docs.
 */

/**
 * Escapes unsafe HTML characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes URLs to prevent javascript: or dangerous URI schemes.
 * @param {string} url
 * @returns {string}
 */
export function sanitizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(javascript|vbscript|data):/i.test(trimmed)) {
    return '#';
  }
  return trimmed;
}

/**
 * Parses YAML-like frontmatter metadata block at the top of markdown.
 * @param {string} md
 * @returns {{ metadata: Record<string, string>, content: string }}
 */
export function parseFrontmatter(md) {
  if (!md) return { metadata: {}, content: '' };
  const trimmed = md.trimStart();
  if (!trimmed.startsWith('---')) {
    return { metadata: {}, content: md };
  }

  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, content: md };
  }

  const rawMeta = match[1];
  const content = match[2];
  const metadata = {};

  for (const line of rawMeta.split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key) metadata[key] = val;
    }
  }

  return { metadata, content };
}

/**
 * Converts inline markdown syntax (bold, italic, links, codes, badges) to HTML.
 * @param {string} text
 * @returns {string}
 */
export function parseInline(text) {
  if (!text) return '';

  let out = text;

  // Custom Resume Badges: [tag: React], [skill: TypeScript], [badge: AWS Certified]
  out = out.replace(/\[(tag|skill|badge):\s*([^\]]+)\]/gi, (match, type, val) => {
    return `<span class="inline-badge badge-${escapeHtml(type.toLowerCase())}">${escapeHtml(val.trim())}</span>`;
  });

  // Custom Contact/Location bar: [contact: email | phone | location]
  out = out.replace(/\[contact:\s*([^\]]+)\]/gi, (match, rawItems) => {
    const items = rawItems.split('|').map(s => escapeHtml(s.trim()));
    return `<div class="resume-contact-bar">${items.map(item => `<span class="contact-item">${item}</span>`).join('<span class="contact-sep">•</span>')}</div>`;
  });

  // Inline Code: `code`
  out = out.replace(/`([^`]+)`/g, (match, code) => {
    return `<code class="inline-code">${escapeHtml(code)}</code>`;
  });

  // Images: ![alt](url)
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    return `<img src="${escapeHtml(sanitizeUrl(url))}" alt="${escapeHtml(alt)}" class="doc-image" loading="lazy" />`;
  });

  // Links: [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
    return `<a href="${escapeHtml(sanitizeUrl(url))}" target="_blank" rel="noopener noreferrer" class="doc-link">${escapeHtml(label)}</a>`;
  });

  // Bold & Italic: ***text*** or ___text___
  out = out.replace(/(\*\*\*|___)(.*?)\1/g, '<strong><em>$2</em></strong>');

  // Bold: **text** or __text__
  out = out.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');

  // Italic: *text* or _text_
  out = out.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

  // Strikethrough: ~~text~~
  out = out.replace(/~~(.*?)~~/g, '<del>$1</del>');

  return out;
}

/**
 * Parses markdown table blocks into HTML table.
 * @param {string[]} lines
 * @returns {string}
 */
function parseTable(lines) {
  if (lines.length < 2) return lines.join('\n');

  const headerLine = lines[0];
  const alignLine = lines[1];
  const rowLines = lines.slice(2);

  const cleanCells = (row) => {
    let raw = row.trim();
    if (raw.startsWith('|')) raw = raw.slice(1);
    if (raw.endsWith('|')) raw = raw.slice(0, -1);
    return raw.split('|').map(c => c.trim());
  };

  const headers = cleanCells(headerLine);
  const aligns = cleanCells(alignLine).map(c => {
    if (c.startsWith(':') && c.endsWith(':')) return 'center';
    if (c.endsWith(':')) return 'right';
    return 'left';
  });

  let html = '<div class="table-container"><table class="doc-table"><thead><tr>';
  headers.forEach((h, i) => {
    const align = aligns[i] || 'left';
    html += `<th style="text-align:${align}">${parseInline(h)}</th>`;
  });
  html += '</tr></thead><tbody>';

  for (const row of rowLines) {
    if (!row.trim()) continue;
    const cells = cleanCells(row);
    html += '<tr>';
    for (let i = 0; i < headers.length; i++) {
      const cellText = cells[i] || '';
      const align = aligns[i] || 'left';
      html += `<td style="text-align:${align}">${parseInline(cellText)}</td>`;
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  return html;
}

/**
 * Main Markdown to HTML Parser
 * @param {string} rawMarkdown
 * @param {object} [options]
 * @returns {string}
 */
export function parseMarkdown(rawMarkdown, options = {}) {
  if (!rawMarkdown) return '';

  const { metadata, content } = parseFrontmatter(rawMarkdown);
  const lines = content.split(/\r?\n/);
  const output = [];

  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockBuffer = [];

  let inList = false;
  let listType = 'ul'; // 'ul' or 'ol'

  let tableBuffer = [];
  let inTable = false;

  let inBlockquote = false;
  let blockquoteBuffer = [];

  const flushList = () => {
    if (inList) {
      output.push(`</${listType}>`);
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable) {
      output.push(parseTable(tableBuffer));
      tableBuffer = [];
      inTable = false;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      const bqContent = blockquoteBuffer.join('\n');
      // Check for Callout Alerts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING]
      const alertMatch = bqContent.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/im);
      if (alertMatch) {
        const type = alertMatch[1].toLowerCase();
        const text = bqContent.replace(/^\[!.*?\]\s*/i, '');
        output.push(`<div class="callout callout-${type}"><div class="callout-title">${alertMatch[1]}</div><div class="callout-body">${parseMarkdown(text)}</div></div>`);
      } else {
        output.push(`<blockquote class="doc-blockquote">${parseMarkdown(bqContent)}</blockquote>`);
      }
      blockquoteBuffer = [];
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // Closing code block
        const codeContent = escapeHtml(codeBlockBuffer.join('\n'));
        const langClass = codeBlockLang ? ` language-${escapeHtml(codeBlockLang)}` : '';
        output.push(`<pre class="code-block${langClass}"><code>${codeContent}</code></pre>`);
        codeBlockBuffer = [];
        inCodeBlock = false;
        codeBlockLang = '';
      } else {
        flushList();
        flushTable();
        flushBlockquote();
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      continue;
    }

    // 2. Page Break delimiters for PDF pagination
    if (trimmed === '---pagebreak---' || trimmed === '<!-- pagebreak -->' || trimmed === '<!--pagebreak-->') {
      flushList();
      flushTable();
      flushBlockquote();
      output.push('<div class="page-break" title="A4 Page Break" aria-label="Page Break"></div>');
      continue;
    }

    // 3. Tables (Detect lines with pipe characters)
    if (trimmed.includes('|') && (inTable || (lines[i + 1] && lines[i + 1].trim().match(/^\|?\s*[:\s-]+\s*\|/)))) {
      flushList();
      flushBlockquote();
      inTable = true;
      tableBuffer.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // 4. Blockquotes
    if (trimmed.startsWith('>')) {
      flushList();
      flushTable();
      inBlockquote = true;
      blockquoteBuffer.push(trimmed.slice(1).trim());
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // 5. Headings (# Heading)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      flushTable();
      flushBlockquote();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      output.push(`<h${level} id="${slug}" class="heading-lvl-${level}">${parseInline(text)}</h${level}>`);
      continue;
    }

    // 6. Horizontal Rule (---, ***, ___)
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      flushTable();
      flushBlockquote();
      output.push('<hr class="doc-divider" />');
      continue;
    }

    // 7. Unordered Lists (- item, * item, + item) & Task Lists
    const ulMatch = line.match(/^(\s*)([-*+])\s+(.*)$/);
    if (ulMatch) {
      flushTable();
      flushBlockquote();
      if (!inList || listType !== 'ul') {
        flushList();
        output.push('<ul class="doc-list">');
        inList = true;
        listType = 'ul';
      }
      let itemText = ulMatch[3];
      // Task lists: - [ ] or - [x]
      if (itemText.startsWith('[ ] ')) {
        output.push(`<li class="task-item"><input type="checkbox" disabled class="task-checkbox" /> ${parseInline(itemText.slice(4))}</li>`);
      } else if (itemText.startsWith('[x] ') || itemText.startsWith('[X] ')) {
        output.push(`<li class="task-item task-done"><input type="checkbox" checked disabled class="task-checkbox" /> ${parseInline(itemText.slice(4))}</li>`);
      } else {
        output.push(`<li>${parseInline(itemText)}</li>`);
      }
      continue;
    }

    // 8. Ordered Lists (1. item)
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (olMatch) {
      flushTable();
      flushBlockquote();
      if (!inList || listType !== 'ol') {
        flushList();
        output.push('<ol class="doc-ordered-list">');
        inList = true;
        listType = 'ol';
      }
      output.push(`<li>${parseInline(olMatch[3])}</li>`);
      continue;
    }

    // Blank line -> close open lists/tables/quotes
    if (!trimmed) {
      flushList();
      flushTable();
      flushBlockquote();
      continue;
    }

    // 9. Standard Paragraphs
    flushList();
    flushTable();
    flushBlockquote();
    output.push(`<p class="doc-p">${parseInline(line)}</p>`);
  }

  // Final flushes
  if (inCodeBlock) {
    const codeContent = escapeHtml(codeBlockBuffer.join('\n'));
    output.push(`<pre class="code-block"><code>${codeContent}</code></pre>`);
  }
  flushList();
  flushTable();
  flushBlockquote();

  return output.join('\n');
}

/**
 * Calculates document statistics: word count, reading time, estimated pages.
 * @param {string} text
 * @returns {{ words: number, chars: number, readingTimeMinutes: number, headings: number, pagesEst: number }}
 */
export function calculateStats(text) {
  if (!text) {
    return { words: 0, chars: 0, readingTimeMinutes: 0, headings: 0, pagesEst: 1 };
  }

  const { content } = parseFrontmatter(text);
  const words = (content.match(/\b\w+\b/g) || []).length;
  const chars = content.length;
  const headings = (content.match(/^#{1,6}\s+/gm) || []).length;
  const explicitPageBreaks = (content.match(/---pagebreak---|<!--\s*pagebreak\s*-->/gi) || []).length;

  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // A standard A4 resume page holds ~400-500 words
  const pagesByWords = Math.max(1, Math.ceil(words / 450));
  const pagesEst = Math.max(pagesByWords, explicitPageBreaks + 1);

  return {
    words,
    chars,
    readingTimeMinutes,
    headings,
    pagesEst
  };
}
