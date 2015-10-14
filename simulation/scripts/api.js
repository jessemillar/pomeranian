var get_tilt = function() {
    var decimal_places = 3;

    var tilt = {
        x: (drone_body.rotation.x * (180 / Math.PI)).toFixed(decimal_places),
        y: (drone_body.rotation.y * (180 / Math.PI)).toFixed(decimal_places),
        z: (drone_body.rotation.z * (180 / Math.PI)).toFixed(decimal_places)
    };

    return tilt;
};

var impulse_motors = function() {
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
        var temp_position;

        scene.updateMatrixWorld();

        if (motor_thrust[0].force > 0 && motor_power) {
            debug_arrow_fr.visible = true;

            temp_position = new THREE.Vector3();
            temp_position.setFromMatrixPosition(drone_body.children[0].matrixWorld);

            debug_arrow_fr.setDirection(motor_thrust[0].angle.normalize().negate());
            debug_arrow_fr.setLength(motor_thrust[0].force, drone_height / 2, drone_height / 2);

            debug_arrow_fr.position.x = temp_position.x;
            debug_arrow_fr.position.y = temp_position.y;
            debug_arrow_fr.position.z = temp_position.z;
        } else {
            debug_arrow_fr.visible = false;
        }

        if (motor_thrust[1].force > 0 && motor_power) {
            debug_arrow_fl.visible = true;

            temp_position = new THREE.Vector3();
            temp_position.setFromMatrixPosition(drone_body.children[1].matrixWorld);

            debug_arrow_fl.position.x = temp_position.x;
            debug_arrow_fl.position.y = temp_position.y;
            debug_arrow_fl.position.z = temp_position.z;
            debug_arrow_fl.setDirection(motor_thrust[1].angle.normalize().negate());
            debug_arrow_fl.setLength(motor_thrust[1].force, drone_height / 2, drone_height / 2);
        } else {
            debug_arrow_fl.visible = false;
        }

        if (motor_thrust[2].force > 0 && motor_power) {
            debug_arrow_bl.visible = true;

            temp_position = new THREE.Vector3();
            temp_position.setFromMatrixPosition(drone_body.children[2].matrixWorld);

            debug_arrow_bl.position.x = temp_position.x;
            debug_arrow_bl.position.y = temp_position.y;
            debug_arrow_bl.position.z = temp_position.z;
            debug_arrow_bl.setDirection(motor_thrust[2].angle.normalize().negate());
            debug_arrow_bl.setLength(motor_thrust[2].force, drone_height / 2, drone_height / 2);
        } else {
            debug_arrow_bl.visible = false;
        }

        if (motor_thrust[3].force > 0 && motor_power) {
            debug_arrow_br.visible = true;

            temp_position = new THREE.Vector3();
            temp_position.setFromMatrixPosition(drone_body.children[3].matrixWorld);

            debug_arrow_br.position.x = temp_position.x;
            debug_arrow_br.position.y = temp_position.y;
            debug_arrow_br.position.z = temp_position.z;
            debug_arrow_br.setDirection(motor_thrust[3].angle.normalize().negate());
            debug_arrow_br.setLength(motor_thrust[3].force, drone_height / 2, drone_height / 2);
        } else {
            debug_arrow_br.visible = false;
        }

        temp_position = new THREE.Vector3();
        temp_position.setFromMatrixPosition(drone_body.matrixWorld);

        debug_arrow_gravity.position.x = temp_position.x;
        debug_arrow_gravity.position.y = temp_position.y;
        debug_arrow_gravity.position.z = temp_position.z;
        debug_arrow_gravity.setDirection(new THREE.Vector3(0, 1, 0).normalize().negate());
        debug_arrow_gravity.setLength(gravity_strength, drone_height / 2, drone_height / 2);
    }
};
