// ---------- Scene registry ----------
// Each scene's world position, matching the --sx/--sy set inline in the HTML.
// Offsets are directional: they point the same way that building sits
// relative to the center of the landing scene (education sits bottom-left
// on the landing image, so it travels bottom-left; etc.), computed from
// each hotspot's centroid. Magnitude is fixed at 1.6 world-widths for a
// longer, more deliberate travel than a plain 1-scene hop.
// Chrome only auto-hides its address bar in response to an actual
// document scroll event — but our html/body are overflow:hidden (all
// scrolling happens inside .scene divs instead), so Chrome never sees
// a scroll and the address bar sits there permanently on mobile.
// This briefly unlocks real page scrolling just long enough to nudge
// it by 1px (which is enough to trigger the collapse), then locks
// scrolling back to normal immediately after — invisible to the user.
function nudgeAddressBar() {
  const html = document.documentElement;
  html.style.overflow = "auto";
  document.body.style.overflow = "auto";
  window.scrollTo(0, 1);
  window.setTimeout(() => {
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }, 300);
}
window.addEventListener("load", () => window.setTimeout(nudgeAddressBar, 250));
const SCENES = {
  landing: { sx: 0, sy: 0 },
  education: { sx: -1.6, sy: 1.6 },   // bottom-left
  research: { sx: -1.6, sy: -1.6 },  // top-left
  interest: { sx: 0, sy: -1.6 },  // straight up
  experience: { sx: 1.6, sy: -1.6 },  // top-right
  projects: { sx: 1.6, sy: 1.6 },   // bottom-right
  // "contact" is intentionally absent — it's not a scene, it opens the
  // ID card modal directly from wherever you are (see setupContactCard
  // further down). Keeping it out of SCENES makes goToScene('contact')
  // a harmless no-op instead of panning the camera to an empty spot.
};
// Scales the hero name/tags and top-right pill cluster as one rigid unit,
// based on both viewport width AND height, so short landscape phones
// shrink correctly instead of only reacting to width like vw alone would.
function updateHeroScale() {
  const REF_W = 1400; // width at which hero looks right at scale 1
  const REF_H = 800;  // height at which hero looks right at scale 1
  const scale = Math.min(1, window.innerWidth / REF_W, window.innerHeight / REF_H);
  const clamped = Math.max(0.4, scale); // never shrink below 40%
  document.documentElement.style.setProperty("--hero-scale", clamped.toFixed(3));
}
window.addEventListener("resize", updateHeroScale);
updateHeroScale();
// ---------- Landing hotspot zones ----------
// Traced from image-map.net against the source image at 1376x768,
// converted to percentages so they hold up at any render size.
const ZONES = {
  education: {
    clip: "polygon(27.83% 94.4%, 45.64% 75.65%, 43.9% 73.7%, 44.33% 72.4%, 43.46% 69.01%, 43.6% 68.23%, 43.24% 65.76%, 41.93% 60.55%, 40.84% 65.36%, 40.62% 68.49%, 40.33% 70.57%, 39.68% 68.23%, 39.39% 65.89%, 38.59% 62.63%, 37.94% 65.89%, 37.79% 67.06%, 35.25% 64.58%, 30.6% 59.24%, 23.04% 51.43%, 21.37% 53.26%, 21.15% 54.43%, 20.06% 52.34%, 15.55% 55.86%, 14.03% 59.11%, 13.08% 60.29%, 12.28% 61.2%, 11.63% 61.72%, 10.54% 60.16%, 8.94% 61.72%, 8.72% 62.76%, 8.72% 66.8%, 6.03% 70.05%, 5.89% 71.35%, 20.28% 86.46%)",
    cx: "22%", cy: "70%",
  },
  research: {
    clip: "polygon(20.93% 46.48%, 20.93% 34.77%, 22.24% 32.55%, 22.75% 31.64%, 26.02% 29.56%, 26.38% 27.99%, 28.56% 25.52%, 30.96% 25.0%, 40.41% 34.9%, 40.48% 46.09%, 30.52% 56.64%)",
    cx: "28%", cy: "38%",
  },
  interest: {
    clip: "polygon(45.57% 34.9%, 35.9% 25.52%, 36.12% 23.05%, 39.97% 19.27%, 42.22% 16.93%, 42.66% 15.1%, 43.17% 14.06%, 44.04% 12.89%, 44.77% 12.76%, 45.2% 12.89%, 45.71% 13.54%, 46.37% 13.54%, 46.66% 14.19%, 47.24% 14.97%, 47.6% 16.02%, 47.82% 16.93%, 48.11% 17.97%, 48.4% 18.88%, 48.98% 19.27%, 49.64% 20.05%, 50.22% 20.44%, 50.73% 21.09%, 51.09% 21.88%, 51.6% 22.27%, 52.11% 23.18%, 52.69% 23.18%, 53.2% 23.96%, 53.78% 24.61%, 53.92% 26.56%)",
    cx: "44%", cy: "21%",
  },
  experience: {
    clip: "polygon(56.25% 30.08%, 57.78% 28.52%, 57.92% 27.21%, 58.43% 26.3%, 60.61% 23.7%, 61.05% 24.09%, 60.97% 18.36%, 63.01% 16.15%, 64.61% 18.23%, 64.61% 25.91%, 65.04% 25.39%, 67.22% 27.73%, 67.81% 28.65%, 67.88% 30.86%, 69.11% 29.56%, 68.6% 28.65%, 68.68% 27.6%, 70.35% 25.39%, 72.31% 27.08%, 72.31% 34.38%, 72.6% 33.72%, 74.06% 35.29%, 74.2% 44.66%, 67.81% 51.69%, 56.03% 39.19%)",
    cx: "63%", cy: "34%",
  },
  projects: {
    clip: "polygon(64.75% 72.4%, 77.62% 86.2%, 89.46% 74.48%, 89.39% 59.64%, 76.82% 46.48%, 64.68% 58.98%)",
    cx: "77%", cy: "66%",
  },
  contact: {
    clip: "polygon(84.01% 38.15%, 87.5% 34.38%, 86.99% 33.2%, 87.35% 31.9%, 86.12% 30.34%, 86.05% 21.88%, 85.54% 20.31%, 84.52% 19.66%, 83.5% 19.14%, 82.7% 19.66%, 82.19% 20.57%, 81.76% 21.48%, 81.76% 23.05%, 81.54% 30.73%, 79.87% 32.55%, 79.72% 33.72%)",
    cx: "85%", cy: "28%",
  },
};

const world = document.getElementById("world");
const leafLayer = document.getElementById("leafLayer");
const callout = document.getElementById("callout");
const calloutText = document.getElementById("calloutText");
const hotspots = Array.from(document.querySelectorAll(".hotspot"));
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

// How long (ms) each scene's arrival animation takes to finish, measured
// from the moment the scene becomes .active — used to decide when it's
// safe to reveal the navbar again. Falls back to a sane default for any
// scene not listed here.
const SCENE_ANIMATION_MS = {
  education: 6500, // overwritten dynamically by runEducationJourney() each run
};
const DEFAULT_ANIMATION_MS = 1200;

function inflatePolygon(clipPath, pct) {
  const inner = clipPath.match(/polygon\((.*)\)/)[1];
  const pts = inner.split(",").map((pair) => {
    const [x, y] = pair.trim().split(/\s+/).map((v) => parseFloat(v));
    return { x, y };
  });
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const grown = pts.map((p) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    return `${(p.x + dx * pct).toFixed(2)}% ${(p.y + dy * pct).toFixed(2)}%`;
  });
  return `polygon(${grown.join(", ")})`;
}

hotspots.forEach((hotspot) => {
  const zone = ZONES[hotspot.dataset.target];
  if (!zone) return;
  hotspot.style.setProperty("--zone", zone.clip);
  hotspot.style.setProperty("--zone-hover", inflatePolygon(zone.clip, 0.14));
  hotspot.style.setProperty("--gx", zone.cx);
  hotspot.style.setProperty("--gy", zone.cy);
  hotspot.dataset.cx = zone.cx;
  hotspot.dataset.cy = zone.cy;
});

// ---------- Hover callouts ----------

// function showCallout(hotspot) {
//   calloutText.textContent = hotspot.dataset.label;
//   const wrapRect = document.getElementById("scene-landing").getBoundingClientRect();
//   const cx = parseFloat(hotspot.dataset.cx) / 100;
//   const cy = parseFloat(hotspot.dataset.cy) / 100;
//   callout.style.left = `${cx * wrapRect.width}px`;
//   callout.style.top = `${cy * wrapRect.height}px`;
//   callout.classList.add("visible");
// }
function hideCallout() { callout?.classList.remove("visible"); }

hotspots.forEach((hotspot) => {
  hotspot.addEventListener("click", (e) => {
    e.preventDefault();
    goToScene(hotspot.dataset.target);
  });
});

window.setTimeout(() => hotspots.forEach((h) => h.classList.add("idle")), 1600);

// ---------- Camera navigation (no page reload) ----------

let currentScene = "landing";
let navRevealTimer = null;
let visitedReveals = new Set(); // scenes whose staged reveal has already played this load

// Scenes with a staged multi-beat reveal (vs. the generic illustration
// stagger) register their runner function here. Projects gets added
// further down, right after its render function is defined.
const SCENE_REVEAL_RUNNERS = {
  education: runEducationJourney,
};

