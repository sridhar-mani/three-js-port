import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera,
  Environment,
  ContactShadows,
  OrbitControls,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';

function FloatingRing({ position = [0, 0, 0], color = '#4834d4' }) {
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ringRef.current.rotation.x = Math.sin(t * 0.4) * 0.3;
    ringRef.current.rotation.y = Math.cos(t * 0.4) * 0.3;
  });

  return (
    <Torus
      ref={ringRef}
      args={[1, 0.3, 16, 32]}
      position={position}
    >
      <meshStandardMaterial
        color={color}
        metalness={0.5}
        roughness={0.2}
      />
    </Torus>
  );
}

function FloatingBall({ position = [0, 0, 0] }) {
  const ballRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ballRef.current.position.y = position[1] + Math.sin(t * 2) * 0.1;
    ballRef.current.rotation.z = t * 0.5;
  });

  return (
    <mesh ref={ballRef} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#ff6b6b"
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
}

function Background() {
  const bgRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    bgRef.current.rotation.z = t * 0.05;
  });

  return (
    <mesh ref={bgRef} position={[0, 0, -5]} scale={[15, 15, 1]}>
      <planeGeometry />
      <meshStandardMaterial
        color="#2c3e50"
        metalness={0.2}
        roughness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function Scene() {
  const cameraRef = useRef();

  useFrame(({ clock }) => {
    if (cameraRef.current) {
      const t = clock.getElapsedTime();
      cameraRef.current.position.x = Math.sin(t * 0.1) * 2;
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1, 5]} fov={45} />
      <OrbitControls 
        enableZoom={false} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 3}
      />

      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />

      <Float
        speed={2}
        rotationIntensity={1}
        floatIntensity={1}
      >
        <FloatingRing position={[0, 0, 0]} color="#4834d4" />
      </Float>

      <Float
        speed={1.5}
        rotationIntensity={2}
        floatIntensity={1}
      >
        <FloatingBall position={[1.5, 1, 0]} />
      </Float>

      <Float
        speed={1.8}
        rotationIntensity={1.5}
        floatIntensity={1}
      >
        <FloatingBall position={[-1.5, 0.5, 0]} />
      </Float>

      <Background />
      
      <ContactShadows
        opacity={0.5}
        scale={10}
        blur={1}
        far={10}
        resolution={256}
        color="#000000"
      />
      
      <Environment preset="sunset" />
    </>
  );
}