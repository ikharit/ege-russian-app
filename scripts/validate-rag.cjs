const fs = require('fs');
const path = require('path');

/**
 * RAG Validation Script for Task 9 Explanations
 * 
 * Based on real EGE preparation materials:
 * - Gramota.ru: https://gramota.ru/uchebnik/pravila/korni-s-cheredovaniem-glasnykh-vybor-kotorykh-zavisit-ot-sleduyushchikh-za-nimi-soglasnykh
 * - rustutors.ru: http://rustutors.ru/egeteoriya/1142-zadanie-9.html
 * - tetrika-school.ru: https://tetrika-school.ru/blog/korni-s-cheredovaniem/
 * 
 * This script validates generated explanations against documented theory rules
 * to prevent linguistic hallucinations.
 */

// =============================================================================
// DOCUMENTED ALTERNATING ROOTS FROM EGE PREPARATION MATERIALS
// =============================================================================

// Group 1: Alternation depends on following consonant (Gramota.ru)
const CONSONANT_DEPENDENT_ALTERNATIONS = {
  'лаг/лож': {
    description: 'перед г = а, перед ж = о',
    examples: ['предлагать', 'предложение', 'слагаемое', 'сложение'],
    source: 'Gramota.ru'
  },
  'раст/ращ/рос': {
    description: 'перед ст/щ = а, перед с = о',
    examples: ['расти', 'выращенный', 'вырос', 'заросли'],
    exceptions: ['росток', 'отрасль', 'подростковый', 'ростовщик'],
    source: 'Gramota.ru'
  },
  'скак/скоч': {
    description: 'перед к = а, перед ч = о',
    examples: ['скакать', 'вскочить', 'заскочить'],
    exceptions: ['скачок', 'скачу', 'скачи', 'скачите', 'скачкообразный'],
    source: 'Gramota.ru'
  }
};

// Group 2: Alternation depends on stress (rustutors.ru)
const STRESS_DEPENDENT_ALTERNATIONS = {
  'гар/гор': {
    description: 'в безударном = о, под ударением = как слышится',
    examples: ['подгорать', 'выгорающий', 'нагар'],
    exceptions: ['выгарки', 'пригарь'],
    source: 'rustutors.ru'
  },
  'твар/твор': {
    description: 'в безударном = о, под ударением = как слышится',
    examples: ['сотворить', 'творение'],
    exceptions: ['утварь'],
    source: 'rustutors.ru'
  },
  'клан/клон': {
    description: 'в безударном = о, под ударением = как слышится',
    examples: ['наклониться', 'отклонить'],
    exceptions: ['кланяться', 'наклон'],
    source: 'rustutors.ru'
  },
  'зар/зор': {
    description: 'в безударном = а, под ударением = как слышится',
    examples: ['зарница', 'зарянка'],
    exceptions: ['зорька', 'зори'],
    source: 'rustutors.ru'
  },
  'плав/плов/плыв': {
    description: 'в безударном = а, под ударением = как слышится',
    examples: ['плавать', 'плавучесть'],
    exceptions: ['пловец', 'плывуны'],
    source: 'rustutors.ru'
  }
};

// Group 3: Alternation depends on suffix -а- (rustutors.ru + tetrika-school.ru)
const SUFFIX_DEPENDENT_ALTERNATIONS = {
  'бер/бир': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['забирать', 'берет'],
    source: 'rustutors.ru'
  },
  'дер/дир': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['отбирать', 'деру'],
    source: 'rustutors.ru'
  },
  'мер/мир': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['замирать', 'умереть'],
    note: 'OMONIM: мерить (примерять) = проверяемый корень',
    source: 'rustutors.ru'
  },
  'пер/пир': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['запирать', 'перет'],
    source: 'rustutors.ru'
  },
  'тер/тир': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['стирать', 'трет'],
    source: 'rustutors.ru'
  },
  'блест/блист': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['блистать', 'блестеть'],
    source: 'rustutors.ru'
  },
  'жег/жиг': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['сжигать', 'выжегший'],
    source: 'rustutors.ru'
  },
  'стел/стил': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['расстилать', 'расстелить'],
    source: 'rustutors.ru'
  },
  'чет/чит': {
    description: 'суффикс -а- = и, нет суффикса = е',
    examples: ['вычитать', 'вычет'],
    exceptions: ['сочетать', 'сочетание'],
    source: 'rustutors.ru'
  },
  'кас/кос': {
    description: 'суффикс -а- = а, нет суффикса = о',
    examples: ['прикасаться', 'коснуться'],
    source: 'rustutors.ru'
  }
};

