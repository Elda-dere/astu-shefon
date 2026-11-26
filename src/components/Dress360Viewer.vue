<template>
  <section class="dress360-section" id="dress-360" ref="sectionRef" aria-label="360-Degree Interactive Dress Experience">
    <div class="dress360-pin" ref="pinRef">
      <div class="studio-backdrop" aria-hidden="true"></div>
      <canvas ref="particleCanvasRef" class="studio-particles" aria-hidden="true"></canvas>

      <div class="dress360-stage" ref="stageWrapRef">
        <canvas ref="turntableRef" width="960" height="1024" aria-label="360-degree rotating couture gown"></canvas>
      </div>

      <!-- Editorial Angle Labels -->
      <div class="editorial-callouts">
        <div class="callout" :class="{ active: activeLabel === 'SILHOUETTE' }">
          <span class="callout-num">01</span>
          <span class="callout-text">THE SILHOUETTE</span>
        </div>
        <div class="callout" :class="{ active: activeLabel === 'DETAILS' }">
          <span class="callout-num">02</span>
          <span class="callout-text">THE DETAILS</span>
        </div>
        <div class="callout" :class="{ active: activeLabel === 'CRAFTSMANSHIP' }">
          <span class="callout-num">03</span>
          <span class="callout-text">THE CRAFTSMANSHIP</span>
        </div>
        <div class="callout" :class="{ active: activeLabel === 'FINISH' }">
          <span class="callout-num">04</span>
          <span class="callout-text">THE FINISH</span>
        </div>
      </div>

      <div class="hud-bottom">
        <div>
          <p class="eyebrow eyebrow-light">360° Interactive Study</p>
          <p class="hud-sub">{{ viewDescription }}</p>
        </div>
        <div class="angle-readout">
          <span class="deg">{{ formattedDeg }}°</span>
          <span class="view-tag">{{ currentViewTag }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 48;
const sectionRef = ref(null);
const pinRef = ref(null);
const stageWrapRef = ref(null);
const turntableRef = ref(null);
const particleCanvasRef = ref(null);

const scrollProgress = ref(0);
const currentDeg = ref(0);

const formattedDeg = computed(() => String(Math.round(currentDeg.value) % 360).padStart(3, '0'));

const currentViewTag = computed(() => {
  const d = Math.round(currentDeg.value) % 360;
  if (d >= 45 && d < 135) return 'Left Profile';
  if (d >= 135 && d < 225) return 'Back View';
  if (d >= 225 && d < 315) return 'Right Profile';
  return 'Front View';
});

const activeLabel = computed(() => {
  const p = scrollProgress.value;
  if (p < 0.25) return 'SILHOUETTE';
  if (p < 0.52) return 'DETAILS';
  if (p < 0.78) return 'CRAFTSMANSHIP';
  return 'FINISH';
});

const viewDescription = computed(() => {
  if (activeLabel.value === 'SILHOUETTE') return 'Emerging in pure form — balanced puff sleeves and a three-tier sweep.';
  if (activeLabel.value === 'DETAILS') return 'Orbiting smoothly to reveal the botanical espresso print and pleated waist.';
  if (activeLabel.value === 'CRAFTSMANSHIP') return 'Zooming toward the tailored rear bodice and traditional shefon weave.';
  return 'Returning full circle to the front silhouette.';
});

let rafId = null;
let pRenderer = null;

onMounted(() => {
  const canvas = turntableRef.value;
  const ctx = canvas?.getContext('2d');
  const frames = new Array(TOTAL_FRAMES);

  let targetFrame = 0;
  let currentFrame = 0;
  let lastDrawn = -1;

  const drawFrame = (fFloat) => {
    if (!ctx) return;
    const idx = Math.floor(((fFloat % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES);
    const img = frames[idx];
    if (img && img.complete && img.naturalWidth > 0 && idx !== lastDrawn) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawn = idx;
    }
  };

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `/assets/turntable/frame_${String(i).padStart(2, '0')}.jpg`;
    img.onload = () => {
      if (i === 0) drawFrame(0);
    };
    frames[i] = img;
  }

  // Subtle floating fabric particles in Three.js
  const pCanvas = particleCanvasRef.value;
  const isMobile = window.innerWidth < 768;
  let pScene, pCam, pts;
  if (pCanvas) {
    pRenderer = new THREE.WebGLRenderer({ canvas: pCanvas, alpha: true, antialias: false });
    pRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    pRenderer.setSize(window.innerWidth, window.innerHeight);

    pScene = new THREE.Scene();
    pCam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 40);
    pCam.position.z = 7;

    const count = isMobile ? 45 : 110;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xeae2d4,
      size: 0.03,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    });
    pts = new THREE.Points(geo, mat);
    pScene.add(pts);
  }

  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom bottom',
    pin: pinRef.value,
    scrub: 1.05,
    onUpdate: (self) => {
      const p = self.progress;
      scrollProgress.value = p;

      // 360-degree clockwise rotation mapped cleanly across 0.12 -> 0.88
      const rot = Math.max(0, Math.min(1, (p - 0.12) / 0.76));
      targetFrame = rot * TOTAL_FRAMES;
      currentDeg.value = rot * 360;

      // Camera emerge, close-up on back embroidery/shefon, pull back & fade
      let opacity = 1;
      if (p < 0.1) opacity = p / 0.1;
      else if (p > 0.9) opacity = Math.max(0, 1 - (p - 0.9) / 0.1);

      let scale = 1.0;
      let yPct = 0;
      if (p < 0.24) {
        scale = 0.9 + (p / 0.24) * 0.2;
      } else if (p < 0.52) {
        scale = 1.1;
      } else if (p < 0.72) {
        const t = (p - 0.52) / 0.2;
        const ease = t * t * (3 - 2 * t);
        scale = 1.1 + 0.2 * ease;
        yPct = 6 * ease;
      } else if (p < 0.88) {
        const t = (p - 0.72) / 0.16;
        const ease = t * t * (3 - 2 * t);
        scale = 1.3 - 0.3 * ease;
        yPct = 6 * (1 - ease);
      }

      if (stageWrapRef.value) {
        stageWrapRef.value.style.opacity = opacity.toFixed(3);
        stageWrapRef.value.dataset.scale = scale.toFixed(4);
        stageWrapRef.value.dataset.ypct = yPct.toFixed(3);
      }
    },
  });

  const start = performance.now();
  const loop = () => {
    rafId = requestAnimationFrame(loop);
    const t = (performance.now() - start) * 0.001;

    currentFrame += (targetFrame - currentFrame) * 0.14;
    drawFrame(currentFrame);

    if (stageWrapRef.value) {
      const s = stageWrapRef.value.dataset.scale || '0.92';
      const y = stageWrapRef.value.dataset.ypct || '0';
      const floatY = Math.sin(t * 1.3) * 4;
      stageWrapRef.value.style.transform = `translate3d(0, calc(${y}% + ${floatY.toFixed(2)}px), 0) scale(${s})`;
    }

    if (pRenderer && pts) {
      pts.rotation.y = t * 0.025 + scrollProgress.value * 1.1;
      pRenderer.render(pScene, pCam);
    }
  };
  loop();
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (pRenderer) pRenderer.dispose();
});
</script>

