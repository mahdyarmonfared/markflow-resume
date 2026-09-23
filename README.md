# MarkFlow 📄⚡

> **Live dual-pane Markdown editor and vector-clean A4 PDF resume & technical documentation generator.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Tests Passing](https://img.shields.io/badge/tests-17%2F17%20passed-success.svg)](tests/)
[![Port](https://img.shields.io/badge/local%20port-3006-indigo.svg)](http://localhost:3006)
[![ATS Optimized](https://img.shields.io/badge/resume-ATS%20Optimized-emerald.svg)](#features)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/mahdyarmonfared/markflow-resume/pulls)
[![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)

---

## 💡 Why MarkFlow?

| Feature | MarkFlow | Google Docs | Canva / Figma | LaTeX |
|---|---|---|---|---|
| **ATS-friendly PDF** | ✅ Vector text | ❌ Raster export | ❌ Image-based | ✅ |
| **Version control** | ✅ Plain Markdown | ❌ | ❌ | ✅ |
| **Live preview** | ✅ Instant | ✅ | ✅ | ❌ Compile |
| **Zero dependencies** | ✅ Node.js only | ❌ Cloud | ❌ Cloud | ❌ TeX distro |
| **Free & open-source** | ✅ MIT | ⚠️ Freemium | ⚠️ Freemium | ✅ |

---

## 🎯 The Problem

Formatting an engineering resume or technical specification in Word, Google Docs, or bloated graphical design suites is frustrating:
- Layout shifts and margins break whenever bullet points are edited.
- Most online CV makers lock export behind paywalls or render blurry rasterized PDFs that fail Applicant Tracking System (ATS) parsers.
- Engineering documentation (RFCs, ADRs, meeting records) belongs in version-controllable Markdown, yet needs to look executive-ready when shared with stakeholders or printed.

**MarkFlow solves this cleanly.** It combines a fast, zero-dependency Markdown parser with a live, realistic A4 sheet preview and print stylesheets (`@page { size: A4 portrait; }`) that produce crystal-clear, vector-sharp PDF exports directly through your browser or CLI.

---

## ✨ Features

- ⚡ **Dual-Pane Live Editor:** Instant side-by-side editing with synchronized scrolling between raw Markdown and parsed output.
- 📄 **Realistic A4 Simulation:** Pixel-perfect preview container matching standard ISO 210 × 297 mm paper dimensions with dynamic zoom controls (75%, 85%, 100%, 115%).
- 🖨️ **Vector-Clean PDF Export:** Generates sharp, selectable, ATS-friendly vector PDFs using native browser printing (`Ctrl+P` / `window.print()`) with 0 external rendering binaries required.
- 💼 **4 Battle-Tested Templates:**
  1. **Senior Software Engineer Resume:** Metric-focused, ATS-friendly single or two-page resume.
  2. **Technical RFC & Architecture Spec:** System overview, architectural data flow, trade-off matrix, and milestone checklist.
  3. **Engineering Meeting & Decisions Log:** Agenda, attendee roster, Architecture Decision Records (ADR), and action item checklists.
  4. **Academic & Research CV:** Single-column layout highlighting publications, teaching, and fellowships.
- 🏷️ **Custom Resume Syntax:**
  - `[skill: TypeScript]` → Rendered as an ATS-friendly skill pill.
  - `[contact: email | phone | location | github]` → Rendered as a centered, clean contact bar.
  - `---pagebreak---` or `<!-- pagebreak -->` → Cleanly forces an A4 page split in PDF view.
- 📊 **Real-Time Analytics:** Word count, character count, heading count, estimated reading time, and estimated A4 page count.
- 🌙 **Dark / Light Theme:** Modern dark interface for night work, automatically preserving paper view realism.
- 💾 **Auto-Save Resilience:** Edits are continuously saved to `localStorage`, protecting against accidental tab closure.

---

## 🚀 Quick Start

### 1. Launch Interactive Web Editor (Port 3006)

```bash
# Clone the repository
git clone https://github.com/mahdyarmonfared/markflow-resume.git
cd markflow-resume

# Start the Web UI on http://localhost:3006
node bin/markflow-resume.js
# or
npm start
```

Open [http://localhost:3006](http://localhost:3006) in your browser.

---

### 2. Command-Line (CLI) Utilities

Compile Markdown files directly from your terminal or dump built-in templates:

```bash
# Export a markdown file to a standalone, printable A4 HTML document
node bin/markflow-resume.js export resume.md -o my-resume.html

# Analyze document statistics (word count, reading time, A4 pages)
node bin/markflow-resume.js stats resume.md

# Dump a starter template to a new file
node bin/markflow-resume.js template resume -o senior-dev.md
node bin/markflow-resume.js template rfc -o architecture-rfc.md

# List all available templates
node bin/markflow-resume.js list-templates
```

---

## 🏗️ Architecture

```
markflow-resume/
├── bin/
│   └── markflow-resume.js      # CLI command runner & server launcher
├── src/
│   ├── index.js                # Core module exports
│   ├── parser.js               # CommonMark/GFM parser, frontmatter, & XSS sanitizer
│   ├── templates.js            # Built-in resume and RFC templates
│   ├── exporter.js             # Standalone A4 HTML generator with embedded print CSS
│   └── server.js               # Node.js native HTTP server & REST endpoints
├── web/
│   ├── index.html              # Responsive split-screen workspace
│   ├── style.css               # Design tokens, dark mode, & strict @page print rules
│   └── app.js                  # Reactive state, sync scroll, local storage, & exports
├── tests/
│   ├── parser.test.js          # Parser, XSS, and markdown unit tests
│   ├── templates.test.js       # Template validation tests
│   ├── exporter.test.js        # HTML generator and print CSS tests
│   └── server.test.js          # REST API endpoint tests
└── package.json
```

---

## 🧪 Testing

MarkFlow uses the native Node.js test runner (`node:test`) with zero external test framework dependencies:

```bash
npm test
```

```text
▶ MarkFlow Exporter Tests (2 tests) - OK
▶ MarkFlow Parser Tests (8 tests) - OK
▶ MarkFlow Server API Tests (5 tests) - OK
▶ MarkFlow Templates Tests (2 tests) - OK

ℹ tests 17
ℹ suites 4
ℹ pass 17
ℹ fail 0
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + S` | Save current document to localStorage |
| `Ctrl + P` | Export to PDF via native print dialog |
| `Ctrl + E` | Toggle between editor and preview focus |
| `Ctrl + D` | Toggle dark / light theme |
| `Ctrl + T` | Open template selector |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository.
2. **Create** your feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feat/amazing-feature`
5. **Open** a Pull Request.

Please make sure all tests pass before submitting:

```bash
npm test
```

---

## 📜 License

Released under the [MIT License](LICENSE).  
Copyright (c) 2026 **Mahdyar Monfared**.
