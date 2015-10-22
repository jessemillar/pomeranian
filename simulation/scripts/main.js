// Measurement values are in SI units; EG: kg, meters, and seconds

var scale = 10, // So that the physics engine works properly
    droneDepth = 0.02 * scale,
    droneHeight = 0.01 * scale,
    droneWidth = 0.02 * scale,
    motorDiameter = 0.008 * scale,
    startingHeight = 0 * scale,
    droneBodyWeight = 0.2 * scale,
    droneMotorWeight = 0.1 * scale,
    droneWeight = (droneBodyWeight + droneMotorWeight * 4) * scale,
    gravityStrength = 9.8 * scale,
    cameraDistance = 0.5 * scale,
    floorSize = 5 * scale,
    floorThickness = 0.5 * scale,
    power = true,
    throttle = 4.915 * scale,
    motorIncrement = 0.01 * scale,
    controlIncrement = 1 * scale,
    pitchOffset = 0,
    rollOffset = 0,
    yawOffset = 0,
    motorMax = 10 * scale,
    motorMin = 0,
    motorPower = [0, 0, 0, 0],
    motorAngle = [0, 0, 0, 0], // Made global for helper arrows
    rollControl = 0,
    pitchControl = 0,
    debug = true,
    helperArrowScale = 0.03;

document.addEventListener(
    'keydown',
    function(event) {
        if (event.keyCode == 70) { // "F" key
            fpvCameraActive = !fpvCameraActive; // Toggle FPV camera
        } else if (event.keyCode == 13) { // "Enter" key
            var deathBall = new Physijs.SphereMesh(
                new THREE.SphereGeometry(droneWidth * 1.5, 8, 8),
                motorMaterial,
                droneWeight / 1000
            );

            deathBall.position.x = droneBody.position.x + droneWidth / 2;
            deathBall.position.y = droneBody.position.y + droneHeight * 10;
            deathBall.position.z = droneBody.position.z + droneWidth / 2;

            deathBall.castShadow = true;

            deathBall.setCcdMotionThreshold(droneHeight / 2);
            deathBall.setCcdSweptSphereRadius(droneHeight / 2);

            scene.add(deathBall);
        } else if (event.keyCode == 32) { // Spacebar
            power = !power;
            // console.log("Toggling motors");
        } else if (event.keyCode == 38) { // Up arrow
            throttle += motorIncrement;
            // console.log("Increasing motor power");
        } else if (event.keyCode == 40) { // Down arrow
            throttle -= motorIncrement;
            // console.log("Decreasing motor power");
        } else if (event.keyCode == 65) { // "A" key
            rollControl = -controlIncrement;
        } else if (event.keyCode == 68) { // "D" key
            rollControl = controlIncrement;
        } else if (event.keyCode == 83) { // "S" key
            pitchControl = controlIncrement;
        } else if (event.keyCode == 87) { // "W" key
            pitchControl = -controlIncrement;
        }
    }
);

document.addEventListener( // Kill user controls if we're not hitting a key
    'keyup',
    function(event) {
        if (event.keyCode == 65) { // "A" key
            rollControl = 0;
        } else if (event.keyCode == 68) { // "D" key
            rollControl = 0;
        } else if (event.keyCode == 83) { // "S" key
            pitchControl = 0;
        } else if (event.keyCode == 87) { // "W" key
            pitchControl = 0;
        }
    }
);

var p = 3;
var i = 0;
var d = 0.15;
var rollPid = new PID(p, i, d);
var pitchPid = new PID(p, i, d);

var main = function() {
    if (power) {
        var roll = -rollPid.update(getTilt().x);
        var pitch = -pitchPid.update(getTilt().z);

        rollOffset = roll + rollControl;
        pitchOffset = pitch + pitchControl;

        motorPower[0] = throttle - rollOffset / 2 + pitchOffset / 2;
        motorPower[1] = throttle + rollOffset / 2 + pitchOffset / 2;
        motorPower[2] = throttle + rollOffset / 2 - pitchOffset / 2;
        motorPower[3] = throttle - rollOffset / 2 - pitchOffset / 2;

        for (var i = 0; i < motorPower.length; i++) { // Keep motors within bounds
            if (motorPower[i] < motorMin) {
                motorPower[i] = motorMin;
            } else if (motorPower[i] > motorMax) {
                motorPower[i] = motorMax;
            }
        }

        impulseMotors();
    }

    safetySwitch();
    helperArrows(); // Update the helper arrows (for debugging purposes)
};
