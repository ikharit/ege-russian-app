"""
Конвертер shkolkovo JSON → UnifiedQuestion (taskX.ts)

Запуск:
    python tools/convert_shkolkovo.py

Читает JSON из автоматизация/автоматизация/shkolkovo_*.json,
конвертирует в UnifiedQuestion и добавляет в существующие taskX.ts.
"""
import os
import re
import json
import glob
from datetime import datetime

# ─── ПАРСЕР TypeScript (из build_editor.py) ───

def parse_ts_file(filepath: str) -> list[dict]:
    with open(filepath, 'r', encoding='utf-8') as f:
        raw = f.read()
    content = re.sub(r'import.*?\n', '', raw)
    content = re.sub(r'export const \w+:.*?\[', '[', content, flags=re.DOTALL)
    content = re.sub(r'\]\s*export.*', ']', content, flags=re.DOTALL)
    content = re.sub(r'\]\s*$', ']', content, flags=re.DOTALL)
    m = re.search(r'\[([\s\S]*)\]', content)
    if not m:
        return []
    array_body = m.group(1)
    objects = split_objects(array_body)
    questions = []
    for obj in objects:
        q = parse_object(obj)
        if q and q.get('id'):
            questions.append(q)
    return questions

def split_objects(text: str) -> list[str]:
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
    body = obj_str.strip()
    if body.startswith('{'):
        body = body[1:]
    if body.endswith('}'):
        body = body[:-1]
    result = {}
    pos = 0
    while pos < len(body):
        key_match = re.match(r'\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', body[pos:])
        if not key_match:
            break
        key = key_match.group(1)
        pos += key_match.end()
        value, consumed = parse_value(body[pos:])
        pos += consumed
        result[key] = value
        while pos < len(body) and body[pos] in " \t\n,']":
            pos += 1
    return result

def parse_value(text: str):
    original = text
    text = text.lstrip()
    stripped = len(original) - len(text)
    if not text:
        return None, 0
    if text[0] == "'":
        val, consumed = parse_quoted_string(text, "'")
        return val, stripped + consumed
    if text[0] == '"':
        val, consumed = parse_quoted_string(text, '"')
        return val, stripped + consumed
    if text[0] == '[':
        val, consumed = parse_array(text)
        return val, stripped + consumed
    num_match = re.match(r'-?\d+(\.\d+)?', text)
    if num_match:
        val = int(num_match.group()) if '.' not in num_match.group() else float(num_match.group())
        return val, stripped + num_match.end()
    word_match = re.match(r'(true|false|null|undefined)', text)
    if word_match:
        val = {'true': True, 'false': False, 'null': None, 'undefined': None}[word_match.group(1)]
        return val, stripped + word_match.end()
    return None, 0

def parse_quoted_string(text: str, quote: str):
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
    depth = 0
    items = []
    current = []
    in_string = False
    escape = False
    for i in range(1, len(text)):
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


# ─── HTML STRIPPER ───

