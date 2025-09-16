// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// // const renderer = new THREE.WebGLRenderer({ canvas: canvas });
// const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#draw') });
// renderer.setSize( window.innerWidth, window.innerHeight );
// function animate() {
//     window.requestAnimationFrame( animate );    
//   renderer.render( scene, camera );
//   cube.rotation.x += 0.01;ox
//     cube.rotation.y += 0.01;
// }
// animate();



let scene = new THREE.Scene();  // duniya 
let camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

let box = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
let mesh = new THREE.Mesh(box, material);
scene.add(mesh);

// mesh.position.x = 2;
// mesh.rotation.x = Math.PI / 2;   // 90 degree
// mesh.scale.x = 2;
// 

const canvas = document.querySelector('#draw');
let renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

let clock = new THREE.Clock();

function animate() {
    window.requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
    // mesh.rotation.z += 0.01;
    // mesh.position.x = clock.getElapsedTime()*10;
    // mesh.rotation.y = clock.getElapsedTime()*80;
    mesh.rotation.x = clock.getElapsedTime()*80;
    // mesh.rotation.z = clock.getElapsedTime()*80;
}
animate();
