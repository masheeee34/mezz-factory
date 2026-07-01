POLICE "ROAD RAGE"
==================

Le site utilise la police "Road Rage" pour les titres (comme sur le maillot).
Pour l'activer :

1. Récupère le fichier de la police (Road Rage.ttf — dispo gratuitement sur dafont.com).
2. (Recommandé) Convertis-le en .woff2 sur https://transfonter.org pour un chargement rapide.
3. Dépose le(s) fichier(s) ici :
     public/fonts/RoadRage.woff2
     public/fonts/RoadRage.ttf   (optionnel, fallback)

C'est tout : le @font-face dans src/app/globals.css la détecte automatiquement.
Tant que le fichier est absent, les titres utilisent "Anton" (look condensé sportif).
