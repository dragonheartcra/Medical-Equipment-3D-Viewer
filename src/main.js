import "./styles.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { devices } from "./devices.js";
import { getInitialLayerIndex, getNextLayerIndex } from "./detailState.js";
import {
  exportDevicePositions,
  formatPosition,
  setPartSurfacePoint,
} from "./debugTools.js";

const canvas = document.querySelector("#sceneCanvas");
const viewerShell = document.querySelector("#viewerShell");
const deviceList = document.querySelector("#deviceList");
const hotspotLayer = document.querySelector("#hotspotLayer");
const loadingMask = document.querySelector("#loadingMask");
const loadingText = document.querySelector("#loadingText");
const deviceTitle = document.querySelector("#deviceTitle");
const deviceSummary = document.querySelector("#deviceSummary");
const resetViewButton = document.querySelector("#resetViewButton");
const partTitle = document.querySelector("#partTitle");
const partDescription = document.querySelector("#partDescription");
const layerTabs = document.querySelector("#layerTabs");
const detailImageButton = document.querySelector("#detailImageButton");
const detailImage = document.querySelector("#detailImage");
const layerTitle = document.querySelector("#layerTitle");
const layerText = document.querySelector("#layerText");
const imageModal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const modalCanvas = document.querySelector("#modalCanvas");
const modalCloseButton = document.querySelector("#modalCloseButton");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080e1a);

const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 120);
camera.position.set(0, 2.5, 6);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2.2;
controls.maxDistance = 12;
controls.target.set(0, 0.8, 0);
controls.addEventListener("start", cancelFocusAnimation);

const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const modelGroup = new THREE.Group();
scene.add(modelGroup);

scene.add(new THREE.HemisphereLight(0xffffff, 0xd6e2f1, 2.6));

const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xbfdcff, 1.4);
fillLight.position.set(-4, 3, -3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
rimLight.position.set(0, 3, -5);
scene.add(rimLight);

// Platform (showcase pedestal)
const platformGeometry = new THREE.CircleGeometry(3.5, 64);
const platformMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a2332,
  roughness: 0.3,
  metalness: 0.7,
  transparent: true,
  opacity: 0.5,
});
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.rotation.x = -Math.PI / 2;
platform.position.y = -1.25;
scene.add(platform);

// Environment map for PBR reflections on model surfaces
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
pmremGenerator.dispose();

let activeDevice = devices[0];
let activePart = activeDevice.parts[0];
let activeLayerIndex = getInitialLayerIndex();
let activeModel = null;
let currentLoadToken = 0;
let focusAnimation = null;
let hotspotsVisible = true;
let modalScale = 1;
let modalOffset = { x: 0, y: 0 };
let dragState = null;
const debugEnabled = new URLSearchParams(window.location.search).has("debug");
let debugPanel = null;
let debugOutput = null;
let debugPartsList = null;
let debugPickButton = null;
let debugStatus = null;
let debugPickActive = false;
let debugPointerDown = null;
let debugCandidate = null;
let modelMeshes = [];

const debugPreviewMarker = new THREE.Mesh(
  new THREE.SphereGeometry(0.045, 18, 18),
  new THREE.MeshBasicMaterial({
    color: 0x1d4ed8,
    depthTest: false,
    depthWrite: false,
  }),
);
debugPreviewMarker.renderOrder = 10;
debugPreviewMarker.visible = false;
scene.add(debugPreviewMarker);

function renderDeviceList() {
  deviceList.innerHTML = "";
  devices.forEach((device) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "device-card";
    card.dataset.deviceId = device.id;
    card.innerHTML = `
      <div class="device-card-thumb">
        <img src="${device.parts[0]?.layers[0]?.image ?? ""}" alt="${device.shortName}" loading="lazy" />
      </div>
      <div class="device-card-info">
        <span class="device-card-name">${device.name}</span>
        <span class="device-card-summary">${device.summary}</span>
      </div>
    `;
    card.addEventListener("click", () => setActiveDevice(device.id));
    deviceList.append(card);
  });
}

