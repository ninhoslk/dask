# Animações

Nenhuma biblioteca de animação foi adicionada. Tudo é CSS (transições,
`@keyframes`, `position: sticky`) mais um pouco de JavaScript em componentes
cliente. O CSS está em `site/app/globals.css`.

Princípios (valem para qualquer animação nova):

- Só `transform` e `opacity`.
- Respeita `prefers-reduced-motion`.
- Se o JavaScript não rodar, **o conteúdo aparece** (o estado escondido só vale sob `html.js-motion`).
- Trabalho por scroll em **um único `requestAnimationFrame`**, escrevendo no DOM; nada de `setState` por evento de scroll.
- Invisível não bloqueia clique nem foco (`visibility: hidden` + `inert`).

## 1. Abertura cinematográfica (scroll controla o vídeo)

Arquivos: `components/sections/hero-cinematico.tsx`, `lib/hero-cinematico.ts`,
bloco `.cine*` no `globals.css`, frames em `public/hero/`.

### O que o visitante vê

Tela cheia com o voo de drone até a porta do colégio. Ao rolar, o voo avança; ao
rolar para cima, volta. Três textos HTML reais (não estão dentro do vídeo) entram
e saem em momentos definidos. Uma barra fina verde-água embaixo mostra o
progresso, e "Role para chegar à escola" some assim que a pessoa começa a rolar.
No fim, a seção solta e a página segue normalmente.

### Por que frames em vez de `<video>`

O MP4 original (1920×1080, 24 fps, 190 frames, 7,9 s, H.264) tem **um único
keyframe**, no frame 0. Mudar `video.currentTime` para um ponto do meio obriga o
navegador a decodificar desde o início a cada passo, o que trava o scroll. Por isso
o vídeo foi convertido em sequências de imagens WebP desenhadas num `<canvas>`:

| Sequência | Frames | Tamanho | Como foi gerada |
| --- | --- | --- | --- |
| `public/hero/desktop/000..189.webp` | 190 | ≈17 MB | todos os frames, 1440 px de largura, qualidade 55 |
| `public/hero/mobile/000..094.webp` | 95 | ≈5,6 MB | 1 frame a cada 2, recorte vertical 9:16 centrado, 720 px |
| `public/hero/poster.jpg`, `poster-mobile.jpg` | — | ≈0,3 MB | primeiro frame; aparece antes do canvas e é o fallback |

Comandos ffmpeg exatos: `site/public/hero/README.md`.

### Como a sincronização funciona

1. A `<section class="cine">` tem altura grande (`alturaSecao`, em `svh`). O palco `.cine-palco` é `position: sticky; top: 0; height: 100svh`, então fica preso enquanto a seção rola.
2. A cada scroll, o componente calcula:
   `progresso = clamp(-rect.top / (altura da seção − altura da janela))` (0 a 1)
   `frame = round(progresso × (quantidade − 1))`
3. Desenha o frame no canvas com a regra *cover* (`desenharCover`), sem distorcer, usando `devicePixelRatio` limitado a 2.
4. Para cada bloco de texto calcula a opacidade com `visibilidade(p, entra, sai)`: rampa de `duracaoTransicao` (0,06 do progresso) na entrada e na saída; desloca até 28 px na vertical.
5. Tudo acontece dentro de `atualizar()`, chamado por `requestAnimationFrame` (só um agendado por vez). Os eventos `scroll` (passivo) e `resize` só agendam.

### Carregamento

- Ao montar, escolhe a sequência pela largura (`larguraMobile = 768`).
- Carrega os frames por **proximidade ao frame atual** (`proximoParaCarregar`): primeiro o frame do ponto em que a pessoa está, depois os vizinhos, alternando para frente e para trás; até `carregamentoParalelo` (6) em voo. Só carrega dentro da **janela de memória** (`janelaFrames`: 24 frames de cada lado no celular, 48 no desktop).
- **Memória limitada:** a cada atualização, `soltarDistantes` solta os frames a mais de `janela + folga` (8) do atual (tira o `src` e a referência), exceto o que está desenhado. Se a pessoa voltar, eles vêm de novo do cache HTTP. No pior caso ficam ≈175 MB decodificados no celular (antes ≈350 MB com as 95 imagens) e ≈450 MB no desktop (antes ≈890 MB). Os números são estimativa (largura × altura × 4 bytes), **não medidos em aparelho real**.
- O poster some no primeiro frame carregado, qualquer que seja (se a página abrir já rolada, o frame 0 pode estar fora da janela).
- Se o frame exato ainda não chegou, desenha o **mais próximo já carregado** (`melhorDisponivel`), então nunca fica em branco.
- Se um frame falha, ele é marcado como erro e pulado. Se nenhum carregar, o poster continua e os textos continuam animando.
- Ao redimensionar, troca de sequência se cruzar 768 px e reajusta o canvas.
- Ao desmontar: remove os listeners, cancela o rAF e restaura a altura.

### Movimento reduzido

Com `prefers-reduced-motion: reduce` (lido via `useSyncExternalStore`, então reage
se a pessoa mudar a preferência com a página aberta): a seção vira `100svh`
estática, sem canvas, só o poster, o título "Evoluir para transformar.", o texto de
apoio e o botão de visita. Os outros dois textos ficam ocultos.

### Como ajustar (tudo em `lib/hero-cinematico.ts`)

