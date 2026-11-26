<template>
  <div class="fixed inset-0 z-50 bg-[#110f0d]/95 text-[#f6f1e7] flex flex-col lg:flex-row">
    <!-- Left / Main: Interactive 3D Viewing Scene -->
    <div class="relative flex-1 h-[62vh] lg:h-full bg-[#12100e]">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#12100e]/90">
        <span class="text-xs tracking-[0.3em] uppercase text-[#cbb799]">Loading 3D Garment Studio...</span>
      </div>

      <!-- TresJS Interactive 3D Scene -->
      <TresCanvas clear-color="#12100e" :antialias="true" :dpr="[1, 2]">
        <TresPerspectiveCamera ref="camRef" :position="cameraPos" :fov="40" />
        <OrbitControls :enable-damping="true" :enable-pan="false" :min-distance="2.2" :max-distance="7.5" />
        <TresAmbientLight :intensity="0.85" color="#faf5ea" />
        <TresDirectionalLight :position="[4, 6, 5]" :intensity="1.6" color="#fff4df" />
        <TresDirectionalLight :position="[-4, 2, -4]" :intensity="0.7" color="#cbb799" />

        <!-- Loaded External GLB Model (when present in public/models/) -->
        <primitive v-if="loadedScene" :object="loadedScene" />

        <!-- Clearly Marked Placeholder 3D Garment Silhouette when GLB file is not yet provided -->
        <TresGroup v-else :position="[0, -0.1, 0]">
          <TresMesh :position="[0, 0.72, 0]">
            <TresCylinderGeometry :args="[0.34, 0.25, 0.9, 28]" />
            <TresMeshStandardMaterial :color="dress.tint" :roughness="0.72" />
          </TresMesh>
          <TresMesh :position="[-0.5, 0.96, 0]">
            <TresSphereGeometry :args="[0.24, 20, 20]" />
            <TresMeshStandardMaterial :color="dress.tint" :roughness="0.75" />
          </TresMesh>
          <TresMesh :position="[0.5, 0.96, 0]">
            <TresSphereGeometry :args="[0.24, 20, 20]" />
            <TresMeshStandardMaterial :color="dress.tint" :roughness="0.75" />
          </TresMesh>
          <TresMesh :position="[0, -0.48, 0]">
            <TresConeGeometry :args="[1.1, 1.85, 36, 1, true]" />
            <TresMeshStandardMaterial :color="dress.tint" :roughness="0.78" :side="2" />
          </TresMesh>
          <!-- Tibeb / Hem Accent Ring -->
          <TresMesh :position="[0, -1.35, 0]" :rotation="[Math.PI / 2, 0, 0]">
            <TresTorusGeometry :args="[1.08, 0.02, 10, 48]" />
            <TresMeshStandardMaterial color="#cbb799" :roughness="0.5" :metalness="0.25" />
          </TresMesh>
        </TresGroup>
      </TresCanvas>

      <!-- Camera Angle Presets -->
      <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-[#110f0d]/80 border border-[#f6f1e7]/15 px-3 py-2 backdrop-blur-md">
        <button
          v-for="preset in presets"
          :key="preset.label"
          @click="cameraPos = preset.pos"
          class="px-3 py-1 text-[0.62rem] tracking-[0.22em] uppercase hover:text-[#cbb799] transition-colors cursor-pointer"
        >
          {{ preset.label }}
        </button>
      </div>

      <div
        v-if="!loadedScene && !loading"
        class="absolute top-5 left-5 z-10 px-3.5 py-2 bg-[#110f0d]/85 border border-[#cbb799]/35 text-[0.62rem] tracking-[0.16em] uppercase text-[#cbb799]"
      >
        3D GLB Placeholder — Add {{ dress.glbUrl }} for authentic garment mesh
      </div>
    </div>

    <!-- Right: Editorial Details Panel -->
    <div class="w-full lg:w-[420px] p-8 md:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#f6f1e7]/12 overflow-y-auto">
      <div>
        <div class="flex justify-between items-center mb-8">
          <span class="eyebrow eyebrow-light">{{ dress.category }}</span>
          <button
            @click="$emit('close')"
            class="px-3.5 py-1.5 border border-[#f6f1e7]/25 text-[0.64rem] tracking-[0.22em] uppercase hover:bg-[#f6f1e7] hover:text-[#110f0d] transition-colors cursor-pointer"
          >
            Return
          </button>
        </div>

        <h2 class="font-serif-editorial text-4xl text-[#f6f1e7]">{{ dress.name }}</h2>
        <p class="mt-4 text-sm font-light text-[#f6f1e7]/75 leading-relaxed">{{ dress.description }}</p>

        <div class="mt-8 pt-6 border-t border-[#f6f1e7]/12 space-y-4">
          <div>
            <span class="eyebrow eyebrow-light block">Textile</span>
            <p class="text-sm font-light mt-1">{{ dress.fabric }}</p>
          </div>
          <div>
            <span class="eyebrow eyebrow-light block">Embroidery &amp; Finish</span>
            <p class="text-sm font-light mt-1">{{ dress.embroidery }}</p>
          </div>
        </div>
      </div>

      <p class="mt-8 text-[0.65rem] tracking-[0.2em] uppercase text-[#cbb799]/80">
        Drag to rotate 360° · Scroll or pinch to zoom
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef, watch, onUnmounted } from 'vue';
import { OrbitControls } from '@tresjs/cientos';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const props = defineProps({
  dress: { type: Object, required: true },
});
defineEmits(['close']);

const loading = ref(true);
const loadedScene = shallowRef(null);
const cameraPos = ref([0, 0.2, 4.4]);

const presets = [
  { label: 'Front', pos: [0, 0.2, 4.4] },
  { label: 'Left', pos: [-4.4, 0.2, 0] },
  { label: 'Back', pos: [0, 0.2, -4.4] },
  { label: 'Right', pos: [4.4, 0.2, 0] },
];

const disposeScene = (obj) => {
  if (!obj) return;
  obj.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => m.dispose());
    }
  });
};

watch(
  () => props.dress.glbUrl,
  (url) => {
    disposeScene(loadedScene.value);
    loadedScene.value = null;
    loading.value = true;

    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        loadedScene.value = gltf.scene;
        loading.value = false;
      },
      undefined,
      () => {
        // Gracefully fall back to clearly labeled placeholder silhouette if GLB file isn't present
        loadedScene.value = null;
        loading.value = false;
      }
    );
  },
  { immediate: true }
);

onUnmounted(() => {
  disposeScene(loadedScene.value);
});
</script>
