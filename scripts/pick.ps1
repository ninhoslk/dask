# Copies chosen photos into site/public/fotos, resized to max 1920px, JPEG q82.
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root "referencia\fotos"
$dst = Join-Path $root "site\public\fotos"
New-Item -ItemType Directory -Force $dst | Out-Null
$map = [ordered]@{
  'patio-alunos'        = 'dask\20251205_091617-scaled.jpg'
  'patio-turma'         = 'dask\20251205_095604-scaled.jpg'
  'robotica-estande'    = 'dask\20251213_0941260-scaled.jpg'
  'robotica-equipe'     = 'dask\20251213_092149-scaled.jpg'
  'robotica-arena'      = 'dask\20251213_085304-scaled.jpg'
  'robotica-medalhas'   = 'dask\20251125_074120-scaled.jpg'
  'teatro-compadecida'  = 'dask\20251118_201929-scaled.jpg'
  'teatro-mae-natureza' = 'dask\20260910_201715-scaled.jpg'
  'ciencia-colecao'     = 'dask\20251201_100932-scaled.jpg'
  'ciencia-pratica'     = 'dask\20251201_144939-scaled.jpg'
  'volei-time'          = 'dask\20260902_182218-scaled.jpg'
  'volei-quadra'        = 'dask\20260902_182447-scaled.jpg'
  'natal-coral'         = 'dask\20251128_200809-scaled.jpg'
  'natal-coral-2'       = 'dask\20251128_201951-scaled.jpg'
  'formatura-abraco'    = 'dask\20251126_110733-scaled.jpg'
  'realidade-virtual'   = 'dask\20260220_084225-scaled.jpg'
  'acantonamento'       = 'dask\20251127_112124-scaled.jpg'
  'visita-unesp'        = 'dask\20260921_085128-scaled.jpg'
  'laboratorio'         = 'dask\20251201_152335-scaled.jpg'
  'era-uma-vez'         = 'dask\20251204_195747-scaled.jpg'
  'alunas-camiseta'     = 'dask\20251205_134924-scaled.jpg'
  'professoras'         = 'dask\20241206_201804-scaled.jpg'
  'certificado'         = 'dask\20251125_073944.jpg'
  'campus'              = 'dask\20251127_113536-scaled.jpg'
  'makernificos'        = 'dask\20251213_082620-scaled.jpg'
  'formandos'           = 'dask\20251128_215935-scaled.jpg'
  'sas-grupo-estudo'    = 'sas\735905134-Editado.png'
  'sas-riso'            = 'sas\Desenho-universal-para-a-aprendizagem-scaled.jpeg'
  'sas-maos-tinta'      = 'sas\AdobeStock_338093491-scaled.jpeg'
  'sas-notebook'        = 'sas\ia_na_educação.png'
  'sas-maker'           = 'sas\Cultura_maker.png'
  'sas-infantil'        = 'sas\educacao-infantil.png'
  'sas-estudo-ime'      = 'sas\Aluno_estudando_para_concurso_IME.png'
  'sas-escola-sucesso'  = 'sas\escolas_de_sucesso.png'
  'sas-turma'           = 'sas\AdobeStock_452467564-scaled.jpeg'
  'sas-ensino-medio'    = 'sas\ensino-medio.png'
}
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | ? MimeType -eq 'image/jpeg'
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 82L
foreach ($k in $map.Keys) {
  $p = Join-Path $src $map[$k]
  if (-not (Test-Path $p)) { "MISSING $k"; continue }
  $img = [System.Drawing.Image]::FromFile($p)
  $sc = [math]::Min(1.0, 1920 / $img.Width)
  $w = [int]($img.Width * $sc); $h = [int]($img.Height * $sc)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.DrawImage($img, 0, 0, $w, $h)
  $bmp.Save("$dst\$k.jpg", $enc, $ep)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  "$k $w x $h"
}
Copy-Item "$src\dask\logo-dask-verde.png" "$dst\..\logo-dask.png" -Force
Copy-Item "$src\dask\logo-dask.png" "$dst\..\logo-dask-branco.png" -Force
