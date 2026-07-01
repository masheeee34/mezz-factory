"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Decal,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { useConfigurator } from "@/lib/store";
import {
  ensureFontsReady,
  paintFloquageDecal,
} from "@/components/jersey/jerseyTexture";

/**
 * Placeholder garment. Swap this for the real jersey from the designer:
 *   1. drop the file in /public/models/  →  e.g. "jersey.glb"
 *   2. change MODEL_URL below
 *   3. (the real model already carries the GOUSSDAR print, so remove the
 *      fallback material override in <JerseyModel>; the floquage Decal stays.)
 */
const MODEL_URL = "/models/jersey-placeholder.glb";

function JerseyModel() {
  const floquage = useConfigurator((s) => s.floquage);
  const face = useConfigurator((s) => s.face);
  const groupRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF(MODEL_URL);
  const geometry = useMemo(() => {
    let g: THREE.BufferGeometry | undefined;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && !g) g = m.geometry;
    });
    if (g && !g.getAttribute("normal")) g.computeVertexNormals();
    return g;
  }, [scene]);

  // Live floquage texture (transparent — name + number only)
  const canvas = useMemo(() => document.createElement("canvas"), []);
  const decalTex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [canvas]);

  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    ensureFontsReady().then(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    paintFloquageDecal(canvas, floquage);
    decalTex.needsUpdate = true;
  }, [floquage, fontsReady, canvas, decalTex]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const target = face === "back" ? Math.PI : 0;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target, 6, delta);
  });

  if (!geometry) return null;

  return (
    <group ref={groupRef} scale={1.7} position={[0, 0.08, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        {/* Fallback fabric — the real .glb brings its own printed texture. */}
        <meshStandardMaterial color="#16161b" roughness={0.74} metalness={0.04} />

        {/* Floquage projected on the back. Reused verbatim on the real model. */}
        <Decal position={[0, 0.14, -0.22]} rotation={[0, Math.PI, 0]} scale={[1.05, 1.4, 0.7]}>
          <meshStandardMaterial
            map={decalTex}
            transparent
            polygonOffset
            polygonOffsetFactor={-10}
            roughness={0.5}
            toneMapped={false}
          />
        </Decal>
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export default function JerseyCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <Suspense fallback={null}>
        {/* Self-contained studio lighting (no external HDRI fetch). */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 2.5, 4]} scale={[7, 5, 1]} />
          <Lightformer form="rect" intensity={1.1} position={[-5, 1, 2]} scale={[4, 4, 1]} color="#ff6a6a" />
          <Lightformer form="rect" intensity={1.3} position={[5, 1.5, -3]} scale={[4, 4, 1]} />
        </Environment>

        <JerseyModel />
      </Suspense>

      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.5}
        scale={7}
        blur={2.8}
        far={3}
        color="#000000"
      />

      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={3}
        maxDistance={6}
        minPolarAngle={Math.PI / 2 - 0.55}
        maxPolarAngle={Math.PI / 2 + 0.45}
      />
    </Canvas>
  );
}
