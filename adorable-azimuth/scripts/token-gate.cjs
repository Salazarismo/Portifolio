const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const includeDirs = ['src'];
const excludePaths = [
  path.join('src', 'styles', 'tokens.css'),
  path.join('src', 'styles', 'design-tokens.json'),
  'node_modules',
  '.vercel',
  '.vscode',
];

const excludeNorm = excludePaths.map((p) => p.replace(/\\/g, '/'));

const patterns = [
  /(?<!sizes="[^"]*)(?<!srcSet="[^"]*)(?<!@media\s*\([^)]*)(?<!radial-gradient[^)]*)(?<!linear-gradient[^)]*)\b\d+(?:\.\d+)?px\b/i,
  /(?<!sizes="[^"]*)(?<!srcSet="[^"]*)(?<!@media\s*\([^)]*)\b\d+(?:\.\d+)?rem\b/i,
  /(?<![A-Za-z0-9_-])(?<!radial-gradient[^)]*)(?<!linear-gradient[^)]*)#[0-9a-f]{3,8}\b/i,
  /hsl\(/i,
];

let violations = [];

function shouldExclude(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  return excludeNorm.some((ex) => rel === ex || rel.startsWith(ex + '/'));
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (shouldExclude(full)) continue;
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) checkFile(full);
  }
}

function checkFile(file) {
  if (path.basename(file) === 'tokens.css') return;
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.replace(/<code[\s\S]*?<\/code>/gi, '').split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const re of patterns) {
      if (re.test(line)) {
        violations.push(`${rel}:${i + 1}: ${line.trim()}`);
        break;
      }
    }
  });
}

includeDirs.forEach((d) => walk(path.join(root, d)));

if (violations.length) {
  console.error('Token Gate falhou. Valores crus detectados fora de styles/tokens.css:');
  for (const v of violations) console.error(' -', v);
  process.exit(1);
} else {
  console.log('Token Gate passou: nenhum valor cru encontrado fora de styles/tokens.css');
}
