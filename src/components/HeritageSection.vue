<template>
  <section id="heritage" class="py-28 px-6 md:px-14 bg-[#efe8da] border-t border-b border-[#221d18]/10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <div class="lg:col-span-6 space-y-5">
        <p class="eyebrow">{{ t.heritage.eyebrow }}</p>
        <h2 class="font-serif-editorial text-4xl md:text-6xl leading-[1.03] text-[#221d18]">
          {{ t.heritage.title1 }}<br />
          <em class="italic font-normal text-[#7e6e5b]">{{ t.heritage.title2 }}</em>
        </h2>
        <p class="font-serif-editorial italic text-lg text-[#5f5346]">
          {{ t.heritage.subtitle }}
        </p>

        <div class="space-y-4 text-sm md:text-[0.95rem] font-light text-[#5f5346] leading-relaxed max-w-xl pt-2">
          <p>{{ t.heritage.p1 }}</p>
          <p>{{ t.heritage.p2 }}</p>
          <p>{{ t.heritage.p3 }}</p>
          <p>{{ t.heritage.p4 }}</p>
          <p class="font-medium text-[#221d18] pt-1">{{ t.heritage.mission }}</p>
        </div>

        <div class="pt-6 border-t border-[#221d18]/12">
          <p class="eyebrow mb-5">{{ t.heritage.stepsHeading }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div v-for="step in t.heritage.steps" :key="step.num">
              <span class="font-serif-editorial text-sm text-[#7e6e5b]">{{ step.num }}.</span>
              <h3 class="font-serif-editorial text-xl text-[#221d18] inline ml-1.5">{{ step.title }}</h3>
              <p class="text-xs text-[#635647] mt-1.5 leading-relaxed">
                {{ step.body }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-6 grid grid-cols-2 gap-5 lg:sticky lg:top-28">
        <div class="overflow-hidden border border-[#221d18]/12 bg-[#f6f1e7]">
          <img src="/assets/about_photo.jpg" alt="Astu Chiffon Ethiopian couture portrait" loading="lazy" class="w-full aspect-[3/4] object-cover object-top" />
        </div>
        <div class="overflow-hidden border border-[#221d18]/12 bg-[#171310] mt-10">
          <img src="/assets/thread.jpg" alt="Spun natural cotton thread" loading="lazy" class="w-full aspect-[3/4] object-cover" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js';

const { t } = useI18n();
</script>