<style scoped>
.dress360-section {
  position: relative;
  height: 480vh;
  background: var(--obsidian);
}

.dress360-pin {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 45%, #1c1814 0%, #090807 72%);
}

.studio-backdrop,
.studio-particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.studio-backdrop {
  background: radial-gradient(ellipse 42% 58% at 50% 48%, rgba(246, 241, 231, 0.05) 0%, transparent 72%);
}

.dress360-stage {
  position: relative;
  z-index: 3;
  height: min(84vh, 840px);
  aspect-ratio: 960 / 1024;
  opacity: 0;
  will-change: transform, opacity;
}

.dress360-stage canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.editorial-callouts {
  position: absolute;
  left: 5vw;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  pointer-events: none;
}

.callout {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  opacity: 0.25;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.callout.active {
  opacity: 1;
  transform: translateX(8px);
}

.callout-num {
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  color: var(--champagne);
}

.callout-text {
  font-family: var(--serif);
  font-size: 1.25rem;
  letter-spacing: 0.14em;
  color: var(--ivory);
}

.hud-bottom {
  position: absolute;
  left: 5vw;
  right: 5vw;
  bottom: 2.6rem;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  pointer-events: none;
}

.hud-sub {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: rgba(246, 241, 231, 0.7);
  max-width: 420px;
}

.angle-readout {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.deg {
  font-family: var(--serif);
  font-size: 2.1rem;
  color: var(--ivory);
  line-height: 1;
}

.view-tag {
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--champagne);
  margin-top: 0.25rem;
}

@media (max-width: 900px) {
  .editorial-callouts {
    display: none;
  }
  .dress360-stage {
    height: 68vh;
  }
}
</style>
