"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Kerucut cahaya lampu meja.
 *
 * Beberapa bidang memanjang disusun seperti kipas dari atas: tiap bidang
 * memudar dari terang di ujung atas ke tembus pandang di ujung bawah, dengan
 * tepi kiri-kanan dilembutkan lewat smoothstep. Tiap bilah punya kemiringan,
 * lebar, dan fase denyut sendiri supaya kipasnya terasa organik — bukan
 * kerucut yang rapi.
 */

export interface LampConeProps {
  /** Diteruskan ke userData objek; tidak ada DOM di dalam Canvas. */
  className?: string;
}

/** PRNG deterministik — susunan bilah sama di server maupun klien. */
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

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Melebar ke bawah seperti berkas lampu.
    float flare = mix(0.25, 1.0, 1.0 - uv.y);
    pos.x *= flare;

    // Goyangan tipis di ujung bawah.
    pos.x += sin(uTime * 0.5 + uv.y * 3.0) * 0.03 * (1.0 - uv.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uPhase;
  uniform float uTime;
  uniform float uScroll;

  varying vec2 vUv;

  void main() {
    // Terang di atas, tembus pandang di bawah.
    float vertical = pow(smoothstep(0.0, 1.0, vUv.y), 1.4);

    // Tepi horizontal lembut.
    float edge = smoothstep(0.0, 0.22, vUv.x) * (1.0 - smoothstep(0.78, 1.0, vUv.x));

    // Denyut lembut per bilah.
    float pulse = 0.75 + 0.25 * sin(uTime * 0.6 + uPhase);

    float a = vertical * edge * pulse * uOpacity * (0.6 + uScroll * 0.6);

    gl_FragColor = vec4(uColor, a);
  }
`;

interface Shaft {
  yaw: number;
  tilt: number;
  width: number;
}

export function LampCone({ className }: LampConeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollTarget = useRef(0);
  const scrollSmooth = useRef(0);
  const [reduced, setReduced] = useState(false);

  const { geometry, materials, shafts, uTime, uScroll } = useMemo(() => {
    const rand = mulberry32(0x1a4d7e);
    const total = 7;

    const geo = new THREE.PlaneGeometry(1.5, 4.2, 1, 8);

    // Geser agar ujung atas berada di titik lampu; bilah menjuntai ke bawah.
    geo.translate(0, -2.1, 0);

    const timeUniform = { value: 0 };
    const scrollUniform = { value: 0 };

    const red = new THREE.Color().setHSL(353 / 360, 0.8, 0.5);
    const gold = new THREE.Color().setHSL(42 / 360, 0.65, 0.55);

    const list: Shaft[] = [];
    const mats: THREE.ShaderMaterial[] = [];

    for (let i = 0; i < total; i += 1) {
      const t = total > 1 ? i / (total - 1) : 0.5;
      const yaw = -1.3 + t * 2.6 + (rand() - 0.5) * 0.12;
      const tilt = 0.14 + rand() * 0.12;

      list.push({ yaw, tilt, width: 0.7 + rand() * 0.6 });

      mats.push(
        new THREE.ShaderMaterial({
          vertexShader: VERTEX,
          fragmentShader: FRAGMENT,
          uniforms: {
            // Uniform bersama: satu pembaruan menyentuh semua bilah.
            uTime: timeUniform,
            uScroll: scrollUniform,
            uPhase: { value: i * 1.7 + rand() * Math.PI },
            uOpacity: { value: 0.1 + rand() * 0.09 },
            uColor: { value: (rand() < 0.55 ? red : gold).clone() },
          },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        }),
      );
    }

    return { geometry: geo, materials: mats, shafts: list, uTime: timeUniform, uScroll: scrollUniform };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReduced(mq.matches);

    const onChange = () => setReduced(mq.matches);

    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, []);

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
      materials.forEach((mat) => mat.dispose());
    },
    [geometry, materials],
  );

  useFrame((_state, delta) => {
    if (reduced) return;

    const dt = Math.min(delta, 0.05);

    scrollSmooth.current += (scrollTarget.current - scrollSmooth.current) * Math.min(1, dt * 3);

    // Uniform bersama — tanpa alokasi per frame.
    uTime.value += dt;
    uScroll.value = scrollSmooth.current;

    const group = groupRef.current;

    if (group) {
      // Kipas bergeser sedikit mengikuti scroll.
      group.rotation.y = scrollSmooth.current * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, 3.4, 0]} userData={{ className }}>
      {shafts.map((shaft, index) => (
        <group key={index} rotation={[0, shaft.yaw, 0]}>
          <mesh
            geometry={geometry}
            material={materials[index]}
            rotation={[0, 0, shaft.tilt]}
            scale={[shaft.width, 1, 1]}
          />
        </group>
      ))}
    </group>
  );
}
