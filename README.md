# Last Car Standing

Build a 3D browser game called "Last Car Standing" (a car-combat demolition derby: last car alive wins).

TECH
- React + TypeScript with react-three-fiber, @react-three/drei and @react-three/rapier for physics. Use versions compatible with this project.
- No backend. Everything runs client-side.
- Keep game code in src/game/ split into small files: Arena.tsx, PlayerCar.tsx, BotCar.tsx, useGameState.ts, HUD.tsx. Do not put everything in one file.

SCENE
- One flat square arena (about 80x80 units) with low walls around the edge so cars can't leave. Simple asphalt ground, a few concrete block obstacles, and a sunset sky with soft lighting and shadows.
- Use simple low-poly cars built from boxes (body, cabin, 4 wheels) in different colors. No external models yet.

GAMEPLAY
- Player car: WASD/arrow keys to accelerate, brake/reverse and steer; Space for handbrake. Rapier physics so cars bounce and crash realistically.
- Third-person chase camera that smoothly follows behind the player car.
- 5 bot cars that drive around, chase the nearest car and ram it.
- Health: each car has 100 HP. Damage on collision scales with impact speed. At 0 HP a car explodes (simple particle burst), turns into a dark wreck and is removed from play.
- Win/lose: if the player is destroyed, show "You lost"; if all bots are destroyed, show "Last Car Standing!". Both screens have a Restart button.

UI
- Main menu with a Play button.
- HUD: player health bar, "Cars left: N", and a speed readout.
- Bold, arcade-style look: dark theme with orange/red accents.

Keep it playable at 60fps on a laptop. Build this first version fully working before adding anything else. Make sure its ui loads on old laptops too like chrome 109.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ccb8501f-1851-433f-98bf-117647de5d3c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
