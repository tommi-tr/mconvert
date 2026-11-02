/* mConvert — notazione decimale, tabella dei prefissi, notazione scientifica.
   Numeri rappresentati in modo esatto: valore = d × 10^e nell'unità base (es. m, m², m³). */
'use strict';

// ------------------------------------------------------------------ dati
const PREFIXES = [
  { k: 12, s: 'T', n: 'tera' }, { k: 9, s: 'G', n: 'giga' }, { k: 6, s: 'M', n: 'mega' },
  { k: 3, s: 'k', n: 'kilo' }, { k: 2, s: 'h', n: 'etto' }, { k: 1, s: 'da', n: 'deca' },
  { k: 0, s: '', n: 'unità' },
  { k: -1, s: 'd', n: 'deci' }, { k: -2, s: 'c', n: 'centi' }, { k: -3, s: 'm', n: 'milli' },
  { k: -6, s: 'µ', n: 'micro' }, { k: -9, s: 'n', n: 'nano' }, { k: -12, s: 'p', n: 'pico' },
];
const PFX = new Map(PREFIXES.map(p => [p.k, p]));
const K_MAX = 12, K_MIN = -12;

const UNITS = [
  { id: 'm',  sym: 'm',  dim: 1, q: 'lunghezza',             g: 'Unità fondamentali del SI' },
  { id: 'm2', sym: 'm',  dim: 2, q: 'superficie',            g: 'Superficie e volume' },
  { id: 'm3', sym: 'm',  dim: 3, q: 'volume',                g: 'Superficie e volume' },
  { id: 'kg', sym: 'g',  dim: 1, q: 'massa',                 g: 'Unità fondamentali del SI', siK: 3, baseK: 3, label: 'kg — massa (unità SI)' },
  { id: 'g',  sym: 'g',  dim: 1, q: 'massa',                 g: 'Grammo e unità derivate', siK: 3, label: 'g — massa (grammo)' },
  { id: 's',  sym: 's',  dim: 1, q: 'tempo',                 g: 'Unità fondamentali del SI' },
  { id: 'A',  sym: 'A',  dim: 1, q: 'corrente elettrica',    g: 'Unità fondamentali del SI' },
  { id: 'K',  sym: 'K',  dim: 1, q: 'temperatura',           g: 'Unità fondamentali del SI' },
  { id: 'mol',sym: 'mol',dim: 1, q: 'quantità di sostanza',  g: 'Unità fondamentali del SI' },
  { id: 'cd', sym: 'cd', dim: 1, q: 'intensità luminosa',    g: 'Unità fondamentali del SI' },
  { id: 'Hz', sym: 'Hz', dim: 1, q: 'frequenza',             g: 'Grammo e unità derivate' },
  { id: 'N',  sym: 'N',  dim: 1, q: 'forza',                 g: 'Grammo e unità derivate' },
  { id: 'Pa', sym: 'Pa', dim: 1, q: 'pressione',             g: 'Grammo e unità derivate' },
  { id: 'J',  sym: 'J',  dim: 1, q: 'energia',               g: 'Grammo e unità derivate' },
  { id: 'W',  sym: 'W',  dim: 1, q: 'potenza',               g: 'Grammo e unità derivate' },
  { id: 'C',  sym: 'C',  dim: 1, q: 'carica elettrica',      g: 'Grammo e unità derivate' },
  { id: 'V',  sym: 'V',  dim: 1, q: 'tensione elettrica',    g: 'Grammo e unità derivate' },
  { id: 'Ohm',sym: 'Ω',  dim: 1, q: 'resistenza elettrica',  g: 'Grammo e unità derivate' },
  { id: 'F',  sym: 'F',  dim: 1, q: 'capacità elettrica',    g: 'Grammo e unità derivate' },
  { id: 'T',  sym: 'T',  dim: 1, q: 'campo magnetico',       g: 'Grammo e unità derivate' },
  { id: 'Wb', sym: 'Wb', dim: 1, q: 'flusso magnetico',      g: 'Grammo e unità derivate' },
  { id: 'H',  sym: 'H',  dim: 1, q: 'induttanza',            g: 'Grammo e unità derivate' },
];
const UNIT = new Map(UNITS.map(u => [u.id, u]));

// esempi reali: [descrizione, valore come si scrive, prefisso k, unità]
const EXAMPLES = [
  ['Distanza Terra–Luna', '384400', 3, 'm'],
  ['Raggio della Terra', '6371', 3, 'm'],
  ['Altezza del Monte Bianco', '4808', 0, 'm'],
  ['Spessore di un foglio di carta', '0,1', -3, 'm'],
  ['Diametro di un capello', '70', -6, 'm'],
  ['Diametro di un globulo rosso', '7,5', -6, 'm'],
  ['Lunghezza d’onda della luce verde', '530', -9, 'm'],
  ['Raggio di un atomo di idrogeno', '53', -12, 'm'],
  ['Dimensione di un virus', '100', -9, 'm'],
  ['Lunghezza di una formica', '5', -3, 'm'],
  ['Superficie di un campo da calcio', '7140', 0, 'm2'],
  ['Superficie dell’Italia', '302073', 3, 'm2'],
  ['Superficie di un francobollo', '6', -2, 'm2'],
  ['Schermo di uno smartphone', '90', -2, 'm2'],
  ['Superficie di un’aula', '50', 0, 'm2'],
  ['Volume di una goccia d’acqua', '50', -3, 'm3'],
  ['Volume di una piscina olimpionica', '2500', 0, 'm3'],
  ['Volume di una lattina', '330', -2, 'm3'],
  ['Volume del Lago di Garda', '49', 3, 'm3'],
  ['Volume di una bottiglia d’acqua (1,5 L)', '1,5', -1, 'm3'],
  ['Massa di una formica', '3', -3, 'g'],
  ['Massa di un granello di sabbia', '0,67', -3, 'g'],
  ['Massa di un’automobile', '1200', 3, 'kg'],
  ['Massa di una moneta da 1 euro', '7,5', 0, 'g'],
  ['Massa di uno studente', '60', 3, 'kg'],
  ['Massa di una balena azzurra', '150', 6, 'g'],
  ['Massa di una zanzara', '2,5', -3, 'g'],
  ['Durata di un battito cardiaco', '0,8', 0, 's'],
  ['Tempo di reazione umano', '250', -3, 's'],
  ['Un ciclo di clock di un processore', '0,3', -9, 's'],
  ['Un anno', '31536000', 0, 's'],
  ['Frequenza della rete elettrica', '50', 0, 'Hz'],
  ['Frequenza del Wi‑Fi', '2,4', 9, 'Hz'],
  ['Frequenza di una radio FM', '100', 6, 'Hz'],
  ['Peso di una mela', '1', 0, 'N'],
  ['Pressione atmosferica', '101325', 0, 'Pa'],
  ['Pressione di uno pneumatico', '220', 3, 'Pa'],
  ['Energia di una barretta di cioccolato', '1', 6, 'J'],
  ['Potenza di una centrale nucleare', '1', 9, 'W'],
  ['Potenza di un LED', '500', -3, 'W'],
  ['Corrente in un LED', '20', -3, 'A'],
  ['Corrente di un fulmine', '30', 3, 'A'],
  ['Tensione di una pila stilo', '1,5', 0, 'V'],
  ['Tensione di un elettrodotto', '380', 3, 'V'],
  ['Resistenza di un resistore', '4,7', 3, 'Ohm'],
  ['Capacità di un condensatore', '100', -9, 'F'],
  ['Campo magnetico terrestre', '50', -6, 'T'],
  ['Campo di una risonanza magnetica', '1,5', 0, 'T'],
  ['Temperatura al centro del Sole', '15', 6, 'K'],
  ['Un gas ultrafreddo in laboratorio', '170', -9, 'K'],
  ['Acqua in un bicchiere', '11', 0, 'mol'],
  ['Carica trasportata da un fulmine', '15', 0, 'C'],
  ['Intensità luminosa di una candela', '1', 0, 'cd'],
];

// ------------------------------------------------------------------ numeri esatti
function norm(digits, e) {
  digits = digits.replace(/^0+/, '');
  if (!digits) return { d: '0', e: 0 };
  const m = digits.match(/0+$/);
  if (m) { e += m[0].length; digits = digits.slice(0, -m[0].length); }
  return { d: digits, e };
}
const isZero = v => v.d === '0';
const shiftV = (v, n) => isZero(v) ? v : { d: v.d, e: v.e + n };
const eqV = (a, b) => a.d === b.d && (isZero(a) || a.e === b.e);
const sciExp = v => isZero(v) ? 0 : v.e + v.d.length - 1;
const mantFloat = v => parseFloat(v.d[0] + '.' + (v.d.slice(1) || '0'));

