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
        drone_body.children[0].applyCentralForce(force_vector);
    } else if (motor == 2) {
        drone_body.children[1].applyCentralForce(force_vector);
    } else if (motor == 3) {
        drone_body.children[2].applyCentralForce(force_vector);
    } else if (motor == 4) {
        drone_body.children[3].applyCentralForce(force_vector);
    }
};
