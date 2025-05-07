// main.js
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.15, 0.15, 0.3);

const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 1.5, -5), scene);
camera.attachControl(canvas, true);
camera.inertia = 0.1;
camera.speed = 0.3;
camera.angularSensibility = 500;

camera.keysUp.push(87);    // W
camera.keysDown.push(83);  // S
camera.keysLeft.push(65);  // A
camera.keysRight.push(68); // D

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;

const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);

// Gun model
const gunMaterial = new BABYLON.StandardMaterial("gunMat", scene);
gunMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);

const gunBody = BABYLON.MeshBuilder.CreateBox("gunBody", { height: 0.15, width: 0.3, depth: 0.6 }, scene);
const gunHandle = BABYLON.MeshBuilder.CreateBox("gunHandle", { height: 0.2, width: 0.1, depth: 0.15 }, scene);
gunHandle.position.y = -0.175;
gunHandle.position.z = -0.1;
const gunBarrel = BABYLON.MeshBuilder.CreateCylinder("gunBarrel", { height: 0.4, diameter: 0.05 }, scene);
gunBarrel.rotation.x = Math.PI / 2;
gunBarrel.position.z = 0.4;

const gun = BABYLON.Mesh.MergeMeshes([gunBody, gunHandle, gunBarrel], true, false, null, false, true);
gun.material = gunMaterial;
gun.parent = camera;
gun.position = new BABYLON.Vector3(0.3, -0.3, 1);

// Muzzle flash
const muzzleFlash = new BABYLON.PointLight("muzzleFlash", new BABYLON.Vector3(0, 0, 0), scene);
muzzleFlash.diffuse = new BABYLON.Color3(1, 0.8, 0.4);
muzzleFlash.intensity = 0;
muzzleFlash.range = 5;
muzzleFlash.parent = gun;
muzzleFlash.position = new BABYLON.Vector3(0, 0, 0.4);

function triggerMuzzleFlash() {
  muzzleFlash.intensity = 3;
  setTimeout(() => { muzzleFlash.intensity = 0; }, 50);
}

// Enemies
const enemies = [];
function createEnemy(position) {
  const enemy = BABYLON.MeshBuilder.CreateBox("enemy", { size: 0.8 }, scene);
  enemy.position = position;
  const enemyMat = new BABYLON.StandardMaterial("enemyMat", scene);
  enemyMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
  enemy.material = enemyMat;
  enemies.push(enemy);
}
createEnemy(new BABYLON.Vector3(0, 0.4, 5));
createEnemy(new BABYLON.Vector3(-2, 0.4, 8));
createEnemy(new BABYLON.Vector3(3, 0.4, 10));

// Shooting
window.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    shoot();
  }
});

function shoot() {
  triggerMuzzleFlash();
  const origin = camera.position;
  const forward = camera.getForwardRay().direction;
  const ray = new BABYLON.Ray(origin, forward, 100);

  const hit = scene.pickWithRay(ray, (mesh) => enemies.includes(mesh));

  if (hit.pickedMesh) {
    hit.pickedMesh.dispose();
    console.log("Enemy hit!");
  } else {
    console.log("Missed");
  }
}

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
