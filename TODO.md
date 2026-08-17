# Task: Rebuild Landing Page as Full-Screen Living 3D Scene

## Vision
"Woven for the Unhurried" → a moonlit serene atelier landscape:
- Full-screen 3D scene: glowing moon, flowing river, wind breezes, a tree shedding drifting leaves.
- Brand content (Woven for the Unhurried, CTAs, metrics) floats over the living scene.
- Sections below transition with depth/parallax.

## Implementation (no new deps — Three.js install failed with ENOSPC)
- [x] 1. Pivot to dependency-free canvas particle engine + GSAP + CSS (no three/fiber/drei).
- [x] 2. Create `LivingRiverScene.jsx` — full-screen canvas: glowing moon, flowing river, wind streaks, swaying tree, drifting leaves, fireflies.
- [x] 3. Rebuild `HeroScene.jsx` to wrap the living scene + brand content overlay.
- [x] 4. Rework `Landing.css` for the living scene, single-column hero, and 3D perspective.
- [x] 5. Clean up `Home.jsx` GSAP (removed dead `.floating-image` refs; added 3D mouse-parallax tilt + scroll parallax on `.living-scene`).
- [x] 6. Recreate empty `LivingRiverScene.jsx` (was missing default export -> build error).
- [ ] 7. Verify build with `npm run build` (BLOCKED: C: drive has 0 bytes free / ENOSPC).

## BLOCKER
- C: drive has 0 bytes free. Cannot write build output or run `npm install`.
- Dev server (`npm run dev`) runs fine and HMR-applied all landing changes.
- Need to free ~200MB+ on C: to build the production bundle.