function goToScene(name, opts = {}) {
  const target = SCENES[name];
  if (!target) return; // scene not built yet

  const instant = !!opts.instant;

  world.style.transitionDuration = instant ? "0s" : "";
  world.style.transform = `translate(${-target.sx * 100}vw, ${-target.sy * 100}vh)`;

  currentScene = name;
  history.replaceState(null, "", `#${name}`);

  document.body.classList.toggle("on-landing", name === "landing");
  navLinks.forEach((a) => a.classList.toggle("current", a.dataset.nav === name));

  hideCallout();

  // Any scene's staged reveal only plays once per page load — after that,
  // coming back to it (without a reload) should show the finished state
  // immediately instead of making the person sit through it again.
  const hasReveal = !!SCENE_REVEAL_RUNNERS[name];
  const alreadyPlayed = hasReveal && visitedReveals.has(name);
  if (hasReveal) visitedReveals.add(name);
  const skipReveal = instant || alreadyPlayed;

  // Keep the navbar hidden through the whole arrival sequence (camera pan
  // + that scene's own entrance animation) so it doesn't pop in mid-flight.
  // Deep-linked/instant loads and repeat visits skip the wait entirely.
  if (navRevealTimer) window.clearTimeout(navRevealTimer);
  if (name === "landing") {
    document.body.classList.remove("scene-animating");
  } else if (skipReveal) {
    document.body.classList.remove("scene-animating");
  } else {
    document.body.classList.add("scene-animating");
  }

  const sceneEl = document.getElementById(`scene-${name}`);
  if (!sceneEl) return;

  const cameraDelay = instant ? 0 : 1900;

  window.setTimeout(() => {
    document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active", "just-arrived"));
    sceneEl.classList.add("active", "just-arrived");

    if (hasReveal) {
      SCENE_REVEAL_RUNNERS[name](sceneEl, skipReveal);
    } else {
      // generic stagger for any other scene's timeline illustrations
      const illustrations = Array.from(sceneEl.querySelectorAll(".timeline-illustration"));
      illustrations.forEach((el, i) => {
        const delay = 0.2 + i * 0.3;
        el.querySelector(".illustration-grow")?.style.setProperty("--grow-delay", `${delay}s`);
        window.setTimeout(() => spawnDustMotes(el), (delay + 0.5) * 1000);
      });
    }
    window.setTimeout(() => runSceneTour(name), name === "projects" ? 300 : 50);

    // once this scene's own entrance animation has finished, reveal the navbar
    if (!skipReveal && name !== "landing") {
      const animMs = SCENE_ANIMATION_MS[name] ?? DEFAULT_ANIMATION_MS;
      navRevealTimer = window.setTimeout(() => {
        document.body.classList.remove("scene-animating");
      }, animMs);
    }
  }, cameraDelay);

  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path: `scene/${name}`, title: name, event: true });
  }
}

// PSG -> flight -> UW reveal sequence for the Education scene, staged as:
//   PSG grows from the ground up -> pin drops on it -> "India" label fades
//   in -> card slides up -> (pause) -> the view scrolls down the isometric
//   grid while the plane flies a hyperbolic arc from pin to pin -> the
//   instant it lands, the USA pin drops -> "USA" fades in -> UW grows from
//   the ground up -> card slides up.
// On instant (deep-link) loads everything just snaps to its final state.
let eduRunId = 0;

function runEducationJourney(sceneEl, instant) {
  const runId = ++eduRunId;
  const isCurrent = () => runId === eduRunId;

  const psgRow = sceneEl.querySelector("#rowPsg");
  const uwRow = sceneEl.querySelector("#rowUw");
  const flightSvg = sceneEl.querySelector("#flightSvg");
  if (!psgRow || !uwRow) return;

  const psgIllustration = psgRow.querySelector(".timeline-illustration");
  const uwIllustration = uwRow.querySelector(".timeline-illustration");
  const psgPin = psgRow.querySelector(".journey-pin");
  const uwPin = uwRow.querySelector(".journey-pin");
  const psgLabel = psgPin?.querySelector(".pin-label");
  const uwLabel = uwPin?.querySelector(".pin-label");
  const psgCard = psgRow.querySelector(".timeline-card");
  const uwCard = uwRow.querySelector(".timeline-card");

  const psgGrow = psgIllustration?.querySelector(".illustration-grow");
  const uwGrow = uwIllustration?.querySelector(".illustration-grow");

  // Reset every time this runs — the SPA never reloads the DOM, so without
  // this, returning to Education after visiting another scene would just
  // show everything already in its finished state instead of replaying.
  psgCard?.classList.add("card-pending");
  uwCard?.classList.add("card-pending");
  psgPin?.classList.remove("pin-visible");
  uwPin?.classList.remove("pin-visible");
  psgLabel?.classList.remove("label-visible");
  uwLabel?.classList.remove("label-visible");
  psgGrow?.classList.add("grow-pending");
  uwGrow?.classList.add("grow-pending");
  flightSvg?.classList.remove("flying");
  flightSvg?.classList.add("flight-done");

  if (instant) {
    psgGrow?.classList.remove("grow-pending");
    psgGrow?.style.setProperty("--grow-delay", "0s");
    uwGrow?.classList.remove("grow-pending");
    uwGrow?.style.setProperty("--grow-delay", "0s");
    psgPin?.classList.add("pin-visible");
    uwPin?.classList.add("pin-visible");
    psgLabel?.classList.add("label-visible");
    uwLabel?.classList.add("label-visible");
    psgCard?.classList.remove("card-pending");
    uwCard?.classList.remove("card-pending");
    return;
  }

  // ---- PSG beat: grow -> pin -> label -> card ----
  const GROW_DELAY = 100, GROW_DUR = 900;
  const PIN_DUR = 550, LABEL_DUR = 400, CARD_DUR = 550, BEAT_GAP = 150;

  psgGrow?.style.setProperty("--grow-delay", `${GROW_DELAY / 1000}s`);
  psgGrow?.classList.remove("grow-pending");

  let t = GROW_DELAY + GROW_DUR + BEAT_GAP;
  window.setTimeout(() => { if (!isCurrent()) return; psgPin?.classList.add("pin-visible"); spawnDustMotes(psgIllustration); }, t);

  t += PIN_DUR + BEAT_GAP;
  window.setTimeout(() => { if (!isCurrent()) return; psgLabel?.classList.add("label-visible"); }, t);

  t += LABEL_DUR + BEAT_GAP;
  window.setTimeout(() => { if (!isCurrent()) return; psgCard?.classList.remove("card-pending"); }, t);

  // ---- Flight beat: scroll the scene while the plane crosses the grid ----
  t += CARD_DUR + 500; // let the PSG card sit for a beat before departing
  const FLIGHT_DUR = 1800;
  const flightStart = t;

  window.setTimeout(() => {
    if (!isCurrent()) return;
    if (!flightSvg || !psgPin || !uwPin) return;
    const wrap = sceneEl.querySelector(".timeline-wrap");
    const wrapRect = wrap.getBoundingClientRect();
    const start = getPinTip(psgPin, wrapRect);
    const end = getPinTip(uwPin, wrapRect);

    const curve = flightSvg.querySelector("#flightCurve");
    const plane = flightSvg.querySelector("#planeIcon");
    const d = buildIsometricArc(start.x, start.y, end.x, end.y);
    curve.setAttribute("d", d);
    plane.style.offsetPath = `path("${d}")`;

    flightSvg.classList.remove("flight-done");
    flightSvg.classList.add("flying");

    // the viewport travels down the isometric grid in step with the plane
    const targetScroll = Math.max(0, uwRow.offsetTop - sceneEl.clientHeight * 0.35);
    animateScrollTo(sceneEl, targetScroll, FLIGHT_DUR);
  }, flightStart);

  t += FLIGHT_DUR;
  // dissolve the path the moment the plane lands — it did its job
  window.setTimeout(() => {
    if (!isCurrent()) return;
    flightSvg?.classList.add("flight-done");
    flightSvg?.classList.remove("flying");
  }, t);

  // ---- UW beat: pin -> label -> grow -> card ----
  window.setTimeout(() => { if (!isCurrent()) return; uwPin?.classList.add("pin-visible"); }, t);

  t += PIN_DUR + BEAT_GAP;
  window.setTimeout(() => { if (!isCurrent()) return; uwLabel?.classList.add("label-visible"); }, t);

  t += LABEL_DUR + BEAT_GAP;
  window.setTimeout(() => {
    if (!isCurrent()) return;
    uwGrow?.style.setProperty("--grow-delay", "0s");
    uwGrow?.classList.remove("grow-pending");
    window.setTimeout(() => { if (isCurrent()) spawnDustMotes(uwIllustration); }, GROW_DUR);
  }, t);

  t += GROW_DUR + BEAT_GAP;
  window.setTimeout(() => { if (!isCurrent()) return; uwCard?.classList.remove("card-pending"); }, t);

  t += CARD_DUR + 300;
  SCENE_ANIMATION_MS.education = t;
}

