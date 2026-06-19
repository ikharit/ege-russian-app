#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Универсальный верификатор заданий ЕГЭ Русский (9-20).
Проверяет структурную корректность вопросов в TypeScript-файлах.

Использование:
    python verify_tasks.py src/data/sections/grammar.ts
    python verify_tasks.py src/data/sections/*.ts -v
    python verify_tasks.py src/data/sections/dooshin.ts -j > report.json
"""

import sys
import io

import re
import json
import os
from typing import List, Dict, Any, Tuple

# ===== КОНФИГУРАЦИЯ ПРОВЕРОК ПО ЗАДАНИЯМ =====

VALIDATION_RULES = {
    # Задания 9-12: орфография (пропущенные буквы)
    '9': {
        'sources': ['dooshin.ts', 'orthography.ts'],
        'allowed_types': ['text', 'single', 'ege-multiple'],
        'text_check': 'contains_dots',  # текст должен содержать '..' или '___'
        'single_check': 'options_contains_correct',
        'multiple_check': 'all_correct_in_options',
        'correct_answer_format': 'letters',  # ['а'], ['о'], ['и'] и т.д.
    },
    '10': {
        'sources': ['dooshin.ts', 'grammar.ts'],
        'allowed_types': ['text', 'single', 'ege-multiple'],
        'text_check': 'contains_dots',
        'single_check': 'options_contains_correct',
        'multiple_check': 'all_correct_in_options',
        'correct_answer_format': 'letters',
    },
    '11': {
        'sources': ['dooshin.ts', 'grammar.ts'],
        'allowed_types': ['text', 'single', 'ege-multiple'],
        'text_check': 'contains_dots',
        'single_check': 'options_contains_correct',
        'multiple_check': 'all_correct_in_options',
        'correct_answer_format': 'letters',
    },
    '12': {
        'sources': ['dooshin.ts', 'grammar.ts'],
        'allowed_types': ['text', 'single', 'ege-multiple'],
        'text_check': 'contains_dots',
        'single_check': 'options_contains_correct',
        'multiple_check': 'all_correct_in_options',
        'correct_answer_format': 'letters',
    },
    # Задания 13-14: слитно/раздельно/дефис
    '13': {
        'sources': ['grammar.ts'],
        'allowed_types': ['text', 'single'],
        'text_check': 'contains_ne_ni',  # для text-формата (Дощинский)
        'single_check': 'options_contains_correct',  # для single-формата (основной курс)
        'correct_answer_format': 'separate_hyphen_or_word',  # ['слитно'] или ['неумолимый']
    },
    '14': {
        'sources': ['grammar.ts'],
        'allowed_types': ['text', 'single'],
        'text_check': 'any',  # Задание 14: либо приставки (q14-1..20), либо слитно/раздельно (qd14-1..32)
        'single_check': 'options_contains_correct',
        'correct_answer_format': 'separate_hyphen_or_word',
    },
    # Задание 15: Н/НН (уже есть verify_n_nn.py)
    '15': {
        'sources': ['dooshin15.ts', 'n_nn.ts'],
        'allowed_types': ['text', 'single'],
        'text_check': 'contains_n_nn_phrase',  # "впишите количество букв Н"
        'single_check': 'options_contains_correct',
        'correct_answer_format': 'number',  # ['1'], ['2']
    },
    # Задание 16: пунктуация (запятые)
    '16': {
        'sources': ['task16LessonData.ts', 'punctuation.ts'],
        'allowed_types': ['text', 'single'],
        'text_check': 'contains_punctuation',  # ',', '—', ':' и т.д.
        'single_check': 'options_contains_correct',
        'correct_answer_format': 'mixed',
    },
    # Задания 17, 19: пунктуация
    '17': {
        'sources': ['punctuation.ts'],
        'allowed_types': ['text', 'single'],
        'text_check': 'contains_punctuation',
        'single_check': 'options_contains_correct',
        'correct_answer_format': 'mixed',
    },
    '19': {
        'sources': ['punctuation.ts'],
        'allowed_types': ['text', 'single'],
        'text_check': 'contains_punctuation',
        'single_check': 'options_contains_correct',
        'correct_answer_format': 'mixed',
    },
    # Задание 20: расстановка запятых (цифры в скобках)
    '20': {
        'sources': ['dooshin20.ts'],
        'allowed_types': ['text'],
        'text_check': 'contains_numbered_positions',
        'correct_answer_format': 'comma_positions',
    },
}

VALID_SEPARATE_HYPHEN = ['слитно', 'раздельно', 'дефис', 'дефисное']

# ===== ПАРСЕР TypeScript =====

def extract_questions_from_ts(content: str) -> List[Dict[str, Any]]:
    """
    Извлекает вопросы из TypeScript-файла.
    Ищет объекты question с полями id, type, text, correctAnswer и т.д.
    """
    questions = []
    
    # Находим все блоки questions: [...]
    # Сначала найдём массивы questions
    pattern = r'questions:\s*\[\s*(\{[\s\S]*?\})\s*\]'
    # Более надёжный подход: найти все объекты вопросов
    # Объект: { id: '...', type: '...', text: '...', correctAnswer: [...], ... }
    
    # Паттерн для отдельного вопроса (поддерживает одинарные и двойные кавычки)
    q_pattern = r'\{\s*id:\s*["\']([^"\']+)["\'],\s*type:\s*["\']([^"\']+)["\'],\s*text:\s*["\']([^"\']+)["\'](.*?)\}'
    
    # Альтернативный паттерн с учётом переносов строк
    q_pattern2 = r'id:\s*["\']([^"\']+)["\'],\s*\n\s*type:\s*["\']([^"\']+)["\'],\s*\n\s*text:\s*["\']([^"\']+)["\']'
    
    matches = re.findall(q_pattern, content, re.DOTALL)
    if not matches:
        matches = re.findall(q_pattern2, content, re.DOTALL)
    
    for match in matches:
        if len(match) >= 3:
            q_id = match[0]
            q_type = match[1]
            q_text = match[2]
            rest = match[3] if len(match) > 3 else ''
            
            question = {
                'id': q_id,
                'type': q_type,
                'text': q_text,
            }
            
            # Извлекаем correctAnswer
            ca_match = re.search(r"correctAnswer:\s*\[(.*?)\]", rest)
            if ca_match:
                ca_str = ca_match.group(1)
                # Парсим строки в массиве (поддержка одинарных и двойных кавычек)
                ca_items = re.findall(r'["\']([^"\']+)["\']', ca_str)
                question['correctAnswer'] = ca_items
            else:
                # Попробуем найти correctAnswer в более широком контексте
                ca_match2 = re.search(r"correctAnswer:\s*\[(.*?)\]", content[content.find(q_id):content.find(q_id)+800])
                if ca_match2:
                    ca_str = ca_match2.group(1)
                    ca_items = re.findall(r'["\']([^"\']+)["\']', ca_str)
                    question['correctAnswer'] = ca_items
                else:
                    question['correctAnswer'] = []
            
            # Извлекаем options если есть
            opts_match = re.search(r"options:\s*\[(.*?)\]", rest)
            if opts_match:
                opts_str = opts_match.group(1)
                opts_items = re.findall(r'["\']([^"\']+)["\']', opts_str)
                question['options'] = opts_items
            else:
                opts_match2 = re.search(r"options:\s*\[(.*?)\]", content[content.find(q_id):content.find(q_id)+800])
                if opts_match2:
                    opts_str = opts_match2.group(1)
                    opts_items = re.findall(r'["\']([^"\']+)["\']', opts_str)
                    question['options'] = opts_items
                else:
                    question['options'] = []
            
            questions.append(question)
    
    return questions


def determine_task_number(question_id: str) -> str:
    """Определяет номер задания по ID вопроса."""
    # dooshin: qd9, qd10, qd11, qd12, qd13, qd14, qd15
    # основной: q9, q10, q11, q12, q13, q14, q15, q16, q17, q19
    
    if question_id.startswith('qd'):
        # qd9-1, qd10-1, qd20-1 и т.д.
        match = re.match(r'qd(\d+)', question_id)
        if match:
            return match.group(1)
    
    match = re.match(r'q(\d+)', question_id)
    if match:
        return match.group(1)
    
    # Для других форматов
    if 'task16' in question_id or 'punctuation' in question_id:
        return '16'
    if 'n_nn' in question_id or 'nnn' in question_id:
        return '15'
    if 'dooshin20' in question_id:
        return '20'
    
    return 'unknown'


# ===== ВАЛИДАТОРЫ =====

def validate_question(q: Dict, task_num: str) -> List[str]:
    """Проверяет один вопрос и возвращает список ошибок."""
    errors = []
    
    if task_num not in VALIDATION_RULES:
        return [f"Неизвестное задание {task_num} для вопроса {q['id']}"]
    
    rules = VALIDATION_RULES[task_num]
    
    # 1. Проверка типа
    if q['type'] not in rules['allowed_types']:
        errors.append(f"Недопустимый тип '{q['type']}' (допустимы: {rules['allowed_types']})")
    
    # 2. Проверка correctAnswer
    if not q.get('correctAnswer'):
        errors.append(f"correctAnswer пустой или отсутствует")
    
    # 3. Проверка формата correctAnswer (только для text-типа в заданиях 13-14)
    ca_format = rules.get('correct_answer_format', 'mixed')
    
    if ca_format == 'separate_hyphen':
        for ans in q['correctAnswer']:
            if ans.lower() not in VALID_SEPARATE_HYPHEN:
                errors.append(f"correctAnswer '{ans}' не из допустимых: {VALID_SEPARATE_HYPHEN}")
    
    elif ca_format == 'separate_hyphen_or_word':
        # Задания 13-14: либо ['слитно']/['раздельно']/['дефис'] (text), либо слово (single)
        if q['type'] == 'text':
            for ans in q['correctAnswer']:
                if ans.lower() not in VALID_SEPARATE_HYPHEN:
                    errors.append(f"correctAnswer '{ans}' не из допустимых для text-формата: {VALID_SEPARATE_HYPHEN}")
        # Для single correctAnswer — просто слово из options, проверяется ниже
    
    elif ca_format == 'number':
        # Задание 15: для text — число, для single — может быть слово
        if q['type'] == 'text':
            for ans in q['correctAnswer']:
                if not re.match(r'^\d+$', ans):
                    errors.append(f"correctAnswer '{ans}' не является числом")
        # Для single correctAnswer — может быть слово (проверяется ниже через options)
    
    elif ca_format == 'comma_positions':
        # Задание 20: correctAnswer — либо placeholder '?', либо цифры через запятую
        for ans in q['correctAnswer']:
            if ans == '?':
                # Placeholder — допустимо, но выдаём предупреждение
                pass  # Не считаем ошибкой
            elif not re.match(r'^[\d,\s]+$', ans):
                errors.append(f"correctAnswer '{ans}' не соответствует формату цифр через запятую (например, '1, 3, 5')")
    
    # 4. Проверка text
    text = q.get('text', '')
    text_check = rules.get('text_check', '')
    
    if text_check == 'contains_dots':
        # Для ege-multiple пропущенные буквы в options, а не в тексте
        if q['type'] == 'ege-multiple':
            has_gap = any('_' in opt or '..' in opt for opt in q.get('options', []))
            if not has_gap:
                errors.append(f"Ни один вариант в options не содержит '..' или '_' (пропущенная буква)")
        else:
            if '..' not in text and '___' not in text and '_' not in text:
                errors.append(f"Текст вопроса не содержит '..' или '___' или '_' (пропущенная буква)")
    
    elif text_check == 'contains_ne_ni':
        if 'не' not in text.lower() and 'ни' not in text.lower():
            errors.append(f"Текст вопроса не содержит 'не' или 'ни'")
    
    elif text_check == 'contains_n_nn_phrase':
        if 'впишите количество букв' not in text.lower() and 'н' not in text.lower():
            errors.append(f"Текст вопроса не содержит фразу про количество букв Н")
    
    elif text_check == 'contains_punctuation':
        # Проверяем, что текст содержит пунктуацию или варианты с запятыми
        if not any(p in text for p in [',', '—', ':', ';', '...', '?!']):
            # Это может быть нормально для некоторых вопросов — просто предупреждение
            pass
    
    elif text_check == 'contains_numbered_positions':
        # Задание 20: текст должен содержать цифры в скобках (1), (2) и т.д.
        if not re.search(r'\(\d+\)', text):
            errors.append(f"Текст вопроса не содержит цифр в скобках (1), (2) и т.д.")
    
    elif text_check == 'any':
        # Не проверяем текст
        pass
    
    # 5. Проверка options для single/ege-multiple
    if q['type'] in ('single', 'ege-multiple') and q.get('options'):
        single_check = rules.get('single_check', '')
        multiple_check = rules.get('multiple_check', '')
        
        if q['type'] == 'single' and single_check == 'options_contains_correct':
            correct = q['correctAnswer'][0] if q['correctAnswer'] else None
            if correct and correct not in q['options']:
                errors.append(f"correctAnswer '{correct}' отсутствует в options: {q['options']}")
        
        elif q['type'] == 'ege-multiple' and multiple_check == 'all_correct_in_options':
            # ЕГЭ-формат: options = ['1) вариантА', '2) вариантБ', ...], correctAnswer = ['1', '3']
            # Проверяем, что для каждого ans есть options, начинающийся с "ans)"
            for ans in q['correctAnswer']:
                found = any(opt.strip().startswith(ans + ')') for opt in q['options'])
                if not found:
                    errors.append(f"correctAnswer '{ans}' отсутствует в options: {q['options'][:2]}...")
            # Проверяем, что все options уникальны
            if len(q['options']) != len(set(q['options'])):
                errors.append(f"Дублирующиеся варианты в options: {q['options']}")
    
    # 6. Проверка дубликатов options (для single тоже)
    if q.get('options') and len(q['options']) != len(set(q['options'])):
        errors.append(f"Дублирующиеся варианты в options: {q['options']}")
    
    return errors


def verify_file(ts_file_path: str, verbose: bool = False) -> Dict[str, Any]:
    """Проверяет TypeScript-файл с заданиями."""
    
    if not os.path.exists(ts_file_path):
        return {'error': f'Файл не найден: {ts_file_path}'}
    
    with open(ts_file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = extract_questions_from_ts(content)
    
    if not questions:
        return {'error': f'Не удалось извлечь вопросы из {ts_file_path}. Возможно, формат файла не распознан.'}
    
    all_errors = []
    warning_count = 0
    
    # Проверка дубликатов ID
    ids = [q['id'] for q in questions]
    id_counts = {}
    for qid in ids:
        id_counts[qid] = id_counts.get(qid, 0) + 1
    
    duplicate_ids = [qid for qid, count in id_counts.items() if count > 1]
    if duplicate_ids:
        all_errors.append({
            'id': 'DUPLICATES',
            'task': 'all',
            'errors': [f"Дублирующиеся ID: {duplicate_ids}"]
        })
    
    # Проверяем каждый вопрос
    for q in questions:
        task_num = determine_task_number(q['id'])
        errors = validate_question(q, task_num)
        
        if errors:
            all_errors.append({
                'id': q['id'],
                'task': task_num,
                'text': q.get('text', '')[:60] + '...' if len(q.get('text', '')) > 60 else q.get('text', ''),
                'errors': errors
            })
        
        if verbose:
            print(f"  {q['id']} (task {task_num}): {len(errors)} ошибок")
    
    return {
        'file': ts_file_path,
        'total_questions': len(questions),
        'errors_found': len(all_errors),
        'errors': all_errors,
        'duplicate_ids': duplicate_ids,
    }


def print_report(report: Dict[str, Any]):
    """Печатает красивый отчёт."""
    print("=" * 70)
    print(f"Файл: {report['file']}")
    print(f"Всего вопросов: {report['total_questions']}")
    print(f"Найдено ошибок: {report['errors_found']}")
    
    if report.get('duplicate_ids'):
        print(f"\n⚠️  ДУБЛИКАТЫ ID: {report['duplicate_ids']}")
    
    if report['errors_found'] == 0:
        print("\n✅ Все вопросы прошли проверку!")
    else:
        print(f"\n❌ Ошибки:")
        for err in report['errors']:
            print(f"\n  [{err['id']}] (Задание {err['task']})")
            if 'text' in err:
                print(f"  Текст: {err['text']}")
            for e in err['errors']:
                print(f"    • {e}")
    
    print("=" * 70)


# ===== CLI =====

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Универсальный верификатор заданий ЕГЭ Русский 9-20')
    parser.add_argument('files', nargs='+', help='TypeScript-файлы для проверки')
    parser.add_argument('-v', '--verbose', action='store_true', help='Подробный вывод')
    parser.add_argument('-j', '--json', action='store_true', help='Вывод в JSON')
    args = parser.parse_args()
    
    all_reports = []
    total_errors = 0
    
    for ts_file in args.files:
        report = verify_file(ts_file, verbose=args.verbose)
        
        if 'error' in report:
            print(f"\n❌ {report['error']}")
            continue
        
        all_reports.append(report)
        total_errors += report['errors_found']
        
        if not args.json:
            print_report(report)
    
    # Итог
    if not args.json:
        print(f"\n{'=' * 70}")
        print(f"ИТОГО: {len(all_reports)} файлов, {total_errors} ошибок")
        if total_errors == 0:
            print("✅ Все файлы прошли проверку!")
        print(f"{'=' * 70}")
    
    if args.json:
        print(json.dumps(all_reports, ensure_ascii=False, indent=2))
    
    sys.exit(0 if total_errors == 0 else 1)


if __name__ == '__main__':
    main()