function setActiveDevice(deviceId) {
  const nextDevice = devices.find((device) => device.id === deviceId);
  if (!nextDevice || nextDevice.id === activeDevice.id) return;
  if (debugPickActive) setDebugPickActive(false);
  activeDevice = nextDevice;
  activePart = activeDevice.parts[0];
  activeLayerIndex = getInitialLayerIndex();
  updateDeviceChrome();
  renderDetails();
  renderHotspots();
  updateDebugPanel();
  loadModel(activeDevice);
}

function updateDeviceChrome() {
  deviceTitle.textContent = activeDevice.name;
  deviceSummary.textContent = activeDevice.summary;
  document.querySelectorAll(".device-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.deviceId === activeDevice.id);
  });
}

function showLoading(text) {
  loadingText.textContent = text;
  loadingMask.classList.remove("is-hidden");
}

function hideLoading() {
  loadingMask.classList.add("is-hidden");
}

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.filter(Boolean).forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose();
      });
      material.dispose();
    });
  });
}

function loadModel(device) {
  const loadToken = ++currentLoadToken;
  showLoading(`加载 ${device.shortName} 模型中...`);

  if (activeModel) {
    modelGroup.remove(activeModel);
    disposeObject(activeModel);
    activeModel = null;
  }
  modelMeshes = [];
  hideDebugPreview();

  loader.load(
    device.model,
    (gltf) => {
      if (loadToken !== currentLoadToken) {
        disposeObject(gltf.scene);
        return;
      }

      const model = new THREE.Group();
      const content = gltf.scene;
      const box = new THREE.Box3().setFromObject(content);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.8 / maxDimension;

      content.position.copy(center).multiplyScalar(-1);
      model.scale.setScalar(scale);
      model.position.y = 0.6;
      model.add(content);
      modelGroup.add(model);
      activeModel = model;

      content.traverse((child) => {
        if (!child.isMesh) return;
        modelMeshes.push(child);
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) {
          child.material.roughness = Math.min(child.material.roughness ?? 0.82, 0.86);
          child.material.metalness = Math.max(child.material.metalness ?? 0.02, 0.02);
          child.material.needsUpdate = true;
        }
      });

      resetCamera(device);
      hideLoading();
      updateDebugPanel();
    },
    (event) => {
      if (!event.total) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      loadingText.textContent = `加载 ${device.shortName} 模型中... ${percent}%`;
    },
    (error) => {
      console.error(error);
      loadingText.textContent = `${device.shortName} 模型加载失败，请检查模型路径。`;
    },
  );
}

function resetCamera(device = activeDevice) {
  cancelFocusAnimation();
  const { position, target } = device.camera;
  camera.position.set(...position);
  controls.target.set(...target);
  controls.update();
}

function cancelFocusAnimation() {
  focusAnimation = null;
}

function easeInOutCubic(value) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function focusCameraOnPart(part) {
  if (!activeModel || !part?.position || debugEnabled) return;

  const target = getHotspotWorldPosition(part);
  const direction = camera.position.clone().sub(target);
  if (direction.lengthSq() < 0.001) {
    direction.copy(new THREE.Vector3(0, 0.35, 1));
  }
  direction.normalize();

  const currentDistance = camera.position.distanceTo(controls.target);
  const focusDistance = THREE.MathUtils.clamp(currentDistance * 0.48, 2.35, 3.15);

  focusAnimation = {
    startTime: performance.now(),
    duration: 780,
    startCamera: camera.position.clone(),
    startTarget: controls.target.clone(),
    endCamera: target.clone().add(direction.multiplyScalar(focusDistance)),
    endTarget: target,
  };
}

function updateFocusAnimation() {
  if (!focusAnimation) return;

  const progress = Math.min(1, (performance.now() - focusAnimation.startTime) / focusAnimation.duration);
  const eased = easeInOutCubic(progress);
  camera.position.lerpVectors(focusAnimation.startCamera, focusAnimation.endCamera, eased);
  controls.target.lerpVectors(focusAnimation.startTarget, focusAnimation.endTarget, eased);

  if (progress >= 1) {
    cancelFocusAnimation();
  }
}

