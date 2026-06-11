# Movido

O conteúdo deste documento (M2 — Islands Hygiene) foi absorvido pela
documentação viva:

- Visão macro e decisões M2/M4: [ARQUITETURA.md](../../ARQUITETURA.md) (raiz do repositório)
- Regras de islands no dia a dia: [docs/modulos/interatividade/REGRA.md](modulos/interatividade/REGRA.md)
- Mapa de módulos: [docs/modulos/INDEX.md](modulos/INDEX.md)

Nota: a versão antiga afirmava que o `prebuild` rodava os gates de tokens e
islands; o `package.json` atual roda clean + checks de i18n no `prebuild`, e os
demais gates rodam no CI.
