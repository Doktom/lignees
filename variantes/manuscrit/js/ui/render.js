// Aiguilleur de rendu : la carte est dessinée par l'un des deux moteurs, selon le thème actif.
//  - « classic » (render-classic.js) : thème Pastel doux, cases arrondies et couleurs unies ;
//  - « palette » (render-palette.js) : thèmes Chronique enluminée et Vapeur 1900, entièrement pilotés par la palette du thème.
// Le thème choisit son moteur avec canvas.renderer ('classic' ou 'palette', par défaut 'palette').
// La caméra (zoom, position) est conservée quand on change de thème.
G.render = (function () {
  let cur = null, canvasEl = null;
  const started = new Set();

  function pick() { return G.renderers[(G.theme.canvas && G.theme.canvas.renderer) || 'palette']; }

  function use(next) {
    if (next === cur) return;
    const old = cur;
    cur = next;
    if (!canvasEl) return;
    if (old) Object.assign(cur.cam, old.cam);
    if (!started.has(cur)) { started.add(cur); cur.init(canvasEl); if (old) Object.assign(cur.cam, old.cam); }
    else cur.resize();
    cur.invalidate();
  }

  function init(c) { canvasEl = c; cur = null; use(pick()); }

  // Changement de thème : on bascule de moteur si besoin, puis on oublie le dessin en cache.
  function restyle() {
    use(pick());
    if (cur && cur.restyle) cur.restyle(); else if (cur) cur.invalidate();
  }

  return {
    init, restyle,
    resize: () => cur && cur.resize(),
    fit: () => cur && cur.fit(),
    zoomAt: (x, y, f) => cur && cur.zoomAt(x, y, f),
    pan: (dx, dy) => cur && cur.pan(dx, dy),
    screenToTile: (x, y) => cur.screenToTile(x, y),
    draw: t => cur && cur.draw(t),
    puff: (...a) => cur && cur.puff(...a),
    visual: (...a) => cur && cur.visual(...a),
    invalidate: () => cur && cur.invalidate(),
    get cam() { return cur && cur.cam; },
  };
})();
