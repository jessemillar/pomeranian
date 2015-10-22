var helperArrows = function() {
    if (debug) {
        var positionTemp;

        scene.updateMatrixWorld();

        if (motorPower[0] > 0 && power) {
            frDebugArrow.visible = true;

            positionTemp = new THREE.Vector3();
            positionTemp.setFromMatrixPosition(droneBody.children[0].matrixWorld);

            frDebugArrow.setDirection(motorAngle[0].normalize().negate());
            frDebugArrow.setLength(motorPower[0] * helperArrowScale, droneHeight / 2, droneHeight / 2);

            frDebugArrow.position.x = positionTemp.x;
            frDebugArrow.position.y = positionTemp.y;
            frDebugArrow.position.z = positionTemp.z;
        } else {
            frDebugArrow.visible = false;
        }

        if (motorPower[1] > 0 && power) {
            flDebugArrow.visible = true;

            positionTemp = new THREE.Vector3();
            positionTemp.setFromMatrixPosition(droneBody.children[1].matrixWorld);

            flDebugArrow.position.x = positionTemp.x;
            flDebugArrow.position.y = positionTemp.y;
            flDebugArrow.position.z = positionTemp.z;
            flDebugArrow.setDirection(motorAngle[1].normalize().negate());
            flDebugArrow.setLength(motorPower[1] * helperArrowScale, droneHeight / 2, droneHeight / 2);
        } else {
            flDebugArrow.visible = false;
        }

        if (motorPower[2] > 0 && power) {
            blDebugArrow.visible = true;

            positionTemp = new THREE.Vector3();
            positionTemp.setFromMatrixPosition(droneBody.children[2].matrixWorld);

            blDebugArrow.position.x = positionTemp.x;
            blDebugArrow.position.y = positionTemp.y;
            blDebugArrow.position.z = positionTemp.z;
            blDebugArrow.setDirection(motorAngle[2].normalize().negate());
            blDebugArrow.setLength(motorPower[2] * helperArrowScale, droneHeight / 2, droneHeight / 2);
        } else {
            blDebugArrow.visible = false;
        }

        if (motorPower[3] > 0 && power) {
            brDebugArrow.visible = true;

            positionTemp = new THREE.Vector3();
            positionTemp.setFromMatrixPosition(droneBody.children[3].matrixWorld);

            brDebugArrow.position.x = positionTemp.x;
            brDebugArrow.position.y = positionTemp.y;
            brDebugArrow.position.z = positionTemp.z;
            brDebugArrow.setDirection(motorAngle[3].normalize().negate());
            brDebugArrow.setLength(motorPower[3] * helperArrowScale, droneHeight / 2, droneHeight / 2);
        } else {
            brDebugArrow.visible = false;
        }

        positionTemp = new THREE.Vector3();
        positionTemp.setFromMatrixPosition(droneBody.matrixWorld);

        gravityDebugArrow.position.x = positionTemp.x;
        gravityDebugArrow.position.y = positionTemp.y;
        gravityDebugArrow.position.z = positionTemp.z;
        gravityDebugArrow.setDirection(new THREE.Vector3(0, 1, 0).normalize().negate());
        gravityDebugArrow.setLength(gravityStrength / 2 * helperArrowScale, droneHeight / 2, droneHeight / 2);
    }
};
