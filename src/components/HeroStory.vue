<template>
  <section class="hero-story" id="hero-story" ref="stageRef">
    <div class="hero-pin" ref="pinRef" :style="{ backgroundColor: bgColor }">
      <!-- Scene 01: Cotton -->
      <div class="scene-layer" :style="{ opacity: s1Opacity, transform: `scale(${s1Scale})` }">
        <img src="/assets/cotton.jpg" alt="Macro natural cotton fiber" class="scene-img" />
        <div class="ivory-wash"></div>
      </div>

      <!-- Scene 02: Thread -->
      <div class="scene-layer" :style="{ opacity: s2Opacity, transform: `scale(${s2Scale})` }">
        <img src="/assets/thread.jpg" alt="Delicate spun cotton thread" class="scene-img" />
        <div class="warm-wash"></div>
      </div>

      <!-- Scene 03: Woven Fabric -->
      <div class="scene-layer" :style="{ opacity: s3Opacity, transform: `scale(${s3Scale})` }">
        <img src="/assets/dress_detail.png" alt="Woven floral textile detail" class="scene-img" />
        <div class="warm-wash-dark"></div>
      </div>

      <!-- Scene 04: Couture Dress Reveal -->
      <div class="scene-layer" :style="{ opacity: s4Opacity, transform: `scale(${s4Scale})` }">
        <img src="/assets/dress.jpg" alt="Atelier Élan Couture Gown" class="scene-img scene-img-contain" />
      </div>

      <!-- Three.js 3D Cotton Particles & Physical Thread Ribbon -->
      <canvas ref="threeCanvasRef" class="hero-three" aria-hidden="true"></canvas>

      <!-- Editorial Statements -->
      <div class="hero-text-layer">
        <div class="statement" :style="{ opacity: t1Opacity, transform: `translateY(${t1Y}px)` }">
          <p class="eyebrow">Scene 01 · The Cotton</p>
          <h1 class="editorial-title hero-headline">Every masterpiece<br />has a <em>beginning.</em></h1>
        </div>

        <div class="statement" :style="{ opacity: t2Opacity, transform: `translateY(${t2Y}px)` }">
          <p class="eyebrow">Scene 02 · The Thread Is Born</p>
          <h2 class="editorial-title hero-headline">One weightless strand,<br />drawn from nature.</h2>
        </div>

        <div class="statement statement-light" :style="{ opacity: t3Opacity, transform: `translateY(${t3Y}px)` }">
          <p class="eyebrow eyebrow-light">Scene 03 · The Woven Textile</p>
          <h2 class="editorial-title hero-headline">Crafted from nature.<br /><em>Created to last.</em></h2>
        </div>

        <div class="statement statement-light" :style="{ opacity: t4Opacity, transform: `translateY(${t4Y}px)` }">
          <p class="eyebrow eyebrow-light">Scene 04 · Couture Reveal</p>
          <h2 class="editorial-title hero-headline">Atelier Élan<br /><em>Spring Couture</em></h2>
        </div>
      </div>

      <div class="scroll-cue" :style="{ opacity: Math.max(0, 1 - progress * 8) }">
        <span>Scroll to begin the story</span>
        <div class="scroll-line"></div>
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

const stageRef = ref(null);
const pinRef = ref(null);
const threeCanvasRef = ref(null);
const progress = ref(0);

const smoothRange = (p, a, b, c, d) => {
  if (p <= a || p >= d) return 0;
  if (p >= b && p <= c) return 1;
  if (p < b) return (p - a) / (b - a);
  return 1 - (p - c) / (d - c);
};

// Scene opacities & camera scales
const s1Opacity = computed(() => smoothRange(progress.value, -0.1, 0.0, 0.2, 0.32));
const s2Opacity = computed(() => smoothRange(progress.value, 0.2, 0.3, 0.45, 0.56));
const s3Opacity = computed(() => smoothRange(progress.value, 0.45, 0.56, 0.72, 0.82));
const s4Opacity = computed(() => smoothRange(progress.value, 0.72, 0.84, 1.05, 1.2));

const s1Scale = computed(() => 1.0 + Math.min(0.32, progress.value * 0.9));
const s2Scale = computed(() => 1.04 + Math.max(0, progress.value - 0.2) * 0.55);
const s3Scale = computed(() => 1.02 + Math.max(0, progress.value - 0.45) * 0.45);
const s4Scale = computed(() => 1.12 - Math.max(0, progress.value - 0.72) * 0.42);

