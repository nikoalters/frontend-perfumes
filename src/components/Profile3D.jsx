import React from 'react';
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Stars } from '@react-three/drei';

const LiquidOrb = () => {
  return (
    <mesh>
      {/* Una esfera con mucho detalle para que se deforme bonito */}
      <Sphere args={[1, 64, 64]} scale={2.2}>
        <MeshDistortMaterial
          color="#009970"       // Tu verde corporativo
          attach="material"
          distort={0.5}         // Cuánto se deforma (0 a 1)
          speed={2}             // Velocidad del movimiento
          roughness={0.2}       // Qué tan liso es (0 = espejo)
          metalness={0.8}       // Aspecto metálico
        />
      </Sphere>
    </mesh>
  );
};

const Profile3D = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00e5ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff2a6d" />
        
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
          <LiquidOrb />
        </Float>
        
        {/* Estrellas de fondo muy sutiles */}
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export default Profile3D;