const nav = document.getElementById('mainNav');
const heroStage = document.getElementById('heroStage');
const heroVideo = document.getElementById('heroVideo');
const heroContent = document.getElementById('heroContent');
const modeToggle = document.getElementById('modeToggle');
const goldenBloom = document.getElementById('goldenBloom');

let scrollScrubEnabled = false;
let heroScrollProgress = 0;

// Toggle between smooth cinema autoplay and scroll-scrubbed playback
modeToggle.addEventListener('click', () => {
  scrollScrubEnabled = !scrollScrubEnabled;
  if (scrollScrubEnabled) {
    heroVideo.pause();
    modeToggle.textContent = 'Mode: Scroll-Scrub';
    syncVideoToScroll();
  } else {
    heroVideo.play().catch(() => {});
    modeToggle.textContent = 'Mode: Cinema Autoplay';
  }
});

function syncVideoToScroll() {
  const rect = heroStage.getBoundingClientRect();
  const scrollable = heroStage.offsetHeight - window.innerHeight;
  heroScrollProgress = Math.max(0, Math.min(1, -rect.top / scrollable));

  // Fade out hero title gracefully as user scrolls deeper into the transition
  const titleOpacity = Math.max(0, 1 - heroScrollProgress * 2.1);
  heroContent.style.opacity = titleOpacity.toFixed(3);
  heroContent.style.transform = `translateY(${(-heroScrollProgress * 38).toFixed(1)}px)`;

  // Simultaneous cinematic zoom + golden light bloom toward the dress
  const zoomScale = 1 + heroScrollProgress * 0.14;
  heroVideo.style.transform = `scale(${zoomScale.toFixed(4)})`;
  if (goldenBloom) {
    const bloomPeak = 0.22 + Math.sin(heroScrollProgress * Math.PI) * 0.55;
    goldenBloom.style.opacity = bloomPeak.toFixed(3);
  }

  if (scrollScrubEnabled && heroVideo.duration) {
    heroVideo.currentTime = heroScrollProgress * heroVideo.duration;
  }
}

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  syncVideoToScroll();
}, { passive: true });

// ============================================================
// 1. THREE.JS INTERACTIVE 3D THREAD & SILK PARTICLE STAGE
// ============================================================
function initThreeStage() {
  const canvas = document.getElementById('threeStage');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9.5);

  // Warm studio lights for the 3D golden/cream threads
  const ambient = new THREE.AmbientLight(0xf4ede0, 0.7);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0xd6bc8b, 3.2, 28);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0xfff1d6, 2.0, 24);
  rimLight.position.set(-5, -3, 4);
  scene.add(rimLight);

  // Group holding interwoven 3D thread ribbons
  const threadGroup = new THREE.Group();
  scene.add(threadGroup);

  const ribbonSpecs = [
    { radius: 2.9, ampY: 1.15, turns: 1.7, tube: 0.022, color: 0xd6bc8b, opacity: 0.58, phase: 0.0 },
    { radius: 3.4, ampY: 0.9,  turns: 2.1, tube: 0.016, color: 0xf4ede0, opacity: 0.44, phase: 2.1 },
    { radius: 2.3, ampY: 1.35, turns: 1.4, tube: 0.014, color: 0xc49e62, opacity: 0.42, phase: 4.2 },
  ];

  const ribbons = ribbonSpecs.map((spec) => {
    const pts = [];
    const segs = 90;
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      const angle = u * Math.PI * 2 * spec.turns + spec.phase;
      const x = Math.cos(angle) * spec.radius;
      const y = (u - 0.5) * 4.5 + Math.sin(angle * 1.5) * spec.ampY;
      const z = Math.sin(angle) * spec.radius * 0.75;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 140, spec.tube, 8, false);
    const mat = new THREE.MeshStandardMaterial({
      color: spec.color,
      metalness: 0.65,
      roughness: 0.28,
      transparent: true,
      opacity: spec.opacity,
    });
    const mesh = new THREE.Mesh(geo, mat);
    threadGroup.add(mesh);
    return mesh;
  });

  // 3D Floating Cotton-Silk & Gold Dust Particles
  const particleCount = 220;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xe8d5b0,
    size: 0.045,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Interactive pointer parallax state
  const targetMouse = { x: 0, y: 0 };
  const currentMouse = { x: 0, y: 0 };

  window.addEventListener('pointermove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;

    // Continuous 3D thread orbit + pointer tilt
    threadGroup.rotation.y = t * 0.16 + currentMouse.x * 0.35;
    threadGroup.rotation.x = Math.sin(t * 0.25) * 0.12 - currentMouse.y * 0.22;
    ribbons.forEach((r, idx) => {
      r.rotation.z = Math.sin(t * 0.35 + idx) * 0.08;
    });

    // Subtle floating particle drift
    particles.rotation.y = -t * 0.04 + currentMouse.x * 0.12;
    particles.rotation.x = currentMouse.y * 0.08;

    // Scroll-driven 3D camera flight
    camera.position.z = 9.5 - heroScrollProgress * 4.2;
    camera.position.x = currentMouse.x * 0.55;
    camera.position.y = -currentMouse.y * 0.35;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
}

