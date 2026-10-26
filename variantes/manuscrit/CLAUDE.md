# Lignées — édition à thèmes : consignes pour Claude

Copie de Lignées 1.9 avec **cinq thèmes graphiques** au choix dans Paramètres → Apparence : « Pastel doux », « Chronique enluminée » (parchemin, par défaut), « Vapeur 1900 », « Néon orbital » et « Atelier d'aquarelle ». Le gameplay est identique à la version pastel située deux dossiers plus haut. **Lire `STYLE.md`** pour la direction artistique et l'architecture des thèmes, puis `DESIGN.md` pour les règles de jeu (communes aux deux versions).

## Ce qui est propre à cette édition
- `css/themes/<id>.css` (chargé après `style.css`) : une feuille de style par thème ; `js/ui/theme.js` : registre des thèmes (palette des données + palette du canvas) ; `js/ui/render.js` : dessin de la carte piloté par la palette ; `index.html` : script d'en-tête qui charge la feuille du thème mémorisé.
- Tout changement **visuel** se fait ici ; ne pas retoucher `style.css` sauf pour du commun à tous les thèmes.
- Un changement de **gameplay** (js/core, js/data hors couleurs, logique de js/ui/ui.js) doit être reporté dans l'autre version : les deux dossiers sont des copies indépendantes.
- Ajouter un thème : voir la fin de `STYLE.md`.

## Essentiel (hérité)
- Tout est en **français**. Pas de dépendance ni de compilation (scripts classiques, objet global `G`).
- Lancer : configuration `manuscrit` de `.claude/launch.json` (port 8771), ou `python tools/serve.py 8771`. `tools/serve.py` lit aussi la variable `PORT`. La sauvegarde est **séparée** de la version pastel (autre port = autre stockage du navigateur) ; le port 8767 est parfois pris par un autre projet.
- Boutons : `data-action="nom:arg"`, traités dans `act()` (`js/ui/ui.js`). Jamais `confirm()` ni `alert()` : utiliser `confirmModal()`.
- Toute modification de `run.buildings` passe par `G.economy.rebuildGrid()`. Tout changement du format de sauvegarde demande une migration (`main.js`).
- Tests : `BOT(secondes, { origin, rig })` en console. **Ne jamais écraser la partie du joueur** : tester sur un autre port (autre stockage) ou sauvegarder `lignees_save_v1` d'abord.
- Une partie où le bot a joué (`run.botUsed` / `run.botRun`) ne donne jamais de succès.
