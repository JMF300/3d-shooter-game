const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Set background (sky) color
scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.1);

// Camera: UniversalCamera for FPS controls
const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 1.6, 0), scene);
camera.attachControl(canvas, true);
camera.speed = 0.3;
camera.inertia = 0.1;

// Enable pointer lock for mouse look
canvas.addEventListener("click", () => {
  canvas.requestPointerLock =
    canvas.requestPointerLock ||
    canvas.msRequestPointerLock ||
    canvas.mozRequestPointerLock ||
    canvas.webkitRequestPointerLock;
  if (canvas.requestPointerLock) {
    canvas.requestPointerLock();
  }
});

// Lighting
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Ground
const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);

// Gun (simple box as placeholder)
const gun = BABYLON.MeshBuilder.CreateBox("gun", { height: 0.2, width: 0.2, depth: 0.6 }, scene);
gun.parent = camera;
gun.position = new BABYLON.Vector3(0.3, -0.3, 1);

const gunMaterial = new BABYLON.StandardMaterial("gunMat", scene);
gunMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
gun.material = gunMaterial;

// Render loop
engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
