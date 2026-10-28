import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CarVisual } from "./CarVisual";
import { useCar } from "./useCar";
import { makeBotBrain } from "./sim/constants";
import type { Spawn } from "./sim/types";

interface BotCarProps {
  spawn: Spawn;
  color: string;
  aggression: number;
}

export function BotCar({ spawn, color, aggression }: BotCarProps) {
  const brain = useMemo(() => makeBotBrain(aggression), [aggression]);
  const { bodyRef, destroyed, onCollisionEnter } = useCar({
    isPlayer: false,
    color,
    spawn,
    brain,
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={[spawn.x, spawn.y, spawn.z]}
      rotation={[0, spawn.yaw, 0]}
      colliders={false}
      ccd
      linearDamping={0.2}
      angularDamping={1.5}
      onCollisionEnter={onCollisionEnter}
    >
      <CuboidCollider args={[1.05, 0.45, 2.15]} friction={0.8} restitution={0.3} mass={800} />
      <CarVisual color={color} destroyed={destroyed} getBody={() => bodyRef.current} />
    </RigidBody>
  );
}
