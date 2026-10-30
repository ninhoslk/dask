# Downloads Dask (catalog + crawled uploads) and SAS photos into referencia\fotos.
$ref = Join-Path (Split-Path $PSScriptRoot -Parent) "referencia"
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")
function Get-File($url, $dir) {
  $name = [uri]::UnescapeDataString(([uri]$url).Segments[-1]) -replace '[^\w\.\-]+', '_'
  $dest = Join-Path $dir $name
  if (Test-Path $dest) { return $true }
  try { $wc.DownloadFile($url, $dest); return $true } catch { return $false }
}

# Dask: media catalog (large size when available) + every upload seen while crawling
$dDir = "$ref\fotos\dask"; New-Item -ItemType Directory -Force $dDir | Out-Null
$cat = Get-Content "$ref\dask\media_catalog.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$urls = @($cat | % { if ($_.media_details.sizes.large.source_url) { $_.media_details.sizes.large.source_url } else { $_.source_url } })
$urls += Get-Content "$ref\dask\images.txt" | ? { $_ -match 'colegiodask\.com\.br/wp-content/uploads/.*\.(jpe?g|png|webp|svg)$' -and $_ -notmatch '-\d+x\d+\.' }
$ok = 0; $fail = 0
foreach ($u in ($urls | sort -Unique)) { if (Get-File $u $dDir) { $ok++ } else { $fail++ } }
"dask ok=$ok fail=$fail"

# SAS: rewrite dev hosts to production, skip YouTube thumbs
$sDir = "$ref\fotos\sas"; New-Item -ItemType Directory -Force $sDir | Out-Null
$ok = 0; $fail = 0
$sas = Get-Content "$ref\sas\images.txt" | ? { $_ -match '\.(jpe?g|png|webp)(\?|$)' -and $_ -notmatch 'ytimg' } | % { ($_ -split '\?')[0] } | sort -Unique
foreach ($u in $sas) {
  $prod = $u -replace '^https?://(sas-educacao\.lndo\.site|dev-saseducacao\.pantheonsite\.io)', 'https://www.saseducacao.com.br'
  if ((Get-File $prod $sDir) -or (Get-File $u $sDir)) { $ok++ } else { $fail++ }
}
"sas ok=$ok fail=$fail"
