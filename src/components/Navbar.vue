
<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 py-5 flex items-center justify-between"
    :class="[
      isDark
        ? 'bg-[#110f0d]/85 text-[#f6f1e7] border-b border-[#f6f1e7]/10 backdrop-blur-md'
        : isScrolled
          ? 'bg-[#f6f1e7]/90 text-[#221d18] border-b border-[#221d18]/10 backdrop-blur-md'
          : 'bg-transparent text-[#221d18]'
    ]"
  >
    <!-- BRAND LOGO -->
    <a
      href="#home"
      class="flex items-center gap-3 no-underline text-inherit group relative z-10"
      aria-label="Aster Weregnaw Home"
    >
      <!-- Brand Emblem Logo -->
      <img
        src="/assets/logo.jpg"
        alt="Aster Weregnaw Shefon Logo"
        class="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover shadow-md border border-[#cbb799]/50 transition-transform duration-500 group-hover:scale-105 shrink-0"
      />

      <!-- Brand Typography -->
      <div class="flex flex-col">
        <span
          class="font-serif-editorial text-lg md:text-xl tracking-[0.26em] uppercase font-medium leading-tight"
        >
          {{ t.nav.brandName }}
        </span>

        <span
          class="text-[0.58rem] tracking-[0.34em] uppercase opacity-70 mt-1"
        >
          {{ t.nav.brandTag }}
        </span>
      </div>
    </a>

    <!-- DESKTOP NAVIGATION -->
    <nav
      class="hidden lg:flex items-center gap-9"
      aria-label="Primary Navigation"
    >
      <a
        v-for="item in links"
        :key="item.href"
        :href="item.href"
        class="text-[0.68rem] tracking-[0.24em] uppercase opacity-80 hover:opacity-100 transition-opacity duration-300 relative group"
      >
        {{ item.label }}

        <span
          class="absolute left-0 -bottom-2 w-0 h-px bg-current transition-all duration-300 group-hover:w-full"
        ></span>
      </a>
    </nav>

    <!-- RIGHT SIDE ACTIONS -->
    <div class="flex items-center gap-3">
      <!-- EN / አማ Language Switcher -->
      <div
        class="inline-flex items-center border text-[0.62rem] tracking-[0.18em] uppercase"
        :class="isDark ? 'border-[#f6f1e7]/30' : 'border-[#221d18]/30'"
        role="group"
        aria-label="Language Switcher"
      >
        <button
          type="button"
          @click="setLang('en')"
          class="px-2.5 py-1.5 transition-colors cursor-pointer"
          :class="lang === 'en' ? (isDark ? 'bg-[#f6f1e7] text-[#110f0d]' : 'bg-[#221d18] text-[#f6f1e7]') : 'opacity-70 hover:opacity-100'"
        >
          EN
        </button>
        <button
          type="button"
          @click="setLang('am')"
          class="px-2.5 py-1.5 transition-colors cursor-pointer"
          :class="lang === 'am' ? (isDark ? 'bg-[#f6f1e7] text-[#110f0d]' : 'bg-[#221d18] text-[#f6f1e7]') : 'opacity-70 hover:opacity-100'"
        >
          አማ
        </button>
      </div>

      <a
        href="#dresses"
        class="hidden sm:inline-flex px-5 py-2.5 border text-[0.65rem] tracking-[0.24em] uppercase transition-all duration-300"
        :class="
          isDark
            ? 'border-[#f6f1e7]/30 hover:bg-[#f6f1e7] hover:text-[#110f0d]'
            : 'border-[#221d18]/30 hover:bg-[#221d18] hover:text-[#f6f1e7]'
        "
      >
        {{ t.nav.explore }}
      </a>

      <!-- MOBILE MENU BUTTON -->
      <button
        class="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
        @click="mobileOpen = !mobileOpen"
        :aria-expanded="mobileOpen"
        aria-label="Toggle Menu"
      >
        <span
          class="w-6 h-px bg-current block transition-all duration-300"
          :class="mobileOpen ? 'rotate-45 translate-y-[4px]' : ''"
        ></span>

        <span
          class="w-6 h-px bg-current block transition-all duration-300"
          :class="mobileOpen ? '-rotate-45 -translate-y-[2px]' : ''"
        ></span>
      </button>
    </div>

    <!-- MOBILE NAVIGATION -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="lg:hidden absolute top-full left-0 right-0 bg-[#f6f1e7] text-[#221d18] border-b border-[#221d18]/10 px-6 py-8 flex flex-col gap-6 shadow-lg"
      >
        <a
          v-for="item in links"
          :key="item.href"
          :href="item.href"
          @click="mobileOpen = false"
          class="text-xs tracking-[0.24em] uppercase hover:opacity-50 transition-opacity"
        >
          {{ item.label }}
        </a>

        <a
          href="#dresses"
          @click="mobileOpen = false"
          class="sm:hidden inline-flex justify-center px-5 py-3 border border-[#221d18]/30 text-xs tracking-[0.24em] uppercase"
        >
          {{ t.nav.explore }}
        </a>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from '../composables/useI18n.js';

const { lang, t, setLang } = useI18n();

const links = computed(() => [
  { label: t.value.nav.home, href: '#home' },
  { label: t.value.nav.process, href: '#process' },
  { label: t.value.nav.dresses, href: '#dresses' },
  { label: t.value.nav.heritage, href: '#heritage' },
  { label: t.value.nav.contact, href: '#contact' },
]);

const isScrolled = ref(false);
const isDark = ref(false);
const mobileOpen = ref(false);

const onScroll = () => {
  isScrolled.value = window.scrollY > 40;

  const stage6 = document.getElementById('stage-final-reveal');

  if (stage6) {
    const r = stage6.getBoundingClientRect();

    isDark.value = r.top <= 72 && r.bottom >= 72;
  } else {
    isDark.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