// Builds a smooth flight-path curve from (x1,y1) to (x2,y2) — a single
// cubic bezier, so the plane's motion stays fluid/hyperbolic rather than
// jagged — but the "lift" of the arc is tilted along the same 30deg angle
// as the world-grid diagonals, instead of rising straight up. That's what
// makes it read as traveling through the isometric space rather than a
// generic flat semicircle dropped in the middle of the page.
function buildIsometricArc(x1, y1, x2, y2) {
  const rad = Math.PI / 180;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(dist * 0.42, 260);

  // lift direction: leans along the grid's 30deg diagonal (up + slightly
  // right) rather than straight vertical, so the arc's peak sits skewed
  // the same way the isometric tiles are skewed
  const liftX = Math.sin(30 * rad) * lift;
  const liftY = -Math.cos(30 * rad) * lift;

  const c1x = x1 + dx * 0.28 + liftX;
  const c1y = y1 + dy * 0.28 + liftY;
  const c2x = x1 + dx * 0.72 + liftX * 0.55;
  const c2y = y1 + dy * 0.72 + liftY * 0.55;

  return `M ${x1},${y1} C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${x2},${y2}`;
}

// Reads the real on-screen tip position of a journey-pin, relative to the
// timeline-wrap container, so the flight path actually starts/ends exactly
// on the India/USA pins rather than a generic centered arc.
function getPinTip(pinEl, wrapRect) {
  const r = pinEl.getBoundingClientRect();
  return { x: r.left + r.width / 2 - wrapRect.left, y: r.top - wrapRect.top };
}

// Smoothly scrolls a scrollable element to a target scrollTop over
// `duration` ms, eased — used so the viewport visibly travels down the
// isometric grid alongside the plane, instead of the flight path happening
// off-screen between two rows the user hasn't scrolled to yet.
function animateScrollTo(el, toY, duration) {
  const fromY = el.scrollTop;
  const delta = toY - fromY;
  if (Math.abs(delta) < 2) return;
  const startTime = performance.now();
  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad
    el.scrollTop = fromY + delta * eased;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---------- Research scene: exhibit callouts -> centered modal dialog ----------
// Same pattern as the Experience road stops: click a callout on the
// gallery photo, a centered dialog opens with that exhibit's full
// write-up. No arrow animation, no corner brackets — just the photo
// plus small clickable markers.

(function setupResearchExhibits() {
  const triggers = Array.from(document.querySelectorAll(".research-callout[data-exhibit]"));
  const dialog = document.getElementById("resDialog");
  const overlay = document.getElementById("resOverlay");
  const closeBtn = document.getElementById("resDialogClose");
  if (!triggers.length || !dialog || !overlay) return;

  const researchScene = document.getElementById("scene-research");

  function closeDialog() {
    triggers.forEach((t) => t.setAttribute("aria-expanded", "false"));
    dialog.classList.remove("exp-dialog-open");
    dialog.setAttribute("aria-hidden", "true");
    overlay.classList.remove("exp-overlay-visible");
    researchScene?.classList.remove("scene-scroll-locked");
  }

  function openDialog(id) {
    triggers.forEach((t) => t.setAttribute("aria-expanded", String(t.dataset.exhibit === id)));
    document.querySelectorAll("#resDialog .panel-content").forEach((c) => {
      c.classList.toggle("panel-content-active", c.dataset.exhibit === id);
    });
    document.querySelectorAll("#resDialog .exp-cert-btn").forEach((btn) => {
      btn.classList.toggle("exp-cert-visible", btn.dataset.exhibit === id);
    });
    dialog.classList.add("exp-dialog-open");
    dialog.setAttribute("aria-hidden", "false");
    overlay.classList.add("exp-overlay-visible");
    dialog.scrollTop = 0;
    researchScene?.classList.add("scene-scroll-locked");
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const id = trigger.dataset.exhibit;
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      isOpen ? closeDialog() : openDialog(id);
    });
  });

  closeBtn?.addEventListener("click", closeDialog);
  overlay.addEventListener("click", closeDialog);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDialog();
  });
})();

function spawnDustMotes(container) {
  for (let i = 0; i < 6; i++) {
    const dot = document.createElement("span");
    dot.className = "dust-mote";
    const spread = (Math.random() - 0.5) * 50;
    dot.style.left = `calc(50% + ${spread}px)`;
    dot.style.setProperty("--mote-dx", `${spread * 0.6}px`);
    dot.style.animationDelay = `${Math.random() * 0.15}s`;
    container.appendChild(dot);
    dot.addEventListener("animationend", () => dot.remove());
  }
}

navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    goToScene(a.dataset.nav);
  });
});

// deep-link support: jump straight to the right scene on load, no camera pan
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "");
  if (hash && SCENES[hash] && document.getElementById(`scene-${hash}`)) {
    goToScene(hash, { instant: true });
  } else {
    goToScene("landing", { instant: true });
  }
});

// ---------- Leaf trio (follows the cursor across the whole world) ----------

const LEAF_IMG_SRC = "assets/leaf.png";

const leafFollowers = [
  { size: 26, lag: 0.22, offX: 0, offY: 0, x: 0, y: 0 },
  { size: 18, lag: 0.13, offX: -26, offY: 18, x: 0, y: 0 },
  { size: 13, lag: 0.07, offX: 24, offY: 32, x: 0, y: 0 },
];

leafFollowers.forEach((f) => {
  const el = document.createElement("div");
  el.className = "leaf-follow";
  el.innerHTML = `<img src="${LEAF_IMG_SRC}" alt="" width="${f.size}" height="${f.size}" />`;
  leafLayer.appendChild(el);
  f.el = el;
});

let mouseX = null;
let mouseY = null;
let rotAngle = 0;

document.addEventListener("mousemove", (e) => {
  if (!window.matchMedia("(hover: hover)").matches) return;
  mouseX = e.clientX;
  mouseY = e.clientY;
  leafLayer.classList.add("active");
});
document.addEventListener("mouseleave", () => leafLayer.classList.remove("active"));

function animateLeafFollowers() {
  if (mouseX !== null) {
    rotAngle += 0.6;
    leafFollowers.forEach((f, i) => {
      const targetX = mouseX + f.offX;
      const targetY = mouseY + f.offY;
      f.x += (targetX - f.x) * f.lag;
      f.y += (targetY - f.y) * f.lag;
      const wobble = Math.sin((rotAngle + i * 40) * (Math.PI / 180)) * 12;
      f.el.style.transform = `translate(${f.x - f.size / 2}px, ${f.y - f.size / 2}px) rotate(${wobble}deg)`;
    });
  }
  requestAnimationFrame(animateLeafFollowers);
}
requestAnimationFrame(animateLeafFollowers);

function buildWavePath(width, height) {
  const y = height * (0.15 + Math.random() * 0.5);
  const amp = height * 0.06;
  return `M -30,${y} C ${width * 0.2},${y - amp} ${width * 0.3},${y + amp} ${width * 0.5},${y} S ${width * 0.8},${y - amp} ${width + 30},${y}`;
}

function triggerGust() {
  const path = buildWavePath(window.innerWidth, window.innerHeight);
  const count = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    window.setTimeout(() => {
      const leaf = document.createElement("div");
      leaf.className = "gust-leaf";
      leaf.innerHTML = `<img src="${LEAF_IMG_SRC}" alt="" />`;
      leaf.style.offsetPath = `path('${path}')`;
      leaf.style.setProperty("--gust-dur", `${4 + Math.random() * 2}s`);
      const size = 14 + Math.random() * 14;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      leafLayer.appendChild(leaf);
      leaf.addEventListener("animationend", () => leaf.remove());
    }, i * 140);
  }
}

function scheduleNextGust() {
  const delay = 9000 + Math.random() * 12000;
  window.setTimeout(() => {
    if (window.matchMedia("(hover: hover)").matches) triggerGust();
    scheduleNextGust();
  }, delay);
}
scheduleNextGust();

// ---------- Experience scene: road stops -> centered modal dialog ----------
// Clicking a building or its callout opens a single centered dialog over a
// blurred backdrop covering the whole scene. Only WHICH .panel-content is
// visible inside the dialog changes, based on which stop was clicked, and
// only the matching completion-certificate button (if that role has one)
// is shown. Close via the × button, clicking the backdrop, Escape, or
// clicking the currently-open trigger again.

(function setupExperienceRoad() {
  // Clickable triggers are any <button data-stop> inside the road stage —
  // that covers both the simple one-building-one-callout stops (where the
  // whole road-stop IS the button) and the UW building's two separate
  // callout buttons (where road-stop is just a plain positioning wrapper
  // and each callout is its own trigger).
  const triggers = Array.from(document.querySelectorAll("#roadStage button[data-stop]"));
  const dialog = document.getElementById("expDialog");
  const overlay = document.getElementById("expOverlay");
  const closeBtn = document.getElementById("expDialogClose");
  if (!triggers.length || !dialog || !overlay) return;

  const experienceScene = document.getElementById("scene-experience");

  function closeDialog() {
    triggers.forEach((t) => t.setAttribute("aria-expanded", "false"));
    dialog.classList.remove("exp-dialog-open");
    dialog.setAttribute("aria-hidden", "true");
    overlay.classList.remove("exp-overlay-visible");
    experienceScene?.classList.remove("scene-scroll-locked");
  }

  function openDialog(id) {
    triggers.forEach((t) => t.setAttribute("aria-expanded", String(t.dataset.stop === id)));
    document.querySelectorAll(".panel-content").forEach((c) => {
      c.classList.toggle("panel-content-active", c.dataset.stop === id);
    });
    document.querySelectorAll(".exp-cert-btn").forEach((btn) => {
      btn.classList.toggle("exp-cert-visible", btn.dataset.stop === id);
    });
    dialog.classList.add("exp-dialog-open");
    dialog.setAttribute("aria-hidden", "false");
    overlay.classList.add("exp-overlay-visible");
    dialog.scrollTop = 0;
    // freeze the road's own scroll while the dialog is open — nothing
    // behind the blur should be able to shift while it's up
    experienceScene?.classList.add("scene-scroll-locked");
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const id = trigger.dataset.stop;
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      isOpen ? closeDialog() : openDialog(id);
    });
  });

  closeBtn?.addEventListener("click", closeDialog);
  overlay.addEventListener("click", closeDialog);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDialog();
  });
})();

