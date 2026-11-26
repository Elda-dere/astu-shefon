<template>
  <section class="collection" id="collection">
    <div class="collection-header">
      <p class="eyebrow">Section A · The Collection</p>
      <h2 class="editorial-title section-h2">Silhouettes Woven<br />from <em>Living Fibre</em></h2>
      <p class="editorial-copy">
        Each piece is cut in small editions from breathable natural cotton and sheer hand-finished shefon.
      </p>
    </div>

    <div class="asym-grid">
      <article class="piece piece-large" v-for="(item, i) in pieces" :key="item.name" :class="'piece-' + i">
        <div class="piece-media">
          <img :src="item.img" :alt="item.name" loading="lazy" />
        </div>
        <div class="piece-info">
          <span class="eyebrow">{{ item.category }}</span>
          <h3 class="editorial-title">{{ item.name }}</h3>
          <p class="editorial-copy">{{ item.desc }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pieces = [
  {
    name: 'L’Aurore Floral Gown',
    category: 'Haute Couture · Signature Edition',
    desc: 'Cream-ivory cotton-shefon layered with painterly espresso blossoms, sculpted puff sleeves, and three sweeping gathered tiers.',
    img: '/assets/dress.jpg',
  },
  {
    name: 'Nuit De Shefon Study',
    category: 'Deconstructed Atelier',
    desc: 'Suspended architectural bodice and sheer voluminous sleeves balanced for weightless evening movement.',
    img: '/assets/dress_anatomy.png',
  },
  {
    name: 'Champagne Filigree',
    category: 'Artisanal Textile',
    desc: 'Fine hand-twisted cream cotton thread tensioned for micro-gathers, French seams, and luminous drape.',
    img: '/assets/thread.jpg',
  },
];

onMounted(() => {
  gsap.utils.toArray('.piece-media img').forEach((img) => {
    gsap.fromTo(
      img,
      { clipPath: 'inset(12% 0% 12% 0%)', scale: 1.08 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: img, start: 'top 82%', once: true },
      }
    );
  });
});
</script>

<style scoped>
.collection {
  padding: 9rem 6vw;
  max-width: 1400px;
  margin: 0 auto;
}

.collection-header {
  max-width: 560px;
  margin-bottom: 5rem;
}

.section-h2 {
  font-size: clamp(2.5rem, 5vw, 4.4rem);
  margin: 0.9rem 0 1.2rem;
}

.section-h2 em {
  font-style: italic;
}

.asym-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 4.5rem 3.5rem;
  align-items: start;
}

.piece-0 {
  grid-row: span 2;
}

.piece-1 {
  margin-top: 4rem;
}

.piece-media {
  overflow: hidden;
  background: var(--cream);
  border: 1px solid var(--border-light);
}

.piece-media img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.piece:hover .piece-media img {
  transform: scale(1.03);
}

.piece-info {
  padding-top: 1.4rem;
}

.piece-info h3 {
  font-size: 1.95rem;
  margin: 0.45rem 0 0.6rem;
}

@media (max-width: 900px) {
  .asym-grid {
    grid-template-columns: 1fr;
  }
  .piece-0,
  .piece-1 {
    grid-row: auto;
    margin-top: 0;
  }
}
</style>
