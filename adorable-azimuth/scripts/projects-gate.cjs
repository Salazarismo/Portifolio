// Projects Gate — valida a consistência dos case studies a partir dos DADOS
// (src/data/projects.ts), não do markup: campos obrigatórios, páginas pt/en,
// namespaces i18n e imagens locais existentes. Ver docs/modulos/projetos/.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const fullSource = fs.readFileSync(path.join(root, 'src', 'data', 'projects.ts'), 'utf8');

let failures = [];

// Analisa só o array de dados; a definição do tipo FeaturedProject fica de fora
const arrayStart = fullSource.indexOf('export const featuredProjects');
if (arrayStart === -1) {
  console.error('Projects Gate falhou: "export const featuredProjects" não encontrado em src/data/projects.ts');
  process.exit(1);
}
const source = fullSource.slice(arrayStart);

const slugs = [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

if (slugs.length === 0) {
  failures.push('nenhum projeto encontrado em src/data/projects.ts (gate vazio é suspeito)');
}

const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
for (const d of new Set(dup)) failures.push(`slug duplicado: ${d}`);

for (const slug of slugs) {
  if (!/^p\d+$/.test(slug)) failures.push(`slug fora do padrão p<n>: ${slug}`);

  for (const page of [
    path.join('src', 'pages', 'projects', `${slug}.astro`),
    path.join('src', 'pages', 'en', 'projects', `${slug}.astro`),
  ]) {
    if (!fs.existsSync(path.join(root, page))) failures.push(`página ausente para ${slug}: ${page.replace(/\\/g, '/')}`);
  }

  for (const locale of ['pt-br', 'en']) {
    const ns = path.join('src', 'i18n', locale, `project_${slug}.json`);
    if (!fs.existsSync(path.join(root, ns))) failures.push(`namespace i18n ausente para ${slug}: ${ns.replace(/\\/g, '/')}`);
  }

  if (!source.includes(`href: "/projects/${slug}"`)) {
    failures.push(`href não corresponde ao slug ${slug} (esperado "/projects/${slug}")`);
  }
}

// Cada bloco image deve ter src, alt não vazio e dimensões fixas (CLS = 0, M4)
const imageBlocks = [...source.matchAll(/image:\s*\{([\s\S]*?)\}/g)].map((m) => m[1]);
if (imageBlocks.length !== slugs.length) {
  failures.push(`esperado 1 bloco image por projeto (${slugs.length}), encontrado ${imageBlocks.length}`);
}
imageBlocks.forEach((blk, i) => {
  const label = slugs[i] || `#${i}`;
  if (!/width:\s*\d+/.test(blk)) failures.push(`image de ${label} sem width`);
  if (!/height:\s*\d+/.test(blk)) failures.push(`image de ${label} sem height`);
  if (!/alt:\s*"[^"]+"/.test(blk)) failures.push(`image de ${label} sem alt descritivo`);
  const src = blk.match(/src:\s*"([^"]+)"/)?.[1];
  if (!src) {
    failures.push(`image de ${label} sem src`);
  } else if (src.startsWith('/')) {
    if (!fs.existsSync(path.join(root, 'public', src))) failures.push(`imagem local inexistente para ${label}: public${src}`);
  }
});

// Métrica obrigatória e não vazia
const metrics = [...source.matchAll(/metric:\s*\{[^}]*value:\s*"([^"]*)"/g)].map((m) => m[1]);
if (metrics.length !== slugs.length) failures.push(`esperado 1 metric por projeto (${slugs.length}), encontrado ${metrics.length}`);
metrics.forEach((v, i) => {
  if (!v.trim()) failures.push(`metric.value vazio em ${slugs[i] || `#${i}`}`);
});

if (failures.length) {
  console.error('Projects Gate falhou:');
  failures.forEach((f) => console.error(' -', f));
  process.exit(1);
} else {
  console.log(`Projects Gate passou: ${slugs.length} projetos consistentes (dados, páginas, i18n, imagens)`);
}
