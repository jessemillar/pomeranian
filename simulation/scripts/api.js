var get_tilt = function() {
    var tilt = {
        x: drone_body.rotation.x,
        y: drone_body.rotation.y,
        z: drone_body.rotation.z
    };

    return tilt;
};

var motor_impulse = function(motor, strength) {
    var force_vector = new THREE.Vector3(0, strength, 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));

    if (motor == 1) {
        drone_body.applyForce(force_vector, new THREE.Vector3(-drone_depth, 0, -drone_width));
    } else if (motor == 2) {
        drone_body.applyForce(force_vector, new THREE.Vector3(-drone_depth, 0, drone_width));
    } else if (motor == 3) {
        drone_body.applyForce(force_vector, new THREE.Vector3(drone_depth, 0, drone_width));
    } else if (motor == 4) {
        drone_body.applyForce(force_vector, new THREE.Vector3(drone_depth, 0, -drone_width));
    }
};
