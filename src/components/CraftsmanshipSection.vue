<template>
  <section class="craft" id="craftsmanship">
    <div class="craft-top">
      <p class="eyebrow">Section B · The Art of Craftsmanship</p>
      <h2 class="editorial-title craft-title">Sixty Hours of Quiet<br /><em>Handwork</em></h2>
    </div>

    <div class="craft-layout">
      <div class="craft-visual">
        <img src="/assets/dress_detail.png" alt="Macro hand stitching and floral shefon weave" loading="lazy" />
      </div>

      <div class="craft-steps">
        <div class="craft-step" v-for="step in steps" :key="step.num">
          <span class="step-num">{{ step.num }}</span>
          <div>
            <h3 class="editorial-title">{{ step.title }}</h3>
            <p class="editorial-copy">{{ step.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  { num: '01', title: 'Raw Selection & Spinning', text: 'Long-staple natural cotton bolls are combed and spun into high-twist champagne cream thread.' },
  { num: '02', title: 'Precision Pattern Cutting', text: 'Each bodice panel and cascading skirt tier is cut along the grain for effortless symmetry.' },
  { num: '03', title: 'Hand Stitching & Gathering', text: 'Micro-gathers along the puff sleeves and waistline are tensioned by hand for soft architectural volume.' },
  { num: '04', title: 'Botanical Printing & Finishing', text: 'Espresso floral motifs and invisible French seams complete the weightless shefon drape.' },
];
</script>

<style scoped>
.craft {
  padding: 8rem 6vw;
  background: var(--cream);
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}

.craft-top {
  max-width: 1400px;
  margin: 0 auto 4rem;
}

.craft-title {
  font-size: clamp(2.4rem, 4.6vw, 4.1rem);
  margin-top: 0.9rem;
}

.craft-title em {
  font-style: italic;
}

.craft-layout {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 4.5rem;
  align-items: center;
}

.craft-visual {
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.craft-visual img {
  width: 100%;
  aspect-ratio: 16 / 11;
  object-fit: cover;
}

.craft-steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.craft-step {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 1.2rem;
  padding-bottom: 1.8rem;
  border-bottom: 1px solid var(--border-light);
}

.step-num {
  font-family: var(--serif);
  font-size: 1.3rem;
  color: var(--taupe);
}

.craft-step h3 {
  font-size: 1.55rem;
  margin-bottom: 0.35rem;
}

@media (max-width: 900px) {
  .craft-layout {
    grid-template-columns: 1fr;
  }
}
</style>
