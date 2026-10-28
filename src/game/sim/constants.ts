import type { BotBrain } from "./types";

/** Arena is a square from -half..half on X and Z. */
export const ARENA = {
  half: 40,
  wallHeight: 1.6,
  wallThickness: 2,
  /** Bots aim inside this inner square to stay off the walls. */
  aiBound: 33,
} as const;

export interface VehicleTuning {
  /** m/s top forward speed (~86 km/h). */
  topSpeed: number;
  reverseTopSpeed: number;
  /** m/s^2 engine acceleration. */
  engineAccel: number;
  /** m/s^2 when braking. */
  brakeDecel: number;
  /** proportional drag: accel equilibrium sets the real top speed. */
  dragK: number;
  /** m/s^2 rolling resistance at low speed with no throttle. */
  rollResist: number;
  /** lateral velocity decay rate (higher = more grip). */
  grip: number;
  handbrakeGrip: number;
  handbrakeDecel: number;
  /** max yaw rate rad/s at full steer. */
  steerRate: number;
  /** speed (m/s) at which steering reaches full authority. */
  steerGainSpeed: number;
  /** how fast yaw rate approaches the steering target. */
  steerSmooth: number;
}

export const TUNING: VehicleTuning = {
  topSpeed: 24,
  reverseTopSpeed: 9,
  engineAccel: 18,
  brakeDecel: 34,
  dragK: 0.7,
  rollResist: 0.8,
  grip: 7,
  handbrakeGrip: 0.9,
  handbrakeDecel: 14,
  steerRate: 2.6,
  steerGainSpeed: 10,
  steerSmooth: 10,
};

export const DAMAGE = {
  /** relative speed (m/s) below which car-to-car hits deal nothing. */
  minImpact: 5,
  perMps: 3.2,
  maxPerHit: 45,
  /** walls and props are more forgiving. */
  staticMinImpact: 7,
  staticPerMps: 2.2,
} as const;

export const CAR = {
  maxHp: 100,
  width: 2.0,
  height: 0.9,
  length: 4.3,
} as const;

export function makeBotBrain(aggression: number): BotBrain {
  return { aggression, stuckTimer: 0, reverseTimer: 0, lastSteer: 0 };
}
