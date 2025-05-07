// --- Input Handling ---
let keys = {};
let mouse = { x: 0, y: 0 };

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === 'c') {
        isCrouching = false;
        isSliding = false;
        playerMesh.scale.y = 1;
    }
});
document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
