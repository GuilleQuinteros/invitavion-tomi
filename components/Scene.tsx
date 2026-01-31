"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import DinoTrex from "./DinoTrex";

export default function Scene3D() {
  return (
    <section className="h-screen">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} />

        <Environment preset="forest" />

        <Float speed={1} rotationIntensity={0.2}>
          <DinoTrex />
        </Float>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </section>
  );
}