function parseNum(str) {
  let s = String(str).trim().replace(/[\s   ']/g, '').replace(/[−–]/g, '-');
  if (!s) return null;
  s = s.replace(/(?:×|x|\*|·)10\^?\(?([+-]?\d+)\)?$/i, 'e$1');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, '');
  const m = s.match(/^\+?(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i);
  if (!m || (!m[1] && !m[2])) return null;
  const ip = m[1] || '', fp = m[2] || '';
  const ex = m[3] ? parseInt(m[3], 10) : 0;
  if (Math.abs(ex) > 300) return null;
  return norm(ip + fp, ex - fp.length);
}

/** Token della notazione decimale del valore v espresso nell'unità 10^s. */
function decTokens(v, s) {
  if (isZero(v)) return { int: [['0', 'sig']], frac: [] };
  const E = v.e - s, L = v.d.length;
  const sig = c => [c, 'sig'], zer = () => ['0', 'zero'];
  let int = [], frac = [];
  if (E >= 0) {
    int = [...v.d].map(sig).concat(Array.from({ length: E }, zer));
  } else {
    const p = L + E;
    if (p > 0) { int = [...v.d.slice(0, p)].map(sig); frac = [...v.d.slice(p)].map(sig); }
    else { int = [zer()]; frac = Array.from({ length: -p }, zer).concat([...v.d].map(sig)); }
  }
  return { int, frac };
}
function decString(v, s) {
  const { int, frac } = decTokens(v, s);
  return int.map(t => t[0]).join('') + (frac.length ? ',' + frac.map(t => t[0]).join('') : '');
}
function decLength(v, s) { const { int, frac } = decTokens(v, s); return int.length + frac.length; }

function decHTML(v, s) {
  const { int, frac } = decTokens(v, s);
  const span = (t, i) => `<span class="${t[1]}" style="--i:${i}">${t[0]}</span>`;
  let h = '';
  const gi = int.length > 4;
  int.forEach((t, i) => {
    if (gi && i > 0 && (int.length - i) % 3 === 0) h += '<span class="gap"></span>';
    h += span(t, i);
  });
  if (frac.length) {
    h += '<span class="comma">,</span>';
    const gf = frac.length > 4;
    frac.forEach((t, i) => {
      if (gf && i > 0 && i % 3 === 0) h += '<span class="gap"></span>';
      h += span(t, int.length + i);
    });
  }
  return h;
}
function decText(v, s) { // con spazi di raggruppamento, per testi
  const { int, frac } = decTokens(v, s);
  let a = int.map(t => t[0]).join('');
  if (a.length > 4) a = a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  let b = frac.map(t => t[0]).join('');
  if (b.length > 4) b = b.replace(/(\d{3})(?=\d)/g, '$1 ');
  return a + (b ? ',' + b : '');
}
function mantString(v) { return isZero(v) ? '0' : v.d[0] + (v.d.length > 1 ? ',' + v.d.slice(1) : ''); }
const sup = n => `<sup>${n < 0 ? '−' + (-n) : n}</sup>`;
const powHTML = n => `10${sup(n)}`;
function sciHTML(v, s, unitH) {
  const w = shiftV(v, -s);
  return `<span class="sig">${mantString(w)}</span> × <span class="pow">${powHTML(sciExp(w))}</span>${unitH ? ' ' + unitH : ''}`;
}
// ------------------------------------------------------------------ impostazioni
const DEFAULTS = { roundMode: 'half-up', decPrefix: true, sciPrefix: false, odgPrefix: false, fundamental: false, scores: true, odgRule: '5' };
const S = Object.assign({}, DEFAULTS, (() => { try { return JSON.parse(localStorage.getItem('mconvert-settings') || '{}'); } catch { return {}; } })());
const saveSettings = () => { try { localStorage.setItem('mconvert-settings', JSON.stringify(S)); } catch {} };
function odgOf(v, s) {
  const w = shiftV(v, -s);
  if (isZero(w)) return null;
  const thr = S.odgRule === '5' ? 5 : Math.sqrt(10);
  return mantFloat(w) >= thr ? sciExp(w) + 1 : sciExp(w);
}

// ------------------------------------------------------------------ unità
const dimSup = d => d === 2 ? '²' : d === 3 ? '³' : '';
const unitHTML = (k, u) => `<span class="u">${PFX.get(k)?.s ?? ''}${u.sym}${u.dim > 1 ? sup(u.dim) : ''}</span>`;
const unitText = (k, u) => `${PFX.get(k)?.s ?? ''}${u.sym}${dimSup(u.dim)}`;
const siK = u => u.siK || 0;
const baseK = u => u.baseK || 0;
const FUNDAMENTAL = ['m', 'm2', 'm3', 'kg', 's', 'A', 'K', 'mol', 'cd'];
const allowedUnits = () => S.fundamental ? UNITS.filter(u => FUNDAMENTAL.includes(u.id)) : UNITS;
const unitAllowed = u => allowedUnits().includes(u);
// h, da, d, c si usano quasi solo con lunghezze e masse (eccezione comune: hPa)
const usualKs = (u, ks) => ['m', 'm2', 'm3', 'g', 'kg'].includes(u.id) ? ks : ks.filter(k => k % 3 === 0 || (u.id === 'Pa' && k === 2));
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const plural = (n, one, many) => n === 1 ? one : many;
const times = n => n === 1 ? '10' : n === 2 ? '100' : n === 3 ? '1000' : `10${sup(n)}`;

// ------------------------------------------------------------------ tabella dei prefissi
class PrefixTable {
  /** opts: {pickable, draggable, onPick(k), onPreview(k|null), onShift(n), prefixes:Set|null} */
  constructor(root, opts = {}) {
    this.root = root; this.o = opts;
    this.unit = null; this.digitEls = new Map(); this.sigKey = '';
    this.lastScrollKey = '';
    root.classList.add('ptable');
    root.innerHTML = `
      <div class="pt-scroll">
        <div class="pt-inner">
          <div class="pt-digits"><div class="pt-slots"></div><div class="pt-layer"></div><div class="pt-comma">,</div><div class="pt-drag-badge"></div></div>
          <div class="pt-boxes"></div>
          <div class="pt-pows"></div>
        </div>
      </div>
      <div class="pt-overflow" hidden>Il numero esce dalla tabella: alcune cifre non sono visibili.</div>`;
    this.scroll = root.querySelector('.pt-scroll');
    this.inner = root.querySelector('.pt-inner');
    this.digits = root.querySelector('.pt-digits');
    this.slots = root.querySelector('.pt-slots');
    this.layer = root.querySelector('.pt-layer');
    this.comma = root.querySelector('.pt-comma');
    this.badge = root.querySelector('.pt-drag-badge');
    this.boxes = root.querySelector('.pt-boxes');
    this.pows = root.querySelector('.pt-pows');
    this.overflow = root.querySelector('.pt-overflow');
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(this.scroll);
    if (opts.draggable) this.initDrag();
    this.root.classList.toggle('is-draggable', !!opts.draggable);
  }
  setUnit(u) {
    if (this.unit === u) return;
    this.unit = u; const d = u.dim;
    this.colMax = K_MAX * d + d - 1; this.colMin = K_MIN * d; this.N = this.colMax - this.colMin + 1;
    this.slots.innerHTML = ''; this.boxes.innerHTML = ''; this.pows.innerHTML = '';
    for (let c = this.colMax; c >= this.colMin; c--) {
      const s = el('div', 'slot');
      const k = Math.floor(c / d);
      s.dataset.k = k;
      if (c % d === 0) s.classList.add('box-end');
      if (PFX.has(k)) s.classList.add('named');
      this.slots.appendChild(s);
    }
    for (let k = K_MAX; k >= K_MIN; k--) {
      const p = PFX.get(k);
      const allowed = p && (!this.o.prefixes || this.o.prefixes.has(k));
      const b = el(allowed && this.o.pickable ? 'button' : 'div', 'box' + (p ? ' named' : ' empty') + (k === 0 ? ' base' : '') + (allowed ? '' : ' off'));
      b.style.gridColumn = `span ${d}`;
      b.dataset.k = k;
      if (p) {
        b.innerHTML = `<span class="bx-sym">${unitHTML(k, u)}</span><span class="bx-name">${k === 0 ? 'unità' : p.n}</span>`;
        if (u.siK === k) b.innerHTML += '<span class="bx-si" title="Unità SI">SI</span>';
        if (allowed && this.o.pickable) {
          b.type = 'button';
          b.setAttribute('aria-label', `Converti in ${unitText(k, u)}`);
          b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') this.o.onPreview?.(k); });
          b.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') this.o.onPreview?.(null); });
          b.addEventListener('focus', () => this.o.onPreview?.(k));
          b.addEventListener('blur', () => this.o.onPreview?.(null));
          b.addEventListener('click', () => this.o.onPick?.(k));
        }
      }
      this.boxes.appendChild(b);
      const pw = el('div', 'pw' + (p ? ' named' : ''), powHTML(k * d));
      pw.style.gridColumn = `span ${d}`;
      pw.dataset.k = k;
      this.pows.appendChild(pw);
    }
    this.layer.innerHTML = ''; this.digitEls.clear(); this.sigKey = '';
    this.layout();
  }
  layout() {
    if (!this.unit) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const avail = this.scroll.clientWidth - 4;
    const d = this.unit.dim;
    const minC = rem * (d === 1 ? 2.6 : 1.7), maxC = rem * 4;
    const col = Math.max(minC, Math.min(maxC, avail / this.N));
    this.col = col;
    this.inner.style.setProperty('--col', col + 'px');
    this.inner.style.setProperty('--n', this.N);
    this.inner.style.width = col * this.N + 'px';
    this.root.classList.toggle('compact', col < rem * 2.4 * d);
    this.boxes.querySelectorAll('.bx-sym').forEach(sy => {
      const len = sy.textContent.length;
      sy.style.fontSize = Math.min(rem * 1.45, (col * d - 4) / (len * 0.62)) + 'px';
    });
    if (this.state) this.update(this.state, true);
  }
  x(c) { return (this.colMax - c) * this.col; }
  /** st: {v, k (posizione virgola), activeK, hideZeros, hideDigits, ghost} */
  update(st, relayout = false) {
    this.state = st;
    const u = this.unit, d = u.dim, v = st.v;
    const s = st.k * d;
    // evidenziazione
    const act = st.activeK;
    this.boxes.querySelectorAll('.box').forEach(b => {
      const k = +b.dataset.k;
      b.classList.toggle('active', k === act);
      b.classList.toggle('current', k === st.currentK && k !== act);
    });
    this.slots.querySelectorAll('.slot').forEach(sl => sl.classList.toggle('active', +sl.dataset.k === act));
    this.pows.querySelectorAll('.pw').forEach(p => p.classList.toggle('active', +p.dataset.k === act));
    // virgola
    this.comma.style.left = this.x(s) + this.col + 'px';
    this.comma.classList.toggle('hidden', !!st.hideComma);
    // cifre
    const want = new Map();
    let overflow = false;
    if (!st.hideDigits) {
      if (isZero(v)) want.set('z' + s, { ch: '0', col: s, cls: 'sig' });
      else {
        const L = v.d.length, sigKey = v.d;
        if (sigKey !== this.sigKey) { // cifre diverse: ricrea
          for (const [key, e] of this.digitEls) if (key[0] === 's') { e.remove(); this.digitEls.delete(key); }
          this.sigKey = sigKey;
        }
        for (let i = 0; i < L; i++) want.set('s' + i, { ch: v.d[i], col: v.e + (L - 1 - i), cls: 'sig' });
        if (!st.hideZeros) {
          const lo = Math.min(v.e, s), hi = Math.max(v.e + L - 1, s);
          for (let c = lo; c <= hi; c++) if (c < v.e || c > v.e + L - 1) want.set('z' + c, { ch: '0', col: c, cls: 'zero' });
        }
      }
    }
    for (const [key, e] of this.digitEls) {
      if (!want.has(key)) { this.digitEls.delete(key); e.classList.add('leave'); setTimeout(() => e.remove(), 260); }
    }
    let delay = 0;
    for (const [key, w] of want) {
      const out = w.col > this.colMax || w.col < this.colMin;
      if (out) overflow = true;
      let e = this.digitEls.get(key);
      if (!e) {
        e = el('div', 'dg enter ' + w.cls, w.ch);
        e.style.left = this.x(w.col) + 'px';
        if (w.cls === 'zero') e.style.transitionDelay = (delay++ * 18) + 'ms';
        this.layer.appendChild(e); this.digitEls.set(key, e);
        requestAnimationFrame(() => requestAnimationFrame(() => e.classList.remove('enter')));
      } else {
        e.style.left = this.x(w.col) + 'px';
      }
      e.classList.toggle('out', out);
      e.classList.toggle('ghost', !!st.ghost);
    }
    this.overflow.hidden = !overflow;
    // scorrimento automatico per mostrare cifre e virgola
    if (!st.noScroll) {
      const key = `${v.d}|${v.e}|${s}|${this.col}`;
      if (key !== this.lastScrollKey || relayout) {
        this.lastScrollKey = key;
        const L = isZero(v) ? 1 : v.d.length;
        const hi = Math.max(v.e + L - 1, s), lo = Math.min(v.e, s);
        const mid = (this.x(Math.min(hi, this.colMax)) + this.x(Math.max(lo, this.colMin)) + this.col) / 2;
        const target = mid - this.scroll.clientWidth / 2;
        if (this.scroll.scrollWidth > this.scroll.clientWidth + 2) {
          const visL = this.scroll.scrollLeft, visR = visL + this.scroll.clientWidth;
          const needL = this.x(Math.min(hi, this.colMax)) - this.col, needR = this.x(Math.max(lo, this.colMin)) + 2 * this.col;
          if (needL < visL || needR > visR || relayout) this.scroll.scrollTo({ left: Math.max(0, target), behavior: relayout ? 'auto' : 'smooth' });
        }
      }
    }
  }
  initDrag() {
    let start = null;
    const D = this.digits;
    D.addEventListener('pointerdown', e => {
      if (this.o.dragEnabled && !this.o.dragEnabled()) return;
      start = { x: e.clientX, n: 0 };
      D.setPointerCapture(e.pointerId);
      this.root.classList.add('dragging');
    });
    D.addEventListener('pointermove', e => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const n = Math.round(dx / this.col);
      start.n = n;
      for (const [key, el2] of this.digitEls) el2.style.transform = key[0] === 's' ? `translateX(${dx}px)` : '';
      this.root.classList.toggle('drag-moved', Math.abs(dx) > 4);
      if (n !== 0) {
        this.badge.innerHTML = n < 0 ? `× ${times(-n)}` : `÷ ${times(n)}`;
        this.badge.style.left = (this.x(this.state.v.e) + dx) + 'px';
        this.badge.classList.add('show');
      } else this.badge.classList.remove('show');
    });
    const end = () => {
      if (!start) return;
      const n = start.n; start = null;
      this.root.classList.remove('dragging', 'drag-moved');
      this.badge.classList.remove('show');
      for (const e2 of this.digitEls.values()) e2.style.transform = '';
      if (n !== 0) this.o.onShift?.(-n);
    };
    D.addEventListener('pointerup', end);
    D.addEventListener('pointercancel', end);
  }
}

// ------------------------------------------------------------------ vista CONVERSIONI
const cv = { unit: UNIT.get('m'), v: { d: '35', e: -6 }, k: -6, previewK: null };
let convTable;
const kDecOf = () => S.decPrefix ? cv.k : baseK(cv.unit);
const kSciOf = () => S.sciPrefix ? cv.k : baseK(cv.unit);
const kOdgOf = () => S.odgPrefix ? cv.k : baseK(cv.unit);

function fillUnitSelect(sel) {
  sel.innerHTML = '';
  const groups = {};
  allowedUnits().forEach(u => {
    if (!groups[u.g]) { groups[u.g] = el('optgroup'); groups[u.g].label = u.g; sel.appendChild(groups[u.g]); }
    const o = el('option'); o.value = u.id;
    o.textContent = u.label || `${u.sym}${dimSup(u.dim)} — ${u.q}`;
    groups[u.g].appendChild(o);
  });
}

function initConvert() {
  const us = $('unitSelect');
  fillUnitSelect(us);
  us.addEventListener('change', () => {
    const nu = UNIT.get(us.value);
    // mantiene il numero scritto nella notazione decimale e cambia solo l'unità
    const numeral = shiftV(cv.v, -kDecOf() * cv.unit.dim);
    if (!S.decPrefix || cv.k === baseK(cv.unit)) cv.k = baseK(nu);
    cv.unit = nu;
    cv.v = shiftV(numeral, kDecOf() * nu.dim);
    cv.previewK = null;
    $('exampleCaption').textContent = '';
    renderConvert(true);
  });

  convTable = new PrefixTable($('convTable'), {
    pickable: true, draggable: true,
    onPreview: k => { cv.previewK = k; renderConvert(); },
    onPick: k => { cv.k = k; cv.previewK = null; renderConvert(); flash(S.decPrefix ? 'decDisplay' : 'readout'); },
    onShift: n => { cv.v = shiftV(cv.v, n); renderConvert(); },
  });

  const mul = n => () => { cv.v = shiftV(cv.v, n); renderConvert(); };
  $('decMul').addEventListener('click', mul(1));
  $('decDiv').addEventListener('click', mul(-1));
  $('expUp').addEventListener('click', mul(1));
  $('expDown').addEventListener('click', mul(-1));
  $('decPrefix').addEventListener('change', e => { cv.k = +e.target.value; renderConvert(); });
  $('bestPrefix').addEventListener('click', () => { cv.k = bestPrefix(cv.v, cv.unit); renderConvert(); flash(S.decPrefix ? 'decDisplay' : 'readout'); });

  editable($('decDisplay'), $('decInput'),
    () => decString(cv.v, kDecOf() * cv.unit.dim),
    str => { const p = parseNum(str); if (!p) return false; cv.v = shiftV(p, kDecOf() * cv.unit.dim); renderConvert(false, 'dec'); return true; });
  editable($('sciMant'), $('sciMantInput'),
    () => mantString(shiftV(cv.v, -kSciOf() * cv.unit.dim)),
    str => {
      const p = parseNum(str); if (!p) return false;
      const s = kSciOf() * cv.unit.dim;
      cv.v = shiftV(p, sciExp(shiftV(cv.v, -s)) + s); renderConvert(false, 'mant'); return true;
    });
  editable($('sciExp'), $('sciExpInput'),
    () => String(sciExp(shiftV(cv.v, -kSciOf() * cv.unit.dim))),
    str => {
      const t = str.trim().replace(/[−–]/g, '-');
      if (!/^[+-]?\d{1,3}$/.test(t)) return false;
      const w = shiftV(cv.v, -kSciOf() * cv.unit.dim);
      cv.v = shiftV(cv.v, parseInt(t, 10) - sciExp(w)); renderConvert(false, 'exp'); return true;
    });

  $('exampleSameUnit').addEventListener('click', exampleSameUnit);
  $('exampleNewUnit').addEventListener('click', exampleNewUnit);
  exampleNewUnit();
}

/** Display cliccabile che diventa un campo di testo (aggiorna le altre notazioni mentre si scrive). */
function editable(display, input, getText, apply, rerender = renderConvert) {
  let original = null;
  const open = () => {
    original = getText();
    input.value = original;
    display.hidden = true; input.hidden = false;
    input.focus(); input.select();
  };
  const close = commit => {
    if (input.hidden) return;
    if (!commit && original != null) apply(original);
    input.hidden = true; display.hidden = false; input.classList.remove('invalid');
    rerender();
  };
  display.addEventListener('click', open);
  display.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  input.addEventListener('input', () => { input.classList.toggle('invalid', !apply(input.value)); });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); if (!input.classList.contains('invalid')) input.blur(); else shake(input); }
    if (e.key === 'Escape') { e.preventDefault(); close(false); }
  });
  input.addEventListener('blur', () => close(!input.classList.contains('invalid')));
}

