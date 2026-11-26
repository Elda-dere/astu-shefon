<template>
  <footer id="contact" class="bg-[#f6f1e7] text-[#221d18] pt-24 pb-12 px-6 md:px-14">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[#221d18]/12">
      <div>
        <span class="font-serif-editorial text-2xl tracking-[0.24em] uppercase block">{{ t.footer.brandName }}</span>
        <span class="text-xs tracking-[0.14em] text-[#7e6e5b] block mt-1">{{ t.footer.brandSub }}</span>
        <p class="mt-4 text-xs font-light text-[#635647] leading-relaxed max-w-xs">
          {{ t.footer.desc }}
        </p>
      </div>

      <div class="flex flex-col gap-3 text-xs tracking-[0.18em] uppercase">
        <span class="eyebrow mb-1">{{ t.footer.navTitle }}</span>
        <a href="#home" class="hover:opacity-60">{{ t.nav.home }}</a>
        <a href="#process" class="hover:opacity-60">{{ t.nav.process }}</a>
        <a href="#dresses" class="hover:opacity-60">{{ t.nav.dresses }}</a>
        <a href="#heritage" class="hover:opacity-60">{{ t.nav.heritage }}</a>
      </div>

      <div class="flex flex-col gap-2.5 text-xs text-[#635647]">
        <span class="eyebrow mb-1">{{ t.footer.contactTitle }}</span>
        <a href="tel:0982849461" class="text-[#221d18] hover:opacity-70">
          {{ t.footer.phoneLabel }}: {{ t.footer.phone }}
        </a>
        <span>{{ t.footer.address }}</span>
        <a
          href="https://www.google.com/maps/search/?api=1&query=22+Haya+Hulet+Awraris+Tsedi+Plaza+Zeka+22+Mall+Addis+Ababa"
          target="_blank"
          rel="noreferrer"
          class="underline underline-offset-4 text-[#221d18] hover:opacity-70"
        >
          {{ t.footer.mapsLink }}
        </a>

        <div class="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-[0.7rem] tracking-[0.12em] uppercase">
          <a href="https://www.tiktok.com/@asterweregnaw" target="_blank" rel="noreferrer" class="hover:text-[#221d18]">{{ t.footer.tiktokBiz }}</a>
          <a href="https://www.tiktok.com/@astu_shefon" target="_blank" rel="noreferrer" class="hover:text-[#221d18]">{{ t.footer.tiktokPersonal }}</a>
          <a href="https://www.instagram.com/asterweregnaw" target="_blank" rel="noreferrer" class="hover:text-[#221d18]">{{ t.footer.instagram }}</a>
          <a href="https://www.facebook.com/asterweregnaw" target="_blank" rel="noreferrer" class="hover:text-[#221d18]">{{ t.footer.facebook }}</a>
          <a href="https://www.youtube.com/@asterweregnaw" target="_blank" rel="noreferrer" class="hover:text-[#221d18]">{{ t.footer.youtube }}</a>
        </div>
      </div>

      <form @submit.prevent="joined = true" class="flex flex-col gap-3">
        <span class="eyebrow">{{ t.footer.journalTitle }}</span>
        <div class="flex gap-2">
          <input
            type="email"
            required
            :placeholder="t.footer.emailPlaceholder"
            class="flex-1 bg-transparent border border-[#221d18]/25 px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#221d18]"
          />
          <button
            type="submit"
            class="px-4 py-2.5 border border-[#221d18] bg-[#221d18] text-[#f6f1e7] text-[0.65rem] tracking-[0.22em] uppercase cursor-pointer"
          >
            {{ t.footer.joinBtn }}
          </button>
        </div>
        <p v-if="joined" class="text-xs text-[#7e6e5b]">{{ t.footer.joinedMsg }}</p>
      </form>
    </div>

    <div class="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.65rem] tracking-[0.22em] uppercase text-[#7e6e5b]">
      <span>{{ t.footer.copyright }}</span>
      <span>{{ t.footer.tagline }}</span>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from '../composables/useI18n.js';

const { t } = useI18n();
const joined = ref(false);
</script>
