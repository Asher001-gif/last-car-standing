import { useRapier, type RapierRigidBody } from "@react-three/rapier";
import { useCallback, useEffect, useRef, useState } from "react";
import { damageQueue } from "./world";
import { bodyToCar, cars, registerCar, unregisterCar } from "./world";
import type { BotBrain, Spawn } from "./sim/types";

const ZERO = { x: 0, y: 0, z: 0 };

export interface UseCarOptions {
  isPlayer: boolean;
  color: string;
  spawn: Spawn;
  brain?: BotBrain;
}

/**
 * Shared car plumbing: registers the car in the world registry, queues
 * collision damage events, and freezes the body into a wreck on death.
 */
export function useCar(opts: UseCarOptions) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const [destroyed, setDestroyed] = useState(false);
  const { rapier } = useRapier();
  const idRef = useRef<number | null>(null);
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    const o = optsRef.current;
    const id = registerCar({
      isPlayer: o.isPlayer,
      color: o.color,
      spawn: o.spawn,
      body: bodyRef.current,
      brain: o.brain,
      onDeath: () => {
        setDestroyed(true);
        const b = bodyRef.current;
        if (b) {
          b.setLinvel(ZERO, false);
          b.setAngvel(ZERO, false);
          b.setBodyType(rapier.RigidBodyType.Fixed, false);
        }
      },
    });
    idRef.current = id;
    return () => {
      idRef.current = null;
      unregisterCar(id);
    };
    // Mount once per car; spawn is fixed for a run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rapier]);

  const onCollisionEnter = useCallback(
    ({ other }: { other: { rigidBody?: RapierRigidBody | null } }) => {
      const id = idRef.current;
      const self = bodyRef.current;
      if (id == null || !self) return;
      const entry = cars.get(id);
      if (!entry || !entry.alive) return;

      const otherBody = other.rigidBody ?? null;
      const mv = self.linvel();
      const ov = otherBody ? otherBody.linvel() : ZERO;
      const relSpeed = Math.hypot(
        mv.x - ov.x,
        mv.y - ov.y,
        mv.z - ov.z,
      );
      const otherId = otherBody ? (bodyToCar.get(otherBody.handle) ?? null) : null;
      const isStatic =
        otherId == null || !cars.get(otherId)?.alive;
      damageQueue.push({
        selfId: id,
        otherId: isStatic ? null : otherId,
        relSpeed,
        isStatic,
      });
    },
    [],
  );

  return { bodyRef, destroyed, onCollisionEnter };
}
