var get_tilt = function() {
    var tilt = {
        x: drone.body.rotation.x,
        y: drone.body.rotation.y,
        z: drone.body.rotation.z
    };

    return tilt;
};

var motor_impulse = function(motor, strength) {
    var force_vector = new THREE.Vector3(0, strength, 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone.body.matrix));

    if (motor == 1) {
        drone.motor_fr.applyCentralForce(force_vector );
    } else if (motor == 2) {
        drone.motor_fl.applyCentralForce(force_vector);
    } else if (motor == 3) {
        drone.motor_bl.applyCentralForce(force_vector);
    } else if (motor == 4) {
        drone.motor_br.applyCentralForce(force_vector);
    }
};
