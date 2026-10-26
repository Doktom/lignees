// Thèmes graphiques. Chaque thème fournit :
//  - une feuille de style (css/themes/<id>.css) pour l'interface ;
//  - une palette des DONNÉES (terrains, catégories, ères, ressources, ennemis, soldats), dérivée des couleurs
//    d'origine du jeu ;
//  - une palette du CANVAS (js/ui/render.js la lit) : traits, papier ou métal, plaques, jauges, cadre, bureau…
// Le thème choisi est mémorisé dans le navigateur (clé lignees_theme) et dans les réglages de la partie.
// Chargé après les fichiers de données et avant le moteur.
G.theme = (function () {
  const DEFAULT = 'manuscrit';
  const OK = /^#[0-9a-f]{6}$/i;

  function rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function hex(a) { return '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
  // Mélange une couleur avec une autre (t = part de `to`).
  function mix(from, to, t) {
    if (!OK.test(from) || !OK.test(to)) return from;
    const a = rgb(from), b = rgb(to);
    return hex(a.map((v, i) => v + (b[i] - v) * t));
  }

  // ---------- Couleurs d'origine, relevées avant toute transformation ----------
  const base = { terrain: {}, cats: G.BUILD_CATEGORIES.map(c => c.color), eras: G.ERAS.map(e => e.color), res: {}, enemies: [], soldiers: G.SOLDIERS.eras.map(e => e.color) };
  for (const k in G.TERRAIN) base.terrain[k] = G.TERRAIN[k].color;
  for (const k in G.RESOURCES) base.res[k] = G.RESOURCES[k].color;
  G.ENEMIES.forEach((era, i) => { base.enemies[i] = {}; for (const kind in era) base.enemies[i][kind] = era[kind].color; });

  // ======================================================================================
  // Thème 1 — Chronique enluminée : parchemin, encre, dorures.
  // ======================================================================================
  const MANUSCRIT = {
    id: 'manuscrit', name: 'Chronique enluminée', tagline: 'Chronique enluminée',
    desc: 'Parchemin, encre brune et dorures : une carte de géographe posée sur un bureau de bois. Clair et chaleureux.',
    swatch: ['#f0e3bb', '#b8892b', '#9b2d20', '#2b1d12'],
    data: {
      wash: { plaine: '#e8dcb4', fertile: '#d9d59b', foret: '#bcc58c', colline: '#e0c997', eau: '#a9c6c4', montagne: '#d6ccb2' },
      cat: { housing: '#dba68f', food: '#e2c57d', raw: '#bf9f6c', craft: '#cf8b6d', energy: '#d8be62', science: '#8fa1c8', storage: '#a9b4a0', military: '#b66b60', wonder: '#e4c45f', core: '#d9c57f' },
      era: ['#a9835a', '#c9a23f', '#4f66a3', '#5d7b72', '#3f78a6'],
      res: ['#8a6a3a', 0.3], enemy: ['#3a1d14', 0.4], soldier: ['#1d2f5a', 0.3],
    },
    canvas: {
      serif: '"EB Garamond", Georgia, "Times New Roman", serif', title: '"Cinzel", Georgia, serif',
      iconFilter: 'sepia(0.55) saturate(0.85) contrast(1.08)',
      ink: '#2b1d12', paper: '#ead9aa', gold: '#b8892b', accent: '#9b2d20', good: '#3f7d6b', info: '#2f4a8a',
      // Terrain
      washVar: 0.08, grid: 'rgba(90,60,28,0.13)',
      shore: 'rgba(28,58,70,0.85)', shoreSoft: 'rgba(28,58,70,0.32)', wave: 'rgba(30,64,78,0.42)',
      treeStroke: '#37431f', treeA: '#9fae6a', treeB: '#a9b872',
      moundFill: 'rgba(214,184,120,0.7)', moundStroke: '#6b4a26',
      peakFill: '#e4dcc4', peakStroke: '#46362a', peakRidge: 'rgba(70,54,42,0.8)',
      furrow: 'rgba(86,104,40,0.6)', tuft: 'rgba(70,90,40,0.6)',
      unownedFill: 'rgba(112,80,40,0.30)', unownedHatch: 'rgba(90,60,28,0.12)', border: 'rgba(112,32,20,0.92)',
      grainDark: '70,45,18', grainLight: '255,248,225', stain: '120,80,30', stainA: 0.10, edge: '90,55,20', edgeA: 0.34,
      frame: 'ticks', desk: 'wood', vignette: '30,16,4', vignetteA: 0.5,
      compass: { face: '#ecdcb0', ring: '#2b1d12', light: '#f6ecd0', dark: '#2b1d12', north: '#9b2d20', hub: '#b8892b', text: '#2b1d12' },
      // Jetons de bâtiments
      plaque: { k: 5, shadow: 'rgba(50,30,10,0.32)', outline: '#2b1d12', outlineW: 1.8, rim: 'rgba(184,137,43,0.8)', rimW: 1, rimInset: 3,
        glossTop: 'rgba(255,248,225,0.42)', glossMid: 'rgba(255,248,225,0)', glossBot: 'rgba(60,35,10,0.16)', rivets: false, rivet: '#b8892b' },
      ruined: '#9a8d78', paused: '#cfc4aa', crack: 'rgba(43,29,18,0.75)', wall: 'rgba(60,40,20,0.35)',
      gauge: { track: 'rgba(43,29,18,0.3)', good: '#4f7a52', mid: '#c4962c', bad: '#9b2d20', outline: '#2b1d12' },
      label: { fill: '#f6ecd0', stroke: '#2b1d12', text: '#2b1d12', good: '#2e6a42', bad: '#9b2d20' },
      level: 'star', select: 'double', seal: '#9b2d20',
      road: { kind: 'trail', line: 'rgba(95,62,30,0.85)', hub: '#d9c593', hubStroke: 'rgba(95,62,30,0.9)' },
      spark: '232,184,48', sparkStroke: '#2b1d12',
      // Aides, effets
      hover: { own: 'rgba(43,29,18,0.5)', buy: 'rgba(63,125,107,0.95)', none: 'rgba(43,29,18,0.25)' },
      place: { ghost: 'rgba(247,237,207,0.9)', bad: 'rgba(190,100,80,0.65)', ok: '#3f7d6b', no: '#9b2d20', adjGood: '#3f7a52', adjBad: '#9b2d20',
        zoneOk: 'rgba(63,125,107,0.32)', zoneOkLine: 'rgba(30,88,70,0.85)', zoneElec: 'rgba(232,184,48,0.38)', zoneElecLine: 'rgba(160,112,10,0.9)', zoneFar: 'rgba(150,100,20,0.7)', elecRing: 'rgba(200,150,20,0.95)', annex: '155,45,32' },
      ring: { tower: ['rgba(155,45,32,0.08)', 'rgba(155,45,32,0.7)'], squad: ['rgba(47,74,138,0.08)', 'rgba(47,74,138,0.7)'] },
      waveArrow: '155,45,32', puff: { gold: '184,137,43', plain: '255,246,214', edge: '43,29,18' },
      season: { veil: 'rgba(214,226,236,0.2)', snow: 'rgba(255,252,240,0.92)', snowShade: 'rgba(70,60,50,0.18)' },
      logi: { veil: 'rgba(236,222,186,0.62)', ok: '#4f7a52', warn: '#c4962c', bad: '#9b2d20' },
      enemyCross: 'rgba(246,236,208,0.75)', helmet: '#b8892b', projectile: '#2b1d12', projectileBig: '#3a2a4a', projectileRim: '#f6ecd0',
    },
  };

  // ======================================================================================
  // Thème 2 — Vapeur 1900 : suie chaude, laiton, cuivre, patine. Sombre mais doux.
  // ======================================================================================
  const VAPEUR = {
    id: 'vapeur', name: 'Vapeur 1900', tagline: 'Vapeur 1900',
    desc: 'Atelier d’ingénieur de la Belle Époque : fonte sombre et douce, laiton, cuivre et lueurs d’ambre. Rivets, engrenages et rails.',
    swatch: ['#26211d', '#c9a050', '#c4733f', '#4fa8a0'],
    data: {
      wash: { plaine: '#58563f', fertile: '#5f6841', foret: '#3f5439', colline: '#6c5c44', eau: '#2c5662', montagne: '#6b665d' },
      cat: { housing: '#bf7a64', food: '#cdae5e', raw: '#a98d5f', craft: '#c27d5a', energy: '#d8b250', science: '#7f98c0', storage: '#8ea68f', military: '#b5594f', wonder: '#e0bd5a', core: '#cdb46c' },
      era: ['#a07a50', '#c49a3c', '#6a8cc4', '#4fa8a0', '#8a9ee0'],
      res: ['#e0b868', 0.14], enemy: ['#b83a2a', 0.25], soldier: ['#2f6f9a', 0.4],
    },
    canvas: {
      serif: '"Crimson Pro", Georgia, "Times New Roman", serif', title: '"Playfair Display", Georgia, serif',
      iconFilter: 'sepia(0.22) saturate(1) brightness(1.1) contrast(1.05)',
      ink: '#140f0b', paper: '#2a2622', gold: '#c9a050', accent: '#e0705f', good: '#6fd0b0', info: '#6fb0e0',
      washVar: 0.07, grid: 'rgba(210,175,110,0.10)',
      shore: 'rgba(150,205,210,0.62)', shoreSoft: 'rgba(150,205,210,0.22)', wave: 'rgba(175,218,222,0.36)',
      treeStroke: '#131c0e', treeA: '#6f9468', treeB: '#7aa070',
      moundFill: 'rgba(150,126,86,0.8)', moundStroke: '#241a0e',
      peakFill: '#9a948a', peakStroke: '#1c1815', peakRidge: 'rgba(235,225,205,0.55)',
      furrow: 'rgba(180,198,120,0.42)', tuft: 'rgba(170,192,118,0.5)',
      unownedFill: 'rgba(8,6,4,0.27)', unownedHatch: 'rgba(210,175,110,0.07)', border: 'rgba(240,184,74,0.95)',
      grainDark: '0,0,0', grainLight: '230,200,150', stain: '160,110,50', stainA: 0.07, edge: '0,0,0', edgeA: 0.38,
      frame: 'brass', desk: 'iron', vignette: '8,6,4', vignetteA: 0.58,
      compass: { face: '#2b2520', ring: '#c9a050', light: '#e8dcc0', dark: '#6e5c3c', north: '#e0705f', hub: '#e8c372', text: '#e8c372' },
      plaque: { k: 6, shadow: 'rgba(0,0,0,0.45)', outline: '#cfa85a', outlineW: 2, rim: 'rgba(20,14,8,0.7)', rimW: 1.6, rimInset: 3,
        glossTop: 'rgba(255,232,180,0.26)', glossMid: 'rgba(255,232,180,0)', glossBot: 'rgba(0,0,0,0.3)', rivets: true, rivet: '#f0d9a0' },
      ruined: '#4d453d', paused: '#6b6258', crack: 'rgba(10,6,3,0.85)', wall: 'rgba(0,0,0,0.35)',
      gauge: { track: 'rgba(0,0,0,0.55)', good: '#6fc08a', mid: '#e7b04a', bad: '#e0705f', outline: '#cfa85a' },
      label: { fill: '#2b2420', stroke: '#c9a050', text: '#f0e4c8', good: '#8fd1a0', bad: '#ff9a85' },
      level: 'cog', select: 'glow', seal: '#e0705f',
      road: { kind: 'rail', rail: 'rgba(214,190,140,0.9)', sleeper: 'rgba(40,30,20,0.9)', hub: '#c9a050', hubStroke: '#140f0b' },
      spark: '255,196,90', sparkStroke: '#140f0b',
      hover: { own: 'rgba(230,200,140,0.55)', buy: 'rgba(111,208,176,0.95)', none: 'rgba(230,200,140,0.22)' },
      place: { ghost: 'rgba(58,50,43,0.92)', bad: 'rgba(160,60,48,0.7)', ok: '#6fd0b0', no: '#e0705f', adjGood: '#8fd1a0', adjBad: '#ff9a85',
        zoneOk: 'rgba(79,168,160,0.30)', zoneOkLine: 'rgba(111,208,176,0.85)', zoneElec: 'rgba(240,184,74,0.34)', zoneElecLine: 'rgba(255,205,110,0.95)', zoneFar: 'rgba(230,170,70,0.7)', elecRing: 'rgba(255,205,110,0.95)', annex: '255,160,120' },
      ring: { tower: ['rgba(224,112,95,0.10)', 'rgba(240,140,120,0.8)'], squad: ['rgba(111,176,224,0.10)', 'rgba(130,190,235,0.85)'] },
      waveArrow: '224,112,95', puff: { gold: '240,184,74', plain: '255,240,210', edge: '10,6,3' },
      season: { veil: 'rgba(150,180,215,0.14)', snow: 'rgba(245,247,250,0.9)', snowShade: 'rgba(0,0,0,0.25)' },
      logi: { veil: 'rgba(16,12,9,0.62)', ok: '#6fc08a', warn: '#e7b04a', bad: '#e0705f' },
      enemyCross: 'rgba(255,230,200,0.7)', helmet: '#e0bd5a', projectile: '#ffd27a', projectileBig: '#ff9a5a', projectileRim: '#140f0b',
    },
  };

  // ======================================================================================
  // Thème 4 — Néon orbital : console de contrôle futuriste. Nuit bleue, verre fumé, cyan et magenta lumineux.
  // ======================================================================================
  const NEON = {
    id: 'neon', name: 'Néon orbital', tagline: 'Néon orbital',
    desc: 'Console de contrôle d\'une colonie stellaire : nuit bleue, hologrammes en verre, faisceaux et contours lumineux cyan et magenta.',
    swatch: ['#0a1424', '#19d3ff', '#ff3ea5', '#34f0b0'],
    data: {
      wash: { plaine: '#16263f', fertile: '#16403d', foret: '#113a31', colline: '#2a2e52', eau: '#0b3b6b', montagne: '#2b3352' },
      cat: { housing: '#ff6fb1', food: '#f5d04a', raw: '#d6935a', craft: '#ff8a4a', energy: '#ffe14d', science: '#6c8cff', storage: '#59d6c4', military: '#ff4f6a', wonder: '#ffd84d', core: '#b8f0ff' },
      era: ['#8e6bff', '#19d3ff', '#34f0b0', '#ffc247', '#ff3ea5'],
      res: ['#6fe8ff', 0.15], enemy: ['#ff2e63', 0.3], soldier: ['#19d3ff', 0.4],
    },
    canvas: {
      serif: '"Rajdhani", "Segoe UI", sans-serif', title: '"Orbitron", "Segoe UI", sans-serif',
      iconFilter: 'saturate(1.25) brightness(1.12) contrast(1.05) drop-shadow(0 0 2px rgba(120,230,255,0.55))',
      ink: '#04101c', paper: '#0a1424', gold: '#19d3ff', accent: '#ff3ea5', good: '#34f0b0', info: '#6c8cff',
      washVar: 0.10, grid: 'rgba(25,211,255,0.20)',
      shore: 'rgba(80,220,255,0.85)', shoreSoft: 'rgba(80,220,255,0.3)', wave: 'rgba(120,230,255,0.42)',
      treeStroke: '#34f0b0', treeA: '#0f4a3e', treeB: '#12594a',
      moundFill: 'rgba(70,90,170,0.55)', moundStroke: '#8fa6ff',
      peakFill: '#1a2547', peakStroke: '#7fe9ff', peakRidge: 'rgba(160,240,255,0.7)',
      furrow: 'rgba(52,240,176,0.5)', tuft: 'rgba(52,240,176,0.55)',
      unownedFill: 'rgba(2,5,12,0.58)', unownedHatch: 'rgba(25,211,255,0.10)', border: 'rgba(255,62,165,0.95)',
      grainDark: '0,0,0', grainLight: '120,220,255', stain: '25,120,200', stainA: 0.06, edge: '0,0,0', edgeA: 0.45,
      frame: 'hud', desk: 'grid', vignette: '0,4,12', vignetteA: 0.6,
      glowDecor: 'rgba(25,211,255,0.55)', scan: 'rgba(0,0,0,0.10)', mapShadow: { color: 'rgba(25,211,255,0.38)', blur: 34, ox: 0, oy: 0 },
      compass: { face: '#0a1424', ring: '#19d3ff', light: '#bfefff', dark: '#2a5f86', north: '#ff3ea5', hub: '#19d3ff', text: '#7fe9ff' },
      plaque: { k: 7, shadow: 'rgba(0,0,0,0.55)', outline: '#19d3ff', outlineW: 1.6, rim: '#bff6ff', rimW: 1.4, rimInset: 3,
        glossTop: 'rgba(190,245,255,0.28)', glossMid: 'rgba(190,245,255,0)', glossBot: 'rgba(0,0,0,0.35)', rivets: false, rivet: '#19d3ff', style: 'holo', back: '#0a1428' },
      ruined: '#3a3f55', paused: '#24304a', crack: 'rgba(255,95,122,0.9)', wall: 'rgba(25,211,255,0.25)',
      gauge: { track: 'rgba(0,0,0,0.6)', good: '#34f0b0', mid: '#ffc247', bad: '#ff5f7a', outline: '#19d3ff' },
      label: { fill: '#0a1428', stroke: '#19d3ff', text: '#dff3ff', good: '#34f0b0', bad: '#ff7f95' },
      level: 'pip', select: 'glow', selGlow: 'rgba(25,211,255,0.95)', selLine: '#7fe9ff', seal: '#ff3ea5',
      road: { kind: 'beam', line: '#19d3ff', hub: '#0a1428', hubStroke: '#7fe9ff' },
      spark: '60,230,255', sparkStroke: '#04101c',
      hover: { own: 'rgba(25,211,255,0.55)', buy: 'rgba(52,240,176,0.95)', none: 'rgba(25,211,255,0.2)' },
      place: { ghost: 'rgba(12,22,40,0.9)', bad: 'rgba(255,95,122,0.5)', ok: '#34f0b0', no: '#ff5f7a', adjGood: '#34f0b0', adjBad: '#ff7f95',
        zoneOk: 'rgba(25,211,255,0.2)', zoneOkLine: 'rgba(80,230,255,0.9)', zoneElec: 'rgba(255,225,77,0.28)', zoneElecLine: 'rgba(255,225,77,0.95)', zoneFar: 'rgba(255,62,165,0.65)', elecRing: 'rgba(255,225,77,0.95)', annex: '255,62,165' },
      ring: { tower: ['rgba(255,95,122,0.10)', 'rgba(255,95,122,0.85)'], squad: ['rgba(25,211,255,0.10)', 'rgba(80,230,255,0.9)'] },
      waveArrow: '255,62,165', puff: { gold: '25,211,255', plain: '220,245,255', edge: '4,16,28' },
      season: { veil: 'rgba(120,170,255,0.12)', snow: 'rgba(235,248,255,0.9)', snowShade: 'rgba(0,10,30,0.3)' },
      logi: { veil: 'rgba(3,8,18,0.66)', ok: '#34f0b0', warn: '#ffc247', bad: '#ff5f7a' },
      enemyCross: 'rgba(255,220,230,0.8)', helmet: '#19d3ff', projectile: '#7fe9ff', projectileBig: '#ff3ea5', projectileRim: '#04101c',
    },
  };

  // ======================================================================================
  // Thème 5 — Atelier d'aquarelle : carnet d'artiste. Papier chaud, lavis qui se mêlent, gouache et traits de crayon.
  // ======================================================================================
  const ATELIER = {
    id: 'atelier', name: 'Atelier d\'aquarelle', tagline: 'Atelier d\'aquarelle',
    desc: 'Un carnet d\'artiste : papier chaud, lavis d\'aquarelle qui se mêlent, taches de gouache, rubans de masquage et lettres tracées à la main.',
    swatch: ['#f6efe0', '#d95d6a', '#e0a030', '#4f9c85'],
    data: {
      wash: { plaine: '#eadfae', fertile: '#cfe0a0', foret: '#9fc59a', colline: '#e3c28a', eau: '#8cc6e0', montagne: '#cdc3d6' },
      cat: { housing: '#f29aa6', food: '#f7d36b', raw: '#c9a77c', craft: '#f2a36b', energy: '#f4cf5a', science: '#8fa8e8', storage: '#9ccfc0', military: '#d9707a', wonder: '#f0c84f', core: '#e8d28a' },
      era: ['#c58f5f', '#e0b24f', '#6f8fd6', '#6bb39a', '#8c7fd1'],
      res: ['#b86b4a', 0.12], enemy: ['#7a2f3a', 0.3], soldier: ['#2f4f9a', 0.3],
    },
    canvas: {
      serif: '"Quicksand", "Segoe UI", sans-serif', title: '"Caveat", "Segoe Print", cursive',
      iconFilter: 'saturate(1.12) contrast(0.97) brightness(1.03)',
      ink: '#3a3140', paper: '#f6efe0', gold: '#e0a030', accent: '#d95d6a', good: '#4f9c85', info: '#4a6fb5',
      washVar: 0.07, grid: 'rgba(90,70,60,0.07)',
      shore: 'rgba(52,100,140,0.75)', shoreSoft: 'rgba(52,100,140,0.28)', wave: 'rgba(70,130,170,0.45)',
      treeStroke: '#2f4a34', treeA: '#7fae78', treeB: '#8cbb83',
      moundFill: 'rgba(236,196,130,0.8)', moundStroke: '#7a5a3a',
      peakFill: '#e6dfee', peakStroke: '#4b4058', peakRidge: 'rgba(90,75,110,0.7)',
      furrow: 'rgba(110,140,60,0.6)', tuft: 'rgba(80,120,60,0.65)',
      unownedFill: 'rgba(70,55,80,0.24)', unownedHatch: 'rgba(70,55,80,0.10)', border: 'rgba(217,93,106,0.95)',
      grainDark: '80,60,50', grainLight: '255,252,240', stain: '200,140,90', stainA: 0.08, edge: '120,90,60', edgeA: 0.22,
      frame: 'paint', desk: 'canvas', vignette: '60,40,30', vignetteA: 0.28, corner: 'round', washStyle: 'paint',
      compass: { face: '#f8f1e0', ring: '#3a3140', light: '#fff8e8', dark: '#a89bb6', north: '#d95d6a', hub: '#e0a030', text: '#3a3140' },
      plaque: { k: 6, shadow: 'rgba(58,49,64,0.28)', outline: '#3a3140', outlineW: 1.8, rim: 'rgba(255,255,255,0.7)', rimW: 2, rimInset: 3,
        glossTop: 'rgba(255,255,255,0.35)', glossMid: 'rgba(255,255,255,0)', glossBot: 'rgba(70,40,40,0.12)', rivets: false, rivet: '#e0a030', style: 'paint' },
      ruined: '#b4aab0', paused: '#d9d1d4', crack: 'rgba(58,49,64,0.75)', wall: 'rgba(58,49,64,0.3)',
      gauge: { track: 'rgba(58,49,64,0.22)', good: '#5aa68a', mid: '#e0a030', bad: '#d95d6a', outline: '#3a3140' },
      label: { fill: '#fff8e8', stroke: '#3a3140', text: '#3a3140', good: '#2f7a62', bad: '#c0485a' },
      level: 'dot', select: 'double', seal: '#d95d6a',
      road: { kind: 'brush', line: '#e3b66a', edge: '#b98a3c', hub: '#f4dca0', hubStroke: '#8a6a30' },
      spark: '240,190,70', sparkStroke: '#3a3140',
      hover: { own: 'rgba(58,49,64,0.45)', buy: 'rgba(79,156,133,0.95)', none: 'rgba(58,49,64,0.2)' },
      place: { ghost: 'rgba(255,250,236,0.92)', bad: 'rgba(217,93,106,0.5)', ok: '#4f9c85', no: '#d95d6a', adjGood: '#3f8a70', adjBad: '#c0485a',
        zoneOk: 'rgba(95,170,140,0.30)', zoneOkLine: 'rgba(60,130,105,0.85)', zoneElec: 'rgba(240,190,70,0.38)', zoneElecLine: 'rgba(190,140,30,0.9)', zoneFar: 'rgba(200,120,60,0.7)', elecRing: 'rgba(220,160,40,0.95)', annex: '217,93,106' },
      ring: { tower: ['rgba(217,93,106,0.08)', 'rgba(217,93,106,0.75)'], squad: ['rgba(74,111,181,0.08)', 'rgba(74,111,181,0.75)'] },
      waveArrow: '217,93,106', puff: { gold: '224,160,48', plain: '255,250,236', edge: '58,49,64' },
      season: { veil: 'rgba(200,215,235,0.2)', snow: 'rgba(255,255,255,0.95)', snowShade: 'rgba(90,100,130,0.2)' },
      logi: { veil: 'rgba(248,240,224,0.62)', ok: '#5aa68a', warn: '#e0a030', bad: '#d95d6a' },
      enemyCross: 'rgba(255,245,230,0.8)', helmet: '#e0a030', projectile: '#3a3140', projectileBig: '#7a3a8a', projectileRim: '#fff8e8',
    },
  };

  // ======================================================================================
  // Thème 3 — Pastel doux : l'interface d'origine (V1), claire, arrondie, sans feuille de style propre.
  // Il utilise le moteur de rendu « classique » ; ses couleurs sont celles du jeu, sans transformation.
  // ======================================================================================
  const PASTEL = {
    id: 'pastel', name: 'Pastel doux', tagline: 'Pastel', sheet: false,
    desc: 'L\'interface d\'origine : tons clairs et doux, coins arrondis, lecture rapide. Le plus sobre des trois thèmes.',
    swatch: ['#f3f1ec', '#3d6fb6', '#e9c98b', '#3f8f5f'],
    data: { wash: {}, cat: {}, era: [], res: ['#000000', 0], enemy: ['#000000', 0], soldier: ['#000000', 0] },
    canvas: { renderer: 'classic' },
  };

  const THEMES = { pastel: PASTEL, manuscrit: MANUSCRIT, vapeur: VAPEUR, neon: NEON, atelier: ATELIER };
  let cur = THEMES[DEFAULT];

  // Écrit les couleurs du thème dans les tables de données.
  function applyData(t) {
    const d = t.data;
    for (const k in G.TERRAIN) {
      const def = G.TERRAIN[k];
      def.color = d.wash[k] || (def.ore ? d.wash.colline : base.terrain[k]);
    }
    G.BUILD_CATEGORIES.forEach((c, i) => { c.color = d.cat[c.id] || base.cats[i]; });
    G.CAT_COLOR = {};
    G.BUILD_CATEGORIES.forEach(c => (G.CAT_COLOR[c.id] = c.color));
    G.ERAS.forEach((e, i) => { e.color = d.era[i] || base.eras[i]; });
    for (const k in G.RESOURCES) G.RESOURCES[k].color = mix(base.res[k], d.res[0], d.res[1]);
    G.ENEMIES.forEach((era, i) => { for (const kind in era) era[kind].color = mix(base.enemies[i][kind], d.enemy[0], d.enemy[1]); });
    G.SOLDIERS.eras.forEach((e, i) => (e.color = mix(base.soldiers[i], d.soldier[0], d.soldier[1])));
  }

  function saved() { try { return localStorage.getItem('lignees_theme'); } catch (e) { return null; } }

  // Remplace la feuille de style du thème sans clignotement : la nouvelle est chargée avant de retirer l'ancienne.
  function swapCss(id) {
    const old = document.getElementById('theme-css');
    if (THEMES[id].sheet === false) { // Pastel : la feuille de base suffit
      if (old) old.remove();
      if (G.run) G.ui && G.ui.refresh && G.ui.refresh(true);
      return;
    }
    if (old && old.getAttribute('href').indexOf('/' + id + '.css') >= 0) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = 'css/themes/' + id + '.css';
    const done = () => { if (old) old.remove(); link.id = 'theme-css'; if (G.run) G.ui && G.ui.refresh && G.ui.refresh(true); };
    link.onload = done; link.onerror = done;
    document.head.appendChild(link);
  }

  function apply(id, opts) {
    opts = opts || {};
    if (!THEMES[id]) id = DEFAULT;
    cur = THEMES[id];
    applyData(cur);
    api.id = id; api.canvas = cur.canvas; api.name = cur.name; api.tagline = cur.tagline;
    document.documentElement.dataset.theme = id;
    try { localStorage.setItem('lignees_theme', id); } catch (e) { }
    if (G.meta && G.meta.settings) G.meta.settings.theme = id;
    if (!opts.initial) swapCss(id);
    if (G.render && G.render.restyle) G.render.restyle();
    if (G.run) document.body.style.setProperty('--era', G.ERAS[G.run.era].color);
    return id;
  }

  const api = { id: DEFAULT, canvas: cur.canvas, name: cur.name, tagline: cur.tagline, THEMES, mix, apply, list: () => Object.keys(THEMES).map(k => THEMES[k]) };
  // Au chargement, le thème mémorisé a déjà sa feuille de style (script en tête de page).
  apply(saved(), { initial: true });
  return api;
})();
