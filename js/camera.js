// --- Camera Updates ---
function updateCamera() {
    const targetX = playerBody.position.x;
    const targetY = playerBody.position.y + PLAYER_HEIGHT / 2;
    const targetZ = playerBody.position.z;
    cameraTarget.set(targetX, targetY, targetZ);
    camera.position.lerp(cameraTarget, 0.2);
    camera.lookAt(playerBody.position);
}
