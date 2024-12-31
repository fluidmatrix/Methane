import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Initialize the scene
const scene = new THREE.Scene();  // Create the main scene to hold objects, lights, and cameras

// Group to hold objects together (optional in this case, as there's just Earth and Moon)
const group = new THREE.Group();

// Initialize the Texture Loader to load textures from URLs
const textureLoader = new THREE.TextureLoader();

scene.background = textureLoader.load("https://wallpapercrafter.com/th800/289246-milky-way-starry-sky-night-sky-star-night-sky.jpg")
// Load Earth and Moon textures from external URLs
const earthTexture = textureLoader.load("https://upload.wikimedia.org/wikipedia/commons/c/cf/WorldMap-A_non-Frame.png");
const moonTexture = textureLoader.load("https://upload.wikimedia.org/wikipedia/commons/d/db/Moonmap_from_clementine_data.png");

// Initialize the geometry for the Earth and Moon (both are spheres)
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);  // 1 is radius, 32 is width/height segments

// Initialize the material for Earth, applying the loaded texture
const earthMaterial = new THREE.MeshStandardMaterial({
  wireframe: false,  // No wireframe display
  map: earthTexture  // Apply the Earth texture to the material
});

// Initialize the material for Moon, applying the loaded texture
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture  // Apply the Moon texture to the material
});

// Initialize the Meshes for Earth and Moon
const earth = new THREE.Mesh(sphereGeometry, earthMaterial);  // Create the Earth mesh
earth.scale.setScalar(5);  // Scale the Earth mesh by 5
earth.receiveShadow = true;  // Allow Earth to receive shadows

const moon = new THREE.Mesh(sphereGeometry, moonMaterial);  // Create the Moon mesh
moon.scale.setScalar(0.3);  // Scale the Moon mesh by 0.3
moon.castShadow = true;  // Allow Moon to cast shadows

// Positioning the Meshes
const light = new THREE.AmbientLight();  // Ambient light (optional, for basic lighting)

const sun = new THREE.SpotLight(0xFFFFFF, 100);  // Create a Spotlight for the Sun
sun.position.set(15, 5, 0);  // Position the Sun at x:15, y:5, z:0

// Adding the Moon as a child of Earth (Moon orbits Earth)
earth.add(moon);

// Add Earth and Sun to the scene
scene.add(earth, sun);

// Initialize the camera
const camera = new THREE.PerspectiveCamera(
  60,  // Field of view (60 degrees)
  window.innerWidth / window.innerHeight,  // Aspect ratio based on window size
  0.1,  // Near clipping plane (objects closer than 0.1 units are not rendered)
  200  // Far clipping plane (objects farther than 200 units are not rendered)
);
camera.position.z = 40;  // Set the camera's position along the Z-axis to 40 units away

// Initialize the renderer (which displays the scene)
const canvas = document.querySelector("canvas.threejs");  // Find the canvas in HTML
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,  // Use the provided canvas element
  antialias: true,  // Smooth edges
});
renderer.shadowMap.enabled = true;  // Enable shadow mapping
renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Set soft shadows for better visual quality
renderer.setSize(window.innerWidth, window.innerHeight);  // Set renderer size to match the window
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  // Set pixel ratio for higher quality

// Instantiate the OrbitControls (allows for camera movement)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;  // Enable smooth damping for control movements

// Adjust the camera and renderer size when the window is resized
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;  // Update camera aspect ratio
  camera.updateProjectionMatrix();  // Recalculate the projection matrix
  renderer.setSize(window.innerWidth, window.innerHeight);  // Update the renderer size
});

// Render the scene in a loop (animation loop)
const renderloop = () => {
  controls.update();  // Update the controls to reflect camera movement

  // Rotate the Earth and Moon to simulate daily rotation
  earth.rotation.y += 0.009;  // Rotate Earth slowly around its Y-axis
  moon.rotation.y += 0.05;  // Rotate Moon faster around its Y-axis

  // Update Moon's position relative to Earth to simulate orbital motion
  moon.position.x = Math.sin(earth.rotation.y) * 2;  // Calculate Moon's X position in orbit
  moon.position.z = Math.cos(earth.rotation.y) * 2;  // Calculate Moon's Z position in orbit

  // Render the scene from the camera's point of view
  renderer.render(scene, camera);

  // Call renderloop again on the next frame
  window.requestAnimationFrame(renderloop);
};

// Start the animation loop
renderloop();
