import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Initialize the scene
const scene = new THREE.Scene();
//Instantiating a group to hold our meshes
const group = new THREE.Group();

// Initialize the texture loader and textures
const textureLoader = new THREE.TextureLoader();
const hMap = textureLoader.load('/textures/Hydrogen.png');

// Geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const planeGeometry = new THREE.PlaneGeometry(300, 300);
const cylinder = new THREE.CylinderGeometry(0.7, 0.7, 7, 32, 8);

// Materials
const hydrogenMaterial = new THREE.MeshStandardMaterial(
    { 
        wireframe: false,
        map: hMap 
    });
const planeMaterial = new THREE.MeshStandardMaterial(
    { 
        color: 'Green', 
        side: THREE.DoubleSide
    });
const bondMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    emissive: 0xD3D3D3,
    emissiveIntensity: 0.5,
    metalness: 0.2,
    roughness: 0.7
});
const carbonMaterial = new THREE.MeshStandardMaterial(
    { 
        color: 'Red', 
        wireframe: false 
    });

// Helper function to create spheres (atoms)
const createAtom = (material, scale, position, rotation) => {
    const atom = new THREE.Mesh(sphereGeometry, material);
    atom.scale.setScalar(scale);
    atom.position.set(...position);
    atom.rotation.set(...rotation);
    atom.castShadow = true;
    return atom;
};

// Helper function to create bonds (cylinders)
const createBond = (position, rotation) => {
    const bond = new THREE.Mesh(cylinder, bondMaterial);
    bond.position.set(...position);
    bond.rotation.set(...rotation);
    bond.castShadow = true;
    return bond;
};

// Create the central carbon atom and hydrogen atoms
const atom = createAtom(carbonMaterial, 5, [0, 0, 0], [0, 0, 0]);

// Create bonds (using createBond function)
const bonds = [
    createBond([0, 8, 0], [0, 0, 0]),
    createBond([6.5, -4.5, 1.75], [0, 0, Math.PI /3]),
    createBond([-6.5, -4.5, 1.5], [0, 0, -Math.PI /3]),
    createBond([0, -5, -6], [Math.PI / 3, 0, 0])
];

// Create hydrogen atoms
const hydrogenPositions = [
    [0, 13, 0], [11, -7, 1.5], [-11, -7, 1.5], [0, -8, -10]
];
const hydrogenAtoms = hydrogenPositions.map(pos => createAtom(hydrogenMaterial, 3, pos, [-Math.PI / 2, 0, 0]));

// Create the plane
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -15;
plane.receiveShadow = true;

// Create lights
const ambLight = new THREE.AmbientLight(0xFFFFFF, 1);
const pointLight = new THREE.PointLight(0xffffAA, 10000);
pointLight.position.y = 40;
pointLight.castShadow = true;

// Add everything to the group and scene
group.add(atom, ...bonds, ...hydrogenAtoms);
scene.add(group, plane, pointLight, ambLight);

// Initialize the camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 80;
camera.position.y = 20;


// Initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Instantiate the controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Handle window resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
const renderloop = () => {
    // group.rotation.y += 0.05
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(renderloop);
};

renderloop();
