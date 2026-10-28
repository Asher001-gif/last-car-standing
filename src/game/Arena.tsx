import { Sky } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { ARENA } from "./sim/constants";
import { OBSTACLES } from "./sim/spawns";

const HALF = ARENA.half;
const T = ARENA.wallThickness;
const H = ARENA.wallHeight;

function makeAsphaltTexture(): THREE.CanvasTexture {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#3b3e44";
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 2600; i++) {
    const g = 40 + Math.floor(Math.random() * 60);
    ctx.fillStyle = `rgba(${g},${g},${g + 4},${0.25 + Math.random() * 0.5})`;
    ctx.fillRect(Math.random() * s, Math.random() * s, 1.5, 1.5);
  }
  ctx.strokeStyle = "rgba(18,18,22,0.45)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * s, Math.random() * s);
    ctx.lineTo(Math.random() * s, Math.random() * s);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(9, 9);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const STRIPE = "#ff8a3c";

export function Arena() {
  const asphalt = useMemo(makeAsphaltTexture, []);
  useEffect(() => () => asphalt.dispose(), [asphalt]);

  return (
    <group>
      <Sky
        sunPosition={[38, 9, -42]}
        turbidity={7}
        rayleigh={2.2}
        mieCoefficient={0.008}
        mieDirectionalG={0.85}
      />

      <ambientLight intensity={0.45} color="#8a7a90" />
      <hemisphereLight color="#ffb27a" groundColor="#1c1216" intensity={0.55} />
      <directionalLight
        castShadow
        position={[38, 26, -42]}
        intensity={2.4}
        color="#ffb36b"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-bias={-0.0004}
      />

      {/* Dark terrain beyond the walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[700, 700]} />
        <meshStandardMaterial color="#241a20" roughness={1} />
      </mesh>

      {/* Asphalt floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[HALF * 2, HALF * 2]} />
        <meshStandardMaterial map={asphalt} roughness={0.95} />
      </mesh>

      <RigidBody type="fixed" colliders={false} friction={1}>
        <CuboidCollider args={[HALF, 0.5, HALF]} position={[0, -0.5, 0]} />
      </RigidBody>

      {/* Low walls around the edge */}
      <RigidBody type="fixed" colliders={false} friction={0.6} restitution={0.4}>
        <CuboidCollider args={[HALF + T, H / 2, T]} position={[0, H / 2, HALF + T]} />
        <CuboidCollider args={[HALF + T, H / 2, T]} position={[0, H / 2, -(HALF + T)]} />
        <CuboidCollider args={[T, H / 2, HALF + T]} position={[HALF + T, H / 2, 0]} />
        <CuboidCollider args={[T, H / 2, HALF + T]} position={[-(HALF + T), H / 2, 0]} />
      </RigidBody>

      {/* Wall visuals */}
      <mesh position={[0, H / 2, HALF + T]} castShadow receiveShadow>
        <boxGeometry args={[HALF * 2 + T * 4, H, T]} />
        <meshStandardMaterial color="#7d7f85" roughness={0.95} />
      </mesh>
      <mesh position={[0, H / 2, -(HALF + T)]} castShadow receiveShadow>
        <boxGeometry args={[HALF * 2 + T * 4, H, T]} />
        <meshStandardMaterial color="#7d7f85" roughness={0.95} />
      </mesh>
      <mesh position={[HALF + T, H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, HALF * 2]} />
        <meshStandardMaterial color="#7d7f85" roughness={0.95} />
      </mesh>
      <mesh position={[-(HALF + T), H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[T, H, HALF * 2]} />
        <meshStandardMaterial color="#7d7f85" roughness={0.95} />
      </mesh>

      {/* Orange warning stripes on top of the walls */}
      <mesh position={[0, H + 0.06, HALF + T]}>
        <boxGeometry args={[HALF * 2 + T * 4, 0.12, T + 0.2]} />
        <meshStandardMaterial color={STRIPE} emissive={STRIPE} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, H + 0.06, -(HALF + T)]}>
        <boxGeometry args={[HALF * 2 + T * 4, 0.12, T + 0.2]} />
        <meshStandardMaterial color={STRIPE} emissive={STRIPE} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[HALF + T, H + 0.06, 0]}>
        <boxGeometry args={[T + 0.2, 0.12, HALF * 2]} />
        <meshStandardMaterial color={STRIPE} emissive={STRIPE} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[-(HALF + T), H + 0.06, 0]}>
        <boxGeometry args={[T + 0.2, 0.12, HALF * 2]} />
        <meshStandardMaterial color={STRIPE} emissive={STRIPE} emissiveIntensity={0.45} />
      </mesh>

      {/* Concrete block obstacles */}
      {OBSTACLES.map((o, i) => (
        <RigidBody key={i} type="fixed" colliders={false} friction={0.8} restitution={0.3}>
          <CuboidCollider args={[o.w / 2, o.h / 2, o.d / 2]} position={[o.x, o.h / 2, o.z]} />
          <mesh position={[o.x, o.h / 2, o.z]} castShadow receiveShadow>
            <boxGeometry args={[o.w, o.h, o.d]} />
            <meshStandardMaterial color="#83858b" roughness={0.95} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
