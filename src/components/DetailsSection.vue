<template>
  <section class="details" id="details">
    <div class="details-header">
      <p class="eyebrow">Section C · The Details</p>
      <h2 class="editorial-title details-title">Anatomy of Every Seam</h2>
      <p class="editorial-copy">Select a point on the gown to inspect its construction.</p>
    </div>

    <div class="details-grid">
      <div class="details-stage">
        <img src="/assets/dress_anatomy.png" alt="Deconstructed dress anatomy hotspots" loading="lazy" />
        <button
          v-for="spot in spots"
          :key="spot.id"
          class="spot"
          :class="{ active: activeId === spot.id }"
          :style="{ top: spot.top, left: spot.left }"
          @click="activeId = spot.id"
          @mouseenter="activeId = spot.id"
          :aria-label="spot.label"
        ></button>
      </div>

      <div class="details-list">
        <button
          v-for="spot in spots"
          :key="spot.id"
          class="detail-card"
          :class="{ active: activeId === spot.id }"
          @click="activeId = spot.id"
          @mouseenter="activeId = spot.id"
        >
          <span class="eyebrow">{{ spot.tag }}</span>
          <h3 class="editorial-title">{{ spot.label }}</h3>
          <p class="editorial-copy">{{ spot.desc }}</p>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const activeId = ref('neckline');
const spots = [
  { id: 'neckline', tag: '01 · Neckline', label: 'Square Couture Neckline', top: '28%', left: '50%', desc: 'Cleanly bound edges frame the collarbone with quiet architectural poise.' },
  { id: 'sleeves', tag: '02 · Sleeves', label: 'Gathered Puff Sleeves', top: '24%', left: '33%', desc: 'Delicate elasticated ruffle cuffs create airy sculptural volume.' },
  { id: 'waistline', tag: '03 · Waistline', label: 'Contoured Corset Waist', top: '42%', left: '50%', desc: 'Tailored darts anchor the bodice before releasing into the gathered tiers.' },
  { id: 'fabric', tag: '04 · Fabric', label: 'Cotton & Shefon Weave', top: '56%', left: '44%', desc: 'Featherlight breathable cotton-shefon printed in warm espresso florals.' },
  { id: 'stitching', tag: '05 · Stitching', label: 'Invisible French Seams', top: '65%', left: '58%', desc: 'Fine cream thread encloses every raw edge cleanly inside and out.' },
  { id: 'hemline', tag: '06 · Hemline', label: 'Three-Tier Flowing Hem', top: '82%', left: '50%', desc: 'Generous yardage along the lower tier creates fluid 360-degree movement.' },
];
</script>

<style scoped>
.details {
  padding: 9rem 6vw;
  max-width: 1400px;
  margin: 0 auto;
}

.details-header {
  max-width: 560px;
  margin-bottom: 3.5rem;
}

.details-title {
  font-size: clamp(2.3rem, 4.4vw, 3.8rem);
  margin: 0.8rem 0;
}

.details-grid {
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  gap: 3rem;
  align-items: center;
}

.details-stage {
  position: relative;
  border: 1px solid var(--border-light);
  background: var(--obsidian);
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.details-stage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spot {
  position: absolute;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid var(--ivory);
  background: rgba(18, 16, 14, 0.7);
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: transform 0.25s ease, background 0.25s ease;
}

.spot::after {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: var(--ivory);
}

.spot.active,
.spot:hover {
  transform: translate(-50%, -50%) scale(1.3);
  background: var(--champagne);
}

.details-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.detail-card {
  text-align: left;
  padding: 1rem 1.2rem;
  background: transparent;
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.detail-card.active,
.detail-card:hover {
  background: var(--cream);
  border-color: var(--taupe);
}

.detail-card h3 {
  font-size: 1.25rem;
  margin: 0.2rem 0;
}

@media (max-width: 960px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
