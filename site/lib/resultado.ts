// Resposta das operações do painel: deu certo (com dados e, às vezes, um
// aviso) ou deu errado, com uma mensagem pronta para mostrar à equipe.
export type Resultado<T = undefined> = { ok: true; dados?: T; aviso?: string } | { ok: false; erro: string }

export const falha = (erro: string): Resultado<never> => ({ ok: false, erro })
