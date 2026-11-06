// Regra do encaixe automático das seções da home, sem DOM: recebe medidas em
// pixels e devolve para onde deslizar (ou nada). O componente EncaixeSecoes
// só mede a página e chama estas funções; os testes chamam com números.
//
//   - Pontos de encaixe: o começo de cada seção [data-encaixe] e, nas mais
//     altas que a tela, também o fim (o último trecho encosta embaixo).
//     No meio de uma seção alta não há ponto: a leitura fica livre.
//   - "Perto" depende do sentido: descendo, até 30% de uma tela antes do
//     ponto ou 10% depois; subindo, o inverso. Quem passa direto não volta.
//   - Zonas livres [data-sem-encaixe] (abertura, Nossa história, Ensino,
//     robótica): enquanto uma delas ocupa 25% da tela ou mais, nada encaixa.

export const ANTES = 0.3
export const DEPOIS = 0.1
export const OCUPACAO_LIVRE = 0.25
/** quanto uma seção precisa passar da altura da tela para o fim dela virar ponto */
export const FOLGA_FIM = 40

/** Retângulo de um elemento em relação à tela (como getBoundingClientRect). */
export type Faixa = { topo: number; altura: number }

/** Pontos de encaixe, em posição de rolagem, das seções medidas agora. */
export function pontosDeEncaixe(secoes: Faixa[], rolagem: number, tela: number): number[] {
  const pontos: number[] = []
  for (const s of secoes) {
    const topo = s.topo + rolagem
    pontos.push(topo)
    if (s.altura > tela + FOLGA_FIM) pontos.push(topo + s.altura - tela)
  }
  return pontos
}

/** Alguma zona livre ocupa 25% da tela ou mais? */
export function zonaLivreNaTela(zonas: Faixa[], tela: number): boolean {
  return zonas.some((z) => Math.min(z.topo + z.altura, tela) - Math.max(z.topo, 0) >= tela * OCUPACAO_LIVRE)
}

export type Parada = {
  /** posição de rolagem onde a página parou */
  atual: number
  /** 1 descendo, -1 subindo */
  direcao: 1 | -1
  /** altura da tela */
  tela: number
  /** maior posição de rolagem possível */
  limite: number
  pontos: number[]
}

/** Para onde deslizar depois de parar, ou undefined para ficar onde está. */
export function escolherEncaixe({ atual, direcao, tela, limite, pontos }: Parada): number | undefined {
  let melhor: number | undefined
  for (const p of pontos) {
    const alvo = Math.min(Math.max(p, 0), limite)
    const d = atual - alvo // negativo: o ponto ainda está abaixo
    const perto =
      direcao > 0 ? d >= -tela * ANTES && d <= tela * DEPOIS : d <= tela * ANTES && d >= -tela * DEPOIS
    if (perto && (melhor === undefined || Math.abs(d) < Math.abs(atual - melhor))) melhor = alvo
  }
  // já está no ponto (ou a dois pixels dele): não mexe
  if (melhor === undefined || Math.abs(atual - melhor) < 2) return undefined
  return melhor
}
