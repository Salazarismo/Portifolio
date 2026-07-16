# Da Autópsia ao Bisturi — Reconstrução do Portfólio

> O legista terminou. Agora eu pego o bisturi. Não vou revisar o diagnóstico — vou costurar onde ele apontou a ferida. Tudo aqui é pra você digitar amanhã de manhã.

---

## 1. A TESE EM UMA FRASE

**Construo software para o pior dia, não para a demo.**

É isso. A página inteira se pendura aí. Tem inimigo (a demo, o happy path), tem promessa (o pior dia) e não tem adjetivo. Toda decisão abaixo serve essa frase ou morre.

---

## 2. O HEADLINE

Cinco opções reais pro herói. Nenhuma é o seu nome.

1. **"Eu construo o sistema que funciona quando nada mais funciona."**
2. **"Software para o pior dia — não para a demo."**
3. **"Offline. Sob carga. Em campo. Continua de pé."**
4. **"Seu sistema vai falhar onde não tem sinal. O meu, não."**
5. **"Construído para sobreviver ao mundo real."**

**Crave a 1.** Ela é a frase do cirurgião calmo: aciona alívio, não aprovação. Quem tem um problema crítico lê isso e sente "se é grave, é com essa pessoa" — e ela reivindica uma categoria-de-um sem um único adjetivo. A 2 não morre: vira o motivo recorrente da página (o bloco da tensão). A 4 é tentadora mas é cena longa demais pra tipo gigante — guarda pra um caption, não pro H1.

**A tagline que mata o bingo de bolinhas** ("Full-Stack · Offline-First · Integrações Críticas"):

> **Offline. Sob carga. Em campo. Continua de pé.**

Mesma matéria-prima (offline), mesma seriedade — mas agora é condição + promessa, não lista de skill. É o bullet-soup feito do jeito certo.

---

## 3. A NOVA ARQUITETURA (matar a bifurcação)

A home para de perguntar e passa a afirmar. As duas portas não existem mais na entrada. O olho bate nesta ordem:

**Bloco 1 — NAV (mínima).** Logo "Victor" (sem ®). Toggle de idioma PT/EN. Só isso. Nada de "escolha seu público" aqui.

**Bloco 2 — HERO / A AFIRMAÇÃO.** H1 (a tese), subhead, tagline, UM CTA. A página crava quem você é antes de pedir qualquer coisa de volta.

**Bloco 3 — A CICATRIZ.** Logo abaixo do hero, antes que qualquer dúvida nasça: um número concreto. A prova vem antes do argumento.

**Bloco 4 — A TENSÃO.** O inimigo nomeado: quase todo software é feito pro happy path; o problema do visitante não vive lá. É aqui que a 2 ("pior dia, não demo") trabalha.

**Bloco 5 — EM CAMPO + TOGGLE.** Três provas de como você constrói. **É só aqui — depois do gancho, da cicatriz e da tensão — que o toggle recrutador/cliente aparece.** Pequeno, secundário, um segmented control discreto.

**Bloco 6 — CTA FINAL + contato.**

**O que o toggle faz quando alterna:** ele NÃO refaz a página. Hero, cicatriz e tensão ficam idênticos nos dois modos — porque a tese é universal. Só o bloco 5 e o texto do CTA mudam de ênfase:

- **Modo recrutador:** as três provas inclinam pra time, stack e entrega; CTA vira "Ver perfil e cases".
- **Modo cliente:** as três provas inclinam pra escopo e tocar um sistema crítico do zero; CTA vira "Falar sobre o projeto".

A emoção é entregue antes da triagem. A pessoa se classifica depois de já estar fisgada — não na porta de entrada.

---

## 4. COPY DECK

Pronto pra colar. Onde falta dado verdadeiro, está marcado `[___]` com o que perguntar (detalhe na seção 5).

**HERO**
> # Eu construo o sistema que funciona quando nada mais funciona.
>
> Produtos web e mobile offline-first, com integrações críticas que aguentam o campo — não só o ambiente controlado da demo.
>
> `Offline. Sob carga. Em campo. Continua de pé.`
>
> **[ Ver o que sobrevive ao campo → ]**

**A CICATRIZ (prova)**
> Em produção: `[___]` meses rodando offline em `[contexto real]`. `[___]` sincronizações, zero perda de dado. Quando a conexão voltou, tudo bateu.

**CORPO 1 — A TENSÃO**
> Quase todo software é construído para o happy path: boa conexão, dados limpos, tudo no lugar. O seu problema não vive lá. Ele vive no galpão sem sinal, no dispositivo que passou doze horas no sol, na integração que precisa responder mesmo quando o outro lado caiu. É pra esse mundo que eu construo.

**CORPO 2 — EM CAMPO** (compartilhado nos dois modos do toggle)
> **Offline-first de verdade.** O app funciona primeiro sem rede e sincroniza depois — não o contrário.
> **Integrações que assumem a falha.** Construídas partindo do princípio de que o outro lado vai cair. E que seguram a barra quando ele cai.
> **Confiabilidade medida no pior cenário.** Não na média. No pico, na borda, no dia ruim.

**CORPO 3 — variação do toggle**
> *Modo recrutador:* O que eu entrego num time de produto: `[stack principal]`, e a parte que ninguém quer tocar — o que precisa funcionar quando quebrar custa caro.
> *Modo cliente:* Do escopo ao sistema rodando: eu assumo a parte crítica do projeto, a que não pode ter um dia ruim.

