var scale = 500,
    drone_depth = 0.025 * scale,
    drone_height = 0.015 * scale,
    drone_width = 0.02 * scale,
    motor_diameter = 0.0075 * scale,
    starting_height = 10,
    drone_body_weight = 0.2,
    drone_motor_weight = 0.1,
    gravity_strength = 9.8,
    motor_strength = gravity_strength / 4;

Physijs.scripts.worker = 'js/physijs_worker.js';
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

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    camera.position.set(60, 50, 60);
    camera.lookAt(scene.position);
    scene.add(camera);

    // Light
    light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.set(20, 40, -15);
    light.target.position.copy(scene.position);
    light.castShadow = true;
    light.shadowCameraLeft = -60;
    light.shadowCameraTop = -60;
    light.shadowCameraRight = 60;
    light.shadowCameraBottom = 60;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 200;
    light.shadowBias = -.0001
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = .7;
    scene.add(light);

    // Materials
    ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            color: 0xffffff
        }),
        .8, // high friction
        .4 // low restitution
    );

    // Ground
    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(100, 1, 100),
        ground_material,
        0 // mass
    );
    ground.receiveShadow = true;
    scene.add(ground);

    // drone
    drone_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            color: 0xbada55
        }),
        .8, // high friction
        .2 // low restitution
    );

    motor_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            color: 0xbada55
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
    drone.motor_fl_constraint.setAngularLowerLimit({
        x: 0,
        y: -Math.PI / 8,
        z: 1
    });

    drone.motor_fl_constraint.setAngularUpperLimit({
        x: 0,
        y: Math.PI / 8,
        z: 0
    });

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

    drone.motor_fr_constraint.setAngularLowerLimit({
        x: 0,
        y: -Math.PI / 8,
        z: 1
    });

    drone.motor_fr_constraint.setAngularUpperLimit({
        x: 0,
        y: Math.PI / 8,
        z: 0
    });

    drone.motor_bl = new Physijs.CylinderMesh(
        motor_geometry,
        motor_material,
        drone_motor_weight
    );

    // drone.motor_bl.rotation.x = 0;
    drone.motor_bl.position.set(drone_depth / 2, starting_height, drone_width);
    drone.motor_bl.receiveShadow = drone.motor_bl.castShadow = true;
    scene.add(drone.motor_bl);

    drone.motor_bl_constraint = new Physijs.DOFConstraint(
        drone.motor_bl, drone.body, new THREE.Vector3(drone_depth / 2, starting_height, drone_width)
    );

    scene.addConstraint(drone.motor_bl_constraint);

    drone.motor_bl_constraint.setAngularLowerLimit({
        x: 0,
        y: 0,
        z: 0
    });

    drone.motor_bl_constraint.setAngularUpperLimit({
        x: 0,
        y: 0,
        z: 0
    });

    drone.motor_br = new Physijs.CylinderMesh(
        motor_geometry,
        motor_material,
        drone_motor_weight
    );

    // drone.motor_br.rotation.x = 0;
    drone.motor_br.position.set(drone_depth / 2, starting_height, -drone_width);
    drone.motor_br.receiveShadow = drone.motor_br.castShadow = true;
    scene.add(drone.motor_br);

    drone.motor_br_constraint = new Physijs.DOFConstraint(
        drone.motor_br, drone.body, new THREE.Vector3(drone_depth / 2, starting_height, -drone_width)
    );

    scene.addConstraint(drone.motor_br_constraint);

    drone.motor_br_constraint.setAngularLowerLimit({
        x: 0,
        y: 0,
        z: 0
    });

    drone.motor_br_constraint.setAngularUpperLimit({
        x: 0,
        y: 0,
        z: 0
    });

    requestAnimationFrame(render);
    scene.simulate();

    document.addEventListener(
        'keydown',
        function(event) {
            switch (event.keyCode) {
                case 38:
                    drone.motor_fl.applyCentralImpulse(new THREE.Vector3(0, motor_strength, 0));
                    drone.motor_fr.applyCentralImpulse(new THREE.Vector3(0, motor_strength, 0));
                    drone.motor_bl.applyCentralImpulse(new THREE.Vector3(0, motor_strength, 0));
                    drone.motor_br.applyCentralImpulse(new THREE.Vector3(0, motor_strength, 0));
            }
        }
    );
};

render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    render_stats.update();
};

window.onload = init;
