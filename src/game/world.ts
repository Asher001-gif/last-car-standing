import type { RapierRigidBody } from "@react-three/rapier";
import { CAR, makeBotBrain } from "./sim/constants";
import type { BotBrain, Pose, Spawn, VehicleInput } from "./sim/types";

/**
 * Mutable world registry shared by the scene and the one stepper.
 * Per-frame state lives here (plain objects), never in React.
 */
export interface CarEntry {
  id: number;
  isPlayer: boolean;
  color: string;
  spawn: Spawn;
  body: RapierRigidBody | null;
  hp: number;
  alive: boolean;
  input: VehicleInput;
  brain: BotBrain | null;
  /** Copied from the body each frame so AI can read positions cheaply. */
  pose: Pose;
  flipTimer: number;
  onDeath: (() => void) | null;
}

export const cars = new Map<number, CarEntry>();
/** rapier body handle -> car id. */
export const bodyToCar = new Map<number, number>();

/** Values the HUD reads every frame without re-rendering React. */
export const live = { speedKmh: 0 };

export interface DamageEvent {
  selfId: number;
  otherId: number | null;
  relSpeed: number;
  isStatic: boolean;
}
export const damageQueue: DamageEvent[] = [];

let nextId = 1;

export function registerCar(opts: {
  isPlayer: boolean;
  color: string;
  spawn: Spawn;
  body: RapierRigidBody | null;
  brain?: BotBrain | undefined;
  onDeath?: (() => void) | undefined;
}): number {
  const id = nextId++;
  const entry: CarEntry = {
    id,
    isPlayer: opts.isPlayer,
    color: opts.color,
    spawn: opts.spawn,
    body: opts.body,
    hp: CAR.maxHp,
    alive: true,
    input: { throttle: 0, steer: 0, handbrake: false },
    brain: opts.brain ?? (opts.isPlayer ? null : makeBotBrain(1)),
    pose: { x: opts.spawn.x, z: opts.spawn.z, yaw: opts.spawn.yaw },
    flipTimer: 0,
    onDeath: opts.onDeath ?? null,
  };
  cars.set(id, entry);
  if (opts.body) bodyToCar.set(opts.body.handle, id);
  return id;
}

export function unregisterCar(id: number): void {
  const entry = cars.get(id);
  if (entry?.body) bodyToCar.delete(entry.body.handle);
  cars.delete(id);
}

export function resetWorld(): void {
  cars.clear();
  bodyToCar.clear();
  damageQueue.length = 0;
  live.speedKmh = 0;
}

export function getPlayer(): CarEntry | undefined {
  for (const c of cars.values()) if (c.isPlayer) return c;
  return undefined;
}

export function countAliveBots(): number {
  let n = 0;
  for (const c of cars.values()) if (!c.isPlayer && c.alive) n++;
  return n;
}
