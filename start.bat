@echo off
cd /d "%~dp0"
start "JustAI Server" cmd /k "cd /d server && npm exec -- nodemon --watch src --exec ts-node-esm src/index.ts"
start "JustAI Web" cmd /k "npm --prefix apps/web exec -- vite --port 4301"
timeout /t 3 /nobreak > nul
start "" "http://localhost:4301"
exit