HTML_ENTITIES = {
    '&nbsp;': ' ', '&ndash;': '–', '&mdash;': '—',
    '&laquo;': '«', '&raquo;': '»', '&hellip;': '…',
    '&bull;': '•', '&quot;': '"', '&apos;': "'",
    '&lt;': '<', '&gt;': '>', '&amp;': '&',
    '&shy;': '', '&rsquo;': '’', '&lsquo;': '‘',
    '&ldquo;': '"', '&rdquo;': '"', '&prime;': "'",
    '&tilde;': '~', '&cent;': '¢', '&copy;': '©',
    '&reg;': '®', '&trade;': '™', '&euro;': '€',
    '&pound;': '£', '&yen;': '¥', '&sect;': '§',
    '&para;': '¶', '&middot;': '·', '&deg;': '°',
    '&plusmn;': '±', '&sup2;': '²', '&sup3;': '³',
    '&frac14;': '¼', '&frac12;': '½', '&frac34;': '¾',
    '&times;': '×', '&divide;': '÷', '&infin;': '∞',
    '&sum;': '∑', '&prod;': '∏', '&int;': '∫',
    '&part;': '∂', '&nabla;': '∇', '&radic;': '√',
    '&perp;': '⊥', '&ang;': '∠', '&sim;': '∼',
    '&there4;': '∴', '&loz;': '◊', '&spades;': '♠',
    '&clubs;': '♣', '&hearts;': '♥', '&diams;': '♦',
    '&larr;': '←', '&uarr;': '↑', '&rarr;': '→',
    '&darr;': '↓', '&harr;': '↔', '&crarr;': '↵',
    '&lArr;': '⇐', '&uArr;': '⇑', '&rArr;': '⇒',
    '&dArr;': '⇓', '&hArr;': '⇔', '&forall;': '∀',
    '&exist;': '∃', '&empty;': '∅', '&isin;': '∈',
    '&notin;': '∉', '&ni;': '∋', '&prod;': '∏',
    '&sum;': '∑', '&minus;': '−', '&lowast;': '∗',
    '&radic;': '√', '&prop;': '∝', '&infin;': '∞',
    '&ang;': '∠', '&and;': '∧', '&or;': '∨',
    '&cap;': '∩', '&cup;': '∪', '&int;': '∫',
    '&there4;': '∴', '&sim;': '∼', '&cong;': '≅',
    '&asymp;': '≈', '&ne;': '≠', '&equiv;': '≡',
    '&le;': '≤', '&ge;': '≥', '&sub;': '⊂',
    '&sup;': '⊃', '&nsub;': '⊄', '&sube;': '⊆',
    '&supe;': '⊇', '&oplus;': '⊕', '&otimes;': '⊗',
    '&perp;': '⊥', '&sdot;': '⋅', '&lceil;': '⌈',
    '&rceil;': '⌉', '&lfloor;': '⌊', '&rfloor;': '⌋',
    '&lang;': '⟨', '&rang;': '⟩', '&loz;': '◊',
    '&spades;': '♠', '&clubs;': '♣', '&hearts;': '♥',
    '&diams;': '♦', '&nbsp;': ' ', '&iexcl;': '¡',
    '&cent;': '¢', '&pound;': '£', '&curren;': '¤',
    '&yen;': '¥', '&brvbar;': '¦', '&sect;': '§',
    '&uml;': '¨', '&ordf;': 'ª', '&laquo;': '«',
    '&not;': '¬', '&shy;': '', '&reg;': '®',
    '&macr;': '¯', '&deg;': '°', '&plusmn;': '±',
    '&sup2;': '²', '&sup3;': '³', '&acute;': '´',
    '&micro;': 'µ', '&para;': '¶', '&middot;': '·',
    '&cedil;': '¸', '&sup1;': '¹', '&ordm;': 'º',
    '&raquo;': '»', '&frac14;': '¼', '&frac12;': '½',
    '&frac34;': '¾', '&iquest;': '¿', '&Agrave;': 'À',
    '&Aacute;': 'Á', '&Acirc;': 'Â', '&Atilde;': 'Ã',
    '&Auml;': 'Ä', '&Aring;': 'Å', '&AElig;': 'Æ',
    '&Ccedil;': 'Ç', '&Egrave;': 'È', '&Eacute;': 'É',
    '&Ecirc;': 'Ê', '&Euml;': 'Ë', '&Igrave;': 'Ì',
    '&Iacute;': 'Í', '&Icirc;': 'Î', '&Iuml;': 'Ï',
    '&ETH;': 'Ð', '&Ntilde;': 'Ñ', '&Ograve;': 'Ò',
    '&Oacute;': 'Ó', '&Ocirc;': 'Ô', '&Otilde;': 'Õ',
    '&Ouml;': 'Ö', '&times;': '×', '&Oslash;': 'Ø',
    '&Ugrave;': 'Ù', '&Uacute;': 'Ú', '&Ucirc;': 'Û',
    '&Uuml;': 'Ü', '&Yacute;': 'Ý', '&THORN;': 'Þ',
    '&szlig;': 'ß', '&agrave;': 'à', '&aacute;': 'á',
    '&acirc;': 'â', '&atilde;': 'ã', '&auml;': 'ä',
    '&aring;': 'å', '&aelig;': 'æ', '&ccedil;': 'ç',
    '&egrave;': 'è', '&eacute;': 'é', '&ecirc;': 'ê',
    '&euml;': 'ë', '&igrave;': 'ì', '&iacute;': 'í',
    '&icirc;': 'î', '&iuml;': 'ï', '&eth;': 'ð',
    '&ntilde;': 'ñ', '&ograve;': 'ò', '&oacute;': 'ó',
    '&ocirc;': 'ô', '&otilde;': 'õ', '&ouml;': 'ö',
    '&divide;': '÷', '&oslash;': 'ø', '&ugrave;': 'ù',
    '&uacute;': 'ú', '&ucirc;': 'û', '&uuml;': 'ü',
    '&yacute;': 'ý', '&thorn;': 'þ', '&yuml;': 'ÿ',
    '&OElig;': 'Œ', '&oelig;': 'œ', '&Scaron;': 'Š',
    '&scaron;': 'š', '&Yuml;': 'Ÿ', '&fnof;': 'ƒ',
    '&circ;': 'ˆ', '&tilde;': '˜', '&Alpha;': 'Α',
    '&Beta;': 'Β', '&Gamma;': 'Γ', '&Delta;': 'Δ',
    '&Epsilon;': 'Ε', '&Zeta;': 'Ζ', '&Eta;': 'Η',
    '&Theta;': 'Θ', '&Iota;': 'Ι', '&Kappa;': 'Κ',
    '&Lambda;': 'Λ', '&Mu;': 'Μ', '&Nu;': 'Ν',
    '&Xi;': 'Ξ', '&Omicron;': 'Ο', '&Pi;': 'Π',
    '&Rho;': 'Ρ', '&Sigma;': 'Σ', '&Tau;': 'Τ',
    '&Upsilon;': 'Υ', '&Phi;': 'Φ', '&Chi;': 'Χ',
    '&Psi;': 'Ψ', '&Omega;': 'Ω', '&alpha;': 'α',
    '&beta;': 'β', '&gamma;': 'γ', '&delta;': 'δ',
    '&epsilon;': 'ε', '&zeta;': 'ζ', '&eta;': 'η',
    '&theta;': 'θ', '&iota;': 'ι', '&kappa;': 'κ',
    '&lambda;': 'λ', '&mu;': 'μ', '&nu;': 'ν',
    '&xi;': 'ξ', '&omicron;': 'ο', '&pi;': 'π',
    '&rho;': 'ρ', '&sigmaf;': 'ς', '&sigma;': 'σ',
    '&tau;': 'τ', '&upsilon;': 'υ', '&phi;': 'φ',
    '&chi;': 'χ', '&psi;': 'ψ', '&omega;': 'ω',
    '&thetasym;': 'ϑ', '&upsih;': 'ϒ', '&piv;': 'ϖ',
    '&ensp;': ' ', '&emsp;': ' ', '&thinsp;': ' ',
    '&zwnj;': '', '&zwj;': '', '&lrm;': '', '&rlm;': '',
}

