'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import styles from './CalculatorVisualization.module.css';

type VisualizationProps = {
  result: string;
};

// Component for a single 3D bar in the visualization
const VisualizationBar = ({ value, index, total }: { value: number, index: number, total: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  // Animation for the bars
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Animate height based on value
    meshRef.current.scale.y = THREE.MathUtils.lerp(
      meshRef.current.scale.y,
      value * 0.5 + 0.1, // Scale the height based on value
      0.1
    );
    
    // Add some movement
    meshRef.current.position.y = value * 0.25 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
    
    // Rotate slightly
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });
  
  // Calculate position based on index and total
  const angle = (index / total) * Math.PI * 2;
  const radius = 3;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  
  return (
    <Box
      ref={meshRef}
      args={[0.5, 1, 0.5]} // width, height, depth
      position={[x, 0, z]}
      scale={[1, 0.1, 1]} // Start with minimal height
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial 
        color={hovered ? '#ff9500' : '#1e88e5'} 
        metalness={0.8}
        roughness={0.2}
      />
    </Box>
  );
};

// Component for the central sphere showing the result
const ResultSphere = ({ value }: { value: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Pulse effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    meshRef.current.scale.set(scale, scale, scale);
    
    // Rotate slowly
    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x += 0.002;
  });
  
  // Scale the sphere based on the value
  const size = Math.min(Math.max(value * 0.1, 1), 2);
  
  return (
    <group>
      <Sphere ref={meshRef} args={[size, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ff9500" 
          emissive="#ff5500"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
      
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {value.toString()}
      </Text>
    </group>
  );
};

// Main scene component
const Scene = ({ result }: VisualizationProps) => {
  const numericResult = parseFloat(result) || 0;
  
  // Generate data for visualization
  const generateVisualizationData = (value: number) => {
    // Create an array of values based on the digits of the result
    const digits = value.toString().replace('.', '').split('').map(Number);
    return digits.length > 0 ? digits : [0];
  };
  
  const visualizationData = generateVisualizationData(numericResult);
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Secondary light for better shadows */}
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Central result sphere */}
      <ResultSphere value={numericResult} />
      
      {/* Visualization bars */}
      {visualizationData.map((value, index) => (
        <VisualizationBar 
          key={index} 
          value={value} 
          index={index} 
          total={visualizationData.length} 
        />
      ))}
      
      {/* Controls for rotating and zooming */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Main component
const CalculatorVisualization: React.FC<VisualizationProps> = ({ result }) => {
  return (
    <div className={styles.visualizationContainer}>
      <Canvas className={styles.canvas} camera={{ position: [0, 2, 8], fov: 50 }}>
        <Scene result={result} />
      </Canvas>
    </div>
  );
};

export default CalculatorVisualization; 