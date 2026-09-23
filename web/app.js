/**
 * MarkFlow Frontend Application
 * Live dual-pane reactive editor with synchronized preview, design presets, and vector A4 PDF export.
 */

// DOM Elements
const editor = document.getElementById('markdownInput');
const previewContent = document.getElementById('previewContent');
const previewViewport = document.getElementById('previewViewport');
const previewSheet = document.getElementById('previewSheet');
const templateSelect = document.getElementById('templateSelect');
const docThemeSelect = document.getElementById('docThemeSelect');
const docFontSelect = document.getElementById('docFontSelect');
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
const btnOpenGallery = document.getElementById('btnOpenGallery');
const templateGalleryModal = document.getElementById('templateGalleryModal');
const btnCloseGalleryModal = document.getElementById('btnCloseGalleryModal');
const galleryGrid = document.getElementById('galleryGrid');
const btnShortcutsHelp = document.getElementById('btnShortcutsHelp');
const shortcutsModal = document.getElementById('shortcutsModal');
const btnCloseShortcutsModal = document.getElementById('btnCloseShortcutsModal');

// Stats Elements
const statWords = document.getElementById('statWords');
const statChars = document.getElementById('statChars');
const statReading = document.getElementById('statReading');
const statPages = document.getElementById('statPages');
const autosaveIndicator = document.getElementById('autosaveIndicator');

// State
let allTemplates = [];
let isScrollSync = true;
let isScrollingFromEditor = false;
let isScrollingFromPreview = false;
let renderTimer = null;
let saveTimer = null;

// Initialize
async function init() {
  setupTheme();
  setupDocStyling();
  setupViewModes();
  setupToolbar();
  setupZoom();
  setupFileOps();
  setupScrollSync();
  setupKeyboardShortcuts();
  await loadTemplatesList();
  await loadInitialContent();

  editor.addEventListener('input', onEditorInput);
}

// 1. Dark/Light Theme Management
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

// 2. Document Aesthetic & Typography Presets
function setupDocStyling() {
  const savedDocStyle = localStorage.getItem('markflow_doc_style') || 'modern';
  const savedDocFont = localStorage.getItem('markflow_doc_font') || 'sans';

  docThemeSelect.value = savedDocStyle;
  docFontSelect.value = savedDocFont;
  applyDocStyle(savedDocStyle, savedDocFont);

  docThemeSelect.addEventListener('change', (e) => {
    const style = e.target.value;
    localStorage.setItem('markflow_doc_style', style);
    applyDocStyle(style, docFontSelect.value);
    showToast(`Applied ${e.target.options[e.target.selectedIndex].text} preset`, 'success');
  });

  docFontSelect.addEventListener('change', (e) => {
    const font = e.target.value;
    localStorage.setItem('markflow_doc_font', font);
    applyDocStyle(docThemeSelect.value, font);
  });
}

function applyDocStyle(style, font) {
  previewSheet.classList.remove(
    'doc-style-modern', 'doc-style-executive', 'doc-style-minimal', 'doc-style-emerald', 'doc-style-indigo',
    'font-sans', 'font-serif', 'font-mono'
  );
  previewSheet.classList.add(`doc-style-${style}`);
  previewSheet.classList.add(`font-${font}`);
}

// 3. View Modes (Split / Edit / Preview)
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

// 4. Zoom Control
function setupZoom() {
  zoomSelect.addEventListener('change', (e) => {
    const scale = e.target.value;
    previewSheet.classList.remove('zoom-75', 'zoom-85', 'zoom-100', 'zoom-115');
    previewSheet.classList.add(`zoom-${Math.round(scale * 100)}`);
  });
}

// 5. Template Gallery & Initial Content
async function loadTemplatesList() {
  try {
    const res = await fetch('/api/templates');
    if (res.ok) {
      const data = await res.json();
      allTemplates = data.templates || [];
      renderGalleryCards('all');
    }
  } catch (err) {
    console.error('Failed to load templates list:', err);
  }
}

