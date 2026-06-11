// Docs Gate — valida a estrutura da documentação viva (ver DOCUMENTACAO.md na raiz).
// Checa: INDEX.md existe; toda pasta de módulo tem REGRA.md e está no índice;
// docs de módulo têm rodapé "Última revisão"; links markdown relativos resolvem.

const fs = require('fs');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(appRoot, '..');
const modulosDir = path.join(appRoot, 'docs', 'modulos');

const foundationFiles = ['AGENTS.md', 'ARQUITETURA.md', 'GLOSSARIO.md', 'DOCUMENTACAO.md']
  .map((f) => path.join(repoRoot, f));

let violations = [];

function rel(file) {
  return path.relative(repoRoot, file).replace(/\\/g, '/');
}

// 1. Fundação presente
for (const f of foundationFiles) {
  if (!fs.existsSync(f)) violations.push(`fundação ausente: ${rel(f)}`);
}

// 2. INDEX.md e pastas de módulo
const indexPath = path.join(modulosDir, 'INDEX.md');
if (!fs.existsSync(indexPath)) {
  violations.push(`índice ausente: ${rel(indexPath)}`);
}
const indexContent = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';

const moduleDirs = fs.existsSync(modulosDir)
  ? fs.readdirSync(modulosDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  : [];

for (const mod of moduleDirs) {
  const regra = path.join(modulosDir, mod, 'REGRA.md');
  if (!fs.existsSync(regra)) violations.push(`módulo sem REGRA.md: docs/modulos/${mod}/`);
  if (indexContent && !indexContent.includes(`${mod}/REGRA.md`)) {
    violations.push(`módulo fora do INDEX.md: docs/modulos/${mod}/`);
  }
}

// 3. Rodapé "Última revisão" e links relativos
function collectDocs() {
  const docs = [...foundationFiles.filter((f) => fs.existsSync(f))];
  if (fs.existsSync(indexPath)) docs.push(indexPath);
  for (const mod of moduleDirs) {
    const dir = path.join(modulosDir, mod);
    for (const entry of fs.readdirSync(dir)) {
      if (entry.endsWith('.md')) docs.push(path.join(dir, entry));
    }
  }
  return docs;
}

const needsFooter = (file) =>
  file.startsWith(modulosDir) || path.basename(file) === 'ARQUITETURA.md';

const LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;

for (const file of collectDocs()) {
  const content = fs.readFileSync(file, 'utf8');

  if (needsFooter(file) && !content.includes('Última revisão:')) {
    violations.push(`sem rodapé "Última revisão": ${rel(file)}`);
  }

  for (const match of content.matchAll(LINK_RE)) {
    const target = match[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const targetPath = path.resolve(path.dirname(file), target.split('#')[0]);
    if (!fs.existsSync(targetPath)) {
      violations.push(`link quebrado em ${rel(file)}: ${target}`);
    }
  }
}

if (violations.length) {
  console.error('Docs Gate falhou:');
  for (const v of violations) console.error(' -', v);
  process.exit(1);
} else {
  console.log(`Docs Gate passou: ${moduleDirs.length} módulos, fundação e links OK`);
}