function bestPrefix(v, u) {
  if (isZero(v)) return baseK(u);
  const named = [...PFX.keys()].filter(k => k % 3 === 0).sort((a, b) => b - a);
  for (const k of named) if (v.e + v.d.length - 1 >= k * u.dim) return k;
  return K_MIN;
}

function stepsText(from, to, d) {
  const steps = (to - from) * d;
  if (steps === 0) return '';
  const n = Math.abs(steps);
  return `La virgola si sposta di <b>${n}</b> ${plural(n, 'posto', 'posti')} verso ${steps > 0 ? 'sinistra' : 'destra'}: il numero diventa ${times(n)} volte più ${steps > 0 ? 'piccolo' : 'grande'} perché l’unità è ${steps > 0 ? 'più grande' : 'più piccola'}.`;
}

function renderConvert(unitChanged = false, editing = null) {
  const u = cv.unit, d = u.dim, v = cv.v;
  const kDec = kDecOf(), kSci = kSciOf(), kOdg = kOdgOf();
  $('unitSelect').value = u.id;
  // decimale
  const ps = $('decPrefix');
  if (unitChanged || ps.dataset.unit !== u.id) {
    ps.innerHTML = PREFIXES.map(p => `<option value="${p.k}">${unitText(p.k, u)}</option>`).join('');
    ps.dataset.unit = u.id;
  }
  ps.value = cv.k;
  ps.hidden = !S.decPrefix;
  $('decUnit').hidden = S.decPrefix;
  $('decUnit').innerHTML = unitHTML(kDec, u);
  if (editing !== 'dec') $('decDisplay').innerHTML = decHTML(v, kDec * d);
  const len = decLength(v, kDec * d);
  $('decDisplay').classList.toggle('long', len > 14);
  $('decDisplay').classList.toggle('very-long', len > 24);
  // tabella
  convTable.setUnit(u);
  const shownK = cv.previewK ?? cv.k;
  convTable.update({ v, k: shownK, activeK: shownK, currentK: cv.k });
  const left = `<span class="ro-num">${decHTML(v, cv.k * d)}</span>&nbsp;${unitHTML(cv.k, u)}`;
  if (cv.previewK != null && cv.previewK !== cv.k) {
    const pk = cv.previewK;
    $('readout').innerHTML = `<div class="ro-main">${left} <span class="ro-eq">=</span> <span class="ro-num hl">${decHTML(v, pk * d)}</span>&nbsp;${unitHTML(pk, u)}</div>
      <div class="ro-why">${stepsText(cv.k, pk, d)}</div>`;
  } else {
    $('readout').innerHTML = `<div class="ro-main">${left}</div>
      <div class="ro-why muted">La virgola sta dopo la colonna di <b>${unitHTML(cv.k, u)}</b>: cambiando prefisso le cifre restano ferme e si sposta solo la virgola.</div>`;
  }
  const b = bestPrefix(v, u);
  $('bestPrefix').innerHTML = `Prefisso più comodo:<br><b>${decText(v, b * d)}&nbsp;${unitHTML(b, u)}</b>`;
  $('bestPrefix').disabled = b === cv.k;
  $('dimNote').innerHTML = d === 1 ? '' :
    `Unità ${d === 2 ? 'al quadrato' : 'al cubo'}: ogni prefisso ha <b>${d}</b> colonne, perché 1&nbsp;${unitHTML(3, u)} = (10${sup(3)}&nbsp;m)${sup(d)} = 10${sup(3 * d)}&nbsp;${unitHTML(0, u)}.` +
    (d === 3 ? ` Ricorda: 1&nbsp;dm${sup(3)} = 1&nbsp;L e 1&nbsp;cm${sup(3)} = 1&nbsp;mL.` : '');
  $('dimNote').hidden = d === 1;
  // scientifica
  const w = shiftV(v, -kSci * d);
  if (editing !== 'mant') $('sciMant').innerHTML = `<span class="sig">${mantString(w)}</span>`;
  if (editing !== 'exp') $('sciExp').textContent = (sciExp(w) < 0 ? '−' + (-sciExp(w)) : sciExp(w));
  $('sciUnit').innerHTML = unitHTML(kSci, u);
  const o = odgOf(v, kOdg * d);
  $('odgVal').innerHTML = o == null ? '—' : `<span class="pow">${powHTML(o)}</span>&nbsp;${unitHTML(kOdg, u)}`;
  const wo = shiftV(v, -kOdg * d);
  $('sciHint').innerHTML = isZero(w) ? '' :
    `coefficiente tra 1 e 10 · ▲▼ fanno crescere o calare la potenza` +
    (o == null ? '' : ` · ordine di grandezza: ${mantString(wo)} ${o === sciExp(wo) ? '&lt;' : '≥'} ${S.odgRule === '5' ? '5' : '√10'}`);
  const sk = siK(u);
  $('siLine').innerHTML = (kSci === sk) ? '' :
    `Nell’unità SI: ${sciHTML(v, sk * d, unitHTML(sk, u))} &nbsp;=&nbsp; <span class="num">${decHTML(v, sk * d)}</span>&nbsp;${unitHTML(sk, u)}`;
  $('siLine').hidden = kSci === sk;
}