// ============================================================
// 2. GSAP SCROLLTRIGGER & INTERACTIVE 3D TILT CARDS
// ============================================================
function initGSAPMotion() {
  if (typeof gsap === 'undefined') {
    // Fallback reveal observer if GSAP CDN is unreachable
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.14 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero entrance
  gsap.from('#heroContent > *', {
    y: 36,
    opacity: 0,
    duration: 1.15,
    stagger: 0.14,
    ease: 'power3.out',
  });

  // 3D Scroll-triggered reveals for all .reveal blocks
  document.querySelectorAll('.reveal').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    gsap.from(el, {
      y: 42,
      rotationX: 8,
      transformPerspective: 1000,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 84%',
        once: true,
      },
    });
  });

  // Craft banner macro background parallax
  const craftBg = document.querySelector('.craft-bg');
  if (craftBg && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(
      craftBg,
      { scale: 1.14, yPercent: -6 },
      {
        scale: 1.02,
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.craft-banner',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  }

  // Final dress cinematic zoom + golden light sheen sweep together
  const finalDressImg = document.getElementById('finalDressImg');
  const gownSheen = document.querySelector('.gown-sheen');
  if (finalDressImg && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(
      finalDressImg,
      { scale: 1.16, filter: 'brightness(0.85) saturate(0.95)' },
      {
        scale: 1.0,
        filter: 'brightness(1.04) saturate(1.06)',
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#gownFrame',
          start: 'top 78%',
          once: true,
        },
      }
    );
  }
  if (gownSheen && typeof ScrollTrigger !== 'undefined') {
    gsap.to(gownSheen, {
      xPercent: 240,
      duration: 1.8,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '#gownFrame',
        start: 'top 75%',
        once: true,
      },
    });
  }

  // Interactive 3D perspective tilt on cards & stages
  const tiltTargets = document.querySelectorAll('.origin-card, .anatomy-stage, .gown-frame');
  tiltTargets.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        transformPerspective: 1100,
        rotationY: nx * 9,
        rotationX: -ny * 7,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    card.addEventListener('pointerleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    });
  });
}

initThreeStage();
initExhibition360();
initGSAPMotion();

