import { Tracker } from "./tracker.js";
import { Projector } from "./projector.js";
import { createMesh } from "./mesh.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 180;

const geometry1 = new THREE.PlaneGeometry(180, 180);
const material1 = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry1, material1);
scene.add(plane);

const originY = -90;
const originX = -90;

let shapes = [
    createMesh(
        [
            [0, 0],
            [90, 0],
            [45, 45],
        ],
        0x00ff00,
        originX,
        originY
    ),
    createMesh(
        [
            [0, 0],
            [0, 180],
            [90, 90],
        ],
        0xff0000,
        originX,
        originY
    ),
    createMesh(
        [
            [0, 180],
            [180, 180],
            [90, 90],
        ],
        0x0000ff,
        originX,
        originY
    ),
    createMesh(
        [
            [90, 0],
            [180, 0],
            [180, 90],
        ],
        0xff0084,
        originX,
        originY
    ),
    createMesh(
        [
            [90, 90],
            [135, 135],
            [135, 45],
        ],
        0xffc0cb,
        originX,
        originY
    ),
    createMesh(
        [
            [45, 45],
            [90, 90],
            [135, 45],
            [90, 0],
        ],
        0x00c0cb,
        originX,
        originY
    ),
    createMesh(
        [
            [135, 135],
            [180, 180],
            [180, 90],
            [135, 45],
        ],
        0xffffff,
        originX,
        originY
    ),
];

for (let shape of shapes) {
    scene.add(shape);
}

for (let currentMesh of shapes) {
    let center = new THREE.Vector3();
    currentMesh.geometry.computeBoundingBox();
    currentMesh.geometry.boundingBox.getCenter(center);
    currentMesh.geometry.center();
    currentMesh.position.copy(center);
}

let tracker = new Tracker(shapes, new Projector(camera, renderer));

document.addEventListener(
    "mouseup",
    (event) => {
        console.log("desable");
        tracker.disable();
    },
    false
);

document.addEventListener(
    "mousedown",
    (event) => {
        console.log("enable");
        tracker.enable([event.clientX, event.clientY], false);
    },
    false
);

document.addEventListener(
    "mousemove",
    (event) => {
        tracker.track([event.clientX, event.clientY]);
    },
    false
);

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key == "r") {
            tracker.enableRotation();
        }
    },
    false
);

document.addEventListener(
    "keyup",
    (event) => {
        if (event.key == "r") {
            tracker.disableRotation();
        }
    },
    false
);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
