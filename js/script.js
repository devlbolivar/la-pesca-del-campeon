(() => {
  'use strict';

  // ---------- Config ----------
  const WHATSAPP_NUMBER = '+56 9 5322 1506';
  const WHATSAPP_MESSAGE = 'Hola, quiero cotizar pescado fresco para mi restaurante.';

  function buildWaLink() {
    const digits = WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
    return `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  }

  // ---------- Content data ----------
  const SERVICES = [
    { photo: 'Foto: maestro fileteando', image: 'filetador.jpg', title: 'Fileteado profesional', body: 'Maestros fileteadores con años en el terminal. Filete, medallón, trozado o entero limpio — al corte que pida tu cocina, listo para la plancha.' },
    { photo: 'Foto: reparto / cajas con hielo', image: 'entrega.jpg', title: 'Entrega al por mayor', body: 'Volúmenes para restaurantes, casinos y hoteles. Pedido confirmado hoy, entregado mañana temprano en cadena de frío.' },
    { photo: 'Foto: pescado fresco en el terminal', image: 'terminal.jpg', title: 'Pescado fresco del día', body: 'Compramos directo en el terminal cada madrugada. Sin intermediarios: del bote a nuestra sala de proceso, y de ahí a tu cocina.' }
  ];

  const STEPS = [
    { num: 'PASO 1', title: 'Pedido', body: 'Escríbenos por WhatsApp o visítanos en el local: especies, corte (filete, entero o medallón) y kilos. Confirmamos disponibilidad y precio del día.' },
    { num: 'PASO 2', title: 'Preparación', body: 'De madrugada seleccionamos la mejor pesca y fileteamos según tu especificación, con control de frescura pieza a pieza.' },
    { num: 'PASO 3', title: 'Entrega', body: 'Retira en el local o coordina despacho, de 9:00 a 15:00, listo para tu cocina.' }
  ];

  const FILTER_LABELS = ['Todos', 'Filete', 'Entero', 'Medallón'];

  // `images` keys are normalized cut labels (see normalizeLabel) and point into images/.
  // Key order matters: it's also display order (see defaultImageIndex / speciesCard),
  // so "entero" is listed first whenever a whole-animal photo exists.
  // Species without photos yet fall back to imagePlaceholder(photo).
  const SPECIES = [
    { photo: 'Foto: reineta', name: 'Reineta', cuts: ['Filete', 'Entera'], images: { entero: 'reineta-entera.jpg', filete: 'reineta-filete.jpg' } },
    { photo: 'Foto: merluza gayi', name: 'Merluza gayi', cuts: ['Filete', 'Medallón'], images: { entero: 'merluza-entera.jpg', filete: 'merluza-filete.jpg' } },
    { photo: 'Foto: merluza austral', name: 'Merluza austral', cuts: ['Filete', 'Medallón'], images: { entero: 'merluza-entera.jpg', filete: 'merluza-filete.jpg' } },
    { photo: 'Foto: congrio', name: 'Congrio', cuts: ['Dorado', 'Colorado'], images: { entero: 'congrio-entero.jpg', medallon: 'congrio-medallones.jpg' } },
    { photo: 'Foto: róbalo', name: 'Róbalo', cuts: ['Filete', 'Entero'], images: { entero: 'robalo-entero.jpg', filete: 'robalo-filete.jpg' } },
    { photo: 'Foto: corvina', name: 'Corvina', cuts: ['Filete', 'Entera'], images: { entero: 'corvinas-entera.jpg' } },
    { photo: 'Foto: cojinova', name: 'Cojinova', cuts: ['Filete', 'Entera'], images: { entero: 'cojinova-entera.jpg' } },
    { photo: 'Foto: salmón', name: 'Salmón', cuts: ['Entero', 'Filete'], images: { entero: 'salmon-entero.jpg', filete: 'salmon-filete.jpg' } },
    { photo: 'Foto: pulpo', name: 'Pulpo', cuts: ['Norteño', 'Sureño'], images: { entero: 'pulpo.jpg' } },
    { photo: 'Foto: ostiones', name: 'Ostiones', cuts: ['Bandeja 10 un. media concha'], images: { entero: 'ostiones.jpg' } },
    { photo: 'Foto: camarones', name: 'Camarones', cuts: ['Nacional', 'Ecuatoriano'], images: { entero: 'camarones.jpg' } },
    { photo: 'Foto: calamar', name: 'Calamar', cuts: ['Anillo', 'Vaina'], images: { entero: 'calamar.jpg' } },
    { photo: 'Foto: locos', name: 'Locos', cuts: ['Frescos', 'En conserva'], images: { entero: 'locos.jpg' } }
  ];

  const STATS = [
    { value: '15+', label: 'Años en el terminal' },
    { value: '80+', label: 'Restaurantes atendidos' },
    { value: '1.200 kg', label: 'Procesados cada día' }
  ];

  // Normalizes a cut/filter label so "Entera"/"Entero" and accents match.
  function normalizeLabel(label) {
    return label.toLowerCase().replace('ó', 'o').replace(/a$/, 'o');
  }

  // Display labels for the dots' aria-label, keyed the same as SPECIES[].images.
  const CUT_LABELS = { filete: 'Filete', entero: 'Entero', medallon: 'Medallón' };

  const FISH_ICON = `<svg viewBox="0 0 64 40" fill="currentColor" aria-hidden="true" style="color:#5cb8f0">
    <path d="M40 4C28 4 18 12 12 20c6 8 16 16 28 16 8 0 15-4 20-9-2-3-2-4 0-7-5-5-12-9-20-9Z"/>
    <path d="M40 4c4 4 6 9 6 16s-2 12-6 16c8-2 15-8 18-16-3-8-10-14-18-16Z" opacity=".6"/>
    <circle cx="30" cy="17" r="2" fill="#04182e"/>
    <path d="M2 20l10-6v12L2 20Z"/>
  </svg>`;

  // ---------- Rendering helpers ----------
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'class') node.className = value;
      else if (key === 'html') node.innerHTML = value;
      else node.setAttribute(key, value);
    }
    for (const child of [].concat(children)) {
      if (child == null) continue;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return node;
  }

  function imagePlaceholder(label) {
    return el('div', { class: 'img-ph' }, [
      el('div', { html: FISH_ICON }),
      el('span', { class: 'img-ph__label' }, label)
    ]);
  }

  function renderServices() {
    const grid = document.getElementById('servicesGrid');
    grid.replaceChildren(...SERVICES.map(s =>
      el('article', { class: 'card' }, [
        el('div', { class: 'card__media' },
          s.image ? el('img', { src: `images/${s.image}`, alt: s.title, loading: 'lazy' }) : imagePlaceholder(s.photo)
        ),
        el('div', { class: 'card__body' }, [
          el('h3', { class: 'card__title' }, s.title),
          el('p', { class: 'card__text' }, s.body)
        ])
      ])
    ));
  }

  function renderSteps() {
    const grid = document.getElementById('stepsGrid');
    grid.replaceChildren(...STEPS.map(st =>
      el('div', { class: 'step' }, [
        el('div', { class: 'step__num' }, st.num),
        el('h3', { class: 'step__title' }, st.title),
        el('p', { class: 'step__text' }, st.body)
      ])
    ));
  }

  function renderStats() {
    const grid = document.getElementById('statsGrid');
    grid.replaceChildren(...STATS.map(k =>
      el('div', { class: 'stat' }, [
        el('span', { class: 'stat__value' }, k.value),
        el('span', { class: 'stat__label' }, k.label)
      ])
    ));
  }

  // Starting photo: the one matching the active filter tab if this species has it,
  // otherwise the first available. Dots let the user browse the rest from there.
  function defaultImageIndex(entries) {
    if (activeFilter !== 'Todos') {
      const key = normalizeLabel(activeFilter);
      const i = entries.findIndex(([k]) => k === key);
      if (i !== -1) return i;
    }
    return 0;
  }

  function speciesCard(sp) {
    const entries = sp.images ? Object.entries(sp.images) : [];

    if (entries.length === 0) {
      return el('article', { class: 'card species-card' }, [
        el('div', { class: 'card__media' }, imagePlaceholder(sp.photo)),
        el('div', { class: 'card__body' }, [
          el('span', { class: 'species-card__name' }, sp.name),
          el('div', { class: 'species-card__cuts' }, sp.cuts.map(c => el('span', { class: 'cut-tag' }, c)))
        ])
      ]);
    }

    let idx = defaultImageIndex(entries);
    const img = el('img', { src: `images/${entries[idx][1]}`, alt: sp.name, loading: 'lazy' });
    const mediaChildren = [img];

    if (entries.length > 1) {
      const dotsWrap = el('div', { class: 'media-dots', role: 'tablist', 'aria-label': `Fotos de ${sp.name}` });
      dotsWrap.replaceChildren(...entries.map(([key], i) => {
        const dot = el('button', {
          class: 'media-dot' + (i === idx ? ' is-active' : ''),
          type: 'button',
          role: 'tab',
          'aria-label': `Ver foto: ${CUT_LABELS[key] || key}`,
          'aria-selected': String(i === idx)
        });
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          idx = i;
          img.src = `images/${entries[idx][1]}`;
          dotsWrap.querySelectorAll('.media-dot').forEach((d, di) => {
            d.classList.toggle('is-active', di === idx);
            d.setAttribute('aria-selected', String(di === idx));
          });
        });
        return dot;
      }));
      mediaChildren.push(dotsWrap);
    }

    return el('article', { class: 'card species-card' }, [
      el('div', { class: 'card__media' + (entries.length > 1 ? ' has-dots' : '') }, mediaChildren),
      el('div', { class: 'card__body' }, [
        el('span', { class: 'species-card__name' }, sp.name),
        el('div', { class: 'species-card__cuts' },
          sp.cuts.map(c => el('span', { class: 'cut-tag' }, c))
        )
      ])
    ]);
  }

  // ---------- Species filter (stateful) ----------
  let activeFilter = 'Todos';

  function renderFilters() {
    const wrap = document.getElementById('filters');
    wrap.replaceChildren(...FILTER_LABELS.map(label => {
      const btn = el('button', {
        class: 'filter-btn' + (label === activeFilter ? ' is-active' : ''),
        type: 'button',
        'aria-pressed': String(label === activeFilter)
      }, label);
      btn.addEventListener('click', () => {
        activeFilter = label;
        renderFilters();
        renderSpecies();
      });
      return btn;
    }));
  }

  function renderSpecies() {
    const grid = document.getElementById('speciesGrid');
    const visible = SPECIES.filter(sp => {
      if (activeFilter === 'Todos') return true;
      const target = normalizeLabel(activeFilter);
      return sp.cuts.some(c => normalizeLabel(c) === target);
    });
    grid.replaceChildren(...visible.map(speciesCard));
  }

  // ---------- Misc ----------
  function wireWhatsappLinks() {
    const link = buildWaLink();
    ['waLinkNav', 'waLinkHero', 'waLinkContact'].forEach(id => {
      const node = document.getElementById(id);
      if (node) node.href = link;
    });
  }

  // Skips the download entirely on mobile (bandwidth) and when the user
  // prefers reduced motion — falls back to the plain gradient overlay.
  function wireHeroVideo() {
    const wrap = document.querySelector('.hero__video-bg');
    if (!wrap) return;
    const skip = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 720px)').matches;
    if (skip) {
      wrap.remove();
      return;
    }
    const video = wrap.querySelector('video');
    const source = video.querySelector('source');
    source.src = source.dataset.src;
    // play() right after load() can be rejected ("paused to save power") while
    // the video is still unbuffered — retry once it actually has data.
    video.addEventListener('canplay', () => video.play().catch(() => {}));
    video.load();
  }

  // ---------- Routing (clean URLs via History API, no #hash) ----------
  // Section id -> friendly path. "top" maps to the root "/" since it's the
  // implicit landing state, not "/top".
  const ROUTES = [
    { id: 'top', path: '/' },
    { id: 'servicios', path: '/servicios' },
    { id: 'especies', path: '/especies' },
    { id: 'contacto', path: '/contacto' }
  ];

  function pathForId(id) {
    return (ROUTES.find(r => r.id === id) || {}).path || `/${id}`;
  }

  function idForPath(pathname) {
    if (pathname === '/' || pathname === '') return 'top';
    const clean = pathname.replace(/\/+$/, '');
    const route = ROUTES.find(r => r.path === clean);
    return route ? route.id : null;
  }

  function scrollToId(id, { smooth = true } = {}) {
    const target = document.getElementById(id);
    if (!target) return;
    if (smooth) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Bypass the global `scroll-behavior: smooth` for jumps that should be instant
    // (initial deep link, back/forward) — scrollIntoView has no reliable cross-browser
    // "instant" option while that CSS rule is active.
    const prevBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    target.scrollIntoView({ block: 'start' });
    document.documentElement.style.scrollBehavior = prevBehavior;
  }

  function wireRouting() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      const id = a.getAttribute('href').slice(1);
      if (!document.getElementById(id)) return;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const path = pathForId(id);
        if (location.pathname !== path) history.pushState({ id }, '', path);
        scrollToId(id);
      });
    });

    window.addEventListener('popstate', () => {
      scrollToId(idForPath(location.pathname) || 'top', { smooth: false });
    });

    // Deep link on load: land on the right section, and normalize unknown
    // paths back to "/" instead of leaving a dead URL in the address bar.
    const initialId = idForPath(location.pathname);
    if (initialId && initialId !== 'top') {
      scrollToId(initialId, { smooth: false });
    } else if (location.pathname !== '/') {
      history.replaceState({ id: 'top' }, '', '/');
    }
  }

  function wireMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  function init() {
    wireWhatsappLinks();
    wireHeroVideo();
    wireMobileNav();
    renderServices();
    renderSteps();
    renderFilters();
    renderSpecies();
    renderStats();
    wireRouting();
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
