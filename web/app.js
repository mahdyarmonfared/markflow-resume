/**
 * MarkFlow Frontend Application
 * Live dual-pane reactive editor with synchronized preview and vector A4 PDF export.
 */

// DOM Elements
const editor = document.getElementById('markdownInput');
const previewContent = document.getElementById('previewContent');
const previewViewport = document.getElementById('previewViewport');
const previewSheet = document.getElementById('previewSheet');
const templateSelect = document.getElementById('templateSelect');
const zoomSelect = document.getElementById('zoomSelect');
const btnThemeToggle = document.getElementById('btnThemeToggle');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const workspace = document.querySelector('.workspace-container');
const btnViewSplit = document.getElementById('btnViewSplit');
const btnViewEdit = document.getElementById('btnViewEdit');
const btnViewPreview = document.getElementById('btnViewPreview');
const btnPrintPdf = document.getElementById('btnPrintPdf');
const btnDownloadMd = document.getElementById('btnDownloadMd');
const btnExportHtml = document.getElementById('btnExportHtml');
const fileInput = document.getElementById('fileInput');
const btnClear = document.getElementById('btnClear');
const btnScrollSync = document.getElementById('btnScrollSync');

// Stats Elements
const statWords = document.getElementById('statWords');
const statChars = document.getElementById('statChars');
const statReading = document.getElementById('statReading');
const statPages = document.getElementById('statPages');
const autosaveIndicator = document.getElementById('autosaveIndicator');

// State
let isScrollSync = true;
let isScrollingFromEditor = false;
let isScrollingFromPreview = false;
let renderTimer = null;
let saveTimer = null;

// Initialize
async function init() {
  setupTheme();
  setupViewModes();
  setupToolbar();
  setupZoom();
  setupFileOps();
  setupScrollSync();
  await loadInitialContent();

  editor.addEventListener('input', onEditorInput);
}

// 1. Theme Management
function setupTheme() {
  const savedTheme = localStorage.getItem('markflow_theme') || 'dark';
  applyTheme(savedTheme);

  btnThemeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('markflow_theme', newTheme);
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  } else {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  }
}

// 2. View Modes (Split / Edit / Preview)
function setupViewModes() {
  const setMode = (mode) => {
    workspace.classList.remove('mode-split', 'mode-edit', 'mode-preview');
    btnViewSplit.classList.remove('active');
    btnViewEdit.classList.remove('active');
    btnViewPreview.classList.remove('active');

    if (mode === 'edit') {
      workspace.classList.add('mode-edit');
      btnViewEdit.classList.add('active');
    } else if (mode === 'preview') {
      workspace.classList.add('mode-preview');
      btnViewPreview.classList.add('active');
    } else {
      workspace.classList.add('mode-split');
      btnViewSplit.classList.add('active');
    }
  };

  btnViewSplit.addEventListener('click', () => setMode('split'));
  btnViewEdit.addEventListener('click', () => setMode('edit'));
  btnViewPreview.addEventListener('click', () => setMode('preview'));
}

// 3. Zoom Control
function setupZoom() {
  zoomSelect.addEventListener('change', (e) => {
    const scale = e.target.value;
    previewSheet.className = `a4-sheet zoom-${Math.round(scale * 100)}`;
  });
}

// 4. Initial Content & Templates
async function loadInitialContent() {
  const saved = localStorage.getItem('markflow_content');
  if (saved && saved.trim()) {
    editor.value = saved;
    renderContent(saved);
  } else {
    await loadTemplate('resume');
  }

  templateSelect.addEventListener('change', async (e) => {
    const val = e.target.value;
    if (!val) return;
    if (editor.value.trim() && !confirm('Replace current editor text with the selected template?')) {
      templateSelect.value = '';
      return;
    }
    await loadTemplate(val);
    templateSelect.value = '';
  });
}

async function loadTemplate(id) {
  try {
    const res = await fetch(`/api/templates/${id}`);
    if (res.ok) {
      const data = await res.json();
      editor.value = data.content;
      renderContent(data.content);
      showToast(`Loaded ${data.name}`, 'success');
    } else {
      showToast('Could not load template from server', 'error');
    }
  } catch (err) {
    showToast('Failed to connect to template API', 'error');
  }
}

// 5. Editor Input & Debounced Render
function onEditorInput() {
  autosaveIndicator.textContent = 'Editing…';
  autosaveIndicator.style.color = 'var(--text-muted)';

  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    renderContent(editor.value);
  }, 120);

  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem('markflow_content', editor.value);
    autosaveIndicator.textContent = 'Saved';
    autosaveIndicator.style.color = 'var(--success)';
  }, 600);
}

