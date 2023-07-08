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
        },
        hexagon: {
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
let player = null;
let hexagonsMap = [];
var BabylonEngine = null;
var sceneToRender = null;

var cubes = [];
const keyStatus = { 87: false, 65: false, 83: false, 68: false };
var movementAmount = 0.1; // Adjust the movement speed as needed

var platform = null;

const createScene = async function () {
    configure_movement_listeners();
    BabylonEngine.displayLoadingUI();
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(BabylonEngine);

    // Parameters: name, position, scene
    const camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(100 - 10, 100), scene);
    camera.heightOffset = 2;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = .1;
    camera.maxCameraSpeed = 1;
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

    let [playerScene, platformScene, hexagonScene] = await Promise.all([
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.player.Url, "player1.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.platform.Url, "platform.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.hexagon.Url, "hexagon.glb", scene)
    ])

    var platform = platformScene["meshes"][0];

    var exagons = platform._children;
    for (var i = 0; i < exagons.length; i++) {
        var mat = new BABYLON.StandardMaterial("Mat", scene);
        mat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
        mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        mat.emissiveColor = new BABYLON.Color3.FromHexString(generateRandomColor()).toLinearSpace();
        mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
        exagons[i].material = mat;

        var boundingInfo = exagons[i].getBoundingInfo();
        var renderingPosition = boundingInfo.boundingBox.centerWorld;
        var hexagonCollisionBoxDimensions = new BABYLON.Vector3(2.0, 0.5, 1.75);
        var hexagonCollisionBox = BABYLON.MeshBuilder.CreateBox("hexagonCollisionBox_" + i, { width: hexagonCollisionBoxDimensions.x, height: hexagonCollisionBoxDimensions.y, depth: hexagonCollisionBoxDimensions.z }, scene);
        hexagonCollisionBox.position = renderingPosition;

        hexagonCollisionBox.isVisible = false;
        hexagonsMap.push([exagons[i], hexagonCollisionBox])
    };
    platform.position.y += 100; // Move forward along the z-axis

    // Create clones of the mesh
    for (var i = 1; i < 5; i++) {
        var clonedPlatform = platform.clone("Cloned_Platform_" + i);
        var exagons = clonedPlatform._children;
        for (var j = 0; j < exagons.length; j++) {
            var mat = new BABYLON.StandardMaterial("Mat", scene);
            mat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
            mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
            mat.emissiveColor = new BABYLON.Color3.FromHexString(generateRandomColor()).toLinearSpace();
            mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
            exagons[j].material = mat;

            var boundingInfo = exagons[j].getBoundingInfo();
            var renderingPosition = boundingInfo.boundingBox.centerWorld;
            var hexagonCollisionBoxDimensions = new BABYLON.Vector3(2.0, 0.5, 1.75);
            var hexagonCollisionBox = BABYLON.MeshBuilder.CreateBox("hexagon" + i + "CollisionBox_" + j, { width: hexagonCollisionBoxDimensions.x, height: hexagonCollisionBoxDimensions.y, depth: hexagonCollisionBoxDimensions.z }, scene);
            hexagonCollisionBox.position = renderingPosition;

            hexagonCollisionBox.isVisible = false;
            hexagonsMap.push([exagons[j], hexagonCollisionBox])
        }
        clonedPlatform.position.y += 10 * i;

    }

    var hexagon = hexagonScene["meshes"][0]._children[0];

    player = playerScene["meshes"][0];


    // Detach the meshes from their parent nodes
    hexagon.parent = null;

    // Set the position of the hexagon and player to the same vector
    var targetPosition = new BABYLON.Vector3(-15, 150, -15);
    hexagon.position.copyFrom(targetPosition);
    player.position.copyFrom(targetPosition);
    player.position.y += 0.14;
    camera.lockedTarget = player;


    var mat1 = new BABYLON.StandardMaterial("Mat1", scene);
    mat1.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
    mat1.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    mat1.emissiveColor = new BABYLON.Color3.FromHexString(generateRandomColor()).toLinearSpace();
    mat1.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    hexagon.material = mat1;


    // Define custom dimensions and positions for the collision boxes
    var playerCollisionBoxDimensions = new BABYLON.Vector3(0.65, 0.3, 0.52);
    var playerCollisionBoxPosition = new BABYLON.Vector3(0.7, 0.2, 1.5);

    // Create custom collision boxes based on the defined dimensions and positions
    var playerCollisionBox = BABYLON.MeshBuilder.CreateBox("playerCollisionBox", { width: playerCollisionBoxDimensions.x, height: playerCollisionBoxDimensions.y, depth: playerCollisionBoxDimensions.z }, scene);
    playerCollisionBox.parent = player;
    playerCollisionBox.position.copyFrom(playerCollisionBoxPosition);

    // Set the visibility of the collision boxes to false
    playerCollisionBox.isVisible = false;

    // Register a collision function for the player and hexagon collision boxes
    scene.registerBeforeRender(function () {

        for (var i = 0; i < hexagonsMap.length; i++) {
            var hexagonBox = hexagonsMap[i][1];

            // Perform intersection check between player mesh and hexagon mesh
            if (player.intersectsMesh(hexagonBox, true)) {
                // Collision between player and hexagon detected
                console.log("Collision between player and hexagon", i);
                // Perform desired actions when collision occurs
                // ...
            }
        }
    });

    BabylonEngine.hideLoadingUI();

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
    window.scene = await createScene();
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
    if (player == null) return;
    if (keyStatus[87]) {
        // 'W' key or up arrow key
        player.position.z += movementAmount; //
    }
    if (keyStatus[65]) {
        // 'A' key or left arrow key
        player.position.x -= movementAmount;
    }

    if (keyStatus[83]) {
        // 'S' key or down arrow key
        player.position.z -= movementAmount; // Move backward along the z-axis
    }

    if (keyStatus[68]) {
        // 'D' key or right arrow key
        player.position.x += movementAmount;
    }

    if (keyStatus[78]) {
        // 'D' key or right arrow key
        player.position.y -= movementAmount;
    }
}