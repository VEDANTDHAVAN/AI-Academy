import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls for easy model viewing
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 3);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Load the 3D model
const loader = new GLTFLoader();
let eyeModel;

loader.load('models/your_model.glb', function(gltf) {
    eyeModel = gltf.scene;
    scene.add(eyeModel);
    eyeModel.position.set(0, 0, 0); // Adjust position based on your model
}, undefined, function(error) {
    console.error(error);
});

// WebSocket to receive gaze data
const socket = new WebSocket('ws://localhost:5000');

socket.onmessage = function(event) {
    if (!eyeModel) return;

    // Parse gaze coordinates from the backend
    const [gazeX, gazeY] = event.data.split(',').map(Number);

    // Adjust these factors to control sensitivity to gaze data
    const sensitivityFactor = 0.001;
    const eyeRotationX = (gazeY - window.innerHeight / 2) * sensitivityFactor;
    const eyeRotationY = (gazeX - window.innerWidth / 2) * sensitivityFactor;

    // Rotate the model based on gaze coordinates
    eyeModel.rotation.x = eyeRotationX;
    eyeModel.rotation.y = eyeRotationY;
};

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
