import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { CarVisual } from "./CarVisual";
import { useCar } from "./useCar";
import { initialSpawns } from "./sim/spawns";

const PLAYER_SPAWN = initialSpawns().player;
export const PLAYER_COLOR = "#ff5a1f";

export function PlayerCar() {
  const { bodyRef, destroyed, onCollisionEnter } = useCar({
    isPlayer: true,
    color: PLAYER_COLOR,
    spawn: PLAYER_SPAWN,
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={[PLAYER_SPAWN.x, PLAYER_SPAWN.y, PLAYER_SPAWN.z]}
      rotation={[0, PLAYER_SPAWN.yaw, 0]}
      colliders={false}
      ccd
      linearDamping={0.2}
      angularDamping={1.5}
      onCollisionEnter={onCollisionEnter}
    >
      <CuboidCollider args={[1.05, 0.45, 2.15]} friction={0.8} restitution={0.3} mass={800} />
      <CarVisual color={PLAYER_COLOR} destroyed={destroyed} getBody={() => bodyRef.current} />
    </RigidBody>
  );
}
