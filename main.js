const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// Camera
const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 1.6, -5), scene);
camera.attachControl(canvas, true);
camera.speed = 0.5;

// Light
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

// Ground
const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 20, height: 20}, scene);

// Player gun (placeholder)
const gun = BABYLON.MeshBuilder.CreateBox("gun", {height: 0.2, width: 0.2, depth: 0.6}, scene);
gun.parent = camera;
gun.position = new BABYLON.Vector3(0.2, -0.2, 1);

// Render loop
engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
