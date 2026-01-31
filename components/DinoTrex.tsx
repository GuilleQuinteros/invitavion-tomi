"use client";

import { useGLTF } from "@react-three/drei";

export default function DinoTrex() {
  const { scene } = useGLTF("/models/trex.glb");

  return (
    <primitive
      object={scene}
      scale={2}
      position={[0, -1.5, 0]}
    />
  );
}
