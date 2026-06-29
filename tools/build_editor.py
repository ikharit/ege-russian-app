"""
Генератор standalone HTML-редактора для единой базы вопросов ЕГЭ.

Запуск:
    python tools/build_editor.py

Результат:
    tools/editor.html — открывается в браузере, работает без сервера.
"""
import os
import re
import json
import glob


# ─── ПАРСЕР TypeScript → JSON ───

def parse_ts_file(filepath: str) -> list[dict]:
    """Парсит taskX.ts файл в список вопросов (dict)."""
    with open(filepath, 'r', encoding='utf-8') as f:
        raw = f.read()

    # Убираем import и export
    content = re.sub(r'import.*?\n', '', raw)
    content = re.sub(r'export const \w+:.*?\[', '[', content, flags=re.DOTALL)
    content = re.sub(r'\]\s*export.*', ']', content, flags=re.DOTALL)
    content = re.sub(r'\]\s*$', ']', content, flags=re.DOTALL)

    # Находим содержимое массива
    m = re.search(r'\[([\s\S]*)\]', content)
    if not m:
        return []
    array_body = m.group(1)

    # Разбиваем на объекты с учетом вложенности
    objects = split_objects(array_body)
    questions = []
    for obj in objects:
        q = parse_object(obj)
        if q and q.get('id'):
            questions.append(q)
    return questions


def split_objects(text: str) -> list[str]:
    """Разбивает тело массива на объекты { ... } с учетом вложенности."""
    objects = []
    depth = 0
    current = []
    in_string = False
    escape = False

    for char in text:
        if escape:
            current.append(char)
            escape = False
            continue
        if char == '\\':
            current.append(char)
            escape = True
            continue
        if char in "'\"":
            current.append(char)
            if in_string:
                in_string = False
            else:
                in_string = True
            continue
        if in_string:
            current.append(char)
            continue

        if char == '{':
            if depth == 0:
                current = ['{']
            else:
                current.append(char)
            depth += 1
        elif char == '}':
            depth -= 1
            current.append(char)
            if depth == 0:
                objects.append(''.join(current))
                current = []
        elif depth > 0:
            current.append(char)

    return objects


def parse_object(obj_str: str) -> dict:
    """Парсит один объект { ... } в dict."""
    # Убираем обрамляющие { }
    body = obj_str.strip()
    if body.startswith('{'):
        body = body[1:]
    if body.endswith('}'):
        body = body[:-1]

    result = {}
    # Парсим поля: key: value
    # Учитываем строки, массивы, числа, булевы
    pos = 0
    while pos < len(body):
        # Ищем key:
        key_match = re.match(r'\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', body[pos:])
        if not key_match:
            break
        key = key_match.group(1)
        pos += key_match.end()

        # Парсим value
        value, consumed = parse_value(body[pos:])
        pos += consumed
        result[key] = value

        # Пропускаем запятую, whitespace, закрывающие кавычки/скобки
        while pos < len(body) and body[pos] in " \t\n,']":
            pos += 1

    return result


def parse_value(text: str):
    """Парсит значение из начала строки. Возвращает (value, consumed_chars)."""
    original = text
    text = text.lstrip()
    stripped = len(original) - len(text)
    if not text:
        return None, 0

    # Строка в одинарных кавычках
    if text[0] == "'":
        val, consumed = parse_quoted_string(text, "'")
        return val, stripped + consumed
    # Строка в двойных кавычках
    if text[0] == '"':
        val, consumed = parse_quoted_string(text, '"')
        return val, stripped + consumed
    # Массив
    if text[0] == '[':
        val, consumed = parse_array(text)
        return val, stripped + consumed
    # Число
    num_match = re.match(r'-?\d+(\.\d+)?', text)
    if num_match:
        val = int(num_match.group()) if '.' not in num_match.group() else float(num_match.group())
        return val, stripped + num_match.end()
    # Булево / null / undefined
    word_match = re.match(r'(true|false|null|undefined)', text)
    if word_match:
        val = {'true': True, 'false': False, 'null': None, 'undefined': None}[word_match.group(1)]
        return val, stripped + word_match.end()

    return None, 0


