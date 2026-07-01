@echo off
title Mezz Factory Starter
echo ===================================================
echo   Lancement de Next.js (Port 3000) et Ngrok...
echo ===================================================

:: Lance le serveur de dev sur le port 3000 dans une nouvelle fenetre
echo [-] Demarrage du serveur local Next.js...
start "Serveur Next.js" cmd /k "npm run dev -- -p 3000"

:: Attente de 3 secondes pour laisser le serveur s'initialiser
timeout /t 3 /nobreak > nul

:: Lance ngrok sur le port 3000 dans une autre fenetre
echo [-] Demarrage du tunnel Ngrok...
start "Tunnel Ngrok" cmd /k "npx ngrok http 3000"

:: Lance le surveillant de push automatique sur le depot GitHub
echo [-] Demarrage du surveillant Auto-Push GitHub...
start "Auto-Push GitHub" cmd /k "node watcher.js"

echo ===================================================
echo   Tout est lance ! Tu as trois fenetres ouvertes :
echo   1. Le serveur de dev (http://localhost:3000)
echo   2. Ngrok avec ton lien de partage public.
echo   3. Le surveillant d'auto-push sur GitHub.
echo ===================================================
pause
