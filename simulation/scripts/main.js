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
    camera_distance = 0.25,
    light_distance = camera_distance * 2,
    motor_strength = gravity_strength * 2,
    floor_size = 5,
    hover_now = false;

document.addEventListener( // For development purposes only
    'keydown',
    function(event) {
        switch (event.keyCode) {
            case 38:
		hover_now = !hover_now;
        }
    }
);

var main = function () {
    //console.log(get_tilt());

    if (hover_now) {
    	hover();
    }

    // console.log(drone_body.position);
};

var hover = function() {
    var force = gravity_strength / 18;

    motor_impulse(1, force);
    motor_impulse(2, force);
    motor_impulse(3, force);
    motor_impulse(4, force);
};