// ---------- In-dialog links to other scenes (e.g. RA -> Research) ----------
// Closes the currently-open experience dialog first (it lives at page
// level now, not inside any scene, so it won't auto-close on navigation),
// then pans the camera to the target scene.
document.querySelectorAll(".scene-link[data-goto]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("expDialog")?.classList.remove("exp-dialog-open");
    document.getElementById("expOverlay")?.classList.remove("exp-overlay-visible");
    document.getElementById("scene-experience")?.classList.remove("scene-scroll-locked");
    goToScene(link.dataset.goto);
  });
});

// ============================================================
// PROJECTS SCENE
// ============================================================
//
// Adding a new project later = append one object to PROJECTS below +
// drop the stamp image into assets/projects/. Nothing else needs to
// change: filter chips, tag colors (for the 4 known tags), stamp
// series text, and the card grid all derive from this array at
// render time. If a brand-new tag shows up that isn't SYS/AI/HPC/WEB,
// it still gets a filter chip and a card automatically — it just
// falls back to a neutral gray styling instead of a dedicated color.

const PROJECTS = [
  {
    id: "bin-packing",
    title: "GPU-Cost-Aware Bin-Packing Scheduler",
    tags: ["SYS"],
    techStack: ["Go", "client-go", "Kubernetes", "kind", "Docker", "Bash"],
    date: "2026-07",
    dateLabel: "07 · 26",
    pinned: true,
    blurb: "A Kubernetes admission webhook that enforces GPU cost tiers and SLA eligibility at admission time, something native Kubernetes scheduling has no way to do.",
    stamp: "assets/projects/bin-packing-stamp.png",
    plaque: "BIN-PACKING",
    problem: "Bin packing is the classic problem of fitting items into containers as efficiently as possible without wasting space. GPU scheduling is that problem in disguise, except most containers here aren't equal cost. Premium, mid, and economy tier GPUs carry very different prices, but Kubernetes' native schedulers pack purely by resource fit. They have no concept of price or of whether a job's latency requirements call for premium silicon. Left alone, that means latency-sensitive jobs can land on cheap hardware they struggle on, while routine batch jobs quietly soak up premium GPU capacity they never needed.",
    approach: [
      "Built as a <strong>Kubernetes Mutating Admission Webhook in Go</strong>, intercepting every pod at admission time through client-go, before the default scheduler runs",
      "Enforces SLA-tier eligibility as a hard filter, excluding latency-sensitive jobs from economy-tier GPUs",
      "Scores every eligible GPU through a multi-stage cascade: a 2D vector fit check across compute and memory (the actual bin-packing step, fitting each job into the tightest GPU that still satisfies both dimensions), a normalized leftover score, duration-fit so short jobs pack tight and long jobs keep headroom, lowest eligible cost tier, and LRU as the final tiebreaker",
      "Tested against <strong>3 cost tiers</strong> modeled on real H100, A100, and T4/L40S pricing, across a 3-cluster kind topology: one cluster running the webhook, one running Kubernetes' native MostAllocated strategy, one running LeastAllocated, each with <strong>6 GPU worker nodes</strong> split evenly across tiers",
      "Getting a fair comparison meant fixing a Kubernetes quirk first: scoring plugins silently ignore custom extended resources unless explicitly declared in KubeSchedulerConfiguration. Both baseline clusters needed that config added by hand, otherwise they'd be scheduling GPU jobs blind to GPU tiers"
    ],
    result: [
      "Ran a <strong>120-run benchmark sweep</strong>, 3 scheduling strategies across 4 load levels and 10 seeds each, through a reproducible harness comparing the webhook against Kubernetes' two native strategies",
      "At <strong>110% cluster demand</strong>, the webhook scheduled <strong>70.5% of job units</strong> compared to <strong>63.5%</strong> for Kubernetes' native LeastAllocated strategy, and that gap held consistently across every load level tested, confirming that packing by cost and fit genuinely outperforms Kubernetes' default spread-based placement once GPU tiers are in play",
      "Benchmarking also surfaced a <strong>TOCTOU (time-of-check-to-time-of-use)</strong> race: the webhook's cluster-state fetch, <code>FetchClusterState</code>, only counted pods already <code>Running</code>. Rapid concurrent submissions could read the same stale headroom between the check and the admission decision, overcommitting a node before any of them transitioned out of <code>Pending</code>",
      "Fixed it with an in-memory reservation ledger, mutex-protected, clearing automatically once a pod is confirmed <code>Running</code> in the API server, with a 60-second timeout as a fallback in case that event is missed",
      "Verified with a concurrent stress test firing four identical jobs at the webhook simultaneously, confirmed clean across repeated runs: <strong>zero overcommits, zero <code>FailedScheduling</code> events</strong>"
    ],
    links: { repo: "https://github.com/BharathiGaneshkumar/gpu-cost-aware-bin-packing-scheduler" }
  },
  {
    id: "raft-coordinator",
    title: "Fault-Tolerant AI Inference Coordinator",
    tags: ["SYS"],
    techStack: ["Go", "Raft (custom implementation)", "gRPC", "Protocol Buffers", "Ollama", "Kubernetes (StatefulSets)", "Docker", "Bash"],
    date: "2025-08",
    dateLabel: "08 · 25",
    pinned: true,
    blurb: "A Raft consensus layer built from scratch in Go, eliminating single points of failure in AI inference request routing.",
    stamp: "assets/projects/raft-coordinator-stamp.png",
    plaque: "RAFT COORD",
    problem: "Route AI inference traffic through one coordinator and its crash takes every healthy replica behind it offline too, even though nothing is actually wrong with them. Run two coordinators to avoid that and you've traded one failure mode for a worse one: nothing stops both from believing they're the active leader at the same time and routing conflicting traffic to the same replicas.",
    approach: [
      "Implemented Raft consensus from scratch in Go, not from a library: leader election, log replication, PreVote, and term-based safety rules, across a 3-node coordinator cluster communicating over gRPC",
      "Started with an in-process channel-based transport to prove the state machine correct, then replaced it with real gRPC networking over Protocol Buffers behind a Transport interface, keeping the consensus logic decoupled from the transport underneath it",
      "Layered AI inference routing on top of that consensus core: the elected leader performs health-tracked, least-loaded balancing across 3 containerized Ollama-served LLM replicas",
      "Containerized and deployed the full system on Kubernetes using StatefulSets for stable peer identity across restarts, with one-script automation handling image builds, cluster loading, and rollout",
      "Built a live dashboard and chat UI on top, tracing leader elections, term changes, and replica routing decisions in real time"
    ],
    result: [
      "Achieved <strong>sub-1-second automatic leader failover</strong>, verified by killing the active leader mid-load and confirming a new one was elected without dropping in-flight routing",
      "Fixed <strong>5 concurrency and correctness bugs</strong> during development: a concurrent map write panic on next-index and match-index tracking, a mutex deadlock where a demoted leader tried to reacquire a lock it already held, a stale-restart gap fixed with JSON persistence of term and vote state, a lifecycle bug where a demoted leader exited the process instead of looping back as a follower, and a re-election storm under concurrent load",
      "The re-election storm was the hardest of the five. Nodes were triggering unnecessary elections under load, risking exactly the split-brain scenario the whole project exists to prevent. Fixed it by implementing <strong>PreVote</strong>, where a node checks whether it could actually win an election before incrementing its term and forcing one, which stopped the storm without weakening Raft's safety guarantees"
    ],
    links: { repo: "https://github.com/BharathiGaneshkumar/fault-tolerant-ai-inference-coordinator" }
  },
  {
    id: "n-body-sim",
    title: "N-Body Gravitational Simulation",
    tags: ["HPC"],
    techStack: ["C++", "CUDA", "OpenMP", "Nsight Compute", "Python (matplotlib)", "Bash"],
    date: "2026-02",
    dateLabel: "02 · 26",
    pinned: false,
    blurb: "A GPU-accelerated N-body gravitational simulator comparing sequential, OpenMP, and CUDA implementations, reaching over 100x speedup on a laptop GPU.",
    stamp: "assets/projects/n-body-sim-stamp.png",
    plaque: "N-BODY SIM",
    problem: "N-body gravitational simulation calculates the pull every particle exerts on every other particle, at every timestep. That's O(N²) work per step, and it grows fast enough that a sequential CPU implementation becomes impractical well before particle counts get interesting. Each particle's force calculation only depends on the other particles' current positions, not on any other calculation happening at the same time, which makes the whole problem embarrassingly parallel and a natural fit for GPU acceleration.",
    approach: [
      "Built three versions of the same simulation, keeping the physics identical across all three so runtime is the only variable: a sequential C++ baseline, a multi-threaded OpenMP implementation, and a CUDA implementation",
      "Optimized the CUDA kernel with shared memory tiling, loading particle data into fast on-chip shared memory in tiles instead of repeatedly hitting global memory for every pairwise force calculation",
      "Used single-precision floats in the CUDA version for performance on a consumer GPU, and tracked energy conservation across all three implementations to confirm parallelization wasn't quietly breaking the physics",
      "Benchmarked across particle counts from 500 to 10,000, sweeping thread counts for both OpenMP and CUDA to find the best configuration at each scale, on an RTX 5050 laptop GPU",
      "Ran a 10,000-particle galaxy collision simulation as a real-world demonstration on top of the benchmark suite, showing the CUDA implementation holding up on a scenario closer to actual astrophysical use than a synthetic particle sweep"
    ],
    result: [
      "At N=10,000, the CUDA implementation reached <strong>765.6 GFLOPS</strong> against <strong>6.6 GFLOPS</strong> for the sequential baseline, a <strong>116.5x speedup</strong>, with the gap widening as particle count grew rather than narrowing",
      "OpenMP with 12 threads reached <strong>4.7x speedup</strong> over sequential at the same particle count, the expected ceiling for a CPU with that many physical threads",
      "Profiled the CUDA kernel with Nsight Compute and found it <strong>memory-bound despite over 90% compute utilization</strong>, meaning memory bandwidth, not raw compute, was the actual ceiling on a gaming-class GPU",
      "Energy drift stayed within <strong>1e-8%</strong> under single precision, confirming the speedup didn't come at the cost of physical accuracy"
    ],
    links: { repo: "https://github.com/BharathiGaneshkumar/nbodyGravitationalSimulation" }
  },
  {
    id: "trope-chemistry",
    title: "Trope Chemistry",
    tags: ["AI"],
    techStack: ["PyTorch", "PyTorch Geometric", "GraphSAGE", "GAT", "GIN", "BERT+GAT", "Sentence-BERT", "NetworkX", "python-louvain", "scikit-learn", "pandas"],
    date: "2026-06",
    dateLabel: "06 · 26",
    pinned: false,
    blurb: "A graph neural network for fanfiction engagement prediction, benchmarked in an ablation study against 6 other models to test whether trope structure actually beats plain text.",
    stamp: "assets/projects/trope-chemistry-stamp.png",
    plaque: "TROPE CHEM",
    problem: "Most engagement prediction treats a story's tags as independent features. That misses something readers already know intuitively, that certain trope combinations drive engagement in ways individual tropes don't, the same way certain flavor pairings work better together than either flavor alone. Predicting kudos-to-hits ratio for a fanfiction work meant testing whether modeling tropes as a connected graph actually captures that, or whether it's just a more complicated way of saying nothing new.",
    approach: [
      "Built a co-occurrence graph from <strong>33,120 filtered AO3 works</strong> and <strong>421 tropes</strong>, where an edge between two tropes means fics that used both, weighted by how often that pairing occurred",
      "The raw graph came out too dense to train on. At <strong>57,529 edges</strong> the density sat at <strong>0.65</strong>, so densely connected that GNNs couldn't learn meaningful structure from it and every node looked roughly like every other node",
      "Pruned edges below a co-occurrence weight of 50, cutting the graph down to <strong>254 nodes and 913 edges, density 0.028</strong>. That pruning step, effectively an ablation over the edge-weight threshold, is what turned this from a stalled experiment into one that actually worked",
      "Ran Louvain community detection on the pruned graph and found <strong>11 distinct narrative communities</strong>, clusters of tropes that tend to appear together",
      "Compared 7 models on the exact same 29,762-fic subset for a fair comparison: a mean baseline, TF-IDF with Ridge Regression, a PyTorch MLP, GIN, GAT, a BERT+GAT hybrid using Sentence-BERT embeddings of trope names as node features, and GraphSAGE"
    ],
    result: [
      "<strong>GraphSAGE</strong> came out on top with val R² of <strong>0.112</strong>, ahead of the MLP at 0.107, TF-IDF and Ridge at 0.071, BERT+GAT at 0.084, GAT at 0.075, GIN at 0.025, and the mean baseline at effectively 0",
      "The more interesting finding was why GraphSAGE won. Its mean-aggregation approach outperformed GAT's attention mechanism on this graph, because neighboring tropes in a co-occurrence graph tend to have similar feature vectors to begin with, which causes attention weights to collapse toward uniform and lose their advantage over simple averaging",
      "BERT+GAT, despite injecting semantic meaning from the trope names themselves through <strong>384-dimensional embeddings</strong>, needed over <strong>1,100 epochs</strong> to converge and still landed behind plain GraphSAGE, suggesting the graph's structure carried more signal than the tropes' literal wording did",
      "These R² values sit in a range that would look weak on a leaderboard task, but that's expected for social and behavioral prediction, where even strong published models rarely explain more than 10 to 15% of variance. The actual result here is the controlled comparison itself: graph structure alone gave a consistent, real signal, ahead of both a text-only baseline and a semantically-informed hybrid"
    ],
    links: { repo: "https://github.com/BharathiGaneshkumar/trope-chemistry" }
  },
  {
    id: "causal-ai",
    title: "Causal AI — Student Success",
    tags: ["AI"],
    techStack: ["Python", "causal-learn (PC, GES, NOTEARS)", "DoWhy", "scikit-learn", "Graphviz", "pandas"],
    date: "2025-09",
    dateLabel: "09 · 25",
    pinned: false,
    blurb: "A causal discovery project separating what actually drives student grades from what only correlates with them, quantified with real treatment effects.",
    stamp: "assets/projects/causal-ai-stamp.png",
    plaque: "CAUSAL AI",
    problem: "Correlation is not causation, and treating the two as interchangeable can waste real resources in domains where the mistake compounds. In the UCI Student Performance dataset, prior-term grades correlate with final grades at r = 0.92. A school reading that correlation as causal would pour intervention resources into managing prior grades themselves, which fixes nothing, since a grade can't cause the next grade any more than a fever causes the next day's fever. What actually needs identifying are the behavioral factors underneath, the ones a school could genuinely act on, but prior grades sit so close to the outcome that they drown that signal out entirely.",
    approach: [
      "Ran three causal discovery algorithms on the same dataset to see whether they'd agree on structure: <strong>PC</strong>, which tests conditional independence between variables to figure out which relationships are real, <strong>GES</strong>, which is score-based and searches over different graph structures to find the best fit, and <strong>NOTEARS</strong>, which reformulates the whole discovery problem as continuous optimization so it can use gradient descent instead of discrete search",
      "Used a dual-model approach, running discovery on the full 33-feature set and separately on a root-cause set with prior grades removed, specifically to unmask the behavioral factors that prior grades were otherwise masking",
      "Took the causal structure each algorithm found and fed it into <strong>DoWhy</strong> to quantify actual effect sizes, using backdoor adjustment to control for confounders that influence both the treatment and the outcome, rather than reporting raw correlations dressed up as causal claims"
    ],
    result: [
      "<strong>2 of the 3 algorithms independently agreed</strong> on the same two high-confidence causal factors: study time and weekday alcohol consumption, agreement across independently-designed algorithms being the strongest signal that a finding is real rather than an artifact of one method's assumptions",
      "Quantified the actual size of each effect via backdoor adjustment: one additional unit of weekly study time raised final grade by <strong>+0.88 points</strong>, one additional unit of weekday alcohol consumption lowered it by <strong>−0.62 points</strong>",
      "The dual-model comparison confirmed the masking problem was real. Root causes that were invisible in the full-feature model, buried under the 0.92 correlation with prior grades, became identifiable once prior grades were removed from the graph entirely"
    ],
    links: { repo: "https://github.com/BharathiGaneshkumar/studentPerformanceCausalAI" }
  },
  {
    id: "floodguard",
    title: "FloodGuard AI",
    tags: ["AI"],
    techStack: ["Python", "FastAPI", "Redis", "asyncio", "Qwen (DashScope API)", "MCP (custom audit server)", "React", "WebSocket", "Azure"],
    date: "2026-07",
    dateLabel: "07 · 26",
    pinned: false,
    blurb: "A simulated edge sensor network for flood early warning across 3 zones, staying operational through a 4-state graceful degradation ladder when the cloud drops.",
    stamp: "assets/projects/floodguard-stamp.png",
    plaque: "FLOODGUARD",
    problem: "A flood early-warning system that depends entirely on the cloud has its timing backwards. Storms are exactly when connectivity is most likely to fail, and that's the exact moment a warning matters most. If the system goes silent the instant its cloud connection does, it isn't a warning system at all, it just plays one during good weather.",
    approach: [
      "Simulated sensor agents acting as edge devices across <strong>3 zones</strong>, each with different sensor types and risk profiles: Zone A upstream with rainfall and soil saturation, Zone B riverside with river level, drain flow, and soil saturation, and Zone C low-lying and drain-dependent",
      "Built for the <strong>Qwen Cloud, Global AI Hackathon</strong>, under the EdgeAgent track, where the entire premise is that intelligence has to survive on the edge device itself, not just in the cloud",
      "An edge agent sits between the sensors and a cloud coordinator, owning a <strong>4-state degradation ladder</strong> rather than a single fallback flag: connected, degraded, offline, and extended outage, each state widening how conservative the local decision-making gets",
      "When connected, multi-signal readings get forwarded to a FastAPI coordinator that calls <strong>Qwen</strong> for risk fusion across co-occurring signals, using a forced tool-call schema so the model's response is always structured and parseable rather than free-text that might need cleanup",
      "When the cloud degrades or drops entirely, the edge agent doesn't just go quiet. It falls back through cached decisions matched by signal similarity, then to a small locally-trained ML model doing the risk classification itself, and if even that model fails to load, drops one level further to hand-written weighted rules, a fallback with its own fallback",
      "The coordinator also exposes its own audit log as a custom <strong>MCP server</strong> Qwen can query directly, letting it check a zone's recent decision history before assessing new readings rather than reasoning from a single snapshot in isolation",
      "Deployed the coordinator on an Azure VM after an initial attempt on Alibaba Cloud was blocked by mainland China identity verification requirements for non-China regions"
    ],
    result: [
      "Verified the full degradation path live: toggled the network off mid-demo and watched a flagged zone step down through the state ladder in real time, landing on a locally-generated warning with no cloud or Qwen call involved once the cloud state reached offline",
      "On recovery, the edge agent sends a catch-up batch to the coordinator so its Redis-backed zone memory never goes stale from the time spent offline",
      "Deployed and reachable from the public internet, with the coordinator, Qwen risk fusion, and the custom MCP audit tool all verified against the live endpoint rather than only tested locally"
    ],
    links: { repo: "https://github.com/swetha7502/flood-resilience-qwen" }
  },
  {
    id: "ooo-agent",
    title: "OOO Negotiation Agent",
    tags: ["AI"],
    techStack: ["Node.js", "Slack Bolt", "Groq", "Slack Real-Time Search API"],
    date: "2026-06",
    dateLabel: "06 · 26",
    pinned: false,
    blurb: "A Slack bot where two independent agents negotiate task handoffs when someone goes out of office, instead of one bot reassigning work top-down.",
    stamp: "assets/projects/ooo-agent-stamp.png",
    plaque: "OOO AGENT",
    problem: "When someone goes OOO or gets suddenly overloaded, their open tasks either sit untouched or get dumped on whoever happens to be free, with nobody actually checking whether that person has room for it. A single bot that reassigns tasks unilaterally solves the visibility problem but not the fairness one, since it has no real stake in either side of the handoff.",
    approach: [
      "Built for the <strong>Slack Agent Builder Challenge</strong>, New Slack Agent track, as a Slack Bolt app",
      "Modeled the handoff as a negotiation between two independent agents rather than one bot making a unilateral call. The OOO person's agent proposes their open tasks, the candidate teammate's agent decides whether to accept based on that teammate's own actual workload, and a human still confirms the final reassignment with an emoji reaction before anything moves",
      "Used <strong>Groq's LLM</strong> for message classification and extraction, detecting OOO or overload signals in ordinary Slack messages and pulling structured tasks out of them, so someone doesn't have to invoke a slash command correctly to trigger the flow",
      "Built candidate selection on <strong>Slack's Real-Time Search API</strong>, scoring teammates by workload and overlap with their existing tasks so the agent proposing a handoff isn't guessing at who's actually free",
      "Added cooldown logic to prevent the same negotiation from firing twice in quick succession, and a concurrency fix so two negotiations can't both land on the same candidate at once without one of them correctly escalating instead of silently double-booking",
      "Gave the returning OOO person a way to catch up fast: mentioning the bot with a question searches the live workspace and returns matching messages with direct links, instead of making them scroll back through everything they missed"
    ],
    result: [
      "Full negotiation flow verified end to end: proposal, accept or decline, human confirmation via reaction, and automatic escalation to a human when nobody accepts within the window",
      "The concurrent-negotiation edge case, two candidates both being offered overlapping tasks at once, is covered by an <strong>automated test</strong> rather than left as an untested race, confirming it escalates correctly instead of double-booking",
      "Deployed live with a working health-check endpoint keeping the free-tier hosting instance alive, verified reachable and functional in a real Slack workspace, not just locally"
    ],
    links: { repo: "https://github.com/swetha7502/ooo-agent" }
  },
  {
    id: "conflictmind",
    title: "ConflictMind",
    tags: ["AI"],
    techStack: ["Python", "Flask", "Google ADK", "Gemini 2.5 Flash", "Vertex AI", "MongoDB Atlas (vector search)", "MCP", "Docker", "Google Cloud Run"],
    date: "2026-06",
    dateLabel: "06 · 26",
    pinned: false,
    blurb: "An AI agent with persistent memory that debates its own contradictory memories about you before resolving them, instead of silently overwriting one with the other.",
    stamp: "assets/projects/conflictmind-stamp.png",
    plaque: "CONFLICTMIND",
    problem: "Most AI memory systems handle contradiction by just overwriting the old fact with the new one. That's a quiet way to lose information, since the older memory might have been the correct one, or might still be relevant in a context the newer one doesn't cover. Deciding which memory should actually survive a contradiction is a judgment call, not something that should happen silently.",
    approach: [
      "Built for the <strong>Google × MongoDB Hackathon</strong>, meeting all four hard requirements: Google ADK integration, a MongoDB MCP server, Vertex AI, and MongoDB Atlas vector search",
      "Every message a user sends gets summarized and written to MongoDB Atlas as a memory, called by a Google ADK agent running Gemini 2.5 Flash as a function tool, not a hardcoded write path",
      "When a new memory comes in, vector search finds existing memories with cosine similarity above <strong>0.85</strong> against it, then a separate LLM classification call filters that shortlist down to genuine contradictions, so two similar but compatible memories don't get flagged as conflicting by mistake",
      "Real conflicts go through a structured <strong>three-step debate</strong> rather than a single resolution call. Memory A argues for itself citing its own recency, confidence score, and how often it's actually been recalled and reinforced. Memory B does the same. A separate judge call weighs both arguments and writes a single resolved memory, with the full transcript of all three calls stored alongside the result rather than discarded once a decision is made",
      "Wired the MongoDB connection into the agent as a real <strong>MCP server</strong> rather than a Python function wrapper, installed globally at Docker build time instead of spawned at runtime, specifically to avoid cold-start failures once deployed",
      "Deployed on <strong>Google Cloud Run</strong>, with a startup script that brings the ADK agent server up first, waits for it to report healthy, then starts the Flask backend on the port Cloud Run actually expects"
    ],
    result: [
      "Deployed live and publicly reachable, with the full memory graph, conflict history, and per-memory debate transcripts all queryable through the API rather than only visible in logs",
      "The debate transcript is written back to the database attached to the conflict pair, so a resolved memory isn't just a final answer, it carries the actual reasoning that produced it, recency versus confidence versus recall frequency, visible after the fact"
    ],
    links: { repo: "https://github.com/nitin-s17/conflictmind" }
  },
  {
    id: "dawgden",
    title: "DawgDen",
    tags: ["WEB"],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Auth0", "Prisma", "Neon PostgreSQL", "Gemini API (Gemma 4)", "ElevenLabs"],
    date: "2025-09",
    dateLabel: "09 · 25",
    pinned: false,
    blurb: "A student housing platform that reads a lease for red flags before you sign it and makes a landlord's reputation impossible to quietly erase.",
    stamp: "assets/projects/dawgden-stamp.png",
    plaque: "DAWGDEN",
    problem: "Moving to a new country for university is hard enough on its own. International students at UW Bothell often sign their first US lease without any real way to tell a standard clause from a predatory one, and a landlord's reputation only ever travels as far as word of mouth in a WhatsApp group chain, easy to lose and impossible to verify.",
    approach: [
      "Built for <strong>UWB Hacks 2025</strong>, Cities and Societies track, as a full Next.js app with two distinct user roles, student and landlord, each gated to different features through role-enriched auth sessions",
      "Lease PDFs get parsed with pdf-parse and sent to <strong>Gemma 4</strong> for a structured breakdown of red flags, each one tagged high, medium, or low severity with a plain-English explanation, so a student can see exactly what clause is a problem and why, not just that something in the document looks risky",
      "Every landlord profile computes a trust score from three weighted signals, average rating, deposit return rate, and maintenance rating, then a Gemma 4 summary condenses all of that landlord's reviews into a few objective sentences highlighting real behavioral patterns rather than just showing a number",
      "Added a Reddit-style community hub and a student marketplace for furniture and belongings, aimed at replacing the ad hoc WhatsApp chains students currently rely on to sell things before flying home",
      "Built a hands-free voice assistant with the <strong>ElevenLabs</strong> React SDK so students navigating a new platform in a new country don't need to master a new interface on top of everything else, and gated the AI features by role through Auth0 sessions so landlords and students see different capabilities"
    ],
    result: [
      "Won <strong>Best UI</strong> at the hackathon, and built to meet 3 MLH prize track requirements: Gemma 4 for lease red-flag detection and landlord trust summaries, ElevenLabs for the voice assistant, and Auth0 for role-gated AI feature access",
      "Shipped as a genuinely complete system rather than a single demoable feature, spanning lease analysis, landlord trust scoring, a community forum, and a marketplace, all live at deployment rather than partially stubbed out"
    ],
    links: { repo: "https://github.com/BharathiGaneshkumar/DawgDen", live: "https://dawg-den.vercel.app/" }
  }
];

