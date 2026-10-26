# Lignées : consignes pour Claude

Jeu de gestion idle / roguelike en HTML, CSS et JavaScript, sans dépendance ni compilation (scripts classiques, objet global `G`). Version actuelle : **1.9**.

**Lire d'abord `reprise/REPRISE.md`** (passation complète), puis `DESIGN.md` (décisions, version par version).

## Essentiel
- Tout est en **français** : interface, commentaires, documents, échanges.
- Lancer le jeu : `python tools/serve.py 8766` (ou la configuration `lignees` de `.claude/launch.json`), puis http://localhost:8766.
- Données pures dans `js/data/`, moteur dans `js/core/`, affichage dans `js/ui/`. Ajouter du contenu revient le plus souvent à ajouter une entrée de données.
- Boutons : `data-action="nom:arg"`, traités dans `act()` (`js/ui/ui.js`). Vérifier qu'un `case` du même nom n'existe pas déjà.
- Jamais `confirm()` ni `alert()` (bloqués dans le navigateur intégré) : utiliser `confirmModal()`.
- Toute modification de `run.buildings` passe par `G.economy.rebuildGrid()`.
- Tout changement du format de sauvegarde demande une migration (`main.js` → `boot`, `metaV`).
- Tester avec le bot : `BOT(secondes, { origin, rig })` en console. **Sauvegarder d'abord la partie du joueur** (`lignees_backup_*`) et la restaurer ensuite.
- Mettre à jour `DESIGN.md` (section « V1.x ») à chaque version.
