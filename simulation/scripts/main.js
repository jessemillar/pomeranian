// Measurement values are in SI units; EG: kg, meters, and seconds

var scale = 10, // So that the physics engine works properly
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
    power = true,
    throttle = 4.95 * scale,
    motor_increment = 0.005 * scale,
    pitch_offset = 0,
    roll_offset = 0,
    yaw_offset = 0,
    motor_power = [0, 0, 0, 0],
    motor_angle = [0, 0, 0, 0], // Made global for helper arrows
    debug = true,
    helper_arrow_scale = 0.03;

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
            power = !power;
            // console.log("Toggling motors");
        } else if (event.keyCode == 38) { // Up arrow
            throttle += motor_increment;
            // console.log("Increasing motor power");
        } else if (event.keyCode == 40) { // Down arrow
            throttle -= motor_increment;
            // console.log("Decreasing motor power");
        } else if (event.keyCode == 65) { // "A" key
            roll_offset -= motor_increment / 2;
        } else if (event.keyCode == 68) { // "D" key
            roll_offset += motor_increment / 2;
        } else if (event.keyCode == 83) { // "S" key
            pitch_offset += motor_increment / 2;
        } else if (event.keyCode == 87) { // "W" key
            pitch_offset -= motor_increment / 2;
        }
    }
);

var p = 3;
var i = 0;
var d = 0.1;
var rollPid = new PID(p, i, d);
var pitchPid = new PID(p, i, d);

var main = function() {
    if (power) {
        var roll = -rollPid.update(getTilt().x);
        var pitch = -pitchPid.update(getTilt().z);

        roll_offset = roll;
        pitch_offset = pitch;

        motor_power[0] = throttle - roll_offset / 2 + pitch_offset / 2;
        motor_power[1] = throttle + roll_offset / 2 + pitch_offset / 2;
        motor_power[2] = throttle + roll_offset / 2 - pitch_offset / 2;
        motor_power[3] = throttle - roll_offset / 2 - pitch_offset / 2;

        impulseMotors();
    }

    // safetySwitch();
    helperArrows(); // Update the helper arrows (for debugging purposes)
};
