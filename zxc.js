
(function () {
  'use strict';


  var LINKS = {
    exclusivo: ['https://', 'openinap', 'p.link/6amke'],
    instagram: 'https://www.instagram.com/bel.psico_/',
   
  };

   //   k    = icono (p2 Instagram, p3 TikTok, p4 X, p5 Telegram, p6 corazón,
  //                 p7 alcancía, p8 enlace, p9 YouTube, p10 Facebook, p11 Threads)
  //   l    = texto del botón
  //   slug = clave de LINKS (lo que se ve en /go/...)
  //   img  = (opcional) foto de tarjeta grande: pega aquí la URL de tu imagen de Blogger
  //   gate = true muestra primero el aviso +18
  var BOTONES = [
    { k: 'p1',  l: 'Agenda tu consulta 🩵🤫', slug: 'exclusivo', img: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilXrHSXIxzECSrgOx0mBEjRz81TynZd7CkE6c7SmMNY8-0vqsyOEC-YDMmJJjcNo-8yur-XcyGWtkb2RkVcQ8Hegq8d3Fc4WP2hFC1EDmpWU_fNCAVQdtZVBG_6UcDBwu5HjFn29jH4Odhu5HdaA1xwEj7nxEpoCySKIFZnrhFZZkd7X70mpDwHFw5waev/s1195/WhatsApp%20Image%202026-11-08%20at%206.55.35%20PM.jpeg', gate: true },
    { k: 'p2',  l: 'Instagram',              slug: 'instagram' },
  
  ];

  // ===============================================================

  var PREFIX = '/go/';
  var ICONOS = {
    p1:  '<path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" fill="#fff" stroke="none"/>',
    p2:  '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2h.1" stroke-linecap="round" stroke-width="2.4"/>',
    p3:  '<path d="M14 4v10.2a3.2 3.2 0 1 1-3.2-3.2M14 4c.4 2.4 1.9 3.8 4.2 4"/>',
    p4:  '<path d="M5 5l14 14M19 5L5 19"/>',
    p5:  '<path d="M20.5 4.5L3.5 11l5 2 2 5.5 3-3.5 4 3z"/>',
    p6:  '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    p7:  '<ellipse cx="12" cy="14" rx="7" ry="5"/><path d="M12 9l1-4 4 1"/><path d="M9.5 13.5h.1M14.5 13.5h.1" stroke-linecap="round" stroke-width="2.4"/>',
    p8:  '<path d="M9 15l6-6M10.5 6.5l1-1a4 4 0 0 1 6 6l-1 1M13.5 17.5l-1 1a4 4 0 0 1-6-6l1-1"/>',
    p9:  '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
    p10: '<path d="M15 4h-1.5A3.5 3.5 0 0 0 10 7.5V21M7 11h7" stroke-width="2.6"/>',
    p11: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/>'
  };

  // ---------- Detección de navegador ----------
  var ua = navigator.userAgent || '';
  var ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var and = /Android/i.test(ua);
  var ig  = /Instagram/i.test(ua);
  var th  = /Barcelona/i.test(ua);   // app de Threads
  var app = ig || th || /FBAN|FBAV|FB_IAB|FBIOS|Messenger|TikTok|musical_ly|Bytedance|Snapchat|Reddit|Twitter|LinkedInApp|Pinterest|Telegram|Line\/|WhatsApp|Discord|Slack/i.test(ua);

  // ---------- Utilidades ----------
  function dest(slug) {
    if (!Object.prototype.hasOwnProperty.call(LINKS, slug)) return null;
    var v = LINKS[slug];
    if (Object.prototype.toString.call(v) === '[object Array]') v = v.join('');
    return /^https?:\/\//i.test(v) ? v : null;
  }
  function slugDe(pathname) {
    if (pathname.indexOf(PREFIX) !== 0) return null;
    var s = pathname.slice(PREFIX.length).replace(/\/+$/, '');
    try { s = decodeURIComponent(s); } catch (e) {}
    return s;
  }
  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  // <tam>
  // Pide a Blogger la imagen ya al ancho necesario (en px CSS). Cambia el parámetro
  // de tamaño de la URL de Blogger; la foto se recorta sola (object-fit) al marco.
  function tam(url, w) {
    if (!/^https?:\/\/[^\/]*(googleusercontent\.com|blogspot\.com|blogger\.com)\//i.test(url || '')) return url;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.round(w * dpr);
    // Formato con "=":  .../AVvX...=s1600   o   =w1200-h800-c
    if (/=[swh]\d[^\/=]*$/i.test(url)) return url.replace(/=[swh]\d[^\/=]*$/i, '=w' + w);
    // Formato con ruta:  .../s1600/foto.jpg   o   /w1200-h800/foto.jpg
    if (/\/[swh]\d[^\/]*\/[^\/]+$/i.test(url)) return url.replace(/\/[swh]\d[^\/]*(\/[^\/]+)$/i, '/w' + w + '$1');
    // Sin parámetro de tamaño
    if (/googleusercontent\.com\//i.test(url) && url.indexOf('=') === -1) return url + '=w' + w;
    return url;
  }
  // </tam>

  // ---------- Salir del navegador interno ----------
  // Si la app no cambió de pantalla tras 'ms', navega normal como respaldo.
  function vigilar(t, ms) {
    var fui = false;
    document.addEventListener('visibilitychange', function () { if (document.hidden) fui = true; });
    window.addEventListener('pagehide', function () { fui = true; });
    setTimeout(function () { if (!fui && !document.hidden) location.href = t; }, ms);
  }
  function ir(uri, t, ms, conRespaldo) {
    try { location.assign(uri); } catch (e) {}
    if (conRespaldo) vigilar(t, ms);
  }

  // Pantalla completa "Abrir en el navegador"
  function pantalla(t) {
    if (document.getElementById('h')) return;
    var largo = ios && app && !ig && !th;   // iOS sin esquema directo: pulsación larga
    var d = el('div'); d.id = 'h';
    var tit = el('strong'); tit.textContent = 'Abrir en tu navegador';
    var a = el('a'); a.href = t; a.textContent = largo ? 'Abrir' : 'Abrir en el navegador';
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (!largo) salir(t, true);
    });
    var p = el('p');
    p.textContent = largo
      ? 'Mantén pulsado el botón 3 segundos y toca Abrir.'
      : 'Toca Abrir y confirma el aviso de la app.';
    var p2 = el('p');
    p2.textContent = 'Si no pasa nada, usa el menú de la app (⋯) y elige “Abrir en el navegador”, o copia la dirección en Safari o Chrome.';
    d.appendChild(tit); d.appendChild(a); d.appendChild(p); d.appendChild(p2);
    document.body.appendChild(d);
  }

  // propio: true = es esta misma página (sin recarga de respaldo para no entrar en bucle)
  function salir(t, propio) {
    var enc = encodeURIComponent(t);
    var hp = t.replace(/^https?:\/\//i, '');
    if (ios && ig) return ir('instagram://extbrowser/?url=' + enc, t, 1600, !propio);
    if (ios && th) return ir('barcelona://extbrowser/?url=' + enc, t, 1600, !propio);
    if (and && app) return ir('intent://' + hp + '#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' + enc + ';end', t, 2600, !propio);
    if (ios && app) return pantalla(t);
    location.assign(t);
  }

  // ---------- Entrada directa a /go/nombre (desde otra pestaña, etc.) ----------
  var aterrizaje = slugDe(location.pathname);
  var objetivo = null;
  if (aterrizaje !== null) {
    objetivo = dest(aterrizaje);
    if (!app) {
      document.documentElement.style.visibility = 'hidden';
      location.replace(objetivo || '/');
      return;
    }
  }

  // ---------- Fotos de portada del tema (llevan data-src en vez de src) ----------
  Array.prototype.forEach.call(document.querySelectorAll('img[data-src]'), function (i) {
    i.src = tam(i.getAttribute('data-src'), +i.getAttribute('data-w') || 440);
  });

  // ---------- Construir los botones ----------
  var nav = document.querySelector('nav.bs');
  if (nav) {
    BOTONES.forEach(function (it, i) {
      var a = el('a', 'b' + (it.gate ? ' of' : '') + (it.img ? ' im' : ''));
      a.setAttribute('data-b', i);
      a.setAttribute('role', 'button');
      a.setAttribute('href', PREFIX + it.slug);   // lo que se ve al pasar el cursor
      if (it.img) {
        var im = el('img'); im.alt = ''; im.src = tam(it.img, 420); im.loading = 'lazy';
        a.appendChild(im);
      } else {
        var wrap = document.createElement('div');
        wrap.innerHTML = '<svg class="ic ' + it.k + '" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2">' + (ICONOS[it.k] || ICONOS.p8) + '</g></svg>';
        a.appendChild(wrap.firstChild);
      }
      var sp = el('span'); sp.textContent = it.l;
      a.appendChild(sp);
      nav.appendChild(a);
    });
  }

  // ---------- Aviso +18 ----------
  var g = document.getElementById('g');
  var gc = document.getElementById('g-c');
  var gl = document.getElementById('g-l');
  var pend = '';
  var cargando = false;
  function reposo() { if (!gc) return; gc.textContent = 'Continuar'; gc.removeAttribute('aria-busy'); cargando = false; }

  if (nav) nav.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[data-b]') : null;
    if (!a) return;
    if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button === 1) return; // abrir en pestaña nueva: /go/ redirige solo
    ev.preventDefault();
    var it = BOTONES[+a.getAttribute('data-b')];
    if (!it) return;
    var t = dest(it.slug);
    if (!t) return;
    if (it.gate && g) { pend = t; g.hidden = false; g.removeAttribute('hidden'); }
    else { salir(t); }
  });

  if (gc) gc.addEventListener('click', function (ev) {
    ev.preventDefault();
    if (cargando || !pend) return;
    gc.textContent = 'Abriendo…';
    gc.setAttribute('aria-busy', 'true');
    cargando = true;
    salir(pend);
  });
  if (gl) gl.addEventListener('click', function () { g.hidden = true; });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) return;
    var h = document.getElementById('h');
    if (h) h.remove();
    reposo();
  });

  // ---------- Navegador interno: obligar a salir nada más entrar ----------
  if (app) {
    var t0 = objetivo || location.href;
    pantalla(t0);
    if (and) salir(t0, !objetivo);
  }
})();