function flash(id) { const e = $(id); e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); }
function shake(e) { e.classList.remove('shake'); void e.offsetWidth; e.classList.add('shake'); }

// ------------------------------------------------------------------ esempi
let exBag = [], lastEx = null;
function exampleUnit(e) {
  const u = UNIT.get(e[3]);
  if (unitAllowed(u)) return u;
  if (u.q === 'massa') return UNIT.get('kg');
  return null;
}
function loadExample(e, u) {
  const [label, num, k] = e;
  cv.unit = u; cv.k = k; cv.v = shiftV(parseNum(num), k * u.dim); cv.previewK = null;
  $('exampleCaption').innerHTML = `<b>${label}</b>: ${decText(cv.v, k * u.dim)}&nbsp;${unitHTML(k, u)}`;
  renderConvert(true);
  flash('decDisplay');
}
function exampleSameUnit() {
  const u = cv.unit;
  const pool = EXAMPLES.filter(e => { const eu = UNIT.get(e[3]); return eu.q === u.q && eu.dim === u.dim && e !== lastEx; });
  if (!pool.length || Math.random() < 0.3) loadExample(randomExample(u), u);
  else { const e = pick(pool); lastEx = e; loadExample(e, u); }
}
function exampleNewUnit() {
  const cur = cv.unit;
  if (Math.random() < 0.2) {
    const us = allowedUnits().filter(x => x.q !== cur.q);
    const u = pick(us.length ? us : allowedUnits());
    loadExample(randomExample(u), u); return;
  }
  for (let t = 0; t < 200; t++) {
    if (!exBag.length) exBag = EXAMPLES.slice().sort(() => Math.random() - 0.5);
    const e = exBag.pop();
    const u = exampleUnit(e);
    if (!u || (u.q === cur.q && t < 150) || e === lastEx) continue;
    lastEx = e; loadExample(e, u); return;
  }
  loadExample(randomExample(cur), cur);
}
function randomExample(u) {
  const ks = usualKs(u, PREFIXES.map(p => p.k).filter(k => Math.abs(k) <= (u.dim === 1 ? 9 : 6)));
  const k = pick(ks);
  const L = 1 + rnd(3);
  let d = String(1 + rnd(9));
  for (let i = 1; i < L; i++) d += (i === L - 1 ? 1 + rnd(9) : rnd(10));
  const v = norm(d, rnd(7) - 3 - (L - 1));
  return ['Numero a caso', decString(v, 0), k, u.id];
}

// ------------------------------------------------------------------ CIFRE SIGNIFICATIVE
const ROUND_MODES = {
  'half-up':   { name: 'Arrotondamento', short: 'se la prima cifra eliminata è ≥ 5 per eccesso, altrimenti per difetto' },
  'up':        { name: 'Per eccesso', short: 'l’ultima cifra tenuta aumenta di 1' },
  'down':      { name: 'Per difetto (troncamento)', short: 'si tolgono le cifre in più' },
  'half-even': { name: 'Al pari (esattamente a metà → cifra pari)', short: 'come l’arrotondamento, ma esattamente a metà si sceglie la cifra pari' },
};

/** Arrotonda v a N cifre significative. Il risultato ha sempre d di lunghezza N (anche con zeri finali significativi). */
function roundSig(v, N, mode) {
  if (isZero(v)) return { d: '0', e: 0, exact: true, low: v, high: v };
  const L = v.d.length;
  if (L <= N) { const r = { d: v.d + '0'.repeat(N - L), e: v.e - (N - L) }; return { ...r, exact: true, low: r, high: r, up: false }; }
  const keep = v.d.slice(0, N), rest = v.d.slice(N), e = v.e + (L - N);
  const first = +rest[0], tailNZ = /[1-9]/.test(rest.slice(1));
  let up;
  if (mode === 'up') up = true;
  else if (mode === 'down') up = false;
  else if (mode === 'half-even') up = first > 5 || (first === 5 && (tailNZ || (+keep[N - 1]) % 2 === 1));
  else up = first >= 5;
  const low = { d: keep, e };
  let hk = (BigInt(keep) + 1n).toString(), he = e;
  if (hk.length > N) { hk = hk.slice(0, N); he++; }
  const high = { d: hk, e: he };
  return { ...(up ? high : low), up, low, high, first, tailNZ, exact: false, keep };
}
function explainRound(r, mode, N) {
  if (r.exact) return `Il numero ha già al massimo ${N} ${plural(N, 'cifra significativa', 'cifre significative')}: si scrivono zeri significativi finché le cifre sono ${N}.`;
  const dir = r.up ? '<b>per eccesso</b>' : '<b>per difetto</b>';
  const f = `<b class="decide">${r.first}</b>`;
  if (mode === 'up') return `Per eccesso: le cifre eliminate non sono tutte zero, quindi l’ultima cifra tenuta aumenta di 1.`;
  if (mode === 'down') return `Per difetto: si eliminano semplicemente le cifre dopo la ${N}ª.`;
  if (mode === 'half-even' && r.first === 5 && !r.tailNZ)
    return `La prima cifra eliminata è ${f} e dopo ci sono solo zeri: il numero è esattamente a metà. Si sceglie la cifra pari, quindi si arrotonda ${dir}.`;
  return `La prima cifra eliminata è ${f}, che è ${r.first >= 5 ? '≥ 5' : '< 5'}: si arrotonda ${dir}.`;
}
/** Notazione decimale con cifre tenute / decisiva / eliminate evidenziate. */
function decHTMLMarked(v, s, N) {
  const { int, frac } = decTokens(v, s);
  let si = 0, i = 0;
  const cls = t => {
    if (t[1] !== 'sig') return si > N ? 'zero drop' : 'zero';
    const c = si < N ? 'sig keep' : si === N ? 'sig drop decide' : 'sig drop';
    si++; return c;
  };
  let h = '';
  int.forEach((t, j) => { if (int.length > 4 && j > 0 && (int.length - j) % 3 === 0) h += '<span class="gap"></span>'; h += `<span class="${cls(t)}" style="--i:${i++}">${t[0]}</span>`; });
  if (frac.length) {
    h += '<span class="comma">,</span>';
    frac.forEach((t, j) => { if (frac.length > 4 && j > 0 && j % 3 === 0) h += '<span class="gap"></span>'; h += `<span class="${cls(t)}" style="--i:${i++}">${t[0]}</span>`; });
  }
  return h;
}
const sfModeOpts = () => Object.entries(ROUND_MODES).map(([k, m]) => `<option value="${k}">${m.name}</option>`).join('');

