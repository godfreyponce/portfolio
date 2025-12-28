"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from 'three';

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" roughness={0.3} metalness={0.8} />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Canvas className="w-full h-full" camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <pointLight position={[-5, -5, -5]} color="blue" intensity={1} />
        
        {/* Camera Controls */}
        <OrbitControls enableZoom={false} />

        <Suspense fallback={null}>
            <RotatingCube />
            <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
