// Measurement values are in SI units; EG: kg, meters, and seconds

var scale = 10,
    drone_depth = 0.02 * scale,
    drone_height = 0.01 * scale,
    drone_width = 0.02 * scale,
    motor_diameter = 0.008 * scale,
    starting_height = 0 * scale,
    drone_body_weight = 0.2 * scale,
    drone_motor_weight = 0.1 * scale,
    drone_weight = (drone_body_weight + drone_motor_weight * 4) * scale,
    gravity_strength = 9.8 * scale,
    camera_distance = 1 * scale,
    floor_size = 5 * scale,
    floor_thickness = 0.5 * scale,
    motor_power = true,
    motor_level = 2, // Modifier of gravity
    motor_increment = 0.0005 * scale,
    initial_thrust = gravity_strength / 4 * motor_level,
    motor_thrust = [{ // angle gets automatically computed in api.js
        force: initial_thrust,
        angle: 0
    }, {
        force: initial_thrust,
        angle: 0
    }, {
        force: initial_thrust,
        angle: 0
    }, {
        force: initial_thrust,
        angle: 0
    }],
    debug = true,
    helper_arrow_scale = 0.1;

document.addEventListener(
    'keydown',
    function(event) {
        if (event.keyCode == 13) { // "Enter" key
            console.log("Adding death box"); // Use this mostly when you're hovering in a stable state

            var death_box = new Physijs.BoxMesh(
                new THREE.BoxGeometry(drone_height, drone_height, drone_height),
                ground_material,
                drone_weight / 1000
            );

            death_box.position.x = drone_body.position.x - drone_width / 2;
            death_box.position.y = drone_body.position.y + drone_height * 3;
            death_box.position.z = drone_body.position.z - drone_width / 2;

            death_box.setCcdMotionThreshold(drone_height / 2);
            death_box.setCcdSweptSphereRadius(drone_height / 2);

            scene.add(death_box);
        } else if (event.keyCode == 32) { // Spacebar
            motor_power = !motor_power;
            console.log("Toggling motors");
        } else if (event.keyCode == 38) { // Up arrow
            motor_thrust[0].force += motor_increment;
            motor_thrust[1].force += motor_increment;
            motor_thrust[2].force += motor_increment;
            motor_thrust[3].force += motor_increment;
            console.log("Increasing motor power");
        } else if (event.keyCode == 40) { // Down arrow
            motor_thrust[0].force -= motor_increment;
            motor_thrust[1].force -= motor_increment;
            motor_thrust[2].force -= motor_increment;
            motor_thrust[3].force -= motor_increment;
            console.log("Decreasing motor power");
        } else if (event.keyCode == 65) { // "A" key
            portImpulse();
        } else if (event.keyCode == 68) { // "D" key
            starboardImpulse();
        } else if (event.keyCode == 83) { // "S" key
            backwardImpulse();
        } else if (event.keyCode == 87) { // "W" key
            forwardImpulse();
        }
    }
);

var main = function() {
    console.log(getPosition(), getTilt());

    if (motor_power) {
        impulseMotors();
    }

    safetySwitch();
    helperArrows();
};

var forwardImpulse = function() {
    motor_thrust[2].force += motor_increment;
    motor_thrust[3].force += motor_increment;
};

var backwardImpulse = function() {
    motor_thrust[0].force += motor_increment;
    motor_thrust[1].force += motor_increment;
};

var portImpulse = function() {
    motor_thrust[0].force += motor_increment;
    motor_thrust[3].force += motor_increment;
};

var starboardImpulse = function() {
    motor_thrust[1].force += motor_increment;
    motor_thrust[2].force += motor_increment;
};
