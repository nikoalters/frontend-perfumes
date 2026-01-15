import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Stars } from '@react-three/drei';

// El Objeto de Cristal
const Crystal = () => {
  const meshRef = useRef();

  // Animación: Hacemos que gire suavemente todo el tiempo
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      {/* Forma geométrica: Icosaedro (parece una joya o frasco abstracto) */}
      <icosahedronGeometry args={[2.2, 0]} />
      
      {/* Material Mágico: Transmisión de luz (Efecto Vidrio Realista) */}
      <MeshTransmissionMaterial 
        backside
        backsideThickness={5}
        thickness={2}
        roughness={0}
        transmission={1} // Vidrio puro
        ior={1.5}        // Índice de refracción (como diamante)
        chromaticAberration={1} // Ese efecto arcoíris en los bordes
        anisotropy={20}
        distortion={0.5}
        distortionScale={0.5}
        temporalDistortion={0.5}
        color="#009970" // Tu color verde corporativo tintando el vidrio
        background="#0f0c29"
      />
    </mesh>
  );
};

const Hero3D = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, opacity: 0.6 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: true }}>
        {/* Luces */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#00e5ff" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#ff2a6d" />

        {/* Elemento Flotante */}
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <Crystal />
        </Float>

        {/* Estrellas de fondo sutiles */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export default Hero3D;