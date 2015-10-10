Physijs.scripts.worker = 'scripts/dependencies/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var drone = {};

init = function() {
    projector = new THREE.Projector;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('viewport').appendChild(renderer.domElement);

    render_stats = new Stats();
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '0px';
    render_stats.domElement.style.zIndex = 100;
    document.getElementById('viewport').appendChild(render_stats.domElement);

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    document.getElementById('viewport').appendChild(physics_stats.domElement);

    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3(0, -gravity_strength, 0));

    scene.addEventListener(
        'update',
        function() {
            scene.simulate(undefined, 2);
            physics_stats.update();
        }
    );

    camera = new THREE.TargetCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    camera.position.set(camera_distance, camera_distance, camera_distance);
    camera.lookAt(scene.position);
    scene.add(camera);

    // Light
    light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.set(light_distance, light_distance, light_distance);
    light.target.position.copy(scene.position);
    light.castShadow = true;
    light.shadowCameraLeft = -60;
    light.shadowCameraTop = -60;
    light.shadowCameraRight = 60;
    light.shadowCameraBottom = 60;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 200;
    light.shadowBias = -.0001;
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = .7;
    scene.add(light);

    // Materials
    var floorTexture = new THREE.ImageUtils.loadTexture("images/checkerboard.jpg");
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(floor_size, floor_size);

    ground_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            map: floorTexture,
            side: THREE.DoubleSide
        }),
        .8, // high friction
        .4 // low restitution
    );

    // Ground
    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(floor_size, 1, floor_size),
        ground_material,
        0 // mass
    );
    ground.receiveShadow = true;
    scene.add(ground);

    // drone
    drone_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        }),
        .8, // high friction
        .2 // low restitution
    );

    motor_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        }),
        .8, // high friction
        .5 // medium restitution
    );

    motor_geometry = new THREE.CylinderGeometry(motor_diameter, motor_diameter, drone_height / 2, 8);

    drone.body = new Physijs.BoxMesh(
        new THREE.BoxGeometry(drone_depth, drone_height, drone_width),
        drone_material,
        drone_body_weight
    );

    drone.body.position.y = starting_height;
    drone.body.receiveShadow = drone.body.castShadow = true;
    scene.add(drone.body);

    drone.motor_fl = new Physijs.CylinderMesh(
        motor_geometry,
        motor_material,
        drone_motor_weight
    );

    drone.motor_fl.position.set(-drone_depth / 2, starting_height, drone_width);
    drone.motor_fl.receiveShadow = drone.motor_fl.castShadow = true;
    scene.add(drone.motor_fl);

    drone.motor_fl_constraint = new Physijs.DOFConstraint(
        drone.motor_fl, drone.body, new THREE.Vector3(-drone_depth / 2, starting_height, drone_width)
    );

    scene.addConstraint(drone.motor_fl_constraint);

    drone.motor_fr = new Physijs.CylinderMesh(
        motor_geometry,
        motor_material,
        drone_motor_weight
    );

    drone.motor_fr.position.set(-drone_depth / 2, starting_height, -drone_width);
    drone.motor_fr.receiveShadow = drone.motor_fr.castShadow = true;
    scene.add(drone.motor_fr);

    drone.motor_fr_constraint = new Physijs.DOFConstraint(
        drone.motor_fr, drone.body, new THREE.Vector3(-drone_depth / 2, starting_height, -drone_width)
    );

    scene.addConstraint(drone.motor_fr_constraint);

    drone.motor_bl = new Physijs.CylinderMesh(
        motor_geometry,
        motor_material,
        drone_motor_weight
    );

    drone.motor_bl.position.set(drone_depth / 2, starting_height, drone_width);
    drone.motor_bl.receiveShadow = drone.motor_bl.castShadow = true;
    scene.add(drone.motor_bl);

    drone.motor_bl_constraint = new Physijs.DOFConstraint(
        drone.motor_bl, drone.body, new THREE.Vector3(drone_depth / 2, starting_height, drone_width)
    );

    scene.addConstraint(drone.motor_bl_constraint);

    drone.motor_br = new Physijs.CylinderMesh(
        motor_geometry,
        motor_material,
        drone_motor_weight
    );

    drone.motor_br.position.set(drone_depth / 2, starting_height, -drone_width);
    drone.motor_br.receiveShadow = drone.motor_br.castShadow = true;
    scene.add(drone.motor_br);

    drone.motor_br_constraint = new Physijs.DOFConstraint(
        drone.motor_br, drone.body, new THREE.Vector3(drone_depth / 2, starting_height, -drone_width)
    );

    scene.addConstraint(drone.motor_br_constraint);

    camera.addTarget({
        name: "drone",
        targetObject: drone.body,
        cameraPosition: new THREE.Vector3(camera_distance, camera_distance, camera_distance),
        fixed: true,
        stiffness: 0.1,
        matchRotation: false
    });

    // Now tell this camera to track the target we just created.
    camera.setTarget("drone");

    requestAnimationFrame(render);
    scene.simulate();
};

render = function() {
    requestAnimationFrame(render);
    camera.update();
    renderer.render(scene, camera);
    render_stats.update();
};

window.onload = init;