function renderGalleryCards(category) {
  galleryGrid.innerHTML = '';
  const filtered = allTemplates.filter(t => {
    if (category === 'all') return true;
    return t.category.toLowerCase().includes(category.toLowerCase());
  });

  filtered.forEach(t => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <div>
        <span class="card-cat-badge">${t.category}</span>
        <h4 class="card-title">${t.name}</h4>
        <p class="card-desc">${t.description}</p>
      </div>
      <div>
        <button class="action-btn btn-primary btn-load-template" style="width: 100%; justify-content: center;" data-id="${t.id}">Use This Template</button>
      </div>
    `;

    card.querySelector('.btn-load-template').addEventListener('click', async () => {
      templateGalleryModal.close();
      if (editor.value.trim() && !confirm('Replace current editor text with the selected template?')) {
        return;
      }
      await loadTemplate(t.id);
    });

    galleryGrid.appendChild(card);
  });
}

async function loadInitialContent() {
  const saved = localStorage.getItem('markflow_content');
  if (saved && saved.trim()) {
    editor.value = saved;
    renderContent(saved);
  } else {
    await loadTemplate('resume');
  }

  // Quick dropdown template selector
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

  // Open Template Gallery Modal
  btnOpenGallery.addEventListener('click', () => {
    templateGalleryModal.showModal();
  });

  btnCloseGalleryModal.addEventListener('click', () => {
    templateGalleryModal.close();
  });

  // Filter chips in gallery
  document.querySelectorAll('.gallery-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.gallery-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderGalleryCards(chip.dataset.cat);
    });
  });

  // Shortcuts modal
  btnShortcutsHelp.addEventListener('click', () => {
    shortcutsModal.showModal();
  });
  btnCloseShortcutsModal.addEventListener('click', () => {
    shortcutsModal.close();
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

// 6. Editor Input & Debounced Render
function onEditorInput() {
  autosaveIndicator.textContent = 'Editing…';
  autosaveIndicator.style.color = 'var(--text-muted)';

  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    renderContent(editor.value);
  }, 100);

  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem('markflow_content', editor.value);
    autosaveIndicator.textContent = 'Saved';
    autosaveIndicator.style.color = 'var(--success)';
  }, 500);
}

// 7. Server-Driven Content Render & Stats
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

// 8. Toolbar Formatting Helpers
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
      break;
    case 'italic':
      replacement = `*${sel || 'Italic Text'}*`;
      break;
    case 'h1':
      replacement = `\n# ${sel || 'Heading 1'}\n`;
      break;
    case 'h2':
      replacement = `\n## ${sel || 'Section Title'}\n`;
      break;
    case 'h3':
      replacement = `\n### ${sel || 'Subheading'}\n`;
      break;
    case 'link':
      replacement = `[${sel || 'Link Title'}](https://example.com)`;
      break;
    case 'code':
      replacement = `\`${sel || 'code'}\``;
      break;
    case 'table':
      replacement = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Item A | Value 1 | Detail 1 |\n| Item B | Value 2 | Detail 2 |\n`;
      break;
    case 'skill':
      replacement = `[skill: ${sel || 'TypeScript'}]`;
      break;
    case 'pagebreak':
      replacement = `\n\n---pagebreak---\n\n`;
      break;
    default:
      return;
  }

  editor.setRangeText(replacement, start, end, 'end');
  editor.focus();
  onEditorInput();
}

// 9. Keyboard Shortcuts
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      window.print();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      btnDownloadMd.click();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertFormatting('bold');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertFormatting('italic');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      insertFormatting('link');
    } else if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      insertFormatting('pagebreak');
      showToast('Inserted A4 Page Break', 'info');
    }
  });
}

// 10. File Operations & Exports
function setupFileOps() {
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

  btnExportHtml.addEventListener('click', async () => {
    const currentTheme = docThemeSelect.value || 'modern';
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: editor.value, title: 'MarkFlow Resume', theme: currentTheme })
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

  btnPrintPdf.addEventListener('click', () => {
    showToast('Preparing vector A4 PDF… (Check "Background graphics" in print dialog)', 'info');
    setTimeout(() => {
      window.print();
    }, 200);
  });
}

// 11. Synchronized Scrolling
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
  }, 2600);
}

document.addEventListener('DOMContentLoaded', init);
