<template>
  <section id="dresses" class="py-28 px-6 md:px-14 max-w-7xl mx-auto">
    <div class="max-w-2xl mb-16">
      <p class="eyebrow">Collections · 3D Archive</p>
      <h2 class="font-serif-editorial text-4xl md:text-6xl mt-3 text-[#221d18]">
        The Ethiopian <em class="italic font-normal text-[#7e6e5b]">Couture Gallery</em>
      </h2>
      <p class="mt-4 text-sm md:text-base font-light text-[#635647] leading-relaxed">
        Select any garment to enter its dedicated 3D viewing studio—inspect front, back, and side views,
        orbit 360 degrees, and zoom into the woven texture.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      <article
        v-for="(dress, idx) in COLLECTIONS"
        :key="dress.id"
        class="group cursor-pointer border border-[#221d18]/12 bg-[#efe8da]/50 transition-colors hover:border-[#7e6e5b]"
        @click="selectedDress = dress"
      >
        <div class="relative aspect-[4/5] overflow-hidden bg-[#171310]">
          <img
            :src="dress.previewImage"
            :alt="dress.name"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute top-4 left-4 px-3 py-1 bg-[#110f0d]/75 text-[#f6f1e7] text-[0.6rem] tracking-[0.22em] uppercase">
            0{{ idx + 1 }} · 3D Ready
          </div>
          <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#110f0d]/85 to-transparent text-[#f6f1e7] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span class="text-[0.62rem] tracking-[0.26em] uppercase">Open Interactive 3D View →</span>
          </div>
        </div>

        <div class="p-6">
          <p class="eyebrow">{{ dress.category }}</p>
          <h3 class="font-serif-editorial text-2xl mt-2 text-[#221d18]">{{ dress.name }}</h3>
          <p class="mt-2 text-xs text-[#635647] font-light leading-relaxed">{{ dress.subtitle }}</p>
        </div>
      </article>
    </div>

    <DressDetailModal3D
      v-if="selectedDress"
      :dress="selectedDress"
      @close="selectedDress = null"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { COLLECTIONS } from '../data/collections.js';
import DressDetailModal3D from './DressDetailModal3D.vue';

const selectedDress = ref(null);
</script>
