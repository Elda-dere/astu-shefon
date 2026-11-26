<template>
  <TresGroup :position="position">
    <!-- Machine Chassis Frame -->
    <TresMesh :position="[0, -0.95, 0]" receive-shadow cast-shadow>
      <TresBoxGeometry :args="[5.2, 0.24, 2.2]" />
      <TresMeshStandardMaterial color="#3c332a" :roughness="0.55" :metalness="0.6" />
    </TresMesh>

    <!-- Conveyor Belt Bed -->
    <TresMesh :position="[-0.6, -0.76, 0]" receive-shadow>
      <TresBoxGeometry :args="[3.6, 0.12, 1.5]" />
      <TresMeshStandardMaterial color="#241e19" :roughness="0.82" />
    </TresMesh>

    <!-- Moving Conveyor Slats -->
    <TresMesh
      v-for="s in 9"
      :key="'slat-' + s"
      :position="[(((s * 0.42 + time * 0.85) % 3.6) - 2.4), -0.69, 0]"
      cast-shadow
    >
      <TresBoxGeometry :args="[0.08, 0.03, 1.46]" />
      <TresMeshStandardMaterial color="#cbb799" :roughness="0.5" :metalness="0.3" />
    </TresMesh>

    <!-- Rotating Carding & Compression Rollers -->
    <TresMesh :position="[-1.3, 0.1, 0]" :rotation="[0, 0, Math.PI / 2]" :rotation-x="time * 2.4" cast-shadow>
      <TresCylinderGeometry :args="[0.38, 0.38, 1.65, 24]" />
      <TresMeshStandardMaterial color="#b49c7c" :roughness="0.38" :metalness="0.65" />
    </TresMesh>

    <TresMesh :position="[-0.1, 0.45, 0]" :rotation="[0, 0, Math.PI / 2]" :rotation-x="-time * 3.1" cast-shadow>
      <TresCylinderGeometry :args="[0.28, 0.28, 1.65, 24]" />
      <TresMeshStandardMaterial color="#7e6e5b" :roughness="0.42" :metalness="0.6" />
    </TresMesh>

    <!-- Rotating Vertical Spindles -->
    <TresGroup v-for="sp in 3" :key="'spindle-' + sp" :position="[1.45, 0.1, (sp - 2) * 0.55]" :rotation="[0, time * 5.2, 0]">
      <TresMesh cast-shadow>
        <TresCylinderGeometry :args="[0.08, 0.11, 1.35, 16]" />
        <TresMeshStandardMaterial color="#cbb799" :roughness="0.35" :metalness="0.7" />
      </TresMesh>
      <!-- Wound Cream Yarn Core -->
      <TresMesh :position="[0, -0.05, 0]" cast-shadow>
        <TresCylinderGeometry :args="[0.16, 0.16, 0.72, 20]" />
        <TresMeshStandardMaterial color="#f4ede0" :roughness="0.82" />
      </TresMesh>
    </TresGroup>

    <!-- Thread Guide Eyelets -->
    <TresMesh v-for="g in 3" :key="'guide-' + g" :position="[0.72, 0.65, (g - 2) * 0.55]" :rotation="[0, Math.PI / 2, 0]">
      <TresTorusGeometry :args="[0.09, 0.018, 10, 24]" />
      <TresMeshStandardMaterial color="#d6bc8b" :roughness="0.3" :metalness="0.8" />
    </TresMesh>
  </TresGroup>
</template>

<script setup>
defineProps({
  position: { type: Array, default: () => [9.5, 0, 0] },
  time: { type: Number, default: 0 },
});
</script>
