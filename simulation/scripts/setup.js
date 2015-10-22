Physijs.scripts.worker = 'scripts/dependencies/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var frDebugArrow, flDebugArrow, blDebugArrow, brDebugArrow, gravityDebugArrow; // Make these global because ghetto
var fpvCameraActive = false;

init = function() {
    projector = new THREE.Projector();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0xcad0fe, 1);
    document.getElementById('viewport').appendChild(renderer.domElement);

    renderStats = new Stats();
    renderStats.domElement.style.position = 'absolute';
    renderStats.domElement.style.top = '0px';
    renderStats.domElement.style.zIndex = 100;
    document.getElementById('viewport').appendChild(renderStats.domElement);

    physicsStats = new Stats();
    physicsStats.domElement.style.position = 'absolute';
    physicsStats.domElement.style.top = '50px';
    physicsStats.domElement.style.zIndex = 100;
    document.getElementById('viewport').appendChild(physicsStats.domElement);

    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -gravityStrength, 0));

    scene.addEventListener(
        'update',
        function() {
            main();
            scene.simulate(undefined, 1);
            physicsStats.update();
        }
    );

    camera = new THREE.TargetCamera(
        60, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near field
        500 // Far field
    );
    scene.add(camera);

    // Ambient light
    var light = new THREE.AmbientLight(0xd6d6d6); // soft white light
    scene.add(light);

    // Light
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 15 * scale, 0);
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = 2048;
    spotLight.shadowMapHeight = 2048;
    spotLight.shadowCameraNear = 0.1;
    spotLight.shadowCameraFov = 30;
    scene.add(spotLight);

    var groundTexture = new THREE.ImageUtils.loadTexture("images/checkerboard.png");
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10, 10);
    var groundMaterial = new THREE.MeshBasicMaterial({
        map: groundTexture,
        side: THREE.DoubleSide
    });

    // Ground
    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(floorSize, floorThickness, floorSize), // Get as close to a plane as possible
        groundMaterial,
        0 // Mass
    );
    ground.position.y = -floorThickness / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Drone
    droneMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            color: 0x0074d9
        }),
        0.75,
        0
    );

    frontMotorMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            color: 0xff0000
        }),
        0.75,
        0
    );

    motorMaterial = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            color: 0xffdc00
        }),
        0.75,
        0
    );

    // Wall obstacle
    wall = new Physijs.BoxMesh(
        new THREE.BoxGeometry(floorSize / 6, floorSize / 6, floorSize / 6), // Get as close to a plane as possible
        motorMaterial,
        100 // Mass
    );
    wall.position.y = floorSize / 6 / 2; // Make the wall start above the floor
    wall.position.x = -floorSize / 3;
    scene.add(wall);

    motorGeometry = new THREE.CylinderGeometry(motorDiameter, motorDiameter, droneHeight / 2, 10);

    droneBody = new Physijs.BoxMesh(
        new THREE.BoxGeometry(droneDepth, droneHeight, droneWidth),
        droneMaterial,
        droneBodyWeight
    );

    droneBody.position.y = startingHeight + droneHeight / 2;
    droneBody.castShadow = true;
    droneBody.setCcdMotionThreshold(droneHeight / 2);
    droneBody.setCcdSweptSphereRadius(droneHeight / 2);

    frMotor = new Physijs.CylinderMesh(
        motorGeometry,
        frontMotorMaterial,
        droneMotorWeight
    );

    frMotor.position.set(-droneDepth, 0, -droneWidth);
    frMotor.castShadow = true;
    droneBody.add(frMotor);

    if (debug) {
        frDebugArrow = new THREE.ArrowHelper(1, new THREE.Vector3(droneBody.position.x - droneDepth, droneBody.position.y, droneBody.position.z - droneWidth), 1, 0xbada55);

        scene.add(frDebugArrow);
    }

    flMotor = new Physijs.CylinderMesh(
        motorGeometry,
        frontMotorMaterial,
        droneMotorWeight
    );

    flMotor.position.set(-droneDepth, 0, droneWidth);
    flMotor.castShadow = true;
    droneBody.add(flMotor);

    if (debug) {
        flDebugArrow = new THREE.ArrowHelper(1, new THREE.Vector3(droneBody.position.x - droneDepth, droneBody.position.y, droneBody.position.z - droneWidth), 1, 0xbada55);

        scene.add(flDebugArrow);
    }

    blMotor = new Physijs.CylinderMesh(
        motorGeometry,
        motorMaterial,
        droneMotorWeight
    );

    blMotor.position.set(droneDepth, 0, droneWidth);
    blMotor.castShadow = true;
    droneBody.add(blMotor);

    if (debug) {
        blDebugArrow = new THREE.ArrowHelper(1, new THREE.Vector3(droneBody.position.x - droneDepth, droneBody.position.y, droneBody.position.z - droneWidth), 1, 0xbada55);

        scene.add(blDebugArrow);
    }

    brMotor = new Physijs.CylinderMesh(
        motorGeometry,
        motorMaterial,
        droneMotorWeight
    );

    brMotor.position.set(droneDepth, 0, -droneWidth);
    brMotor.castShadow = true;
    droneBody.add(brMotor);

    if (debug) {
        brDebugArrow = new THREE.ArrowHelper(1, new THREE.Vector3(droneBody.position.x - droneDepth, droneBody.position.y, droneBody.position.z - droneWidth), 1, 0xbada55);

        scene.add(brDebugArrow);
    }

    fpvCamera = new THREE.PerspectiveCamera(
        60, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.001, // Near field
        500 // Far field
    );
    fpvCamera.position.x = -droneWidth / 2;
    fpvCamera.position.y = droneHeight / 2;
    fpvCamera.rotation.y = 90 * (Math.PI / 180); // Make the camera face the correct direction
    droneBody.add(fpvCamera);

    scene.add(droneBody);

    if (debug) {
        gravityDebugArrow = new THREE.ArrowHelper(1, new THREE.Vector3(droneBody.position.x, droneBody.position.y, droneBody.position.z), 1, 0xff0000);
        scene.add(gravityDebugArrow);

        var axes = new THREE.AxisHelper(100);
        scene.add(axes);
    }

    camera.addTarget({
        name: "drone",
        targetObject: droneBody,
        cameraPosition: new THREE.Vector3(cameraDistance, cameraDistance, -cameraDistance),
        fixed: true,
        stiffness: 0.1,
        matchRotation: false
    });

    camera.setTarget("drone"); // Now tell this camera to track the target we just created.

    requestAnimationFrame(render);
    scene.simulate();
};

render = function() {
    requestAnimationFrame(render);
    camera.update();
    if (fpvCameraActive) {
        renderer.render(scene, fpvCamera);
    } else {
        renderer.render(scene, camera);
    }
    renderStats.update();
};

window.onload = init;
