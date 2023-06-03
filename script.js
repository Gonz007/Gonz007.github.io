// Configuraciones básicas de Three.js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('cubo3D').appendChild(renderer.domElement);

// Creando el cargador FBX
var loader = new THREE.FBXLoader();

// Cargando el modelo FBX
loader.load('cubo.fbx', function(object) {
    scene.add(object);
});

// Función de renderizado
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
