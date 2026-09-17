@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ========================================
echo JustAI 2.0 - Windows launcher
echo ========================================

echo.
echo [1/5] Installing/checking dependencies...
call npm install
if errorlevel 1 goto :fail
call npm install --prefix server
if errorlevel 1 goto :fail
call npm install --prefix apps/web
if errorlevel 1 goto :fail

echo.
echo [2/5] Preparing Playwright browser council...
set JUSTAI_BROWSER_CHANNEL=msedge
set JUSTAI_COUNCIL_TIMEOUT_MS=120000

if not exist "server\.env" (
  copy /Y "server\.env.example" "server\.env" >nul
)

powershell -NoProfile -Command "$p='server/.env'; $s=Get-Content $p -Raw; if($s -notmatch 'JUSTAI_BROWSER_CHANNEL='){Add-Content $p 'JUSTAI_BROWSER_CHANNEL=msedge'}"

where msedge.exe >nul 2>&1
if errorlevel 1 echo WARNING: Microsoft Edge was not found on PATH. Install Edge or set JUSTAI_BROWSER_CHANNEL= in server/.env to use Playwright Chromium.

echo.
echo [3/5] Starting backend...
start "JustAI Backend" cmd /k "cd /d "%~dp0" && npm run dev --prefix server"

powershell -NoProfile -Command "$ok=$false; for($i=0;$i -lt 60;$i++){try{$r=Invoke-WebRequest -UseBasicParsing http://localhost:4302/api/health -TimeoutSec 1;if($r.StatusCode -eq 200){$ok=$true;break}}catch{};Start-Sleep -Milliseconds 500}; if(-not $ok){exit 1}"
if errorlevel 1 (
  echo Backend did not become ready.
  goto :fail
)

echo Backend is ready.

echo.
echo [4/5] Starting frontend...
start "JustAI Web" cmd /k "cd /d "%~dp0" && npm run dev:web"

powershell -NoProfile -Command "$ok=$false; for($i=0;$i -lt 60;$i++){try{$r=Invoke-WebRequest -UseBasicParsing http://localhost:3000/ -TimeoutSec 1;if($r.StatusCode -eq 200){$ok=$true;break}}catch{};Start-Sleep -Milliseconds 500}; if(-not $ok){exit 1}"
if errorlevel 1 (
  echo Frontend did not become ready.
  goto :fail
)

echo Frontend is ready.

echo.
echo [5/5] Opening JustAI...
start "" http://localhost:3000/

echo.
echo ========================================
echo JustAI is running.
echo Web:     http://localhost:3000/
echo Backend: http://localhost:4302/api/health
echo ========================================
echo.
echo Do not close the Backend/Web terminal windows while using JustAI.
exit /b 0

:fail
echo.
echo ========================================
echo START FAILED

echo ========================================
pause
exit /b 1
