"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Butir cahaya di atas meja kartu.
 *
 * Seperti debu yang tertangkap berkas lampu merah: melayang perlahan,
 * bergoyang lembut, lalu naik dan membalut kembali ke bawah. Semua gerak
 * terjadi di dalam shader; buffer tidak pernah disentuh lagi setelah dibuat.
 */

export interface SuitParticlesProps {
  /** Jumlah butir. Total scene dijaga 1500..2500. */
  count?: number;
}

/** PRNG deterministik — geometri sama di server maupun klien. */
function mulberry32(seed: number): () => number {
  let a = seed;

  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uPixelRatio;

  attribute float aPhase;
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Goyangan lambat; amplitudo bertambah saat halaman di-scroll.
    float amp = 0.18 + uScroll * 0.55;
    pos.x += sin(uTime * 0.35 + aPhase) * amp;
    pos.z += cos(uTime * 0.24 + aPhase * 1.7) * amp * 0.8;

    // Dorongan maju saat scroll.
    pos.z += uScroll * 5.0;

    // Naik perlahan lalu membalut — dihitung di shader, bukan di buffer.
    float yMin = -3.0;
    float span = 12.0;
    pos.y = mod(position.y + uTime * 0.22 - yMin, span) + yMin;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Ukuran mengecil mengikuti kedalaman.
    gl_PointSize = aSize * uPixelRatio * (1.0 / -mvPosition.z) * 42.0;

    vColor = aColor;
    vAlpha = aAlpha * (0.8 + 0.2 * sin(uTime * 0.9 + aPhase));
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Sprite bulat lembut dari gl_PointCoord.
    vec2 d = gl_PointCoord - vec2(0.5);
    float r = length(d);

    if (r > 0.5) discard;

    float falloff = smoothstep(0.5, 0.0, r);
    falloff *= falloff;

    gl_FragColor = vec4(vColor, falloff * vAlpha);
  }
`;

export function SuitParticles({ count = 1600 }: SuitParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const scrollTarget = useRef(0);
  const scrollSmooth = useRef(0);
  const [reduced, setReduced] = useState(false);

  const geometry = useMemo(() => {
    const total = Math.max(1, Math.round(count));
    const positions = new Float32Array(total * 3);
    const phases = new Float32Array(total);
    const sizes = new Float32Array(total);
    const alphas = new Float32Array(total);
    const colors = new Float32Array(total * 3);

    const rand = mulberry32(0x5eed17);
    const color = new THREE.Color();
    const red = new THREE.Color().setHSL(353 / 360, 0.78, 0.5);
    const redBright = new THREE.Color().setHSL(355 / 360, 0.88, 0.58);
    const gold = new THREE.Color().setHSL(42 / 360, 0.62, 0.55);
    const ivory = new THREE.Color().setHSL(40 / 360, 0.33, 0.9);

    for (let i = 0; i < total; i += 1) {
      positions[i * 3] = (rand() - 0.5) * 24;
      positions[i * 3 + 1] = -3 + rand() * 12;
      positions[i * 3 + 2] = -8 + rand() * 12;

      phases[i] = rand() * Math.PI * 2;
      sizes[i] = 0.6 + rand() * 1.6;
      alphas[i] = 0.2 + rand() * 0.25;

      // Sebagian besar merah, sebagian emas, segelintir gading.
      const roll = rand();

      if (roll < 0.62) {
        color.copy(rand() < 0.5 ? red : redBright);
      } else if (roll < 0.92) {
        color.copy(gold);
      } else {
        color.copy(ivory);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 3, 0), 24);

    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uPixelRatio: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  // Hormati preferensi gerak; hanya dibaca di klien agar tidak ada mismatch.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReduced(mq.matches);

    const onChange = () => setReduced(mq.matches);

    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Posisi scroll dinormalkan 0..1 sebagai penggerak uScroll.
  useEffect(() => {
    const read = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;

      scrollTarget.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);

    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    if (reduced) return;

    const dt = Math.min(delta, 0.05);
    const points = pointsRef.current;

    // Hanya pembaruan uniform — tanpa alokasi.
    scrollSmooth.current += (scrollTarget.current - scrollSmooth.current) * Math.min(1, dt * 3);

    const uniforms = material.uniforms;

    uniforms.uTime.value += dt;
    uniforms.uScroll.value = scrollSmooth.current;
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();

    if (points) {
      // Rotasi lambat terkait scroll supaya medan terasa berparalaks.
      points.rotation.y = uniforms.uTime.value * 0.015 + scrollSmooth.current * 0.7;
      points.rotation.x = scrollSmooth.current * 0.12;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} geometry={geometry} material={material} />
  );
}
