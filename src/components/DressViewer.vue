<template>
  <section id="dresses" class="py-24 px-6 md:px-14 bg-[#12100e] text-[#f6f1e7]">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p class="eyebrow eyebrow-light">{{ t.dresses.eyebrow }}</p>
          <h2 class="font-serif-editorial text-4xl md:text-6xl mt-3">
            {{ t.dresses.title1 }} <em class="italic font-normal text-[#cbb799]">{{ t.dresses.title2 }}</em>
          </h2>
        </div>
        <p class="max-w-md text-xs md:text-sm font-light text-[#f6f1e7]/70 leading-relaxed">
          {{ t.dresses.intro }}
        </p>
      </div>

      <!-- Collection Selector Tabs -->
      <div class="flex flex-wrap gap-2.5 mb-8">
        <button
          v-for="item in COLLECTIONS"
          :key="item.id"
          @click="selected = item"
          class="px-4 py-2 text-[0.65rem] tracking-[0.2em] uppercase border transition-colors cursor-pointer"
          :class="selected.id === item.id
            ? 'bg-[#f6f1e7] text-[#12100e] border-[#f6f1e7]'
            : 'border-[#f6f1e7]/20 text-[#f6f1e7]/75 hover:border-[#cbb799]'"
        >
          {{ t.dresses.items[item.id]?.category || item.category }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <!-- Interactive 3D Video Stage -->
        <div
          class="lg:col-span-8 relative h-[64vh] min-h-[480px] border border-[#f6f1e7]/15 bg-[#090807] overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel.prevent="onWheel"
        >
          <!-- Subtle Studio Glow -->
          <div
            class="absolute inset-0 pointer-events-none"
            style="background: radial-gradient(circle at 50% 45%, rgba(214,188,139,0.12) 0%, rgba(18,16,14,0.85) 70%);"
          ></div>

          <!-- 3D Dress Video -->
          <div
            class="relative z-10 h-[92%] aspect-square flex items-center justify-center transition-transform duration-150 ease-out"
            :style="{ transform: `scale(${zoom})` }"
          >
            <video
              :key="selected.id"
              ref="videoRef"
              :src="selected.videoUrl"
              autoplay
              muted
              loop
              playsinline
              preload="auto"
              class="w-full h-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.85)] pointer-events-none"
            ></video>
          </div>

          <!-- Mode & Angle Indicator -->
          <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              @click.stop="toggleAutoSpin"
              class="px-3 py-1.5 bg-[#12100e]/85 border border-[#f6f1e7]/20 text-[0.62rem] tracking-[0.2em] uppercase text-[#cbb799] hover:border-[#cbb799] cursor-pointer"
            >
              {{ autoSpin ? t.dresses.autoOn : t.dresses.autoOff }}
            </button>
          </div>

          <!-- Zoom & Angle Buttons -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-[#12100e]/85 border border-[#f6f1e7]/15 px-3 py-2 backdrop-blur-md">
            <button
              v-for="view in views"
              :key="view.label"
              @click.stop="scrubToFraction(view.frac)"
              class="px-3 py-1 text-[0.6rem] tracking-[0.22em] uppercase hover:text-[#cbb799] transition-colors cursor-pointer"
            >
              {{ t.dresses.views[view.label] }}
            </button>
            <span class="w-px h-3.5 bg-[#f6f1e7]/20 mx-1"></span>
            <button @click.stop="adjustZoom(0.15)" class="px-2 py-1 text-xs hover:text-[#cbb799] cursor-pointer" aria-label="Zoom in">+</button>
            <button @click.stop="adjustZoom(-0.15)" class="px-2 py-1 text-xs hover:text-[#cbb799] cursor-pointer" aria-label="Zoom out">−</button>
          </div>
        </div>

        <!-- Garment Details & Hover Inspection -->
        <div class="lg:col-span-4 border border-[#f6f1e7]/15 p-7 flex flex-col justify-between bg-[#161310]">
          <div>
            <p class="eyebrow eyebrow-light">{{ selectedCopy.category }}</p>
            <h3 class="font-serif-editorial text-3xl mt-2">{{ selectedCopy.name }}</h3>
            <p class="mt-3 text-xs md:text-sm font-light text-[#f6f1e7]/75 leading-relaxed">
              {{ selectedCopy.description }}
            </p>

            <div class="mt-6 pt-5 border-t border-[#f6f1e7]/12 space-y-3 text-xs">
              <div>
                <span class="eyebrow eyebrow-light block">{{ t.dresses.fabricLabel }}</span>
                <p class="mt-1 text-[#f6f1e7]/85">{{ selectedCopy.fabric }}</p>
              </div>
              <div>
                <span class="eyebrow eyebrow-light block">{{ t.dresses.embroideryLabel }}</span>
                <p class="mt-1 text-[#f6f1e7]/85">{{ selectedCopy.embroidery }}</p>
              </div>
            </div>

            <!-- Hover to Reveal Garment Zone Details -->
            <div class="mt-6 pt-5 border-t border-[#f6f1e7]/12">
              <span class="eyebrow eyebrow-light block mb-3">{{ t.dresses.hoverLabel }}</span>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="part in t.dresses.zones"
                  :key="part.title"
                  @mouseenter="hoveredZone = part"
                  @mouseleave="hoveredZone = null"
                  class="px-3 py-2 border border-[#f6f1e7]/15 text-[0.65rem] tracking-[0.14em] uppercase hover:border-[#cbb799] transition-colors cursor-default"
                >
                  {{ part.title }}
                </div>
              </div>
              <p v-if="hoveredZone" class="mt-3 text-xs text-[#cbb799] leading-relaxed">
                {{ hoveredZone.detail }}
              </p>
            </div>
          </div>

          <p class="mt-6 text-[0.6rem] tracking-[0.2em] uppercase text-[#f6f1e7]/45">
            {{ t.dresses.dragHint }}
          </p>
        </div>
      </div>

      <!-- Always-visible Left-to-Right Horizontal Sliding Habesha Kemis Collection (6 Photos) -->
      <div class="mt-14 pt-10 border-t border-[#f6f1e7]/12">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <h3 class="font-serif-editorial text-2xl md:text-3xl text-[#f6f1e7]">
            {{ t.dresses.habeshaGalleryTitle }}
          </h3>
          <span class="text-[0.62rem] tracking-[0.22em] uppercase text-[#cbb799]">
            {{ t.dresses.habeshaGallerySub }}
          </span>
        </div>

        <div class="habesha-marquee overflow-hidden relative">
          <div class="habesha-track flex gap-5 w-max">
            <div
              v-for="(photo, i) in [...habeshaPhotos, ...habeshaPhotos]"
              :key="'hk-' + i"
              class="w-56 sm:w-64 md:w-72 shrink-0 border border-[#f6f1e7]/15 bg-[#161310] overflow-hidden group"
            >
              <img
                :src="photo"
                alt="Habesha Kemis Collection"
                loading="lazy"
                class="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { COLLECTIONS } from '../data/collections.js';
import { useI18n } from '../composables/useI18n.js';

const { t } = useI18n();
const selected = ref(COLLECTIONS[0]);
const selectedCopy = computed(() => t.value.dresses.items[selected.value.id] || selected.value);
const hoveredZone = ref(null);
const habeshaPhotos = [
  '/assets/habesha/habesha_1.jpg',
  '/assets/habesha/habesha_2.jpg',
  '/assets/habesha/habesha_3.jpg',
  '/assets/habesha/habesha_4.jpg',
  '/assets/habesha/habesha_5.jpg',
  '/assets/habesha/habesha_6.jpg',
];
const videoRef = ref(null);
const autoSpin = ref(true);
const zoom = ref(1.0);

let dragging = false;
let lastX = 0;

const views = [
  { label: 'Front', frac: 0.0 },
  { label: 'Left', frac: 0.25 },
  { label: 'Back', frac: 0.5 },
  { label: 'Right', frac: 0.75 },
];

const garmentZones = [
  { title: 'Neckline', detail: 'Structured square neckline bound with hand-finished cotton trim.' },
  { title: 'Puff Sleeves', detail: 'Gathered voluminous sleeves with delicate elasticated ruffle cuffs.' },
  { title: 'Waistband', detail: 'Contoured waist sash anchoring the bodice before releasing the tiers.' },
  { title: 'Tibeb Hem', detail: 'Three-tier gathered floral skirt with sweeping studio movement.' },
];

const toggleAutoSpin = () => {
  const v = videoRef.value;
  if (!v) return;
  autoSpin.value = !autoSpin.value;
  if (autoSpin.value) v.play().catch(() => {});
  else v.pause();
};

const scrubToFraction = (frac) => {
  const v = videoRef.value;
  if (!v || !v.duration) return;
  autoSpin.value = false;
  v.pause();
  v.currentTime = frac * v.duration;
};

const adjustZoom = (delta) => {
  zoom.value = Math.max(0.85, Math.min(1.65, +(zoom.value + delta).toFixed(2)));
};

const onPointerDown = (e) => {
  dragging = true;
  lastX = e.clientX;
  autoSpin.value = false;
  videoRef.value?.pause();
  e.currentTarget.setPointerCapture?.(e.pointerId);
};

const onPointerMove = (e) => {
  if (!dragging) return;
  const v = videoRef.value;
  if (!v || !v.duration) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  const next = (v.currentTime + (dx / 450) * v.duration) % v.duration;
  v.currentTime = next < 0 ? next + v.duration : next;
};

const onPointerUp = () => {
  dragging = false;
};

const onWheel = (e) => {
  adjustZoom(e.deltaY < 0 ? 0.08 : -0.08);
};
</script>

<style scoped>
@keyframes scrollLeftToRight {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

.habesha-track {
  animation: scrollLeftToRight 28s linear infinite;
}

.habesha-marquee:hover .habesha-track {
  animation-play-state: paused;
}
</style>