def strip_html(html: str) -> str:
    if not html:
        return ''
    # Remove tags
    text = ''
    in_tag = False
    for char in html:
        if char == '<':
            in_tag = True
        elif char == '>':
            in_tag = False
        elif not in_tag:
            text += char
    # Replace numeric entities like &#123; and &#x1F;
    def replace_numeric_entity(m):
        try:
            if m.group(1).startswith('x') or m.group(1).startswith('X'):
                return chr(int(m.group(1)[1:], 16))
            return chr(int(m.group(1)))
        except:
            return m.group(0)
    text = re.sub(r'&#(x?[0-9a-fA-F]+);', replace_numeric_entity, text)
    # Replace named entities
    for entity, char in HTML_ENTITIES.items():
        text = text.replace(entity, char)
    # Normalize whitespace
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    text = text.strip()
    return text


# ─── TYPE DETERMINATION ───

def determine_type(task_number: str, answer_type_id: int) -> str:
    if task_number in ('7', '26'):
        return 'text'
    if task_number in ('8', '11', '22'):
        return 'ege-multiple'
    return 'single'


def determine_difficulty(task_number: str) -> str:
    if task_number in ('8', '22', '26'):
        return 'hard'
    return 'medium'


# ─── CONVERTER ───

def convert_dict_question(q: dict, task_number: str, source_name: str) -> dict:
    """Convert dict-format shkolkovo question (e.g., 10673)."""
    q_id = f"shk-{q['id']}"
    text = strip_html(q.get('question_html', ''))
    explanation = strip_html(q.get('solution_html', ''))
    answer_text = q.get('answer_text', '')
    answer_type_id = q.get('answer_type_id', 1)
    
    return {
        'id': q_id,
        'taskNumber': task_number,
        'type': determine_type(task_number, answer_type_id),
        'text': text,
        'correctAnswer': [answer_text] if answer_text else [],
        'explanation': explanation,
        'difficulty': determine_difficulty(task_number),
        'xpReward': 10,
        'atoms': [f'task{task_number}', 'shkolkovo'],
        'tags': ['shkolkovo', 'dooshin', f'task{task_number}'],
        'agent': 'Агент 7',
        'createdAt': datetime.now().isoformat(),
    }


