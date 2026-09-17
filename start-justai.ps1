$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
Write-Host 'JustAI 2.0 - Windows launcher' -ForegroundColor Cyan

npm install
npm install --prefix server
npm install --prefix apps/web

if (!(Test-Path 'server/.env')) { Copy-Item 'server/.env.example' 'server/.env' }
$env:JUSTAI_BROWSER_CHANNEL = 'msedge'
$env:JUSTAI_COUNCIL_TIMEOUT_MS = '120000'

Start-Process powershell -ArgumentList '-NoExit','-Command',"Set-Location '$PSScriptRoot'; npm run dev --prefix server"

for ($i=0; $i -lt 60; $i++) {
    try { if ((Invoke-WebRequest -UseBasicParsing 'http://localhost:4302/api/health').StatusCode -eq 200) { break } } catch {}
    Start-Sleep -Milliseconds 500
}

Start-Process powershell -ArgumentList '-NoExit','-Command',"Set-Location '$PSScriptRoot'; npm run dev:web"

for ($i=0; $i -lt 60; $i++) {
    try { if ((Invoke-WebRequest -UseBasicParsing 'http://localhost:3000/').StatusCode -eq 200) { break } } catch {}
    Start-Sleep -Milliseconds 500
}

Start-Process 'http://localhost:3000/'
Write-Host 'JustAI is running: http://localhost:3000/' -ForegroundColor Green