// Text statements
const t1Opacity = computed(() => smoothRange(progress.value, -0.05, 0.0, 0.16, 0.25));
const t2Opacity = computed(() => smoothRange(progress.value, 0.23, 0.31, 0.44, 0.52));
const t3Opacity = computed(() => smoothRange(progress.value, 0.50, 0.58, 0.70, 0.78));
const t4Opacity = computed(() => smoothRange(progress.value, 0.77, 0.85, 1.02, 1.15));

const t1Y = computed(() => (1 - t1Opacity.value) * 20);
const t2Y = computed(() => (1 - t2Opacity.value) * 20);
const t3Y = computed(() => (1 - t3Opacity.value) * 20);
const t4Y = computed(() => (1 - t4Opacity.value) * 20);

const bgColor = computed(() => (progress.value > 0.52 ? '#161310' : '#f6f1e7'));

let animId = null;
let renderer = null;

onMounted(() => {
  const isMobile = window.innerWidth < 768;

  ScrollTrigger.create({
    trigger: stageRef.value,
    start: 'top top',
    end: 'bottom bottom',
    pin: pinRef.value,
    scrub: 0.9,
    onUpdate: (self) => {
      progress.value = self.progress;
    },
  });

  // Three.js WebGL floating cotton fibers + physical 3D thread ribbon
  const canvas = threeCanvasRef.value;
  if (!canvas) return;
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 60);
  camera.position.z = 8;

  const ambient = new THREE.AmbientLight(0xf6f1e7, 0.9);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xfff5e4, 1.8);
  key.position.set(4, 5, 6);
  scene.add(key);

  // Cotton fiber particles
  const pCount = isMobile ? 70 : 180;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 14;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 9;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xe9dec9,
    size: isMobile ? 0.05 : 0.04,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Physical 3D Thread Ribbon
  const pts = [
    new THREE.Vector3(-6.5, -1.2, -1),
    new THREE.Vector3(-3.0, 1.4, 0.8),
    new THREE.Vector3(0.2, -0.6, 1.4),
    new THREE.Vector3(3.4, 1.2, 0.4),
    new THREE.Vector3(6.8, -0.8, -1.2),
  ];
  const curve = new THREE.CatmullRomCurve3(pts);
  const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.018, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0xcbb593,
    roughness: 0.35,
    metalness: 0.25,
    transparent: true,
    opacity: 0.85,
  });
  const threadMesh = new THREE.Mesh(tubeGeo, tubeMat);
  scene.add(threadMesh);

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  const clock = new THREE.Clock();
  const renderLoop = () => {
    animId = requestAnimationFrame(renderLoop);
    const t = clock.getElapsedTime();
    const p = progress.value;

    particles.rotation.y = t * 0.03 + p * 0.9;
    particles.position.y = Math.sin(t * 0.4) * 0.15;

    // Thread emerges in Scene 02 and weaves across Scenes 02-04
    threadMesh.visible = p > 0.16 && p < 0.94;
    threadMesh.rotation.x = Math.sin(t * 0.5) * 0.08 + (p - 0.35) * 0.6;
    threadMesh.rotation.y = (p - 0.35) * 0.9;

    camera.position.z = 8 - p * 2.2;
    renderer.render(scene, camera);
  };
  renderLoop();

  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });
});

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId);
  if (renderer) renderer.dispose();
});
</script>

<style scoped>
.hero-story {
  position: relative;
  height: 420vh;
}

.hero-pin {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  transition: background-color 0.6s ease;
}

.scene-layer {
  position: absolute;
  inset: 0;
  will-change: opacity, transform;
}

.scene-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scene-img-contain {
  object-fit: contain;
  padding: 4vh 0;
  background: radial-gradient(circle at 50% 45%, #231d17 0%, #12100e 72%);
}

.ivory-wash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(246, 241, 231, 0.22) 0%, rgba(246, 241, 231, 0.72) 85%);
}

.warm-wash {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(38, 32, 26, 0.18) 0%, rgba(246, 241, 231, 0.45) 88%);
}

.warm-wash-dark {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(18, 16, 14, 0.25) 0%, rgba(18, 16, 14, 0.78) 85%);
}

.hero-three {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.hero-text-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 6vw;
  pointer-events: none;
}

.statement {
  position: absolute;
  max-width: 780px;
}

.hero-headline {
  font-size: clamp(2.8rem, 6.4vw, 5.6rem);
  margin-top: 1rem;
  color: var(--espresso);
}

.hero-headline em {
  font-style: italic;
}

.statement-light .hero-headline {
  color: var(--ivory);
  text-shadow: 0 10px 40px rgba(0, 0, 0, 0.55);
}

.scroll-cue {
  position: absolute;
  bottom: 2.2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--taupe);
}

.scroll-line {
  width: 1px;
  height: 38px;
  background: linear-gradient(to bottom, var(--taupe), transparent);
}
</style>
