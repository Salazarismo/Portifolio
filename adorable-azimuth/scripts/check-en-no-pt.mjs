import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const enRoot = path.join(projectRoot, "src", "pages", "en");

const PT_WORDS = [
  "portaria",
  "custo",
  "tempo",
  "projetos",
  "contato",
  "latência",
  "disponível",
  "evidência",
  "risco",
  "qualidade"
];

async function walk(dir, files = []) {
  const entries = await readdir(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) await walk(full, files);
    else if (/\.(astro|tsx|ts|md|css|json)$/i.test(entry)) files.push(full);
  }
  return files;
}

async function main() {
  let hasErrors = false;
  const files = await walk(enRoot);
  for (const file of files) {
    const content = await readFile(file, "utf8");
    for (const w of PT_WORDS) {
      const re = new RegExp(`\\b${w}\\b`, "i");
      if (re.test(content)) {
        hasErrors = true;
        console.error(`i18n/en gate: PT word "${w}" found in ${path.relative(projectRoot, file)}`);
      }
    }
  }
  if (hasErrors) process.exit(1);
  console.log("i18n/en gate: OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
