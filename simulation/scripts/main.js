// Measurement values are in SI units; EG: kg, meters, and seconds

var drone_depth = 0.02,
    drone_height = 0.01,
    drone_width = 0.02,
    motor_diameter = 0.0075,
    starting_height = 0.1,
    previous_height = starting_height,
    drone_body_weight = 0.2,
    drone_motor_weight = 0.1,
    drone_weight = drone_body_weight + drone_motor_weight * 4,
    gravity_strength = 9.8,
    camera_distance = 0.25,
    motor_strength = gravity_strength * 2,
    floor_size = 5,
    motor_power = false,
    motor_level = 20, // Modifier of gravity
    motor_increment = 0.05;

document.addEventListener( // For development purposes only
    'keydown',
    function(event) {
        if (event.keyCode == 32) {
            motor_power = !motor_power;
            console.log("Toggling motors");
        } else if (event.keyCode == 38) {
            motor_level -= motor_increment;
            console.log("Increasing motor power");
        } else if (event.keyCode == 40) {
            motor_level += motor_increment;
            console.log("Decreasing motor power");
        }
    }
);

document.addEventListener( // For mobile simulation development
    'touchstart',
    function(event) {
        if (event.targetTouches.length == 1) {
            var screen_height = window.innerHeight;

            if (touch.pageY < screen_height / 3) {
                motor_power = !motor_power;
                console.log("Toggling motors");
            } else if (touch.pageY > screen_height / 3 && touch.pageY < (screen_height - screen_height / 3)) {
                motor_level -= motor_increment;
                console.log("Increasing motor power");
            } else if (touch.pageY < (screen_height / 3 * 2)) {
                motor_level += motor_increment;
                console.log("Decreasing motor power");
            }
        }
    }
);

var main = function() {
    console.log(get_tilt());

    if (motor_power) {
        hover();
    }

    // console.log(drone_body.position);
};

var hover = function() {
    var force = gravity_strength / motor_level;

    motor_impulse(1, force);
    motor_impulse(2, force);
    motor_impulse(3, force);
    motor_impulse(4, force);
};
