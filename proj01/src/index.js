import {Tracker} from './tracker.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 180;

// Total
const geometry1 = new THREE.PlaneGeometry( 180, 180 );
const material1 = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry1, material1 );
scene.add( plane );

const origin_y = -90;
const origin_x = -90;

function createTriangle(p1,p2,p3, color, origin_x, origin_y){
    let triangle = new THREE.Shape([new THREE.Vector2(origin_x + p1[0],origin_x + p1[1]), new THREE.Vector2(origin_x + p2[0], origin_y + p2[1]), new THREE.Vector2(origin_x + p3[0], origin_y + p3[1])]);

    let geometry = new THREE.ShapeGeometry( triangle );
    let material = new THREE.MeshBasicMaterial( { color: color } );
    return new THREE.Mesh( geometry, material ) ;
}

function createSquare(p1,p2,p3, p4, color, origin_x, origin_y){
    let square = new THREE.Shape([new THREE.Vector2(origin_x + p1[0],origin_x + p1[1]), new THREE.Vector2(origin_x + p2[0], origin_y + p2[1]), new THREE.Vector2(origin_x + p3[0], origin_y + p3[1]), new THREE.Vector2(origin_x + p4[0], origin_y + p4[1])]);

    let geometry = new THREE.ShapeGeometry( square );
    let material = new THREE.MeshBasicMaterial( { color: color } );
    return new THREE.Mesh( geometry, material ) ;
}

// Shapes

let triangle_green = createTriangle([0,0], [90,0], [45,45], 0x00ff00, origin_x, origin_y);

let triangle_red = createTriangle([0,0], [0,180], [90,90], 0xff0000, origin_x, origin_y);

let triangle_blue = createTriangle([0,180], [180,180], [90,90], 0x0000ff, origin_x, origin_y);

let triangle_pink = createTriangle([90,0], [180,0], [180,90], 0xff0084, origin_x, origin_y);

let triangle_light_pink = createTriangle([90,90], [135,135], [135, 45], 0xffc0cb, origin_x, origin_y);

let square = createSquare([45,45], [90,90], [135, 45], [90, 0], 0x00c0cb, origin_x, origin_y);

let diamond = createSquare([135,135], [180,180], [180, 90], [135, 45], 0xffffff, origin_x, origin_y);

scene.add( triangle_green );
scene.add( triangle_red );
scene.add( triangle_blue );
scene.add( triangle_pink );
scene.add( triangle_light_pink );
scene.add( square );
scene.add( diamond );

let tracker = new Tracker(
    [triangle_green, triangle_red, triangle_blue, triangle_pink, triangle_light_pink, square, diamond],
    camera
)

document.addEventListener('mouseup', (event) => {
    event.preventDefault()
    tracker.disable()
}, false)
document.addEventListener('mousedown', (event) => {
    event.preventDefault()
    tracker.enable([event.clientX, event.clientY])
}, false)
document.addEventListener('mousemove', (event) => {
    event.preventDefault()
    tracker.track([event.clientX, event.clientY])
}, false)


function animate() {
    requestAnimationFrame(animate);
    triangle_green.rotation.z += 0.01;
    renderer.render(scene, camera);
}
animate();