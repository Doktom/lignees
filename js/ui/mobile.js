// Adaptation mobile : détection de l'écran, panneau du bas déployable, tiroir des ressources,
// barre de confirmation de pose et infobulles au toucher. Les gestes sur la carte
// (déplacer, pincer, toucher) sont dans ui.js (bindCanvas).
G.mobile = (function () {
  const $ = s => document.querySelector(s);
  const root = document.documentElement;
  const mq = { touch: window.matchMedia('(pointer: coarse)') };
  const st = { m: false, sheet: false, res: false, selKey: '', wasPlacing: false };
  let tipTimer = 0;

  // Écran étroit, ou téléphone en paysage (peu de hauteur).
  function detect() {
    const m = window.innerWidth <= 820 || (mq.touch.matches && window.innerHeight <= 520);
    st.m = m;
    root.classList.toggle('m', m);
    root.classList.toggle('touch', mq.touch.matches);
    if (!m) { st.sheet = st.res = false; apply(); }
  }

  function apply() {
    root.classList.toggle('sheet-open', st.m && st.sheet);
    root.classList.toggle('res-open', st.m && st.res);
  }

  function setSheet(v) { st.sheet = v; if (v) st.res = false; apply(); }
  function setRes(v) { st.res = v; if (v) st.sheet = false; apply(); }

  function selKey() {
    const s = G.ui.selected;
    if (!s) return '';
    return s.kind === 'building' ? 'b' + (s.b.bid != null ? s.b.bid : s.b.x + ',' + s.b.y) : 't' + s.x + ',' + s.y;
  }

  // Appelé à chaque rafraîchissement de l'interface.
  function sync() {
    if (!st.m) return;
    const ui = G.ui;
    // Une pose commence : on libère la carte. Une sélection : on ouvre le panneau.
    if (ui.placing && !st.wasPlacing) { st.sheet = st.res = false; }
    if (!ui.placing && st.wasPlacing) { ui.touchTile = null; if (ui.lastPointer && ui.lastPointer !== 'mouse') ui.hover = null; }
    st.wasPlacing = !!ui.placing;
    const k = selKey();
    if (k && k !== st.selKey && !ui.placing) { st.sheet = true; st.res = false; }
    st.selKey = k;
    apply();
    root.classList.toggle('placing-on', !!ui.placing);
    renderConfirm();
    renderStrip();
  }

  // Bandeau des ressources en stock (les ressources à zéro sont masquées).
  function renderStrip() {
    const el = $('#m-res-btn');
    if (!el || !G.run) return;
    const U = G.util;
    const chips = Object.keys(G.RESOURCES).filter(r => (G.run.res[r] || 0) > 0.5)
      .map(r => '<span class="chip">' + G.RESOURCES[r].icon + ' ' + U.fmt(G.run.res[r]) + '</span>').join('');
    const html = '<span>📦</span>' + chips;
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
  }

  // Barre « Poser ici » : sur mobile, un toucher déplace le fantôme, le bouton confirme.
  function renderConfirm() {
    const ui = G.ui, el = $('#m-confirm');
    if (!el) return;
    if (!ui.placing) { if (el._html) { el.innerHTML = ''; el._html = null; } return; }
    const d = G.BUILDINGS[ui.placing], t = ui.touchTile;
    let html;
    if (d.road) {
      html = '<div class="txt"><b>' + d.icon + ' ' + d.name + '</b><small>Glissez un doigt pour tracer · deux doigts pour déplacer la carte</small></div>' +
        '<button class="btn primary" data-m="cancel">Terminé</button>';
    } else {
      const p = t ? G.logic.canPlace(ui.placing, t.x, t.y) : null;
      const note = !t ? 'Touchez une case pour placer le bâtiment' : p.ok ? 'Case libre : appuyez sur Poser' : (p.why || 'Impossible de construire ici');
      html = '<div class="txt"><b>' + d.icon + ' ' + d.name + '</b><small>' + note + '</small></div>' +
        '<button class="btn primary" data-m="ok" ' + (p && p.ok ? '' : 'disabled') + '>✔ Poser</button>' +
        '<button class="btn" data-m="cancel">✕</button>';
    }
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
  }

  // Infobulle au toucher : sur les pastilles et éléments informatifs (sans action).
  function tapTip(e) {
    if (!mq.touch.matches) return;
    const el = e.target.closest && e.target.closest('[data-tip],[data-tip-b]');
    clearTimeout(tipTimer);
    if (!el || el.closest('[data-action]')) { $('#tooltip').classList.remove('show'); return; }
    G.ui.showTip(e);
    tipTimer = setTimeout(() => $('#tooltip').classList.remove('show'), 4500);
  }

  function init() {
    detect();
    window.addEventListener('resize', detect);
    window.addEventListener('orientationchange', detect);
    if (mq.touch.addEventListener) mq.touch.addEventListener('change', detect);

    const right = $('#right');
    if (right && !$('#m-grab')) {
      const g = document.createElement('div');
      g.id = 'm-grab'; g.innerHTML = '<i></i>';
      right.insertBefore(g, right.firstChild);
      g.addEventListener('click', () => setSheet(false));
    }
    // Un toucher sur l'onglet déjà actif replie le panneau ; sur un autre onglet, il le déploie.
    $('#tabs').addEventListener('click', e => {
      if (!st.m) return;
      const tab = e.target.closest('.tab');
      if (!tab) return;
      const id = (tab.dataset.action || '').split(':')[1];
      if (st.sheet && G.ui.tab === id) { e.stopPropagation(); setSheet(false); G.ui.refresh(true); return; }
      setSheet(true);
    }, true);

    const btn = $('#m-res-btn');
    if (btn) btn.addEventListener('click', () => setRes(!st.res));
    const scrim = $('#m-scrim');
    if (scrim) scrim.addEventListener('click', () => setRes(false));
    // Toucher la carte referme le tiroir et le panneau (sauf pendant une pose).
    $('#map').addEventListener('pointerdown', () => { if (st.m && (st.res || st.sheet)) { st.res = false; st.sheet = false; apply(); } });

    const conf = $('#m-confirm');
    if (conf) conf.addEventListener('click', e => {
      const b = e.target.closest('[data-m]');
      if (!b || b.disabled) return;
      if (b.dataset.m === 'ok' && G.ui.touchTile) G.ui.clickTile(G.ui.touchTile);
      else if (b.dataset.m === 'cancel') G.ui.cancel();
      G.ui.refresh(true);
    });

    document.addEventListener('click', tapTip);
  }

  return { init, sync, detect, setSheet, setRes, get active() { return st.m; } };
})();