const sf = { unit: UNIT.get('m'), v: { d: '45728', e: -7 }, k: -3, N: 3, mode: S.roundMode || 'half-up' };
let sfTable;
function randomSfNumber(u) {
  const L = 4 + rnd(4);
  let d = String(1 + rnd(9));
  for (let i = 1; i < L; i++) d += (i === L - 1 ? 1 + rnd(9) : rnd(10));
  // ogni tanto un caso interessante: …5 esatto, oppure tanti 9
  if (Math.random() < 0.15) d = d.slice(0, 2 + rnd(2)) + '5';
  else if (Math.random() < 0.12) d = String(1 + rnd(9)) + '99' + (1 + rnd(9));
  const k = pick(usualKs(u, PREFIXES.map(p => p.k).filter(k => Math.abs(k) <= (u.dim === 1 ? 9 : 3))));
  return { v: norm(d, rnd(6) - 2 - (d.length - 1) + k * u.dim), k };
}
function sfNew(sameUnit) {
  const u = sameUnit ? sf.unit : pick(allowedUnits());
  const { v, k } = randomSfNumber(u);
  sf.unit = u; sf.v = v; sf.k = k;
  renderSf(true); flash('sfDisplay');
}
function initSigfig() {
  fillUnitSelect($('sfUnit'));
  $('sfUnit').addEventListener('change', () => {
    const nu = UNIT.get($('sfUnit').value);
    const numeral = shiftV(sf.v, -sf.k * sf.unit.dim);
    sf.unit = nu; sf.v = shiftV(numeral, sf.k * nu.dim); renderSf(true);
  });
  $('sfMode').innerHTML = sfModeOpts();
  $('sfMode').value = sf.mode;
  $('sfMode').addEventListener('change', e => { sf.mode = e.target.value; renderSf(); });
  $('sfPrefix').addEventListener('change', e => { sf.k = +e.target.value; renderSf(); });
  $('sfMinus').addEventListener('click', () => { sf.N = Math.max(1, sf.N - 1); renderSf(); });
  $('sfPlus').addEventListener('click', () => { sf.N = Math.min(9, sf.N + 1); renderSf(); });
  $('sfNewSame').addEventListener('click', () => sfNew(true));
  $('sfNewOther').addEventListener('click', () => sfNew(false));
  sfTable = new PrefixTable($('sfTable'), { pickable: true, draggable: false,
    onPreview: () => {}, onPick: k => { sf.k = k; renderSf(); } });
  editable($('sfDisplay'), $('sfInput'),
    () => decString(sf.v, sf.k * sf.unit.dim),
    str => { const p = parseNum(str); if (!p || isZero(p)) return false; sf.v = shiftV(p, sf.k * sf.unit.dim); renderSf(false, true); return true; },
    () => renderSf());
  sfNew(false);
}
function renderSf(unitChanged = false, editing = false) {
  const u = sf.unit, d = u.dim, s = sf.k * d, N = sf.N;
  $('sfUnit').value = u.id;
  const ps = $('sfPrefix');
  if (unitChanged || ps.dataset.unit !== u.id) { ps.innerHTML = PREFIXES.map(p => `<option value="${p.k}">${unitText(p.k, u)}</option>`).join(''); ps.dataset.unit = u.id; }
  ps.value = sf.k;
  if (!editing) $('sfDisplay').innerHTML = decHTMLMarked(sf.v, s, N);
  $('sfN').textContent = N;
  $('sfDigits').textContent = `(il numero ne ha ${sf.v.d.length})`;
  const r = roundSig(sf.v, N, sf.mode);
  const uh = unitHTML(sf.k, u);
  // le due possibilità
  if (r.exact) $('sfBracket').innerHTML = `<div class="brk-why">${explainRound(r, sf.mode, N)}</div>`;
  else $('sfBracket').innerHTML = `
    <div class="brk">
      <div class="brk-opt${r.up ? '' : ' chosen'}"><span class="brk-l">per difetto</span><span class="num">${decHTML(r.low, s)}</span>&nbsp;${uh}</div>
      <div class="brk-mid"><span class="num">${decHTMLMarked(sf.v, s, N)}</span>&nbsp;${uh}</div>
      <div class="brk-opt${r.up ? ' chosen' : ''}"><span class="brk-l">per eccesso</span><span class="num">${decHTML(r.high, s)}</span>&nbsp;${uh}</div>
    </div><div class="brk-why">${explainRound(r, sf.mode, N)}</div>`;
  // risultato nelle tre notazioni
  const ambiguous = !isZero(r) && r.e > s && /0$/.test(r.d + '0'.repeat(Math.max(0, r.e - s)));
  $('sfDec').innerHTML = `<span class="num">${decHTML(r, s)}</span>&nbsp;${uh}`;
  $('sfDecNote').innerHTML = ambiguous ? 'Attenzione: in decimale gli zeri finali non dicono quante sono le cifre significative. Meglio un prefisso o la notazione scientifica.' : '';
  const b = bestPrefix(r, u);
  $('sfPfx').innerHTML = `<span class="num">${decHTML(r, b * d)}</span>&nbsp;${unitHTML(b, u)}`;
  const kb = S.sciPrefix ? sf.k : baseK(u);
  $('sfSci').innerHTML = sciHTML(r, kb * d, unitHTML(kb, u));
  sfTable.setUnit(u);
  sfTable.update({ v: r, k: sf.k, activeK: sf.k, currentK: sf.k });
  // tabella al variare di N
  const rows = [];
  for (let n = 1; n <= Math.max(6, sf.v.d.length); n++) {
    const rn = roundSig(sf.v, n, sf.mode);
    rows.push(`<tr class="${n === N ? 'cur' : ''}" data-n="${n}"><td>${n}</td><td class="num">${decHTML(rn, s)}&nbsp;${uh}</td><td>${sciHTML(rn, kb * d, unitHTML(kb, u))}</td></tr>`);
  }
  $('sfRows').innerHTML = rows.join('');
  $('sfRows').querySelectorAll('tr').forEach(tr => tr.onclick = () => { sf.N = +tr.dataset.n; renderSf(); });
}

