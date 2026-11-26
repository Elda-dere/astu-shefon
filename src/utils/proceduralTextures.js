import * as THREE from 'three';

/**
 * Generates a procedural woven Ethiopian shemma / shefon fabric texture with tibeb border.
 */
export function createWovenFabricTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Warm natural cotton cream base
  ctx.fillStyle = '#efe7d8';
  ctx.fillRect(0, 0, size, size);

  // Fine warp & weft weave lines
  for (let y = 0; y < size; y += 4) {
    ctx.fillStyle = y % 8 === 0 ? 'rgba(196, 178, 152, 0.28)' : 'rgba(255, 252, 245, 0.35)';
    ctx.fillRect(0, y, size, 2);
  }
  for (let x = 0; x < size; x += 4) {
    ctx.fillStyle = x % 8 === 0 ? 'rgba(182, 162, 134, 0.22)' : 'rgba(255, 252, 245, 0.25)';
    ctx.fillRect(x, 0, 2, size);
  }

  // Subtle botanical espresso floral / tibeb motif near bottom
  const bandY = size - 88;
  ctx.fillStyle = '#3b2c20';
  ctx.fillRect(0, bandY, size, 6);
  ctx.fillStyle = '#b99c72';
  ctx.fillRect(0, bandY + 10, size, 4);

  for (let x = 16; x < size; x += 32) {
    ctx.strokeStyle = '#4a3728';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, bandY + 26);
    ctx.lineTo(x + 12, bandY + 42);
    ctx.lineTo(x, bandY + 58);
    ctx.lineTo(x - 12, bandY + 42);
    ctx.closePath();
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Generates a subtle bump map for woven textile micro-relief.
 */
export function createWeaveBumpTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const over = ((x / 4 + y / 4) % 2) === 0;
      ctx.fillStyle = over ? '#d8d8d8' : '#4a4a4a';
      ctx.fillRect(x, y, 3, 3);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}
