<template>
  <section id="home" ref="storyRef" class="relative h-[680vh] bg-[#f6f1e7]">
    <div
      id="process"
      ref="pinRef"
      class="relative h-screen w-full overflow-hidden transition-colors duration-700"
      :class="stageIdx >= 5 ? 'bg-[#12100e] text-[#f6f1e7]' : 'bg-[#f6f1e7] text-[#221d18]'"
    >
      <!-- Single Unified WebGL TresCanvas for the Entire Cotton-to-Dress 3D Journey -->
      <div class="absolute inset-0 z-0">
        <TresCanvas class="w-full h-full" :clear-color="stageIdx >= 5 ? '#12100e' : '#f6f1e7'" shadows :antialias="true" :dpr="[1, 1.8]">
          <TresPerspectiveCamera :position="[camPosX, camPosY, camPosZ]" :rotation="[0, camRotY, 0]" :fov="44" />
          <TresAmbientLight :intensity="1.05" color="#faf5ea" />
          <TresDirectionalLight :position="[camPosX + 4, 6, 5]" :intensity="1.65" color="#fff8ea" cast-shadow />
          <TresDirectionalLight :position="[camPosX - 4, -2, 3]" :intensity="0.65" color="#cbb799" />

          <!-- STAGE 01 (x = 0): Real 3D Cotton Boll + Separating Fiber Particles -->
          <CottonScene
            :position="[0, 0, 0]"
            :rot-x="0.16 + mouseY * 0.15"
            :rot-y="time * 0.28 + mouseX * 0.35"
            :scale="1 - cottonSep * 0.15"
            :separation="cottonSep"
          />
          <CottonParticles :progress="particleStream" :time="time" />

          <!-- STAGE 02 & 03 (x = 9.5): Real 3D Textile Machine + Animated Yarn Strands -->
          <TextileMachine :position="[9.5, 0, 0]" :time="time" />
          <YarnSimulation :position="[9.5, 0, 0]" :time="time" :twist-progress="yarnTwist" />

          <!-- STAGE 04 (x = 20.0): Real 3D Over-Under Weaving Simulation -->
          <WeavingScene :position="[20.0, 0, 0]" :weave-progress="weaveProg" :rot-y="mouseX * 0.18" />
        </TresCanvas>
      </div>

      <!-- STAGE 05 & 06: Uploaded 3D Dress Video Reveal & Scroll-Controlled 360° -->
      <div
        v-show="stageIdx >= 5"
        class="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none transition-opacity duration-500"
        :style="{ opacity: stageIdx >= 5 ? 1 : 0 }"
      >
        <div
          class="relative h-[84vh] aspect-square flex items-center justify-center"
          :style="{ transform: `scale(${dressScale})` }"
        >
          <video
            ref="storyDressVideo"
            src="/assets/dress_3d.mp4"
            muted
            loop
            playsinline
            preload="auto"
            class="w-full h-full object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
          ></video>
        </div>
      </div>

      <!-- Editorial Typography Overlay -->
      <div class="relative z-10 h-full flex flex-col justify-between p-6 md:p-14 pointer-events-none">
        <div class="pt-16 max-w-2xl">
          <p class="eyebrow" :class="{ 'eyebrow-light': stageIdx >= 5 }">
            {{ currentCopy.eyebrow }}
          </p>
          <h1
            v-if="stageIdx === 0"
            class="font-serif-editorial text-5xl sm:text-7xl md:text-8xl leading-[0.94] mt-4"
          >
            {{ t.story.heroTitle1 }}<br />
            <em class="italic font-normal text-[#7e6e5b]">{{ t.story.heroTitle2 }}</em>
          </h1>
          <h2
            v-else
            class="font-serif-editorial text-4xl sm:text-6xl md:text-7xl leading-[0.98] mt-4"
          >
            {{ currentCopy.title }}
          </h2>
          <p class="mt-4 max-w-md text-sm font-light opacity-75 leading-relaxed">
            {{ currentCopy.subtitle }}
          </p>
        </div>

        <!-- Bottom Progress & Scroll Cue -->
        <div class="flex items-end justify-between">
          <div class="flex items-center gap-2">
            <span
              v-for="(s, idx) in stageCopy"
              :key="s.eyebrow"
              class="h-0.5 transition-all duration-300"
              :class="[
                idx === stageIdx ? 'w-10' : 'w-4 opacity-30',
                stageIdx >= 5 ? 'bg-[#f6f1e7]' : 'bg-[#221d18]'
              ]"
            ></span>
          </div>
          <span class="text-[0.62rem] tracking-[0.26em] uppercase opacity-65">
            {{ stageIdx === 0 ? t.story.scrollCue : `${t.story.stagePrefix} 0${stageIdx} / 06` }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { TresCanvas } from '@tresjs/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CottonScene from './CottonScene.vue';
import CottonParticles from './CottonParticles.vue';
import TextileMachine from './TextileMachine.vue';
import YarnSimulation from './YarnSimulation.vue';
import WeavingScene from './WeavingScene.vue';
import { useI18n } from '../composables/useI18n.js';

gsap.registerPlugin(ScrollTrigger);
const { t } = useI18n();

const storyRef = ref(null);
const pinRef = ref(null);
const storyDressVideo = ref(null);

const time = ref(0);
const mouseX = ref(0);
const mouseY = ref(0);

// GSAP-animated 3D scene & camera state
const state = ref({
  camX: 0,
  camY: 0.15,
  camZ: 4.8,
  camRotY: 0,
  cottonSep: 0,
  particleStream: 0,
  yarnTwist: 0,
  weaveProg: 0,
  dressRotY: 0,
  dressScale: 0.72,
  progress: 0,
});

const camPosX = computed(() => state.value.camX + mouseX.value * 0.25);
const camPosY = computed(() => state.value.camY - mouseY.value * 0.18);
const camPosZ = computed(() => state.value.camZ);
const camRotY = computed(() => state.value.camRotY);
const cottonSep = computed(() => state.value.cottonSep);
const particleStream = computed(() => state.value.particleStream);
const yarnTwist = computed(() => state.value.yarnTwist);
const weaveProg = computed(() => state.value.weaveProg);
const dressRotY = computed(() => state.value.dressRotY);
const dressScale = computed(() => state.value.dressScale);

const stageCopy = computed(() => [
  {
    eyebrow: t.value.story.heroEyebrow,
    title: `${t.value.story.heroTitle1} ${t.value.story.heroTitle2}`,
    subtitle: t.value.story.heroSub,
  },
  ...t.value.story.stages,
]);

const stageIdx = computed(() => {
  const p = state.value.progress;
  if (p < 0.1) return 0;
  if (p < 0.24) return 1;
  if (p < 0.4) return 2;
  if (p < 0.56) return 3;
  if (p < 0.72) return 4;
  if (p < 0.86) return 5;
  return 6;
});

const currentCopy = computed(() => stageCopy.value[stageIdx.value]);

const onPointerMove = (e) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 2;
};

