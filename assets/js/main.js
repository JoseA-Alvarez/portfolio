/* José Álvarez — portfolio. JavaScript sin dependencias. */
(() => {
  "use strict";

  const D = window.PORTFOLIO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const FPS = 25;
  const pad = (n) => String(Math.floor(n)).padStart(2, "0");
  const tc = (sec) => {
    const s = Math.max(0, sec);
    const f = Math.floor((s % 1) * FPS);
    return `${pad(s / 3600)}:${pad((s % 3600) / 60)}:${pad(s % 60)}:${pad(f)}`;
  };
  const scrollToSel = (sel) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  /* ---------- Textura de grano (una vez) ---------- */
  (function makeNoise() {
    const c = document.createElement("canvas");
    c.width = c.height = 140;
    const x = c.getContext("2d");
    const img = x.createImageData(140, 140);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 150;
    }
    x.putImageData(img, 0, 0);
    document.documentElement.style.setProperty("--noise", `url(${c.toDataURL()})`);
  })();

  /* ---------- Datos personales ---------- */
  const P = D.persona;
  $$("[data-persona]").forEach((el) => {
    const v = P[el.dataset.persona];
    if (v) el.textContent = v;
  });
  $("#year").textContent = new Date().getFullYear();

  /* ==========================================================================
     PORTADA
     ========================================================================== */
  const hero = $("#top");
  const heroName = $(".hero__name");
  const dial = $(".dial");
  const dialBtns = $$(".dial button");
  const heroGo = $("#heroGo");
  const heroTc = $("#heroTc");
  const MODES = ["codigo", "foto", "video"];
  const goLabel = { codigo: "Ver código", foto: "Ver fotos", video: "Ver vídeos" };
  const PAGE = document.body.dataset.page || "todo";
  let heroMode = hero.dataset.mode || "codigo";
  let heroInView = true;
  let cycle = [];

  function applyMode(m) {
    heroMode = m;
    hero.dataset.mode = m;
    if (dial) dialBtns.forEach((b, i) => {
      const on = b.dataset.mode === m;
      b.setAttribute("aria-checked", String(on));
      b.tabIndex = on ? 0 : -1;
      if (on) dial.style.setProperty("--i", i);
    });
    if (heroGo && dial) { heroGo.textContent = goLabel[m]; heroGo.setAttribute("href", "#" + m); }
    if (heroInView) setZone(m, false);
    focusTarget.x = null;
  }

  function setHeroMode(m, fromUser) {
    if (fromUser) { cycle.forEach(clearTimeout); cycle = []; }
    if (m === heroMode) return;
    const pull = !reduce && (m === "foto" || heroMode === "foto");
    if (pull) {
      heroName.classList.add("is-pulling");
      setTimeout(() => {
        applyMode(m);
        requestAnimationFrame(() => requestAnimationFrame(() => heroName.classList.remove("is-pulling")));
      }, 280);
    } else {
      applyMode(m);
    }
  }

  dialBtns.forEach((b, i) => {
    b.addEventListener("click", () => setHeroMode(b.dataset.mode, true));
    b.addEventListener("keydown", (e) => {
      let n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % 3;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i + 2) % 3;
      if (n !== null) { e.preventDefault(); setHeroMode(MODES[n], true); dialBtns[n].focus(); }
    });
  });
  if (heroGo) heroGo.addEventListener("click", (e) => { e.preventDefault(); scrollToSel(heroGo.getAttribute("href")); });

  // Un único recorrido por los tres modos al cargar.
  if (!reduce && PAGE === "todo") {
    const start = () => {
      cycle.push(setTimeout(() => setHeroMode("foto"), 1700));
      cycle.push(setTimeout(() => setHeroMode("video"), 4100));
      cycle.push(setTimeout(() => setHeroMode("codigo"), 6700));
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  }

  /* Lienzo de la portada: rejilla (código), puntos AF (foto), guías de monitor (vídeo) */
  const cv = $(".hero__canvas");
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, raf = 0;
  const pointer = { x: 0, y: 0, on: false };
  const focusTarget = { x: null, y: null };

  function resize() {
    const r = hero.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive: true });
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.on = e.pointerType === "mouse";
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { pointer.on = false; });

  function drawCode(now) {
    const gap = W < 640 ? 22 : 28;
    const t = reduce ? 0 : now / 1000;
    for (let y = gap / 2; y < H; y += gap) {
      for (let x = gap / 2; x < W; x += gap) {
        let k = 0;
        if (pointer.on) k = Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 180);
        const w = reduce ? 0 : Math.pow(Math.max(0, Math.sin((x * 0.55 + y * 0.35) / 110 - t * 1.1)), 18) * 0.45;
        const a = 0.13 + 0.62 * Math.max(k, w);
        const s = 1.2 + 1.6 * k;
        ctx.fillStyle = k > 0.04 ? `rgba(240,180,76,${a})` : `rgba(163,179,190,${a})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
  }

  function drawFoto(now) {
    const cols = W < 640 ? 7 : 11, rows = W < 640 ? 5 : 7;
    const x0 = W * 0.1, x1 = W * 0.9, y0 = H * 0.2, y1 = H * 0.82;
    const pts = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      pts.push([x0 + (x1 - x0) * (c / (cols - 1)), y0 + (y1 - y0) * (r / (rows - 1))]);
    }
    // objetivo: el ratón, o un punto que recorre el nombre
    const t = reduce ? 0 : now / 1000;
    const tx = pointer.on ? pointer.x : W * (0.32 + 0.16 * Math.sin(t * 0.7));
    const ty = pointer.on ? pointer.y : H * (0.48 + 0.08 * Math.sin(t * 1.1));
    let best = pts[0], bd = Infinity;
    for (const p of pts) { const d = Math.hypot(p[0] - tx, p[1] - ty); if (d < bd) { bd = d; best = p; } }
    if (focusTarget.x === null) { focusTarget.x = best[0]; focusTarget.y = best[1]; }
    focusTarget.x += (best[0] - focusTarget.x) * 0.22;
    focusTarget.y += (best[1] - focusTarget.y) * 0.22;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(26,35,41,0.1)";
    const s = 12;
    for (const p of pts) ctx.strokeRect(p[0] - s / 2 + 0.5, p[1] - s / 2 + 0.5, s, s);

    // recuadro activo con esquinas
    const S = 34, fx = focusTarget.x, fy = focusTarget.y, L = 10;
    ctx.strokeStyle = "#2F8F5B";
    ctx.lineWidth = 2;
    ctx.beginPath();
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
      const cx = fx + sx * S / 2, cy = fy + sy * S / 2;
      ctx.moveTo(cx, cy - sy * L); ctx.lineTo(cx, cy); ctx.lineTo(cx - sx * L, cy);
    });
    ctx.stroke();
  }

  function drawVideo(now) {
    ctx.strokeStyle = "rgba(255,255,255,0.09)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < 3; i++) {
      ctx.moveTo((W * i) / 3 + 0.5, H * 0.07); ctx.lineTo((W * i) / 3 + 0.5, H * 0.93);
      ctx.moveTo(0, (H * i) / 3 + 0.5); ctx.lineTo(W, (H * i) / 3 + 0.5);
    }
    ctx.stroke();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.strokeRect(W * 0.05 + 0.5, H * 0.12 + 0.5, W * 0.9, H * 0.76);
    ctx.setLineDash([]);
    if (heroTc) heroTc.textContent = tc(now / 1000);
  }

  function heroFrame(now) {
    ctx.clearRect(0, 0, W, H);
    if (heroMode === "codigo") drawCode(now);
    else if (heroMode === "foto") drawFoto(now);
    else drawVideo(now);
    raf = heroInView ? requestAnimationFrame(heroFrame) : 0;
  }
  resize();
  raf = requestAnimationFrame(heroFrame);

  /* ==========================================================================
     ZONAS: el color de la navegación sigue a la sección visible
     ========================================================================== */
  const root = document.documentElement;
  const navLinks = $$(".nav__links a[data-nav]");
  function setZone(z, highlight) {
    root.dataset.zone = z;
    navLinks.forEach((a) => a.classList.toggle("is-current", highlight && a.dataset.nav === z));
  }
  const zoneIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      if (e.target === hero) { heroInView = true; setZone(heroMode, false); }
      else { setZone(e.target.dataset.zone, true); }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  $$("section[data-zone]").forEach((s) => zoneIO.observe(s));

  new IntersectionObserver(([e]) => {
    heroInView = e.isIntersecting;
    if (heroInView && !raf) raf = requestAnimationFrame(heroFrame);
  }).observe(hero);

  if (document.getElementById("codigo")) {
  /* ==========================================================================
     CÓDIGO
     ========================================================================== */
  const C = D.codigo;
  $("#codigoLead").textContent = C.lead;
  $("#caps").innerHTML = C.capacidades.map((c) => `
    <div class="cap">
      <dt>${esc(c.nombre)}</dt>
      <dd>${esc(c.texto)}</dd>
      <dd class="cap__tags">${c.tags.map(esc).join(" ")}</dd>
    </div>`).join("");

  $("#timeline").innerHTML = C.trayectoria.map((e) => `
    <li>
      <span class="tl-when">${esc(e.periodo)}</span>
      <div>
        <h4>${esc(e.empresa)}</h4>
        <p class="tl-role">${esc(e.puesto)}${e.lugar ? `, ${esc(e.lugar)}` : ""}</p>
        ${e.texto ? `<p class="tl-text">${esc(e.texto)}</p>` : ""}
      </div>
    </li>`).join("");

  $("#formacion").innerHTML = (C.formacion || []).map((f) => `<li><b>${esc(f.titulo)}</b>. ${esc(f.centro)}</li>`).join("");

  const pipeline = $("#pipeline");
  pipeline.innerHTML = C.metodo.map((m, i) => `
    <li><span class="p-n">${i + 1}</span><h4>${esc(m.paso)}</h4><p>${esc(m.texto)}</p></li>`).join("");

  // Un punto recorre el proceso una vez cuando aparece en pantalla.
  if (!reduce && "animate" in Element.prototype) {
    const token = document.createElement("span");
    token.className = "p-token";
    token.setAttribute("aria-hidden", "true");
    pipeline.appendChild(token);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const last = pipeline.querySelector("li:last-of-type");
      if (getComputedStyle(token).display === "none" || !last) return;
      token.animate(
        [{ transform: "translateX(0)" }, { transform: `translateX(${last.offsetLeft}px)` }],
        { duration: 2600, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards", delay: 300 }
      );
    }, { threshold: 0.6 });
    io.observe(pipeline);
  }

  /* Terminal */
  const out = $("#termOut");
  const form = $("#termForm");
  const input = $("#termInput");
  const history = [];
  let hIdx = 0;
  const pr = (k) => `<span class="t-k">${k}</span>`;
  const print = (html) => {
    const d = document.createElement("div");
    d.innerHTML = html;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  };
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

  const commands = {
    help: () => [
      `<span class="t-muted">Comandos disponibles:</span>`,
      ...[
        ["whoami", "quién soy"],
        ["stack", "con qué trabajo"],
        ["experiencia", "trayectoria"],
        ["formacion", "estudios"],
        ["sdd", "cómo trabajo con especificaciones"],
        ["ls", "qué hay en esta web"],
        ["foto", "ir a fotografía"],
        ["video", "ir a vídeo"],
        ["contacto", "cómo escribirme"],
        ["clear", "limpiar la terminal"]
      ].map(([k, v]) => `  ${pr(k.padEnd(12))}${v}`)
    ].join("\n"),
    whoami: () => [
      `<span class="t-sun">${esc(P.nombre)}</span>`,
      `${pr("rol     ")}${esc(C.rol)}`,
      `${pr("uptime  ")}${C.anios} años programando`,
      `${pr("antes   ")}pagos online en Gibraltar, frontend con Angular`,
      `${pr("ahora   ")}arquitectura, backend, infraestructura e IA en Maersk`,
      `${pr("idiomas ")}${esc(P.idiomas)}`,
      `${pr("base    ")}${esc(P.ubicacion)}`
    ].join("\n"),
    stack: () => C.capacidades.map((c) => `<span class="t-sun">${esc(c.nombre)}</span>\n  <span class="t-muted">${c.tags.map(esc).join("  ")}</span>`).join("\n"),
    experiencia: () => C.trayectoria.map((e) => `${pr(esc(e.periodo).padEnd(13))} ${esc(e.empresa)} <span class="t-muted">${esc(e.puesto)}</span>`).join("\n"),
    formacion: () => (C.formacion || []).map((f) => `${esc(f.titulo)}\n  <span class="t-muted">${esc(f.centro)}</span>`).join("\n"),
    sdd: () => C.metodo.map((m, i) => `<span class="t-sun">${i + 1}.</span> ${esc(m.paso)}  <span class="t-muted">${esc(m.texto)}</span>`).join("\n"),
    ls: () => `${pr("codigo/")}  ${pr("foto/")}  ${pr("video/")}  contacto.txt`,
    contacto: () => [
      `${pr("email    ")}${esc(P.email)}`,
      `${pr("linkedin ")}<a href="${esc(P.linkedin)}" target="_blank" rel="noopener">${esc(P.linkedin.replace(/^https?:\/\/(www\.)?/, ""))}</a>`
    ].join("\n"),
    "cat contacto.txt": () => commands.contacto(),
    codigo: () => `<span class="t-muted">Ya estás aquí.</span>`,
    foto: () => { setTimeout(() => scrollToSel("#foto"), 350); return `<span class="t-muted">Abriendo fotografía…</span>`; },
    video: () => { setTimeout(() => scrollToSel("#video"), 350); return `<span class="t-muted">Abriendo vídeo…</span>`; },
    clear: () => { out.innerHTML = ""; return null; },
    sudo: () => `<span class="t-err">Permiso denegado.</span> Prueba con ${pr("contacto")}.`,
    hola: () => `Hola. Escribe ${pr("help")} para ver qué puedes hacer aquí.`
  };
  commands.experience = commands.experiencia;

  function run(raw) {
    const cmd = raw.trim().replace(/\s+/g, " ");
    if (!cmd) return;
    print(`<span class="t-prompt">~ $</span> ${esc(cmd)}`);
    history.push(cmd); hIdx = history.length;
    let key = norm(cmd);
    if (key.startsWith("cd ")) key = key.slice(3).replace(/\/$/, "");
    if (key.startsWith("sudo")) key = "sudo";
    const fn = commands[key];
    if (!fn) { print(`<span class="t-err">comando no encontrado:</span> ${esc(cmd)}. Escribe ${pr("help")}.`); return; }
    const r = fn();
    if (r != null) print(r);
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); run(input.value); input.value = ""; });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && history.length) { e.preventDefault(); hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx]; }
    if (e.key === "ArrowDown" && history.length) { e.preventDefault(); hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; }
  });
  $("#termChips").innerHTML = ["help", "whoami", "stack", "experiencia", "sdd", "contacto"]
    .map((c) => `<button type="button" data-cmd="${c}">${c}</button>`).join("");
  $("#termChips").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-cmd]");
    if (!b) return;
    run(b.dataset.cmd);
    if (finePointer) input.focus({ preventScroll: true });
  });
  print(`<span class="t-muted">Terminal de este portfolio. Escribe</span> ${pr("help")} <span class="t-muted">o pulsa un comando de abajo.</span>`);
  run("whoami");

  }
  if (document.getElementById("foto")) {
  /* ==========================================================================
     FOTOGRAFÍA
     ========================================================================== */
  const F = D.foto;
  $("#fotoLead").textContent = F.lead;
  $("#fotoGear").textContent = "Equipo: " + F.equipo;
  const catName = Object.fromEntries(F.categorias.map((c) => [c.id, c.nombre]));
  const ratioNum = (r) => { const [a, b] = String(r || "3/2").split("/").map(Number); return a && b ? a / b : 1.5; };

  $("#sessions").innerHTML = F.categorias.map((c) => `<li><h4>${esc(c.nombre)}</h4><p>${esc(c.texto)}</p></li>`).join("");

  const BASE = document.body.dataset.page && document.body.dataset.page !== "todo" ? "../" : "";
  const media = (p, big) => p.src
    ? `<img src="${esc(/^(https?:)?\/\//.test(p.src) ? p.src : BASE + p.src)}" alt="${esc(p.alt || p.titulo)}" ${big ? "" : 'loading="lazy"'} decoding="async" style="--r:${esc(p.ratio || "3/2")}">`
    : `<div class="ph ph--${esc(p.cat)}" role="img" aria-label="Espacio reservado para la foto: ${esc(p.titulo)}" style="--r:${esc(p.ratio || "3/2")};--rn:${ratioNum(p.ratio)}">
         <span class="ph__file">${esc(p.cat)}-${String(F.fotos.indexOf(p) + 1).padStart(2, "0")}.jpg</span>
         <span class="ph__word">${esc(catName[p.cat] || p.cat)}</span>
       </div>`;

  const gallery = $("#gallery");
  gallery.innerHTML = F.fotos.map((p, i) => `
    <figure class="shot" data-cat="${esc(p.cat)}" style="--r:${esc(p.ratio || "3/2")}">
      <button type="button" class="shot__btn" data-i="${i}" aria-label="Ampliar: ${esc(p.titulo)}">${media(p)}</button>
      <figcaption><span>${esc(p.titulo)}</span>${p.exif ? `<span class="exif">${esc(p.exif)}</span>` : ""}</figcaption>
    </figure>`).join("");

  const counts = F.fotos.reduce((a, p) => ((a[p.cat] = (a[p.cat] || 0) + 1), a), {});
  const filterDefs = [{ id: "todo", nombre: "Todo", n: F.fotos.length }]
    .concat(F.categorias.filter((c) => counts[c.id]).map((c) => ({ id: c.id, nombre: c.nombre, n: counts[c.id] })));
  const filters = $("#filters");
  filters.innerHTML = filterDefs.map((f, i) => `<button type="button" data-f="${f.id}" aria-pressed="${i === 0}">${esc(f.nombre)}<sup>${f.n}</sup></button>`).join("");
  let currentFilter = "todo";
  filters.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-f]");
    if (!b || b.dataset.f === currentFilter) return;
    currentFilter = b.dataset.f;
    $$("button", filters).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const apply = () => $$(".shot", gallery).forEach((s) => { s.hidden = !(currentFilter === "todo" || s.dataset.cat === currentFilter); });
    if (reduce) { apply(); return; }
    gallery.classList.add("is-filtering");
    setTimeout(() => { apply(); gallery.classList.remove("is-filtering"); }, 180);
  });

  /* Retícula de enfoque */
  const reticle = $(".reticle");
  if (finePointer && !reduce) {
    gallery.classList.add("has-reticle");
    gallery.addEventListener("pointerenter", () => reticle.classList.add("is-on"));
    gallery.addEventListener("pointerleave", () => reticle.classList.remove("is-on", "is-locked"));
    gallery.addEventListener("pointermove", (e) => {
      reticle.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      reticle.classList.toggle("is-locked", !!e.target.closest(".shot"));
    }, { passive: true });
  }

  /* Lightbox */
  const lb = $("#lightbox");
  const lbMedia = $("#lbMedia");
  let lbIndex = 0;
  const visibleIdx = () => $$(".shot", gallery).filter((s) => !s.hidden).map((s) => Number($(".shot__btn", s).dataset.i));
  function showLb(i) {
    lbIndex = i;
    const p = F.fotos[i];
    lbMedia.innerHTML = media(p, true);
    $("#lbTitle").textContent = p.titulo;
    $("#lbExif").textContent = p.exif || "";
    const lk = $("#lbLink");
    if (lk) { lk.hidden = !p.enlace; if (p.enlace) { lk.href = p.enlace; lk.textContent = /500px/.test(p.enlace) ? "Ver en 500px" : "Ver original"; } }
  }
  function stepLb(d) {
    const v = visibleIdx();
    const pos = v.indexOf(lbIndex);
    showLb(v[(pos + d + v.length) % v.length]);
  }
  gallery.addEventListener("click", (e) => {
    const b = e.target.closest(".shot__btn");
    if (!b) return;
    const shot = b.closest(".shot");
    const open = () => { showLb(Number(b.dataset.i)); if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", ""); };
    if (reduce) { open(); return; }
    shot.classList.remove("is-shutter"); void shot.offsetWidth; shot.classList.add("is-shutter");
    setTimeout(open, 140);
  });
  $("#lbPrev").addEventListener("click", () => stepLb(-1));
  $("#lbNext").addEventListener("click", () => stepLb(1));
  $("#lbClose").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") stepLb(-1);
    if (e.key === "ArrowRight") stepLb(1);
  });

  }
  if (document.getElementById("video")) {
  /* ==========================================================================
     VÍDEO: un editor con línea de tiempo
     ========================================================================== */
  const V = D.video;
  const TOTAL = V.duracion;
  $("#videoLead").textContent = V.lead;
  $("#videoGear").textContent = "Equipo: " + V.equipo;
  $("#vservices").innerHTML = V.servicios.map((s) => `<li><h3>${esc(s.nombre)}</h3><p>${esc(s.texto)}</p></li>`).join("");
  $("#tcTotal").textContent = tc(TOTAL);

  const trackById = Object.fromEntries(V.pistas.map((p) => [p.id, p]));
  const tl = $("#tl");
  tl.setAttribute("aria-valuemax", String(TOTAL));

  // regla
  const ruler = $("#ruler");
  for (let s = 0; s < TOTAL; s += 20) {
    const sp = document.createElement("span");
    sp.style.left = `${(s / TOTAL) * 100}%`;
    sp.textContent = tc(s).slice(3, 8);
    ruler.appendChild(sp);
  }

  // pistas y clips
  $("#tracks").innerHTML = V.pistas.map((p) => `
    <div class="tl__row">
      <div class="tl__head"><b>${esc(p.corto)}</b><span>${esc(p.nombre)}</span></div>
      <div class="tl__lane" data-track="${esc(p.id)}">
        ${V.clips.map((c, i) => c.pista !== p.id ? "" :
          `<button type="button" class="clip" data-c="${i}" style="--s:${c.inicio / TOTAL};--d:${c.dur / TOTAL};--c:${esc(p.color)}" title="${esc(c.titulo)}">${esc(c.titulo)}</button>`).join("")}
      </div>
    </div>`).join("");

  // forma de onda (determinista)
  (function wave() {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const N = 240;
    let d = "";
    for (let i = 0; i < N; i++) {
      const env = 0.25 + 0.55 * Math.abs(Math.sin(i * 0.045) * Math.cos(i * 0.017)) + 0.2 * rnd();
      const h = Math.min(19, env * 19);
      d += `M${i + 0.5} ${20 - h}V${20 + h}`;
    }
    $("#audioWave").innerHTML = `<svg viewBox="0 0 ${N} 40" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" stroke="rgba(63,175,122,.85)" stroke-width=".6" fill="none"/></svg>`;
  })();

  const clipEls = $$(".clip", tl);
  const ratios = { "16:9": 16 / 9, "2.39:1": 2.39, "9:16": 9 / 16, "4:5": 4 / 5, "1:1": 1, "4:3": 4 / 3 };
  const frame = $("#viewerFrame");
  const vMedia = $("#viewerMedia");
  let t = 0, playing = false, vRaf = 0, last = 0, userPaused = false, current = undefined, videoInView = false;

  function activeClip(sec) {
    for (const p of V.pistas) {
      const i = V.clips.findIndex((c) => c.pista === p.id && sec >= c.inicio && sec < c.inicio + c.dur);
      if (i >= 0) return i;
    }
    return -1;
  }

  const ytId = (s) => String(s || "").replace(/^.*(?:v=|youtu\.be\/|embed\/)/, "").replace(/[?&].*$/, "");

  function showClip(i) {
    clipEls.forEach((el) => el.classList.toggle("is-active", Number(el.dataset.c) === i));
    if (i < 0) {
      vMedia.innerHTML = "";
      $("#metaTitle").textContent = "Sin clip";
      $("#metaText").textContent = "";
      $("#metaTrack").innerHTML = "";
      $("#metaActions").innerHTML = "";
      return;
    }
    const c = V.clips[i];
    const tr = trackById[c.pista];
    const r = ratios[c.formato] || 16 / 9;
    const stageR = 16 / 9;
    frame.style.width = r < stageR ? `${(r / stageR) * 100}%` : "100%";
    frame.style.height = r < stageR ? "100%" : `${(stageR / r) * 100}%`;
    $("#hudFormat").textContent = c.formato;

    const bg = `radial-gradient(70% 60% at 70% 30%, ${tr.color}66, transparent 70%), linear-gradient(160deg, ${tr.color}44 0%, #0B0C0E 75%)`;
    if (c.poster) {
      vMedia.innerHTML = `<img src="${esc(c.poster)}" alt="">`;
    } else {
      vMedia.innerHTML = `<div class="clipph" style="--clip-bg:${bg}"><span class="clipph__title">${esc(c.titulo)}</span><span class="clipph__sub">${esc(tr.nombre)}  ${esc(c.formato)}</span></div>`;
    }
    if (c.youtube) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "clip-play"; b.setAttribute("aria-label", `Reproducir ${c.titulo}`);
      b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>`;
      b.addEventListener("click", () => {
        pause(true);
        vMedia.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(ytId(c.youtube))}?autoplay=1&rel=0" title="${esc(c.titulo)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      });
      vMedia.appendChild(b);
    }
    $("#metaTrack").innerHTML = `<i style="--tc:${esc(tr.color)}"></i>${esc(tr.corto)}  ${esc(tr.nombre)}`;
    $("#metaTitle").textContent = c.titulo;
    $("#metaText").textContent = c.texto || "";
    const link = c.url || (c.youtube ? `https://www.youtube.com/watch?v=${ytId(c.youtube)}` : "");
    $("#metaActions").innerHTML = link ? `<a href="${esc(link)}" target="_blank" rel="noopener">Ver el vídeo completo</a>` : "";
  }

  function update() {
    tl.style.setProperty("--p", (t / TOTAL).toFixed(5));
    const s = tc(t);
    $("#tcNow").textContent = s;
    $("#hudTc").textContent = s;
    tl.setAttribute("aria-valuenow", String(Math.round(t)));
    tl.setAttribute("aria-valuetext", s);
    const i = activeClip(t);
    if (i !== current) { current = i; showClip(i); }
  }

  const playBtn = $("#playBtn");
  function loop(now) {
    if (!playing) { vRaf = 0; return; }
    t = (t + Math.min(0.1, (now - last) / 1000)) % TOTAL;
    last = now;
    update();
    vRaf = requestAnimationFrame(loop);
  }
  function play() {
    if (playing) return;
    playing = true; last = performance.now();
    playBtn.classList.add("is-playing"); playBtn.setAttribute("aria-label", "Pausar");
    vRaf = requestAnimationFrame(loop);
  }
  function pause(byUser) {
    playing = false;
    if (byUser) userPaused = true;
    playBtn.classList.remove("is-playing"); playBtn.setAttribute("aria-label", "Reproducir");
  }
  playBtn.addEventListener("click", () => {
    if (playing) pause(true);
    else { userPaused = false; if (current >= 0 && vMedia.querySelector("iframe")) { current = undefined; } play(); }
  });

  function seek(sec) {
    t = Math.min(TOTAL - 0.001, Math.max(0, sec));
    if (vMedia.querySelector("iframe")) current = undefined;
    update();
  }
  function secFromX(clientX) {
    const lane = $(".tl__lane", tl).getBoundingClientRect();
    return ((clientX - lane.left) / lane.width) * TOTAL;
  }
  let dragging = false;
  tl.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".tl__head")) return;
    const clip = e.target.closest(".clip");
    dragging = true;
    tl.setPointerCapture(e.pointerId);
    pause(true);
    seek(clip ? V.clips[Number(clip.dataset.c)].inicio + 0.01 : secFromX(e.clientX));
  });
  tl.addEventListener("pointermove", (e) => { if (dragging) seek(secFromX(e.clientX)); });
  const endDrag = () => { dragging = false; };
  tl.addEventListener("pointerup", endDrag);
  tl.addEventListener("pointercancel", endDrag);
  tl.addEventListener("keydown", (e) => {
    const step = e.shiftKey ? 5 : 1;
    if (e.key === "ArrowRight") { e.preventDefault(); pause(true); seek(t + step); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); pause(true); seek(t - step); }
    else if (e.key === "Home") { e.preventDefault(); pause(true); seek(0); }
    else if (e.key === "End") { e.preventDefault(); pause(true); seek(TOTAL); }
    else if (e.key === " " || e.key === "k") { e.preventDefault(); playBtn.click(); }
  });
  clipEls.forEach((el) => el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); pause(true); seek(V.clips[Number(el.dataset.c)].inicio + 0.01); }
  }));

  update();
  new IntersectionObserver(([e]) => {
    videoInView = e.isIntersecting;
    if (videoInView && !userPaused && !reduce) play();
    else if (!videoInView) pause(false);
  }, { threshold: 0.35 }).observe($(".editor"));

  }
  /* ==========================================================================
     CONTACTO
     ========================================================================== */
  const intents = D.contacto.intenciones;
  const intentsEl = $("#intents");
  intentsEl.innerHTML = intents.map((it, i) => `<button type="button" role="radio" data-intent-id="${esc(it.id)}" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(it.nombre)}</button>`).join("");
  const mailAddr = $("#mailAddr");
  const openMail = $("#openMail");
  function setIntent(id) {
    const it = intents.find((x) => x.id === id) || intents[0];
    $$("button", intentsEl).forEach((b) => { const on = b.dataset.intentId === it.id; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
    $("#mailSubject").textContent = it.asunto;
    openMail.href = `mailto:${P.email}?subject=${encodeURIComponent(it.asunto)}`;
  }
  intentsEl.addEventListener("click", (e) => { const b = e.target.closest("button[data-intent-id]"); if (b) setIntent(b.dataset.intentId); });
  intentsEl.addEventListener("keydown", (e) => {
    const btns = $$("button", intentsEl);
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % btns.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + btns.length) % btns.length;
    if (n !== null) { e.preventDefault(); setIntent(btns[n].dataset.intentId); btns[n].focus(); }
  });
  setIntent(PAGE !== "todo" ? PAGE : intents[0].id);
  $$("[data-intent]").forEach((a) => a.addEventListener("click", () => setIntent(a.dataset.intent)));

  const copyBtn = $("#copyMail");
  copyBtn.addEventListener("click", () => {
    const done = () => { copyBtn.textContent = "Copiada"; setTimeout(() => (copyBtn.textContent = "Copiar dirección"), 1800); };
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(mailAddr);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      copyBtn.textContent = "Dirección seleccionada";
      setTimeout(() => (copyBtn.textContent = "Copiar dirección"), 1800);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(P.email).then(done, fallback);
      else fallback();
    } catch (_) { fallback(); }
  });

  const social = [
    ["LinkedIn", P.linkedin],
    ["GitHub", P.github],
    ["Instagram", P.instagram]
  ].filter(([, u]) => u);
  $("#social").innerHTML = social.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${n}</a></li>`).join("");
})();
