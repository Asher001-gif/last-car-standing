import { DAMAGE } from "./constants";

/**
 * Damage rule: impact damage scales with relative collision speed.
 * Car-to-car hits count from 5 m/s, walls and props from 7 m/s.
 */
export function impactDamage(relSpeed: number, isStatic = false): number {
  const min = isStatic ? DAMAGE.staticMinImpact : DAMAGE.minImpact;
  const per = isStatic ? DAMAGE.staticPerMps : DAMAGE.perMps;
  const over = relSpeed - min;
  if (over <= 0) return 0;
  return Math.min(DAMAGE.maxPerHit, over * per);
}