// ============================================================
// 2B. 360-DEGREE PINNED DRESS EXHIBITION (GSAP + THREE.JS)
// ============================================================
function initExhibition360() {
  const stage = document.getElementById('exhibition360');
  const pin = document.getElementById('exhibitionPin');
  const dressWrap = document.getElementById('exhibitionDressWrap');
  const canvas = document.getElementById('turntableCanvas');
  if (!stage || !pin || !dressWrap || !canvas) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 48;
  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;

  // Preload 48-frame 360-degree turntable sequence
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    const idx = String(i).padStart(2, '0');
    img.src = `assets/turntable/frame_${idx}.jpg`;
    img.onload = () => {
      loadedCount++;
      if (i === 0) drawFrame(0);
    };
    frames[i] = img;
  }

  let currentFrameFloat = 0;
  let targetFrameFloat = 0;
  let lastDrawnIdx = -1;

  function drawFrame(frameFloat) {
    const wrapped = ((frameFloat % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
    const idx = Math.floor(wrapped) % TOTAL_FRAMES;
    const img = frames[idx];
    if (img && img.complete && img.naturalWidth > 0 && idx !== lastDrawnIdx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawnIdx = idx;
    }
  }

  // Subtle Three.js floating fabric particles in deep charcoal studio
  const pCanvas = document.getElementById('exhibitionParticles');
  let particleScene = null;
  if (pCanvas && typeof THREE !== 'undefined') {
    const pRenderer = new THREE.WebGLRenderer({ canvas: pCanvas, alpha: true, antialias: true });
    pRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    pRenderer.setSize(window.innerWidth, window.innerHeight);

    const pScene = new THREE.Scene();
    const pCam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
    pCam.position.z = 8;

    const count = 130;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xeae3d7,
      size: 0.032,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const pts = new THREE.Points(geo, mat);
    pScene.add(pts);

    window.addEventListener('resize', () => {
      pCam.aspect = window.innerWidth / window.innerHeight;
      pCam.updateProjectionMatrix();
      pRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    particleScene = { pRenderer, pScene, pCam, pts };
  }

  const stepLabel = document.getElementById('exhibitionStepLabel');
  const titleEl = document.getElementById('exhibitionTitle');
  const captionEl = document.getElementById('exhibitionCaption');
  const dialAngle = document.getElementById('dialAngle');
  const dialView = document.getElementById('dialView');
  const dialFill = document.getElementById('dialFill');

  function updateHUD(progress, deg) {
    const rounded = Math.round(deg) % 360;
    if (dialAngle) dialAngle.textContent = String(rounded).padStart(3, '0') + '°';
    if (dialFill) dialFill.style.width = `${(progress * 100).toFixed(1)}%`;

    let viewName = 'Front';
    if (rounded >= 45 && rounded < 135) viewName = 'Left Profile';
    else if (rounded >= 135 && rounded < 225) viewName = 'Back View';
    else if (rounded >= 225 && rounded < 315) viewName = 'Right Profile';
    if (dialView) dialView.textContent = viewName;

    if (!stepLabel || !titleEl || !captionEl) return;
    if (progress < 0.14) {
      stepLabel.textContent = '01 · Emerging from Shadow';
      titleEl.textContent = 'The Silhouette Appears';
      captionEl.textContent = 'Suspended in a quiet obsidian studio, free of mannequin or form.';
    } else if (progress < 0.30) {
      stepLabel.textContent = '02 · Fabric Approach';
      titleEl.textContent = 'Woven Cotton & Shefon';
      captionEl.textContent = 'Moving closer to reveal the espresso floral weave and cream ground.';
    } else if (progress < 0.56) {
      stepLabel.textContent = '03 · 360° Orbit';
      titleEl.textContent = 'Balanced From Every Angle';
      captionEl.textContent = 'Rotating smoothly past the puff sleeves toward the tailored back.';
    } else if (progress < 0.74) {
      stepLabel.textContent = '04 · Rear Craft & Detail';
      titleEl.textContent = 'Back Embroidery & Drape';
      captionEl.textContent = 'Zooming into the rear bodice seams, gathers, and traditional shefon finish.';
    } else if (progress < 0.90) {
      stepLabel.textContent = '05 · Full Reveal';
      titleEl.textContent = 'Returning to Front';
      captionEl.textContent = 'Pulling back as the full three-tier gown completes its 360° turn.';
    } else {
      stepLabel.textContent = '06 · Transition';
      titleEl.textContent = 'Into the Atelier';
      captionEl.textContent = 'Continuing into the material origin and deconstructed anatomy.';
    }
  }

  let scrollProgress = 0;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      pin: pin,
      scrub: 1.1,
      onUpdate: (self) => {
        scrollProgress = self.progress;

        // 7-beat choreography:
        // 0.00-0.12: emerge from darkness
        // 0.12-0.25: camera closer
        // 0.25-0.88: smooth 360 rotation (paused briefly around 0.55-0.72 for back detail zoom)
        // 0.88-1.00: fade elegantly into next section
        let opacity = 1;
        if (scrollProgress < 0.12) {
          opacity = scrollProgress / 0.12;
        } else if (scrollProgress > 0.88) {
          opacity = Math.max(0, 1 - (scrollProgress - 0.88) / 0.12);
        }

        let scale = 1.0;
        let yPct = 0;
        if (scrollProgress < 0.12) {
          const t = scrollProgress / 0.12;
          scale = 0.88 + 0.08 * t;
        } else if (scrollProgress < 0.25) {
          const t = (scrollProgress - 0.12) / 0.13;
          scale = 0.96 + 0.18 * t;
        } else if (scrollProgress < 0.55) {
          scale = 1.14;
        } else if (scrollProgress < 0.72) {
          const t = (scrollProgress - 0.55) / 0.17;
          const ease = t * t * (3 - 2 * t);
          scale = 1.14 + 0.18 * ease;
          yPct = 7 * ease;
        } else if (scrollProgress < 0.88) {
          const t = (scrollProgress - 0.72) / 0.16;
          const ease = t * t * (3 - 2 * t);
          scale = 1.32 - 0.32 * ease;
          yPct = 7 * (1 - ease);
        } else {
          const t = (scrollProgress - 0.88) / 0.12;
          scale = 1.0 - 0.06 * t;
        }

        // Map 0.18 -> 0.88 cleanly to 0 -> 360 degrees
        const rotProgress = Math.max(0, Math.min(1, (scrollProgress - 0.18) / 0.70));
        targetFrameFloat = rotProgress * TOTAL_FRAMES;

        dressWrap.style.opacity = opacity.toFixed(3);
        dressWrap.dataset.baseScale = scale.toFixed(4);
        dressWrap.dataset.baseYPct = yPct.toFixed(3);

        updateHUD(scrollProgress, rotProgress * 360);
      },
    });
  }

  // Smooth interpolation loop + subtle fabric breathing float
  const exClockStart = performance.now();
  function tick() {
    requestAnimationFrame(tick);
    const elapsed = (performance.now() - exClockStart) * 0.001;

    currentFrameFloat += (targetFrameFloat - currentFrameFloat) * 0.14;
    drawFrame(currentFrameFloat);

    // Subtle fabric float (zero distortion)
    const baseScale = parseFloat(dressWrap.dataset.baseScale || '0.96');
    const baseYPct = parseFloat(dressWrap.dataset.baseYPct || '0');
    const floatY = Math.sin(elapsed * 1.4) * 5;
    dressWrap.style.transform = `translate3d(0, calc(${baseYPct}% + ${floatY.toFixed(2)}px), 0) scale(${baseScale})`;

    if (particleScene) {
      const { pRenderer, pScene, pCam, pts } = particleScene;
      pts.rotation.y = elapsed * 0.03 + scrollProgress * 1.2;
      pts.position.y = Math.sin(elapsed * 0.4) * 0.15;
      pRenderer.render(pScene, pCam);
    }
  }
  tick();
}