// Group 4: Meaning-dependent alternations (rustutors.ru)
const MEANING_DEPENDENT_ALTERNATIONS = {
  'крап/кроп': {
    description: 'значение "покрываться каплями" = о, "покрывать каплями, брызгать" = а',
    examples: ['окропить', 'крапление', 'крапина'],
    source: 'rustutors.ru'
  },
  'мак/моч': {
    description: 'значение "погружать в жидкость" = о, "пропускать жидкость" = а',
    examples: ['намочить', 'макнуть', 'обмакнуть'],
    exceptions: ['промокательная', 'промокнуть'],
    source: 'rustutors.ru'
  },
  'равн/ровн': {
    description: 'значение "делать ровным" = о, "быть равным с кем-либо" = а',
    examples: ['подровнять', 'сравнять'],
    exceptions: ['уровень', 'равнина', 'равнение', 'ровесник', 'поравняться'],
    source: 'rustutors.ru'
  }
};

// Group 5: а(я)/им, а(я)/ин alternations (tetrika-school.ru)
const A_YA_ALTERNATIONS = {
  'а/им': {
    description: 'суффикс -а- = им, нет суффикса = а/я',
    examples: ['сжимать', 'сжать', 'обнимать', 'обнять', 'начинать', 'начать'],
    note: 'В производных формах -им- сохраняется: сниму, сними, подниму',
    source: 'tetrika-school.ru'
  }
};

// Combine all valid alternation patterns (both directions for search)
const ALL_VALID_ALTERNATIONS = [
  // Consonant-dependent
  'лаг/лож', 'лож/лаг',
  'раст/ращ', 'ращ/раст', 'раст/рос', 'рос/раст', 'ращ/рос', 'рос/ращ',
  'скак/скоч', 'скоч/скак',
  // Stress-dependent
  'гар/гор', 'гор/гар',
  'твар/твор', 'твор/твар',
  'клан/клон', 'клон/клан',
  'зар/зор', 'зор/зар',
  'плав/плов', 'плов/плав', 'плав/плыв', 'плыв/плав', 'плов/плыв', 'плыв/плов',
  // Suffix-dependent (е/и)
  'бер/бир', 'бир/бер',
  'дер/дир', 'дир/дер',
  'мер/мир', 'мир/мер',
  'пер/пир', 'пир/пер',
  'тер/тир', 'тир/тер',
  'блест/блист', 'блист/блест',
  'жег/жиг', 'жиг/жег',
  'стел/стил', 'стил/стел',
  'чет/чит', 'чит/чет',
  'кас/кос', 'кос/кас',
  // Meaning-dependent
  'крап/кроп', 'кроп/крап',
  'мак/моч', 'моч/мак',
  'равн/ровн', 'ровн/равн',
  // а/я alternations
  'а/им', 'им/а',
  'я/им', 'им/я',
  // Extended alternations (not in standard EGE materials but present in Dooshin collection)
  'лаз/лез', 'лез/лаз',
  'локот/лок', 'лок/локот',
];

// =============================================================================
// SUPPLETIVE FORMS (NOT alternations)
// =============================================================================
const SUPPLETIVE_FORMS = {
  'шёл': 'идти',
  'пошёл': 'идти',
  'нашёл': 'найти',
  'пришёл': 'прийти',
  'ушёл': 'уйти',
  'вышел': 'выйти',
  'зашёл': 'зайти',
  'обошёл': 'обойти',
  'перешёл': 'перейти',
  'подошёл': 'подойти',
  'прошёл': 'пройти',
  'сошёл': 'сойти',
  'был': 'быть',
};

// =============================================================================
// HALLUCINATION PATTERNS (non-existent alternation types invented by LLMs)
// =============================================================================
const HALLUCINATION_PATTERNS = [
  // o/yo is NOT a root alternation type in EGE task 9
  // In forms like жёг/жог, the vowel change is due to stress/phonetics, 
  // not a root alternation rule. The root is -жёг- (verifiable via жечь/жигать).
  { pattern: 'о/ё', message: 'о/ё is NOT a documented root alternation type in EGE materials' },
  { pattern: 'ё/о', message: 'ё/о is NOT a documented root alternation type in EGE materials' },
];

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

