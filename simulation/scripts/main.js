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
    camera_distance = 1.25,
    light_distance = camera_distance * 2,
    motor_strength = gravity_strength * 2,
    floor_size = 5;

document.addEventListener( // For development purposes only
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

var main = function () {
    // console.log(get_tilt());

    hover();

    // console.log(drone_body.position);
};

var hover = function() {
    var force = gravity_strength / 20;

    motor_impulse(1, force);
    motor_impulse(2, force);
    motor_impulse(3, force);
    motor_impulse(4, force);
};
