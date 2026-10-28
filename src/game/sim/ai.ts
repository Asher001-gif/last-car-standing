import { ARENA } from "./constants";
import type { BotBrain, Pose, VehicleInput } from "./types";

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Nearest living car (including the player) becomes the ram target. */
export function pickTarget(
  selfPose: Pose,
  selfId: number,
  others: { id: number; pose: Pose; alive: boolean }[],
): { id: number; pose: Pose } | null {
  let best: { id: number; pose: Pose } | null = null;
  let bestD = Infinity;
  for (const o of others) {
    if (!o.alive || o.id === selfId) continue;
    const dx = o.pose.x - selfPose.x;
    const dz = o.pose.z - selfPose.z;
    const d = dx * dx + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = { id: o.id, pose: o.pose };
    }
  }
  return best;
}

/**
 * Chase-and-ram steering. Writes timers back into `brain`.
 * Returns throttle/steer/handbrake for one frame.
 */
export function botThink(
  pose: Pose,
  vLong: number,
  target: Pose | null,
  brain: BotBrain,
  dt: number,
): VehicleInput {
  // Stuck recovery: back up while counter-steering.
  if (brain.reverseTimer > 0) {
    brain.reverseTimer -= dt;
    return { throttle: -1, steer: -Math.sign(brain.lastSteer || 1), handbrake: false };
  }

  // Aim point: the target, clamped inside the arena so bots stay off the walls.
  let aimX = target ? target.x : 0;
  let aimZ = target ? target.z : 0;
  if (Math.abs(pose.x) > ARENA.aiBound || Math.abs(pose.z) > ARENA.aiBound) {
    aimX = 0;
    aimZ = 0;
  } else {
    aimX = clamp(aimX, -ARENA.aiBound, ARENA.aiBound);
    aimZ = clamp(aimZ, -ARENA.aiBound, ARENA.aiBound);
  }

  const dx = aimX - pose.x;
  const dz = aimZ - pose.z;
  const fx = Math.sin(pose.yaw);
  const fz = Math.cos(pose.yaw);
  const rx = -Math.cos(pose.yaw);
  const rz = Math.sin(pose.yaw);
  const localFwd = dx * fx + dz * fz;
  const localRight = dx * rx + dz * rz;
  const desired = Math.atan2(localRight, localFwd);
  const steer = clamp(desired * 2.5, -1, 1);
  brain.lastSteer = steer;

  // Sharp high-speed turn: drift it with the handbrake.
  if (Math.abs(desired) > 2.1 && vLong > 10) {
    return { throttle: 0.25, steer, handbrake: true };
  }

  const throttle = Math.abs(desired) > 1.6 ? 0.35 : brain.aggression;

  // Stuck detection: little movement while trying to drive forward.
  if (Math.abs(vLong) < 0.7 && throttle > 0.2) {
    brain.stuckTimer += dt;
    if (brain.stuckTimer > 1.2) {
      brain.reverseTimer = 1.1;
      brain.stuckTimer = 0;
    }
  } else {
    brain.stuckTimer = 0;
  }

  return { throttle, steer, handbrake: false };
}