function placeholderStampSVG() {
  // landscape viewBox matching real generated stamp dimensions (~16:9) —
  // shown only if a project's stamp image fails to load
  return `<svg viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    <rect x="150" y="55" width="90" height="130" fill="#a8b8c4" stroke="#2b2926" stroke-width="2"/>
    <polygon points="150,55 175,30 265,30 240,55" fill="#d4c4a0" stroke="#2b2926" stroke-width="2"/>
    <polygon points="240,55 265,30 265,160 240,185" fill="#c17a52" stroke="#2b2926" stroke-width="2"/>
  </svg>`;
}

function projectStampHTML(p) {
  return `<div class="stamp-frame">
    <img src="${p.stamp}" alt="${p.title} stamp illustration"
         onerror="this.parentElement.innerHTML=placeholderStampSVG();" />
  </div>`;
}

function projectCardHTML(p, i) {
  const techChips = p.techStack.map((t) => `<span class="tech-chip">${t}</span>`).join("");
  return `
    <div class="project-card" data-id="${p.id}" data-tags="${p.tags.join(",")}" data-date="${p.date}" style="animation-delay:${i * 70}ms">
      ${p.pinned ? `<svg class="pin-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#c17a52" stroke="#2b2926" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="#f7f4ec"/></svg>` : ""}
      ${projectStampHTML(p)}
      <div class="card-info">
        <span class="tag-pill tag-${p.tags[0]}">${p.tags[0]}</span>
        <h3>${p.title}</h3>
        <p class="card-blurb">${p.blurb}</p>
        <div class="tech-row">${techChips}</div>
        <div class="card-meta-row">
          <span>${p.dateLabel}</span>
          <span>${p.links.repo ? `<a href="${p.links.repo}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Repo →</a>` : ""}${p.links.live ? `<a href="${p.links.live}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Live →</a>` : ""}</span>
        </div>
      </div>
    </div>`;
}