def parse_quoted_string(text: str, quote: str):
    """Парсит строку в кавычках с учетом экранирования."""
    result = []
    i = 1
    escape = False
    while i < len(text):
        char = text[i]
        if escape:
            result.append(char)
            escape = False
            i += 1
            continue
        if char == '\\':
            escape = True
            result.append(char)
            i += 1
            continue
        if char == quote:
            return ''.join(result), i + 1
        result.append(char)
        i += 1
    return ''.join(result), len(text)


def parse_array(text: str):
    """Парсит массив [ ... ]."""
    depth = 0
    items = []
    current = []
    in_string = False
    escape = False
    start = 1  # skip [

    for i in range(start, len(text)):
        char = text[i]
        if escape:
            current.append(char)
            escape = False
            continue
        if char == '\\':
            current.append(char)
            escape = True
            continue
        if char in "'\"":
            current.append(char)
            if in_string:
                in_string = False
            else:
                in_string = True
            continue
        if in_string:
            current.append(char)
            continue

        if char == '[':
            depth += 1
            current.append(char)
        elif char == ']':
            if depth == 0:
                # Конец массива
                if current:
                    item_text = ''.join(current).strip()
                    if item_text:
                        val, _ = parse_value(item_text)
                        items.append(val)
                return items, i + 1
            else:
                depth -= 1
                current.append(char)
        elif char == ',' and depth == 0:
            item_text = ''.join(current).strip()
            if item_text:
                val, _ = parse_value(item_text)
                items.append(val)
            current = []
        else:
            current.append(char)

    return items, len(text)


