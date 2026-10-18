import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AbstractSilk = () => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Float floatIntensity={4} speed={1.5} rotationIntensity={1}>
      <mesh ref={meshRef} position={[2, 0, -5]} scale={[5, 5, 5]}>
        <torusKnotGeometry args={[1.5, 0.4, 250, 32, 2, 3]} />
        <meshStandardMaterial 
          color="#ec0080" // Vibrant Pink
          roughness={0.2} 
          metalness={0.9} 
          wireframe={true} 
          transparent={true} 
          opacity={0.15} 
        />
      </mesh>
    </Float>
  );
};

const DustParticles = () => {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 50; 
        pos[i * 3 + 1] = (Math.random() - 0.5) * 50; 
        pos[i * 3 + 2] = (Math.random() - 0.5) * 30; 
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00aeb2" // Teal
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

const Scene3D = () => {
  return (
    <Canvas dpr={[1, 1.5]} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} gl={{ alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ec0080" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#00aeb2" />
      
      <AbstractSilk />
      <DustParticles />
      
      <Sparkles count={300} scale={25} size={2.5} speed={0.5} opacity={0.4} color="#ffffff" />
      <Environment preset="city" />
    </Canvas>
  );
};

export default Scene3D;
