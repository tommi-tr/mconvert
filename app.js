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
  { id: 'm',  sym: 'm',  dim: 1, q: 'lunghezza',             g: 'Lunghezza, superficie, volume' },
  { id: 'm2', sym: 'm',  dim: 2, q: 'superficie',            g: 'Lunghezza, superficie, volume' },
  { id: 'm3', sym: 'm',  dim: 3, q: 'volume',                g: 'Lunghezza, superficie, volume' },
  { id: 'g',  sym: 'g',  dim: 1, q: 'massa',                 g: 'Altre grandezze fondamentali', siK: 3 },
  { id: 's',  sym: 's',  dim: 1, q: 'tempo',                 g: 'Altre grandezze fondamentali' },
  { id: 'A',  sym: 'A',  dim: 1, q: 'corrente elettrica',    g: 'Altre grandezze fondamentali' },
  { id: 'K',  sym: 'K',  dim: 1, q: 'temperatura',           g: 'Altre grandezze fondamentali' },
  { id: 'mol',sym: 'mol',dim: 1, q: 'quantità di sostanza',  g: 'Altre grandezze fondamentali' },
  { id: 'cd', sym: 'cd', dim: 1, q: 'intensità luminosa',    g: 'Altre grandezze fondamentali' },
  { id: 'Hz', sym: 'Hz', dim: 1, q: 'frequenza',             g: 'Grandezze derivate' },
  { id: 'N',  sym: 'N',  dim: 1, q: 'forza',                 g: 'Grandezze derivate' },
  { id: 'Pa', sym: 'Pa', dim: 1, q: 'pressione',             g: 'Grandezze derivate' },
  { id: 'J',  sym: 'J',  dim: 1, q: 'energia',               g: 'Grandezze derivate' },
  { id: 'W',  sym: 'W',  dim: 1, q: 'potenza',               g: 'Grandezze derivate' },
  { id: 'C',  sym: 'C',  dim: 1, q: 'carica elettrica',      g: 'Grandezze derivate' },
  { id: 'V',  sym: 'V',  dim: 1, q: 'tensione elettrica',    g: 'Grandezze derivate' },
  { id: 'Ohm',sym: 'Ω',  dim: 1, q: 'resistenza elettrica',  g: 'Grandezze derivate' },
  { id: 'F',  sym: 'F',  dim: 1, q: 'capacità elettrica',    g: 'Grandezze derivate' },
  { id: 'T',  sym: 'T',  dim: 1, q: 'campo magnetico',       g: 'Grandezze derivate' },
  { id: 'Wb', sym: 'Wb', dim: 1, q: 'flusso magnetico',      g: 'Grandezze derivate' },
  { id: 'H',  sym: 'H',  dim: 1, q: 'induttanza',            g: 'Grandezze derivate' },
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
  ['Massa di un’automobile', '1200', 3, 'g'],
  ['Massa di una moneta da 1 euro', '7,5', 0, 'g'],
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
let odgRule = localStorage.getItem('odgRule') || '5';
function odgOf(v, s) {
  const w = shiftV(v, -s);
  if (isZero(w)) return null;
  const thr = odgRule === '5' ? 5 : Math.sqrt(10);
  return mantFloat(w) >= thr ? sciExp(w) + 1 : sciExp(w);
}

// ------------------------------------------------------------------ unità
const dimSup = d => d === 2 ? '²' : d === 3 ? '³' : '';
const unitHTML = (k, u) => `<span class="u">${PFX.get(k)?.s ?? ''}${u.sym}${u.dim > 1 ? sup(u.dim) : ''}</span>`;
const unitText = (k, u) => `${PFX.get(k)?.s ?? ''}${u.sym}${dimSup(u.dim)}`;
const siK = u => u.siK || 0;
// h, da, d, c si usano quasi solo con lunghezze e masse (eccezione comune: hPa)
const usualKs = (u, ks) => ['m', 'm2', 'm3', 'g'].includes(u.id) ? ks : ks.filter(k => k % 3 === 0 || (u.id === 'Pa' && k === 2));
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