let projectsRendered = false;
let projectSortOrder = "desc"; // desc = newest first
let projectSearchTerm = "";
let projectActiveFilter = "all";

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  const sorted = [...PROJECTS].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return projectSortOrder === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  });

  grid.innerHTML = sorted.map((p, i) => projectCardHTML(p, i)).join("");

  // filter chips — derived from the unique tags actually present across
  // PROJECTS, so a brand-new tag on a future project gets a chip here
  // automatically with no code change
  const allTags = [...new Set(PROJECTS.flatMap((p) => p.tags))];
  const chips = ["all", ...allTags];
  const filterChips = document.getElementById("filterChips");
  if (filterChips) {
    filterChips.innerHTML = chips
      .map((t) => `<button class="filter-chip ${t === projectActiveFilter ? "active" : ""}" data-filter="${t}">${t}</button>`)
      .join("");
    filterChips.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        projectActiveFilter = chip.dataset.filter;
        applyProjectFilters();
      });
    });
  }

  grid.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("click", () => openProjectDialog(card.dataset.id));
  });

  // stagger the stamp-in animation in on first render only
  requestAnimationFrame(() => {
    grid.querySelectorAll(".project-card").forEach((card) => card.classList.add("card-visible"));
  });

  applyProjectFilters();
  equalizeBlurbHeights();
}

