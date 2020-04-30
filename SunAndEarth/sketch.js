// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 0.5, 0.01, 100);
  camera.position.set(0, 4, -15);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 16);

  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load("earth.jpg");
  const moonTexture = textureLoader.load("moon.jpg");
  const sunTexture = textureLoader.load("sun.jpg");

  // Setup earth material
  const earthMaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
  });

  //setup moon material
  const moonMaterial = new THREE.MeshBasicMaterial({
    map: moonTexture,
  });

  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
  });
  const sunMesh = new THREE.Mesh(geometry, sunMaterial);
  sunMesh.scale.setScalar(4);
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.scale.setScalar(0.5);
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);

  const solarSystemGroup = new THREE.Group();
  solarSystemGroup.add(sunMesh);
  const planetsGroup = new THREE.Group();
  const planetBodiesGroup = new THREE.Group();
  planetBodiesGroup.position.set(0, 0, -8);
  planetBodiesGroup.add(earthMesh);
  planetBodiesGroup.add(moonMesh);
  moonMesh.position.set(0, 0, -2);
  planetsGroup.add(planetBodiesGroup);
  solarSystemGroup.add(planetsGroup);
  scene.add(solarSystemGroup);
  scene.add(new THREE.GridHelper(5, 50));
  scene.add(new THREE.AxesHelper(5));

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      planetsGroup.rotation.y = time * 0.125;
      planetBodiesGroup.rotation.y = time * 0.5;
      moonMesh.rotation.y = time * 0.1;
      earthMesh.rotation.y = time * 0.05;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