def convert_list_question(q: dict, task_number: str, source_name: str) -> dict:
    """Convert list-format shkolkovo question (e.g., zadanie7)."""
    q_id = f"shk-{q['id']}"
    text = strip_html(q.get('question_text', ''))
    explanation = strip_html(q.get('solution_text', ''))
    answer = q.get('answer', '')
    answer_type = q.get('answer_type', 1)
    
    return {
        'id': q_id,
        'taskNumber': task_number,
        'type': determine_type(task_number, answer_type),
        'text': text,
        'correctAnswer': [str(answer)] if answer is not None else [],
        'explanation': explanation,
        'difficulty': determine_difficulty(task_number),
        'xpReward': 10,
        'atoms': [f'task{task_number}', 'shkolkovo'],
        'tags': ['shkolkovo', 'dooshin', f'task{task_number}'],
        'agent': 'Агент 7',
        'createdAt': datetime.now().isoformat(),
    }


# ─── GENERATE TYPESCRIPT ───

def escape_ts(s: str) -> str:
    if not s:
        return ''
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('\r', '\\r')


def generate_ts(task_number: str, var_name: str, questions: list[dict]) -> str:
    lines = [
        f"import type {{ UnifiedQuestion }} from './types'",
        '',
        f"// ⚠️ ВНИМАНИЕ АГЕНТАМ: БАЗА ДАННЫХ ПЕРЕПИСАНА (Агент 7, {datetime.now().strftime('%Y-%m-%d')})",
        f"// Старые файлы `src/data/taskXQuestions.ts` теперь — ТОЛЬКО АДАПТЕРЫ.",
        f"// Источник правды: `src/data/questions/taskX.ts`. Не добавляй в старые файлы!",
        '',
        f"export const {var_name}: UnifiedQuestion[] = [",
    ]
    for q in questions:
        lines.append('  {')
        lines.append(f"    id: '{q['id']}',")
        lines.append(f"    taskNumber: '{q['taskNumber']}',")
        lines.append(f"    type: '{q['type']}',")
        lines.append(f"    text: '{escape_ts(q['text'])}',")
        if q.get('options') and len(q['options']) > 0:
            lines.append(f"    options: [{', '.join([repr(o) for o in q['options']])}],")
        if q.get('correctAnswer') and len(q['correctAnswer']) > 0:
            answers = ', '.join([f"'{escape_ts(a)}'" for a in q['correctAnswer']])
            lines.append(f"    correctAnswer: [{answers}],")
        lines.append(f"    explanation: '{escape_ts(q['explanation'])}',")
        lines.append(f"    difficulty: '{q['difficulty']}',")
        lines.append(f"    xpReward: {q.get('xpReward', 10)},")
        atoms = ', '.join([f"'{escape_ts(a)}'" for a in q.get('atoms', [])])
        lines.append(f"    atoms: [{atoms}],")
        tags = ', '.join([f"'{escape_ts(t)}'" for t in q.get('tags', [])])
        lines.append(f"    tags: [{tags}],")
        if q.get('agent'):
            lines.append(f"    agent: '{q['agent']}',")
        if q.get('createdAt'):
            lines.append(f"    createdAt: '{q['createdAt']}',")
        lines.append('  },')
    lines.append(']')
    lines.append('')
    lines.append(f"export const {var_name}ById = Object.fromEntries({var_name}.map(q => [q.id, q]))")
    lines.append('')
    return '\n'.join(lines)