function renderHotspots() {
  hotspotLayer.innerHTML = "";
  activeDevice.parts.forEach((part, index) => {
    const hotspot = document.createElement("button");
    hotspot.type = "button";
    hotspot.className = "hotspot";
    hotspot.dataset.partId = part.id;
    hotspot.innerHTML = `
      <span class="hotspot-dot">${index + 1}</span>
      <span class="hotspot-label">${part.name}</span>
    `;
    hotspot.addEventListener("mouseenter", () => previewPart(part));
    hotspot.addEventListener("click", () => {
      activatePart(part);
    });
    if (debugEnabled) {
      hotspot.title = "调试模式：请在右下角选择部件，再点击模型表面定位";
    }
    hotspotLayer.append(hotspot);
  });
  updateHotspotStates();
  updateDebugPanel();
}

function updateHotspotStates() {
  document.querySelectorAll(".hotspot").forEach((hotspot) => {
    const isActive = hotspot.dataset.partId === activePart?.id;
    hotspot.classList.toggle("is-active", isActive);
    hotspot.hidden = !hotspotsVisible;
    if (debugPickActive) {
      hotspot.style.pointerEvents = "none";
    } else {
      hotspot.style.pointerEvents = "";
    }
  });
}

function previewPart(part) {
  if (activePart?.id === part.id) return;
  activePart = part;
  activeLayerIndex = getInitialLayerIndex();
  renderDetails();
  updateHotspotStates();
}

function activatePart(part) {
  if (activePart?.id === part.id) {
    activeLayerIndex = getNextLayerIndex(part, activeLayerIndex);
  } else {
    activePart = part;
    activeLayerIndex = getInitialLayerIndex();
  }
  renderDetails();
  updateHotspotStates();
  updateDebugPanel();
  focusCameraOnPart(part);
}

function renderDetails() {
  if (!activePart) return;

  const layer = activePart.layers[activeLayerIndex] ?? activePart.layers[0];
  partTitle.textContent = activePart.name;
  partDescription.textContent = activePart.description;
  layerTitle.textContent = layer.title;
  layerText.textContent = layer.text;
  detailImage.src = layer.image;
  detailImage.alt = layer.title;
  detailImageButton.classList.remove("is-empty");

  layerTabs.innerHTML = "";
  activePart.layers.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "layer-tab";
    button.textContent = item.title;
    button.classList.toggle("is-active", index === activeLayerIndex);
    button.addEventListener("click", () => {
      activeLayerIndex = index;
      renderDetails();
    });
    layerTabs.append(button);
  });
}

function updateHotspotPositions() {
  const rect = viewerShell.getBoundingClientRect();
  activeDevice.parts.forEach((part) => {
    const element = hotspotLayer.querySelector(`[data-part-id="${part.id}"]`);
    if (!element) return;

    const projected = getHotspotWorldPosition(part).project(camera);
    const x = (projected.x * 0.5 + 0.5) * rect.width;
    const y = (-projected.y * 0.5 + 0.5) * rect.height;
    const isBehindCamera = projected.z > 1;

    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.opacity = isBehindCamera ? "0" : "1";
    element.style.pointerEvents = isBehindCamera || !hotspotsVisible || debugPickActive ? "none" : "auto";
  });
}

function getHotspotWorldPosition(part) {
  const localPosition = new THREE.Vector3(...part.position);
  if (activeModel && part.normal) {
    const worldPosition = activeModel.localToWorld(localPosition);
    const worldNormal = getWorldNormalFromPart(part);
    return worldPosition.add(worldNormal.multiplyScalar(0.035));
  }
  return modelGroup.localToWorld(localPosition);
}

function getWorldNormalFromPart(part) {
  const normal = new THREE.Vector3(...(part.normal ?? [0, 1, 0]));
  if (!activeModel) return normal.normalize();
  return normal.transformDirection(activeModel.matrixWorld).normalize();
}

function setPointerFromEvent(event) {
  const rect = viewerShell.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function getSurfaceIntersection(event) {
  if (!activeModel || modelMeshes.length === 0) return null;
  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(modelMeshes, false);
  return intersections[0] ?? null;
}

function getIntersectionNormal(intersection) {
  const normal = intersection.face?.normal?.clone() ?? new THREE.Vector3(0, 1, 0);
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersection.object.matrixWorld);
  return normal.applyNormalMatrix(normalMatrix).normalize();
}