// 6. Server-Driven Content Render & Stats
async function renderContent(markdown) {
  try {
    const res = await fetch('/api/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdown })
    });

    if (res.ok) {
      const data = await res.json();
      previewContent.innerHTML = data.html;
      updateStats(data.stats);
    }
  } catch (err) {
    console.error('Render error:', err);
  }
}

function updateStats(stats) {
  if (!stats) return;
  statWords.textContent = `${stats.words.toLocaleString()} words`;
  statChars.textContent = `${stats.chars.toLocaleString()} chars`;
  statReading.textContent = `${stats.readingTimeMinutes} min read`;
  statPages.textContent = `${stats.pagesEst} ${stats.pagesEst === 1 ? 'Page' : 'Pages'} (A4)`;
}

// 7. Toolbar Formatting Helpers
function setupToolbar() {
  document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      insertFormatting(action);
    });
  });

  btnClear.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire editor?')) {
      editor.value = '';
      onEditorInput();
      showToast('Editor cleared', 'success');
    }
  });
}

function insertFormatting(action) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const sel = editor.value.substring(start, end);

  let replacement = '';
  let cursorOffset = 0;

  switch (action) {
    case 'bold':
      replacement = `**${sel || 'Bold Text'}**`;
      cursorOffset = sel ? replacement.length : 2;
      break;
    case 'italic':
      replacement = `*${sel || 'Italic Text'}*`;
      cursorOffset = sel ? replacement.length : 1;
      break;
    case 'h1':
      replacement = `\n# ${sel || 'Heading 1'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'h2':
      replacement = `\n## ${sel || 'Section Title'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'h3':
      replacement = `\n### ${sel || 'Subheading'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'link':
      replacement = `[${sel || 'Link Title'}](https://example.com)`;
      cursorOffset = replacement.length;
      break;
    case 'code':
      replacement = `\`${sel || 'code'}\``;
      cursorOffset = sel ? replacement.length : 1;
      break;
    case 'table':
      replacement = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Item A | Value 1 | Detail 1 |\n| Item B | Value 2 | Detail 2 |\n`;
      cursorOffset = replacement.length;
      break;
    case 'skill':
      replacement = `[skill: ${sel || 'TypeScript'}]`;
      cursorOffset = replacement.length;
      break;
    case 'pagebreak':
      replacement = `\n\n---pagebreak---\n\n`;
      cursorOffset = replacement.length;
      break;
    default:
      return;
  }

  editor.setRangeText(replacement, start, end, 'end');
  editor.focus();
  onEditorInput();
}

// 8. File Operations & Exports
function setupFileOps() {
  // Import markdown file
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      editor.value = event.target.result;
      onEditorInput();
      showToast(`Imported ${file.name}`, 'success');
      fileInput.value = '';
    };
    reader.readAsText(file);
  });

  // Download .md
  btnDownloadMd.addEventListener('click', () => {
    const blob = new Blob([editor.value], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markflow-document.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded markflow-document.md', 'success');
  });

  // Export standalone printable HTML
  btnExportHtml.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: editor.value, title: 'MarkFlow Resume' })
      });
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([data.html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'markflow-document.html';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Exported standalone printable HTML', 'success');
      }
    } catch (err) {
      showToast('Export failed', 'error');
    }
  });

  // Vector A4 PDF Print Dialog
  btnPrintPdf.addEventListener('click', () => {
    window.print();
  });
}

// 9. Synchronized Scrolling
function setupScrollSync() {
  btnScrollSync.addEventListener('click', () => {
    isScrollSync = !isScrollSync;
    btnScrollSync.classList.toggle('active', isScrollSync);
    showToast(isScrollSync ? 'Scroll Sync Enabled' : 'Scroll Sync Disabled');
  });

  editor.addEventListener('scroll', () => {
    if (!isScrollSync || isScrollingFromPreview) return;
    isScrollingFromEditor = true;
    const maxEditor = editor.scrollHeight - editor.clientHeight;
    if (maxEditor > 0) {
      const ratio = editor.scrollTop / maxEditor;
      const maxPreview = previewViewport.scrollHeight - previewViewport.clientHeight;
      previewViewport.scrollTop = ratio * maxPreview;
    }
    setTimeout(() => { isScrollingFromEditor = false; }, 50);
  });

  previewViewport.addEventListener('scroll', () => {
    if (!isScrollSync || isScrollingFromEditor) return;
    isScrollingFromPreview = true;
    const maxPreview = previewViewport.scrollHeight - previewViewport.clientHeight;
    if (maxPreview > 0) {
      const ratio = previewViewport.scrollTop / maxPreview;
      const maxEditor = editor.scrollHeight - editor.clientHeight;
      editor.scrollTop = ratio * maxEditor;
    }
    setTimeout(() => { isScrollingFromPreview = false; }, 50);
  });
}

// Toast helper
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

document.addEventListener('DOMContentLoaded', init);