// Blurbs are never truncated — instead, once every card has rendered,
// measure each blurb's natural (full-text) height and set them all to
// match the tallest one. That keeps every card's tech-stack row and
// footer starting at the same vertical position without ever cutting
// off a shorter or longer project's description. Re-run on resize since
// text reflows at different widths.
function equalizeBlurbHeights() {
  const blurbs = Array.from(document.querySelectorAll(".card-blurb"));
  if (!blurbs.length) return;
  blurbs.forEach((b) => (b.style.minHeight = "0px"));
  const tallest = Math.max(...blurbs.map((b) => b.getBoundingClientRect().height));
  blurbs.forEach((b) => (b.style.minHeight = `${tallest}px`));
}

let blurbResizeTimer = null;
window.addEventListener("resize", () => {
  if (!projectsRendered) return;
  window.clearTimeout(blurbResizeTimer);
  blurbResizeTimer = window.setTimeout(equalizeBlurbHeights, 150);
});

function applyProjectFilters() {
  const cards = document.querySelectorAll(".project-card");
  const term = projectSearchTerm.trim().toLowerCase();
  let count = 0;
  cards.forEach((card) => {
    const tags = card.dataset.tags.split(",");
    const matchesFilter = projectActiveFilter === "all" || tags.includes(projectActiveFilter);
    const matchesSearch = !term || card.textContent.toLowerCase().includes(term);
    const show = matchesFilter && matchesSearch;
    card.classList.toggle("filtered-out", !show);
    if (show) count++;
  });
  const countEl = document.getElementById("projectsCount");
  if (countEl) countEl.textContent = `showing ${count} project${count !== 1 ? "s" : ""}`;
}

function openProjectDialog(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;

  const approachList = p.approach.map((line) => `<li>${line}</li>`).join("");
  const resultList = p.result.map((line) => `<li>${line}</li>`).join("");
  const linksHTML = [
    p.links.repo ? `<a href="${p.links.repo}" target="_blank" rel="noopener">Repo →</a>` : "",
    p.links.live ? `<a href="${p.links.live}" target="_blank" rel="noopener">Live site →</a>` : "",
  ].filter(Boolean).join("");

  // Locked order: title -> tag -> tech stack -> links -> written sections
  document.getElementById("projDialogContent").innerHTML = `
    <h2 class="proj-dialog-title">${p.title}</h2>
    <div class="proj-dialog-tag"><span class="tag-pill tag-${p.tags[0]}">${p.tags[0]}</span></div>
    <div class="proj-dialog-techrow">${p.techStack.map((t) => `<span class="tech-chip">${t}</span>`).join("")}</div>
    ${linksHTML ? `<div class="proj-dialog-links">${linksHTML}</div>` : ""}
    <p class="card-section-head">The problem</p>
    <p>${p.problem}</p>
    <p class="card-section-head">The approach</p>
    <ul class="proj-dialog-bullets">${approachList}</ul>
    <p class="card-section-head">The result</p>
    <ul class="proj-dialog-bullets">${resultList}</ul>
  `;
  document.getElementById("projOverlay").classList.add("proj-overlay-visible");
  document.getElementById("projDialog").classList.add("proj-dialog-open");
  document.getElementById("projDialog").scrollTop = 0;
}

function closeProjectDialog() {
  document.getElementById("projOverlay")?.classList.remove("proj-overlay-visible");
  document.getElementById("projDialog")?.classList.remove("proj-dialog-open");
}

(function setupProjectsScene() {
  const searchInput = document.getElementById("projectSearch");
  searchInput?.addEventListener("input", (e) => {
    projectSearchTerm = e.target.value;
    applyProjectFilters();
  });

  const sortToggle = document.getElementById("sortToggle");
  sortToggle?.addEventListener("click", () => {
    projectSortOrder = projectSortOrder === "desc" ? "asc" : "desc";
    sortToggle.textContent = `sort: ${projectSortOrder === "desc" ? "newest" : "oldest"} ↕`;
    renderProjects();
  });

  document.getElementById("projOverlay")?.addEventListener("click", closeProjectDialog);
  document.getElementById("projDialogClose")?.addEventListener("click", closeProjectDialog);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectDialog();
  });
})();

// Render once, the first time the Projects scene is actually visited —
// hooking into the existing SCENE_REVEAL_RUNNERS pattern used by
// education/research so this follows the same lazy, once-per-load model.
SCENE_REVEAL_RUNNERS.projects = function (sceneEl, instant) {
  if (!projectsRendered) {
    renderProjects();
    projectsRendered = true;
  }
};

// ============================================================
// CONTACT ID CARD
// ============================================================
// Opens from either the landing scene's phone-booth hotspot, or the
// nav's "Contact" pill from ANY scene — no camera movement for the nav
// trigger, it just opens on top of whatever's currently showing.