function getLocalSurfacePoint(intersection) {
  const worldPoint = intersection.point.clone();
  const worldNormal = getIntersectionNormal(intersection);
  const localPoint = activeModel.worldToLocal(worldPoint.clone());
  const localNormal = worldNormal
    .clone()
    .transformDirection(activeModel.matrixWorld.clone().invert())
    .normalize();
  return {
    position: [localPoint.x, localPoint.y, localPoint.z],
    normal: [localNormal.x, localNormal.y, localNormal.z],
    worldPoint,
    worldNormal,
  };
}

function showDebugPreview(surfacePoint) {
  debugPreviewMarker.position.copy(surfacePoint.worldPoint);
  debugPreviewMarker.position.add(surfacePoint.worldNormal.clone().multiplyScalar(0.035));
  debugPreviewMarker.visible = true;
}

function hideDebugPreview() {
  debugCandidate = null;
  debugPreviewMarker.visible = false;
}

function setDebugPickActive(nextValue) {
  debugPickActive = nextValue;
  viewerShell.classList.toggle("is-debug-picking", debugPickActive);
  if (!debugPickActive) hideDebugPreview();
  updateHotspotStates();
  updateDebugPanel();
}

function selectDebugPart(part) {
  activePart = part;
  activeLayerIndex = getInitialLayerIndex();
  renderDetails();
  updateHotspotStates();
  updateDebugPanel();
}

function onDebugCanvasPointerMove(event) {
  if (!debugPickActive) return;
  const intersection = getSurfaceIntersection(event);
  if (!intersection) {
    hideDebugPreview();
    updateDebugPanel();
    return;
  }
  debugCandidate = getLocalSurfacePoint(intersection);
  showDebugPreview(debugCandidate);
  updateDebugPanel();
}

function onDebugCanvasPointerDown(event) {
  if (!debugPickActive || event.button !== 0) return;
  debugPointerDown = {
    x: event.clientX,
    y: event.clientY,
    pointerId: event.pointerId,
  };
}

function onDebugCanvasPointerUp(event) {
  if (!debugPickActive || !debugPointerDown) return;
  const distance = Math.hypot(event.clientX - debugPointerDown.x, event.clientY - debugPointerDown.y);
  debugPointerDown = null;
  if (distance > 4) return;

  const intersection = getSurfaceIntersection(event);
  if (!intersection || !activePart) return;
  const surfacePoint = getLocalSurfacePoint(intersection);
  const part = setPartSurfacePoint(
    activeDevice,
    activePart.id,
    surfacePoint.position,
    surfacePoint.normal,
  );
  if (part) {
    activePart = part;
    debugCandidate = surfacePoint;
    showDebugPreview(surfacePoint);
    updateHotspotPositions();
    updateDebugPanel();
  }
}

function setupDebugPanel() {
  if (!debugEnabled) return;

  debugPanel = document.createElement("section");
  debugPanel.className = "debug-panel";
  debugPanel.innerHTML = `
    <div class="debug-header">
      <strong>标注点调试</strong>
      <span>?debug=1</span>
    </div>
    <p>先选部件，再旋转/缩放模型到合适角度。点“开始定位”后，在模型表面单击确认位置；拖动仍然只旋转模型。</p>
    <div class="debug-part-list"></div>
    <button type="button" class="debug-pick-button">开始定位</button>
    <div class="debug-status"></div>
    <pre></pre>
    <button type="button" class="debug-copy-button">复制当前坐标</button>
  `;
  debugPartsList = debugPanel.querySelector(".debug-part-list");
  debugPickButton = debugPanel.querySelector(".debug-pick-button");
  debugStatus = debugPanel.querySelector(".debug-status");
  debugOutput = debugPanel.querySelector("pre");
  debugPickButton.addEventListener("click", () => setDebugPickActive(!debugPickActive));
  debugPanel.querySelector(".debug-copy-button").addEventListener("click", async () => {
    const text = debugOutput.textContent;
    await navigator.clipboard?.writeText(text);
  });
  document.body.append(debugPanel);
  canvas.addEventListener("pointermove", onDebugCanvasPointerMove);
  canvas.addEventListener("pointerdown", onDebugCanvasPointerDown);
  canvas.addEventListener("pointerup", onDebugCanvasPointerUp);
  canvas.addEventListener("pointercancel", () => {
    debugPointerDown = null;
  });
  updateDebugPanel();
}

