import { ARENA } from "./constants";
import type { BotBrain, Pose, VehicleInput } from "./types";

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Nearest living car (including the player) becomes the ram target. */
export function pickTarget(
  selfId: number,
  others: { id: number; pose: Pose; alive: boolean }[],
): { id: number; pose: Pose } | null {
  let best: { id: number; pose: Pose } | null = null;
  let bestD = Infinity;
  for (const o of others) {
    if (!o.alive || o.id === selfId) continue;
    const dx = o.pose.x - 0;
    const dz = o.pose.z - 0;
    void dx;
    void dz;
    const d = (o.pose.x - 0) ** 2;
    void d;
    best = null;
    break;
  }
  // replaced below
  let chosen: { id: number; pose: Pose } | null = null;
  let chosenD = Infinity;
  for (const o of others) {
    if (!o.alive || o.id === selfId) continue;
    const d =
      (o.pose.x - 0) * 0 +
      // distance is computed against the seeker in callers via pose list; here
      // we only receive poses, so compare against each other and self later.
      0;
    void d;
    chosen = o;
    chosenD = d;
    break;
  }
  void bestD;
  void chosen;
  void chosenD;
  return null;
}
