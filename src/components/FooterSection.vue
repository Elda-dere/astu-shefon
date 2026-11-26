<template>
  <section class="final-experience" ref="finalRef">
    <div class="signature-wrap">
      <svg class="signature-svg" viewBox="0 0 420 120" aria-hidden="true">
        <path
          ref="sigPath"
          class="sig-path"
          d="M 20,84 C 65,18 110,18 128,74 C 145,120 190,22 228,58 C 262,90 302,16 346,62 C 370,88 394,54 405,46"
        />
      </svg>
      <p class="eyebrow">Atelier Élan · Signature</p>
      <h2 class="editorial-title final-headline">
        Every thread has a story.<br /><em>Every dress has a soul.</em>
      </h2>
    </div>
  </section>

  <footer class="site-footer">
    <div class="footer-grid">
      <div>
        <span class="footer-logo">ATELIER ÉLAN</span>
        <p class="editorial-copy footer-desc">
          Contemporary haute couture rooted in natural cotton, fine threadwork, and timeless feminine form.
        </p>
      </div>

      <div class="footer-col">
        <span class="eyebrow">House</span>
        <a href="#collection">Collections</a>
        <a href="#philosophy">Our Story</a>
        <a href="#craftsmanship">Craftsmanship</a>
        <a href="#dress-360">360° Study</a>
      </div>

      <div class="footer-col">
        <span class="eyebrow">Connect</span>
        <a href="mailto:atelier@atelierelan.com">atelier@atelierelan.com</a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
      </div>

      <form class="newsletter" @submit.prevent="subscribed = true">
        <span class="eyebrow">Private Journal</span>
        <div class="news-row">
          <input type="email" placeholder="Your email address" required />
          <button type="submit" class="btn-atelier">Join</button>
        </div>
        <p v-if="subscribed" class="sub-note">Thank you. You are on the Atelier Élan list.</p>
      </form>
    </div>

    <div class="footer-bottom">
      <span>© 2026 Atelier Élan. All rights reserved.</span>
      <span>From Cotton to Couture</span>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const finalRef = ref(null);
const sigPath = ref(null);
const subscribed = ref(false);

onMounted(() => {
  const path = sigPath.value;
  if (!path) return;
  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;

  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: finalRef.value,
      start: 'top 72%',
      once: true,
    },
  });
});
</script>

<style scoped>
.final-experience {
  padding: 9rem 6vw 7rem;
  text-align: center;
  background: var(--ivory);
}

.signature-wrap {
  max-width: 780px;
  margin: 0 auto;
}

.signature-svg {
  width: min(340px, 80vw);
  margin: 0 auto 1.6rem;
  display: block;
}

.sig-path {
  fill: none;
  stroke: var(--taupe);
  stroke-width: 1.8;
  stroke-linecap: round;
}

.final-headline {
  font-size: clamp(2.4rem, 4.8vw, 4.2rem);
  margin-top: 1rem;
}

.final-headline em {
  font-style: italic;
}

.site-footer {
  border-top: 1px solid var(--border-light);
  background: var(--cream);
  padding: 5rem 6vw 2.8rem;
}

.footer-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.3fr 0.7fr 0.8fr 1.2fr;
  gap: 3rem;
}

.footer-logo {
  font-family: var(--serif);
  font-size: 1.5rem;
  letter-spacing: 0.24em;
  display: block;
  margin-bottom: 0.9rem;
}

.footer-desc {
  max-width: 300px;
  font-size: 0.88rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.footer-col a {
  text-decoration: none;
  color: var(--espresso);
  font-size: 0.86rem;
  opacity: 0.78;
}

.footer-col a:hover {
  opacity: 1;
}

.news-row {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.9rem;
}

.news-row input {
  flex: 1;
  background: var(--ivory);
  border: 1px solid var(--border-light);
  padding: 0.68rem 0.9rem;
  font-family: var(--sans);
  font-size: 0.86rem;
}

.sub-note {
  margin-top: 0.6rem;
  font-size: 0.8rem;
  color: var(--taupe);
}

.footer-bottom {
  max-width: 1400px;
  margin: 4rem auto 0;
  padding-top: 1.6rem;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--taupe);
}

@media (max-width: 960px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
