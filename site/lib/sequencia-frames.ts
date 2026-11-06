// Cache dos quadros da abertura em vídeo: decide quais quadros carregar,
// quantos ao mesmo tempo, quais soltar da memória e qual é o melhor já
// disponível para desenhar. Não sabe de canvas nem de rolagem: o componente
// diz para onde a rolagem aponta (irPara), pergunta o que desenhar (melhor),
// avisa o que desenhou (desenhou) e pede para carregar o resto (carregar).
//
// As imagens vêm de `criarImagem` (no navegador, `new Image()`; nos testes,
// uma imagem falsa), então as regras de memória são testáveis sem navegador.

/** O mínimo de HTMLImageElement que o cache usa. */
export type ImagemCarregavel = {
  src: string
  decoding?: string
  // aceita os handlers do DOM, que recebem um evento (o cache não usa o evento)
  onload: ((ev: never) => unknown) | null
  onerror: ((ev: never) => unknown) | null
  removeAttribute(nome: "src"): void
}

export type OpcoesSequencia<I extends ImagemCarregavel> = {
  quantidade: number
  url: (i: number) => string
  /** quadros de cada lado do alvo que ficam carregados */
  raio: number
  /** além do raio, quanto esperar antes de soltar (evita solta-recarrega na borda) */
  folga: number
  /** quadros baixando ao mesmo tempo */
  paralelo: number
  criarImagem: () => I
  /** chamado quando um quadro termina de carregar */
  aoCarregar?: (i: number) => void
}

type Estado = "vazio" | "carregando" | "ok" | "erro"

export function criarSequencia<I extends ImagemCarregavel>(o: OpcoesSequencia<I>) {
  const quadros: (I | null)[] = new Array(o.quantidade).fill(null)
  const estado: Estado[] = new Array(o.quantidade).fill("vazio")
  let alvo = 0
  let desenhado = -1
  let emVoo = 0
  let ativa = true

  // solta os quadros longe do alvo; o que está desenhado nunca sai, para o
  // canvas não ficar sem reserva
  const soltarDistantes = () => {
    const limite = o.raio + o.folga
    for (let i = 0; i < o.quantidade; i++) {
      if (quadros[i] && i !== desenhado && Math.abs(i - alvo) > limite) {
        // sem src a imagem libera os dados decodificados
        quadros[i]!.removeAttribute("src")
        quadros[i] = null
        estado[i] = "vazio"
      }
    }
  }

  // o alvo primeiro, depois os vizinhos, alternando os lados, só dentro do raio
  const proximo = () => {
    for (let r = 0; r <= o.raio; r++) {
      for (const i of [alvo + r, alvo - r]) {
        if (i >= 0 && i < o.quantidade && estado[i] === "vazio") return i
      }
    }
    return -1
  }

  const bombear = () => {
    while (ativa && emVoo < o.paralelo) {
      const i = proximo()
      if (i < 0) return
      const img = o.criarImagem()
      img.decoding = "async"
      estado[i] = "carregando"
      emVoo++
      img.onload = () => {
        emVoo--
        if (!ativa) return
        quadros[i] = img
        estado[i] = "ok"
        o.aoCarregar?.(i)
        bombear()
      }
      img.onerror = () => {
        emVoo--
        if (!ativa) return
        // se nenhum quadro carregar, o poster continua visível
        estado[i] = "erro"
        bombear()
      }
      img.src = o.url(i)
    }
  }

  return {
    /** A rolagem aponta para o quadro i (só marca; quem carrega é `carregar`). */
    irPara(i: number) {
      alvo = Math.min(Math.max(Math.round(i), 0), o.quantidade - 1)
    },
    /**
     * Solta os quadros longe do alvo e começa a baixar os que faltam em volta
     * dele. Chame depois de desenhar: assim o quadro recém-desenhado, mesmo
     * longe (num salto rápido), fica protegido.
     */
    carregar() {
      soltarDistantes()
      bombear()
    },
    /** O quadro carregado mais perto do alvo (ou null se nenhum carregou ainda). */
    melhor(): { indice: number; imagem: I } | null {
      for (let r = 0; r < o.quantidade; r++) {
        if (quadros[alvo - r]) return { indice: alvo - r, imagem: quadros[alvo - r]! }
        if (quadros[alvo + r]) return { indice: alvo + r, imagem: quadros[alvo + r]! }
      }
      return null
    },
    /** Avisa qual quadro está no canvas: esse não é solto. -1 = nenhum. */
    desenhou(i: number) {
      desenhado = i
    },
    /** O quadro i, recém-carregado, fica melhor que o desenhado agora? */
    melhorQueODesenhado(i: number) {
      return desenhado < 0 || Math.abs(i - alvo) < Math.abs(desenhado - alvo)
    },
    /** Para de carregar; o que ainda estiver baixando é ignorado ao chegar. */
    encerrar() {
      ativa = false
    },
    /** Para os testes: quantos quadros estão na memória e quantos baixando. */
    contagem: () => ({ naMemoria: quadros.filter(Boolean).length, baixando: emVoo }),
  }
}

export type Sequencia<I extends ImagemCarregavel = ImagemCarregavel> = ReturnType<typeof criarSequencia<I>>