function initConvert() {
  // select unità
  const us = $('unitSelect');
  const groups = {};
  UNITS.forEach(u => {
    if (!groups[u.g]) { groups[u.g] = el('optgroup'); groups[u.g].label = u.g; us.appendChild(groups[u.g]); }
    const o = el('option'); o.value = u.id;
    o.textContent = `${u.sym}${dimSup(u.dim)} — ${u.q}`;
    groups[u.g].appendChild(o);
  });
  us.addEventListener('change', () => {
    const nu = UNIT.get(us.value);
    // mantiene il numero scritto e il prefisso, cambia l'unità
    const numeral = shiftV(cv.v, -cv.k * cv.unit.dim);
    cv.unit = nu; cv.v = shiftV(numeral, cv.k * nu.dim);
    $('exampleCaption').textContent = '';
    renderConvert(true);
  });

  convTable = new PrefixTable($('convTable'), {
    pickable: true, draggable: true,
    onPreview: k => { cv.previewK = k; renderConvert(); },
    onPick: k => { cv.k = k; cv.previewK = null; renderConvert(); flash('decDisplay'); },
    onShift: n => { cv.v = shiftV(cv.v, n); renderConvert(); },
  });

  $('decMul').addEventListener('click', () => { cv.v = shiftV(cv.v, 1); renderConvert(); });
  $('decDiv').addEventListener('click', () => { cv.v = shiftV(cv.v, -1); renderConvert(); });
  $('expUp').addEventListener('click', () => { cv.v = shiftV(cv.v, 1); renderConvert(); });
  $('expDown').addEventListener('click', () => { cv.v = shiftV(cv.v, -1); renderConvert(); });
  $('decPrefix').addEventListener('change', e => { cv.k = +e.target.value; renderConvert(); });
  $('odgRule').value = odgRule;
  $('odgRule').addEventListener('change', e => { odgRule = e.target.value; localStorage.setItem('odgRule', odgRule); renderConvert(); });
  $('bestPrefix').addEventListener('click', () => { const b = bestPrefix(cv.v, cv.unit); cv.k = b; renderConvert(); flash('decDisplay'); });

  // modifica: decimale
  editable($('decDisplay'), $('decInput'),
    () => decString(cv.v, cv.k * cv.unit.dim),
    str => { const p = parseNum(str); if (!p) return false; cv.v = shiftV(p, cv.k * cv.unit.dim); renderConvert(false, 'dec'); return true; });
  // modifica: coefficiente
  editable($('sciMant'), $('sciMantInput'),
    () => mantString(shiftV(cv.v, -cv.k * cv.unit.dim)),
    str => {
      const p = parseNum(str); if (!p) return false;
      const n = sciExp(shiftV(cv.v, -cv.k * cv.unit.dim));
      cv.v = shiftV(p, n + cv.k * cv.unit.dim); renderConvert(false, 'mant'); return true;
    });
  // modifica: esponente
  editable($('sciExp'), $('sciExpInput'),
    () => String(sciExp(shiftV(cv.v, -cv.k * cv.unit.dim))),
    str => {
      const s = str.trim().replace(/[−–]/g, '-');
      if (!/^[+-]?\d{1,3}$/.test(s)) return false;
      const n = parseInt(s, 10);
      const w = shiftV(cv.v, -cv.k * cv.unit.dim);
      cv.v = shiftV(cv.v, n - sciExp(w)); renderConvert(false, 'exp'); return true;
    });

  $('newExample').addEventListener('click', newExample);
  newExample();
}

/** Rende un display cliccabile modificabile tramite un input (con aggiornamento in tempo reale). */
function editable(display, input, getText, apply) {
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
    renderConvert();
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
  if (isZero(v)) return 0;
  // prefisso "ingegneristico": valore tra 1 e 1000 (per m², m³ si preferiscono comunque k, M… e le cifre tra 1 e 10^(3·dim))
  const named = [...PFX.keys()].filter(k => k % 3 === 0).sort((a, b) => b - a);
  for (const k of named) if (v.e + v.d.length - 1 >= k * u.dim) return k;
  return K_MIN;
}

function stepsText(from, to, d) {
  const steps = (to - from) * d;
  if (steps === 0) return '';
  const n = Math.abs(steps);
  const dir = steps > 0 ? 'sinistra' : 'destra';
  const res = steps > 0 ? `${times(n)} volte più piccolo` : `${times(n)} volte più grande`;
  return `La virgola si sposta di <b>${n}</b> ${plural(n, 'posto', 'posti')} verso ${dir}: il numero diventa ${res} perché l’unità è ${steps > 0 ? 'più grande' : 'più piccola'}.`;
}

