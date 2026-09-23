#!/usr/bin/env node

/**
 * MarkFlow CLI
 * Command-line runner for launching the MarkFlow Web UI, compiling markdown documents, and managing resume templates.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { startServer } from '../src/server.js';
import { parseMarkdown, calculateStats } from '../src/parser.js';
import { TEMPLATES } from '../src/templates.js';
import { generateStandaloneHtml } from '../src/exporter.js';

const VERSION = '1.0.0';
const args = process.argv.slice(2);
const command = args[0] || 'ui';

function printBanner() {
  console.log(`\x1b[36m╔════════════════════════════════════════════════════════╗\x1b[0m`);
  console.log(`\x1b[36m║\x1b[0m  \x1b[1mMarkFlow v${VERSION}\x1b[0m — Live Markdown Editor & A4 PDF Engine  \x1b[36m║\x1b[0m`);
  console.log(`\x1b[36m╚════════════════════════════════════════════════════════╝\x1b[0m\n`);
}

function printHelp() {
  printBanner();
  console.log(`\x1b[1mUSAGE:\x1b[0m`);
  console.log(`  markflow [command] [options]\n`);
  console.log(`\x1b[1mCOMMANDS:\x1b[0m`);
  console.log(`  \x1b[32mui\x1b[0m                  Launch the interactive Web Editor (default on port 3006)`);
  console.log(`  \x1b[32mexport <file.md>\x1b[0m    Compile a markdown document into standalone A4 printable HTML`);
  console.log(`  \x1b[32mstats <file.md>\x1b[0m     Analyze word count, reading time, and estimated A4 pages`);
  console.log(`  \x1b[32mtemplate <name>\x1b[0m     Export a starter template (resume, rfc, meeting, academic)`);
  console.log(`  \x1b[32mlist-templates\x1b[0m      Display all available built-in starter templates\n`);
  console.log(`\x1b[1mOPTIONS:\x1b[0m`);
  console.log(`  \x1b[33m-p, --port <number>\x1b[0m Port for the Web UI (default: 3006)`);
  console.log(`  \x1b[33m-o, --output <file>\x1b[0m Output path for compiled HTML or exported template`);
  console.log(`  \x1b[33m-v, --version\x1b[0m       Show current version`);
  console.log(`  \x1b[33m-h, --help\x1b[0m          Display this help message\n`);
  console.log(`\x1b[1mEXAMPLES:\x1b[0m`);
  console.log(`  $ markflow`);
  console.log(`  $ markflow export resume.md -o resume.html`);
  console.log(`  $ markflow template resume -o my-resume.md`);
  console.log(`  $ markflow stats my-resume.md\n`);
}

async function main() {
  if (args.includes('-h') || args.includes('--help') || command === 'help') {
    printHelp();
    process.exit(0);
  }

  if (args.includes('-v') || args.includes('--version') || command === 'version') {
    console.log(`markflow-resume v${VERSION}`);
    process.exit(0);
  }

  // 1. Launch Web UI
  if (command === 'ui' || !args[0] || args[0].startsWith('-')) {
    let port = 3006;
    const portIdx = args.findIndex(a => a === '-p' || a === '--port');
    if (portIdx !== -1 && args[portIdx + 1]) {
      port = parseInt(args[portIdx + 1], 10) || 3006;
    }

    printBanner();
    try {
      const { port: actualPort } = await startServer(port);
      console.log(`\x1b[32m✔\x1b[0m MarkFlow Web Editor running at: \x1b[1m\x1b[34mhttp://localhost:${actualPort}\x1b[0m`);
      console.log(`\x1b[90m  Press Ctrl+C to terminate the server.\x1b[0m\n`);
    } catch (err) {
      console.error(`\x1b[31m✖ Error starting server:\x1b[0m ${err.message}`);
      process.exit(1);
    }
    return;
  }

  // 2. Export markdown to HTML
  if (command === 'export') {
    const inputFile = args[1];
    if (!inputFile) {
      console.error('\x1b[31m✖ Error: Missing input markdown file.\x1b[0m');
      console.log('Usage: markflow export <input.md> [-o output.html]');
      process.exit(1);
    }

    let outputFile = null;
    const outIdx = args.findIndex(a => a === '-o' || a === '--output');
    if (outIdx !== -1 && args[outIdx + 1]) {
      outputFile = args[outIdx + 1];
    } else {
      const parsed = path.parse(inputFile);
      outputFile = path.join(parsed.dir || '.', `${parsed.name}.html`);
    }

    try {
      const mdContent = await fs.readFile(inputFile, 'utf-8');
      const html = generateStandaloneHtml(mdContent, { title: path.basename(inputFile) });
      await fs.writeFile(outputFile, html, 'utf-8');
      console.log(`\x1b[32m✔ Exported standalone printable HTML:\x1b[0m ${outputFile}`);
    } catch (err) {
      console.error(`\x1b[31m✖ Failed to export file:\x1b[0m ${err.message}`);
      process.exit(1);
    }
    return;
  }

  // 3. Stats analysis
  if (command === 'stats') {
    const inputFile = args[1];
    if (!inputFile) {
      console.error('\x1b[31m✖ Error: Missing input markdown file.\x1b[0m');
      process.exit(1);
    }

    try {
      const mdContent = await fs.readFile(inputFile, 'utf-8');
      const stats = calculateStats(mdContent);
      console.log(`\x1b[1m\x1b[36mDocument Statistics for:\x1b[0m ${path.basename(inputFile)}`);
      console.log(`  • Words:               ${stats.words.toLocaleString()}`);
      console.log(`  • Characters:          ${stats.chars.toLocaleString()}`);
      console.log(`  • Headings:            ${stats.headings}`);
      console.log(`  • Est. Reading Time:   ${stats.readingTimeMinutes} min`);
      console.log(`  • Est. A4 Pages:       ${stats.pagesEst} page(s)\n`);
    } catch (err) {
      console.error(`\x1b[31m✖ Failed to analyze stats:\x1b[0m ${err.message}`);
      process.exit(1);
    }
    return;
  }

  // 4. Output template
  if (command === 'template') {
    const templateName = (args[1] || 'resume').toLowerCase();
    const template = TEMPLATES[templateName];
    if (!template) {
      console.error(`\x1b[31m✖ Error: Unknown template '${templateName}'.\x1b[0m`);
      console.log(`Available templates: ${Object.keys(TEMPLATES).join(', ')}`);
      process.exit(1);
    }

    let outputFile = null;
    const outIdx = args.findIndex(a => a === '-o' || a === '--output');
    if (outIdx !== -1 && args[outIdx + 1]) {
      outputFile = args[outIdx + 1];
    }

    if (outputFile) {
      await fs.writeFile(outputFile, template.content, 'utf-8');
      console.log(`\x1b[32m✔ Template '${templateName}' written to:\x1b[0m ${outputFile}`);
    } else {
      console.log(template.content);
    }
    return;
  }

  // 5. List templates
  if (command === 'list-templates') {
    console.log(`\x1b[1mAvailable MarkFlow Templates:\x1b[0m\n`);
    for (const [id, t] of Object.entries(TEMPLATES)) {
      console.log(`  \x1b[32m${id.padEnd(12)}\x1b[0m \x1b[1m${t.name}\x1b[0m (${t.category})`);
      console.log(`  \x1b[90m${t.description}\x1b[0m\n`);
    }
    return;
  }

  console.error(`\x1b[31m✖ Unknown command '${command}'. Use --help for usage.\x1b[0m`);
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
