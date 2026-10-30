# Scripts

Utilitários usados para levantar conteúdo e testar. Não fazem parte do site; são
registro reproduzível do que foi feito. Os `.ps1` são **PowerShell 5.1 (Windows)**
e precisam de `System.Drawing` (já incluso no Windows). `cine-test.mjs` é Node 22+ e
precisa do Google Chrome.

Os caminhos são relativos à raiz do repositório (`$PSScriptRoot`), exceto o Chrome
(variável `CHROME_PATH`, padrão `C:/Program Files/Google/Chrome/Application/chrome.exe`).

| Script | O que faz | Uso |
| --- | --- | --- |
| `crawl.ps1` | Percorre as páginas de um site (mesmo host), salva o texto de cada uma e a lista de URLs de imagens. | `./scripts/crawl.ps1 -Start https://colegiodask.com.br/ -Out referencia/dask -Max 60` |
| `download.ps1` | Baixa as fotos do Dask (catálogo da API do WordPress + uploads vistos no crawl) e do SAS para `referencia/fotos/`. Precisa que `referencia/dask/media_catalog.json` e `images.txt` existam. | `./scripts/download.ps1` |
| `sheet.ps1` | Gera uma **folha de contato numerada** (8 colunas) de uma pasta de fotos, para escolher olhando. Salva um `.txt` com o índice (número → arquivo). | `./scripts/sheet.ps1 -Dir referencia/fotos/dask -Out folha.jpg -Start 0 -Count 64` |
| `pick.ps1` | Copia as fotos escolhidas do primeiro lote para `site/public/fotos/`, redimensionadas (máx. 1920 px, JPEG 82), e copia os logos. A tabela `$map` é o registro de "nome no site → arquivo original". | `./scripts/pick.ps1` |
| `cine-test.mjs` | Abre um Chrome headless, rola a abertura cinematográfica a 0, 15, 30, 45, 60, 80, 100% e volta (45%, 0), tira capturas e imprime: opacidade de cada bloco de texto, frames baixados, bytes, erros de console e se a página segue rolando depois da seção. | `node scripts/cine-test.mjs <url> <pasta-de-saída> desktop` · `... phone` · `... desktop reduzido` |

Notas:

- `pick.ps1` registra só o primeiro lote de fotos. Outras (bandeira da robótica, fotos da Árvore) foram baixadas e redimensionadas à mão; está documentado em [docs/HISTORICO.md](../docs/HISTORICO.md). Uma entrada (`sas-notebook`) aponta para um arquivo com acento no nome que não foi encontrado e é ignorada ("MISSING").
- `sheet.ps1` e `pick.ps1` usam `System.Drawing`, que só existe no Windows.
- O `crawl.ps1` sai em PowerShell 5.1; em PowerShell 7 o `-UseBasicParsing` é ignorado sem problema.
