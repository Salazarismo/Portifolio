# i18n — API

Superfície pública em `src/i18n/index.ts`.

## Helpers

```ts
type Locale = "pt-br" | "en";
type Messages = Record<string, string>;

loadMessages(locale: Locale, namespace: string): Messages
// Carrega src/i18n/{locale}/{namespace}.json (via import.meta.glob, eager).
// Lança erro listando os arquivos disponíveis se o namespace não existir.

createT(messages: Messages, opts: { locale: Locale; namespace: string }): (key: string) => string
// Retorna t(key). Chave ausente: throw em dev, marcador [[locale:ns:key]] em prod.
```

Uso típico em página/componente `.astro`:

```astro
---
import { loadMessages, createT } from "@/i18n";
const messages = loadMessages("pt-br", "home");
const t = createT(messages, { locale: "pt-br", namespace: "home" });
---
<h1>{t("eyebrow")}</h1>
```

## Estrutura de dados

- JSON plano `string → string` (sem aninhamento, sem interpolação).
- Namespaces atuais (sempre em par pt-br/en): `common`, `home`, `cards`,
  `projects`, `project_p3`, `project_p5`, `project_p7`.

---
Última revisão: 2026-06-11 — 588ffd1
