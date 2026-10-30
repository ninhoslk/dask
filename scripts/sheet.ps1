param([string]$Dir, [string]$Out, [int]$Start = 0, [int]$Count = 48, [int]$MinW = 900)
# Builds a numbered contact sheet (8 columns) of photos at least $MinW wide.
Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem $Dir -File | ? { $_.Extension -match 'jpe?g|png|webp' } | Sort-Object Name
$pick = @()
foreach ($f in $files) {
  try { $img = [System.Drawing.Image]::FromFile($f.FullName); $w = $img.Width; $h = $img.Height; $img.Dispose() } catch { continue }
  if ($w -ge $MinW) { $pick += [pscustomobject]@{ f = $f; w = $w; h = $h } }
}
$pick = $pick | select -Skip $Start -First $Count
$cols = 8; $tw = 240; $th = 160
$rows = [math]::Ceiling($pick.Count / $cols)
$bmp = New-Object System.Drawing.Bitmap ($cols * $tw), ($rows * $th)
$g = [System.Drawing.Graphics]::FromImage($bmp); $g.Clear([System.Drawing.Color]::White)
$font = New-Object System.Drawing.Font 'Arial', 11, ([System.Drawing.FontStyle]::Bold)
$i = 0; $index = @()
foreach ($p in $pick) {
  $img = [System.Drawing.Image]::FromFile($p.f.FullName)
  $x = ($i % $cols) * $tw; $y = [math]::Floor($i / $cols) * $th
  $g.DrawImage($img, $x + 2, $y + 2, $tw - 4, $th - 4); $img.Dispose()
  $g.FillRectangle([System.Drawing.Brushes]::Black, $x + 2, $y + 2, 38, 18)
  $g.DrawString(($Start + $i), $font, [System.Drawing.Brushes]::Yellow, $x + 4, $y + 3)
  $index += "{0}`t{1}`t{2}x{3}" -f ($Start + $i), $p.f.Name, $p.w, $p.h
  $i++
}
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Jpeg); $g.Dispose(); $bmp.Dispose()
$index | Out-File ($Out + '.txt') -Encoding utf8
"$($pick.Count) photos on sheet"