// ============================================================
// 3. ANATOMY HOTSPOTS, SWATCHES & FITTING MODAL
// ============================================================
const anatomyItems = document.querySelectorAll('.anatomy-item');
const hotspots = document.querySelectorAll('.hotspot');

function activatePart(part) {
  anatomyItems.forEach((el) => el.classList.toggle('active', el.dataset.part === part));
  hotspots.forEach((el) => el.classList.toggle('active', el.dataset.part === part));
}

anatomyItems.forEach((item) => {
  item.addEventListener('click', () => activatePart(item.dataset.part));
  item.addEventListener('mouseenter', () => activatePart(item.dataset.part));
});

hotspots.forEach((spot) => {
  spot.addEventListener('click', () => activatePart(spot.dataset.part));
  spot.addEventListener('mouseenter', () => activatePart(spot.dataset.part));
});

// Colour swatch lighting switcher
const swatches = document.querySelectorAll('.swatch');
const gownFrame = document.getElementById('gownFrame');
const swatchDesc = document.getElementById('swatchDesc');

swatches.forEach((btn) => {
  btn.addEventListener('click', () => {
    swatches.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    gownFrame.style.setProperty('--swatch-glow', btn.dataset.glow);
    swatchDesc.textContent = btn.dataset.desc;
  });
});

// Fitting modal
const modal = document.getElementById('fittingModal');
const openBtns = document.querySelectorAll('[data-open-fitting]');
const closeBtn = document.getElementById('closeModal');
const fittingForm = document.getElementById('fittingForm');
const formStatus = document.getElementById('formStatus');

openBtns.forEach((btn) => {
  btn.addEventListener('click', () => modal.classList.add('open'));
});
closeBtn.addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});

fittingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formStatus.textContent = 'Your private fitting request has been received by the Aster Weregnaw Shefon Atelier.';
  fittingForm.reset();
});
