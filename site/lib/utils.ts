export { cn } from "cn"

// Palavras de uma letra (é, a, o, e, à…) não ficam soltas no fim da linha:
// um espaço sem quebra as prende à palavra seguinte, como na tipografia impressa.
export function juntarCurtas(texto: string) {
  return texto.replace(/(^|\s)([aeoàáéêóôAEOÀÁÉÊÓÔ])\s+/g, "$1$2 ")
}
