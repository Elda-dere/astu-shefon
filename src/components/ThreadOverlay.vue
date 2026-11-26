<template>
  <div class="thread-overlay" aria-hidden="true">
    <svg class="thread-svg" viewBox="0 0 1440 4800" preserveAspectRatio="none">
      <defs>
        <filter id="threadShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#26201a" flood-opacity="0.14" />
        </filter>
      </defs>
      <!-- Continuous organic thread connecting every section -->
      <path
        ref="threadPath"
        class="thread-line"
        filter="url(#threadShadow)"
        d="M -60,260
           C 280,240 460,520 760,460
           C 1080,395 1260,640 1180,920
           C 1090,1220 340,1180 260,1520
           C 180,1860 980,1920 1190,2240
           C 1340,2470 760,2680 420,2860
           C 120,3020 260,3340 720,3480
           C 1140,3610 1240,3920 860,4180
           C 540,4400 460,4580 720,4720"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const threadPath = ref(null);

onMounted(() => {
  const path = threadPath.value;
  if (!path) return;
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;

  gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
    },
  });
});
</script>

<style scoped>
.thread-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 40;
  overflow: hidden;
  opacity: 0.52;
}

.thread-svg {
  width: 100%;
  height: 100%;
}

.thread-line {
  fill: none;
  stroke: #b99f77;
  stroke-width: 1.65;
  stroke-linecap: round;
}
</style>
