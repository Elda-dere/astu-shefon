<template>
  <TresGroup :position="position" :rotation="[0.05, rotY, 0]" :scale="scale">
    <!-- Loaded GLB Model when available -->
    <primitive v-if="loadedGlb" :object="loadedGlb" />

    <!-- Procedural 3D Ethiopian Dress Silhouette (Clearly marked placeholder when GLB is absent) -->
    <TresGroup v-else>
      <!-- Contoured Bodice -->
      <TresMesh :position="[0, 0.78, 0]" cast-shadow receive-shadow>
        <TresCylinderGeometry :args="[0.33, 0.23, 0.86, 28]" />
        <TresMeshStandardMaterial :map="fabricTex" :bump-map="bumpTex" :bump-scale="0.02" :color="tint" :roughness="0.78" />
      </TresMesh>

      <!-- Square Neckline Trim -->
      <TresMesh :position="[0, 1.18, 0.16]" cast-shadow>
        <TresBoxGeometry :args="[0.42, 0.06, 0.18]" />
        <TresMeshStandardMaterial color="#3d2e22" :roughness="0.6" />
      </TresMesh>

      <!-- Sculpted Puff Sleeves + Ruffled Cuffs -->
      <TresGroup v-for="side in [-1, 1]" :key="'sleeve-' + side">
        <TresMesh :position="[side * 0.46, 1.02, 0]" :scale="[1.05, 0.92, 0.95]" cast-shadow>
          <TresSphereGeometry :args="[0.23, 22, 22]" />
          <TresMeshStandardMaterial :map="fabricTex" :color="tint" :roughness="0.8" />
        </TresMesh>
        <TresMesh :position="[side * 0.56, 0.84, 0]" :rotation="[Math.PI / 2, 0, side * 0.3]" cast-shadow>
          <TresTorusGeometry :args="[0.13, 0.025, 10, 24]" />
          <TresMeshStandardMaterial color="#cbb799" :roughness="0.7" />
        </TresMesh>
      </TresGroup>

      <!-- Fitted Waist Sash -->
      <TresMesh :position="[0, 0.34, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.24, 0.25, 0.12, 28]" />
        <TresMeshStandardMaterial color="#4a3728" :roughness="0.65" />
      </TresMesh>

      <!-- Tier 1 Skirt -->
      <TresMesh :position="[0, -0.02, 0]" cast-shadow receive-shadow>
        <TresCylinderGeometry :args="[0.25, 0.58, 0.65, 36, 4, true]" />
        <TresMeshStandardMaterial :map="fabricTex" :bump-map="bumpTex" :bump-scale="0.025" :color="tint" :roughness="0.82" :side="2" />
      </TresMesh>

      <!-- Tier 2 Skirt -->
      <TresMesh :position="[0, -0.58, 0]" cast-shadow receive-shadow>
        <TresCylinderGeometry :args="[0.54, 0.92, 0.68, 40, 4, true]" />
        <TresMeshStandardMaterial :map="fabricTex" :bump-map="bumpTex" :bump-scale="0.025" :color="tint" :roughness="0.82" :side="2" />
      </TresMesh>

      <!-- Tier 3 Flowing Skirt with Subtle Animated Cloth Wave -->
      <TresMesh ref="hemSkirtRef" :position="[0, -1.16, 0]" :geometry="skirtGeo" cast-shadow receive-shadow>
        <TresMeshStandardMaterial :map="fabricTex" :bump-map="bumpTex" :bump-scale="0.03" :color="tint" :roughness="0.84" :side="2" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>

<script setup>
import { shallowRef, watch, onUnmounted } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createWovenFabricTexture, createWeaveBumpTexture } from '../utils/proceduralTextures.js';

const props = defineProps({
  position: { type: Array, default: () => [0, 0, 0] },
  rotY: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  time: { type: Number, default: 0 },
  glbUrl: { type: String, default: '/models/ethiopian-dress.glb' },
  tint: { type: String, default: '#f4ede0' },
});

const emit = defineEmits(['status']);

const loadedGlb = shallowRef(null);
const fabricTex = createWovenFabricTexture();
const bumpTex = createWeaveBumpTexture();

// Build fluted lower skirt BufferGeometry for live subtle cloth wave
const skirtGeo = new THREE.CylinderGeometry(0.86, 1.32, 0.76, 48, 8, true);
const basePos = new Float32Array(skirtGeo.attributes.position.array);

// Add subtle natural pleats at rest
for (let i = 0; i < basePos.length; i += 3) {
  const x = basePos[i];
  const y = basePos[i + 1];
  const z = basePos[i + 2];
  const angle = Math.atan2(z, x);
  const weight = (0.38 - y) / 0.76;
  const pleat = Math.sin(angle * 12.0) * 0.045 * Math.max(0, weight);
  basePos[i] = x + Math.cos(angle) * pleat;
  basePos[i + 2] = z + Math.sin(angle) * pleat;
}
skirtGeo.attributes.position.array.set(basePos);
skirtGeo.computeVertexNormals();

watch(
  () => props.time,
  (t) => {
    if (loadedGlb.value) return;
    const arr = skirtGeo.attributes.position.array;
    for (let i = 0; i < arr.length; i += 3) {
      const bx = basePos[i];
      const by = basePos[i + 1];
      const bz = basePos[i + 2];
      const angle = Math.atan2(bz, bx);
      const weight = Math.max(0, (0.38 - by) / 0.76);
      const wave = Math.sin(t * 1.8 + angle * 3.0) * 0.025 * weight;
      arr[i] = bx + Math.cos(angle) * wave;
      arr[i + 2] = bz + Math.sin(angle) * wave;
    }
    skirtGeo.attributes.position.needsUpdate = true;
  }
);

const disposeObject = (obj) => {
  if (!obj) return;
  obj.traverse((c) => {
    if (c.geometry) c.geometry.dispose();
    if (c.material) {
      const ms = Array.isArray(c.material) ? c.material : [c.material];
      ms.forEach((m) => m.dispose());
    }
  });
};

watch(
  () => props.glbUrl,
  (url) => {
    disposeObject(loadedGlb.value);
    loadedGlb.value = null;
    if (!url) {
      emit('status', { isPlaceholder: true });
      return;
    }
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        loadedGlb.value = gltf.scene;
        emit('status', { isPlaceholder: false });
      },
      undefined,
      () => {
        loadedGlb.value = null;
        emit('status', { isPlaceholder: true });
      }
    );
  },
  { immediate: true }
);

onUnmounted(() => {
  disposeObject(loadedGlb.value);
  skirtGeo.dispose();
  fabricTex.dispose();
  bumpTex.dispose();
});
</script>
