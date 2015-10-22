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
    debug = true,
    helperArrowScale = 0.03;

var p = 3;
var i = 0;
var d = 0.15;
var rollPid = new PID(p, i, d);
var pitchPid = new PID(p, i, d);

var simulate = function() {
    main(); // Run the main drone loop
    helperArrows(); // Update the helper arrows (for debugging purposes)
};
