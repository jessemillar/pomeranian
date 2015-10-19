var getTilt = function() {
    var decimal_places = 3;

    var tilt = {
        x: (drone_body.rotation.x * (180 / Math.PI)).toFixed(decimal_places),
        y: (drone_body.rotation.y * (180 / Math.PI)).toFixed(decimal_places),
        z: (drone_body.rotation.z * (180 / Math.PI)).toFixed(decimal_places)
    };

    return tilt;
};

var getPosition = function() {
    var decimal_places = 3;

    var tilt = {
        x: (drone_body.position.x).toFixed(decimal_places),
        y: (drone_body.position.y).toFixed(decimal_places),
        z: (drone_body.position.z).toFixed(decimal_places)
    };

    return tilt;
};

var impulseMotors = function() {
    motor_angle[0] = new THREE.Vector3(0, motor_power[0], 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));
    drone_body.applyForce(motor_angle[0], new THREE.Vector3(-drone_depth, 0, -drone_width));

    motor_angle[1] = new THREE.Vector3(0, motor_power[1], 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));
    drone_body.applyForce(motor_angle[1], new THREE.Vector3(-drone_depth, 0, drone_width));

    motor_angle[2] = new THREE.Vector3(0, motor_power[2], 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));
    drone_body.applyForce(motor_angle[2], new THREE.Vector3(drone_depth, 0, drone_width));

    motor_angle[3] = new THREE.Vector3(0, motor_power[3], 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone_body.matrix));
    drone_body.applyForce(motor_angle[3], new THREE.Vector3(drone_depth, 0, -drone_width));
};

var safetySwitch = function() {
    var rotation = getTilt();

    if (power && Math.round(Math.abs(rotation.x)) == 180 || Math.round(Math.abs(rotation.z)) == 180) { // Turn off the motors if we turn upside down
        console.log("Killing the motors for safety");
        power = false;
    }
};

var helperArrows = function() {
    if (debug) {
        var temp_position;

        scene.updateMatrixWorld();

        if (motor_power[0] > 0 && power) {
            debug_arrow_fr.visible = true;

            temp_position = new THREE.Vector3();
            temp_position.setFromMatrixPosition(drone_body.children[0].matrixWorld);

            debug_arrow_fr.setDirection(motor_angle[0].normalize().negate());
            debug_arrow_fr.setLength(motor_power[0] * helper_arrow_scale, drone_height / 2, drone_height / 2);

            debug_arrow_fr.position.x = temp_position.x;
            debug_arrow_fr.position.y = temp_position.y;
            debug_arrow_fr.position.z = temp_position.z;
        } else {
            debug_arrow_fr.visible = false;
        }

        if (motor_power[1] > 0 && power) {
            debug_arrow_fl.visible = true;

            temp_position = new THREE.Vector3();
            temp_position.setFromMatrixPosition(drone_body.children[1].matrixWorld);

            debug_arrow_fl.position.x = temp_position.x;
            debug_arrow_fl.position.y = temp_position.y;
            debug_arrow_fl.position.z = temp_position.z;
            debug_arrow_fl.setDirection(motor_angle[1].normalize().negate());
            debug_arrow_fl.setLength(motor_power[1] * helper_arrow_scale, drone_height / 2, drone_height / 2);
        } else {
            debug_arrow_fl.visible = false;
        }

        if (motor_power[2] > 0 && power) {
            debug_arrow_bl.visible = true;

            temp_position = new THREE.Vector3();
            temp_position.setFromMatrixPosition(drone_body.children[2].matrixWorld);

            debug_arrow_bl.position.x = temp_position.x;
            debug_arrow_bl.position.y = temp_position.y;
            debug_arrow_bl.position.z = temp_position.z;
            debug_arrow_bl.setDirection(motor_angle[2].normalize().negate());
            debug_arrow_bl.setLength(motor_power[2] * helper_arrow_scale, drone_height / 2, drone_height / 2);
        } else {
            debug_arrow_bl.visible = false;
        }

        if (motor_power[3] > 0 && power) {
            debug_arrow_br.visible = true;

            temp_position = new THREE.Vector3();
            temp_position.setFromMatrixPosition(drone_body.children[3].matrixWorld);

            debug_arrow_br.position.x = temp_position.x;
            debug_arrow_br.position.y = temp_position.y;
            debug_arrow_br.position.z = temp_position.z;
            debug_arrow_br.setDirection(motor_angle[3].normalize().negate());
            debug_arrow_br.setLength(motor_power[3] * helper_arrow_scale, drone_height / 2, drone_height / 2);
        } else {
            debug_arrow_br.visible = false;
        }

        temp_position = new THREE.Vector3();
        temp_position.setFromMatrixPosition(drone_body.matrixWorld);

        debug_arrow_gravity.position.x = temp_position.x;
        debug_arrow_gravity.position.y = temp_position.y;
        debug_arrow_gravity.position.z = temp_position.z;
        debug_arrow_gravity.setDirection(new THREE.Vector3(0, 1, 0).normalize().negate());
        debug_arrow_gravity.setLength(gravity_strength / 2 * helper_arrow_scale, drone_height / 2, drone_height / 2);
    }
};
