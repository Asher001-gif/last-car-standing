import { create } from "zustand";
import { CAR } from "./sim/constants";

export type GamePhase = "menu" | "playing" | "won" | "lost";

interface GameState {
  phase: GamePhase;
  hp: number;
  /** Living cars including the player. */
  carsLeft: number;
  /** Bumped on every restart so the scene remounts fresh. */
  runId: number;
  startGame: () => void;
  setHp: (hp: number) => void;
  setCarsLeft: (n: number) => void;
  win: () => void;
  lose: () => void;
  restart: () => void;
}

const TOTAL_CARS = 6; // player + 5 bots

export const useGameState = create<GameState>((set) => ({
  phase: "menu",
  hp: CAR.maxHp,
  carsLeft: TOTAL_CARS,
  runId: 0,
  startGame: () => set({ phase: "playing", hp: CAR.maxHp, carsLeft: TOTAL_CARS }),
  setHp: (hp) => set({ hp }),
  setCarsLeft: (carsLeft) => set({ carsLeft }),
  win: () => set((s) => (s.phase === "playing" ? { phase: "won" } : {})),
  lose: () => set((s) => (s.phase === "playing" ? { phase: "lost" } : {})),
  restart: () =>
    set((s) => ({
      phase: "playing",
      hp: CAR.maxHp,
      carsLeft: TOTAL_CARS,
      runId: s.runId + 1,
    })),
}));
