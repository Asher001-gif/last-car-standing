import type { RapierRigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const WHEEL_RADIUS = 0.38;

const WHEELS: [number, number][] = [
  [-0.95, 1.42],
  [0.95, 1.42],
  [-0.95, -1.42],
  [0.95, -1.42],
];

interface CarVisualProps {
  color: string;
  destroyed: boolean;
  getBody: () => RapierRigidBody | null;
}

/** Low-poly car built from boxes: body, cabin, bumpers, lights, 4 wheels. */
export function CarVisual({ color, destroyed, getBody }: CarVisualProps) {
  const wheelsRef = useRef<(Group | null)[]>([]);
  const bodyColor = destroyed ? "#181818" : color;

  useFrame((_, rawDt) => {
    if (destroyed) return;
    const dt = Math.min(rawDt, 0.05);
    const b = getBody();
    if (!b) return;
    const q = b.rotation();
    const fx = 2 * (q.x * q.z + q.w * q.y);
    const fz = 1 - 2 * (q.x * q.x + q.y * q.y);
    const v = b.linvel();
    const vLong = v.x * fx + v.z * fz;
    const spin = (vLong / WHEEL_RADIUS) * dt;
    for (const w of wheelsRef.current) if (w) w.rotation.x += spin;
  });

  return (
    <group>
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[2.0, 0.6, 4.3]} />
        <meshStandardMaterial color={bodyColor} metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh castShadow position={[0, 0.62, -0.35]}>
        <boxGeometry args={[1.5, 0.5, 1.9]} />
        <meshStandardMaterial
          color={destroyed ? "#101010" : "#1d222b"}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, -0.12, 2.15]}>
        <boxGeometry args={[2.06, 0.3, 0.28]} />
        <meshStandardMaterial color={destroyed ? "#0e0e0e" : "#26262a"} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.12, -2.15]}>
        <boxGeometry args={[2.06, 0.3, 0.28]} />
        <meshStandardMaterial color={destroyed ? "#0e0e0e" : "#26262a"} roughness={0.7} />
      </mesh>
      {[-0.62, 0.62].map((x) => (
        <mesh key={`head${x}`} position={[x, 0.12, 2.16]}>
          <boxGeometry args={[0.36, 0.16, 0.08]} />
          <meshStandardMaterial
            color="#ffd9a0"
            emissive="#ffb36b"
            emissiveIntensity={destroyed ? 0 : 1.6}
          />
        </mesh>
      ))}
      {[-0.62, 0.62].map((x) => (
        <mesh key={`tail${x}`} position={[x, 0.12, -2.16]}>
          <boxGeometry args={[0.36, 0.14, 0.08]} />
          <meshStandardMaterial
            color="#5c1111"
            emissive="#ff2d1a"
            emissiveIntensity={destroyed ? 0 : 1.2}
          />
        </mesh>
      ))}
      {WHEELS.map(([x, z], i) => (
        <group
          key={i}
          position={[x, -0.07, z]}
          ref={(el) => {
            wheelsRef.current[i] = el;
          }}
        >
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.32, 12]} />
            <meshStandardMaterial color={destroyed ? "#0c0c0c" : "#14161a"} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