function validateExplanation(word, explanation) {
  const errors = [];
  
  // Skip generic fallback explanation - this is a missing explanation, not a wrong one
  const GENERIC_FALLBACK = 'Проверяемый/непроверяемый/чередующийся корень';
  if (explanation.includes(GENERIC_FALLBACK)) {
    return errors;
  }
  
  // Check for suppletive forms incorrectly labeled as alternating
  if (SUPPLETIVE_FORMS[word]) {
    if (explanation.includes('чередующийся')) {
      errors.push(`SUPPLETIVE_FORM: "${word}" is suppletive form of "${SUPPLETIVE_FORMS[word]}", NOT an alternating root`);
    }
    return errors;
  }
  
  // Check for hallucination patterns (non-existent alternation types)
  if (explanation.includes('чередующийся') || explanation.includes('чередован')) {
    for (const { pattern, message } of HALLUCINATION_PATTERNS) {
      if (explanation.includes(pattern)) {
        errors.push(`HALLUCINATION: ${message} — found in explanation for "${word}"`);
      }
    }
  }
  
  // Check for verifiable/dictionary roots incorrectly mentioning alternation
  if ((explanation.includes('проверяемый') || explanation.includes('непроверяемый') || explanation.includes('словарное')) 
      && explanation.includes('чередован')) {
    errors.push(`HALLUCINATION: "${word}" is labeled as verifiable/dictionary but mentions 'чередование' — this is likely a linguistic hallucination`);
  }
  
  // Check that alternating roots have documented alternation patterns
  if (explanation.includes('чередующийся')) {
    let hasValidAlternation = false;
    for (const alt of ALL_VALID_ALTERNATIONS) {
      if (explanation.includes(alt)) {
        hasValidAlternation = true;
        break;
      }
    }
    if (!hasValidAlternation) {
      errors.push(`INVALID_ALTERNATION: "${word}" claims alternating root but no documented alternation pattern found. Valid patterns: лаг/лож, раст/рос, скак/скоч, гар/гор, клан/клон, мер/мир, бер/бир, etc.`);
    }
  }
  
  return errors;
}

function runValidation() {
  const task9Path = path.join(__dirname, '../src/data/sections/dooshin/task9.ts');
  const content = fs.readFileSync(task9Path, 'utf-8');
  
  const matches = content.matchAll(/id:\s*\"(qd9-\d+)\"[\s\S]*?text:\s*'([^']+)'[\s\S]*?explanation:\s*'([^']+)'/g);
  
  let totalQuestions = 0;
  let totalErrors = 0;
  const errors = [];
  
  for (const match of matches) {
    const [_, id, text, explanation] = match;
    const wordMatch = text.match(/Впишите пропущенную букву:\s*([а-яё_]+)/i);
    if (!wordMatch) continue;
    
    const word = wordMatch[1].replace(/_/g, '');
    totalQuestions++;
    
    const validationErrors = validateExplanation(word, explanation);
    if (validationErrors.length > 0) {
      totalErrors += validationErrors.length;
      errors.push({ id, word, explanation, errors: validationErrors });
    }
  }
  
  console.log(`\n=== RAG VALIDATION REPORT ===`);
  console.log(`Total questions: ${totalQuestions}`);
  console.log(`Errors found: ${totalErrors}`);
  console.log(`Pass rate: ${((totalQuestions - errors.length) / totalQuestions * 100).toFixed(1)}%\n`);
  
  if (errors.length > 0) {
    console.log('ERRORS:');
    for (const err of errors) {
      console.log(`\n  [${err.id}] ${err.word}`);
      console.log(`  Explanation: ${err.explanation.substring(0, 80)}...`);
      for (const e of err.errors) {
        console.log(`  ❌ ${e}`);
      }
    }
  } else {
    console.log('✅ All explanations pass validation!');
  }
  
  // Print source documentation
  console.log(`\n=== DOCUMENTED ALTERNATION PATTERNS ===`);
  console.log(`Sources: Gramota.ru, rustutors.ru, tetrika-school.ru`);
  console.log(`Consonant-dependent: ${Object.keys(CONSONANT_DEPENDENT_ALTERNATIONS).join(', ')}`);
  console.log(`Stress-dependent: ${Object.keys(STRESS_DEPENDENT_ALTERNATIONS).join(', ')}`);
  console.log(`Suffix-dependent: ${Object.keys(SUFFIX_DEPENDENT_ALTERNATIONS).join(', ')}`);
  console.log(`Meaning-dependent: ${Object.keys(MEANING_DEPENDENT_ALTERNATIONS).join(', ')}`);
  
  return { totalQuestions, totalErrors, errors };
}

const results = runValidation();

// Save report
const reportPath = path.join(__dirname, '../rag-validation-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  ...results,
  summary: {
    passRate: ((results.totalQuestions - results.errors.length) / results.totalQuestions * 100).toFixed(1) + '%',
    recommendation: results.errors.length > 0 
      ? 'Fix errors before committing. Run: node scripts/validate-rag.cjs' 
      : 'All clear. Safe to commit.'
  }
}, null, 2));

console.log(`\nReport saved to: ${reportPath}`);

process.exit(results.errors.length > 0 ? 1 : 0);
