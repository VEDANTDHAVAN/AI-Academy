import './style.css'
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(50/*Field of View*/, window.innerWidth/window.innerHeight/*Aspect Ratio for Camera*/ , 0.1, 150);
camera.position.z = 2;
//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
    alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));//determine your device pixel ratio to get best quality display 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0030;
composer.addPass(rgbShiftPass);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
let model;
new RGBELoader()
.load('./blue_photo_studio_1k.hdr', function(texture){
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.background = envMap;//for 360 degree world
    scene.environment = envMap;//Wont lit up the objects
    texture.dispose();
    pmremGenerator.dispose();

    const loader = new GLTFLoader();
    loader.load('./scene.gltf', (gltf) => {
        model = gltf.scene;
        scene.add(model);
    }, undefined, (error) => {
        console.error('An Error occured while Loading the GLTF model', error);
    });
});
//orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
window.addEventListener("mousemove", (e)=> {
   if(model){
    const rotationX = (e.clientX/window.innerWidth - 0.5) * (Math.PI * 0.3);
    const rotationY = (e.clientY/window.innerHeight - 0.5) * (Math.PI * 0.3);
    model.rotation.x = rotationY;
    model.rotation.y = rotationX;
   }
   });
window.addEventListener("resize", ()=> {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

   //render
function animate(){
    window.requestAnimationFrame(animate);
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    composer.render();
}
animate();
