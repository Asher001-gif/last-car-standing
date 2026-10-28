import type { Spawn } from "./types";

export interface CarSpawns {
  player: Spawn;
  bots: Spawn[];
}

/**
 * Player starts south of centre facing the arena; the five bots form a ring
 * around it, each facing the middle.
 */
export function initialSpawns(): CarSpawns {
  const player: Spawn = { x: 0, z: -18, y: 0.9, yaw: 0 };
  const bots: Spawn[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 5;
    const x = Math.round(Math.sin(a) * 24 * 100) / 100;
    const z = Math.round(Math.cos(a) * 24 * 100) / 100;
    bots.push({ x, z, y: 0.9, yaw: Math.atan2(-x, -z) });
  }
  return { player, bots };
}

export const OBSTACLES = [
  { x: -12, z: -10, w: 3.2, d: 3.2, h: 1.8 },
  { x: 14, z: 4, w: 3.2, d: 3.2, h: 1.8 },
  { x: -18, z: 12, w: 2.6, d: 6, h: 1.8 },
  { x: 0, z: 20, w: 6, d: 2.6, h: 1.8 },
  { x: 20, z: -14, w: 2.6, d: 6, h: 1.8 },
  { x: -4, z: 2, w: 2.2, d: 2.2, h: 1.4 },
] as const;
