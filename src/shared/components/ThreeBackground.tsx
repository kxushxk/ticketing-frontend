import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh scale={1.5}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#3b82f6"
            emissive="#1d4ed8"
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.8}
            distort={0.3}
            speed={2}
          />
        </mesh>
      </Float>
    </>
  );
}

export function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.03]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
}
