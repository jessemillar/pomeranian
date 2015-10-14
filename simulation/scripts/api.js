var get_tilt = function() {
    var decimal_places = 3;

    var tilt = {
        x: (drone_body.rotation.x * (180 / Math.PI)).toFixed(decimal_places),
        y: (drone_body.rotation.y * (180 / Math.PI)).toFixed(decimal_places),
        z: (drone_body.rotation.z * (180 / Math.PI)).toFixed(decimal_places)
    };

    return tilt;
};

var motor_impulse = function() {
    motor_thrust[0].angle = new THREE.Vector3(0, motor_thrust[0].force, 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));
    drone_body.applyForce(motor_thrust[0].angle, new THREE.Vector3(-drone_depth, 0, -drone_width));

    motor_thrust[1].angle = new THREE.Vector3(0, motor_thrust[1].force, 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));
    drone_body.applyForce(motor_thrust[1].angle, new THREE.Vector3(-drone_depth, 0, drone_width));

    motor_thrust[2].angle = new THREE.Vector3(0, motor_thrust[2].force, 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));
    drone_body.applyForce(motor_thrust[2].angle, new THREE.Vector3(drone_depth, 0, drone_width));

    motor_thrust[3].angle = new THREE.Vector3(0, motor_thrust[3].force, 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));
    drone_body.applyForce(motor_thrust[3].angle, new THREE.Vector3(drone_depth, 0, -drone_width));
};

var update_helper_arrows = function() {
    if (debug) {
        if (motor_thrust[0].force > 0) {
            var position = new THREE.Vector3();
            position.setFromMatrixPosition(drone_body.children[0].matrixWorld);

            debug_arrow_fr.position.x = position.x;
            debug_arrow_fr.position.y = position.y;
            debug_arrow_fr.position.z = position.z;
            debug_arrow_fr.setDirection(motor_thrust[0].angle.normalize().negate());
            debug_arrow_fr.setLength(motor_thrust[0].force, drone_height / 2, drone_height / 2);
        }

        if (motor_thrust[1].force > 0) {
            var position = new THREE.Vector3();
            position.setFromMatrixPosition(drone_body.children[1].matrixWorld);

            debug_arrow_fl.position.x = position.x;
            debug_arrow_fl.position.y = position.y;
            debug_arrow_fl.position.z = position.z;
            debug_arrow_fl.setDirection(motor_thrust[1].angle.normalize().negate());
            debug_arrow_fl.setLength(motor_thrust[1].force, drone_height / 2, drone_height / 2);
        }

        if (motor_thrust[2].force > 0) {
            var position = new THREE.Vector3();
            position.setFromMatrixPosition(drone_body.children[2].matrixWorld);

            debug_arrow_bl.position.x = position.x;
            debug_arrow_bl.position.y = position.y;
            debug_arrow_bl.position.z = position.z;
            debug_arrow_bl.setDirection(motor_thrust[2].angle.normalize().negate());
            debug_arrow_bl.setLength(motor_thrust[2].force, drone_height / 2, drone_height / 2);
        }

        if (motor_thrust[3].force > 0) {
            var position = new THREE.Vector3();
            position.setFromMatrixPosition(drone_body.children[3].matrixWorld);

            debug_arrow_br.position.x = position.x;
            debug_arrow_br.position.y = position.y;
            debug_arrow_br.position.z = position.z;
            debug_arrow_br.setDirection(motor_thrust[3].angle.normalize().negate());
            debug_arrow_br.setLength(motor_thrust[3].force, drone_height / 2, drone_height / 2);
        }
    }
};
