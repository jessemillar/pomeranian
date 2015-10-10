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
                var rotation_matrix = new THREE.Matrix4().extractRotation(drone.body.matrix);
                var force_vector = new THREE.Vector3(0, motor_strength, 0).applyMatrix4(rotation_matrix);

                drone.motor_fl.applyCentralImpulse(force_vector);
                drone.motor_fr.applyCentralImpulse(force_vector);
                drone.motor_bl.applyCentralImpulse(force_vector);
                drone.motor_br.applyCentralImpulse(force_vector);
        }
    }
);

setInterval(function() {
    console.log(drone.body.rotation);
}, accelerometer_update_frequency);
