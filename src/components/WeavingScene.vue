<template>
  <TresGroup :position="position" :rotation="[0.22, rotY, 0]">
    <!-- 12 Vertical Warp Threads -->
    <TresMesh
      v-for="w in 12"
      :key="'warp-' + w"
      :position="[(w - 6.5) * 0.22, 0, 0]"
      :scale="[1, Math.max(0.05, weaveProgress), 1]"
      cast-shadow
    >
      <TresCylinderGeometry :args="[0.016, 0.016, 2.7, 8]" />
      <TresMeshStandardMaterial color="#cbb799" :roughness="0.65" />
    </TresMesh>

    <!-- 12 Horizontal Weft Threads with Alternating Over-Under Geometry -->
    <TresMesh
      v-for="(geo, idx) in weftGeos"
      :key="'weft-' + idx"
      :geometry="geo"
      :visible="idx / 12 <= weaveProgress"
      cast-shadow
    >
      <TresMeshStandardMaterial color="#faf7f0" :roughness="0.72" />
    </TresMesh>

    <!-- Gradually Developing Woven Fabric Surface -->
    <TresMesh
      :position="[0, 0, -0.02]"
      :scale="[1, Math.max(0.01, weaveProgress), 1]"
      receive-shadow
    >
      <TresPlaneGeometry :args="[2.75, 2.75, 20, 20]" />
      <TresMeshStandardMaterial
        :map="fabricTex"
        :bump-map="bumpTex"
        :bump-scale="0.03"
        :roughness="0.85"
        :transparent="true"
        :opacity="Math.max(0, (weaveProgress - 0.35) / 0.65) * 0.92"
        :side="2"
      />
    </TresMesh>
  </TresGroup>
</template>

<script setup>
import { onUnmounted } from 'vue';
import * as THREE from 'three';
import { createWovenFabricTexture, createWeaveBumpTexture } from '../utils/proceduralTextures.js';

defineProps({
  position: { type: Array, default: () => [20.0, 0, 0] },
  weaveProgress: { type: Number, default: 1 },
  rotY: { type: Number, default: 0 },
});

const fabricTex = createWovenFabricTexture();
const bumpTex = createWeaveBumpTexture();

// Build alternating over-under weft TubeGeometries
const weftGeos = [];
for (let row = 0; row < 12; row++) {
  const y = (row - 5.5) * 0.22;
  const pts = [];
  for (let col = 0; col <= 24; col++) {
    const x = (col / 24 - 0.5) * 2.7;
    const phase = col + row;
    const z = Math.sin(phase * Math.PI * 0.5) * 0.028;
    pts.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  weftGeos.push(new THREE.TubeGeometry(curve, 48, 0.015, 6, false));
}

onUnmounted(() => {
  weftGeos.forEach((g) => g.dispose());
  fabricTex.dispose();
  bumpTex.dispose();
});
</script>
