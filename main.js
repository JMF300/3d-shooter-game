
const canvas = document.getElementById('gameCanvas');
const startBtn = document.getElementById('startBtn');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new THREE.PointerLockControls(camera, document.body);

startBtn.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => startBtn.style.display = 'none');
controls.addEventListener('unlock', () => startBtn.style.display = 'block');

scene.add(controls.getObject());
camera.position.y = 1.6;

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const playerShape = new CANNON.Sphere(0.5);
const playerBody = new CANNON.Body({ mass: 1, shape: playerShape });
playerBody.position.set(0, 2, 0);
world.addBody(playerBody);

const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const floorGeometry = new THREE.BoxGeometry(100, 1, 100);
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.receiveShadow = true;
scene.add(floorMesh);

const floorBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Box(new CANNON.Vec3(50, 0.5, 50)),
  position: new CANNON.Vec3(0, -0.5, 0)
});
world.addBody(floorBody);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 2);
dirLight.castShadow = true;
scene.add(dirLight);

// Simple weapon shooting
let bullets = [];
document.addEventListener('click', () => {
  if (!controls.isLocked) return;

  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.05),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  bullet.position.copy(camera.position);
  scene.add(bullet);
  bullets.push({ mesh: bullet, dir: direction.clone(), speed: 50 });
});

// Movement
let velocity = new THREE.Vector3();
let keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function movePlayer(delta) {
  const speed = 5;
  velocity.set(0, 0, 0);

  if (keys['w']) velocity.z -= speed * delta;
  if (keys['s']) velocity.z += speed * delta;
  if (keys['a']) velocity.x -= speed * delta;
  if (keys['d']) velocity.x += speed * delta;

  const dir = new THREE.Vector3();
  controls.getDirection(dir);
  const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0));

  playerBody.velocity.x = dir.x * velocity.z + right.x * velocity.x;
  playerBody.velocity.z = dir.z * velocity.z + right.z * velocity.x;
}

function animate() {
  requestAnimationFrame(animate);
  const delta = 1 / 60;

  world.step(delta);
  movePlayer(delta);

  camera.position.copy(playerBody.position);
  bullets.forEach(b => b.mesh.position.addScaledVector(b.dir, b.speed * delta));

  renderer.render(scene, camera);
}

animate();
