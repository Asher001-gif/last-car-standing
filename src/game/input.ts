import type { VehicleInput } from "./sim/types";

/**
 * Keyboard input. Handlers only record held keys; the stepper reads them
 * once per frame via readPlayerInput().
 */
const held = new Set<string>();

const PREVENT = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
]);

function onKeyDown(e: KeyboardEvent) {
  if (PREVENT.has(e.code)) e.preventDefault();
  held.add(e.code);
}

function onKeyUp(e: KeyboardEvent) {
  held.delete(e.code);
}

export function attachInput(): () => void {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}

export function readPlayerInput(): VehicleInput {
  const up = held.has("KeyW") || held.has("ArrowUp");
  const down = held.has("KeyS") || held.has("ArrowDown");
  const right = held.has("KeyD") || held.has("ArrowRight");
  const left = held.has("KeyA") || held.has("ArrowLeft");
  return {
    throttle: (up ? 1 : 0) + (down ? -1 : 0),
    steer: (right ? 1 : 0) + (left ? -1 : 0),
    handbrake: held.has("Space"),
  };
}
