const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
let failures = [];

function checkFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/');

  if (!/^<!DOCTYPE html>/i.test(html)) failures.push(rel + ' missing doctype');
  if (!/<html[^>]*\slang=\"[^\"]+\"/i.test(html)) failures.push(rel + ' missing html lang');
  if (!/<meta[^>]*name=\"viewport\"/i.test(html)) failures.push(rel + ' missing viewport');
  if (!/<meta[^>]*name=\"description\"/i.test(html)) failures.push(rel + ' missing description');
  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(rel + ' missing title');
  if (!/<nav[\s>]/i.test(html)) failures.push(rel + ' missing nav');
  if (!/<main[\s>]/i.test(html)) failures.push(rel + ' missing main');
  if (!/<footer[\s>]/i.test(html)) failures.push(rel + ' missing footer');
  const h1s = html.match(/<h1[\s>][\s\S]*?<\/h1>/gi) || [];
  if (h1s.length !== 1) failures.push(rel + ' h1 count != 1');
}

function run() {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && full.endsWith('.html')) files.push(full);
    }
  }
  walk(dist);
  if (files.length === 0) {
    failures.push('nenhum .html encontrado em dist/ — gate sem amostra (build prerender ausente?)');
  }
  files.forEach(checkFile);
}

run();

if (failures.length) {
  console.error('Semantics Gate falhou:');
  failures.forEach((f) => console.error(' -', f));
  process.exit(1);
} else {
  console.log('Semantics Gate passou: estrutura semântica base válida');
}

