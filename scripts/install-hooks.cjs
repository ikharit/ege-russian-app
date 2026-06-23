#!/usr/bin/env node
/**
 * install-hooks.js
 * Кроссплатформенная установка Git hooks из scripts/git-hooks/ в .git/hooks/
 *
 * Запуск: node scripts/install-hooks.js
 * Или: npm run install:hooks
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(PROJECT_ROOT, 'scripts', 'git-hooks');
const TARGET_DIR = path.join(PROJECT_ROOT, '.git', 'hooks');

function main() {
  console.log('🔧 Установка Git hooks...\n');

  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`❌ Директория не найдена: ${TARGET_DIR}`);
    console.error('   Убедитесь, что это Git-репозиторий (git init).');
    process.exit(1);
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Директория не найдена: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const hooks = fs.readdirSync(SOURCE_DIR);
  let installed = 0;

  for (const hook of hooks) {
    const src = path.join(SOURCE_DIR, hook);
    const dst = path.join(TARGET_DIR, hook);

    if (fs.statSync(src).isDirectory()) continue;

    fs.copyFileSync(src, dst);

    // Делаем исполняемым (chmod 755) — на Windows это не критично,
    // но на macOS/Linux обязательно
    try {
      fs.chmodSync(dst, 0o755);
    } catch {
      // Windows может не поддерживать chmod, игнорируем
    }

    console.log(`   ✅ ${hook}`);
    installed++;
  }

  if (installed === 0) {
    console.log('   ⚠️  Hooks не найдены в scripts/git-hooks/');
  } else {
    console.log(`\n📦 Установлено hooks: ${installed}`);
    console.log('   Теперь перед каждым коммитом будет запускаться валидация заданий ЕГЭ №9.\n');
  }
}

main();
