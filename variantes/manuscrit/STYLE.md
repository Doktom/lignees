# Lignées — thèmes graphiques

Cette édition de Lignées 1.6 propose **deux thèmes graphiques**, au choix dans **Paramètres → Apparence** (changement immédiat, mémorisé). **Le gameplay est strictement identique** : un thème ne change que l'interface et le dessin de la carte.

| Thème | Esprit | Ambiance |
|---|---|---|
| **Chronique enluminée** (`manuscrit`, par défaut) | Manuscrit et carte de géographe sur un bureau de bois | Clair, chaleureux, encre et dorures |
| **Vapeur 1900** (`vapeur`) | Atelier d'ingénieur de la Belle Époque | Sombre mais doux, laiton, cuivre, patine, lueurs d'ambre |

Les deux prolongent le personnage de Maître Hulotte, archiviste de la « Grande Chronique » : le jeu *est* la Chronique.

---

## 1. Chronique enluminée

### Principes
1. **Tout est du papier et de l'encre.** Parchemin grainé, traits d'encre brune légèrement tremblés, lavis d'aquarelle, taches de vieillissement. Des ombres **dures décalées**, comme une gravure, jamais de flou sur l'interface.
2. **Des pigments, pas des couleurs.** Ocre, terre de Sienne, vert-de-gris, garance, lapis, or. L'or est réservé à ce qui compte (niveaux, merveilles, sélection).
3. **Des formes taillées.** Plaques aux angles coupés, filets doubles, bandes graduées, fleurons.
4. **Lisibilité d'abord.** Encre sombre sur papier clair ; vert-de-gris = bon, ocre = attention, garance = danger.
5. **Le monde est une carte.** Arbres dessinés, collines hachurées, pics ombrés, rivières cernées d'un trait de rive, routes en pointillés, frontières en tirets-points, terre inconnue hachurée.

### Palette
| Rôle | Valeur |
|---|---|
| Papier | `#f0e3bb` (fond), `#e6d5a3` (creux), `#f7edcf` (fiches) |
| Encre | `#2b1d12` ; atténuée `#7a6342` |
| Or | `#b8892b` ; reflet `#e3bd62` |
| Garance (danger, action principale) | `#9b2d20` ; bordeaux `#7a2a1d` |
| Vert-de-gris (bon) | `#3f7a52` / `#3f7d6b` |
| Lapis (info, soldats) | `#2f4a8a` |
| Cuir (barre du haut) | `#3a2418` → `#4b3022` |
| Bureau | `#35261a` |

