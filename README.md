# SGI – Interactive 3D Product Viewer

A small static web store for furniture, built for the **Interactive Graphics Systems (Sistemas Gráficos Interativos, SGI)** course of the Computer Engineering degree at the Polytechnic of Leiria (ESTG, 2nd year, 2024/25).

The product pages show real-time 3D models in the browser with [three.js](https://threejs.org/). Users can rotate and zoom the model, play its animations and change its material or texture.

## Features

- **Product catalogue** (`index.html`): a list of the available products, loaded from JSON.
- **Product details** (`details.html`): an interactive 3D view of the selected product:
  - glTF models loaded with `GLTFLoader`
  - camera orbit and zoom with `OrbitControls`
  - model animations (for example, opening the cabinet doors) driven by `AnimationMixer`
  - texture and colour variants (emerald, gray, orange, red, zebra...)
  - a 2D image gallery next to the 3D view

## Project structure

```
.
├── index.html            # Catalogue page
├── details.html          # Product page with the 3D viewer
├── json/                 # Product data and image lists
└── public/
    ├── css/              # Stylesheets
    ├── js/
    │   ├── script.js         # Catalogue logic
    │   ├── modelDetails.js   # Product page logic (variants, gallery)
    │   └── threejs.js        # Scene, camera, lights, loaders, animations
    ├── imgs/             # Images, textures and thumbnails
    └── models/           # glTF models (.gltf + .bin + textures)
```

## Running locally

The pages use ES modules and an import map that points to `/node_modules/three/...`, so they must be served over HTTP from this folder. Opening the HTML files directly with `file://` does not work.

```bash
npm install
npm start
```

Then open <http://localhost:8080>.

Any other static server works as well (for example the VS Code *Live Server* extension), as long as its root is this folder.

## Tech stack

- HTML5, CSS3 and vanilla JavaScript (ES modules)
- [three.js](https://threejs.org/) r168
- glTF 2.0 models

## Authors

- Eduardo Amado
- Fernando Videira

Academic project. Polytechnic of Leiria, School of Technology and Management (ESTG).
