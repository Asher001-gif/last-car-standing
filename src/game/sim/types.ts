export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** -1..1 axes: throttle <0 brake/reverse, steer +1 = turn right, handbrake = Space. */
export interface VehicleInput {
  throttle: number;
  steer: number;
  handbrake: boolean;
}

export interface Pose {
  x: number;
  z: number;
  yaw: number;
}

export interface Spawn extends Pose {
  y: number;
}

export interface BotBrain {
  /** 0.6..1.1 throttle multiplier — lower is a more cautious driver. */
  aggression: number;
  stuckTimer: number;
  reverseTimer: number;
  lastSteer: number;
}
