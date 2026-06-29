# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

医学影像设备3D交互展示 — 5台医学影像设备（DR、CT、DSA、MRI、超声）的3D教学展示网页。用户可通过顶部标签切换设备，在3D场景中旋转/缩放查看整体模型，点击模型上的标注点查看部件的教学图片和文字说明。

## Tech Stack

- **Build**: Vite
- **3D**: Three.js (GLTFLoader, OrbitControls)
- **Testing**: Node built-in `node --test`
- **No framework** (vanilla HTML/CSS/JS)

## Commands

```bash
# Install dependencies
npm install

# Start dev server (use port 5174, 5173 is occupied by another project)
npm run dev -- --port 5174 --strictPort

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
index.html                    # Entry HTML with layout: topbar | workspace (3D + detail panel)
src/
  main.js                     # Three.js scene, model loading, hotspot rendering, camera, debug mode
  devices.js                  # 5 device definitions + part data (positions, normals, image layers)
  detailState.js              # Layer cycling logic (initial=0, advance through layers)
  debugTools.js               # Coordinate formatting, surface point capture, export
  styles.css                  # All styles (light medical-grade theme)
test/
  devices.test.js             # Device config validation (5 devices, paths, layer counts)
  debugTools.test.js          # Coordinate formatting, surface point update, export format
public/
  models/                     # GLB 3D models (dr.glb, ct.glb, dsa.glb, mri.glb, ultrasound.glb)
  images/                     # Teaching images (18 PNG/JPG/WebP files)
3D模型/                        # Original GLB backups
素材图片/                        # Original source images (backup)
参考图/                          # Reference images for AI model generation
```

## Architecture Notes

### Device Data Flow
- `src/devices.js` — single source of truth for all device/part/layer data
- `src/main.js` — imports devices, reads during render, no intermediate store
- `src/detailState.js` — pure functions for layer index progression

### Hotspot System (HTML overlay, not 3D meshes)
- Part positions stored as local coordinates (`[x, y, z]`) in `devices.js`
- Each frame, `Vector3.project(camera)` converts 3D coords → 2D screen position
- DOM buttons positioned absolutely in `.hotspot-layer` div overlaying the canvas
- Surface normals (optional) push the hotspot slightly off the model surface

### Debug Mode (`?debug=1`)
- Bottom-right debug panel lets user click model surface to get real coordinates via Raycaster
- Workflow: select part → "开始定位" → click model surface → copy coordinates
- Output format ready to paste back into `devices.js`

### Model Loading
- `GLTFLoader` loads GLB from `/models/{id}.glb`
- Auto-centers via bounding box, scales so max dimension = 3.8 units
- Material tweaks: roughness capped at 0.86, metalness at 0.02
- `currentLoadToken` pattern prevents stale model race conditions

### Layer Navigation (DR/CT multi-layer parts)
- Hover: shows first layer (index 0)
- Click same part again: advances to next layer, stays at last layer
- Reset when switching to a different part
- Layer tabs shown in detail panel for direct navigation

### Image Modal
- Click detail image → modal with scroll-zoom and drag-pan
- Esc or click backdrop to close

## Important Conventions

1. **Port 5174 only** — port 5173 is used by another project (`gpt_image_playground`)
2. **Do not delete** `3D模型/`, `素材图片/`, `新建文件夹/` — these are asset backups
3. **Edit `public/models/` GLBs**, not the originals in `3D模型/`
4. **Backup `public/models/`** before compressing GLBs
5. This is NOT a git repository — no branches, commits, or rollback

## Common Tasks

### Adjust Hotspot Positions
1. Open `http://localhost:5174/?debug=1`
2. Select device (top tabs) and part (debug panel list)
3. Click "开始定位", then click model surface at desired position
4. Copy coordinates from debug panel, paste into `src/devices.js`

### Tweak Lighting
Parameters in `src/main.js`:
- `HemisphereLight` intensity
- `keyLight` / `fillLight` / `rimLight` intensity & position
- `renderer.toneMappingExposure`
- Material `roughness` / `metalness` caps in model loading callback

### Add a New Device
1. Generate GLB → place in `public/models/`
2. Add entry to `src/devices.js` array (id, name, shortName, model path, camera, parts)
3. Update test in `test/devices.test.js` if necessary
4. Run `npm test` then `npm run build`

### GLB Compression (future)
Use gltf-pipeline with Draco, re-add `DRACOLoader` to `main.js`, verify `public/draco/` path.

## Current Status
- All 5 models loaded, all hotspots placed with user-confirmed coordinates
- 9 tests passing, Vite build succeeds
- GLBs not yet compressed (~56-60MB each, target <2MB)
- DSA uses same overview image for all parts (no individual part images yet)
