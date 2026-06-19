import re
import json
import sys
from pathlib import Path

"""
Скрипт верификации задания 15 (Н/НН).

Использование:
    python verify_n_nn.py <path_to_dooshin15.ts> [dictionary.json]

Скрипт:
1. Извлекает слова из TypeScript-файла задания 15
2. Сравнивает с локальным словарём (если есть)
3. Генерирует отчёт о несоответствиях
4. Создаёт/обновляет JSON-словарь с правильными ответами

Для проверки через интернет запустите сначала:
    python verify_n_nn.py <path_to_dooshin15.ts> --generate-check-list
    → получите список слов для ручной/автоматической проверки
"""

def extract_words_from_ts(filepath):
    """Извлекает слова и правильные ответы из TypeScript-файла задания 15."""
    content = Path(filepath).read_text(encoding='utf-8')
    
    # Pattern: text: 'Впишите количество букв Н: слово (N)'
    # Учитываем контекст в скобках: "верчёный парень (1)" → слово "верчёный", ответ 1
    pattern = r"text:\s*'Впишите количество букв Н:\s*([^']+?)\s*\((\d+)\)'"
    
    words = []
    for match in re.finditer(pattern, content):
        word_text = match.group(1).strip()
        expected = int(match.group(2))
        
        # Очищаем от контекста: берём первое слово
        # Но для слов типа "бесприданница" — это одно слово
        # Для "верчёный парень" — берём "верчёный"
        word = word_text.split()[0] if ' ' in word_text else word_text
        
        # Убираем окончания, если есть (например, "прощёное" → "прощёный" для проверки)
        # Но для подсчёта букв Н используем именно то слово, что в тексте
        words.append({
            'word': word,
            'expected': expected,
            'full_text': word_text,
            'clean_word': word.lower().replace('ё', 'е')
        })
    
    return words

def count_n_in_word(word):
    """Подсчитывает количество букв 'н' в слове (включая 'Н')."""
    return word.lower().count('н')

def load_dictionary(dict_path):
    """Загружает словарь правильных ответов."""
    if Path(dict_path).exists():
        with open(dict_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def verify_words(words, dictionary=None):
    """Проверяет слова через словарь и подсчёт букв."""
    results = []
    
    # Правила, которые можно проверить автоматически
    # 1. Слова на -анный/-янный (от существительных) → обычно 2 Н
    # 2. Слова на -енный (причастия сов. вида) → 2 Н
    # 3. Слова на -еный (причастия несов. вида) → 1 Н
    
    for item in words:
        word = item['word']
        expected = item['expected']
        actual_count = count_n_in_word(word)
        
        # Проверка через словарь
        dict_entry = dictionary.get(word.lower()) if dictionary else None
        dict_answer = dict_entry.get('n_count') if dict_entry else None
        
        # Эвристика: слова на -анный/-янный от существительных → 2 Н
        # Но есть исключения: железный (1 Н), ветреный (1 Н)
        heuristic = None
        if word.lower().endswith('анный') or word.lower().endswith('янный'):
            heuristic = 2
        elif word.lower().endswith('енный'):
            heuristic = 2
        elif word.lower().endswith('еный'):
            heuristic = 1
        elif word.lower().endswith('нный'):
            heuristic = 2
        elif word.lower().endswith('ный'):
            heuristic = 1  # может быть и 2, нужна проверка
        
        # Флаг проблемы
        is_problem = False
        problems = []
        
        if actual_count != expected:
            problems.append(f"В TypeScript указано {expected}, но в слове '{word}' {actual_count} букв 'н'")
            is_problem = True
        
        if dict_answer and dict_answer != expected:
            problems.append(f"В словаре указано {dict_answer}, в TypeScript — {expected}")
            is_problem = True
        
        if heuristic and heuristic != expected:
            problems.append(f"Эвристика предлагает {heuristic}, в TypeScript — {expected}")
            is_problem = True
        
        results.append({
            'word': word,
            'expected': expected,
            'actual': actual_count,
            'dictionary': dict_answer,
            'heuristic': heuristic,
            'is_problem': is_problem,
            'problems': problems
        })
    
    return results

def generate_report(results, output_path='verify_report.json'):
    """Генерирует JSON-отчёт."""
    problems = [r for r in results if r['is_problem']]
    
    report = {
        'total': len(results),
        'problems_count': len(problems),
        'problems': problems,
        'all_words': results
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"ОТЧЁТ ВЕРИФИКАЦИИ")
    print(f"{'='*60}")
    print(f"Всего слов: {len(results)}")
    print(f"Проблем: {len(problems)}")
    
    if problems:
        print(f"\nСлова с проблемами:")
        for p in problems:
            print(f"  ❌ {p['word']}: expected={p['expected']}, actual={p['actual']}")
            for prob in p['problems']:
                print(f"      → {prob}")
    else:
        print(f"\n✅ Все слова проверены, проблем не найдено!")
    
    print(f"\nПолный отчёт: {output_path}")
    return report

def generate_check_list(words, output_path='check_list.txt'):
    """Генерирует список слов для ручной проверки через интернет."""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("# Список слов для проверки правописания Н/НН\n\n")
        f.write("Проверьте каждое слово на gramota.ru или в справочнике:\n\n")
        
        for item in words:
            word = item['word']
            expected = item['expected']
            f.write(f"- {word} (ожидается {expected} Н)\n")
    
    print(f"\nСписок для проверки: {output_path}")
    print(f"Проверьте слова на https://gramota.ru или через поиск «{word} правописание н нн»")

def main():
    if len(sys.argv) < 2:
        print("Usage: python verify_n_nn.py <path_to_dooshin15.ts> [dictionary.json]")
        print("       python verify_n_nn.py <path_to_dooshin15.ts> --generate-check-list")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    if not Path(filepath).exists():
        print(f"❌ Файл не найден: {filepath}")
        sys.exit(1)
    
    words = extract_words_from_ts(filepath)
    print(f"Извлечено {len(words)} слов из {filepath}")
    
    if '--generate-check-list' in sys.argv:
        generate_check_list(words)
        sys.exit(0)
    
    dict_path = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else 'n_nn_dictionary.json'
    dictionary = load_dictionary(dict_path)
    
    if dictionary:
        print(f"Загружен словарь: {dict_path} ({len(dictionary)} записей)")
    
    results = verify_words(words, dictionary)
    report = generate_report(results)
    
    # Если нашли проблемы — выходим с кодом ошибки
    if report['problems_count'] > 0:
        sys.exit(1)

if __name__ == '__main__':
    main()
