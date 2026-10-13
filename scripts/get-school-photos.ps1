# Downloads the free Cameroon photos used on the school pages into public/schools/.
# Photos: Unsplash License (free for commercial use), by Cameroonian photographers.
# Run from the website folder:   powershell -ExecutionPolicy Bypass -File scripts\get-school-photos.ps1

$photos = @{
  "douala-street.jpg"  = "bZnciM7XIYw"   # Edouard TAMBA - people walking in a street, Cameroon
  "douala-boats.jpg"   = "_37R7CT47Wg"   # Edouard TAMBA - fishermen's boat at sunset, Cameroon
  "yaounde-street.jpg" = "xppHOgQBNwU"   # Ariel Nathan ADA MBITA - busy street, Yaounde
  "yaounde-aerial.jpg" = "HV_TYd3KAQA"   # Edouard TAMBA - aerial view of the city
  "yaounde-traffic.jpg"= "TQWSvCfrogw"   # Youssouf NCHETKOU NDAM - cars on a city road
}

$folder = Join-Path $PSScriptRoot "..\public\schools"
New-Item -ItemType Directory -Force -Path $folder | Out-Null

foreach ($name in $photos.Keys) {
  $id = $photos[$name]
  $target = Join-Path $folder $name
  $url = "https://unsplash.com/photos/$id/download?force=true&w=1600"
  try {
    Invoke-WebRequest -Uri $url -OutFile $target -UseBasicParsing
    $kb = [math]::Round((Get-Item $target).Length / 1KB)
    Write-Host "OK   $name ($kb KB)"
  } catch {
    Write-Host "FAILED $name : $($_.Exception.Message)"
  }
}
