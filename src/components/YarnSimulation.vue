<template>
  <TresGroup :position="position">
    <TresMesh v-for="(geo, idx) in strandGeos" :key="'yarn-' + idx" :geometry="geo" cast-shadow>
      <TresMeshStandardMaterial
        :color="idx === 1 ? '#d6bc8b' : '#f4ede0'"
        :roughness="0.68"
        :metalness="0.12"
      />
    </TresMesh>
  </TresGroup>
</template>

<script setup>
import { shallowRef, watch, onUnmounted } from 'vue';
import * as THREE from 'three';

const props = defineProps({
  position: { type: Array, default: () => [9.5, 0, 0] },
  time: { type: Number, default: 0 },
  twistProgress: { type: Number, default: 0.5 },
});

const strandGeos = shallowRef([]);

const buildStrands = (t, twist) => {
  strandGeos.value.forEach((g) => g.dispose());
  const lanes = [-0.55, 0, 0.55];
  const nextGeos = lanes.map((zOff, idx) => {
    const pts = [];
    const steps = 28;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const x = -2.2 + u * 9.5;
      const wave = Math.sin(u * 10.0 - t * 4.5 + idx * 1.4) * (0.14 * (1.0 - twist * 0.5));
      const y = 0.25 + Math.sin(u * 3.14) * 0.42 + wave;
      const z = zOff + Math.cos(u * 9.0 - t * 4.0 + idx) * 0.08;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 64, 0.022, 8, false);
  });
  strandGeos.value = nextGeos;
};

buildStrands(0, 0.5);

watch(
  () => [props.time, props.twistProgress],
  ([t, twist]) => buildStrands(t, twist)
);

onUnmounted(() => {
  strandGeos.value.forEach((g) => g.dispose());
});
</script>
