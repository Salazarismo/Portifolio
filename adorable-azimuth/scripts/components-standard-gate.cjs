const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');
let failures = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && full.endsWith('.html')) checkHtml(full);
  }
}

let htmlCount = 0;

function checkHtml(file) {
  htmlCount++;
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/');
  const sections = [...html.matchAll(/<section[^>]*data-section[^>]*>/gi)];
  for (const s of sections) {
    const tag = s[0];
    if (!/data-section-type="[^"]+"/i.test(tag)) {
      failures.push(rel + ' section missing data-section-type');
    }
  }
  const ctacontrols = [...html.matchAll(/<(?:a|button)[^>]*data-cta[^>]*>/gi)];
  for (const c of ctacontrols) {
    const tag = c[0];
    if (!/data-variant="[^"]+"/i.test(tag)) {
      failures.push(rel + ' CTA control missing data-variant');
    }
  }
}

walk(dist);

if (htmlCount === 0) {
  failures.push('nenhum .html encontrado em dist/ — gate sem amostra (build prerender ausente?)');
}

if (failures.length) {
  console.error('Components Standard Gate falhou:');
  failures.forEach((f) => console.error(' -', f));
  process.exit(1);
} else {
  console.log('Components Standard Gate passou: variantes e tipos presentes');
}
