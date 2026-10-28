export interface ExplosionEvent {
  x: number;
  y: number;
  z: number;
}

type Listener = (e: ExplosionEvent) => void;

const listeners = new Set<Listener>();

/** Rules emit events; sound and UI subscribe. */
export function emitExplosion(e: ExplosionEvent): void {
  for (const l of listeners) l(e);
}

export function onExplosion(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