(function setupContactCard() {
  const overlay = document.getElementById("idOverlay");
  const clipWrap = document.getElementById("idClipWrap");
  const card = document.getElementById("idCard");
  const closeBtn = document.getElementById("idCardClose");
  const navBtn = document.getElementById("navContactBtn");
  const hotspot = document.getElementById("contactHotspot");
  if (!overlay || !card) return;

  function openCard() {
    overlay.classList.add("id-visible");
    clipWrap?.classList.add("id-visible");
    card.classList.add("id-visible");
    overlay.setAttribute("aria-hidden", "false");
    card.setAttribute("aria-hidden", "false");
  }
  function closeCard() {
    overlay.classList.remove("id-visible");
    clipWrap?.classList.remove("id-visible");
    card.classList.remove("id-visible");
    overlay.setAttribute("aria-hidden", "true");
    card.setAttribute("aria-hidden", "true");
  }

  // Nav "Contact" pill: opens the card directly, no scene change —
  // overrides the generic goToScene() nav-link handler set up earlier.
  navBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    openCard();
  });

  // Landing scene's phone-booth hotspot: same card, different entry
  // point — overrides its own generic goToScene() click handler too.
  hotspot?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    openCard();
  });

  overlay.addEventListener("click", closeCard);
  closeBtn?.addEventListener("click", closeCard);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCard();
  });
})();
// ---------- Static hotspot labels ----------
const hotspotLabelsContainer = document.getElementById("hotspotLabels");
if (hotspotLabelsContainer) {
  hotspots.forEach((hotspot) => {
    const label = document.createElement("div");
    label.className = "hotspot-static-label";
    label.textContent = hotspot.dataset.label;
    label.style.setProperty("--lx", hotspot.dataset.cx);
    label.style.setProperty("--ly", hotspot.dataset.cy);
    hotspotLabelsContainer.appendChild(label);
    hotspot._labelEl = label;
    hotspot.addEventListener("mouseenter", () => label.classList.add("label-hot"));
    hotspot.addEventListener("mouseleave", () => label.classList.remove("label-hot"));
  });
}

// ---------- Rotate-to-landscape prompt ----------
const rotateOverlay = document.getElementById("rotateOverlay");
function checkOrientation() {
  if (!rotateOverlay) return;
  const isPhoneSized = window.innerWidth <= 900;
  const isPortrait = window.innerHeight > window.innerWidth;
  rotateOverlay.classList.toggle("rotate-visible", isPhoneSized && isPortrait);
}
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
checkOrientation();

// ---------- First-visit tour ----------
function runFirstVisitTour() {
  // if (localStorage.getItem("tourShown")) return;
  const pointer = document.getElementById("tourPointer");
  const caption = document.getElementById("tourCaption");
  if (!pointer || !caption) return;

  const stops = [
    { target: "education", text: "Tap the buildings to explore" },
    { target: "projects", text: "Every scene works the same way" },
  ];

  function moveTo(hotspot, text) {
    const rect = hotspot.getBoundingClientRect();
    const zone = ZONES[hotspot.dataset.target];
    const cx = rect.left + (parseFloat(zone.cx) / 100) * rect.width;
    const cy = rect.top + (parseFloat(zone.cy) / 100) * rect.height;
    pointer.style.left = `${cx}px`;
    pointer.style.top = `${cy}px`;
    caption.style.left = `${cx}px`;
    caption.style.top = `${cy}px`;
    caption.textContent = text;
  }

  let i = 0;
  function step() {
    const stop = stops[i];
    const hotspot = hotspots.find((h) => h.dataset.target === stop.target);
    if (!hotspot) return finish();
    moveTo(hotspot, stop.text);
    requestAnimationFrame(() => {
      pointer.classList.add("tour-visible");
      caption.classList.add("tour-visible");
    });
    i++;
    if (i < stops.length) {
      window.setTimeout(step, 2200);
    } else {
      window.setTimeout(finish, 2200);
    }
  }

  function finish() {
    pointer.classList.remove("tour-visible");
    caption.classList.remove("tour-visible");
    // localStorage.setItem("tourShown", "1");
  }

  window.setTimeout(step, 1200);
}

// Wait for rotation before touring on phones; run immediately elsewhere.
function maybeStartTour() {
  if (currentScene !== "landing") return;
  const isPhoneSized = window.innerWidth <= 900;
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isPhoneSized && isPortrait) return; // wait for rotation
  runFirstVisitTour();
}
window.setTimeout(maybeStartTour, 500);
window.addEventListener("orientationchange", () => window.setTimeout(maybeStartTour, 400));
window.addEventListener("resize", () => window.setTimeout(maybeStartTour, 400));
// ---------- Idle cue: mark Experience/Research triggers after a short delay ----------
window.setTimeout(() => {
  document.querySelectorAll("#roadStage button[data-stop]").forEach((el) => el.classList.add("idle-cue"));
  document.querySelectorAll(".research-callout[data-exhibit]").forEach((el) => el.classList.add("idle-cue"));
}, 1600);

// ---------- Scene tours (Experience / Research / Projects) ----------
// Reuses the same #tourPointer / #tourCaption elements as the landing tour.
// Each scene's tour fires once per page load, the moment you first land on it.
const SCENE_TOURS = {
  experience: [{ selector: '.stop-callout[data-stop="sap"]', text: "Tap any building for details" }],
  research: [{ selector: '.research-callout[data-exhibit="massc"]', text: "Tap an exhibit to read more" }],
  projects: [{ selector: ".project-card", text: "Tap a card for the full story" }],
};
const tourPlayed = new Set();

// Some scenes (Research, Experience) lay out their clickable elements
// relative to one large background image. If that image hasn't finished
// loading yet, the page's height is still wrong, so any scroll/position
// math run before it loads targets the pre-load layout — then the image
// pops in, the page grows, and the tour ends up stranded above its target.
const SCENE_TOUR_WAIT_IMG = {
  research: ".gallery-img",
  experience: ".road-img",
};

function runSceneTour(name) {
  if (tourPlayed.has(name)) return;
  const steps = SCENE_TOURS[name];
  const pointer = document.getElementById("tourPointer");
  const caption = document.getElementById("tourCaption");
  if (!steps || !pointer || !caption) return;

  function moveTo(el, text) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    pointer.style.left = `${cx}px`;
    pointer.style.top = `${cy}px`;
    caption.style.left = `${cx}px`;
    caption.style.top = `${cy}px`;
    caption.textContent = text;
  }

  function isInView(el) {
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= window.innerHeight;
  }

  let i = 0;
  function step() {
    const el = document.querySelector(steps[i].selector);
    if (!el) return finish();

    const showPointer = () => {
      moveTo(el, steps[i].text);
      requestAnimationFrame(() => {
        pointer.classList.add("tour-visible");
        caption.classList.add("tour-visible");
      });
      i++;
      window.setTimeout(i < steps.length ? step : finish, 2200);
    };

    if (isInView(el)) {
      showPointer();
    } else {
      pointer.classList.remove("tour-visible");
      caption.classList.remove("tour-visible");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(showPointer, 650);
    }
  }
  function finish() {
    pointer.classList.remove("tour-visible");
    caption.classList.remove("tour-visible");
    tourPlayed.add(name);
  }

  function start() {
    window.setTimeout(step, 500);
  }

  const waitSelector = SCENE_TOUR_WAIT_IMG[name];
  const waitImg = waitSelector ? document.querySelector(waitSelector) : null;
  if (waitImg && !waitImg.complete) {
    waitImg.addEventListener("load", start, { once: true });
    // safety net in case the load event is somehow missed
    window.setTimeout(start, 2500);
  } else {
    start();
  }
}
// ---------- Landing hero loading screen ----------
const heroBgImg = document.querySelector(".bg-img");
if (heroBgImg) {
  document.body.classList.add("site-loading");
  if (heroBgImg.complete) {
    document.body.classList.remove("site-loading");
  } else {
    heroBgImg.addEventListener("load", () => document.body.classList.remove("site-loading"), { once: true });
    // safety net in case load event is missed
    window.setTimeout(() => document.body.classList.remove("site-loading"), 4000);
  }
}

// ---------- Shimmer placeholder for lazy-loaded images ----------
// Wraps each lazy image in a positioned container so the shimmer
// background can sit exactly behind it, then fades the shimmer out
// and the image in once it's actually loaded.
document.querySelectorAll("img[loading='lazy']").forEach((img) => {
  const wrap = document.createElement("span");
  wrap.className = "img-shimmer-wrap shimmer-active";
  img.parentNode.insertBefore(wrap, img);
  wrap.appendChild(img);
  img.classList.add("img-loading");

  function reveal() {
    img.classList.remove("img-loading");
    wrap.classList.remove("shimmer-active");
  }
  if (img.complete) {
    reveal();
  } else {
    img.addEventListener("load", reveal, { once: true });
    img.addEventListener("error", reveal, { once: true });
  }
});

// ---------- Same shimmer treatment for dynamically-created project stamps ----------
// projectStampHTML() generates <img> tags via innerHTML, so they exist
// outside the querySelectorAll pass above (which runs once on page load,
// before Projects has rendered). Hook into the existing render function instead.
const _origProjectStampHTML = projectStampHTML;
projectStampHTML = function (p) {
  return `<div class="stamp-frame img-shimmer-wrap shimmer-active">
    <img class="img-loading" src="${p.stamp}" alt="${p.title} stamp illustration"
         onload="this.classList.remove('img-loading'); this.parentElement.classList.remove('shimmer-active');"
         onerror="this.parentElement.innerHTML=placeholderStampSVG(); this.parentElement.classList.remove('shimmer-active');" />
  </div>`;
};
// First tap anywhere on the page requests fullscreen (must be a real user
// gesture — browsers block fullscreen requests otherwise). Fires once,
// then gets out of the way so it never interferes with hotspot/nav taps.
let fullscreenTried = false;
document.addEventListener(
  "click",
  () => {
    if (fullscreenTried || document.fullscreenElement) return;
    fullscreenTried = true;
    document.documentElement.requestFullscreen?.().catch(() => {
      // silently ignore if the browser refuses — not critical
    });
  },
  { once: true }
);