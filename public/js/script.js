import {
  startRenderer,
  setModel,
  animate,
  scene,
  setUpScene,
} from "./threejs.js";

const colorSelect = document.querySelector(`[data-id="colors"]`);
const animSelect = document.querySelector(`[data-id="animations"]`);
const btn = document.querySelector(".btn-3d");
const btnContent = btn.querySelector("p");
const btnImage = btn.querySelector("img");
const carousel = document.querySelector("#productImageCarousel");
const drop = document.querySelector(`[data-id="animations"]`);
const canvasContainer = document.querySelector(".canvas-container");

let hasRendered = false;

export function toggleView(modelID) {
  if (!modelID) {
    return;
  }

  if (btnImage.src.includes("3d.png")) {
    btnImage.src = "./public/imgs/2d.png";
    btnImage.alt = "2D";
    btnContent.innerHTML = `<img src="./public/imgs/2d.png" alt="2D" /> 2D`;
    carousel.style.display = "none";
    drop.style.display = "block";
    canvasContainer.style.display = "block";
    drop.value = "default";
    colorSelect.value = "default";
    scene.clear();
    renderContent(modelID);
  } else {
    btnImage.src = "./public/imgs/3d.png";
    btnImage.alt = "3D";
    btnContent.innerHTML = `<img src="./public/imgs/3d.png" alt="3D" /> 3D`;
    carousel.style.display = "block";
    drop.style.display = "none";
    canvasContainer.style.display = "none";
  }
}

function renderContent(correntModelID) {
  if (!hasRendered) {
    hasRendered = true;
    setAnim(correntModelID);
  }
  const canvas = document.querySelector("canvas");
  setUpScene();
  startRenderer(canvas);
  setModel(correntModelID, animate);
}

const armarioAnims = new Map([
  ["animOpenDrawer", "Abrir Gaveta"],
  ["animOpenDoor", "Abrir Porta"],
]);
const candAnims = new Map([
  ["animRotateBase", "Rodar Base"],
  ["animTiltBase", "Inclinar Base"],
  ["animTiltLongArm", "Inclinar Braço Longo"],
  ["animTiltShortArm", "Inclinar Braço Curto"],
  ["animTiltAbajur", "Inclinar Abajur"],
  ["animRotateAbajur", "Rodar Abajur"],
]);

function setAnim(modelID) {
  const animMap = modelID === "armario" ? armarioAnims : candAnims;
  for (const [key, value] of animMap) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = value;
    animSelect.appendChild(option);
  }
}

const candColors = new Map([
  ["default", "Zebra"],
  ["orange", "Laranja Suave"],
  ["gray", "Cinza Frio"],
  ["red", "Vermelho Veludo"],
  ["emerald", "Verde Esmeralda"],
]);

for (const [key, value] of candColors) {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = value;
  colorSelect.appendChild(option);
}
