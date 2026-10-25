"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { ACESFilmicToneMapping } from "three";

import { CardTable } from "./card-table";
import { LampCone } from "./lamp-cone";
import { SuitParticles } from "./suit-particles";

/**
 * Latar WebGL penuh layar.
 *
 * Kanvas duduk di lapisan paling atas (`z-[9999]`) dengan
 * `pointer-events-none`, jadi partikelnya melayang DI ATAS teks — persis
 * seperti yang diminta — tanpa pernah menghalangi klik atau gulir.
 *
 * Semua komponen scene menggerakkan `uScroll`-nya sendiri dari posisi gulir,
 * jadi tidak ada state React yang diperbarui saat menggulir.
 */

type SceneState = "pending" | "on" | "off";

/** Cek ketersediaan WebGL tanpa membuat konteks yang menganggur. */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");

    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function DeckScene() {
  const [state, setState] = useState<SceneState>("pending");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Pengurangan gerak: jangan pasang kanvas sama sekali, pakai latar CSS.
    setState(reduce || !hasWebGL() ? "off" : "on");
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);

    document.addEventListener("visibilitychange", onVisibility);

    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (state !== "on") {
    // Latar statis — dipakai saat WebGL tidak ada atau gerak dikurangi.
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, hsl(var(--deck-red) / 0.20) 0%, transparent 55%)," +
            "radial-gradient(90% 60% at 50% 110%, hsl(var(--deck-red) / 0.12) 0%, transparent 60%)",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ mixBlendMode: "screen", pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0.6, 10], fov: 45, near: 0.1, far: 90 }}
        dpr={[1, 2]}
        frameloop={hidden ? "never" : "always"}
        style={{ pointerEvents: "none", touchAction: "auto" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          // Jangan pernah biarkan kanvas menelan klik navigasi.
          gl.domElement.style.pointerEvents = "none";
        }}
      >
        {/* Kabut atmosferik — makin pekat saat menyelam turun halaman. */}
        <fog attach="fog" args={["#0d0608", 12, 42]} />

        <SuitParticles count={1600} />
        <CardTable />
        <LampCone />

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.22} luminanceSmoothing={0.5} mipmapBlur />
          <Vignette offset={0.28} darkness={0.78} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
