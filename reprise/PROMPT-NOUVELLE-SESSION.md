# Prompt à coller dans une nouvelle session Claude

1. Décompressez `lignees-v1.6.zip` dans un dossier de travail (ou ouvrez directement le dossier du projet).
2. Ouvrez ce dossier dans Claude Code.
3. Collez le texte ci-dessous.

---

On reprend le développement de mon jeu **Lignées** (version 1.6), un jeu de gestion idle et roguelike en HTML/CSS/JS, sans dépendance.

Avant toute chose, lis dans cet ordre :
1. `reprise/REPRISE.md` : passation complète (architecture, mécaniques, pièges, état actuel, méthode de travail) ;
2. `DESIGN.md` : décisions de conception, version par version ;
3. `README.md`.

Ensuite, lance le jeu (`python tools/serve.py 8766`, ou la configuration `lignees` de `.claude/launch.json`), vérifie qu'il démarre sans erreur dans la console, et fais-moi un court résumé de l'état du projet.

Rappels importants :
- On travaille en français.
- Découpe mes demandes en lots, teste chaque lot (simulations du bot `BOT()` et navigateur) et dis-moi clairement ce qui est testé ou non.
- Ne jamais écraser ma sauvegarde du navigateur sans en faire une copie.
- Tiens `DESIGN.md` à jour avec une section par version.

Ma prochaine demande : [écrire ici]
