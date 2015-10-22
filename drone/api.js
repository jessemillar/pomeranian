var getTilt = function() {
    var decimals = 5;

    var tilt = {
        x: (droneBody.rotation.x * (180 / Math.PI)).toFixed(decimals),
        y: (droneBody.rotation.y * (180 / Math.PI)).toFixed(decimals),
        z: (droneBody.rotation.z * (180 / Math.PI)).toFixed(decimals)
    };

    return tilt;
};

var getPosition = function() {
    var decimals = 5;

    var tilt = {
        x: (droneBody.position.x).toFixed(decimals),
        y: (droneBody.position.y).toFixed(decimals),
        z: (droneBody.position.z).toFixed(decimals)
    };

    return tilt;
};

var impulseMotors = function() {
    motorAngle[0] = new THREE.Vector3(0, motorPower[0], 0).applyMatrix4(new THREE.Matrix4().extractRotation(droneBody.matrix));
    droneBody.applyForce(motorAngle[0], new THREE.Vector3(-droneDepth, 0, -droneWidth));

    motorAngle[1] = new THREE.Vector3(0, motorPower[1], 0).applyMatrix4(new THREE.Matrix4().extractRotation(droneBody.matrix));
    droneBody.applyForce(motorAngle[1], new THREE.Vector3(-droneDepth, 0, droneWidth));

    motorAngle[2] = new THREE.Vector3(0, motorPower[2], 0).applyMatrix4(new THREE.Matrix4().extractRotation(droneBody.matrix));
    droneBody.applyForce(motorAngle[2], new THREE.Vector3(droneDepth, 0, droneWidth));

    motorAngle[3] = new THREE.Vector3(0, motorPower[3], 0).applyMatrix4(new THREE.Matrix4().extractRotation(droneBody.matrix));
    droneBody.applyForce(motorAngle[3], new THREE.Vector3(droneDepth, 0, -droneWidth));
};

var safetySwitch = function() {
    var rotation = getTilt();

    if (power && Math.round(Math.abs(rotation.x)) == 180 || Math.round(Math.abs(rotation.z)) == 180) { // Turn off the motors if we turn upside down
        console.log("Killing the motors for safety");
        power = false;
    }
};
