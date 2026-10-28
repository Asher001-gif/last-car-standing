import { TUNING, type VehicleTuning } from "./constants";
import type { Vec3, VehicleInput } from "./types";

/**
 * Vehicle convention: yaw 0 faces +Z, forward = (sin yaw, cos yaw),
 * the driver's right = forward x up = (-cos yaw, 0, sin yaw).
 * Positive yaw rate turns LEFT; input steer +1 (D key) turns RIGHT.
 */

export interface VehicleFrame {
  /** speed along the car's forward axis (m/s). */
  vLong: number;
  /** speed along the car's right axis (m/s), the sliding part. */
  vLat: number;
  vy: number;
  /** yaw rate (rad/s). */
  ang: number;
}

export function forwardOf(yaw: number): Vec3 {
  return { x: Math.sin(yaw), y: 0, z: Math.cos(yaw) };
}

export function rightOf(yaw: number): Vec3 {
  return { x: -Math.cos(yaw), y: 0, z: Math.sin(yaw) };
}

export function yawFromForward(fx: number, fz: number): number {
  return Math.atan2(fx, fz);
}

export function decompose(vel: Vec3, yaw: number, angularY: number): VehicleFrame {
  const f = forwardOf(yaw);
  const r = rightOf(yaw);
  return {
    vLong: vel.x * f.x + vel.z * f.z,
    vLat: vel.x * r.x + vel.z * r.z,
    vy: vel.y,
    ang: angularY,
  };
}

export function compose(frame: VehicleFrame, yaw: number): { vel: Vec3 } {
  const f = forwardOf(yaw);
  const r = rightOf(yaw);
  return {
    vel: {
      x: f.x * frame.vLong + r.x * frame.vLat,
      y: frame.vy,
      z: f.z * frame.vLong + r.z * frame.vLat,
    },
  };
}

export function stepVehicle(
  frame: VehicleFrame,
  input: VehicleInput,
  dt: number,
  t: VehicleTuning = TUNING,
): VehicleFrame {
  let { vLong, vLat, vy, ang } = frame;

  // Engine, brake and reverse. Above top speed the engine never slows the car;
  // collision speed bleeds off through drag instead.
  if (input.throttle > 0) {
    if (vLong < -0.4) {
      vLong = Math.min(0, vLong + t.brakeDecel * dt);
    } else {
      vLong = Math.min(
        vLong + t.engineAccel * dt * input.throttle,
        Math.max(vLong, t.topSpeed),
      );
    }
  } else if (input.throttle < 0) {
    if (vLong > 0.4) {
      vLong = Math.max(0, vLong + t.brakeDecel * dt * input.throttle);
    } else {
      const next = vLong + t.engineAccel * dt * input.throttle;
      vLong = Math.max(next, Math.min(vLong, -t.reverseTopSpeed));
    }
  }

  // Handbrake locks the wheels.
  if (input.handbrake) {
    const drop = Math.min(Math.abs(vLong), t.handbrakeDecel * dt);
    vLong -= Math.sign(vLong) * drop;
  }

  // Drag and rolling resistance.
  vLong -= vLong * t.dragK * dt;
  if (input.throttle === 0 && Math.abs(vLong) < 0.4) {
    const drop = Math.min(Math.abs(vLong), t.rollResist * dt);
    vLong -= Math.sign(vLong) * drop;
  }

  // Tyre grip decays the lateral (sliding) part of the velocity.
  const grip = input.handbrake ? t.handbrakeGrip : t.grip;
  vLat *= Math.exp(-grip * dt);

  // Steering authority grows with speed and flips while reversing.
  const speedFactor = Math.min(Math.abs(vLong) / t.steerGainSpeed, 1);
  const dir = vLong < -0.5 ? -1 : 1;
  const target = -input.steer * t.steerRate * speedFactor * dir;
  ang += (target - ang) * (1 - Math.exp(-t.steerSmooth * dt));

  return { vLong, vLat, vy, ang };
}
