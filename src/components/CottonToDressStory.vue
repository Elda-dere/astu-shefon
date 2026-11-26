<template>
  <section id="process" ref="sectionRef" class="relative h-[620vh] bg-[#f6f1e7]">
    <div
      ref="pinRef"
      id="stage-final-reveal"
      class="relative h-screen w-full overflow-hidden transition-colors duration-700"
      :class="stageIndex === 5 ? 'bg-[#110f0d] text-[#f6f1e7]' : 'bg-[#f6f1e7] text-[#221d18]'"
    >
      <!-- Stages 01–05: Real-Time TresJS 3D Procedural Cotton -> Processing -> Spinning -> Weaving -> Construction -->
      <div v-if="stageIndex < 5" class="absolute inset-0 z-0">
        <TresCanvas :clear-color="stageIndex >= 4 ? '#efe8da' : '#f6f1e7'" :antialias="true" :dpr="[1, 1.8]">
          <TresPerspectiveCamera :position="[0, 0.2, stageCamZ]" :fov="44" />
          <TresAmbientLight :intensity="1.1" color="#faf5ea" />
          <TresDirectionalLight :position="[4, 6, 5]" :intensity="1.5" color="#fff8eb" />

          <!-- STAGE 01: Raw Cotton -->
          <TresGroup v-if="stageIndex === 0" :rotation="[0.2, stageTime * 0.35, 0]">
            <TresMesh v-for="(p, i) in puffs" :key="'s1-' + i" :position="p">
              <TresSphereGeometry :args="[0.52, 22, 22]" />
              <TresMeshStandardMaterial color="#faf7f0" :roughness="0.92" />
            </TresMesh>
          </TresGroup>

          <!-- STAGE 02: Cotton Processing (Rotating Rollers & Conveyor) -->
          <TresGroup v-if="stageIndex === 1" :rotation="[0.15, -0.35, 0]">
            <TresMesh :position="[-1.1, 0.45, 0]" :rotation="[0, 0, Math.PI / 2]" :rotation-x="stageTime * 1.8">
              <TresCylinderGeometry :args="[0.35, 0.35, 2.2, 20]" />
              <TresMeshStandardMaterial color="#b49d80" :roughness="0.45" :metalness="0.45" />
            </TresMesh>
            <TresMesh :position="[0.9, -0.35, 0.3]" :rotation="[0, 0, Math.PI / 2]" :rotation-x="-stageTime * 2.2">
              <TresCylinderGeometry :args="[0.28, 0.28, 2.2, 20]" />
              <TresMeshStandardMaterial color="#7e6e5b" :roughness="0.4" :metalness="0.55" />
            </TresMesh>
            <TresMesh :position="[0, -0.85, 0]">
              <TresBoxGeometry :args="[3.6, 0.12, 1.4]" />
              <TresMeshStandardMaterial color="#dfd4c2" :roughness="0.85" />
            </TresMesh>
          </TresGroup>

          <!-- STAGE 03: Spinning (3D Spindle & Twisting Yarn Helices) -->
          <TresGroup v-if="stageIndex === 2" :rotation="[0.1, stageTime * 0.9, 0]">
            <TresMesh :position="[0, 0, 0]">
              <TresCylinderGeometry :args="[0.26, 0.32, 2.2, 24]" />
              <TresMeshStandardMaterial color="#d8cab2" :roughness="0.7" />
            </TresMesh>
            <TresMesh v-for="ring in 8" :key="'spin-' + ring" :position="[0, (ring - 4.5) * 0.22, 0]" :rotation="[Math.PI / 2, 0, 0]">
              <TresTorusGeometry :args="[0.34, 0.035, 10, 32]" />
              <TresMeshStandardMaterial color="#faf7f0" :roughness="0.65" />
            </TresMesh>
          </TresGroup>

          <!-- STAGE 04: Weaving (3D Warp & Weft Intersecting Textile Grid) -->
          <TresGroup v-if="stageIndex === 3" :rotation="[0.35, Math.sin(stageTime * 0.4) * 0.25, 0]">
            <TresMesh v-for="w in 9" :key="'warp-' + w" :position="[(w - 5) * 0.36, 0, 0]">
              <TresCylinderGeometry :args="[0.025, 0.025, 3.2, 8]" />
              <TresMeshStandardMaterial color="#cbb799" :roughness="0.6" />
            </TresMesh>
            <TresMesh
              v-for="wf in 9"
              :key="'weft-' + wf"
              :position="[0, (wf - 5) * 0.34, Math.sin(stageTime * 2 + wf) * 0.04]"
              :rotation="[0, 0, Math.PI / 2]"
            >
              <TresCylinderGeometry :args="[0.025, 0.025, 3.2, 8]" />
              <TresMeshStandardMaterial color="#faf7f0" :roughness="0.65" />
            </TresMesh>
          </TresGroup>

          <!-- STAGE 05: Dress Construction (Procedural 3D Silhouette + GLB Ready) -->
          <TresGroup v-if="stageIndex === 4" :rotation="[0.08, stageTime * 0.55, 0]">
            <!-- Sculpted Bodice -->
            <TresMesh :position="[0, 0.65, 0]">
              <TresCylinderGeometry :args="[0.36, 0.26, 0.95, 24]" />
              <TresMeshStandardMaterial color="#ede3d2" :roughness="0.72" />
            </TresMesh>
            <!-- Puff Sleeves -->
            <TresMesh :position="[-0.52, 0.92, 0]">
              <TresSphereGeometry :args="[0.26, 20, 20]" />
              <TresMeshStandardMaterial color="#f5efe4" :roughness="0.75" />
            </TresMesh>
            <TresMesh :position="[0.52, 0.92, 0]">
              <TresSphereGeometry :args="[0.26, 20, 20]" />
              <TresMeshStandardMaterial color="#f5efe4" :roughness="0.75" />
            </TresMesh>
            <!-- Three-Tier Skirt -->
            <TresMesh :position="[0, -0.45, 0]">
              <TresConeGeometry :args="[1.15, 1.85, 32, 1, true]" />
              <TresMeshStandardMaterial color="#e5d7c1" :roughness="0.78" :side="2" />
            </TresMesh>
          </TresGroup>
        </TresCanvas>
      </div>

      <!-- Stage 02 Optional Pre-rendered Manufacturing Video Layer -->
      <video
        v-if="stageIndex === 1"
        src="/cotton_to_dress_4k_16x9.mp4"
        autoplay
        muted
        loop
        playsinline
        class="absolute right-8 bottom-24 w-56 md:w-72 aspect-video object-cover border border-[#221d18]/20 shadow-xl z-10 hidden md:block"
      ></video>

      <!-- STAGE 06: Final Dress Reveal (360° Turntable in Deep Charcoal Studio) -->
      <div v-if="stageIndex === 5" class="absolute inset-0 z-10 flex items-center justify-center">
        <div class="relative h-[78vh] aspect-[960/1024]">
          <canvas ref="turntableRef" width="960" height="1024" class="w-full h-full object-contain"></canvas>
        </div>
      </div>

      <!-- Stage HUD & Storytelling Copy -->
      <div class="relative z-20 h-full flex flex-col justify-between p-6 md:p-14 pointer-events-none">
        <div class="pt-16 flex justify-between items-start">
          <div>
            <p class="eyebrow" :class="{ 'eyebrow-light': stageIndex === 5 }">
              Stage 0{{ stageIndex + 1 }} / 06 — {{ currentStage.tag }}
            </p>
            <h2 class="font-serif-editorial text-4xl md:text-6xl mt-3 max-w-xl leading-[1.02]">
              {{ currentStage.title }}
            </h2>
            <p class="mt-4 max-w-md text-sm font-light opacity-75">
              {{ currentStage.desc }}
            </p>
          </div>

          <div v-if="stageIndex === 5" class="hidden md:flex flex-col items-end">
            <span class="font-serif-editorial text-3xl">{{ String(Math.round(finalDeg) % 360).padStart(3, '0') }}°</span>
            <span class="text-[0.6rem] tracking-[0.28em] uppercase text-[#cbb799]">360° Studio Orbit</span>
          </div>
        </div>

        <!-- Stage Progress Bar -->
        <div class="flex items-center justify-between gap-6">
          <div class="flex gap-2">
            <span
              v-for="(s, idx) in stages"
              :key="s.tag"
              class="h-0.5 transition-all duration-300"
              :class="[
                idx === stageIndex ? 'w-10' : 'w-4 opacity-30',
                stageIndex === 5 ? 'bg-[#f6f1e7]' : 'bg-[#221d18]'
              ]"
            ></span>
          </div>
          <span class="text-[0.62rem] tracking-[0.26em] uppercase opacity-60">
            {{ Math.round(progress * 100) }}% Journey
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  { tag: 'Raw Cotton', title: 'IT BEGINS WITH NATURE.', desc: 'Hand-harvested Ethiopian highland cotton fibers separate weightlessly in studio light.' },
  { tag: 'Cotton Processing', title: 'REFINED BY CRAFT.', desc: 'Raw bolls pass through precision rollers, aligning pure long-staple fibers.' },
  { tag: 'Spinning', title: 'EVERY THREAD HAS A STORY.', desc: 'Individual strands twist together into continuous, luminous cream yarn.' },
  { tag: 'Weaving', title: 'TRADITION MEETS PRECISION.', desc: 'Warp and weft threads interlace into breathable Ethiopian shemma and sheer shefon.' },
  { tag: 'Dress Construction', title: 'CRAFTED INTO SOMETHING TIMELESS.', desc: 'Woven textile unfolds into sculpted puff sleeves, contoured bodice, and flowing tiers.' },
  { tag: 'The Final Dress Reveal', title: 'ETHIOPIAN HERITAGE. REIMAGINED.', desc: 'Scroll smoothly to orbit the finished dress 360 degrees in our dark studio.' },
];

