var get_tilt = function() {
    var tilt = {
        x: Math.round(drone_body.rotation.x * (180/Math.PI)),
        y: Math.round(drone_body.rotation.y * (180/Math.PI)),
        z: Math.round(drone_body.rotation.z * (180/Math.PI))  
    };

    return tilt;
};

var motor_impulse = function(motor, strength) {
    var force = new THREE.Vector3(0, strength, 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));

    if (motor == 1) {
        drone_body.applyForce(force, new THREE.Vector3(-drone_depth, 0, -drone_width));
    } else if (motor == 2) {
        drone_body.applyForce(force, new THREE.Vector3(-drone_depth, 0, drone_width));
    } else if (motor == 3) {
        drone_body.applyForce(force, new THREE.Vector3(drone_depth, 0, drone_width));
    } else if (motor == 4) {
        drone_body.applyForce(force, new THREE.Vector3(drone_depth, 0, -drone_width));
    }
};
