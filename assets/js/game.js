const Assets = {
    textures: {
        carpet: {
            Url: "assets/images/carpet.png"
        }
    }
};

//MOVEMENT
var keyStatus = { 87: false, 65: false, 83: false, 68: false };
var movementAmount = 0.1; // Adjust the movement speed as needed

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const BabylonEngine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D BabylonEngine



const createScene = function () {
    configure_movement_listeners();
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(BabylonEngine);
    // Creates and positions a free camera
    const camera = new BABYLON.FreeCamera("camera1",
        new BABYLON.Vector3(0, 5, -10), scene);
    // Targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    // Creates a light, aiming 0,1,0 - to the sky
    const light = new BABYLON.HemisphericLight("light",
        new BABYLON.Vector3(0, 1, 0), scene);
    // Dim the light a small amount - 0 to 1
    light.intensity = 0.7;
    // Built-in 'sphere' shape.
    sphere = BABYLON.MeshBuilder.CreateSphere("sphere",
        { diameter: 2, segments: 32 }, scene);
    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;
    // Built-in 'ground' shape.
    const ground = BABYLON.MeshBuilder.CreateGround("ground",
        { width: 10, height: 10 }, scene);
    // Load the carpet texture
    const carpetMat = new BABYLON.StandardMaterial("carpetMat");
    carpetMat.diffuseTexture = new BABYLON.Texture(Assets.textures.carpet.Url, scene);
    ground.material = carpetMat;

    scene.registerBeforeRender(function () {
        if (!scene.isReady()) {
            BabylonEngine.stopRenderLoop();
        }
    });

    scene.executeWhenReady(function () {
        document.getElementById("spinner").classList.toggle("hidden");
        BabylonEngine.runRenderLoop(function () {
            move_player();
            scene.render();
        })
    });

    return scene;
};
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    BabylonEngine.resize();
});


// Register keyboard input event listeners
function configure_movement_listeners() {
    document.addEventListener("keydown", function (event) {
        var keyCode = event.keyCode || event.which;

        // Set the key status to true when pressed
        keyStatus[keyCode] = true;
    });

    document.addEventListener("keyup", function (event) {
        var keyCode = event.keyCode || event.which;

        // Set the key status to false when released
        keyStatus[keyCode] = false;
    });
}

function move_player() {
    if (keyStatus[87]) {
        // 'W' key or up arrow key
        sphere.position.z += movementAmount; // Move forward along the z-axis
    }
    if (keyStatus[65]) {
        // 'A' key or left arrow key
        sphere.position.x -= movementAmount; // Move left along the x-axis
    }

    if (keyStatus[83]) {
        // 'S' key or down arrow key
        sphere.position.z -= movementAmount; // Move backward along the z-axis
    }

    if (keyStatus[68]) {
        // 'D' key or right arrow key
        sphere.position.x += movementAmount; // Move right along the x-axis
    }
}