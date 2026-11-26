<template>
  <div class="min-h-screen bg-[#f6f1e7] text-[#221d18]">
    <Navbar />
    <main>
      <FashionStory />
      <DressViewer />
      <HeritageSection />
    </main>
    <LuxuryFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar.vue';
import FashionStory from './components/FashionStory.vue';
import DressViewer from './components/DressViewer.vue';
import HeritageSection from './components/HeritageSection.vue';
import LuxuryFooter from './components/LuxuryFooter.vue';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

onMounted(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
});

onUnmounted(() => {
  lenis?.destroy();
});
</script>
