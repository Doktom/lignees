# Lignées — Document de conception (V1)

> Titre provisoire. Légende : ✅ Validé · 🤖 Décidé par Claude (délégation) · 💡 Proposé · ❓ À définir · 🧪 À tester · 📦 Reporté

## Étape actuelle
- Étape 1 — Vision : ✅ validée par toi
- Étapes 2 à 9 — Boucle, ressources, progression, économie, roguelike, UI, technique, prototype : 🤖 décidées par Claude à ta demande (« prends toutes les décisions et fais une V1 »)
- **Prochaine étape : tu joues à la V1, puis on ajuste ensemble (étape 10 — tests et améliorations).**

## 1. Vision ✅
| Élément | Décision |
|---|---|
| Émotion | Optimiser une machine parfaite ; faire grandir quelque chose d'immense et sans limite |
| Thème | Exploitation de ressources et civilisation, histoire réelle (Antiquité → futur) |
| Construction | Grille avec bonus/malus de voisinage, stock commun |
| Rythme | Hybride : production hors ligne + bonus pour le joueur actif |
| Défense | Cellules de tours/murs sur la grille, vagues d'attaque, chefs ennemis |
| Public | Joueurs chevronnés, plusieurs niveaux de difficulté |
| Direction artistique | 2D, couleurs douces et lisibles, animations douces, UI moderne et propre |
| Rejouabilité | Effet roguelike « scalable » (demande ajoutée à l'étape 2) |

## 2. Boucle de jeu 🤖
**Boucle courte (minutes) :** produire → transformer → placer/réorganiser → rechercher → défendre la vague suivante.
**Boucle moyenne (ères) :** réunir les conditions d'ère → choisir un décret → nouveaux bâtiments, gisements, territoire.
**Boucle longue (parties) :** la partie se termine (chute du forum ou transmission volontaire) → points d'héritage → bonus permanents, origines, difficultés.

### Contraintes (ce qui crée les décisions)
1. **Espace** (principale) : territoire limité, expansion case par case à coût croissant. Chaque case de tour est une case qui ne produit pas.
2. **Main-d'œuvre** (secondaire) : si les emplois dépassent la population, *tout* ralentit.
3. **Stockage** : plafond commun par ressource ; il faut des entrepôts pour atteindre les gros coûts.
4. **Énergie** (ère industrielle) : nouvelle contrainte qui renouvelle le jeu.

### Modèle de production
Efficacité = main-d'œuvre × énergie × intrants disponibles. Les intrants sont consommés selon l'efficacité ; **les bonus (voisinage, technologies, décrets) ne multiplient que la production** → optimiser = produire plus avec autant.

### Logistique physique 🤖 (V1.2)
Les ressources n'existent plus dans un stock commun abstrait : elles sont **stockées dans les bâtiments** et **voyagent en cellules**.
- **Producteurs** : leur production attend dans leur stock de sortie (40 s de production). Plein → le bâtiment s'arrête.
- **Consommateurs** (ateliers, logements, tours…) : stock d'entrée de 20 s. La source disponible la plus proche leur envoie une cellule dès qu'il y a de la place.
- **Porteurs** : chaque expéditeur a un nombre limité de porteurs (2 par défaut, forum 3, entrepôt 4, +1 par niveau) et une charge par cellule (2, forum 3, entrepôt 4, +50 % par niveau). Un porteur est occupé pendant l'aller-retour à 1,5 case/s → **débit = porteurs × charge / aller-retour** : les chaînes courtes sont plus efficaces.
- **Entrepôts** : reçoivent le surplus des producteurs proches (au-delà de 40 % de leur stock de sortie) et ravitaillent les bâtiments alentour.
- **Forum** : ne reçoit pas de livraisons ; sa réserve garde les ressources de départ, le butin et les remboursements.
- **Dépenses** (construction, niveaux, réparations, ère, territoire, recherche) : prélevées dans les stocks les plus proches du chantier, avec une animation purement visuelle.
- Le total affiché = réserves + stocks de sortie (hors transit). Le savoir n'est pas transporté.
- Valeurs dans `G.LOGI` (`js/data/buildings.js`), moteur dans `js/core/logistics.js`.

### Interface V1.2 🤖
- Clic sur une case : l'onglet Construire met en surbrillance ce qui peut y être construit ; un clic sur une carte construit directement sur la case.
- Bâtiment choisi : les cases possibles sont en vert (pointillés ambre hors territoire).
- Infobulle des bâtiments : coût en texte avec le stock disponible.
- Case lointaine : bouton « Annexer jusqu'ici » (chemin le plus court, coût cumulé).
- **Tableau de bord** (barre du haut) : production, consommation, bilan, transit et répartition par ressource ; efficacité et alertes par type de bâtiment ; porteurs occupés.

### Vitesse, pause et mode Bot 🤖 (V1.3)
- Barre de vitesse dans la barre du haut : ⏸ (ou Espace), ×0,5, ×1, ×2, ×3 toujours disponibles.
- ×5 et ×10 se débloquent en jeu : technologie **Horlogerie** (Moyen Âge, après la Forge) → **Atelier d'horloger** (fer + outils → **rouages** ⏱️) et **Tour de l'horloge**. Tant que la tour est approvisionnée en rouages (0,02/s), ×5 est disponible ; ×10 avec la tour au niveau 2. Sans rouages, la vitesse retombe à ×3. Accélérer coûte donc des rouages.
- **Mode Bot** (Paramètres) : le bot joue la partie en cours ; un panneau sur la carte règle la vitesse de ×1 à ×10 (sans verrou) et permet de reprendre la main.

### Montée de niveau groupée 🤖 (V1.3)
Dans le panneau d'un bâtiment : « Monter les N au niveau suivant » pour tous les bâtiments du même type et du même niveau, avec le coût total ; si l'on ne peut pas tout payer, on monte ceux qu'on peut.

### Soldats des casernes 🤖 (V1.3)
Chaque caserne active (nourrie, avec main-d'œuvre) entretient une escouade : 2 soldats + 1 par niveau. Ils attendent autour de la caserne, interceptent les ennemis à moins de 5 cases, les **bloquent** au corps à corps (l'ennemi se retourne contre eux) et réapparaissent 20 s après leur mort. Ils se soignent au repos. Hoplites (Antiquité), Sergents (Moyen Âge), Fusiliers (industrie) ; dégâts et PV suivent le niveau de la caserne et les bonus de dégâts des tours et de PV. Données : `G.SOLDIERS`.

### Lore 🤖 (V1.2)
**Maître Hulotte**, chouette archiviste de la Grande Chronique, commente la partie avec un humour léger : début de partie, annonce et fin des vagues, chefs, pillages, ruines, forum en danger, découvertes, niveaux, annexions, changements d'ère, retour d'absence, stocks pleins, bâtiments en attente. Répliques dans `js/data/lore.js`, désactivable dans les paramètres.

## 3. Ressources 🤖
| Ère | Brutes | Transformées | Usage principal |
|---|---|---|---|
| Antiquité | Nourriture, Bois, Pierre, Cuivre, Étain | Bronze, Outils, Armes | Construire, nourrir, armer les tours |
| Moyen Âge | Minerai de fer | Planches, Charbon de bois, Fer, Farine, Pain | Maisons (pain), forges, tours d'arbalétriers |
| Industrielle | Charbon, Laine | Acier, Machines, Textiles | Énergie, immeubles, artillerie |
| Toutes | — | Savoir | Recherche |

Chaînes clés : cuivre + étain → bronze → outils/armes · nourriture → farine → pain → maisons · minerai de fer + charbon de bois → fer → outils/armes · charbon → énergie → acier → machines.

## 4. Progression 🤖
- **3 ères en V1** : Antiquité, Moyen Âge, Ère industrielle. La dernière continue sans limite (technologies répétables, vagues infinies).
- **Passer d'une ère** : une technologie clé ⭐ + des ressources transformées. Récompenses : un anneau de territoire gratuit, un décret majeur, des gisements révélés (une carrière peut se révéler posée sur du fer !), de nouveaux ennemis.
- **Logements évolutifs** : Hutte → Maison (pain) → Immeuble (textiles), améliorés sur place.
- **Niveaux de bâtiment** 🤖 (V1.1) : tout bâtiment monte de niveau sur place (max 3 à l'Antiquité, 4 au Moyen Âge, 5 à l'ère industrielle). Par niveau : +75 % production/consommation/stocks, +50 % emplois, +50 % habitants, +40 % dégâts des tours, +75 % capacité d'entrepôt, +25 % PV (+60 % pour les murs). Coût : 1,5 × le coût de construction, puis ×1,9 par niveau, avec outils (niv. 3), outils + fer (niv. 4), acier + machines (niv. 5). Répond à la contrainte d'espace : densifier plutôt que s'étendre. Valeurs dans `G.LEVELS`.
- **Rythme mesuré (bot de simulation)** : Moyen Âge en ~20-40 min, ère industrielle en ~55-70 min.

## 5. Défense 🤖
- Vague toutes les ~3 min (première à 5 min), **direction annoncée 30 s avant** (flèches + bandeau).
- Les ennemis visent le bâtiment le plus proche : murs et palissades servent d'appât.
- Un chef 👑 toutes les 5 vagues. Les ennemis grandissent à chaque vague et changent à chaque ère.
- Victoire : butin. Si la vague traîne (90 s), les survivants fuient en emportant jusqu'à 30 % des réserves.
- Bâtiments détruits → ruines à réparer. **Forum détruit = fin de la partie.**
- **Hors ligne : les vagues sont suspendues** (décision prise après test : sinon le joueur revenait face à des vagues impossibles).

## 6. Roguelike et rejouabilité 🤖
- **Carte procédurale** à chaque partie (rivières, forêts, collines, gisements) : 31×31 cases (V1.1, contre 21×21), territoire de départ 9×9. Les ennemis apparaissent à 6 cases du territoire, pas au bord de la carte. Les anciennes sauvegardes sont migrées (ancienne carte recopiée au centre).
- **Origines** (choisies au départ) : Cité fluviale, Peuple des forêts, Clan des collines, Tribu guerrière — elles modifient la carte et le style.
- **Décrets majeurs** : 1 parmi 3 au départ et à chaque ère (13 décrets, dont 4 « risqués »).
- **Faveurs mineures** : 1 parmi 3 toutes les 5 vagues repoussées (cumulables).
- **Héritage** (méta-progression) : 8 améliorations permanentes, déblocage des origines.
- **Difficulté** (V1.4), choisie avant la partie : **Paisible** par défaut (aucun envahisseur, héritage ×0,75), puis **+**, **++**, **+++** (héritage ×1,25 / ×1,6 / ×2). Atteindre l'ère industrielle débloque le niveau suivant. En Paisible, les bâtiments militaires sont masqués.

## 7. Interface 🤖
Barre du haut (ère, population/emplois, énergie, vague, PV du forum) · ressources à gauche avec taux et jauges · carte au centre (zoom, déplacement) · onglets Construire / Recherche / Civilisation à droite · panneau de détail du bâtiment sélectionné · conseiller contextuel · aperçu des bonus de voisinage pendant le placement.

## 8. Technique 🤖
- **Plateforme** : navigateur, HTML/CSS/JavaScript sans dépendance ni compilation.
- **Rendu** : Canvas 2D pour la carte, DOM pour l'interface.
- **Architecture** : données séparées de la logique (`js/data/*`), moteur (`js/core/*`), affichage (`js/ui/*`). Ajouter un bâtiment, une techno ou un décret = ajouter une entrée de données.
- **Sauvegarde** : automatique (10 s) dans le navigateur, export/import texte.
- **Outils de dev** : `tools/serve.py` (serveur local sans cache), `tools/bot.js` (joueur automatique pour l'équilibrage).

## V1.4 — profondeur 🤖
Toutes les idées de la liste ont été retenues (« ok pour tout »), livrées en lots :
- **Tours** : +0,5 case de portée par niveau ; au niveau 3, spécialisation définitive (Longue-vue +1,5 portée, Cadence +50 %, Mitraille dégâts de zone).
- **Casernes** : ordres (défendre la caserne, garder le forum, point de ralliement choisi sur la carte).
- **Routes** : les porteurs y vont 2,5× plus vite ; chemins calculés (Dijkstra, 8 directions), les cellules suivent les routes. Tracé en glissant la souris, prix fixe (2 pierres), ignorées par les ennemis.
- **Contrats de la Chronique** : jusqu'à 3 objectifs datés (produire, livrer au forum, posséder N bâtiments, atteindre un niveau) → héritage + faveur ou ressources. Donnent un but au mode Paisible.
- **Événements à choix** toutes les 5-7 min (caravane, incendie, réfugiés, récolte, ruines, fête, épidémie, grève des porteurs, érudit, filon, encrier de Hulotte) avec effets temporaires affichés en haut.
- **Ennemis variés** : voleurs (dérobent les cellules en transit puis fuient ; butin récupéré si on les abat), sapeurs (visent les réserves, dégâts ×3).
- **Confort et bonheur** : bois (huttes), vin (maisons), vin + meubles (immeubles). Le bonheur moyen donne jusqu'à +20 % de production. Nouvelles filières : vignoble → pressoir (Viticulture), ébénisterie (Mobilier).
- **Entrepôts spécialisés** (ressources acceptées au choix) et **priorités de livraison** (basse, normale, haute).
- **Recettes au choix** : atelier (outils/armes), scierie (planches/charbon de bois), forge (outils/armes/rouages), usine (machines/outils/meubles).
- **Gisements épuisables** (`G.DEPOSITS`) : la case redevient colline ; il faut trouver un nouveau filon.
- **Saisons** de 4 min : printemps et été favorables, hiver rigoureux (nourriture −40 %, chauffage au bois pour chaque logement, neige sur la carte).
- **Merveilles** (une par ère, uniques) : chantier alimenté par les porteurs ; Grande Bibliothèque (savoir +50 %), Cathédrale (population +15 %, production +5 %), Exposition universelle (production +20 %, porteurs +25 %).
- **Marché** : offres d'échange renouvelées toutes les 3 min, meilleures avec le niveau du marché (`G.VALUES`).
- **Succès** (16, onglet Succès de l'écran Lignées) : héritage permanent ; jamais en mode Bot ni dans une partie lancée par le bot.
- **Vue logistique** (bouton sur la carte) : trafic récent par liaison, état des bâtiments.
- **Courbes** : tendance des 15 dernières minutes par ressource et population dans le tableau de bord.
- **Bot** : défense dimensionnée sur la prochaine vague et sur la couverture des bâtiments, montées de niveau régulières, goulots repérés, mines épuisées remplacées, merveilles, marché. Les simulations ne modifient plus la progression du joueur.

## V1.5 — cinq ères, maîtrise, vaisseau 🤖
- **Cinq ères** : **Préhistoire** (nouvelle, au début : cueilleurs, huttes, bois, pierre ; passage par la technologie Agriculture), Antiquité, Moyen Âge, Ère industrielle, **Ère spatiale** (nouvelle, à la fin). Les sauvegardes existantes sont décalées d'une ère.
- **Ressources rares** sur la carte, loin du centre : marbre (Antiquité), or (Moyen Âge), gemmes (industrie). Recettes : sculpteur (marbre → sculptures, ou pierre de taille), orfèvrerie (or → bijoux, ou or + gemmes → parures), électronique (machines + or), alliages (acier + gemmes). Elles entrent dans les merveilles, le vaisseau, le confort des résidences et valent cher au marché.
- **Ère spatiale** : informatique, raffinage, solaire, matériaux composites, fusées, systèmes de survie, puis **Vaisseau interstellaire** → **pas de tir** (chantier : alliages, électronique, carburant, bijoux, sculptures). Une fois achevé, le **lancement** termine la partie en triomphe : héritage ×1,5 + 50, et 15 gloire.
- **Gloire ✨** (monnaie permanente) : gagnée en atteignant une ère (2, 3, 4, 6), en achevant une merveille (5) et au lancement (15). Jamais en mode Bot.
- **Cartes et maîtrise** (écran Lignées → Maîtrise) : une carte ciblée coûte 1 + ère du bâtiment ; un paquet de 3 cartes au hasard coûte 5. Maîtrise d'un type de bâtiment : niveau n = production (ou habitants, ou dégâts) et stocks ×n. Passer au niveau n+1 coûte 2^(n-1) cartes (1, 2, 4, 8…), jusqu'à ×10.
- **Nouvelles améliorations d'héritage** : Guilde des porteurs (+1 porteur), Sandales légères (porteurs plus rapides), Greniers ancestraux (stockage), Sourciers (gisements plus riches), Archives (technologies connues au départ), Maîtres d'œuvre (niveau max +1), Réseau de notaires (+1 contrat, récompenses +25 %), Hérauts (+1 gloire par ère).
- **Emplacements de sauvegarde** (Paramètres) : 6 copies complètes indépendantes (héritage, gloire, cartes, partie), à sauvegarder, charger ou supprimer ; « Nouvelle lignée vierge » pour repartir de zéro.
- Le bot épargne les ressources exigées pour l'ère suivante et met en pause leurs consommateurs.

## V1.6 — électricité, Préhistoire, confort du bot 🤖
- **Réseaux électriques** : les centrales et les **relais électriques** 🗼 qui se touchent (haut, bas, gauche, droite) forment un réseau. Un bâtiment électrique doit toucher un nœud du réseau ; les bâtiments raccordés se partagent le courant. Non raccordé = arrêt (badge 🔌). Les centrales ne brûlent que ce que le réseau demande (veille 💤 sinon). Petits éclairs jaunes sur chaque contact ; pendant le placement d'un bâtiment électrique, le réseau et les cases raccordables sont en jaune.
- **Centrales** : à bois (6 ⚡, bois), à vapeur (14 ⚡, charbon), éolienne (5 ⚡, vent : automne ×1,3, été ×0,8), panneaux solaires (12 ⚡, soleil : été ×1,4, hiver ×0,5), nucléaire (90 ⚡, uranium : nouvelle ressource rare de l'ère spatiale).
- **Préhistoire enrichie** : cabane de chasseur (nourriture + peaux), tanneur (vêtements), tailleur de silex (premiers outils), grand foyer (huttes voisines +25 %), grotte ornée (savoir), merveille Cercle de pierres (production +10 %), événement « troupeau de mammouths ». Passage à l'Antiquité : il faut aussi 5 outils et 10 vêtements.
- **Recherche** : les recherches terminées sont masquées (case à cocher pour les réafficher).
- **Mode Bot** : vitesse jusqu'à ×20 ; case « gagner de la gloire pendant que le bot joue » (les succès restent réservés au joueur). Le bot raccorde ses bâtiments électriques (relais) et ajoute des centrales.

## V1.6.1 — gisements inépuisables 🤖
Les cases de ressources (gisements de cuivre, étain, fer, charbon, marbre, or, gemmes, uranium) **ne s'épuisent plus jamais** : `G.DEPOSITS_INFINITE = true` (dans `js/data/progression.js`) désactive l'épuisement ; mettre `false` rétablit l'ancien comportement (quantités de `G.DEPOSITS`, case qui redevient colline). Le panneau d'une mine affiche « ∞ inépuisable ». Les gisements déjà épuisés dans une partie en cours sont **rétablis au chargement** (`G.map.restoreDeposits`). L'amélioration d'héritage « Sourciers » n'a plus d'effet tant que l'interrupteur est actif. Les mines restent limitées par leur main-d'œuvre, leurs porteurs et la place : seule la rareté du gisement disparaît.

## V1.6.2 — fin de partie du bot et territoire 🤖
**Problème observé :** le bot n'accumulait pas d'acier en fin de partie, donc ni alliages, ni électronique, ni carburant, et le pas de tir ne se terminait pas. Causes trouvées par simulation :
1. **Impasse du territoire** : une case coûtait de l'acier (ère industrielle) puis des alliages (ère spatiale), alors qu'il faut une case libre pour construire le haut fourneau qui fabrique l'acier. **Règle de jeu modifiée** : une case coûte désormais des *outils* (toujours abondants) à partir de l'ère industrielle, et plus d'alliages (`tileCost`, `js/core/logic.js`).
2. **Achats de cases en excès** : chaque construction ratée annexait des cases (63 achats, +8,5 % par case). L'annexion automatique du bot est limitée aux gisements, forêts, eau et collines libres ; les achats « de remplissage » sont plafonnés (14 + 8 par ère), bon marché (≤ 25 % du stock) et près du centre.
3. **Gaspillage** : les producteurs dont tous les stocks sont très abondants (≥ 4 000) sont mis en pause puis relancés sous 2 000 (`balance()`), ce qui libère fer, bois et charbon (les forges fabriquaient 40 000 outils inutiles).
4. **Place** : un bâtiment de la chaîne (haut fourneau, usine, électronicien, fonderie d'alliages, raffinerie, orfèvrerie, sculpteur, horloger…) qu'on ne peut pas placer fait démolir un bâtiment superflu (`makeRoom()`). Un bâtiment électrique **enclavé** n'est plus démoli (boucle de construction-démolition qui empêchait l'électronique) : un voisin superflu est sacrifié pour poser une centrale à côté (`sacrifice()`).
5. **Objectif final** : le pas de tir passe avant tout dès qu'il est débloqué ; les autres merveilles ne sont plus commencées ; on réserve les ressources restant à livrer et leurs intrants (acier, gemmes, machines, or, charbon) ; le bot construit aussi l'horloger et la Tour de l'horloge (rouages) ; il choisit la meilleure tour payable (laser inclus).
6. **Simulation** : les débits sont désormais mesurés comme dans le vrai jeu (le bot décidait avec des débits nuls).
Mesure (Clan des collines, Paisible, 14 400 s) : avant, ère industrielle jamais dépassée ; après, ère spatiale avant 6 000 s (1 h 40) et **décollage à 10 031 s** (≈ 2 h 47). En Difficulté +, le bot atteint l'ère spatiale (≈ 1 h 40) et termine presque le pas de tir, mais tombe à une vague de chef vers la 24ᵉ : défense de fin de partie à rééquilibrer.

## Points ouverts ❓ / pistes 💡
- 💡 Pictogrammes : la V1 utilise des emojis ; à remplacer par un jeu d'icônes SVG cohérent.
- 💡 Ère suivante : futur proche (électricité, informatique), puis futur lointain (inventé).
- 💡 Ennemi récurrent : une civilisation rivale avec une identité propre (évoqué à l'étape 1).
- 💡 Événements aléatoires, merveilles, commerce.
- 🧪 Équilibrage fin à valider en jouant (le bot est un joueur volontairement naïf).
- 🧪 Rythme mesuré avec le bot (V1.4) : Paisible → industrie en ~84 min ; Difficulté + → industrie en ~39-60 min, sans chute ni dégât au forum. À valider en jouant.
- 💡 Outil de test : `BOT.live({ speed: 5 })` joue en direct à l'écran ; `BOT.stop()` rend la main.
- ❓ Nom définitif du jeu.

## Reporté 📦
- Approches alternatives de la défense : « la machine attire la menace », « le dernier rempart ».
- Règles de voisinage qui changent selon l'ère (pollution industrielle).
- Logistique physique (transport visible des ressources).

## V1.7 — Lisibilité (exigences, maîtrise, pas de tir, arbre)
- **Civilisation** : les exigences (passage d'ère, matériaux du vaisseau) s'affichent en lignes `.rq` : icône, nom, stock / demandé, jauge, ✔/✖ et « Manque N » (ou « Reste N à livrer · N en stock » pour le vaisseau).
- **Maîtrise** : bouton « Tout monter d'un coup » (`logic.masteryPlan` / `masteryUpAll`) et petite fenêtre récapitulative (`masteryRecap`) : niveaux gagnés, cartes utilisées, effet de chaque bonus.
- **Pas de tir 2×2** : champ `size: 2` dans les données ; `logic.footprint`, `canPlace` sur toutes les cases, `rebuildGrid` remplit les cases voisines (sans écraser un autre bâtiment, donc compatible avec les anciennes sauvegardes), rendu mis à l'échelle (`ctx.scale`) dans `render.js`.
- **Technologies en arbre** : bouton « Arbre des technologies » (fenêtre large, `techTreeModal`) ; une bande par ère, colonnes = profondeur des prérequis, liens SVG, états (découverte, prête, savoir insuffisant, verrouillée). Coûts ×1,35 (`G.TECH_COST_MULT`, arrondis à la dizaine).

## V1.8 — Retrouver ses chaînes, gloire différée, alertes
- **Surbrillance** : le bâtiment sélectionné entoure d'or (pointillés) les autres bâtiments du même type. Le bouton « 🔗 Chaîne de production » (`ui.chainView`, action `chainView`) voile la carte et relie les **fournisseurs** (bleu : produisent ce qu'il consomme) et les **clients** (orange : consomment ce qu'il produit) par des flèches ; le panneau les liste. Calcul : `G.ui.relations(b)` (mis en cache 1 s) ; dessin : `drawRelations` dans `render.js` (une version par moteur de rendu).
- **Infobulles de coût** : toute puce de coût (`costHtml`, annexion, exigences de civilisation) affiche besoin, stock, bilan et bâtiments producteurs (`costTip`).
- **Gloire différée** : `run.gloryV2` ; `gainGlory` n'ajoute plus à `meta.glory` mais à `run.gloryEarned` ; le versement se fait dans `endRun` (`gloryEarned − gloryPaid`). Migration dans `main.js` : les anciennes parties passent en V2 avec `gloryPaid = gloryEarned` (déjà versée). La gloire accumulée est visible dans l'onglet Civilisation.
- **Maîtrise** : bouton « Max ×N » par carte (`logic.cardMaxBuy` / `buyCardMax`), plafonné à ce qui reste pour atteindre la maîtrise maximale.
- **Alerte électricité** : `economy.powerAlerts()` — un bâtiment `energyIn` hors réseau ou à puissance < 5 % depuis 6 s déclenche une notification groupée (au plus une toutes les 25 s de jeu).

## V1.9 — Gloire progressive, vie après le décollage, cinématiques, récit
- **Gloire par paliers** : `G.GLORY.milestones` (24 paliers : population, bâtiments, recherches, vagues, niveaux, contrats, durée, ressources rares) vérifiés toutes les 5 s (`chronicle.checkGlory`, drapeaux dans `run.glorySeen`). Ères : [0, 1, 2, 3, 4], merveille 3, décollage 6 (avant : 5 et 15). Toujours versée à la fin de la partie (V1.8). Une partie courte rapporte déjà un peu (5 min = 1, 25 habitants = 1…).
- **Le décollage n'est plus la fin** : `logic.launch()` pose `run.launched` et la partie continue. Six recherches **infinies** (`p_*`, `post: true`, `repeat: 1.3`, `glory: 0.34` = 1 gloire toutes les ~3 recherches) s'ouvrent dans une bande « Au-delà des étoiles » de l'arbre (grille de 3 colonnes). `endRun` d'une lignée qui a décollé garde la raison `'launch'` (héritage ×1,5 et +50). La simulation du bot s'arrête au décollage.
- **Cinématiques** (`js/ui/cinematic.js`) : scènes canvas procédurales par ère (aube antique, château au crépuscule, cheminées et locomotive, pas de tir sous les étoiles) et décollage. Désactivables (Paramètres → Cinématiques), jamais en mode Bot. Barres de cinéma, titre, intro et citation de Hulotte (`G.CINE`).
- **Récit** (`js/data/story.js`) : 10 chapitres joués dans l'ordre (`G.CHAPTERS`, condition `when`, un toutes les 2 min au plus, jamais en vague). Les choix posent des drapeaux (`effects.flag` → `run.flags`) que les chapitres suivants relisent. 10 nouveaux événements aléatoires, ~35 nouvelles répliques (ambiance par ère `ambient0..5`, paliers, chapitres).

## V1.9.1 — Trois interfaces au choix
Le thème Pastel doux (interface d'origine) rejoint les deux thèmes de l'édition à thèmes ; aiguilleur de rendu `render.js`, voir `STYLE.md`.

## V1.9.2 — Deux thèmes de plus
Néon orbital (futuriste) et Atelier d'aquarelle (artistique) ; extensions du moteur de rendu à palette, voir `STYLE.md`.
