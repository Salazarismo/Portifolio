const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..', 'dist', 'client', '_astro');
const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
let total = 0;
for (const f of files) {
  if (f.endsWith('.js')) {
    const stat = fs.statSync(path.join(dir, f));
    total += stat.size;
  }
}
const kb = total / 1024;
const budgetKB = 150; // orçamento total de JS do cliente
if (kb > budgetKB) {
  console.error(`JS Budget falhou: ${kb.toFixed(2)}KB > ${budgetKB}KB`);
  process.exit(1);
} else {
  console.log(`JS Budget passou: ${kb.toFixed(2)}KB ≤ ${budgetKB}KB`);
}

