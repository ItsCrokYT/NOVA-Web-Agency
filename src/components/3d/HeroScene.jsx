import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Stars, RoundedBox, Trail, Cylinder, Sphere, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

const GeometricRobot = () => {
  const groupRef = useRef();
  const headGroupRef = useRef();
  const visorRef = useRef();
  
  // Obtenemos las dimensiones del viewport 3D para hacer los cálculos responsivos
  const { viewport } = useThree();
  
  // Estado para interacción
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { x, y } = state.mouse;

    // Detectamos si es pantalla pequeña (móvil/tablet vertical)
    const isMobile = viewport.width < 7;

    // 1. ANIMACIÓN ORBITAL RESPONSIVA
    if (groupRef.current) {
      // AJUSTE X: En escritorio usamos 5 unidades. En móvil, limitamos al ancho disponible / 2.2
      // para que llegue a los bordes pero no desaparezca totalmente.
      const xRange = isMobile ? viewport.width / 2.2 : 5;
      
      // AJUSTE Z: En móvil reducimos la profundidad (2.0) para que cuando pase "por enfrente"
      // no se vea GIGANTE y tape todo el contenido. En PC mantenemos 3.5.
      const zRange = isMobile ? 2.0 : 3.5;

      // Velocidad ajustada: Un poco más lento en móvil para no marear
      const speed = isMobile ? 0.2 : 0.3;

      groupRef.current.position.x = Math.sin(t * speed) * xRange; 
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.5; // Y se mantiene igual
      groupRef.current.position.z = Math.cos(t * speed) * zRange;
      
      groupRef.current.rotation.z = Math.sin(t * speed) * 0.1;
    }

    // 2. INTERACTIVIDAD
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, x * 0.8, 0.1);
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -y * 0.5, 0.1);
    }

    // 3. PULSO DEL VISOR
    if (visorRef.current) {
      const pulseSpeed = hovered ? 10 : 4;
      const baseIntensity = hovered ? 5 : 2;
      const pulse = (Math.sin(t * pulseSpeed) + 1) / 2;
      visorRef.current.intensity = baseIntensity + pulse * 1.5;
      
      const targetColor = new THREE.Color(hovered ? "#67e8f9" : "#06b6d4");
      visorRef.current.color.lerp(targetColor, 0.1);
    }
  });

  // Material Común: Cerámica Blanca Brillante
  const ceramicMaterial = (
    <meshPhysicalMaterial 
      color="#f8fafc" 
      roughness={0.2} 
      metalness={0.1} 
      clearcoat={1}   
      clearcoatRoughness={0.1}
    />
  );

  // Material Oscuro: Polímero Negro Mate
  const blackTechMaterial = (
    <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.5} />
  );

  // Ajuste de escala global para móvil (un poco más pequeño para que quepa mejor)
  const isSmallScreen = viewport.width < 5;
  const globalScale = isSmallScreen ? 0.8 : 1;

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Trail
        width={1.5 * globalScale} // Trail más fino en móvil
        length={6} 
        color={new THREE.Color("#06b6d4")} 
        attenuation={(t) => t * t}
      >
        <group 
          ref={groupRef} 
          position={[3, 0, 0]} 
          scale={[globalScale, globalScale, globalScale]} // Escala responsiva
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          {/* === GRUPO DE LA CABEZA === */}
          <group ref={headGroupRef}>
            <RoundedBox args={[1.4, 1.6, 1.2]} radius={0.4} smoothness={4}>
              {ceramicMaterial}
            </RoundedBox>
            <RoundedBox position={[0, 0, 0.55]} args={[1.1, 0.8, 0.2]} radius={0.1}>
              {blackTechMaterial}
            </RoundedBox>
            <mesh position={[0, 0, 0.66]}>
              <capsuleGeometry args={[0.12, 0.6, 4, 8]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial 
                ref={visorRef}
                color="#06b6d4" 
                emissive="#06b6d4"
                emissiveIntensity={3}
                toneMapped={false}
              />
            </mesh>
            <group position={[0.75, 0, 0]}>
              <Cylinder args={[0.2, 0.2, 0.1]} rotation={[0, 0, Math.PI/2]}>
                {blackTechMaterial}
              </Cylinder>
              <mesh position={[0, 0.15, 0]}>
                <sphereGeometry args={[0.05]} />
                <meshBasicMaterial color="#d946ef" />
              </mesh>
            </group>
            <group position={[-0.75, 0, 0]}>
               <Cylinder args={[0.2, 0.2, 0.1]} rotation={[0, 0, Math.PI/2]}>
                {blackTechMaterial}
              </Cylinder>
            </group>
            <group position={[0.5, 0.9, -0.3]}>
              <Cylinder args={[0.02, 0.02, 0.6]} position={[0, 0.3, 0]}>
                {blackTechMaterial}
              </Cylinder>
              <Sphere args={[0.08]} position={[0, 0.6, 0]}>
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
              </Sphere>
            </group>
          </group>

          {/* === NÚCLEO DE ENERGÍA === */}
          <group position={[0, -1.2, 0]}>
             <Float speed={5} rotationIntensity={2} floatIntensity={0}>
                <Octahedron args={[0.3]}>
                   <meshStandardMaterial color="#6366f1" wireframe />
                </Octahedron>
             </Float>
          </group>
        </group>
      </Trail>
    </Float>
  );
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
      <Canvas eventSource={document.getElementById('root')} dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
        
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 5, 5]} angle={0.5} penumbra={1} intensity={150} color="#cffafe" />
        <pointLight position={[-5, -5, -5]} intensity={100} color="#d946ef" />
        <pointLight position={[0, 2, -10]} intensity={80} color="#ffffff" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#cbd5e1" />

        <GeometricRobot />
        
      </Canvas>
    </div>
  );
};

export default HeroScene;