const puffs = [
  [0, 0.3, 0.2],
  [-0.4, 0.05, 0.1],
  [0.4, 0.05, 0.1],
  [-0.2, -0.25, 0.2],
  [0.2, -0.25, 0.2],
];

const sectionRef = ref(null);
const pinRef = ref(null);
const turntableRef = ref(null);

const progress = ref(0);
const stageTime = ref(0);

const stageIndex = computed(() => Math.min(5, Math.floor(progress.value * 6)));
const currentStage = computed(() => stages[stageIndex.value]);
const stageCamZ = computed(() => 4.8 - (progress.value % 0.167) * 3.5);
const finalDeg = computed(() => {
  const local = Math.max(0, (progress.value - 5 / 6) / (1 / 6));
  return local * 360;
});

const TOTAL_FRAMES = 48;
const frames = new Array(TOTAL_FRAMES);
let rafId = null;

onMounted(() => {
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `/assets/turntable/frame_${String(i).padStart(2, '0')}.jpg`;
    frames[i] = img;
  }

  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom bottom',
    pin: pinRef.value,
    scrub: 0.9,
    onUpdate: (self) => {
      progress.value = self.progress;
    },
  });

  const start = performance.now();
  const tick = () => {
    rafId = requestAnimationFrame(tick);
    stageTime.value = (performance.now() - start) * 0.001;

    if (stageIndex.value === 5 && turntableRef.value) {
      const ctx = turntableRef.value.getContext('2d');
      const idx = Math.floor((finalDeg.value / 360) * TOTAL_FRAMES) % TOTAL_FRAMES;
      const img = frames[idx];
      if (ctx && img && img.complete && img.naturalWidth > 0) {
        ctx.clearRect(0, 0, 960, 1024);
        ctx.drawImage(img, 0, 0, 960, 1024);
      }
    }
  };
  tick();
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>