function renderDebugPartList() {
  if (!debugPartsList) return;
  debugPartsList.innerHTML = "";
  activeDevice.parts.forEach((part, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "debug-part-button";
    button.classList.toggle("is-active", part.id === activePart?.id);
    button.textContent = `${index + 1}. ${part.name}`;
    button.addEventListener("click", () => selectDebugPart(part));
    debugPartsList.append(button);
  });
}

function updateDebugPanel() {
  if (!debugEnabled || !debugOutput) return;
  renderDebugPartList();
  if (debugPickButton) {
    debugPickButton.textContent = debugPickActive ? "结束定位" : "开始定位";
    debugPickButton.classList.toggle("is-active", debugPickActive);
  }
  if (debugStatus) {
    const selectedText = activePart ? `当前部件：${activePart.name}` : "当前部件：未选择";
    const hitText = debugCandidate ? "已捕捉到模型表面，可单击确认。" : "移动到模型表面，会出现蓝色预览点。";
    debugStatus.textContent = debugPickActive ? `${selectedText}。${hitText}` : `${selectedText}。观察模式，可旋转缩放模型。`;
  }
  const selected = activePart
    ? `selected: ${activePart.id} ${formatPosition(activePart.position)}\n\n`
    : "";
  debugOutput.textContent = `${activeDevice.id}\n${selected}${exportDevicePositions(activeDevice)}`;
}

function resizeRenderer() {
  const { clientWidth, clientHeight } = viewerShell;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / Math.max(1, clientHeight);
  camera.updateProjectionMatrix();
}

function openImageModal() {
  if (!detailImage.src) return;
  modalScale = 1;
  modalOffset = { x: 0, y: 0 };
  modalImage.src = detailImage.src;
  modalImage.alt = detailImage.alt;
  updateModalTransform();
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
}

function closeImageModal() {
  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
}

function updateModalTransform() {
  modalImage.style.transform = `translate(${modalOffset.x}px, ${modalOffset.y}px) scale(${modalScale})`;
}

function onModalWheel(event) {
  event.preventDefault();
  const delta = event.deltaY > 0 ? -0.12 : 0.12;
  modalScale = Math.min(4, Math.max(0.5, modalScale + delta));
  if (modalScale === 1) modalOffset = { x: 0, y: 0 };
  updateModalTransform();
}

function onModalPointerDown(event) {
  dragState = {
    x: event.clientX,
    y: event.clientY,
    startX: modalOffset.x,
    startY: modalOffset.y,
  };
  modalCanvas.setPointerCapture(event.pointerId);
}

function onModalPointerMove(event) {
  if (!dragState) return;
  modalOffset.x = dragState.startX + event.clientX - dragState.x;
  modalOffset.y = dragState.startY + event.clientY - dragState.y;
  updateModalTransform();
}

function onModalPointerUp(event) {
  dragState = null;
  if (modalCanvas.hasPointerCapture(event.pointerId)) {
    modalCanvas.releasePointerCapture(event.pointerId);
  }
}

resetViewButton.addEventListener("click", () => resetCamera());
detailImageButton.addEventListener("click", openImageModal);
modalCloseButton.addEventListener("click", closeImageModal);
imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) closeImageModal();
});
modalCanvas.addEventListener("wheel", onModalWheel, { passive: false });
modalCanvas.addEventListener("pointerdown", onModalPointerDown);
modalCanvas.addEventListener("pointermove", onModalPointerMove);
modalCanvas.addEventListener("pointerup", onModalPointerUp);
modalCanvas.addEventListener("pointercancel", onModalPointerUp);
window.addEventListener("resize", resizeRenderer);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeImageModal();
});

function animate() {
  updateFocusAnimation();
  controls.update();
  updateHotspotPositions();
  renderer.render(scene, camera);
}

renderDeviceList();
setupDebugPanel();
updateDeviceChrome();
renderDetails();
renderHotspots();
resizeRenderer();
loadModel(activeDevice);
renderer.setAnimationLoop(animate);