# ─── MAIN ───

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    questions_dir = os.path.join(base_dir, 'src', 'data', 'questions')
    source_dir = r'C:\Users\USER\Documents\kimi\автоматизация\автоматизация'
    
    FILE_MAP = {
        'shkolkovo_10673.json': '11',
        'shkolkovo_10933.json': '8',
        'shkolkovo_13519.json': '11',
        'shkolkovo_13886.json': '8',
        'shkolkovo_6999.json': '8',
        'shkolkovo_7006.json': '11',
        'shkolkovo_8566.json': '8',
        'shkolkovo_8569.json': '11',
        'shkolkovo_8680.json': '8',
        'shkolkovo_9014.json': '11',
        'shkolkovo_zadanie7_combined.json': '7',
        'shkolkovo_zadanie22_combined.json': '22',
        'shkolkovo_zadanie26_combined.json': '26',
    }
    
    # Collect new questions by task
    new_by_task = {}
    for filename, task_number in FILE_MAP.items():
        filepath = os.path.join(source_dir, filename)
        if not os.path.exists(filepath):
            print(f"⚠️ Not found: {filepath}")
            continue
        
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if isinstance(data, dict):
            questions = data.get('questions', [])
            converted = [convert_dict_question(q, task_number, filename) for q in questions]
        elif isinstance(data, list):
            converted = [convert_list_question(q, task_number, filename) for q in data]
        else:
            print(f"⚠️ Unknown format in {filename}")
            continue
        
        new_by_task.setdefault(task_number, []).extend(converted)
        print(f"  ✓ {filename} → Task {task_number}: {len(converted)} questions")
    
    # Combine with existing questions and write back
    for task_number, new_questions in new_by_task.items():
        existing_path = os.path.join(questions_dir, f'task{task_number}.ts')
        existing_questions = []
        if os.path.exists(existing_path):
            existing_questions = parse_ts_file(existing_path)
            print(f"  📂 task{task_number}.ts: {len(existing_questions)} existing")
        
        all_questions = existing_questions + new_questions
        var_name = f'task{task_number}Questions'
        ts_content = generate_ts(task_number, var_name, all_questions)
        
        with open(existing_path, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        
        print(f"  ✅ Written task{task_number}.ts: {len(all_questions)} total questions")
    
    print(f"\n🎉 Done! Added {sum(len(v) for v in new_by_task.values())} shkolkovo questions.")
    print("   Regenerate editor.html with: python tools/build_editor.py")


if __name__ == '__main__':
    main()
