# Lignées — V1.5

Jeu de gestion idle / incrémental avec dimension roguelike : faites grandir une civilisation de la Préhistoire à l'ère spatiale sur une grille où le placement compte, défendez-la contre des vagues, et transmettez votre héritage d'une partie à l'autre, jusqu'au départ en vaisseau spatial.

## Lancer le jeu
Serveur local (recommandé) :
```bash
python tools/serve.py
```
puis ouvrir http://localhost:8765

Le jeu n'utilise aucune dépendance ni compilation ; ouvrir `index.html` directement devrait aussi fonctionner.

## Structure
```
index.html          page du jeu
css/style.css       style visuel
js/data/            contenu (ressources, terrains, bâtiments, technologies, ères, décrets, ennemis)
js/core/            moteur (carte, modificateurs, économie, défense, règles, sauvegarde)
js/ui/              affichage (carte canvas, interface)
js/main.js          boucle de jeu, hors ligne, sauvegarde automatique
tools/serve.py      serveur de développement sans cache
js/core/bot.js      joueur automatique (mode Bot du jeu, tests d'équilibrage)
DESIGN.md           document de conception (décisions, pistes)
CLAUDE.md           consignes lues automatiquement par Claude Code
reprise/            dossier de reprise : passation complète, prompt de démarrage, archive de la version
variantes/manuscrit/ déclinaison graphique « Chronique enluminée » (même gameplay, autre direction artistique)
```

## Équilibrage avec le bot
Dans la console du navigateur, sur la page du jeu :
```js
BOT(7200, { origin: 'fluviale', rig: 1 })   // simulation éclair d'une nouvelle partie
BOT.live({ speed: 5 })                     // nouvelle partie jouée en direct à l'écran
```
Le bot simule une partie accélérée et renvoie un journal (ères, vagues, chute éventuelle).
Pour regarder le bot jouer la partie en cours : Paramètres → Mode Bot.
⚠️ Il modifie la progression d'héritage de la sauvegarde locale.
