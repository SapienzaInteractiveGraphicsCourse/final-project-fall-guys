const Assets = {
    textures: {
        carpet: {
            Url: "assets/images/carpet.jpg"
        },
        sky: {
            Url: "assets/images/skybox/skybox.env"
        },
        water: {
            Url: "assets/images/waterbump.png"
        },
    },
    models: {
        player: {
            Url: "assets/static/models/player/"
        },
        platform: {
            Url: "assets/static/models/platform/"
        }
    }
};

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    return;
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    document.getElementById("spinner").style.display = "none";
    console.log("Scene is now loaded");
}

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            move_player();
            sceneToRender.render();
        }
    });
}

var createDefaultEngine = function () {
    return new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false
    });
};

//CONFIGURATION
const canvas = document.getElementById("renderCanvas");
var BabylonEngine = null;
var sceneToRender = null;

var cubes = [];
const keyStatus = { 87: false, 65: false, 83: false, 68: false };
var movementAmount = 0.1; // Adjust the movement speed as needed

var platform = null;

const createScene = function () {
    configure_movement_listeners();
    BabylonEngine.displayLoadingUI();
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(BabylonEngine);

    // Parameters: name, position, scene
    const camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

    // The goal distance of camera from target
    camera.radius = 30;

    // The goal height of camera above local origin (centre) of target
    camera.heightOffset = 10;

    // The goal rotation of camera around local origin (centre) of target in x y plane
    camera.rotationOffset = 0;

    // Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.01;

    // The speed at which acceleration is halted
    camera.maxCameraSpeed = 10;

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);


    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    //  SKYBOX
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(Assets.textures.sky.Url, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    // Water
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 2048, 2048, 16, scene, false);
    var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(512, 512));
    water.backFaceCulling = true;
    water.bumpTexture = new BABYLON.Texture(Assets.textures.water.Url, scene);
    water.windForce = -10;
    water.waveHeight = 1.7;
    water.bumpHeight = 0.1;
    water.windDirection = new BABYLON.Vector2(1, 1);
    water.waterColor = new BABYLON.Color3(0, 0, 221 / 255);
    water.colorBlendFactor = 0.0;
    water.addToRenderList(skybox);
    waterMesh.material = water;

    var playerScene = BABYLON.SceneLoader.ImportMesh("", Assets.models.player.Url, "player.glb", scene, (meshes) => {
        var player = scene.getMeshByName("__root__");
        player.position.y += 150.25;
        player.position.z = -27.6;
        player.position.x = -17;

        camera.lockedTarget = player;
    }
    );

    var platformScene = BABYLON.SceneLoader.ImportMesh("", Assets.models.platform.Url, "platform.glb", scene, (meshes) => {
        var platform = meshes[0];
        var exagons = platform.getChildMeshes();
        for (var i = 0; i < exagons.length; i++) {
            var mat = new BABYLON.StandardMaterial("Mat", scene);
            mat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
            mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
            mat.emissiveColor = new BABYLON.Color3.FromHexString(generateRandomColor()).toLinearSpace();
            mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
            exagons[i].material = mat;
        };
        platform.position.y += 100; // Move forward along the z-axis

        // Create clones of the mesh
        for (var i = 1; i < 5; i++) {

            var clonedPlatform = platform.clone("Cloned_Platform_" + i);
            clonedPlatform.position.y += 10 * i;

        }

    }
    );

    var hexagonScene = BABYLON.SceneLoader.ImportMesh("", Assets.models.platform.Url, "hexagon.glb", scene, (meshes) => {
        meshes[0].position.y += 150;
        meshes[0].position.x -= 15;
        meshes[0].position.z -= 20;
        BabylonEngine.hideLoadingUI();
    }
    );

    return scene;
};

function generateRandomColor() {
    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`
}


window.initFunction = async function () {

    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.BabylonEngine = await asyncEngineCreation();
    if (!BabylonEngine) throw 'engine should not be null.';
    startRenderLoop(BabylonEngine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

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
        scene.getMeshByName("__root__").position.z += movementAmount; //
    }
    if (keyStatus[65]) {
        // 'A' key or left arrow key
        scene.getMeshByName("__root__").position.x -= movementAmount; // Move left along the x-axis
    }

    if (keyStatus[83]) {
        // 'S' key or down arrow key
        scene.getMeshByName("__root__").position.z -= movementAmount; // Move backward along the z-axis
    }

    if (keyStatus[68]) {
        // 'D' key or right arrow key
        scene.getMeshByName("__root__").position.x += movementAmount; // Move right along the x-axis
    }
}