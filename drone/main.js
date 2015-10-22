// scale is located in the simulation's main.js file

var power = true,
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
};
