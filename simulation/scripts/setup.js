Physijs.scripts.worker = 'scripts/dependencies/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var drone = {};

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

    scene.add(camera);

    ground_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            wireframe: true
        }),
        .8, // high friction
        .4 // low restitution
    );

    // Ground
    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(floor_size, 0.005, floor_size), // Get as close to a plane as possible
        ground_material,
        0 // mass
    );
    scene.add(ground);

    // Drone
    drone_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0x0074d9,
            wireframe: true
        }),
        .8, // high friction
        .2 // low restitution
    );

    front_motor_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        }),
        .8, // high friction
        .5 // medium restitution
    );

    back_motor_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({
            color: 0xffdc00,
            wireframe: true
        }),
        .8, // high friction
        .5 // medium restitution
    );

    motor_geometry = new THREE.CylinderGeometry(motor_diameter, motor_diameter, drone_height / 2, 5);

    drone_body = new Physijs.BoxMesh(
        new THREE.BoxGeometry(drone_depth, drone_height, drone_width),
        drone_material,
        drone_body_weight
    );

    drone_body.position.y = starting_height;

    motor_fr = new Physijs.CylinderMesh(
        motor_geometry,
        front_motor_material,
        drone_motor_weight
    );

    motor_fr.position.set(-drone_depth, 0, -drone_width);
    drone_body.add(motor_fr);

    motor_fl = new Physijs.CylinderMesh(
        motor_geometry,
        front_motor_material,
        drone_motor_weight
    );

    motor_fl.position.set(-drone_depth, 0, drone_width);
    drone_body.add(motor_fl);

    motor_bl = new Physijs.CylinderMesh(
        motor_geometry,
        back_motor_material,
        drone_motor_weight
    );

    motor_bl.position.set(drone_depth, 0, drone_width);
    drone_body.add(motor_bl);

    motor_br = new Physijs.CylinderMesh(
        motor_geometry,
        back_motor_material,
        drone_motor_weight
    );

    motor_br.position.set(drone_depth, 0, -drone_width);
    drone_body.add(motor_br);

    scene.add(drone_body);

    console.log(drone_body);
    console.log(drone_body.children[0]);

    camera.addTarget({
        name: "drone",
        targetObject: drone_body,
        cameraPosition: new THREE.Vector3(camera_distance, camera_distance, camera_distance),
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
    renderer.render(scene, camera);
    render_stats.update();
};

window.onload = init;
