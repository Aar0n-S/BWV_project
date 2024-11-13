//imports the required libraries
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
//links the css file
import "./styles.css";

//creates the global variables
let scene, renderer, camera;
let ambientLight;
let distance;
//let cylinder, box;
let treeModel;
//let geometry1, material1, geometry2, material2;
let loader;

//creates a perspective camera
camera = new THREE.PerspectiveCamera(
  //fov(field of view)
  75,
  //aspect ratio
  window.innerWidth / window.innerHeight,
  //view frustum(which objects are visable to the camera)
  0.1,
  1000
);

//calls the init function
init();

//the init function to setup the scene
function init() {
  //creates the scene
  scene = new THREE.Scene();
  //sets the scenes background colour
  scene.background = new THREE.Color(0xdedede);

  //creates the renderer
  //the domElement used is the canvas with and id of bg
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
  });

  //set it so the pixel ratio is correct for the device
  renderer.setPixelRatio(window.devicePixelRatio);
  //make it full screen
  renderer.setSize(window.innerWidth, window.innerHeight);
  //move the camera so its not in the middle of the scene
  camera.position.setZ(10);

  //creates an ambientLight which lights up the whole scene
  ambientLight = new THREE.AmbientLight(0xffffff);
  //adds the light to the scene
  scene.add(ambientLight);

  //calls multiple functions
  //loadShapes();
  loadModels();
  play();
}

// creates a simple render function
function render() {
  //passes in the scene and camera as arguments
  renderer.render(scene, camera);
}

//creates the play function
function play() {
  //using the new setAnimationLoop method which means we are WebXR ready if need be
  renderer.setAnimationLoop(() => {
    //calls the render function
    render();
  });
}

//creates the moveCamera functon so the camera moves while the user scrolls
function moveCamera() {
  //gives the viewport dimensions
  //top is used to find out how far the user is from the top of the page
  distance = document.body.getBoundingClientRect().top;

  //moves the camera as the user scrolls
  camera.position.y = distance * 0.02;
}

//calls the move camera function each time the user scrolls
document.body.onscroll = moveCamera;

//function for the default shapes in three.js
/*function loadShapes() {
  //a set of vectors that make up the shape
  geometry1 = new THREE.CylinderGeometry(1, 1, 100, 32);
  //gives it a material and a colour
  material1 = new THREE.MeshStandardMaterial({ color: 0x4d2600 });
  //creates the mesh by combining the geometry and the material
  cylinder = new THREE.Mesh(geometry1, material1);
  //defines its position
  cylinder.position.z = 5;
  cylinder.position.x = 0;
  cylinder.position.y = -60;
  //adds it to the scene
  scene.add(cylinder);

  geometry2 = new THREE.BoxGeometry(10, 10, 32);
  material2 = new THREE.MeshStandardMaterial({ color: 0x4d2600 });
  box = new THREE.Mesh(geometry2, material2);
  box.position.z = 5;
  box.position.x = 0;
  box.position.y = 0;
  box.add(box);
}*/

//function to load in the 3D models
function loadModels() {
  //calls part of the library
  loader = new GLTFLoader();
  const onLoadStatic = function (gltf, position) {
    treeModel = gltf.scene.children[0];
    //scales the model
    treeModel.scale.multiplyScalar(20);
    treeModel.position.copy(position);
    //adds the model to the scene
    scene.add(treeModel);
  };

  //used to see if the models are being loaded
  const onProgress = function () {
    console.log("progress");
  };
  //used to show if there is an issue when loading the models
  const onError = function (errorMessage) {
    console.log(errorMessage);
  };

  //a variable that uses a vector for the position of the model
  const treeModelPos = new THREE.Vector3(0, -10, -10);
  //loads the model from its location
  loader.load(
    "models/Tree.glb",
    function (gltf) {
      //passes through the information from onLoadAnimation and the models position
      onLoadStatic(gltf, treeModelPos);
    },
    //calls the variables to show if the model has loaded
    onProgress,
    onError
  );
}