**CTA**
> *Modo recrutador:* Estou aberto a vagas onde quebrar custa caro. **[ Ver perfil e cases → ]**
> *Modo cliente:* Tem um sistema que não pode cair? Vamos conversar. **[ Falar sobre o projeto → ]**

**Microcopy do toggle**
> `Para recrutadores` | `Para clientes`
> *(linha de apoio, pequena:)* Mesmo trabalho. O que muda é o que você precisa ver.

Essa linha de apoio é o que justifica o toggle existir — e reforça que a tese vale pros dois.

---

## 5. A CICATRIZ

Inegociável. Sem isso, a página volta a pedir confiança em vez de torná-la desnecessária. Você tem o trabalho real — só precisa arrancar o número dele.

**O molde exato:**
> Rodou `[tempo]` offline em `[contexto]`, com `[volume]` de `[operação]`, sem `[o que não quebrou]`.

**Exemplos do molde preenchido** (pra você ver o formato-alvo):
- "8 meses offline em coletores de campo, 40 mil sincronizações, zero perda de dado."
- "Integração processou `[X]` requisições/dia com `[Y]` de uptime — atravessou três quedas do sistema parceiro sem perder uma transação."
- "Sincronização de `[X]` dispositivos simultâneos sem conflito de dado em produção."

**As 3 perguntas que arrancam a métrica do trabalho real:**
1. **Sob qual carga?** Quantos usuários, dispositivos ou transações simultâneas no pior pico — não na média?
2. **Por quanto tempo?** Qual o maior período que rodou sem rede, sem cair, ou em produção ininterrupta?
3. **O que NÃO quebrou?** O que era esperado falhar e não falhou — o dado que não se perdeu, a integração que não caiu, o sync que bateu 100%?

Responde essas três e a cicatriz se escreve sozinha. Enquanto o número não vier, mantém o `[___]` no ar — mas trata isso como urgência, não como detalhe.

---

## 6. COMPONENTES E HIERARQUIA

O laudo brigou com "o maior elemento fazendo zero persuasão". Resolvido assim:

**HERO.** Maior tipo da página inteira = o H1 (a tese). É o que grita. O nome **sai do palco** — vira assinatura pequena no nav e no rodapé. O ® é **deletado**. A subhead sussurra logo abaixo. A tagline é pequena, em mono ou caixa alta — sussurro técnico, não manchete. UM CTA, médio.

**CICATRIZ.** O maior tipo do bloco é o NÚMERO (`[X] meses`, `zero perda`). O número grita; o resto da frase vira legenda que sussurra. Um dado em corpo grande vale mais que três adjetivos em negrito.

**TENSÃO.** Tipo médio. O que grita é o contraste — destaque visual em "happy path" contra "campo" / "pior dia". É a única tensão da página; deixa ela aparecer.

**EM CAMPO.** Os três pontos em corpo médio, cada um ancorado num verbo/condição. O toggle é o elemento mais discreto da seção — sussurro proposital. Ele serve à navegação, não ao ego.

**CTA.** O botão grita; a frase ao redor sussurra.

Regra geral: o que carrega a tese cresce, o que é identidade pessoal (nome, ®) encolhe ou some.

---

## 7. ORDEM DE EXECUÇÃO

Ranqueado por impacto emocional, não por facilidade.

1. **[10x] Matar a bifurcação e reescrever o hero com a tese como maior tipo.** Esse é o movimento que muda o frame de "cardápio de garçom" pra "manifesto". Faz primeiro. Sem isso, todo o resto é polir um cadáver.
2. **Plantar a cicatriz logo abaixo do hero.** Converte promessa em crença. Mesmo com o molde no ar, prioriza arrancar o número real — é o que separa "competente" de "inevitável".
3. **Nomear a tensão (happy path vs. campo).** Dá inimigo e emoção à tese. É o que transforma "alívio" de promessa em sensação.
4. **[polimento] Refazer o bloco "em campo" com o toggle discreto.** A triagem de público, agora subordinada ao gancho. Importante, mas só funciona depois que 1–3 existem.
5. **[polimento] Microcopy, tagline, rodapé, remover o ®.** Acabamento. Pequeno, mas é onde o cosplay de marca vira marca.

---

## 8. LISTA DE MORTE

Deleta sem dó:

- **O conceito das duas portas na entrada.** Mata a emoção antes do desejo. Vira toggle pequeno no bloco 5.
- **A tagline "Full-Stack · Offline-First · Integrações Críticas".** Bingo de buzzword; lê como todo dev. Substituída pela afirmação.
- **O ®.** Cheque que a página não cobre. Cosplay de marca confiante.
- **O nome como maior elemento.** Seu RG não persuade. Encolhe pra assinatura.
- **Todo adjetivo solto sem número** — "confiável", "consistente", "robusto". Adjetivo é de graça; ou vira prova, ou sai do palco.
- **O parágrafo de descrição atual, do jeito que está.** Abstrato demais. Substituído por tensão + cicatriz.

---

**Régua final:** cada seção acima te diz o que digitar, não o que "considerar". Se em algum ponto você ainda não souber a próxima palavra a teclar, é a cicatriz — e ela depende só de você responder três perguntas. O resto já está escrito. Cola e shippa.
