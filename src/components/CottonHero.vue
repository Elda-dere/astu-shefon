<template>
  <section id="home" ref="heroRef" class="relative h-screen w-full overflow-hidden bg-[#f6f1e7]">
    <!-- Real-time TresJS 3D Ethiopian Cotton Boll & Floating Fibers -->
    <div class="absolute inset-0 z-0">
      <TresCanvas clear-color="#f6f1e7" :antialias="true" :dpr="[1, 2]">
        <TresPerspectiveCamera :position="[0, 0.2, camZ]" :fov="42" />
        <TresAmbientLight :intensity="1.15" color="#faf5ea" />
        <TresDirectionalLight :position="[4, 6, 5]" :intensity="1.6" color="#fff9ee" />
        <TresDirectionalLight :position="[-4, -2, 3]" :intensity="0.65" color="#cbb799" />

        <!-- 3D Ethiopian Cotton Boll -->
        <TresGroup ref="bollGroupRef" :rotation="[bollRotX, bollRotY, 0]" :position="[0, -0.1, 0]">
          <!-- 5 Organic Cotton Puffs -->
          <TresMesh v-for="(puff, idx) in cottonPuffs" :key="'puff-' + idx" :position="puff.pos" :scale="puff.scale">
            <TresSphereGeometry :args="[0.58, 28, 28]" />
            <TresMeshStandardMaterial color="#faf7f0" :roughness="0.92" :metalness="0.02" />
          </TresMesh>

          <!-- Earthy Calyx Leaves / Bracts -->
          <TresMesh v-for="(leaf, idx) in calyxLeaves" :key="'leaf-' + idx" :position="leaf.pos" :rotation="leaf.rot">
            <TresConeGeometry :args="[0.26, 0.85, 5]" />
            <TresMeshStandardMaterial color="#8c6d4a" :roughness="0.82" :metalness="0.05" />
          </TresMesh>

          <!-- Subtle Stem -->
          <TresMesh :position="[0, -0.95, 0]">
            <TresCylinderGeometry :args="[0.06, 0.09, 0.7, 12]" />
            <TresMeshStandardMaterial color="#6b5237" :roughness="0.9" />
          </TresMesh>
        </TresGroup>

        <!-- Floating Cotton Fiber Strands & Atmospheric Particles -->
        <TresPoints ref="fibersRef">
          <TresBufferGeometry>
            <TresBufferAttribute :args="[fiberPositions, 3]" attach="attributes-position" />
          </TresBufferGeometry>
          <TresPointsMaterial color="#d8cbb5" :size="0.055" :transparent="true" :opacity="0.72" :depth-write="false" />
        </TresPoints>
      </TresCanvas>
    </div>

    <!-- Soft Editorial Vignette -->
    <div
      class="absolute inset-0 z-10 pointer-events-none"
      style="background: radial-gradient(circle at 50% 48%, rgba(246,241,231,0.15) 0%, rgba(246,241,231,0.78) 78%, #f6f1e7 100%);"
    ></div>

    <!-- Hero Typography -->
    <div class="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
      <p class="eyebrow mb-5">Aster Weregnaw Shefon · Addis Ababa</p>
      <h1 class="font-serif-editorial text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tight text-[#221d18] max-w-4xl">
        FROM THE EARTH,<br />
        <em class="italic font-normal text-[#7e6e5b]">WOVEN INTO ART.</em>
      </h1>
      <p class="mt-6 max-w-md text-sm md:text-base font-light text-[#635647] leading-relaxed">
        Discover the journey of Ethiopian cotton, craftsmanship, and timeless design.
      </p>
    </div>

    <!-- Subtle Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-none">
      <span class="text-[0.6rem] tracking-[0.32em] uppercase text-[#7e6e5b]">Scroll to discover</span>
      <div class="w-px h-9 bg-gradient-to-b from-[#7e6e5b] to-transparent"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const heroRef = ref(null);
const bollGroupRef = ref(null);
const fibersRef = ref(null);
const camZ = ref(5.4);
const bollRotX = ref(0.18);
const bollRotY = ref(0.2);

const cottonPuffs = [
  { pos: [0, 0.35, 0.25], scale: [1.05, 0.95, 1.0] },
  { pos: [-0.48, 0.12, 0.08], scale: [0.92, 0.92, 0.92] },
  { pos: [0.48, 0.12, 0.08], scale: [0.92, 0.92, 0.92] },
  { pos: [-0.26, -0.24, 0.22], scale: [0.88, 0.85, 0.9] },
  { pos: [0.26, -0.24, 0.22], scale: [0.88, 0.85, 0.9] },
];

const calyxLeaves = [
  { pos: [0, -0.58, 0.42], rot: [0.55, 0, 0] },
  { pos: [-0.55, -0.35, 0.15], rot: [0.2, 0, 0.75] },
  { pos: [0.55, -0.35, 0.15], rot: [0.2, 0, -0.75] },
  { pos: [0, -0.45, -0.35], rot: [-0.6, 0, 0] },
];

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const particleCount = isMobile ? 90 : 220;
const fiberPositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  fiberPositions[i * 3] = (Math.random() - 0.5) * 10;
  fiberPositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
  fiberPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
}

let rafId = null;

onMounted(() => {
  ScrollTrigger.create({
    trigger: heroRef.value,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.9,
    onUpdate: (self) => {
      camZ.value = 5.4 - self.progress * 1.9;
    },
  });

  const start = performance.now();
  const animate = () => {
    rafId = requestAnimationFrame(animate);
    const t = (performance.now() - start) * 0.001;
    bollRotY.value = 0.2 + t * 0.18;
    bollRotX.value = 0.18 + Math.sin(t * 0.6) * 0.06;
    if (fibersRef.value) {
      fibersRef.value.rotation.y = t * 0.04;
      fibersRef.value.position.y = Math.sin(t * 0.5) * 0.12;
    }
  };
  animate();
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>
