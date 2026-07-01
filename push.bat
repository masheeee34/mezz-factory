@echo off
title Mezz Factory — Push GitHub
echo ===================================================
echo   PUSH MANUEL SUR GITHUB (GROSSE MISE A JOUR)
echo ===================================================
echo.

:: Demande le message personnalisé à l'utilisateur
set /p msg="Entre le message de ta mise a jour (ex: ajout de la personnalisation) : "

if "%msg%"=="" (
    echo Message vide. Annulation.
    goto end
)

echo.
echo Envoi en cours...
git add .
git commit -m "%msg%"
git push origin main

echo.
echo ===================================================
echo   Projet mis a jour sur GitHub avec succes !
echo ===================================================
:end
pause