function renderConvert(unitChanged = false, editing = null) {
  const u = cv.unit, d = u.dim, s = cv.k * d, v = cv.v;
  $('unitSelect').value = u.id;
  // select prefisso
  const ps = $('decPrefix');
  if (unitChanged || ps.dataset.unit !== u.id) {
    ps.innerHTML = PREFIXES.map(p => `<option value="${p.k}">${unitText(p.k, u)}</option>`).join('');
    ps.dataset.unit = u.id;
  }
  ps.value = cv.k;
  // 1. decimale
  if (editing !== 'dec') $('decDisplay').innerHTML = decHTML(v, s);
  const len = decLength(v, s);
  $('decDisplay').classList.toggle('long', len > 16);
  $('decDisplay').classList.toggle('very-long', len > 28);
  // 2. tabella
  convTable.setUnit(u);
  const shownK = cv.previewK ?? cv.k;
  convTable.update({ v, k: shownK, activeK: shownK, currentK: cv.k });
  const ro = $('readout');
  const left = `<span class="ro-num">${decHTML(v, s)}</span>&nbsp;${unitHTML(cv.k, u)}`;
  if (cv.previewK != null && cv.previewK !== cv.k) {
    const pk = cv.previewK;
    ro.innerHTML = `<div class="ro-main">${left} <span class="ro-eq">=</span> <span class="ro-num hl">${decHTML(v, pk * d)}</span>&nbsp;${unitHTML(pk, u)}</div>
      <div class="ro-why">${stepsText(cv.k, pk, d)} <span class="muted">(tocca il prefisso per sceglierlo)</span></div>`;
  } else {
    ro.innerHTML = `<div class="ro-main">${left}</div>
      <div class="ro-why muted">La virgola sta subito dopo la colonna di <b>${unitHTML(cv.k, u)}</b>. Le cifre restano ferme: cambiando prefisso si sposta solo la virgola.</div>`;
  }
  const b = bestPrefix(v, u);
  const bb = $('bestPrefix');
  bb.innerHTML = `Prefisso più comodo: <b>${decText(v, b * d)}&nbsp;${unitHTML(b, u)}</b>`;
  bb.disabled = b === cv.k;
  $('dimNote').innerHTML = d === 1 ? '' :
    `Unità ${d === 2 ? 'al quadrato' : 'al cubo'}: ogni prefisso ha <b>${d}</b> colonne, perché 1&nbsp;${unitHTML(3, u)} = (10${sup(3)}&nbsp;m)${sup(d)} = 10${sup(3 * d)}&nbsp;${unitHTML(0, u)}.` +
    (d === 3 ? ` Ricorda: 1&nbsp;dm${sup(3)} = 1&nbsp;L e 1&nbsp;cm${sup(3)} = 1&nbsp;mL.` : '');
  // 3. scientifica
  const w = shiftV(v, -s);
  if (editing !== 'mant') $('sciMant').innerHTML = `<span class="sig">${mantString(w)}</span>`;
  if (editing !== 'exp') $('sciExp').textContent = (sciExp(w) < 0 ? '−' + (-sciExp(w)) : sciExp(w));
  $('sciUnit').innerHTML = unitHTML(cv.k, u);
  const o = odgOf(v, s);
  $('odgVal').innerHTML = o == null ? '—' : `<span class="pow">${powHTML(o)}</span> ${unitHTML(cv.k, u)}`;
  const mf = isZero(w) ? 0 : mantFloat(w);
  const thr = odgRule === '5' ? '5' : '√10';
  $('sciHint').innerHTML = isZero(w) ? '' :
    `Il coefficiente è sempre tra 1 e 10. Qui ${mantString(w)} ${o === sciExp(w) ? '&lt;' : '≥'} ${thr}, quindi l’ordine di grandezza è 10${sup(o)}.` +
    ` <span class="muted">Usa ▲▼ per far crescere o calare la potenza: guarda come si spostano gli zeri.</span>`;
  void mf;
  const sk = siK(u);
  $('siLine').innerHTML = (cv.k === sk) ? '' :
    `Nell’unità SI: ${sciHTML(v, sk * d, unitHTML(sk, u))} &nbsp;=&nbsp; <span class="num">${decHTML(v, sk * d)}</span>&nbsp;${unitHTML(sk, u)}`;
}