// esercizi sulle cifre significative
function genSf(level) {
  const L = LEVELS[level];
  let units = L.units.filter(id => unitAllowed(UNIT.get(id)));
  if (!units.length) units = ['m'];
  for (let t = 0; t < 400; t++) {
    const u = UNIT.get(pick(units));
    const { v } = randomSfNumber(u);
    const ks = usualKs(u, L.ks);
    const k = pick(ks);
    const vv = shiftV(norm(v.d, 0), k * u.dim + (rnd(6) - 3) - (v.d.length - 1) + (level === 'base' ? 2 : 0));
    const N = 1 + rnd(level === 'base' ? 3 : 4);
    if (vv.d.length <= N) continue;
    if (decLength(vv, k * u.dim) > L.maxLen) continue;
    const r = roundSig(vv, N, S.roundMode);
    if (r.e > k * u.dim) continue; // eviterebbe zeri finali ambigui nella risposta decimale
    return { kind: 'sf', u, v: vv, kA: k, N, mode: S.roundMode, r, level };
  }
  const u = UNIT.get('m'); const v = { d: '4572', e: -3 };
  return { kind: 'sf', u, v, kA: 0, N: 2, mode: S.roundMode, r: roundSig(v, 2, S.roundMode), level };
}
function renderGivenSf() {
  const { u, v, kA, N, mode } = ex;
  const who = duel ? `<b>${escapeHTML(duel.names[duel.cur])}</b>: a` : 'A';
  $('givenCard').innerHTML = `<div class="given-head"><span class="badge">Consegna</span> ${who}pprossima questa misura di <b>${u.q}</b> a <b>${N} ${plural(N, 'cifra significativa', 'cifre significative')}</b>. Metodo: <b>${ROUND_MODES[mode].name.toLowerCase()}</b> <span class="muted">(${ROUND_MODES[mode].short})</span>.</div>
    <div class="given-val"><span class="num">${decHTML(v, kA * u.dim)}</span>&nbsp;${unitHTML(kA, u)}</div>`;
  ex.givenTable = null;
}
function mountSfStep(st) {
  const { u, v, kA, N, r, mode } = ex, d = u.dim, s = kA * d, uh = unitHTML(kA, u);
  const c = st.card;
  if (st.type === 'cut') {
    c.innerHTML = stepHead(st, `Tocca l’ultima cifra da tenere (la ${N}ª cifra significativa)`) +
      `<div class="step-body"><p class="instr">Ricorda: gli zeri iniziali non sono cifre significative.</p>
       <div class="cut-row num"></div></div>` + stepFoot();
    const { int, frac } = decTokens(v, s);
    const toks = int.map(t => ({ t })).concat(frac.length ? [{ comma: true }] : [], frac.map(t => ({ t })));
    let si = 0;
    c.querySelector('.cut-row').innerHTML = toks.map((x, i) => x.comma ? '<span class="comma">,</span>' :
      `<button class="cut-d ${x.t[1]}" data-i="${i}" data-si="${x.t[1] === 'sig' ? si++ : -1}" data-lead="${x.t[1] === 'zero' && si === 0 ? 1 : 0}">${x.t[0]}</button>`).join('') + `&nbsp;${uh}`;
    st.choice = null;
    c.querySelectorAll('.cut-d').forEach(b => b.onclick = () => {
      if (st.solved) return;
      st.choice = b; st.update();
    });
    st.update = () => {
      const ci = st.choice ? +st.choice.dataset.i : -1;
      c.querySelectorAll('.cut-d').forEach(b => { const i = +b.dataset.i; b.classList.toggle('kept', ci >= 0 && i <= ci && b.dataset.lead !== '1'); b.classList.toggle('picked', i === ci); b.classList.toggle('cut', ci >= 0 && i > ci); });
      clearFb(st);
    };
    st.check = () => st.choice && +st.choice.dataset.si === N - 1;
    st.why = () => {
      if (!st.choice) return 'Tocca una cifra.';
      if (st.choice.dataset.lead === '1') return 'Gli zeri iniziali non sono cifre significative: si comincia a contare dalla prima cifra diversa da zero.';
      const si2 = +st.choice.dataset.si;
      if (si2 < 0) return 'Quello zero serve solo a indicare la posizione della virgola.';
      return `Così tieni ${si2 + 1} ${plural(si2 + 1, 'cifra significativa', 'cifre significative')}, ma ne servono ${N}.`;
    };
    st.solve = () => { st.choice = c.querySelector(`.cut-d[data-si="${N - 1}"]`); };
  }
  if (st.type === 'round') {
    const kb = S.sciPrefix ? kA : baseK(u);
    const opts = new Map();
    const add = (val, ok) => { const h = sciHTML(val, kb * d, unitHTML(kb, u)); if (!opts.has(h)) opts.set(h, ok); };
    add(r, true);
    if (!r.exact) add(r.up ? r.low : r.high, false);
    add(roundSig(v, N + 1, mode), false);
    if (N > 1) add(roundSig(v, N - 1, mode), false);
    add(shiftV(r, pick([-1, 1])), false);
    add(shiftV(r, pick([-2, 2, 3])), false);
    const list = [...opts.entries()].slice(0, 4).sort(() => Math.random() - 0.5);
    c.innerHTML = stepHead(st, `Arrotonda: qual è il risultato in notazione scientifica?`) +
      `<div class="step-body"><p class="instr">${N} ${plural(N, 'cifra significativa', 'cifre significative')}, metodo: ${ROUND_MODES[mode].name.toLowerCase()}.</p>
       <div class="odg-opts">${list.map(([h, ok], i) => `<button class="btn opt" data-ok="${ok ? 1 : 0}"><span>${h}</span></button>`).join('')}</div></div>` + stepFoot();
    c.querySelector('.check').hidden = true;
    st.choice = null;
    c.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (st.solved || ex.cur !== st.i) return;
      st.choice = b; c.querySelectorAll('.opt').forEach(x => x.classList.toggle('chosen', x === b)); verify(st);
    });
    st.update = () => clearFb(st);
    st.check = () => st.choice?.dataset.ok === '1';
    st.why = () => `Conta le cifre del coefficiente (devono essere ${N}) e controlla l’arrotondamento: ${explainRound(r, mode, N)}`;
    st.solve = () => { const b = c.querySelector('.opt[data-ok="1"]'); st.choice = b; c.querySelectorAll('.opt').forEach(x => x.classList.toggle('chosen', x === b)); };
  }
  if (st.type === 'sfdec') {
    const want = decString(r, s);
    c.innerHTML = stepHead(st, `Scrivi il risultato in notazione decimale in ${uh}`) +
      `<div class="step-body"><p class="instr">Attenzione agli zeri: se sono cifre significative vanno scritti.</p>
       <label class="type-row big-in"><input class="type-in" inputmode="decimal" autocomplete="off" spellcheck="false">&nbsp;${uh}</label></div>` + stepFoot();
    const inp = c.querySelector('.type-in');
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') c.querySelector('.check').click(); });
    inp.addEventListener('input', () => clearFb(st));
    const clean = x => x.trim().replace(/[\s  ']/g, '').replace('.', ',');
    st.update = () => clearFb(st);
    st.check = () => clean(inp.value) === want;
    st.why = () => {
      const p = parseNum(inp.value);
      if (!p) return 'Scrivi un numero.';
      if (eqV(p, norm(r.d, r.e))) return `Il valore è giusto, ma servono <b>${N}</b> cifre significative: scrivi anche gli zeri significativi finali.`;
      return `Non è il valore arrotondato. ${explainRound(r, mode, N)}`;
    };
    st.solve = () => { inp.value = want; };
  }
}
function sfSummary() {
  const { u, v, kA, N, r } = ex, s = kA * u.dim, kb = S.sciPrefix ? kA : baseK(u);
  return `${decText(v, s)}&nbsp;${unitHTML(kA, u)} ≈ ${decText(r, s)}&nbsp;${unitHTML(kA, u)} = ${sciHTML(r, kb * u.dim, unitHTML(kb, u))} <span class="muted">(${N} c.s.)</span>`;
}

// ------------------------------------------------------------------ vista ESERCITATI
const LEVELS = {
  base:     { ks: [3, 2, 1, 0, -1, -2, -3], units: ['m', 'g', 'kg', 's', 'A', 'V', 'W', 'J', 'N', 'Pa', 'Hz'], dims: false, maxLen: 9 },
  medio:    { ks: PREFIXES.map(p => p.k), units: UNITS.filter(u => u.dim === 1).map(u => u.id), dims: false, maxLen: 14 },
  avanzato: { ks: PREFIXES.map(p => p.k), units: UNITS.map(u => u.id), dims: true, maxLen: 16 },
};
const score = { pts: 0, streak: 0, done: 0 };
let ex = null;
let mode = 'train';
let duel = null;

function initPractice() {
  const ls = $('levelSelect');
  ls.value = localStorage.getItem('level') || 'base';
  ls.addEventListener('change', () => { localStorage.setItem('level', ls.value); if (mode === 'train') newExercise(); });
  const ts = $('typeSelect');
  ts.value = localStorage.getItem('exType') || 'conv';
  ts.addEventListener('change', () => { localStorage.setItem('exType', ts.value); if (mode === 'train') newExercise(); });
  $('newExercise').addEventListener('click', newExercise);
  document.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $('duelStart').addEventListener('click', startDuel);
}

function setMode(m) {
  mode = m;
  document.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  duel = null;
  $('duelBar').hidden = true;
  $('levelSelect').disabled = false;
  if (m === 'train') {
    $('duelSetup').hidden = true;
    $('newExercise').hidden = false;
    $('givenCard').hidden = false; $('steps').hidden = false;
    newExercise();
  } else {
    $('duelSetup').hidden = false;
    $('newExercise').hidden = true;
    $('givenCard').hidden = true; $('steps').hidden = true;
  }
  updateScoreVisibility();
}
function updateScoreVisibility() { $('scoreBox').hidden = mode !== 'train' || !S.scores; }

function startDuel() {
  const n1 = $('p1Name').value.trim() || 'Giocatore 1', n2 = $('p2Name').value.trim() || 'Giocatore 2';
  duel = { names: [n1, n2], pts: [0, 0], time: [0, 0], rounds: +$('duelRounds').value, turns: 0, cur: 0 };
  $('duelSetup').hidden = true;
  $('duelBar').hidden = false;
  $('levelSelect').disabled = true;
  $('givenCard').hidden = false; $('steps').hidden = false;
  newExercise();
}
const fmtTime = s => { s = Math.round(s); const m = Math.floor(s / 60); return m ? `${m} min ${s % 60} s` : `${s} s`; };
function renderDuelBar() {
  if (!duel) return;
  const round = Math.min(duel.rounds, Math.floor(duel.turns / 2) + 1);
  $('duelBar').innerHTML = [0, 1].map(i => `
    <div class="player${i === duel.cur ? ' on' : ''}">
      <div class="pl-name">${escapeHTML(duel.names[i])}${i === duel.cur ? ' <span class="pl-turn">tocca a te</span>' : ''}</div>
      <div class="pl-pts"><b>${duel.pts[i]}</b> punti</div>
      <div class="pl-time">${fmtTime(duel.time[i])}</div>
    </div>`).join(`<div class="duel-round">Turno<br><b>${round}</b> di ${duel.rounds}</div>`);
}
const escapeHTML = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function genExercise(level) {
  const L = LEVELS[level];
  let units = L.units.filter(id => unitAllowed(UNIT.get(id)));
  if (!units.length) units = ['m'];
  for (let tries = 0; tries < 800; tries++) {
    let uid = pick(units);
    if (L.dims && Math.random() < 0.45) uid = pick(['m2', 'm3']);
    const u = UNIT.get(uid), d = u.dim, b = baseK(u);
    const ks = usualKs(u, L.ks.filter(k => d === 1 || Math.abs(k) <= 6 || Math.random() < 0.3));
    if (!ks.includes(b)) ks.push(b);
    const given = pick(['dec', 'dec', 'sci', 'tab']);
    const kA = (given === 'dec' && !S.decPrefix) || (given === 'sci' && !S.sciPrefix) ? b : pick(ks);
    const others = ks.filter(k => k !== kA);
    if (!others.length) continue;
    const kB = pick(others);
    const kDec = S.decPrefix ? kB : b, kSci = S.sciPrefix ? kB : b, kOdg = S.odgPrefix ? kB : b;
    if (level === 'base' && Math.abs(kA - kB) > 4) continue;
    const len = 1 + rnd(3);
    let digs = String(1 + rnd(9));
    for (let i = 1; i < len; i++) digs += (i === len - 1 ? 1 + rnd(9) : rnd(10));
    const v = norm(digs, rnd(7) - 3 - (len - 1) + kA * d);
    if (decLength(v, kA * d) > L.maxLen || decLength(v, kDec * d) > L.maxLen) continue;
    if (v.e + v.d.length - 1 > K_MAX * d + d - 1 || v.e < K_MIN * d) continue;
    return { u, v, kA, kB, kDec, kSci, kOdg, given, level };
  }
  return { u: UNIT.get('m'), v: { d: '35', e: 0 }, kA: 0, kB: -2, kDec: -2, kSci: 0, kOdg: 0, given: 'dec', level };
}

function newExercise() {
  const t = $('typeSelect').value;
  const kind = t === 'mix' ? pick(['conv', 'sf']) : t;
  const steps = [];
  if (kind === 'sf') {
    ex = genSf($('levelSelect').value);
    steps.push({ type: 'cut' }, { type: 'round' }, { type: 'sfdec' });
  } else {
    ex = genExercise($('levelSelect').value);
    ex.kind = 'conv';
    if (ex.given !== 'tab') steps.push({ type: 'tab' });
    if (!(ex.given === 'dec' && ex.kDec === ex.kA)) steps.push({ type: 'dec' });
    if (!(ex.given === 'sci' && ex.kSci === ex.kA)) steps.push({ type: 'sci' });
    steps.push({ type: 'odg' });
  }
  ex.steps = steps; ex.cur = 0; ex.pts = 0; ex.t0 = performance.now();
  renderGiven();
  const host = $('steps'); host.innerHTML = '';
  steps.forEach((st, i) => { st.i = i; st.tries = 0; st.solved = false; st.card = el('section', 'card step locked'); host.appendChild(st.card); mountStep(st); });
  activate(0);
  renderDuelBar();
}

function renderGiven() {
  if (ex.kind === 'sf') return renderGivenSf();
  const { u, v, kA, given } = ex, d = u.dim;
  const g = $('givenCard');
  const uh = unitHTML(kA, u);
  const name = { dec: 'notazione decimale', sci: 'notazione scientifica', tab: 'tabella dei prefissi' }[given];
  let body = '';
  if (given === 'dec') body = `<div class="given-val"><span class="num">${decHTML(v, kA * d)}</span>&nbsp;${uh}</div>`;
  if (given === 'sci') body = `<div class="given-val">${sciHTML(v, kA * d, uh)}</div>`;
  if (given === 'tab') body = `<div class="given-tab"></div><p class="hint">La virgola è dopo la colonna di <b>${uh}</b>.</p>`;
  const who = duel ? `<b>${escapeHTML(duel.names[duel.cur])}</b>: u` : 'U';
  g.innerHTML = `<div class="given-head"><span class="badge">Consegna</span> ${who}na misura di <b>${u.q}</b> è scritta in <b>${name}</b>. Riscrivila nelle altre notazioni, un passo alla volta.</div>${body}`;
  if (given === 'tab') {
    const t = new PrefixTable(g.querySelector('.given-tab'), { pickable: false, draggable: false });
    t.setUnit(u);
    t.update({ v, k: kA, activeK: kA });
    ex.givenTable = t;
  } else ex.givenTable = null;
}

const stepHead = (st, title) => `<div class="step-head"><span class="step-n">${st.i + 1}</span><h3>${title}</h3><span class="step-status"></span></div>`;
const stepFoot = () => `<div class="step-foot"><button class="btn primary check">Verifica</button><button class="btn ghost solve">Mostra soluzione</button><div class="feedback" aria-live="polite"></div></div>`;

function mountStep(st) {
  if (ex.kind === 'sf') { mountSfStep(st); wireStep(st); return; }
  const { u, v, kA, kDec, kSci, kOdg } = ex, d = u.dim;
  const c = st.card;
  if (st.type === 'tab') {
    st.off = 0; while (st.off === 0) st.off = rnd(9) - 4;
    c.innerHTML = stepHead(st, 'Metti le cifre nella tabella') +
      `<div class="step-body"><p class="instr">Trascina le cifre (o usa le frecce) finché il numero, letto con la virgola dopo <b>${unitHTML(kA, u)}</b>, vale quanto la consegna.</p>
       <div class="ex-tab"></div>
       <div class="move-row"><button class="btn round mv-l" aria-label="Sposta a sinistra">◀</button><span class="move-read"></span><button class="btn round mv-r" aria-label="Sposta a destra">▶</button></div></div>` + stepFoot();
    st.table = new PrefixTable(c.querySelector('.ex-tab'), {
      pickable: false, draggable: true, dragEnabled: () => !st.solved && ex.cur === st.i,
      onShift: n => { st.off += n; st.update(); },
    });
    st.table.setUnit(u);
    c.querySelector('.mv-l').onclick = () => { st.off += 1; st.update(); };
    c.querySelector('.mv-r').onclick = () => { st.off -= 1; st.update(); };
    st.value = () => shiftV(v, st.off);
    st.update = () => {
      const sv = st.value();
      st.table.update({ v: sv, k: kA, activeK: kA });
      c.querySelector('.move-read').innerHTML = `Si legge: <b class="num">${decHTML(sv, kA * d)}</b>&nbsp;${unitHTML(kA, u)}`;
      clearFb(st);
    };
    st.check = () => st.off === 0;
    st.why = () => `Le cifre sono troppo a ${st.off > 0 ? 'sinistra' : 'destra'}: ` + wrongBy(st.off, 'il numero');
    st.solve = () => { st.off = 0; };
  }
  if (st.type === 'dec') {
    // si parte dal numero scritto come nell'unità della consegna, ma accanto alla nuova unità
    st.off = (kDec - kA) * d;
    const same = st.off === 0;
    if (same) st.off = pick([-3, -2, -1, 1, 2, 3]);
    c.innerHTML = stepHead(st, `Scrivi in notazione decimale in ${unitHTML(kDec, u)}`) +
      `<div class="step-body"><p class="instr">${same ? 'Sposta la virgola finché il numero vale quanto la consegna' : `Il numero è stato copiato così com’era, ma ora l’unità è <b>${unitHTML(kDec, u)}</b>. Sposta la virgola`}: gli zeri compaiono da soli.</p>
       <div class="move-row big"><button class="btn round mv-l" aria-label="Virgola a sinistra">◀ ,</button>
         <div class="ex-dec"><span class="num"></span>&nbsp;${unitHTML(kDec, u)}</div>
         <button class="btn round mv-r" aria-label="Virgola a destra">, ▶</button></div>
       <label class="type-row">oppure scrivilo: <input class="type-in" inputmode="decimal" autocomplete="off" spellcheck="false"></label></div>` + stepFoot();
    const inp = c.querySelector('.type-in');
    c.querySelector('.mv-l').onclick = () => { st.custom = null; st.off -= 1; st.update(); };
    c.querySelector('.mv-r').onclick = () => { st.custom = null; st.off += 1; st.update(); };
    inp.addEventListener('input', () => { const p = parseNum(inp.value); st.custom = p ? shiftV(p, kDec * d) : null; inp.classList.toggle('invalid', !p && inp.value.trim() !== ''); st.update(true); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') c.querySelector('.check').click(); });
    st.value = () => st.custom ?? shiftV(v, st.off);
    st.update = fromInput => {
      c.querySelector('.ex-dec .num').innerHTML = decHTML(st.value(), kDec * d);
      if (!fromInput) inp.value = '';
      clearFb(st);
    };
    st.check = () => eqV(st.value(), v);
    st.why = () => {
      const sv = st.value();
      if (sv.d !== v.d) return 'Le cifre significative non corrispondono: devono restare <b>' + v.d.split('').join(' ') + '</b>.';
      return wrongBy(sv.e - v.e, 'Il numero') + hintUnit(kA, kDec, d);
    };
    st.solve = () => { st.custom = null; st.off = 0; inp.value = ''; };
  }
  if (st.type === 'sci') {
    const L = v.d.length;
    st.p = L; st.exp = 0;
    c.innerHTML = stepHead(st, `Scrivi in notazione scientifica in ${unitHTML(kSci, u)}`) +
      `<div class="step-body"><p class="instr">Il coefficiente deve stare <b>tra 1 e 10</b>. Sposta la virgola del coefficiente e regola l’esponente: il valore qui sotto deve restare quello giusto.</p>
       <div class="sci-ex">
         <button class="btn round mv-l" aria-label="Virgola a sinistra">◀ ,</button>
         <span class="sig mant"></span>
         <button class="btn round mv-r" aria-label="Virgola a destra">, ▶</button>
         <span class="times">×</span><span class="ten">10</span>
         <div class="exp-ctl"><div class="exp-val"></div><div class="exp-btns"><button class="exp-btn up" aria-label="Aumenta esponente">▲</button><button class="exp-btn down" aria-label="Diminuisci esponente">▼</button></div></div>
         <span class="unit">${unitHTML(kSci, u)}</span>
       </div>
       <p class="live">Vale: <span class="num live-val"></span>&nbsp;${unitHTML(kSci, u)}</p></div>` + stepFoot();
    c.querySelector('.mv-l').onclick = () => { if (st.p > -3) st.p -= 1; st.update(); };
    c.querySelector('.mv-r').onclick = () => { if (st.p < L + 3) st.p += 1; st.update(); };
    c.querySelector('.up').onclick = () => { st.exp += 1; st.update(); };
    c.querySelector('.down').onclick = () => { st.exp -= 1; st.update(); };
    st.mant = () => norm(v.d, st.p - L);
    st.value = () => shiftV(st.mant(), st.exp + kSci * d);
    st.update = () => {
      c.querySelector('.mant').innerHTML = decHTML(st.mant(), 0);
      c.querySelector('.exp-val').textContent = st.exp < 0 ? '−' + (-st.exp) : st.exp;
      c.querySelector('.live-val').innerHTML = decHTML(st.value(), kSci * d);
      clearFb(st);
    };
    st.check = () => st.p === 1 && eqV(st.value(), v);
    st.why = () => {
      if (eqV(st.value(), v)) return 'Il valore è giusto, ma il coefficiente deve essere <b>almeno 1 e minore di 10</b>: una sola cifra prima della virgola.';
      const mf = parseFloat(decString(st.mant(), 0).replace(',', '.'));
      return (mf >= 1 && mf < 10 ? 'Il coefficiente va bene. ' : '') + wrongBy(st.value().e - v.e, 'Il valore') + ' Correggi l’esponente.';
    };
    st.solve = () => { st.p = 1; st.exp = sciExp(shiftV(v, -kSci * d)); };
  }
  if (st.type === 'odg') {
    const n = sciExp(shiftV(v, -kOdg * d));
    st.correct = odgOf(v, kOdg * d);
    const opts = [n - 1, n, n + 1, n + 2];
    c.innerHTML = stepHead(st, `Qual è l’ordine di grandezza in ${unitHTML(kOdg, u)}?`) +
      `<div class="step-body"><p class="instr">Se il coefficiente è minore di ${S.odgRule === '5' ? '5' : '√10 ≈ 3,16'} l’ordine di grandezza è 10<sup>n</sup>, altrimenti 10<sup>n+1</sup>.</p>
       <div class="odg-opts">${opts.map(o => `<button class="btn opt" data-o="${o}"><span>${powHTML(o)}&nbsp;${unitHTML(kOdg, u)}</span></button>`).join('')}</div></div>` + stepFoot();
    c.querySelector('.check').hidden = true;
    st.choice = null;
    c.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (st.solved || ex.cur !== st.i) return;
      st.choice = +b.dataset.o;
      c.querySelectorAll('.opt').forEach(x => x.classList.toggle('chosen', x === b));
      verify(st);
    });
    st.update = () => clearFb(st);
    st.check = () => st.choice === st.correct;
    st.why = () => `Il numero è ${sciHTML(v, kOdg * d, unitHTML(kOdg, u))}: confronta il coefficiente con ${S.odgRule === '5' ? '5' : '√10'}.`;
    st.solve = () => { st.choice = st.correct; c.querySelectorAll('.opt').forEach(x => x.classList.toggle('chosen', +x.dataset.o === st.correct)); };
  }
  wireStep(st);
}
function wireStep(st) {
  const c = st.card;
  c.querySelector('.check').addEventListener('click', () => verify(st));
  c.querySelector('.solve').addEventListener('click', () => {
    if (st.solved || ex.cur !== st.i) return;
    st.solve(); st.update(); st.shown = true;
    finish(st);
  });
  st.update();
}

function wrongBy(n, subj) {
  if (n === 0) return '';
  const a = Math.abs(n);
  return `${subj} è <b>${times(a)}</b> volte troppo ${n > 0 ? 'grande' : 'piccolo'} (${a} ${plural(a, 'posto', 'posti')} di differenza).`;
}
function hintUnit(kA, kB, d) {
  const a = Math.abs((kB - kA) * d);
  if (!a) return '';
  return ` <span class="muted">Suggerimento: nella tabella, da ${unitHTML(kA, ex.u)} a ${unitHTML(kB, ex.u)} ${a === 1 ? 'c’è 1 posto' : `ci sono ${a} posti`}.</span>`;
}
function clearFb(st) {
  if (st.solved) return;
  const f = st.card.querySelector('.feedback');
  f.className = 'feedback'; f.innerHTML = '';
}
function verify(st) {
  if (st.solved || ex.cur !== st.i) return;
  st.tries++;
  if (st.check()) { finish(st); return; }
  const f = st.card.querySelector('.feedback');
  f.className = 'feedback bad'; f.innerHTML = '✗ ' + st.why();
  shake(st.card);
  if (mode === 'train') { score.streak = 0; renderScore(); }
}
const showPoints = () => mode === 'duel' || S.scores;
function finish(st) {
  st.solved = true;
  st.pts = st.shown ? 0 : st.tries === 1 ? 10 : st.tries === 2 ? 5 : 0;
  ex.pts += st.pts;
  if (duel) duel.pts[duel.cur] += st.pts;
  else { score.pts += st.pts; if (st.tries === 1 && !st.shown) score.streak++; else score.streak = 0; }
  const f = st.card.querySelector('.feedback');
  st.card.classList.add('solved'); st.card.classList.remove('active');
  if (st.shown) { f.className = 'feedback shown'; f.innerHTML = 'Ecco la soluzione. Rileggila con calma, poi continua.' + (showPoints() ? ' (0 punti)' : ''); }
  else {
    f.className = 'feedback ok';
    f.innerHTML = '✓ Giusto!' + (showPoints() ? ` +${st.pts} punti` + (st.tries > 1 ? ` (al ${st.tries}° tentativo)` : '') : '');
  }
  st.card.querySelector('.step-status').textContent = st.shown ? 'soluzione' : '✓';
  st.card.querySelectorAll('.step-body button, .step-body input').forEach(b => { if (!b.classList.contains('opt')) b.disabled = true; });
  if (st.table) st.table.root.classList.add('locked');
  renderScore(); renderDuelBar();
  if (st.i + 1 < ex.steps.length) { activate(st.i + 1); return; }
  exerciseDone();
}
function summaryHTML() {
  if (ex.kind === 'sf') return sfSummary();
  const { u, v, kA, kDec, kSci } = ex, d = u.dim;
  const parts = [`${decText(v, kA * d)}&nbsp;${unitHTML(kA, u)}`];
  if (kDec !== kA) parts.push(`${decText(v, kDec * d)}&nbsp;${unitHTML(kDec, u)}`);
  parts.push(sciHTML(v, kSci * d, unitHTML(kSci, u)));
  return parts.join(' = ');
}
function exerciseDone() {
  let end;
  if (duel) {
    const secs = (performance.now() - ex.t0) / 1000;
    const me = duel.cur;
    duel.time[me] += secs; duel.turns++;
    const over = duel.turns >= duel.rounds * 2;
    const next = duel.names[1 - me];
    end = el('section', 'card done',
      `<div class="done-msg"><b>${escapeHTML(duel.names[me])}</b>: ${ex.pts} punti in ${fmtTime(secs)}.<br><span class="muted">${summaryHTML()}</span></div>
       <div class="done-btns"><button class="btn primary next">${over ? 'Vedi il risultato' : `Tocca a ${escapeHTML(next)}`}</button></div>`);
    end.querySelector('.next').onclick = () => {
      if (over) showDuelResult();
      else { duel.cur = 1 - me; newExercise(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    };
    renderDuelBar();
  } else {
    score.done++; renderScore();
    end = el('section', 'card done',
      `<div class="done-msg"><b>Esercizio completato!</b> ${summaryHTML()}</div>
       <div class="done-btns"><button class="btn primary next">Prossimo esercizio</button><button class="btn ghost explore">Esplora in Conversioni</button></div>`);
    end.querySelector('.next').onclick = () => { newExercise(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    if (ex.kind === 'sf') end.querySelector('.explore').textContent = 'Esplora in Cifre significative';
    end.querySelector('.explore').onclick = () => {
      if (ex.kind === 'sf') {
        sf.unit = unitAllowed(ex.u) ? ex.u : sf.unit; sf.v = ex.v; sf.k = ex.kA; sf.N = ex.N; sf.mode = ex.mode; $('sfMode').value = sf.mode;
        showView('sigfig'); renderSf(true); return;
      }
      if (unitAllowed(ex.u)) { cv.unit = ex.u; cv.v = ex.v; cv.k = ex.kA; cv.previewK = null; }
      $('exampleCaption').innerHTML = `Dall’esercizio: <b>${decText(ex.v, ex.kA * ex.u.dim)}&nbsp;${unitHTML(ex.kA, ex.u)}</b>`;
      showView('convert'); renderConvert(true);
    };
  }
  $('steps').appendChild(end);
  end.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function showDuelResult() {
  const [a, b] = duel.pts;
  let w = a > b ? 0 : b > a ? 1 : duel.time[0] < duel.time[1] ? 0 : duel.time[1] < duel.time[0] ? 1 : -1;
  const why = a !== b ? '' : w === -1 ? '' : ' (a parità di punti, è stato più veloce)';
  $('givenCard').innerHTML = `<div class="result">
      <div class="result-title">${w === -1 ? 'Pareggio perfetto!' : `Vince <b>${escapeHTML(duel.names[w])}</b>${why}`}</div>
      <div class="result-grid">${[0, 1].map(i => `<div class="result-p${i === w ? ' win' : ''}"><div class="pl-name">${escapeHTML(duel.names[i])}</div><div class="pl-pts"><b>${duel.pts[i]}</b> punti</div><div class="pl-time">${fmtTime(duel.time[i])}</div></div>`).join('')}</div>
      <div class="done-btns"><button class="btn primary again">Rivincita</button><button class="btn ghost setup">Nuova sfida</button></div></div>`;
  $('steps').innerHTML = '';
  $('givenCard').querySelector('.again').onclick = () => { const r = duel.rounds; duel = { ...duel, pts: [0, 0], time: [0, 0], turns: 0, cur: 0, rounds: r }; newExercise(); };
  $('givenCard').querySelector('.setup').onclick = () => setMode('duel');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function activate(i) {
  ex.cur = i;
  const st = ex.steps[i];
  st.card.classList.remove('locked'); st.card.classList.add('active');
  if (st.table) st.table.layout();
  if (i > 0) setTimeout(() => st.card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120);
}
function renderScore() {
  $('scorePts').textContent = score.pts;
  $('scoreStreak').textContent = score.streak;
  $('scoreDone').textContent = score.done;
}

// ------------------------------------------------------------------ impostazioni (dialogo)
function initSettings() {
  const dlg = $('settingsDlg');
  const boxes = { setDecPrefix: 'decPrefix', setSciPrefix: 'sciPrefix', setOdgPrefix: 'odgPrefix', setFundamental: 'fundamental', setScores: 'scores' };
  let snapshot = '';
  const sync = () => {
    for (const [id, key] of Object.entries(boxes)) $(id).checked = !!S[key];
    dlg.querySelectorAll('input[name="odgRule"]').forEach(r => { r.checked = r.value === S.odgRule; });
    $('setRoundMode').value = S.roundMode;
  };
  $('openSettings').addEventListener('click', () => {
    sync(); snapshot = JSON.stringify({ ...S, scores: 0 });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  });
  for (const [id, key] of Object.entries(boxes)) $(id).addEventListener('change', e => { S[key] = e.target.checked; saveSettings(); applySettings(); });
  dlg.querySelectorAll('input[name="odgRule"]').forEach(r => r.addEventListener('change', () => { S.odgRule = r.value; saveSettings(); applySettings(); }));
  $('setRoundMode').innerHTML = sfModeOpts();
  $('setRoundMode').addEventListener('change', e => { S.roundMode = e.target.value; saveSettings(); });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); }); // clic fuori: chiude
  dlg.addEventListener('close', () => {
    // in allenamento un cambio di impostazioni rigenera l'esercizio; nella sfida vale dal turno successivo
    if (ex && mode === 'train' && JSON.stringify({ ...S, scores: 0 }) !== snapshot) newExercise();
  });
}
function applySettings() {
  if (!unitAllowed(cv.unit)) {
    const nu = cv.unit.q === 'massa' ? UNIT.get('kg') : UNIT.get('m');
    cv.unit = nu; cv.previewK = null;
  }
  fillUnitSelect($('unitSelect'));
  renderConvert(true);
  if (!unitAllowed(sf.unit)) sf.unit = sf.unit.q === 'massa' ? UNIT.get('kg') : UNIT.get('m');
  fillUnitSelect($('sfUnit'));
  renderSf(true);
  updateScoreVisibility();
}

// ------------------------------------------------------------------ navigazione e strumenti
function showView(name) {
  document.querySelectorAll('.tab').forEach(t => { const on = t.dataset.view === name; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); });
  $('view-convert').hidden = name !== 'convert';
  $('view-practice').hidden = name !== 'practice';
  $('view-sigfig').hidden = name !== 'sigfig';
  if (name === 'practice' && !ex && mode === 'train') newExercise();
  relayoutAll();
  history.replaceState(null, '', name === 'practice' ? '#esercitati' : name === 'sigfig' ? '#cifre-significative' : '#');
}
function relayoutAll() {
  convTable?.layout();
  sfTable?.layout();
  ex?.steps.forEach(s => s.table?.layout());
  ex?.givenTable?.layout();
}
let fontScale = parseFloat(localStorage.getItem('fontScale') || '1');
function applyFont() {
  document.documentElement.style.setProperty('--fs', fontScale);
  localStorage.setItem('fontScale', fontScale);
  relayoutAll();
}

document.addEventListener('DOMContentLoaded', () => {
  applyFont();
  initConvert();
  initPractice();
  initSigfig();
  initSettings();
  updateScoreVisibility();
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));
  $('fontUp').onclick = () => { fontScale = Math.min(1.8, +(fontScale + 0.1).toFixed(2)); applyFont(); };
  $('fontDown').onclick = () => { fontScale = Math.max(0.6, +(fontScale - 0.1).toFixed(2)); applyFont(); };
  $('fullscreen').onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(relayoutAll, 80); });
  if (location.hash === '#esercitati') showView('practice');
  if (location.hash === '#cifre-significative') showView('sigfig');
});