# ─── ГЕНЕРАЦИЯ HTML ───

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Редактор базы вопросов ЕГЭ</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; }
  .header { background: #2c3e50; color: white; padding: 1rem 2rem; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
  .header h1 { font-size: 1.25rem; }
  .header .subtitle { font-size: 0.8rem; opacity: 0.7; margin-top: 0.25rem; }
  .toolbar { background: white; padding: 1rem 2rem; border-bottom: 1px solid #ddd; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; position: sticky; top: 60px; z-index: 99; }
  .toolbar input, .toolbar select { padding: 0.5rem 0.75rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; }
  .toolbar input[type="text"] { min-width: 200px; }
  .toolbar button { padding: 0.5rem 1rem; border: none; border-radius: 6px; background: #27ae60; color: white; cursor: pointer; font-size: 0.9rem; }
  .toolbar button:hover { background: #219a52; }
  .toolbar button.secondary { background: #3498db; }
  .toolbar button.danger { background: #e74c3c; }
  .toolbar label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer; }
  .stats { margin-left: auto; font-size: 0.85rem; color: #666; }
  .container { padding: 1rem 2rem; max-width: 1400px; margin: 0 auto; }
  .question-card { background: white; border-radius: 10px; padding: 1rem; margin-bottom: 0.75rem; border: 1px solid #e0e0e0; transition: box-shadow 0.2s; }
  .question-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .question-card.hallucination { border-left: 4px solid #e74c3c; background: #fdf2f2; }
  .question-card.verified { border-left: 4px solid #27ae60; }
  .question-card.original { border-left: 4px solid #3498db; }
  .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
  .card-id { font-family: monospace; font-size: 0.8rem; color: #888; background: #f0f0f0; padding: 0.15rem 0.4rem; border-radius: 4px; }
  .badges { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .badge { font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 12px; font-weight: 600; }
  .badge-task { background: #e8f4fd; color: #2980b9; }
  .badge-difficulty-easy { background: #d4edda; color: #155724; }
  .badge-difficulty-medium { background: #fff3cd; color: #856404; }
  .badge-difficulty-hard { background: #f8d7da; color: #721c24; }
  .badge-hallucination { background: #f5b7b1; color: #c0392b; }
  .badge-verified { background: #a9dfbf; color: #1e8449; }
  .badge-agent { background: #d5dbdb; color: #566573; }
  .card-text { font-size: 1rem; margin-bottom: 0.5rem; line-height: 1.5; }
  .card-answer { font-size: 0.85rem; color: #27ae60; font-weight: 600; margin-bottom: 0.25rem; }
  .card-explanation { font-size: 0.85rem; color: #666; line-height: 1.4; }
  .card-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap; }
  .card-actions button { padding: 0.35rem 0.75rem; border: 1px solid #ccc; background: white; border-radius: 5px; cursor: pointer; font-size: 0.8rem; }
  .card-actions button:hover { background: #f0f0f0; }
  .card-actions button.primary { background: #3498db; color: white; border-color: #3498db; }
  .card-actions button.primary:hover { background: #2980b9; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 1000; }
  .modal-overlay.active { display: flex; }
  .modal { background: white; border-radius: 12px; width: 90%; max-width: 700px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; }
  .modal h2 { margin-bottom: 1rem; }
  .form-group { margin-bottom: 1rem; }
  .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; color: #555; }
  .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.95rem; font-family: inherit; }
  .form-group textarea { min-height: 80px; resize: vertical; }
  .form-group input[readonly] { background: #f5f5f5; color: #888; }
  .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }
  .modal-actions button { padding: 0.6rem 1.2rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
  .modal-actions .save { background: #27ae60; color: white; }
  .modal-actions .cancel { background: #95a5a6; color: white; }
  .export-modal textarea { width: 100%; min-height: 400px; font-family: monospace; font-size: 0.85rem; background: #1e1e1e; color: #d4d4d4; border: none; padding: 1rem; border-radius: 8px; resize: vertical; }
  .hidden { display: none !important; }
  .empty { text-align: center; padding: 3rem; color: #888; }
</style>
</head>
<body>
<div class="header">
  <h1>🎓 Редактор базы вопросов ЕГЭ</h1>
  <div class="subtitle">Редактируй вопросы, исправляй галлюцинации, генерируй TypeScript</div>
</div>

<div class="toolbar">
  <input type="text" id="search" placeholder="Поиск по тексту, ID, ответу..." oninput="filterQuestions()">
  <select id="filterTask" onchange="filterQuestions()">
    <option value="">Все задания</option>
  </select>
  <select id="filterDifficulty" onchange="filterQuestions()">
    <option value="">Все сложности</option>
    <option value="easy">Легкие</option>
    <option value="medium">Средние</option>
    <option value="hard">Сложные</option>
  </select>
  <label><input type="checkbox" id="showHallucinations" onchange="filterQuestions()"> ⚠️ Только галлюцинации</label>
  <label><input type="checkbox" id="showUnverified" onchange="filterQuestions()"> ⏳ Непроверенные</label>
  <button class="secondary" onclick="exportAll()">📥 Экспортировать всё</button>
  <div class="stats" id="stats">Загрузка...</div>
</div>

<div class="container" id="container"></div>

<!-- Edit Modal -->
<div class="modal-overlay" id="editModal">
  <div class="modal">
    <h2>✏️ Редактировать вопрос</h2>
    <div class="form-group"><label>ID</label><input id="editId" readonly></div>
    <div class="form-group"><label>Задание</label><input id="editTaskNumber" readonly></div>
    <div class="form-group"><label>Текст вопроса</label><textarea id="editText"></textarea></div>
    <div class="form-group"><label>Варианты ответа (через запятую)</label><input id="editOptions"></div>
    <div class="form-group"><label>Правильный ответ (через запятую)</label><input id="editCorrectAnswer"></div>
    <div class="form-group"><label>Пояснение</label><textarea id="editExplanation"></textarea></div>
    <div class="form-group"><label>Сложность</label>
      <select id="editDifficulty">
        <option value="easy">Легкая</option>
        <option value="medium">Средняя</option>
        <option value="hard">Сложная</option>
      </select>
    </div>
    <div class="form-group"><label>Теги (через запятую)</label><input id="editTags"></div>
    <div class="form-group"><label>Атомы (через запятую)</label><input id="editAtoms"></div>
    <div class="form-group"><label><input type="checkbox" id="editVerified"> ✅ Проверено (не галлюцинация)</label></div>
    <div class="modal-actions">
      <button class="cancel" onclick="closeModal()">Отмена</button>
      <button class="save" onclick="saveEdit()">Сохранить</button>
    </div>
  </div>
</div>

<!-- Export Modal -->
<div class="modal-overlay" id="exportModal">
  <div class="modal export-modal">
    <h2>📥 Скопируй TypeScript код</h2>
    <p style="margin-bottom:1rem;font-size:0.85rem;color:#666;">Скопируй код и замени содержимое соответствующего файла в <code>src/data/questions/taskX.ts</code></p>
    <div class="form-group">
      <label>Выбери задание для экспорта:</label>
      <select id="exportTaskSelect"></select>
    </div>
    <textarea id="exportCode" readonly></textarea>
    <div class="modal-actions">
      <button class="cancel" onclick="closeExportModal()">Закрыть</button>
      <button class="save" onclick="copyExport()">📋 Копировать</button>
      <button class="save" onclick="downloadExport()">💾 Скачать .ts</button>
    </div>
  </div>
</div>

<script>
// ─── ДАННЫЕ ───
const QUESTIONS = /*INJECT_JSON*/;

// Apply any saved edits from localStorage
const editsKey = 'ege-editor-edits';
const savedEdits = JSON.parse(localStorage.getItem(editsKey) || '{}');
QUESTIONS.forEach(q => {
  if (savedEdits[q.id]) {
    Object.assign(q, savedEdits[q.id]);
  }
});

// ─── STATE ───
let currentEditId = null;

// ─── INIT ───
function init() {
  // Populate task filter
  const tasks = [...new Set(QUESTIONS.map(q => q.taskNumber))].sort((a, b) => parseInt(a) - parseInt(b));
  const taskSelect = document.getElementById('filterTask');
  const exportSelect = document.getElementById('exportTaskSelect');
  tasks.forEach(t => {
    taskSelect.innerHTML += `<option value="${t}">Задание ${t}</option>`;
    exportSelect.innerHTML += `<option value="${t}">Задание ${t}</option>`;
  });
  exportSelect.onchange = generateExportCode;
  filterQuestions();
}

// ─── FILTER & RENDER ───
function filterQuestions() {
  const query = document.getElementById('search').value.toLowerCase();
  const task = document.getElementById('filterTask').value;
  const difficulty = document.getElementById('filterDifficulty').value;
  const onlyHall = document.getElementById('showHallucinations').checked;
  const onlyUnv = document.getElementById('showUnverified').checked;

  let filtered = QUESTIONS.filter(q => {
    if (task && q.taskNumber !== task) return false;
    if (difficulty && q.difficulty !== difficulty) return false;
    if (onlyHall && !isHallucination(q)) return false;
    if (onlyUnv && q.verified) return false;
    if (query) {
      const hay = `${q.id} ${q.text} ${q.explanation} ${q.correctAnswer?.join(' ')} ${q.tags?.join(' ')}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  // Sort: hallucinations first, then unverified, then by task
  filtered.sort((a, b) => {
    const ha = isHallucination(a) ? 0 : 1;
    const hb = isHallucination(b) ? 0 : 1;
    if (ha !== hb) return ha - hb;
    const ua = a.verified ? 1 : 0;
    const ub = b.verified ? 1 : 0;
    if (ua !== ub) return ua - ub;
    return parseInt(a.taskNumber) - parseInt(b.taskNumber) || a.id.localeCompare(b.id);
  });

  renderQuestions(filtered);
  updateStats(filtered);
}

function isHallucination(q) {
  return q.agent === 'Агент 7' && !q.verified;
}

function getCardClass(q) {
  if (isHallucination(q)) return 'hallucination';
  if (q.verified) return 'verified';
  return 'original';
}

function renderQuestions(list) {
  const container = document.getElementById('container');
  if (!list.length) {
    container.innerHTML = '<div class="empty">Нет вопросов по выбранным фильтрам</div>';
    return;
  }
  container.innerHTML = list.map(q => `
    <div class="question-card ${getCardClass(q)}" data-id="${q.id}">
      <div class="card-header">
        <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
          <span class="card-id">${q.id}</span>
          <div class="badges">
            <span class="badge badge-task">Задание ${q.taskNumber}</span>
            <span class="badge badge-difficulty-${q.difficulty}">${q.difficulty}</span>
            ${q.agent ? `<span class="badge badge-agent">${q.agent}</span>` : ''}
            ${isHallucination(q) ? '<span class="badge badge-hallucination">⚠️ Галлюцинация</span>' : ''}
            ${q.verified ? '<span class="badge badge-verified">✅ Проверено</span>' : ''}
          </div>
        </div>
      </div>
      <div class="card-text">${escapeHtml(q.text)}</div>
      <div class="card-answer">Ответ: ${q.correctAnswer?.join(', ')}</div>
      ${q.options ? `<div style="font-size:0.8rem;color:#888;margin-bottom:0.25rem;">Варианты: ${q.options.map(o=>escapeHtml(o)).join(' | ')}</div>` : ''}
      <div class="card-explanation">${escapeHtml(q.explanation)}</div>
      <div class="card-actions">
        <button class="primary" onclick="openEdit('${q.id}')">✏️ Редактировать</button>
        <button onclick="toggleVerified('${q.id}')">${q.verified ? '↩️ Отменить проверку' : '✅ Отметить проверенным'}</button>
      </div>
    </div>
  `).join('');
}

function updateStats(list) {
  const total = QUESTIONS.length;
  const hall = QUESTIONS.filter(isHallucination).length;
  const unv = QUESTIONS.filter(q => !q.verified).length;
  document.getElementById('stats').textContent = `Показано: ${list.length} / Всего: ${total} | ⚠️ Галлюцинации: ${hall} | ⏳ Непроверено: ${unv}`;
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── EDIT ───
function openEdit(id) {
  const q = QUESTIONS.find(x => x.id === id);
  if (!q) return;
  currentEditId = id;
  document.getElementById('editId').value = q.id;
  document.getElementById('editTaskNumber').value = q.taskNumber;
  document.getElementById('editText').value = q.text || '';
  document.getElementById('editOptions').value = (q.options || []).join(', ');
  document.getElementById('editCorrectAnswer').value = (q.correctAnswer || []).join(', ');
  document.getElementById('editExplanation').value = q.explanation || '';
  document.getElementById('editDifficulty').value = q.difficulty || 'easy';
  document.getElementById('editTags').value = (q.tags || []).join(', ');
  document.getElementById('editAtoms').value = (q.atoms || []).join(', ');
  document.getElementById('editVerified').checked = !!q.verified;
  document.getElementById('editModal').classList.add('active');
}

function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  currentEditId = null;
}

function saveEdit() {
  if (!currentEditId) return;
  const q = QUESTIONS.find(x => x.id === currentEditId);
  if (!q) return;

  q.text = document.getElementById('editText').value;
  q.options = document.getElementById('editOptions').value.split(',').map(s => s.trim()).filter(Boolean);
  q.correctAnswer = document.getElementById('editCorrectAnswer').value.split(',').map(s => s.trim()).filter(Boolean);
  q.explanation = document.getElementById('editExplanation').value;
  q.difficulty = document.getElementById('editDifficulty').value;
  q.tags = document.getElementById('editTags').value.split(',').map(s => s.trim()).filter(Boolean);
  q.atoms = document.getElementById('editAtoms').value.split(',').map(s => s.trim()).filter(Boolean);
  q.verified = document.getElementById('editVerified').checked;

  // Save to localStorage
  const edits = JSON.parse(localStorage.getItem(editsKey) || '{}');
  edits[currentEditId] = {
    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: q.difficulty,
    tags: q.tags,
    atoms: q.atoms,
    verified: q.verified
  };
  localStorage.setItem(editsKey, JSON.stringify(edits));

  closeModal();
  filterQuestions();
}

function toggleVerified(id) {
  const q = QUESTIONS.find(x => x.id === id);
  if (!q) return;
  q.verified = !q.verified;
  // Save to localStorage
  const edits = JSON.parse(localStorage.getItem(editsKey) || '{}');
  if (!edits[id]) edits[id] = {};
  edits[id].verified = q.verified;
  localStorage.setItem(editsKey, JSON.stringify(edits));
  filterQuestions();
}

// ─── EXPORT ───
function exportAll() {
  document.getElementById('exportModal').classList.add('active');
  generateExportCode();
}

function closeExportModal() {
  document.getElementById('exportModal').classList.remove('active');
}

function generateExportCode() {
  const task = document.getElementById('exportTaskSelect').value;
  if (!task) return;
  const questions = QUESTIONS.filter(q => q.taskNumber === task);
  const varName = `task${task}Questions`;
  const code = generateTsFile(task, varName, questions);
  document.getElementById('exportCode').value = code;
}

function generateTsFile(taskNumber, varName, questions) {
  const lines = [
    `import type { UnifiedQuestion } from './types'`,
    '',
    `// ⚠️ СГЕНЕРИРОВАНО РЕДАКТОРОМ — ${new Date().toISOString()}`,
    `// Ручные правки: сохраняй через редактор, чтобы не потерять.`,
    '',
    `export const ${varName}: UnifiedQuestion[] = [`,
  ];
  for (const q of questions) {
    lines.push('  {');
    lines.push(`    id: '${q.id}',`);
    lines.push(`    taskNumber: '${q.taskNumber}',`);
    lines.push(`    type: '${q.type}',`);
    lines.push(`    text: '${escapeTs(q.text)}',`);
    if (q.options && q.options.length) {
      lines.push(`    options: [${q.options.map(o => `'${escapeTs(o)}'`).join(', ')}],`);
    }
    lines.push(`    correctAnswer: [${q.correctAnswer.map(a => `'${escapeTs(a)}'`).join(', ')}],`);
    lines.push(`    explanation: '${escapeTs(q.explanation)}',`);
    lines.push(`    difficulty: '${q.difficulty}',`);
    lines.push(`    xpReward: ${q.xpReward || 10},`);
    lines.push(`    atoms: [${(q.atoms || []).map(a => `'${escapeTs(a)}'`).join(', ')}],`);
    lines.push(`    tags: [${(q.tags || []).map(t => `'${escapeTs(t)}'`).join(', ')}],`);
    if (q.agent) lines.push(`    agent: '${q.agent}',`);
    if (q.verified) lines.push(`    verified: true,`);
    lines.push('  },');
  }
  lines.push(']');
  lines.push('');
  lines.push(`export const ${varName}ById = Object.fromEntries(${varName}.map(q => [q.id, q]))`);
  lines.push('');
  return lines.join('\\n');
}

function escapeTs(s) {
  if (!s) return '';
  return s.replace(/\\\\/g, '\\\\').replace(/'/g, "\\'").replace(/\\n/g, '\\n').replace(/\\r/g, '\\r');
}

function copyExport() {
  const textarea = document.getElementById('exportCode');
  textarea.select();
  document.execCommand('copy');
  alert('Код скопирован! Вставь в src/data/questions/taskX.ts');
}

function downloadExport() {
  const task = document.getElementById('exportTaskSelect').value;
  const code = document.getElementById('exportCode').value;
  const blob = new Blob([code], { type: 'text/typescript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `task${task}.ts`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── START ───
init();
</script>
</body>
</html>
'''


# ─── MAIN ───

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    questions_dir = os.path.join(base_dir, 'src', 'data', 'questions')

    all_questions = []
    for filepath in sorted(glob.glob(os.path.join(questions_dir, 'task*.ts'))):
        if 'index' in filepath or 'types' in filepath or 'search' in filepath:
            continue
        questions = parse_ts_file(filepath)
        all_questions.extend(questions)
        print(f'  ✓ {os.path.basename(filepath)} — {len(questions)} вопросов')

    # Также парсим dooshin.ts
    dooshin_path = os.path.join(questions_dir, 'dooshin.ts')
    if os.path.exists(dooshin_path):
        questions = parse_ts_file(dooshin_path)
        all_questions.extend(questions)
        print(f'  ✓ dooshin.ts — {len(questions)} вопросов')

    print(f'\nВсего вопросов: {len(all_questions)}')

    # Встраиваем JSON в HTML
    json_str = json.dumps(all_questions, ensure_ascii=False, indent=2)
    html = HTML_TEMPLATE.replace('/*INJECT_JSON*/', json_str)

    output_path = os.path.join(base_dir, 'tools', 'editor.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'\n✅ Редактор создан: {output_path}')
    print(f'   Открой этот файл в браузере (двойной клик)')
    print(f'   Редактируй вопросы → нажми "Экспортировать всё" → скачай taskX.ts')


if __name__ == '__main__':
    main()