function flash(id) { const e = $(id); e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); }
function shake(e) { e.classList.remove('shake'); void e.offsetWidth; e.classList.add('shake'); }

// esempi: un sacchetto mescolato, mai lo stesso due volte di fila
let exBag = [], lastEx = null;
function newExample() {
  let ex;
  if (Math.random() < 0.22) ex = randomExample();
  else {
    if (!exBag.length) { exBag = EXAMPLES.slice().sort(() => Math.random() - 0.5); if (exBag[exBag.length - 1] === lastEx) exBag.unshift(exBag.pop()); }
    ex = exBag.pop(); lastEx = ex;
  }
  const [label, num, k, uid] = ex;
  const u = UNIT.get(uid);
  cv.unit = u; cv.k = k; cv.v = shiftV(parseNum(num), k * u.dim); cv.previewK = null;
  $('exampleCaption').innerHTML = `<b>${label}</b>: ${decText(cv.v, k * u.dim)}&nbsp;${unitHTML(k, u)} <span class="muted">— prova a toccare gli altri prefissi</span>`;
  renderConvert(true);
  flash('decDisplay');
}
function randomExample() {
  const u = pick(UNITS);
  const ks = usualKs(u, PREFIXES.map(p => p.k).filter(k => u.dim === 1 || Math.abs(k) <= 6));
  const k = pick(ks);
  const L = 1 + rnd(3);
  let d = String(1 + rnd(9));
  for (let i = 1; i < L; i++) d += (i === L - 1 ? 1 + rnd(9) : rnd(10));
  const n = rnd(7) - 3; // esponente nell'unità scelta
  const v = norm(d, n - (L - 1));
  return ['Numero a caso', decString(v, 0), k, u.id];
}

// ------------------------------------------------------------------ vista ESERCITATI
const LEVELS = {
  base:     { ks: [3, 2, 1, 0, -1, -2, -3], units: ['m', 'g', 's', 'A', 'V', 'W', 'J', 'N', 'Pa', 'Hz'], dims: false, maxLen: 9 },
  medio:    { ks: PREFIXES.map(p => p.k), units: UNITS.filter(u => u.dim === 1).map(u => u.id), dims: false, maxLen: 14 },
  avanzato: { ks: PREFIXES.map(p => p.k), units: UNITS.map(u => u.id), dims: true, maxLen: 16 },
};
const score = { pts: 0, streak: 0, done: 0 };
let ex = null;

function initPractice() {
  const ls = $('levelSelect');
  ls.value = localStorage.getItem('level') || 'base';
  ls.addEventListener('change', () => { localStorage.setItem('level', ls.value); newExercise(); });
  $('newExercise').addEventListener('click', newExercise);
}

function genExercise(level) {
  const L = LEVELS[level];
  for (let tries = 0; tries < 500; tries++) {
    let uid = pick(L.units);
    if (L.dims && Math.random() < 0.45) uid = pick(['m2', 'm3']);
    const u = UNIT.get(uid), d = u.dim;
    const ks = usualKs(u, L.ks.filter(k => d === 1 || Math.abs(k) <= 6 || Math.random() < 0.3));
    if (ks.length < 2) continue;
    const kA = pick(ks);
    let kB = pick(ks.filter(k => k !== kA));
    if (kB === undefined) continue;
    const len = 1 + rnd(3);
    let digs = String(1 + rnd(9));
    for (let i = 1; i < len; i++) digs += (i === len - 1 ? 1 + rnd(9) : rnd(10));
    const nA = rnd(7) - 3;
    const v = norm(digs, nA - (len - 1) + kA * d);
    const lA = decLength(v, kA * d), lB = decLength(v, kB * d);
    if (lA > L.maxLen || lB > L.maxLen) continue;
    const hi = v.e + v.d.length - 1;
    if (hi > K_MAX * d + d - 1 || v.e < K_MIN * d) continue;
    if (level === 'base' && Math.abs(kA - kB) > 4) continue;
    const given = pick(['dec', 'dec', 'sci', 'tab']);
    return { u, v, kA, kB, given, level };
  }
  return { u: UNIT.get('m'), v: { d: '35', e: 0 }, kA: 0, kB: -2, given: 'dec', level };
}

