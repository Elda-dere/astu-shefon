<template>
  <section class="philosophy" id="philosophy">
    <div class="phil-grid">
      <div class="phil-text">
        <p class="eyebrow">Section D · Design Philosophy</p>
        <h2 class="editorial-title phil-headline">
          Beauty is found in<br /><em>every thread.</em>
        </h2>
        <p class="editorial-copy phil-body">
          At Atelier Élan, couture is never rushed. We begin in the quiet patience of raw cotton
          harvests, honor the hand of the spinner, and shape each dress so that nature’s lightest
          fibres move effortlessly with the body. Nothing is excess; every fold has a reason.
        </p>
      </div>

      <div class="phil-media">
        <img src="/assets/cotton.jpg" alt="Pure natural cotton origin" loading="lazy" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.philosophy {
  padding: 9rem 6vw;
  background: var(--beige);
  border-top: 1px solid var(--border-light);
}

.phil-grid {
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4.5rem;
  align-items: center;
}

.phil-headline {
  font-size: clamp(2.6rem, 5.2vw, 4.8rem);
  margin: 1rem 0 1.8rem;
}

.phil-headline em {
  font-style: italic;
}

.phil-body {
  max-width: 500px;
}

.phil-media {
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.phil-media img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

@media (max-width: 900px) {
  .phil-grid {
    grid-template-columns: 1fr;
  }
}
</style>
