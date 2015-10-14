// Measurement values are in SI units; EG: kg, meters, and seconds

var scale = 10,
    drone_depth = 0.02 * scale,
    drone_height = 0.01 * scale,
    drone_width = 0.02 * scale,
    motor_diameter = 0.008 * scale,
    starting_height = 2.5 * scale,
    drone_body_weight = 0.2 * scale,
    drone_motor_weight = 0.1 * scale,
    drone_weight = (drone_body_weight + drone_motor_weight * 4) * scale,
    gravity_strength = 9.8 * scale,
    camera_distance = 1 * scale,
    floor_size = 5 * scale,
    floor_thickness = 0.5 * scale,
    motor_power = true,
    motor_level = 2, // Modifier of gravity
    motor_increment = 0.0025 * scale,
    motor_thrust = [{ // angle gets automatically computed in api.js
        force: 0,
        angle: 0
    }, {
        force: 0,
        angle: 0
    }, {
        force: 0,
        angle: 0
    }, {
        force: 0,
        angle: 0
    }],
    debug = true,
    helper_arrow_scale = 0.1;

document.addEventListener(
    'keydown',
    function(event) {
        if (event.keyCode == 13) {
            console.log("Adding death box");

            var death_box = new Physijs.BoxMesh(
                new THREE.BoxGeometry(drone_height, drone_height, drone_height),
                ground_material,
                drone_weight / 50 // mass
            );

            death_box.position.x = drone_body.position.x - drone_width / 2;
            death_box.position.y = drone_body.position.y + drone_height;
            death_box.position.z = drone_body.position.z - drone_width / 2;

            death_box.setCcdMotionThreshold(drone_height / 2);
            death_box.setCcdSweptSphereRadius(drone_height / 2);

            scene.add(death_box);
        } else if (event.keyCode == 32) {
            motor_power = !motor_power;
            console.log("Toggling motors");
        } else if (event.keyCode == 38) {
            motor_level += motor_increment;
            console.log("Increasing motor power");
        } else if (event.keyCode == 40) {
            motor_level -= motor_increment;
            console.log("Decreasing motor power");
        }
    }
);

var main = function() {
    console.log(getPosition(), getTilt());

    if (motor_power) {
        hover();
    }

    safetySwitch();
    helperArrows();
};

var hover = function() {
    motor_thrust[0].force = gravity_strength / 4 * motor_level;
    motor_thrust[1].force = gravity_strength / 4 * motor_level;
    motor_thrust[2].force = gravity_strength / 4 * motor_level;
    motor_thrust[3].force = gravity_strength / 4 * motor_level;

    impulseMotors();
};
