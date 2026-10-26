# Lignées — dossier de reprise (version 1.6)

> Document de passation pour reprendre le développement dans une nouvelle session Claude.
> Il complète `DESIGN.md` (décisions de conception, détaillées version par version) et `README.md`.
> Date : 24 octobre 2026.

---

## 1. Le projet en une minute

**Lignées** est un jeu de gestion idle / incrémental avec une dimension roguelike, jouable dans le navigateur.
Le joueur fait grandir une civilisation de la **Préhistoire** à l'**ère spatiale** sur une grille (31×31) où le placement compte. La partie s'achève par le **lancement d'un vaisseau spatial**, par la chute du forum, ou par une transmission volontaire. Le joueur gagne alors de l'**héritage** et de la **gloire**, qui renforcent les parties suivantes.

- **Technique** : HTML + CSS + JavaScript, **sans dépendance ni compilation** (scripts classiques, pas de modules). Rendu de la carte en Canvas 2D, interface en DOM.
- **Langue** : tout est en **français** (interface, code commenté, documents). Le propriétaire du projet écrit en français.
- **Taille** : environ 6 700 lignes réparties en 26 fichiers.

## 2. Lancer le jeu

```bash
python tools/serve.py 8766
```
Ouvrir ensuite http://localhost:8766. C'est un serveur sans cache : un rechargement suffit pour voir les modifications.

Dans Claude Code (application de bureau), la configuration `.claude/launch.json` s'appelle `lignees` (port 8766). On la démarre avec `preview_start { name: "lignees" }`, puis on teste dans le navigateur intégré.

> ⚠️ La sauvegarde du joueur vit dans le `localStorage` du navigateur (clé `lignees_save_v1`), donc **pas dans les fichiers**. Pour la transporter : en jeu, **Paramètres → Exporter**, garder le texte, puis **Importer** dans le nouveau navigateur.

## 3. Architecture

```
index.html            page ; ordre de chargement des scripts (important : tout passe par l'objet global G)
css/style.css         style (thème clair, tokens CSS en tête de fichier)
js/core/util.js       G.util : aléatoire déterministe, formatage (fmt, fmtFlow, fmtTime)
js/data/              DONNÉES PURES (aucune logique)
  resources.js        G.RESOURCES (era, group base/craft/special, rare, uncapped pour le savoir)
  terrain.js          G.TERRAIN (gisements g_* avec revealEra), G.visibleTerrain()
  buildings.js        G.BUILDINGS, G.BUILD_CATEGORIES, G.LOGI (logistique), G.LEVELS (niveaux)
  progression.js      G.ERAS, G.TECHS, décrets, G.ORIGINS, G.HERITAGE, G.RIGUEUR (difficulté),
                      G.ENEMIES, G.WAVES, G.SOLDIERS, G.SEASONS, G.DEPOSITS, G.HAPPINESS,
                      G.VALUES (marché), G.TOWER_SPECS, G.SQUAD_ORDERS, G.GLORY
  lore.js             G.LORE : répliques de Maître Hulotte par événement
  events.js           G.EVENTS (événements à choix), G.CONTRACT_REWARDS
  achievements.js     G.ACHIEVEMENTS
js/core/              MOTEUR
  map.js              génération procédurale, migrations de carte, ajout des gisements rares
  mods.js             agrège tous les bonus (technos, décrets, origine, héritage, difficulté,
                      effets temporaires, saison, merveilles) dans G.M
  state.js            méta (persistante) + partie (run), sauvegarde, emplacements de sauvegarde
  economy.js          tick économique : logements, main-d'œuvre, électricité, production,
                      recettes, confort/bonheur, saisons, gisements, maîtrise, merveilles
  logistics.js        stocks physiques, porteurs, cellules en transit, chemins (Dijkstra), dépenses
  power.js            réseaux électriques (contact entre centrales/relais/consommateurs)
  defense.js          vagues, ennemis (voleurs, sapeurs), tours, soldats des casernes
  logic.js            actions du joueur : construire, niveaux, recherche, ères, annexion, marché,
                      gloire/cartes/maîtrise, lancement du vaisseau, fin de partie, conseiller
  chronicle.js        contrats, événements, effets temporaires, succès, historique (courbes)
  bot.js              joueur automatique (mode Bot du jeu + simulations BOT() en console)
js/ui/
  render.js           carte canvas (terrain en cache, bâtiments, routes, cellules, combats,
                      réseau électrique, zones de placement, vue logistique, neige)
  lore.js             bulle du chroniqueur
  ui.js               toute l'interface DOM (barres, onglets, panneaux, fenêtres, actions)
js/main.js            démarrage, migrations de sauvegarde, boucle de jeu, hors ligne, autosave
tools/serve.py        serveur de développement sans cache
```

