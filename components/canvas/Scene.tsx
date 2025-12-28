"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from 'three';

function InteractiveShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      // Follow mouse with larger range
      const x = (state.mouse.x * viewport.width) / 2.5; 
      const y = (state.mouse.y * viewport.height) / 2.5;
      
      // Smooth lerp movement
      meshRef.current.position.lerp(new THREE.Vector3(x, y, 0), 0.1);
      
      // Continuous rotation
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.5}>
        <icosahedronGeometry args={[1, 15]} />
        <MeshDistortMaterial 
          color="#333" 
          speed={2} 
          distort={0.5} 
          radius={1}
        />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  const [eventSource, setEventSource] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setEventSource(document.body);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen -z-10 bg-zinc-50 pointer-events-none">
      <Canvas 
        className="w-full h-full"
        eventSource={eventSource as HTMLElement}
        eventPrefix="client"
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        <pointLight position={[-10, -10, -10]} color="white" intensity={1} />
        
        <Suspense fallback={null}>
            <InteractiveShape />
            <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
