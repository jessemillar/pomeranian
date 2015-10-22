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
