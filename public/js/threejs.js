import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; // importar componente especifica
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const LOADER = new GLTFLoader();
const TextureLoader = new THREE.TextureLoader();
let renderer;
let camera;
let controls;
let mixer;
let isAnimating;
let currentMaterialExt;
let abajurExt;
let center;

const animMap = new Map();

// criar uma cena...
export const scene = new THREE.Scene();
window.scene = scene; // tornar a cena acessível globalmente

// Renderizar e animar
let delta = 0; // tempo desde a última atualização
let clock = new THREE.Clock(); // componente que obtém o delta
let min_latency = 1 / 60; // tempo mínimo entre cada atualização

export function setUpScene() {
  mixer = new THREE.AnimationMixer(scene);
  // criar uma camara...
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 1, 1);

  // add a floor
  let geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  let material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });

  let plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -(Math.PI / 2);
  plane.receiveShadow = true;
  scene.add(plane);

  // adicionar uma luz
  let dirLight = new THREE.DirectionalLight(0xffffff, 10);
  dirLight.position.set(5, 5, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.blurSamples = 25;
  scene.add(dirLight);

  let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
}

export function startRenderer(canvas) {
  isAnimating = true;
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  setRendererSize();
  renderer.setClearColor(0xffffff, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  initControls();
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxDistance = 2.0;
  controls.minDistance = 0.75;
  controls.maxPolarAngle = Math.PI;
  controls.minPolarAngle = -Math.PI;
  controls.enablePan = false;
}

function setRendererSize() {
  const parent = renderer.domElement.parentElement;
  renderer.setSize(parent.clientWidth, parent.clientHeight);
  camera.aspect = parent.clientWidth / parent.clientHeight;
  camera.updateProjectionMatrix();
}

export function setModel(model, callback) {
  LOADER.load(`./public/models/${model}/${model}.gltf`, (gltf) => {
    scene.add(gltf.scene);
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    if (model === "cand") {
      abajurExt = gltf.scene.getObjectByName("AbajurMesh_1");
      center = gltf.scene.getObjectByName("ShortArm");
      currentMaterialExt = abajurExt.material;
    }
    if (model === "armario") {
      center = gltf.scene.getObjectByName("Gaveta");
    }
    camera.lookAt(center.position);
    controls.target.copy(center.position);
    fillAnimMap(model, gltf);
    if (callback) callback();
  });
}

export function animate() {
  if (isAnimating) {
    requestAnimationFrame(animate); // agendar animar para o próximo animation frame
    setRendererSize();
    delta += clock.getDelta(); // acumula tempo entre chamadas de getDelta
    if (delta < min_latency) return; // não exceder a taxa de atualização

    mixer.update(delta); // atualizar animações
    // mostrar...
    renderer.render(scene, camera);

    delta = delta % min_latency; // atualizar delta com o excedente
  }
}

function fillAnimMap(model, gltf) {
  switch (model) {
    case "cand":
      animMap.set(
        "animRotateBase",
        mixer.clipAction(
          THREE.AnimationClip.findByName(gltf.animations, "SupportAction.002")
        )
      );
      animMap.set(
        "animRotateAbajur",
        mixer.clipAction(
          THREE.AnimationClip.findByName(
            gltf.animations,
            "AbajurJointAction.003"
          )
        )
      );
      animMap.set(
        "animTiltBase",
        mixer.clipAction(
          THREE.AnimationClip.findByName(
            gltf.animations,
            "SupportJointAction.001"
          )
        )
      );
      animMap.set(
        "animTiltAbajur",
        mixer.clipAction(
          THREE.AnimationClip.findByName(
            gltf.animations,
            "ArmToAbajurJointAction.002"
          )
        )
      );
      animMap.set(
        "animTiltShortArm",
        mixer.clipAction(
          THREE.AnimationClip.findByName(gltf.animations, "ShortArmAction")
        )
      );
      animMap.set(
        "animTiltLongArm",
        mixer.clipAction(
          THREE.AnimationClip.findByName(gltf.animations, "LongArmAction")
        )
      );
      break;
    case "armario":
      animMap.set(
        "animOpenDoor",
        mixer.clipAction(
          THREE.AnimationClip.findByName(gltf.animations, "PortaAction")
        )
      );
      animMap.set(
        "animOpenDrawer",
        mixer.clipAction(
          THREE.AnimationClip.findByName(gltf.animations, "GavetaAction")
        )
      );
      break;
  }
}

document
  .querySelector(`[data-id="animations"]`)
  .addEventListener("change", (event) => {
    const selectedAnimation = event.target.value;
    mixer.stopAllAction();
    if (selectedAnimation === "default") return;
    animMap.get(selectedAnimation).play();
  });

document
  .querySelector(`[data-id="colors"]`)
  .addEventListener("change", (event) => {
    const selectedColor = event.target.value;
    if (!abajurExt) return;
    if (selectedColor === "default") {
      abajurExt.material = currentMaterialExt;
      return;
    }
    let texture = TextureLoader.load(
      `./public/imgs/textures/${selectedColor}.png`,
      () => {
        abajurExt.material = new THREE.MeshStandardMaterial({
          map: texture,
        });
      }
    );
  });