### Typographie
**Cinzel** (titres, onglets, étiquettes), **Cinzel Decorative** (marque, passage d'ère), **EB Garamond** (texte et chiffres, italique pour les répliques).

### Carte
Bureau de bois, carte posée avec son ombre ; lavis par case, quadrillage de géomètre, littoral à double trait, décors à l'encre ; grain, taches, bords assombris, **cadre gradué à fleurons** ; bâtiments en **jetons de carton** à double filet encre et or, niveaux en **étoiles d'or** ; routes en **pointillés** ; vignette de bougie et **rose des vents**.

---

## 2. Vapeur 1900

### Principes
1. **Sombre mais doux.** Jamais de noir pur : une suie chaude (`#1b1816`, `#292420`), du texte crème (`#eadfc4`) et non blanc. Le contraste vient des **métaux** et de la **lumière**, pas d'un fond noir.
2. **Quatre métaux et une lumière.** Laiton (`#c9a050`), cuivre (`#c4733f`), patine de bronze (`#4fa8a0`), fonte (`#2a2622`) ; l'**ambre** (`#f0b84a`) est la lueur des cadrans, des sélections et des étincelles.
3. **De la mécanique visible.** Rivets, engrenages, rails, cadrans, tubes de verre. Chaque information importante a un « instrument ».
4. **Lisibilité d'abord.** Les couleurs d'état sont éclaircies pour la fonte : patine `#7ccba0` = bon, ambre `#e7b04a` = attention, corail `#e8806d` = danger.

### Palette
| Rôle | Valeur |
|---|---|
| Suie (fond) | `#1b1816` ; panneaux `#292420`, creux `#221e1b`, fiches `#342d28` |
| Texte | crème `#eadfc4` ; atténué `#a8977a` |
| Laiton | `#c9a050` ; poli `#e8c372` ; sombre `#7a5c28` |
| Cuivre (action principale) | `#c4733f` ; clair `#e29a62` |
| Patine (bon, sélection douce) | `#4fa8a0` / `#6fd0b0` |
| Ambre (lueur) | `#f0b84a` |
| Danger | `#e8806d` (texte), `#e0705f` (carte) |

### Typographie
**Playfair Display** (titres, en dégradé de laiton ; marque en italique gras) et **Crimson Pro** (texte et chiffres). Les chiffres des étiquettes sont ambrés avec un léger halo, comme des cadrans.

### Interface
- **Barre du haut** : fonte avec filet de laiton ; informations en **cadrans à verre sombre** ; l'ère est une **plaque de laiton** fendue.
- **Colonnes** : tôle sombre grainée, filet double de laiton, ombre intérieure.
- **Boutons** : laiton usiné ; action principale en **cuivre** ; survol avec halo.
- **Jauges** : **tubes de verre** creux à reflet.
- **Fenêtres** : plaques de fonte avec **rivets aux quatre coins**, double filet de laiton, titre en dégradé, engrenage ⚙ en séparateur.
- **Chroniqueur** : télégramme sur fonte, médaillon de laiton.

### Carte
- **Fond** : plaque de fonte brossée à rivets, en répétition ; carte posée avec une ombre portée.
- **Terrain** : lavis sombres et doux (olive, mousse, teal profond), **lignes de dessin claires ou sombres selon l'élément** pour garder la lecture, hachures de terre inconnue très sombres, frontière **ambre**.
- **Cadre** : bande de **laiton poli** à dégradé métallique, **rivets** réguliers, **engrenages** aux quatre angles.
- **Bâtiments** : **plaques de laiton** aux angles coupés, cadre extérieur laiton, gorge sombre intérieure, **quatre rivets**, reflet ; niveaux en **petits engrenages** ; sélection en **halo ambré**.
- **Routes** : **voies ferrées** (rails et traverses). **Réseau électrique** : losanges ambrés incandescents.
- **Combats** : projectiles lumineux, soldats bleu acier au casque de laiton.
- **Rose des vents** de laiton sur fond de fonte ; vignette plus sombre.

---

## Architecture des thèmes
- `js/ui/theme.js` : **registre** des thèmes. Chaque thème fournit (1) la palette des **données** (terrains, catégories, ères, ressources, ennemis, soldats, dérivée des couleurs d'origine du jeu), (2) la palette du **canvas** (traits, papier ou métal, plaques, jauges, cadre, bureau, rose des vents…), (3) un nom, une description et un échantillon de couleurs. `G.theme.apply(id)` bascule en direct.
- `css/themes/<id>.css` : la feuille de style de l'interface (chargée **après** `css/style.css`). Elle importe ses propres polices.
- `js/ui/render.js` : dessin de la carte **piloté par la palette** ; quelques branches propres à un style (cadre à graduations ou en laiton, rails ou pointillés, étoiles ou engrenages, halo de sélection, bureau de bois ou de fonte).
- Choix **mémorisé** dans le navigateur (`lignees_theme`) et dans les réglages de la partie (`meta.settings.theme`, donc inclus dans l'export/import de sauvegarde). Une page script en tête de `index.html` charge la bonne feuille de style **avant** le premier affichage (pas de clignotement).
- **Ajouter un thème** : (1) créer `css/themes/<id>.css`, (2) ajouter une entrée dans `THEMES` de `theme.js` (palettes données et canvas), (3) ajouter l'id à la liste blanche du script de `index.html`, (4) si besoin, une branche de rendu dans `render.js`.

## Lancer
```bash
python tools/serve.py 8771
```
Sauvegarde **séparée** de la version pastel (autre port = autre stockage du navigateur). Pour transférer une partie : **Paramètres → Exporter**, puis **Importer** dans l'autre version (le format est le même).

## Thème Pastel doux et aiguilleur de rendu (branche style-tests)
- Trois thèmes au choix (Paramètres → Apparence) : **Pastel doux** (l'interface d'origine, V1), **Chronique enluminée** et **Vapeur 1900**.
- Deux moteurs de rendu de la carte : `js/ui/render-classic.js` (cases arrondies, utilisé par Pastel) et `js/ui/render-palette.js` (piloté par la palette, utilisé par les deux autres). `js/ui/render.js` est un aiguilleur : il lit `G.theme.canvas.renderer` (`'classic'` ou `'palette'`) et conserve la caméra au changement.
- Pastel n'a pas de feuille `css/themes/` (`sheet: false`) : la feuille de base `style.css` suffit. Ses données de couleur sont celles d'origine (aucune transformation).
- Pour un nouveau thème : copier une entrée de `theme.js`, ajouter son id à la liste de l'en-tête de `index.html`, et soit une palette (`renderer` omis), soit son propre moteur dans `G.renderers`.

## Thèmes « Néon orbital » et « Atelier d'aquarelle »
Cinq thèmes au total (Pastel doux, Chronique enluminée, Vapeur 1900, Néon orbital, Atelier d'aquarelle).
- **Néon orbital** (`neon`, futuriste) : nuit bleue, plaques « holo » (verre sombre, teinte translucide, contour lumineux, repères d'angle), routes en faisceau, niveaux en chevrons, cadre HUD, fond en grille, terrain lumineux (`glowDecor`) avec lignes de balayage (`scan`). Polices Orbitron et Rajdhani.
- **Atelier d'aquarelle** (`atelier`, artistique) : papier chaud, lavis d'aquarelle (`washStyle: 'paint'`, taches irrégulières qui se mêlent), plaques de gouache au contour fait main (`plaque.style: 'paint'`, `wob()`), coins arrondis (`corner: 'round'`), routes au pinceau, niveaux en points de peinture, cadre peint avec rubans de masquage, fond de toile. Polices Caveat et Quicksand.
- Nouvelles clés de palette du canvas, toutes facultatives (les anciens thèmes ne changent pas) : `corner`, `washStyle`, `glowDecor`, `scan`, `mapShadow`, `selGlow`, `selLine`, `plaque.style` (`holo` | `paint`) et `plaque.back`, `frame` (`hud` | `paint`), `desk` (`grid` | `canvas`), `road.kind` (`beam` | `brush`), `level` (`pip` | `dot`).
