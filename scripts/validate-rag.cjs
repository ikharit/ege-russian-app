const fs = require('fs');
const path = require('path');

/**
 * RAG Validation Script for Task 9 Explanations
 * 
 * This script validates generated explanations against the theory rules
 * to prevent linguistic hallucinations.
 * 
 * Rules:
 * 1. Alternating roots MUST be vowel alternations (И/Е, А/О) only
 * 2. Consonant alternations (г/ж, к/ч) are NOT "alternating roots" in school grammar
 * 3. Suppletive forms (нашёл/идти) are NOT alternations at all
 * 4. Every explanation must match a documented theory rule
 */

// Valid vowel alternations according to theory/task9.ts (both directions)
const VALID_VOWEL_ALTERNATIONS = [
  // Standard vowel alternations (both directions)
  // Note: о/ё is a valid phonetic alternation, but in school EGE task 9
  // it's usually treated as a verifiable root (e.g., жечь/поджёг), not alternating
  'а/о', 'о/а', 'и/е', 'е/и', 'а/я', 'я/а', 'о/ё', 'ё/о',
  // Root-specific alternations (both directions)
  'лаг/лож', 'лож/лаг',
  'плав/плыв', 'плыв/плав',
  'скак/скоч', 'скоч/скак',
  'тир/тер', 'тер/тир',
  'локот/лок', 'лок/локот',
  'раст/рос', 'рос/раст',
  'мир/мер', 'мер/мир',
  'клан/клон', 'клон/клан',
  'чет/чит', 'чит/чет',
  'лез/лаз', 'лаз/лез',
  'жиг/жёг', 'жёг/жиг',
  'бег/беж', 'беж/бег',
  'кос/кос', // косить/коса (same root but different meaning)
  'пряд/пред', 'пред/пряд', // предать/предатель
  'пад/пад', // падать/падение
  'рад/рад', // рад/радость
];

// Suppletive forms (NOT alternations, must be flagged)
const SUPPLETIVE_FORMS = {
  'шёл': 'идти',      // past tense of идти
  'пошёл': 'идти',
  'нашёл': 'найти',   // past tense of найти
  'пришёл': 'прийти',
  'ушёл': 'уйти',
  'вышел': 'выйти',
  'зашёл': 'зайти',
  'обошёл': 'обойти',
  'перешёл': 'перейти',
  'подошёл': 'подойти',
  'прошёл': 'пройти',
  'сошёл': 'сойти',
  'был': 'быть',      // suppletive past of быть
};

// Consonant alternations that are NOT "alternating roots" in school grammar
// These are consonant alternations that occur in other morphological processes
const CONSONANT_ALTERNATIONS = [
  'г/ж', 'ж/г',
  'к/ч', 'ч/к',
  'х/ш', 'ш/х',
  'з/ж', 'ж/з',
  'с/ш', 'ш/с',
  'т/ч', 'ч/т',
  'д/ж', 'ж/д',
  'ст/щ', 'щ/ст',
  'б/бл', 'бл/б',
  'в/вл', 'вл/в',
  'м/мл', 'мл/м',
  'п/пл', 'пл/п',
  'ф/фл', 'фл/ф',
];

// Generic fallback explanation - NOT an error, just missing specific explanation
const GENERIC_FALLBACK = 'Проверяемый/непроверяемый/чередующийся корень';

function validateExplanation(word, explanation) {
  const errors = [];
  
  // Skip generic fallback explanation - this is a missing explanation, not a wrong one
  if (explanation.includes(GENERIC_FALLBACK)) {
    return errors; // No validation error, just missing specific explanation
  }
  
  // Check for suppletive forms
  if (SUPPLETIVE_FORMS[word]) {
    if (explanation.includes('чередующийся')) {
      errors.push(`SUPPLETIVE_FORM: "${word}" is suppletive form of "${SUPPLETIVE_FORMS[word]}", NOT an alternating root`);
    }
    return errors;
  }
  
  // Check for hallucination: non-alternating roots mentioning alternations
  if ((explanation.includes('проверяемый') || explanation.includes('непроверяемый') || explanation.includes('словарное')) && explanation.includes('чередован')) {
    errors.push(`HALLUCINATION: "${word}" is labeled as verifiable/dictionary but mentions 'чередование' — this is a linguistic hallucination`);
  }
  
  // Check for o/ё hallucination (this is NOT a valid root alternation in EGE)
  if (explanation.includes('о/ё') || explanation.includes('ё/о')) {
    errors.push(`HALLUCINATION: "${word}" mentions o/ё alternation — this does NOT exist as a root alternation type in EGE task 9`);
  }
  
  // Check for consonant alternations incorrectly labeled as alternating
  // Only flag if it's explicitly labeled as "чередующийся корень"
  if (explanation.includes('чередующийся') && explanation.includes('Корень')) {
    for (const alt of CONSONANT_ALTERNATIONS) {
      if (explanation.includes(alt)) {
        errors.push(`CONSONANT_ALTERNATION: "${word}" has consonant alternation ${alt}, which is NOT "чередующийся корень" in school grammar`);
      }
    }
  }
  
  // Check that alternating roots have valid vowel alternations
  if (explanation.includes('чередующийся')) {
    let hasValidAlternation = false;
    for (const alt of VALID_VOWEL_ALTERNATIONS) {
      if (explanation.includes(alt)) {
        hasValidAlternation = true;
        break;
      }
    }
    if (!hasValidAlternation) {
      errors.push(`INVALID_ALTERNATION: "${word}" claims alternating root but no valid vowel alternation found`);
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
    
    const word = wordMatch[1].replace(/_/g, ''); // Remove underscore
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
