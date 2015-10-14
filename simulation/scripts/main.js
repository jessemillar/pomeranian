// Measurement values are in SI units; EG: kg, meters, and seconds

var drone_depth = 0.02,
    drone_height = 0.01,
    drone_width = 0.02,
    motor_diameter = 0.0075,
    starting_height = 0,
    previous_height = starting_height,
    drone_body_weight = 0.2,
    drone_motor_weight = 0.1,
    drone_weight = drone_body_weight + drone_motor_weight * 4,
    gravity_strength = 9.8,
    camera_distance = 1,
    floor_size = 5,
    motor_power = true,
    motor_level = 0.2, // Modifier of gravity
    motor_increment = 0.005,
    motor_thrust = [{ // angle is for auto computation in api.js
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
    debug = true;

document.addEventListener( // For development purposes only
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
    // console.log(get_tilt());

    if (motor_power) {
        hover();
    }

    // console.log(drone_body.position);

    update_helper_arrows();
};

var hover = function() {
    motor_thrust[0].force = gravity_strength / 4 * motor_level;
    motor_thrust[1].force = gravity_strength / 4 * motor_level;
    motor_thrust[2].force = gravity_strength / 4 * motor_level;
    motor_thrust[3].force = gravity_strength / 4 * motor_level;

    impulse_motors();
};
