// Measurement values are in SI units; EG: kg, meters, and seconds

var accelerometer_update_frequency = 10,
    drone_depth = 0.025,
    drone_height = 0.015,
    drone_width = 0.02,
    motor_diameter = 0.0075,
    starting_height = 1,
    drone_body_weight = 0.2,
    drone_motor_weight = 0.1,
    gravity_strength = 9.8,
    camera_distance = 2,
    light_distance = camera_distance * 2,
    motor_strength = gravity_strength / 25,
    floor_size = 10;

document.addEventListener(
    'keydown',
    function(event) {
        switch (event.keyCode) {
            case 38:
                motor_impulse(1, 1);
                motor_impulse(2, 1);
                motor_impulse(3, 1);
                motor_impulse(4, 1);
        }
    }
);

setInterval(function() {
    console.log(get_tilt());

    // DO STUFF HERE
}, accelerometer_update_frequency);

var get_tilt = function() {
    return [drone.body.rotation.x, drone.body.rotation.y, drone.body.rotation.z];
};

var motor_impulse = function(motor, power_percent) {
    if (!power_percent) {
        power_percent = 1;
    }

    var force_vector = new THREE.Vector3(0, motor_strength * power_percent, 0).applyMatrix4(new THREE.Matrix4().extractRotation(drone.body.matrix));

    if (motor == 1) {
        drone.motor_fr.applyCentralImpulse(force_vector );
    } else if (motor == 2) {
        drone.motor_fl.applyCentralImpulse(force_vector);
    } else if (motor == 3) {
        drone.motor_bl.applyCentralImpulse(force_vector);
    } else if (motor == 4) {
        drone.motor_br.applyCentralImpulse(force_vector);
    }
};
