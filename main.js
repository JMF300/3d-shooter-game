import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';
import { PointerLockControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls, gun, flash, score = 0;
const bullets = [];
const targets = [];

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222244);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 2;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new PointerLockControls(camera, document.body);
    document.body.addEventListener('click', () => controls.lock());
    scene.add(controls.getObject());

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);

    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const gunGeometry = new THREE.BoxGeometry(0.2, 0.2, 1);
    const gunMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    gun = new THREE.Mesh(gunGeometry, gunMaterial);
    gun.position.set(0.5, -0.5, -1);
    camera.add(gun);

    const flashGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    flash = new THREE.Mesh(flashGeo, flashMat);
    flash.visible = false;
    flash.position.set(0, 0, -1.5);
    camera.add(flash);

    for (let i = 0; i < 10; i++) {
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20);
        scene.add(box);
        targets.push(box);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onShoot);
}

const move = { forward: false, left: false, backward: false, right: false };
function onKeyDown(e) {
    if (e.code === 'KeyW') move.forward = true;
    if (e.code === 'KeyA') move.left = true;
    if (e.code === 'KeyS') move.backward = true;
    if (e.code === 'KeyD') move.right = true;
}
function onKeyUp(e) {
    if (e.code === 'KeyW') move.forward = false;
    if (e.code === 'KeyA') move.left = false;
    if (e.code === 'KeyS') move.backward = false;
    if (e.code === 'KeyD') move.right = false;
}

function onShoot() {
    flash.visible = true;
    setTimeout(() => flash.visible = false, 50);

    const raycaster = new THREE.Raycaster(camera.position, camera.getWorldDirection(new THREE.Vector3()));
    const intersects = raycaster.intersectObjects(targets);
    if (intersects.length > 0) {
        const target = intersects[0].object;
        scene.remove(target);
        targets.splice(targets.indexOf(target), 1);
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
    }
}

function animate() {
    requestAnimationFrame(animate);

    const speed = 0.1;
    const direction = new THREE.Vector3();
    if (move.forward) direction.z -= 1;
    if (move.backward) direction.z += 1;
    if (move.left) direction.x -= 1;
    if (move.right) direction.x += 1;
    direction.normalize();
    direction.applyQuaternion(camera.quaternion);
    controls.moveRight(direction.x * speed);
    controls.moveForward(direction.z * speed);

    renderer.render(scene, camera);
}