function newExercise() {
  const level = $('levelSelect').value;
  ex = genExercise(level);
  const steps = [];
  if (ex.given !== 'tab') steps.push({ type: 'tab' });
  steps.push({ type: 'dec' }, { type: 'sci' }, { type: 'odg' });
  ex.steps = steps; ex.cur = 0;
  renderGiven();
  const host = $('steps'); host.innerHTML = '';
  steps.forEach((st, i) => { st.i = i; st.tries = 0; st.solved = false; st.card = el('section', 'card step locked'); host.appendChild(st.card); mountStep(st); });
  activate(0);
}

function renderGiven() {
  const { u, v, kA, given } = ex, d = u.dim;
  const g = $('givenCard');
  const uh = unitHTML(kA, u);
  const name = { dec: 'notazione decimale', sci: 'notazione scientifica', tab: 'tabella dei prefissi' }[given];
  let body = '';
  if (given === 'dec') body = `<div class="given-val"><span class="num">${decHTML(v, kA * d)}</span>&nbsp;${uh}</div>`;
  if (given === 'sci') body = `<div class="given-val">${sciHTML(v, kA * d, uh)}</div>`;
  if (given === 'tab') body = `<div class="given-tab"></div><p class="hint">La virgola è dopo la colonna di <b>${uh}</b>.</p>`;
  g.innerHTML = `<div class="given-head"><span class="badge">Consegna</span> Una misura di <b>${u.q}</b> è scritta in <b>${name}</b>. Riscrivila nelle altre notazioni, un passo alla volta.</div>${body}`;
  if (given === 'tab') {
    const t = new PrefixTable(g.querySelector('.given-tab'), { pickable: false, draggable: false });
    t.setUnit(u);
    t.update({ v, k: kA, activeK: kA });
  }
}

function stepHead(st, title) {
  return `<div class="step-head"><span class="step-n">${st.i + 1}</span><h3>${title}</h3><span class="step-status"></span></div>`;
}
function stepFoot() {
  return `<div class="step-foot"><button class="btn primary check">Verifica</button><button class="btn ghost solve">Mostra soluzione</button><div class="feedback" aria-live="polite"></div></div>`;
}

