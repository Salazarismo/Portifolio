# i18n — FLUXOS

## Adicionar uma chave nova

1. Adicione a chave em `src/i18n/pt-br/<ns>.json` **e** `src/i18n/en/<ns>.json`.
2. Use via `t("chave")` no componente/página.
3. Valide: `pnpm check:i18n` (paridade) e, se a página for `/en`, o texto em
   inglês não pode conter português (`node scripts/check-en-no-pt.mjs`).

## Adicionar um namespace novo

1. Crie `src/i18n/pt-br/<ns>.json` e `src/i18n/en/<ns>.json` com as mesmas chaves.
2. Carregue com `loadMessages(locale, "<ns>")` — o glob pega o arquivo
   automaticamente, sem registro manual.
3. `pnpm check:i18n`.

## Adicionar uma página nova (bilíngue)

1. Crie `src/pages/<rota>.astro` (pt-br) e o espelho `src/pages/en/<rota>.astro`.
2. Cada versão carrega o mesmo namespace com seu locale.
3. Confirme que o toggle de idioma do header leva a rotas equivalentes
   (testado em `tests/i18n.spec.ts`).

---
Última revisão: 2026-06-11 — 588ffd1
