Physijs.scripts.worker = 'scripts/dependencies/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var debug_arrow_fr, debug_arrow_fl, debug_arrow_bl, debug_arrow_br, debug_arrow_gravity; // Make these global because ghetto

init = function() {
    projector = new THREE.Projector;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
            main();
            scene.simulate(undefined, 1);
            physics_stats.update();
        }
    );

    camera = new THREE.TargetCamera(
        35, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near field
        500 // Far field
    );

    scene.add(camera);

    ground_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0x7fdbff,
            wireframe: true
        }),
        1,
        0
    );

    // Ground
    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(floor_size, 0.25, floor_size), // Get as close to a plane as possible
        ground_material,
        0 // mass
    );
    ground.position.y = -0.25 / 2;
    scene.add(ground);

    // Drone
    drone_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0x0074d9,
            wireframe: true
        }),
        0.75,
        0
    );

    front_motor_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        }),
        0.75,
        0
    );

    back_motor_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0xffdc00,
            wireframe: true
        }),
        0.75,
        0
    );

    motor_geometry = new THREE.CylinderGeometry(motor_diameter, motor_diameter, drone_height / 2, 5);

    drone_body = new Physijs.BoxMesh(
        new THREE.BoxGeometry(drone_depth, drone_height, drone_width),
        drone_material,
        drone_body_weight
    );

    drone_body.position.y = starting_height + drone_height / 2;

    drone_body.setCcdMotionThreshold(drone_height / 2);
    drone_body.setCcdSweptSphereRadius(drone_height / 2);

    motor_fr = new Physijs.CylinderMesh(
        motor_geometry,
        front_motor_material,
        drone_motor_weight
    );

    motor_fr.position.set(-drone_depth, 0, -drone_width);
    drone_body.add(motor_fr);

    if (debug) {
        debug_arrow_fr = new THREE.ArrowHelper(1, new THREE.Vector3(drone_body.position.x - drone_depth, drone_body.position.y, drone_body.position.z - drone_width), 1, 0xbada55);

        scene.add(debug_arrow_fr);
    }

    motor_fl = new Physijs.CylinderMesh(
        motor_geometry,
        front_motor_material,
        drone_motor_weight
    );

    motor_fl.position.set(-drone_depth, 0, drone_width);
    drone_body.add(motor_fl);

    if (debug) {
        debug_arrow_fl = new THREE.ArrowHelper(1, new THREE.Vector3(drone_body.position.x - drone_depth, drone_body.position.y, drone_body.position.z - drone_width), 1, 0xbada55);

        scene.add(debug_arrow_fl);
    }

    motor_bl = new Physijs.CylinderMesh(
        motor_geometry,
        back_motor_material,
        drone_motor_weight
    );

    motor_bl.position.set(drone_depth, 0, drone_width);
    drone_body.add(motor_bl);

    if (debug) {
        debug_arrow_bl = new THREE.ArrowHelper(1, new THREE.Vector3(drone_body.position.x - drone_depth, drone_body.position.y, drone_body.position.z - drone_width), 1, 0xbada55);

        scene.add(debug_arrow_bl);
    }

    motor_br = new Physijs.CylinderMesh(
        motor_geometry,
        back_motor_material,
        drone_motor_weight
    );

    motor_br.position.set(drone_depth, 0, -drone_width);
    drone_body.add(motor_br);

    if (debug) {
        debug_arrow_br = new THREE.ArrowHelper(1, new THREE.Vector3(drone_body.position.x - drone_depth, drone_body.position.y, drone_body.position.z - drone_width), 1, 0xbada55);

        scene.add(debug_arrow_br);
    }

    scene.add(drone_body);

    if (debug) {
        debug_arrow_gravity = new THREE.ArrowHelper(1, new THREE.Vector3(drone_body.position.x, drone_body.position.y, drone_body.position.z), 1, 0xff0000);

        scene.add(debug_arrow_gravity);
    }

    camera.addTarget({
        name: "drone",
        targetObject: drone_body,
        cameraPosition: new THREE.Vector3(-camera_distance, camera_distance, -camera_distance),
        fixed: true,
        stiffness: 0.1,
        matchRotation: false
    });

    camera.setTarget("drone"); // Now tell this camera to track the target we just created.
    // camera.update(); // Use this one for a stationary camera

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
