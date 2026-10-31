/**
 * PouOne — منطق صفحه (بدون وابستگی خارجی)
 * بخش‌ها: ابزارها، ناوبری، ظهور کارت‌ها، افکت‌های حرکتی، پنل محصول، اطلاعات تماس
 */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const CONFIG = window.POUONE_CONFIG || {};
  const PRODUCTS = window.POUONE_PRODUCTS || {};

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------ *
   * ابزارها
   * ------------------------------------------------------------------ */
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  /** فقط لینک‌های https یا هم‌مبدأ پذیرفته می‌شوند. */
  const safeUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value.trim(), document.baseURI);
      const sameOrigin = url.origin === location.origin && url.origin !== 'null';
      const localFile = location.protocol === 'file:' && url.protocol === 'file:';
      return url.protocol === 'https:' || sameOrigin || localFile ? url.href : null;
    } catch {
      return null;
    }
  };

  const ICONS = {
    android:
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6 18c0 .55.45 1 1 1h1v3.5a1.5 1.5 0 0 0 3 0V19h2v3.5a1.5 1.5 0 0 0 3 0V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8A1.5 1.5 0 0 0 2 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 3.5 8zm17 0A1.5 1.5 0 0 0 19 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 20.5 8zm-4.97-5.84l1.3-1.3a.5.5 0 0 0-.7-.71l-1.48 1.48A5.97 5.97 0 0 0 12 1c-.96 0-1.86.23-2.66.63L7.85.15a.5.5 0 0 0-.7.71l1.31 1.31A5.98 5.98 0 0 0 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/></svg>',
    windows:
      '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M3 5.5l7.5-1v7H3v-6zm8.7-1.2L21 3v8.5h-9.3V4.3zM3 12.5h7.5v7L3 18.5v-6zm8.7 0H21V21l-9.3-1.3v-7.2z"/></svg>'
  };

  /* ------------------------------------------------------------------ *
   * ناوبری: حالت اسکرول و مورد فعال
   * ------------------------------------------------------------------ */
  const nav = $('#nav');
  const onScrollNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  if ('IntersectionObserver' in window) {
    const links = $$('[data-nav]');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const active = a.dataset.nav === entry.target.id;
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

    const clear = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) links.forEach((a) => a.removeAttribute('aria-current'));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    const top = $('.hero'); const products = $('#products');
    if (top) clear.observe(top);
    if (products) clear.observe(products);
  }

  /* ------------------------------------------------------------------ *
   * ظهور کارت‌ها هنگام اسکرول
   * ------------------------------------------------------------------ */
  const reveals = $$('.reveal');
  reveals.forEach((node, i) => node.style.setProperty('--d', `${(i % 4) * 90}ms`));

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    reveals.forEach((node) => io.observe(node));
  } else {
    reveals.forEach((node) => node.classList.add('is-in'));
  }

  /* ------------------------------------------------------------------ *
   * افکت‌های حرکتی: هاور سه‌بعدی کارت‌ها و پارالاکس ملایم
   * ------------------------------------------------------------------ */
  if (finePointer && !reduceMotion) {
    // هاور سه‌بعدی
    $$('.card').forEach((card) => {
      let frame = 0;
      let px = 0; let py = 0;
      const apply = () => {
        frame = 0;
        card.style.setProperty('--ry', `${(px - 0.5) * 9}deg`);
        card.style.setProperty('--rx', `${(0.5 - py) * 9}deg`);
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      };
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width;
        py = (e.clientY - r.top) / r.height;
        if (!frame) frame = requestAnimationFrame(apply);
      });
      card.addEventListener('pointerleave', () => {
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    // پارالاکس بسیار ملایم
    const hero = $('.hero');
    const bg = $('.bg');
    let tx = 0; let ty = 0; let cx = 0; let cy = 0; let raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty('--px', cx.toFixed(2));
      root.style.setProperty('--py', cy.toFixed(2));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener('pointermove', (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    if (hero && bg) root.classList.add('has-parallax');
  }

  /* ------------------------------------------------------------------ *
   * پنل جزئیات محصول
   * ------------------------------------------------------------------ */
  const panel = $('#product-panel');
  const clip = $('.panel__clip', panel);
  const body = $('#panel-body');
  const elLogo = $('#panel-logo');
  const elTitle = $('#panel-title');
  const elTagline = $('#panel-tagline');
  const elDesc = $('#panel-desc');
  const elUses = $('#panel-uses');
  const elActions = $('#panel-actions');
  const closeBtn = $('.panel__close', panel);
  const cards = {};
  $$('.card').forEach((card) => { cards[card.dataset.product] = card; });

  let current = null;
  let swapTimer = 0;

  const setHash = (hash) => {
    try { history.replaceState(null, '', hash); } catch { /* مثلاً در file:// */ }
  };

  const buildDownload = (platform, label, url) => {
    const href = safeUrl(url);
    const content = (badge) => {
      const wrap = document.createDocumentFragment();
      const icon = el('span', 'btn-dl__icon');
      icon.innerHTML = ICONS[platform];
      const text = el('span', 'btn-dl__text');
      text.append(el('span', 'btn-dl__title', label), el('span', 'btn-dl__sub', platform === 'android' ? 'Android' : 'Windows'));
      wrap.append(icon, text);
      if (badge) wrap.append(el('span', 'btn-dl__badge', badge));
      return wrap;
    };
    if (href) {
      const a = el('a', `btn-dl btn-dl--${platform}`);
      a.href = href;
      a.rel = 'noopener';
      a.append(content());
      return a;
    }
    const b = el('button', `btn-dl btn-dl--${platform}`);
    b.type = 'button';
    b.disabled = true;
    b.append(content('به‌زودی'));
    return b;
  };

  const fill = (id) => {
    const data = PRODUCTS[id];
    const card = cards[id];
    if (!data || !card) return false;
    const img = $('img', card);
    const downloads = (CONFIG.downloads && CONFIG.downloads[id]) || {};

    panel.dataset.product = id;
    elLogo.src = img.getAttribute('src');
    elTitle.textContent = data.name;
    elTagline.textContent = $('.card__desc', card).textContent;
    elDesc.textContent = data.description;
    elUses.replaceChildren(...data.uses.map((u) => el('li', null, u)));
    elActions.replaceChildren(
      buildDownload('android', 'دانلود نسخه اندروید', downloads.android),
      buildDownload('windows', 'دانلود نسخه ویندوز', downloads.windows)
    );
    return true;
  };

  /** اگر پایین پنل از دید خارج است، فقط به‌اندازه لازم اسکرول می‌کند. */
  const revealPanel = () => {
    const headerH = nav.offsetHeight + 12;
    const r = panel.getBoundingClientRect();
    const overflow = r.bottom - window.innerHeight + 24;
    if (overflow <= 0 && r.top >= headerH) return;
    const delta = Math.min(overflow, r.top - headerH);
    window.scrollBy({ top: delta, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const setPressed = (id) => {
    Object.entries(cards).forEach(([key, card]) => card.setAttribute('aria-pressed', String(key === id)));
  };

  const open = (id, { scroll = true } = {}) => {
    if (!PRODUCTS[id] || id === current) return;
    window.clearTimeout(swapTimer);
    setPressed(id);

    if (current === null) {
      fill(id);
      panel.dataset.open = 'true';
      clip.inert = false;
      if (scroll) window.setTimeout(revealPanel, reduceMotion ? 0 : 620);
    } else {
      body.classList.add('is-swapping');
      swapTimer = window.setTimeout(() => {
        fill(id);
        body.classList.remove('is-swapping');
        if (scroll) window.setTimeout(revealPanel, 250);
      }, reduceMotion ? 0 : 220);
    }
    current = id;
    setHash(`#${id}`);
  };

  const close = () => {
    if (current === null) return;
    window.clearTimeout(swapTimer);
    body.classList.remove('is-swapping');
    const card = cards[current];
    panel.dataset.open = 'false';
    clip.inert = true;
    setPressed(null);
    current = null;
    setHash('#products');
    if (card) card.focus({ preventScroll: true });
  };

  Object.entries(cards).forEach(([id, card]) => card.addEventListener('click', () => open(id)));
  closeBtn.addEventListener('click', close);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  const fromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1)).toLowerCase();
    if (cards[id]) {
      open(id, { scroll: false });
      document.getElementById('products').scrollIntoView({ behavior: 'auto' });
    }
  };
  window.addEventListener('hashchange', fromHash);
  if (location.hash) fromHash();

  /* ------------------------------------------------------------------ *
   * اطلاعات تماس (از config.js؛ موارد خالی نمایش داده نمی‌شوند)
   * ------------------------------------------------------------------ */
  const contact = CONFIG.contact || {};
  const rows = [];
  const clean = (v) => (typeof v === 'string' ? v.trim().replace(/^@/, '') : '');

  const email = clean(contact.email);
  if (/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
    rows.push(['ایمیل', email, `mailto:${email}`]);
  }
  const telegram = clean(contact.telegram);
  if (/^[A-Za-z0-9_]{5,32}$/.test(telegram)) {
    rows.push(['تلگرام', `@${telegram}`, `https://t.me/${telegram}`]);
  }
  const instagram = clean(contact.instagram);
  if (/^[A-Za-z0-9._]{1,30}$/.test(instagram)) {
    rows.push(['اینستاگرام', `@${instagram}`, `https://instagram.com/${instagram}`]);
  }
  const phone = typeof contact.phone === 'string' ? contact.phone.trim() : '';
  if (/^\+?[0-9\s-]{5,20}$/.test(phone)) {
    rows.push(['تلفن', phone, `tel:${phone.replace(/[\s-]/g, '')}`]);
  }

  const list = $('#contact-list');
  rows.forEach(([label, value, href]) => {
    const row = el('div', 'contact__row');
    const a = el('a', null, value);
    a.href = href;
    a.setAttribute('dir', 'ltr');
    if (href.startsWith('https:')) a.rel = 'noopener';
    row.append(el('dt', null, label), (() => { const dd = el('dd'); dd.append(a); return dd; })());
    list.append(row);
  });
  if (!rows.length) $('#contact-empty').hidden = false;

  /* ------------------------------------------------------------------ */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
