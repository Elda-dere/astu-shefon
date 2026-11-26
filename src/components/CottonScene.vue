<template>
  <TresGroup :position="position" :rotation="[rotX, rotY, 0]" :scale="scale">
    <!-- 5 Multi-Cluster Cotton Lobes that separate smoothly on scroll -->
    <TresGroup
      v-for="(lobe, idx) in lobes"
      :key="'lobe-' + idx"
      :position="[
        lobe.base[0] + lobe.dir[0] * separation,
        lobe.base[1] + lobe.dir[1] * separation,
        lobe.base[2] + lobe.dir[2] * separation,
      ]"
      :scale="1 - separation * 0.18"
    >
      <TresMesh cast-shadow receive-shadow>
        <TresSphereGeometry :args="[lobe.r, 28, 28]" />
        <TresMeshStandardMaterial color="#faf7f0" :roughness="0.94" :metalness="0.02" />
      </TresMesh>
      <!-- Secondary micro-tufts for organic cotton silhouette -->
      <TresMesh
        v-for="(tuft, tIdx) in lobe.tufts"
        :key="'tuft-' + tIdx"
        :position="tuft"
        cast-shadow
      >
        <TresSphereGeometry :args="[lobe.r * 0.56, 18, 18]" />
        <TresMeshStandardMaterial color="#f6f1e7" :roughness="0.96" :metalness="0.0" />
      </TresMesh>
    </TresGroup>

    <!-- Woody Calyx Bracts -->
    <TresMesh
      v-for="(leaf, idx) in calyx"
      :key="'calyx-' + idx"
      :position="leaf.pos"
      :rotation="leaf.rot"
      cast-shadow
    >
      <TresConeGeometry :args="[0.22, 0.78, 5]" />
      <TresMeshStandardMaterial color="#7a5b3a" :roughness="0.86" :metalness="0.04" />
    </TresMesh>

    <!-- Natural Stem -->
    <TresMesh :position="[0, -0.92, 0]" cast-shadow>
      <TresCylinderGeometry :args="[0.055, 0.085, 0.75, 12]" />
      <TresMeshStandardMaterial color="#5d442b" :roughness="0.9" />
    </TresMesh>
  </TresGroup>
</template>

<script setup>
defineProps({
  position: { type: Array, default: () => [0, 0, 0] },
  rotX: { type: Number, default: 0.15 },
  rotY: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  separation: { type: Number, default: 0 },
});

const lobes = [
  { base: [0, 0.34, 0.22], dir: [0, 1.1, 0.6], r: 0.48, tufts: [[0.22, 0.18, 0.1], [-0.2, 0.15, 0.12]] },
  { base: [-0.46, 0.08, 0.08], dir: [-1.2, 0.5, 0.3], r: 0.45, tufts: [[-0.22, 0.14, 0.1], [-0.15, -0.18, 0.15]] },
  { base: [0.46, 0.08, 0.08], dir: [1.2, 0.5, 0.3], r: 0.45, tufts: [[0.22, 0.14, 0.1], [0.15, -0.18, 0.15]] },
  { base: [-0.25, -0.22, 0.24], dir: [-0.7, -0.4, 0.9], r: 0.42, tufts: [[-0.18, -0.12, 0.16]] },
  { base: [0.25, -0.22, 0.24], dir: [0.7, -0.4, 0.9], r: 0.42, tufts: [[0.18, -0.12, 0.16]] },
];

const calyx = [
  { pos: [0, -0.56, 0.38], rot: [0.58, 0, 0] },
  { pos: [-0.52, -0.34, 0.14], rot: [0.22, 0, 0.78] },
  { pos: [0.52, -0.34, 0.14], rot: [0.22, 0, -0.78] },
  { pos: [0, -0.44, -0.34], rot: [-0.62, 0, 0] },
];
</script>
