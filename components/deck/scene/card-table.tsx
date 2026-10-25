"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Permukaan meja kartu.
 *
 * Sebuah bidang besar yang digambar dengan shader sendiri: kisi belah
 * ketupat khas punggung kartu remi diukir langsung dari fragmen (tanpa
 * tekstur), lalu diberi riak halus di vertex. Ini cuma atmosfer — tembus
 * pandang dan beropasitas rendah, bukan lantai padat.
 */

export interface CardTableProps {
  /** Diteruskan ke userData objek; tidak ada DOM di dalam Canvas. */
  className?: string;
}

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Riak lembut: dua sinus amplitudo kecil, bukan kolam ombak.
    float amp = 0.12 + uScroll * 0.08;
    float ripple =
      sin(pos.x * 0.55 + uTime * 0.5) * amp +
      sin(pos.y * 0.85 - uTime * 0.37) * amp * 0.6;

    pos.z += ripple;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;

  varying vec2 vUv;

  void main() {
    vec2 p = vUv - 0.5;

    // Putar UV 45 derajat lalu fract -> kisi belah ketupat.
    float scale = 11.0 + uScroll * 4.0;
    float ang = 0.7853981634;
    float c = cos(ang);
    float s = sin(ang);
    vec2 q = mat2(c, -s, s, c) * p * scale;

    vec2 grid = abs(fract(q) - 0.5);
    float lines = min(grid.x, grid.y);

    // Garis tipis; ketebalan dijaga dengan smoothstep.
    float lattice = 1.0 - smoothstep(0.02, 0.07, lines);

    // Napas lambat + riak radial supaya pola tak pernah diam.
    float ripple = 0.55 + 0.45 * sin(uTime * 0.4 + length(p) * 9.0 - uScroll * 3.0);

    // Memudar ke tepi agar tidak terbaca sebagai lantai padat.
    float vignette = smoothstep(0.72, 0.12, length(p));

    float alpha = lattice * ripple * vignette * 0.5;

    vec3 red = vec3(0.70, 0.11, 0.13);
    vec3 gold = vec3(0.86, 0.67, 0.30);
    vec3 col = mix(red, gold, lattice * 0.5 + ripple * 0.25);

    gl_FragColor = vec4(col, alpha);
  }
`;

export function CardTable({ className }: CardTableProps) {
  const scrollTarget = useRef(0);
  const scrollSmooth = useRef(0);
  const [reduced, setReduced] = useState(false);

  const geometry = useMemo(() => new THREE.PlaneGeometry(46, 46, 64, 64), []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

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
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_state, delta) => {
    if (reduced) return;

    const dt = Math.min(delta, 0.05);

    scrollSmooth.current += (scrollTarget.current - scrollSmooth.current) * Math.min(1, dt * 3);

    const uniforms = material.uniforms;

    uniforms.uTime.value += dt;
    uniforms.uScroll.value = scrollSmooth.current;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, -2.4, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      userData={{ className }}
    />
  );
}
