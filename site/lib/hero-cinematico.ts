// Configuração da abertura cinematográfica (scroll controla o vídeo).
//
// O vídeo de origem (voo de drone até a entrada do Dask, 7,9 s, 24 fps) foi
// convertido em sequências de frames WebP, porque o MP4 original tem um único
// keyframe: buscas por currentTime decodificariam desde o início a cada passo.
//
// Para trocar o vídeo, gere novas sequências em public/hero/ (veja README.md
// nessa pasta) e ajuste `quantidade` abaixo.

export type SequenciaFrames = {
  /** pasta pública dos frames, sem barra final */
  pasta: string
  /** quantidade de arquivos 000.webp … NNN.webp */
  quantidade: number
  /** imagem estática mostrada antes do primeiro frame e como fallback */
  poster: string
}

export const sequencias: { desktop: SequenciaFrames; mobile: SequenciaFrames } = {
  desktop: { pasta: "/hero/desktop", quantidade: 190, poster: "/hero/poster.jpg" },
  // frames alternados e recorte vertical centrado: menos dados no celular
  mobile: { pasta: "/hero/mobile", quantidade: 95, poster: "/hero/poster-mobile.jpg" },
}

/** abaixo desta largura usa a sequência mobile */
export const larguraMobile = 768

/**
 * Altura total da seção, em svh. Quanto maior, mais longa (e lenta) a viagem.
 * A seção fica presa na tela durante (altura - 100) svh de rolagem.
 */
export const alturaSecao = { desktop: 420, mobile: 320 }

/** frames carregados em paralelo */
export const carregamentoParalelo = 6

/** quanto do progresso (0 a 1) cada texto leva para entrar ou sair */
export const duracaoTransicao = 0.06

export type BlocoTexto = {
  id: string
  /** progresso (0 a 1) em que o bloco está totalmente visível */
  entra: number
  sai: number
}

// Os textos em si ficam no componente (JSX); aqui só os intervalos.
// Mantenha os intervalos sem sobreposição para os blocos não se cruzarem.
export const blocos: BlocoTexto[] = [
  { id: "abertura", entra: 0, sai: 0.2 },
  { id: "historia", entra: 0.32, sai: 0.54 },
  { id: "chegada", entra: 0.7, sai: 1 },
]