| Quero… | Mude |
| --- | --- |
| voo mais longo/lento | `alturaSecao.desktop` / `.mobile` (hoje 420 e 320, em `svh`) |
| outros momentos para os textos | `blocos[n].entra` e `.sai` (progresso 0–1; mantenha sem sobreposição) |
| transição mais suave/rápida | `duracaoTransicao` |
| outro vídeo | regerar `public/hero/*` e atualizar `quantidade` |
| outros textos | JSX em `hero-cinematico.tsx` (três blocos, na mesma ordem de `blocos`) |
| mais/menos carregamento simultâneo | `carregamentoParalelo` |
| mais/menos frames na memória | `janelaFrames` (`mobile`, `desktop`, `folga`) |

Intervalos atuais: abertura 0–0,20 · "Uma escola feita de professores para alunos." 0,32–0,54 · "A porta está aberta." (com botões) 0,70–1.

### Legibilidade

`.cine-veu` é um véu escuro (gradiente neutro) mais forte embaixo, onde ficam os
textos, e leve em cima, atrás do cabeçalho. É o **único gradiente do site** e só
existe sob texto sobre vídeo.

## 2. Robótica: zoom pelo scroll (`showcase.tsx`)

Seção `.showcase` com `height: 210vh` e palco sticky. A foto dos Makerníficos com a
bandeira tem três "distâncias" (`stages`): inteira (escala 1), bandeira (1,3,
descendo 7%) e medalhas (1,55, subindo 13%). Três marcadores invisíveis no fluxo
são observados por `IntersectionObserver`; o que está na linha central define o
estágio. Só `transform: scale() translateY()` com transição de 900 ms.
A segunda metade do título ("com pódio.") e a legenda aparecem no segundo e no
terceiro estágio. O título acessível inteiro é "Robótica é aula com pódio." (a
segunda parte é `sr-only` no `<h2>` e visual em um `<p aria-hidden>`).

**Celular (≤768 px):** a seção **não fixa na tela** (`.showcase { height: auto }`,
palco estático); foto, "com pódio." e legenda aparecem em sequência. Foi
simplificada para evitar texto cruzando a foto e saltos de layout.

## 3. Conquistas pelo scroll (`conquistas.tsx`)

Frase única: "Nossos alunos estiveram na Olimpíada…, no Torneio…, e no palco do
Nossos Talentos." A seção `.conquistas` tem `210vh` (190vh no celular) com palco
sticky. O progresso (0–1) do scroll define o índice `lit`:
`lit = floor(progresso × quantidade de conquistas)`. Nomes até `lit` ficam em
branco, o atual (`data-now`) em teal, os seguintes esmaecidos. Um contador "6 de 13"
fica embaixo (`aria-hidden`). Atualização em rAF; `setState` só quando o índice muda.

## 4. Entradas ao rolar (`motion.tsx` + `[data-reveal]`)

Qualquer elemento com `data-reveal` sobe 24 px e aparece uma vez ao entrar na
tela (`IntersectionObserver`, `rootMargin` −10% embaixo). Atraso escalonado com a
variável CSS `--d` (ex.: `style={{ "--d": "90ms" }}`). Um `MutationObserver`
registra elementos adicionados depois. O estado escondido só existe sob
`html.js-motion`, adicionado pelo próprio componente; sem JS, nada fica invisível.

## 5. Outras animações

| Onde | O quê | Classe/arquivo |
| --- | --- | --- |
| Faixa de fotos (Apresentação e Contato) | Corre sozinha 60 s por volta; no Contato corre ao contrário. Pausa com o mouse em cima, com o foco do teclado e com um toque ou Enter (que alterna), exigência da WCAG 2.2.2 | `.faixa*`, `faixa-fotos.tsx`, `faixa-pausavel.tsx` |
| Cabeçalho que volta | Depois que o cabeçalho da página sai da tela, o mesmo cabeçalho reaparece preso no topo quando a pessoa rola para cima e some quando ela desce (só `transform`/`opacity`; escondido fica `visibility: hidden` + `inert`) | `.cabecalho-fixo`, `cabecalho-fixo.tsx` |
| Toque | Links de texto, chips, itens do menu e cartões de notícia escurecem na hora em que são pressionados (`:active`); no toque, links ganham área clicável de ~44 px sem mudar o desenho (`.link::after`, `.alvo-toque`) | `globals.css` |
| Encaixe depois da abertura | No computador, só depois que a rolagem para de vez (inércia incluída), vindo de cima, e parada até 30% de uma tela antes ou 10% depois do começo da Apresentação, ela desliza 0,5 s e para exatamente nele. Quem rola direto passa sem ser puxado; subir nunca é interrompido; um novo giro da roda cancela o encaixe. Sem rolagem suave (movimento reduzido), não age | `encaixe-apresentacao.tsx` |
| Foto do Contato | Deriva lenta (zoom e deslocamento, 14 s, vai e volta) | `.drift` |
| Botões de ação | Press (`scale(.97)`) e hover | `.btn-action` |
| Seletor de série | O texto de resultado entra com `animate-in fade-in slide-in-from-bottom-2` | `ensino.tsx` |
| Dica de scroll da abertura | Linha verde correndo; fica acima dos botões flutuantes (Instagram/WhatsApp/topo), a 196 px da base, para não ser coberta | `.cine-dica` |

## Testando animações

- `scripts/cine-test.mjs` abre um Chrome headless real, rola a abertura até 0, 15, 30, 45, 60, 80 e 100% e volta a 45% e 0, grava capturas e informa opacidade dos blocos, frames carregados, bytes e erros de console. Modos: `desktop`, `phone`, e `desktop reduzido`.
- A skill taste-skill traz `inspect.mjs` (medições em 3 larguras) e `scenes.mjs` (que só reconhece cenas da própria skill, então **não** vê a abertura deste projeto).
- Cuidado: o painel de pré-visualização do Claude pode pausar animações quando oculto. Use o Chrome headless para provar comportamento de scroll.