let rafId = null;
let tl = null;

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Master GSAP ScrollTrigger Timeline controlling 3D camera + objects
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: storyRef.value,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinRef.value,
      scrub: 1.0,
      onUpdate: (self) => {
        state.value.progress = self.progress;
      },
    },
  });

  // 1. Hero -> Stage 01: Approach cotton and separate fibers
  tl.to(state.value, { camZ: 3.1, cottonSep: 0.9, particleStream: 0.25, duration: 1.4, ease: 'power1.inOut' })
    // 2. Stage 02: Fly camera to Textile Machine while fibers stream in
    .to(state.value, { camX: 9.2, camZ: 5.2, camY: 0.35, particleStream: 1.0, duration: 1.6, ease: 'power2.inOut' })
    // 3. Stage 03: Move toward spindles & yarn strands
    .to(state.value, { camX: 11.4, camZ: 4.1, yarnTwist: 1.0, duration: 1.4, ease: 'power1.inOut' })
    // 4. Stage 04: Fly to Weaving Scene & zoom in on over-under woven threads
    .to(state.value, { camX: 20.0, camY: 0.1, camZ: 3.6, weaveProg: 1.0, duration: 1.6, ease: 'power2.inOut' })
    // 5. Stage 05: Fly to Ethiopian Dress Construction
    .to(state.value, { camX: 31.0, camY: 0.1, camZ: 4.4, dressScale: 1.0, duration: 1.4, ease: 'power2.inOut' })
    // 6. Stage 06: 360-degree Dress Reveal rotation
    .to(state.value, { dressRotY: Math.PI * 2, camZ: 4.0, duration: 1.8, ease: 'none' });

  const start = performance.now();
  const loop = () => {
    rafId = requestAnimationFrame(loop);
    time.value = (performance.now() - start) * 0.001;

    const v = storyDressVideo.value;
    if (stageIdx.value >= 5 && v && v.duration) {
      const norm = (((dressRotY.value / (Math.PI * 2)) % 1) + 1) % 1;
      const targetTime = norm * v.duration;
      if (Math.abs(v.currentTime - targetTime) > 0.015) {
        v.currentTime = targetTime;
      }
    }
  };
  loop();
});

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove);
  if (rafId) cancelAnimationFrame(rafId);
  tl?.kill();
});
</script>