function mountStep(st) {
  const { u, v, kA, kB } = ex, d = u.dim;
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
    // si parte dal numero scritto come nell'unità della consegna, ma accanto al nuovo prefisso
    st.off = (kB - kA) * d;
    c.innerHTML = stepHead(st, `Scrivi in notazione decimale in ${unitHTML(kB, u)}`) +
      `<div class="step-body"><p class="instr">Il numero è stato copiato così com'era, ma ora l’unità è <b>${unitHTML(kB, u)}</b>. Sposta la virgola: gli zeri compaiono da soli.</p>
       <div class="move-row big"><button class="btn round mv-l" aria-label="Virgola a sinistra">◀ ,</button>
         <div class="ex-dec"><span class="num"></span>&nbsp;${unitHTML(kB, u)}</div>
         <button class="btn round mv-r" aria-label="Virgola a destra">, ▶</button></div>
       <label class="type-row">oppure scrivilo: <input class="type-in" inputmode="decimal" autocomplete="off" spellcheck="false"></label></div>` + stepFoot();
    const inp = c.querySelector('.type-in');
    c.querySelector('.mv-l').onclick = () => { st.custom = null; st.off -= 1; st.update(); };
    c.querySelector('.mv-r').onclick = () => { st.custom = null; st.off += 1; st.update(); };
    inp.addEventListener('input', () => { const p = parseNum(inp.value); st.custom = p ? shiftV(p, kB * d) : null; inp.classList.toggle('invalid', !p && inp.value.trim() !== ''); st.update(true); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') c.querySelector('.check').click(); });
    st.value = () => st.custom ?? shiftV(v, st.off);
    st.update = (fromInput) => {
      const sv = st.value();
      c.querySelector('.ex-dec .num').innerHTML = decHTML(sv, kB * d);
      if (!fromInput) inp.value = '';
      clearFb(st);
    };
    st.check = () => eqV(st.value(), v);
    st.why = () => {
      const sv = st.value();
      if (sv.d !== v.d) return 'Le cifre significative non corrispondono: devono restare <b>' + v.d.split('').join(' ') + '</b>.';
      return wrongBy(sv.e - v.e, 'Il numero') + hintUnit(kA, kB, d);
    };
    st.solve = () => { st.custom = null; st.off = 0; inp.value = ''; };
  }
  if (st.type === 'sci') {
    const L = v.d.length;
    st.p = L; st.exp = 0; // coefficiente intero, esponente 0
    c.innerHTML = stepHead(st, `Scrivi in notazione scientifica in ${unitHTML(kB, u)}`) +
      `<div class="step-body"><p class="instr">Il coefficiente deve stare <b>tra 1 e 10</b>. Sposta la virgola del coefficiente e regola l’esponente: guarda il valore sotto, deve restare quello giusto.</p>
       <div class="sci-ex">
         <button class="btn round mv-l" aria-label="Virgola a sinistra">◀ ,</button>
         <span class="sig mant"></span>
         <button class="btn round mv-r" aria-label="Virgola a destra">, ▶</button>
         <span class="times">×</span><span class="ten">10</span>
         <div class="exp-ctl"><div class="exp-val"></div><div class="exp-btns"><button class="exp-btn up" aria-label="Aumenta esponente">▲</button><button class="exp-btn down" aria-label="Diminuisci esponente">▼</button></div></div>
         <span class="unit">${unitHTML(kB, u)}</span>
       </div>
       <p class="live">Vale: <span class="num live-val"></span>&nbsp;${unitHTML(kB, u)}</p></div>` + stepFoot();
    c.querySelector('.mv-l').onclick = () => { if (st.p > -3) st.p -= 1; st.update(); };
    c.querySelector('.mv-r').onclick = () => { if (st.p < L + 3) st.p += 1; st.update(); };
    c.querySelector('.up').onclick = () => { st.exp += 1; st.update(); };
    c.querySelector('.down').onclick = () => { st.exp -= 1; st.update(); };
    st.mant = () => norm(v.d, st.p - L);
    st.value = () => shiftV(st.mant(), st.exp + kB * d);
    st.update = () => {
      c.querySelector('.mant').innerHTML = decHTML(st.mant(), 0);
      c.querySelector('.exp-val').textContent = st.exp < 0 ? '−' + (-st.exp) : st.exp;
      c.querySelector('.live-val').innerHTML = decHTML(st.value(), kB * d);
      clearFb(st);
    };
    st.check = () => st.p === 1 && eqV(st.value(), v);
    st.why = () => {
      const okVal = eqV(st.value(), v);
      if (okVal) return 'Il valore è giusto, ma il coefficiente deve essere <b>almeno 1 e minore di 10</b>: una sola cifra prima della virgola.';
      const m = st.mant(); const mf = parseFloat(decString(m, 0).replace(',', '.'));
      const coefOk = mf >= 1 && mf < 10;
      return (coefOk ? 'Il coefficiente va bene. ' : '') + wrongBy(st.value().e - v.e, 'Il valore') + ' Correggi l’esponente.';
    };
    st.solve = () => { st.p = 1; st.exp = sciExp(shiftV(v, -kB * d)); };
  }
  if (st.type === 'odg') {
    const n = sciExp(shiftV(v, -kB * d));
    st.correct = odgOf(v, kB * d);
    const opts = [n - 1, n, n + 1, n + 2];
    c.innerHTML = stepHead(st, `Qual è l’ordine di grandezza in ${unitHTML(kB, u)}?`) +
      `<div class="step-body"><p class="instr">Regola usata: ${odgRule === '5' ? 'se il coefficiente è minore di 5 l’ordine di grandezza è 10<sup>n</sup>, altrimenti 10<sup>n+1</sup>' : 'se il coefficiente è minore di √10 ≈ 3,16 l’ordine di grandezza è 10<sup>n</sup>, altrimenti 10<sup>n+1</sup>'} (la puoi cambiare nella pagina Conversioni).</p>
       <div class="odg-opts">${opts.map(o => `<button class="btn opt" data-o="${o}"><span>${powHTML(o)}&nbsp;${unitHTML(kB, u)}</span></button>`).join('')}</div></div>` + stepFoot();
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
    st.why = () => `Il numero è ${sciHTML(v, kB * d, unitHTML(kB, u))}: guarda il coefficiente e confrontalo con ${odgRule === '5' ? '5' : '√10'}.`;
    st.solve = () => { st.choice = st.correct; c.querySelectorAll('.opt').forEach(x => x.classList.toggle('chosen', +x.dataset.o === st.correct)); };
  }
  c.querySelector('.check').addEventListener('click', () => verify(st));
  c.querySelector('.solve').addEventListener('click', () => {
    if (st.solved) return;
    st.solve(); st.update(); st.shown = true;
    finish(st, false);
  });
  st.update();
}

function wrongBy(n, subj) {
  if (n === 0) return '';
  const a = Math.abs(n);
  return `${subj} è <b>${times(a)}</b> volte troppo ${n > 0 ? 'grande' : 'piccolo'} (${a} ${plural(a, 'posto', 'posti')} di differenza).`;
}
function hintUnit(kA, kB, d) {
  const st = (kB - kA) * d;
  if (!st) return '';
  const a = Math.abs(st);
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
  const f = st.card.querySelector('.feedback');
  if (st.check()) { finish(st, st.tries === 1); return; }
  f.className = 'feedback bad'; f.innerHTML = '✗ ' + st.why();
  shake(st.card);
  score.streak = 0; renderScore();
}
function finish(st, firstTry) {
  st.solved = true;
  const f = st.card.querySelector('.feedback');
  st.card.classList.add('solved'); st.card.classList.remove('active');
  if (st.shown) { f.className = 'feedback shown'; f.innerHTML = 'Ecco la soluzione. Rileggila con calma, poi continua.'; score.streak = 0; }
  else {
    const pts = firstTry ? 10 : 5;
    score.pts += pts; if (firstTry) score.streak++;
    f.className = 'feedback ok'; f.innerHTML = `✓ Giusto! +${pts} punti` + (firstTry ? '' : ' (al secondo tentativo vale la metà)');
  }
  st.card.querySelector('.step-status').textContent = st.shown ? 'soluzione' : '✓';
  st.card.querySelectorAll('.step-body button, .step-body input').forEach(b => { if (!b.classList.contains('opt')) b.disabled = true; });
  if (st.table) st.table.root.classList.add('locked');
  renderScore();
  if (st.i + 1 < ex.steps.length) activate(st.i + 1);
  else {
    score.done++; renderScore();
    const end = el('section', 'card done',
      `<div class="done-msg"><b>Esercizio completato!</b> ${decText(ex.v, ex.kA * ex.u.dim)}&nbsp;${unitHTML(ex.kA, ex.u)} = ${decText(ex.v, ex.kB * ex.u.dim)}&nbsp;${unitHTML(ex.kB, ex.u)} = ${sciHTML(ex.v, ex.kB * ex.u.dim, unitHTML(ex.kB, ex.u))}</div>
       <div class="done-btns"><button class="btn primary next">Prossimo esercizio</button><button class="btn ghost explore">Esplora in Conversioni</button></div>`);
    $('steps').appendChild(end);
    end.querySelector('.next').onclick = () => { newExercise(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    end.querySelector('.explore').onclick = () => {
      cv.unit = ex.u; cv.v = ex.v; cv.k = ex.kA; cv.previewK = null;
      $('exampleCaption').innerHTML = `Dall’esercizio: <b>${decText(ex.v, ex.kA * ex.u.dim)}&nbsp;${unitHTML(ex.kA, ex.u)}</b>`;
      showView('convert'); renderConvert(true);
    };
    end.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
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

// ------------------------------------------------------------------ navigazione e strumenti
function showView(name) {
  document.querySelectorAll('.tab').forEach(t => { const on = t.dataset.view === name; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); });
  $('view-convert').hidden = name !== 'convert';
  $('view-practice').hidden = name !== 'practice';
  if (name === 'practice' && !ex) newExercise();
  if (name === 'convert') convTable.layout();
  else ex?.steps.forEach(s => s.table?.layout());
  history.replaceState(null, '', name === 'practice' ? '#esercitati' : '#');
}
let fontScale = parseFloat(localStorage.getItem('fontScale') || '1');
function applyFont() {
  document.documentElement.style.fontSize = (fontScale * 100) + '%';
  localStorage.setItem('fontScale', fontScale);
  convTable?.layout();
  ex?.steps.forEach(s => s.table?.layout());
}

document.addEventListener('DOMContentLoaded', () => {
  applyFont();
  initConvert();
  initPractice();
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));
  $('fontUp').onclick = () => { fontScale = Math.min(1.8, +(fontScale + 0.1).toFixed(2)); applyFont(); };
  $('fontDown').onclick = () => { fontScale = Math.max(0.7, +(fontScale - 0.1).toFixed(2)); applyFont(); };
  $('fullscreen').onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  if (location.hash === '#esercitati') showView('practice');
});
