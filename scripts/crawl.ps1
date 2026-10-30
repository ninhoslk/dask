param([string]$Start, [string]$Out, [int]$Max = 60)
# Crawls same-host pages, saves plain text per page and a list of image URLs.
$ErrorActionPreference = 'Continue'
$base = [uri]$Start
New-Item -ItemType Directory -Force "$Out\text" | Out-Null
$queue = New-Object System.Collections.Queue
$queue.Enqueue($Start)
$seen = @{}
$imgs = @{}
$skip = '\.(css|js|png|jpe?g|gif|webp|svg|ico|pdf|xml|woff2?|ttf|eot|mp4)(\?|$)|/wp-json|/feed|xmlrpc|/comments/|/wp-content/|/wp-admin|/modules/|/sites/default/|/themes/'
while ($queue.Count -gt 0 -and $seen.Count -lt $Max) {
  $u = $queue.Dequeue()
  $u = $u.Split('#')[0]
  if ($seen.ContainsKey($u)) { continue }
  $seen[$u] = 1
  try { $r = Invoke-WebRequest $u -UseBasicParsing -TimeoutSec 40 } catch { "FAIL $u"; continue }
  $h = $r.Content
  foreach ($m in [regex]::Matches($h, '(?:src|data-src|href|data-lazy-src)="([^"]+\.(?:jpe?g|png|webp|svg|gif)[^"]*)"')) { $imgs[$m.Groups[1].Value] = $u }
  foreach ($m in [regex]::Matches($h, 'srcset="([^"]+)"')) { foreach ($p in $m.Groups[1].Value.Split(',')) { $x = $p.Trim().Split(' ')[0]; if ($x) { $imgs[$x] = $u } } }
  foreach ($m in [regex]::Matches($h, 'url\((?:&quot;|["''])?([^)"''&]+\.(?:jpe?g|png|webp|svg|gif))')) { $imgs[$m.Groups[1].Value] = $u }
  $t = [regex]::Replace($h, '(?s)<(script|style|noscript|svg)[^>]*>.*?</\1>', ' ')
  $t = [regex]::Replace($t, '(?i)<(br|/p|/h\d|/li|/div|/section)[^>]*>', "`n")
  $t = [regex]::Replace($t, '<[^>]+>', ' ')
  $t = [System.Net.WebUtility]::HtmlDecode($t)
  $t = ($t -split "`n" | % { ($_ -replace '\s+', ' ').Trim() } | ? { $_ }) -join "`n"
  $name = ($u -replace '^https?://[^/]+/?', '' -replace '[^a-zA-Z0-9]+', '_').Trim('_')
  if (-not $name) { $name = 'home' }
  "URL: $u`n`n$t" | Out-File "$Out\text\$name.txt" -Encoding utf8
  "ok $u"
  foreach ($m in [regex]::Matches($h, 'href="([^"]+)"')) {
    $l = [System.Net.WebUtility]::HtmlDecode($m.Groups[1].Value)
    try { $abs = (New-Object System.Uri($base, $l)).AbsoluteUri.Split('#')[0] } catch { continue }
    if (([uri]$abs).Host -eq $base.Host -and $abs -notmatch $skip -and -not $seen.ContainsKey($abs)) { $queue.Enqueue($abs) }
  }
}
$abs = $imgs.Keys | % { try { (New-Object System.Uri($base, [System.Net.WebUtility]::HtmlDecode($_))).AbsoluteUri } catch {} } | sort -Unique
$abs | Out-File "$Out\images.txt" -Encoding utf8
"pages: $($seen.Count)  images: $($abs.Count)"