### Boucle de jeu (`main.js`)
- Combat à pas fixe de 0,05 s (`G.defense.update`).
- Économie à pas fixe de 0,2 s (`G.economy.tick`, puis `G.chronicle.update`).
- Vitesse = `G.ui.speed()`. Pause joueur : `G.userPaused`. Pause des fenêtres : `G.paused`.
- Hors ligne : simulation par pas de 2 s avec `G.offlineSim = true` (pas d'animations ni d'événements, vagues suspendues).

### Interface (`ui.js`)
- Tous les boutons utilisent `data-action="nom:argument"`, dispatché dans **`act()`** (un grand `switch`).
- Le rafraîchissement a lieu toutes les 0,25 s : `refresh()` puis `setHTML(el, html)`, qui ne réécrit que si le HTML a changé.
- Fenêtres : `openModal(kind, html, { noPause, cls })`. Les confirmations passent par `confirmModal()`, jamais par `confirm()` (voir les pièges).

### État
- `G.meta` (persistant) : `heritage`, `glory`, `cards`, `mastery`, `levels` (arbre d'héritage), `origins`, `maxRigueur`, `achievements`, `stats`, `history`, `settings` (`speed`, `lore`, `botGlory`, `rateUnit`), `metaV` (version de migration, actuellement **3**).
- `G.run` (la partie en cours) : `tiles`, `owned`, `buildings` (chacun avec `bid`, `type`, `x`, `y`, `level`, `hp`, `inp`, `out`, `store`, `trips`, `recipe`, `prio`, `accept`, `spec`, `order`, `rally`, `progress`, `done`…), `res` (totaux recalculés), `transit`, `lt` (horloge logistique), `contracts`, `timed`, `deposits`, `prodTotal`, `wave`, `stats`, `techs`, `decrees`…
- Les champs préfixés `_` sur les bâtiments sont des **valeurs calculées à chaque tick** (`_eff`, `_mult`, `_full`, `_missing`, `_waiting`, `_slow`, `_power`, `_throttle`…).

## 4. Les mécaniques, système par système

| Système | Où | L'essentiel |
|---|---|---|
| Ères (5) | `G.ERAS` | Préhistoire 0, Antiquité 1, Moyen Âge 2, Industrie 3, Spatiale 4. On passe d'ère avec une technologie ⭐ et des ressources. |
| Difficulté | `G.RIGUEUR` | 0 = Paisible (aucune vague). Atteindre l'industrie (ère 3) débloque le niveau suivant (+, ++, +++). |
| Logistique | `logistics.js`, `G.LOGI` | Stocks physiques ; porteurs limités, occupés pendant l'aller-retour ; routes ×2,5 ; entrepôts, filtres, priorités. |
| Électricité | `power.js` | Réseaux par contact orthogonal (centrales + relais) ; les consommateurs touchent un nœud ; les centrales ne produisent qu'à hauteur de la demande. |
| Niveaux | `G.LEVELS` | Par bâtiment : +75 % de production par niveau. Maximum selon l'ère, plus Maîtres d'œuvre. |
| Maîtrise | `G.GLORY`, `meta.mastery` | Par type de bâtiment, permanente : niveau n = ×n production et stocks. Coût 2^(n−1) cartes. Les cartes s'achètent en gloire. |
| Héritage | `G.HERITAGE` | Arbre d'améliorations permanentes (17 nœuds). |
| Confort | `comfort` sur les logements | Bonheur → jusqu'à +20 % de production. |
| Saisons | `G.SEASONS` | 4 saisons de 4 min : nourriture, chauffage l'hiver, vent et soleil pour les centrales renouvelables. |
| Gisements | `G.DEPOSITS` | **Inépuisables** depuis la V1.6.1 (`G.DEPOSITS_INFINITE`). Ressources rares : marbre, or, gemmes, uranium. |
| Chronique | `chronicle.js` | Contrats (3), événements toutes les 5 à 7 min, effets temporaires, succès, courbes. |
| Défense | `defense.js` | Vagues, voleurs (volent les cellules en transit), sapeurs, soldats de caserne avec ordres, spécialisation des tours. |
| Fin | `logic.launch()` | Pas de tir (merveille) → lancement → `endRun('launch')` : héritage ×1,5 + 50, gloire +15. |

Les valeurs chiffrées et les justifications sont dans `DESIGN.md` (sections V1.1 à V1.6).

## 5. Tester et équilibrer avec le bot

Dans la console du navigateur, sur la page du jeu :
```js
BOT(5400, { origin: 'collines', rig: 0 })   // simule une NOUVELLE partie en accéléré (5400 s de jeu) et renvoie un journal
BOT.live({ speed: 5 })                     // nouvelle partie jouée en direct à l'écran
G.bot.start({ speed: 10 })                 // le bot joue la partie EN COURS (comme Paramètres → Mode Bot)
G.bot.stop()
```
- `rig` : 0 = Paisible, 1 à 3 = difficultés. Origines : `fluviale`, `forets`, `collines`, `guerriers`.
- Une simulation de 3 h de jeu prend 30 à 70 s. Dans l'outil `javascript_tool` (limité à 45 s), lancez-la dans un `setTimeout` qui écrit le résultat dans `window.__botOut`, puis relisez cette variable dans un second appel.
- Les simulations **restaurent la méta** (héritage, gloire, succès) à la fin, mais **remplacent la partie en cours**. Avant de tester, sauvegardez la partie du joueur : `localStorage.setItem('lignees_backup_X', localStorage.getItem('lignees_save_v1'))`. Pour la restaurer ensuite : `G.wiping = true; localStorage.setItem('lignees_save_v1', localStorage.getItem('lignees_backup_X')); location.reload()`.
- Les parties lancées par le bot sont marquées `run.botRun` : jamais de succès, et pas de gloire sauf si l'option `settings.botGlory` est cochée.

**Repères mesurés avec le bot en V1.6** (Clan des collines, Paisible) : Antiquité en 8 min, Moyen Âge en 17 min, industrie en 33 min, ère spatiale en 72 min. En V1.5, sans électricité, il lançait le vaisseau en 111 min.

## 6. Pièges connus (à lire avant de coder)

1. **`confirm()` et `alert()` sont bloqués** dans le navigateur intégré de l'application (ils renvoient `false` immédiatement). Utilisez toujours `confirmModal()` (`ui.js`).
2. **Noms d'actions en double** dans le `switch` de `act()` : le premier `case` gagne. Il y a déjà eu un conflit `pause` (bâtiment) contre `gamePause` (jeu). Vérifiez avec `grep "case 'nom'"` avant d'en ajouter un.
3. **Le DOM est réécrit toutes les 0,25 s** (minuteur de vague, durée…) : les références `ref_N` de l'outil `find` deviennent vite périmées. Cliquez par `data-action` en JavaScript, ou par coordonnées.
4. **Les captures d'écran du navigateur intégré ont parfois une image de retard** : vérifiez l'état en JavaScript plutôt que de vous fier à la capture.
5. **Modifier les fichiers sous Windows** : le Python du Microsoft Store ne voit pas le dossier temporaire de Claude si on lui passe un chemin. Écrivez le script avec l'outil Write, puis lancez `python - < script.py`. Dans les heredocs bash, `\'` et les accents posent problème : préférez les fichiers.
6. **Pas de Node** sur la machine : la syntaxe se vérifie en rechargeant la page et en lisant la console.
7. **Les index d'ère sont partout** (tableaux indexés par ère dans `ENEMIES`, `SOLDIERS.eras`, `LEVELS.maxByEra`, `LOOT_RES` (`defense.js`), `CONTRACT_REWARDS`, `GLORY.era`, les tableaux de `events.js`, les seuils de `tileCost`…). Ajouter une ère oblige à tout décaler, plus une migration (`metaV` dans `main.js`).
8. **Les migrations de sauvegarde** sont dans `main.js` (`boot`) et `map.js` (`migrate`, `addRares`). Toute évolution du format doit garder les anciennes sauvegardes jouables.
9. **Performances** : les champs de chemins sont mis en cache par bâtiment et invalidés seulement quand les routes changent (`G.roadKey` et `G.gridVer` dans `rebuildGrid`). Les réseaux électriques sont en cache par `G.buildVer`. Toute modification de `run.buildings` doit passer par `G.economy.rebuildGrid()`.
10. Les erreurs `Cannot read properties of null (reading 'b')` (ui.js:722) qu'on voit dans la console de ce navigateur sont **anciennes** (antérieures à la correction de la pause) : ce n'est pas un bug actuel.

## 7. État actuel et points d'attention

- **Partie du joueur** : ère spatiale, environ 212 bâtiments. Construite avant la règle électrique, elle a **27 bâtiments non raccordés**. Le joueur doit poser des relais (ou laisser faire le mode Bot, qui démolit les bâtiments enclavés).
- **Non testé à la main** : le bouton « Charger » d'un emplacement de sauvegarde (il recharge la page), et le rythme réel de la Préhistoire et de l'ère spatiale pour un joueur humain.
- **Équilibrage** : l'électricité ralentit l'industrie et l'ère spatiale. Le bot n'a pas lancé le vaisseau en 3 h en V1.6.
- **Bot** : il n'utilise presque jamais de relais (il préfère poser les bâtiments électriques contre les centrales). Il ne pose pas de routes et n'utilise pas le marché.

## 8. Pistes pour la suite

Celles du document de conception, et :
- Équilibrer la fin de partie (vaisseau atteignable en 2 h environ par un bon joueur).
- Laisser le bot poser des routes et des relais de façon planifiée (axes).
- Remplacer les emojis par un jeu d'icônes SVG cohérent.
- Ajouter une civilisation rivale (évoquée à la conception initiale).
- Ajouter de la pollution industrielle (malus de voisinage évolutif).
- Exporter et importer directement un emplacement de sauvegarde (fichier).
- Choisir le nom définitif du jeu (« Lignées » est provisoire).

## 9. Méthode de travail appréciée par le propriétaire

- Il écrit des demandes groupées (plusieurs fonctionnalités par message). On les découpe en **lots**, on les implémente et on **teste chaque lot** (simulations du bot et vérification dans le navigateur).
- Il aime qu'on lui **propose des idées avant une grosse mise à jour** quand il le demande, puis il valide (« ok pour tout »).
- On rend compte en français : ce qui est fait, ce qui est testé, ce qui ne l'est pas, les effets sur sa partie.
- **Ne jamais écraser sa sauvegarde sans copie** (`lignees_backup_*`), et la restaurer après les tests.
- On tient `DESIGN.md` à jour à chaque version (une section « V1.x »).

## 10. Historique des versions

| Version | Contenu |
|---|---|
| V1 | Base : 3 ères, grille, vagues, décrets, héritage, rigueur, bot de test. |
| V1.1 | Carte 31×31, stocks des bâtiments, niveaux, premières animations. |
| V1.2 | Logistique physique (porteurs, cellules), surbrillances, chroniqueur Maître Hulotte, annexer jusqu'ici, tableau de bord. |
| V1.3 | Vitesse et pause, Tour de l'horloge (×5, ×10), mode Bot, monter tous les bâtiments identiques, soldats des casernes. |
| V1.4 | Paisible par défaut et difficultés à débloquer, portée des tours, bot plus solide, 16 idées : routes, contrats, événements, voleurs et sapeurs, confort, saisons, recettes, gisements, entrepôts filtrés, merveilles, marché, spécialisations, ordres, succès, vue logistique, courbes. |
| V1.5 | Préhistoire et ère spatiale, ressources rares, vaisseau spatial, gloire, cartes et maîtrise, 8 nouveaux nœuds d'héritage, emplacements de sauvegarde. |
| V1.6 | Électricité par contact (relais, centrales à bois et à vapeur, éolienne, solaire, nucléaire, uranium), Préhistoire enrichie, recherches terminées masquées, bot à ×20 et gloire optionnelle. |

## 11. Édition à thèmes (`variantes/manuscrit/`), ajoutée après la V1.6

Copie **indépendante** du jeu, avec **deux thèmes graphiques** choisissables en direct dans **Paramètres → Apparence** :
- **Chronique enluminée** (par défaut) : parchemin, encre, dorures, carte de géographe sur un bureau de bois (Cinzel, EB Garamond).
- **Vapeur 1900** : fonte sombre et douce, laiton, cuivre, patine, lueurs d'ambre ; rivets, engrenages, rails, cadrans (Playfair Display, Crimson Pro).

Le gameplay est identique à la version pastel (dossier racine). Détails et architecture : `variantes/manuscrit/STYLE.md` ; consignes : `variantes/manuscrit/CLAUDE.md`.
- Fichiers propres : `css/themes/*.css`, `js/ui/theme.js` (registre + palettes), `js/ui/render.js` (carte pilotée par la palette), `index.html` (script d'en-tête qui charge la feuille du thème mémorisé).
- Lancement : configuration `manuscrit` de `.claude/launch.json` à la racine (port **8771**), ou `python variantes/manuscrit/tools/serve.py 8771`. `serve.py` lit aussi la variable `PORT` (indispensable avec l'aperçu de l'application, qui peut réattribuer le port).
- Sauvegarde **séparée** de la version pastel (autre port, autre stockage). Transfert : Paramètres → Exporter / Importer. Le thème choisi est mémorisé dans le navigateur et dans la sauvegarde (`meta.settings.theme`).
- ⚠️ Les deux dossiers divergent : un correctif de **gameplay** doit être reporté des deux côtés. Idée pour plus tard : factoriser le moteur et ne garder que les thèmes en variantes (la version pastel pourrait devenir un troisième thème : il faudrait une palette canvas « pastel » et ses branches de rendu à coins arrondis).
- Le dossier `reprise/lignees-v1.6.zip` ne contient **pas** cette édition.
- Piège rencontré : le port 8767 a été repris par un autre projet ; l'aperçu peut aussi réattribuer le port. Toujours vérifier le titre de la page.

## Version 1.7
Archives : `reprise/lignees-v1.7.zip` (pastel) et `reprise/lignees-v1.7-themes.zip` (édition à thèmes). Nouveautés : voir DESIGN.md, section V1.7 (exigences lisibles, maîtrise en série, pas de tir 2×2, arbre des technologies, coûts de recherche ×1,35).

## Version 1.8
Archives : `reprise/lignees-v1.8.zip` et `reprise/lignees-v1.8-themes.zip`. Nouveautés : DESIGN.md, section V1.8.

## Version 1.9
Archives : `reprise/lignees-v1.9.zip` et `reprise/lignees-v1.9-themes.zip`. Nouveautés : DESIGN.md, section V1.9 (gloire par paliers, décollage non terminal, cinématiques, chapitres).
