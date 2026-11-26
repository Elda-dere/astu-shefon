<template>
  <TresPoints ref="pointsRef">
    <TresBufferGeometry ref="geoRef">
      <TresBufferAttribute :args="[positions, 3]" attach="attributes-position" />
    </TresBufferGeometry>
    <TresPointsMaterial
      color="#f5efe2"
      :size="pointSize"
      :transparent="true"
      :opacity="0.78"
      :depth-write="false"
    />
  </TresPoints>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  /** 0 = clustered around cotton boll, 1 = dispersed toward textile machine & aligned */
  progress: { type: Number, default: 0 },
  time: { type: Number, default: 0 },
});

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const COUNT = isMobile ? 900 : 2400;
const pointSize = isMobile ? 0.042 : 0.032;

const geoRef = ref(null);
const pointsRef = ref(null);

// Precompute start (cotton cluster), mid (streaming toward machine), and end (aligned yarn line)
const startPos = new Float32Array(COUNT * 3);
const streamPos = new Float32Array(COUNT * 3);
const positions = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 0.4 + Math.random() * 1.45;

  startPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  startPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  startPos[i * 3 + 2] = r * Math.cos(phi);

  // Stream toward TextileMachine at x = +8..+14, aligning along 3 yarn lanes
  const lane = (i % 3) - 1;
  const u = i / COUNT;
  streamPos[i * 3] = 2.0 + u * 14.0;
  streamPos[i * 3 + 1] = lane * 0.32 + Math.sin(u * 18.0) * 0.12;
  streamPos[i * 3 + 2] = Math.cos(u * 16.0) * 0.18;

  positions[i * 3] = startPos[i * 3];
  positions[i * 3 + 1] = startPos[i * 3 + 1];
  positions[i * 3 + 2] = startPos[i * 3 + 2];
}

watch(
  () => [props.progress, props.time],
  ([p, t]) => {
    const geo = geoRef.value;
    if (!geo || !geo.attributes?.position) return;
    const arr = geo.attributes.position.array;
    const blend = Math.max(0, Math.min(1, p));

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const flutter = Math.sin(t * 1.6 + i * 0.13) * (0.04 + blend * 0.06);
      arr[ix] = startPos[ix] + (streamPos[ix] - startPos[ix]) * blend;
      arr[ix + 1] = startPos[ix + 1] + (streamPos[ix + 1] - startPos[ix + 1]) * blend + flutter;
      arr[ix + 2] = startPos[ix + 2] + (streamPos[ix + 2] - startPos[ix + 2]) * blend;
    }
    geo.attributes.position.needsUpdate = true;
  }
);

onUnmounted(() => {
  geoRef.value?.dispose?.();
});
</script>
