/**
 * MarkFlow Standalone HTML & Printable Document Exporter
 * Wraps parsed markdown into a self-contained document with embedded print rules, ATS styling, and design presets.
 */

import { parseMarkdown, parseFrontmatter } from './parser.js';

/**
 * Returns embedded CSS styles for both screen view and vector-clean A4 printing.
 * @param {object} [options]
 * @param {string} [options.theme='modern'] - 'modern' | 'executive' | 'minimal' | 'emerald' | 'indigo'
 * @returns {string}
 */
export function getEmbeddedStyles(options = {}) {
  const theme = options.theme || 'modern';

  return `
    :root {
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --font-serif: "Merriweather", Georgia, Cambria, "Times New Roman", Times, serif;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      
      /* Base Modern Theme */
      --text-main: #0f172a;
      --text-muted: #475569;
      --text-sub: #64748b;
      --primary: #2563eb;
      --border-color: #e2e8f0;
      --bg-callout: #f8fafc;
      --tag-bg: #f1f5f9;
      --tag-border: #cbd5e1;
      --font-heading: var(--font-sans);
      --font-body: var(--font-sans);
    }

    /* Executive Theme Preset */
    body.doc-theme-executive {
      --text-main: #1e293b;
      --text-muted: #334155;
      --text-sub: #475569;
      --primary: #0f172a;
      --border-color: #94a3b8;
      --font-heading: var(--font-serif);
      --font-body: var(--font-serif);
      --tag-bg: #f8fafc;
      --tag-border: #94a3b8;
    }

    /* Minimalist Monochrome Preset */
    body.doc-theme-minimal {
      --text-main: #000000;
      --text-muted: #333333;
      --text-sub: #555555;
      --primary: #000000;
      --border-color: #000000;
      --tag-bg: #ffffff;
      --tag-border: #000000;
      --font-heading: var(--font-sans);
      --font-body: var(--font-sans);
    }

    /* Nordic Emerald Preset */
    body.doc-theme-emerald {
      --text-main: #064e3b;
      --text-muted: #047857;
      --text-sub: #059669;
      --primary: #059669;
      --border-color: #a7f3d0;
      --tag-bg: #ecfdf5;
      --tag-border: #6ee7b7;
      --font-heading: var(--font-sans);
      --font-body: var(--font-sans);
    }

    /* Creative Indigo Preset */
    body.doc-theme-indigo {
      --text-main: #1e1b4b;
      --text-muted: #3730a3;
      --text-sub: #4f46e5;
      --primary: #4f46e5;
      --border-color: #c7d2fe;
      --tag-bg: #eef2ff;
      --tag-border: #a5b4fc;
      --font-heading: var(--font-sans);
      --font-body: var(--font-sans);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-body);
      color: var(--text-main);
      background-color: #ffffff;
      line-height: 1.5;
      font-size: 10pt;
      -webkit-font-smoothing: antialiased;
    }

    .a4-page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 16mm 18mm;
      background: #ffffff;
      position: relative;
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      color: var(--text-main);
      font-weight: 700;
      line-height: 1.25;
    }

    h1.heading-lvl-1 {
      font-size: 21pt;
      letter-spacing: -0.02em;
      margin-bottom: 2pt;
    }

    h2.heading-lvl-2 {
      font-size: 12.5pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1.5pt solid var(--border-color);
      padding-bottom: 3pt;
      margin-top: 13pt;
      margin-bottom: 6pt;
    }

    h3.heading-lvl-3 {
      font-size: 11pt;
      margin-top: 8pt;
      margin-bottom: 2pt;
    }

    h4.heading-lvl-4 {
      font-size: 10pt;
      font-weight: 600;
      margin-top: 6pt;
      margin-bottom: 2pt;
    }

    p.doc-p {
      margin-bottom: 4.5pt;
      color: var(--text-main);
    }

    /* Contact Bar */
    .resume-contact-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6pt;
      margin-top: 4pt;
      margin-bottom: 8pt;
      font-size: 9pt;
      color: var(--text-muted);
    }

    .contact-sep {
      color: var(--text-sub);
    }

    /* Inline Badges & Skill Chips */
    .inline-badge {
      display: inline-block;
      font-size: 8pt;
      font-weight: 600;
      padding: 1.5pt 5pt;
      border-radius: 3pt;
      margin: 1pt 2pt 1pt 0;
      background: var(--tag-bg);
      border: 1px solid var(--tag-border);
      color: var(--text-main);
      white-space: nowrap;
    }

    .badge-skill {
      background: #eff6ff;
      border-color: #bfdbfe;
      color: #1e40af;
    }

    .badge-tag {
      background: #f0fdf4;
      border-color: #bbf7d0;
      color: #166534;
    }

    .badge-badge {
      background: #faf5ff;
      border-color: #e9d5ff;
      color: #6b21a8;
    }

    body.doc-theme-minimal .inline-badge {
      background: #ffffff !important;
      border-color: #000000 !important;
      color: #000000 !important;
    }

    /* Lists */
    ul.doc-list, ol.doc-ordered-list {
      margin-left: 14pt;
      margin-bottom: 6pt;
    }

    ul.doc-list li, ol.doc-ordered-list li {
      margin-bottom: 2.5pt;
      padding-left: 2pt;
    }

    li.task-item {
      list-style-type: none;
      margin-left: -12pt;
      display: flex;
      align-items: center;
      gap: 4pt;
    }

    input.task-checkbox {
      margin: 0;
    }

    .task-done {
      text-decoration: line-through;
      color: var(--text-sub);
    }

    /* Links & Code */
    a.doc-link {
      color: var(--primary);
      text-decoration: none;
    }

    a.doc-link:hover {
      text-decoration: underline;
    }

    code.inline-code {
      font-family: var(--font-mono);
      font-size: 8.5pt;
      background: #f1f5f9;
      padding: 1pt 3pt;
      border-radius: 3pt;
      color: #0f172a;
    }

    pre.code-block {
      font-family: var(--font-mono);
      font-size: 8.5pt;
      background: #0f172a;
      color: #f8fafc;
      padding: 8pt 10pt;
      border-radius: 4pt;
      margin: 6pt 0;
      overflow-x: auto;
      line-height: 1.4;
    }

    /* Tables */
    .table-container {
      width: 100%;
      margin: 6pt 0;
      overflow-x: auto;
    }

    table.doc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
    }

    table.doc-table th, table.doc-table td {
      border: 1px solid var(--border-color);
      padding: 4pt 6pt;
    }

    table.doc-table th {
      background: #f8fafc;
      font-weight: 600;
    }

    /* Blockquotes & Callouts */
    blockquote.doc-blockquote {
      border-left: 3pt solid var(--primary);
      padding-left: 8pt;
      margin: 6pt 0;
      color: var(--text-muted);
      font-style: italic;
    }

    .callout {
      border-left: 3pt solid #3b82f6;
      background: #eff6ff;
      padding: 6pt 8pt;
      margin: 6pt 0;
      border-radius: 0 4pt 4pt 0;
    }

    .callout-title {
      font-weight: 700;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2pt;
      color: #1d4ed8;
    }

    .callout-tip { border-left-color: #10b981; background: #ecfdf5; }
    .callout-tip .callout-title { color: #047857; }

    .callout-important { border-left-color: #8b5cf6; background: #f5f3ff; }
    .callout-important .callout-title { color: #6d28d9; }

    .callout-warning { border-left-color: #f59e0b; background: #fffbeb; }
    .callout-warning .callout-title { color: #b45309; }

    .callout-caution { border-left-color: #ef4444; background: #fef2f2; }
    .callout-caution .callout-title { color: #b91c1c; }

    hr.doc-divider {
      border: none;
      border-top: 1px solid var(--border-color);
      margin: 8pt 0;
    }

    /* Page Breaks for Print & PDF */
    .page-break {
      page-break-after: always;
      break-after: page;
      height: 0;
      display: block;
    }

    /* Strict A4 Print Media Rules */
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }

    @media print {
      body {
        background: #ffffff !important;
        font-size: 9.5pt;
      }

      .a4-page {
        width: 100% !important;
        min-height: auto !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .page-break {
        page-break-after: always !important;
        break-after: page !important;
        margin-top: 0 !important;
        border: none !important;
      }

      a.doc-link {
        color: inherit !important;
        text-decoration: none !important;
      }
    }
  `;
}

/**
 * Generates a complete, self-contained HTML document ready for viewing or printing to vector PDF.
 * @param {string} rawMarkdown
 * @param {object} [options]
 * @returns {string}
 */
export function generateStandaloneHtml(rawMarkdown, options = {}) {
  const { metadata } = parseFrontmatter(rawMarkdown);
  const parsedContent = parseMarkdown(rawMarkdown, options);
  const title = options.title || metadata.title || 'MarkFlow Document';
  const author = metadata.author || '';
  const theme = options.theme || 'modern';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeTitle(title)}</title>
  ${author ? `<meta name="author" content="${escapeTitle(author)}">` : ''}
  <style>
${getEmbeddedStyles({ theme })}
  </style>
</head>
<body class="doc-theme-${theme}">
  <main class="a4-page">
${parsedContent}
  </main>
</body>
</html>`;
}

function escapeTitle(str) {
  return String(str || '').replace(/[<>&"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
