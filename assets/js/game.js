//ALL STATIC URLS FOR ASSETS
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
    },
    musics: {
        soundtrack: {
            Url: "assets/static/sounds/soundtrack.mp3"
        },
        endgame: {
            Url: "assets/static/sounds/endgame.mp3"
        },
        startgame: {
            Url: "assets/static/sounds/startgame.mp3"
        }
    }
};

//FUNCTION FOR DYPLAY LOADING SCREEN
BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    return;
};

//FUNCTION FOR HIDE LOADING SCREEN
BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    document.getElementById("spinner").style.display = "none";
    console.log("Scene is now loaded");
}


var startRenderLoop = function (engine) {
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
        stencil: true
    });
};

//GENERAL CONFIGURATION
const canvas = document.getElementById("renderCanvas");
var BabylonEngine = null;
var sceneToRender = null;

//PHYSICS SETTINGS
const physicsPlugin = new BABYLON.CannonJSPlugin(); // Use the Cannon.js physics engine

//MESHES
let player = null;
let hexagon = null;
var platform = null;
var loaded = false;

//STORE TUPLES OF HEXAGONS WITH HIS COLLIDE BOX
let hexagonsMap = [];

//STORING KEY PRESSED
const keyStatus = { 87: false, 65: false, 83: false, 68: false };

//SPEED OF MOVEMENT
var movementAmount = 0.1; // Adjust the movement speed as needed



//PLAYER STATIC DIMENSION OF COLLIDE BOX
var playerCollisionBoxDimensions = new BABYLON.Vector3(0.6, 0.3, 0.4);
var playerCollisionBoxPosition = new BABYLON.Vector3(0.63, 0.2, 1.6);

//START POSITION OF PLAYER
var targetPosition = new BABYLON.Vector3(-15, 150, -15);

//STATIC DIMENSION OF HEXAGON COLLIDE BOX
var hexagonCollisionBoxDimensions = new BABYLON.Vector3(2.0, 0.5, 1.75);

//LISTENER FOR MIVEMENTS
configure_movement_listeners();

const createScene = async function () {
    BabylonEngine.displayLoadingUI();

    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(BabylonEngine);

    //ENABLE PHYSICS
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), physicsPlugin); // Enable physics with gravity 

    //MUSIC IN BACKGROUND
    var soundtrack = new BABYLON.Sound("soundtrack", Assets.musics.soundtrack.Url, scene, null, {
        loop: true,
        autoplay: true
    });

    //CAMERA CONFIGURATION
    const camera = configure_camera(scene);

    //LIGHT CONFIGRATION
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    //  SKYBOX
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
    var skyboxMaterial = configure_skybox_material(scene, skybox);

    // Water
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 2048, 2048, 16, scene, false);
    var water = configure_water_material(scene, skybox, waterMesh);

    //IMPORTING OF THE MESHES
    let [playerScene, platformScene, hexagonScene] = await Promise.all([
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.player.Url, "player.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.platform.Url, "platform.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.hexagon.Url, "hexagon.glb", scene)
    ])


    platform = platformScene["meshes"][0];
    var exagons = platform._children;

    //CREATING HEXAGONS AND COLLIDING BOXING FOR EACH
    for (var i = 0; i < exagons.length; i++) {
        exagons[i].material = generate_material_with_random_color(scene, "Hexagon_" + i + "_platform_0");
        create_collision_box(exagons[i], scene, "HexagonCollisionBox_" + i + "_platform_0");
    };

    platform.position.y += 100; // Move forward along the z-axis

    //CREATE CLONE OF PLATFORM
    for (var i = 1; i < 5; i++) {

        var clonedPlatform = platform.clone("Cloned_Platform_" + i);
        var clonedExagons = clonedPlatform._children;

        //CREATING HEXAGONS AND COLLIDING BOXING FOR EACH
        for (var j = 0; j < clonedExagons.length; j++) {
            clonedExagons[j].material = generate_material_with_random_color(scene, "Hexagon_" + j + "_platform_" + i);
            create_collision_box(clonedExagons[j], scene, "HexagonCollisionBox_" + j + "_platform_" + i);
        }

        clonedPlatform.position.y += 10 * i;
    }

    // Detach the meshes from their parent nodes
    hexagon = hexagonScene["meshes"][0]._children[0];
    hexagon.material = generate_material_with_random_color(scene, "Hexagon");
    hexagon.parent = null;

    // Set the position of the hexagon and player to the same vector
    hexagon.position.copyFrom(targetPosition);

    player = playerScene["meshes"][0];
    player.position.copyFrom(targetPosition);
    player.position.y += 0.14;
    camera.lockedTarget = player;

    // Create custom collision boxes based on the defined dimensions and positions
    var playerCollisionBox = BABYLON.MeshBuilder.CreateBox("playerCollisionBox", { width: playerCollisionBoxDimensions.x, height: playerCollisionBoxDimensions.y, depth: playerCollisionBoxDimensions.z }, scene);
    playerCollisionBox.parent = player;
    playerCollisionBox.position.copyFrom(playerCollisionBoxPosition);

    // Set the visibility of the collision boxes to false
    playerCollisionBox.isVisible = false;

    // Register a collision function for the player and hexagon collision boxes
    scene.registerBeforeRender(function () {
        if (panel.isVisible) return;
        var playerVelocity = player.physicsImpostor.getLinearVelocity(); // Get the player's velocity
        var isFalling = false; // Check if the player is falling

        for (var i = 0; i < hexagonsMap.length; i++) {

            var hexagonBox = hexagonsMap[i][1];

            // Perform intersection check between player mesh and hexagon mesh
            if (playerCollisionBox.intersectsMesh(hexagonBox, false)) {
                // Collision between player and hexagon detected
                // Player is falling, stop the movement
                // Disable gravity temporarily to prevent falling again
                player.physicsImpostor.mass = 0; // 
                player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));

                break; // Exit the loop, no need to check other hexagons
            }
        }
    }
    );



    BabylonEngine.hideLoadingUI();

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var panel = new BABYLON.GUI.StackPanel();
    advancedTexture.addControl(panel);

    var textblock = create_start_text();
    panel.addControl(textblock);

    var countdown = 5; // Initial countdown value
    var countdownMusic = new BABYLON.Sound("countdownMusic", Assets.musics.startgame.Url, scene, null, {
        loop: false,
        autoplay: true
    });

    var countdownInterval = setInterval(function () {
        countdown--;
        if (countdown > 0) {
            textblock.text = countdown.toString();
        } else {
            clearInterval(countdownInterval);
            textblock.text = "START!";
            loaded = true;
            setTimeout(function () {
                panel.isVisible = false; // Hide the panel
                player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, scene);
            }, 2000); // Wait for 2 seconds before starting the game
        }
    }, 1000); // Update the countdown every second

    return scene;
};


//GENERATE A MATERIAL FOR HEXAGON WITH RANDOM COLOR
function generate_material_with_random_color(scene, name) {
    var mat = new BABYLON.StandardMaterial(name, scene);
    mat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
    mat.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
    mat.emissiveColor = new BABYLON.Color3.FromHexString(generateRandomColor()).toLinearSpace();
    mat.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    return mat;
}

//SKYBOX CONFIGURATION
function configure_skybox_material(scene, skybox) {
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(Assets.textures.sky.Url, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    return skyboxMaterial;
}

function create_start_text() {
    textblock = new BABYLON.GUI.TextBlock("Countdown", "5");
    textblock.width = 1.0;
    textblock.height = "300px";
    textblock.color = "white";
    textblock.fontFamily = "Comic Sans MS"; // Use the desired font family
    textblock.outlineColor = "#9a84be"; // Set the outline color
    textblock.outlineWidth = 30; // Set the outline width
    textblock.fontSize = 80;
    textblock.fontSize = 300;
    return textblock;
}

//WATER CONFIGURATION
function configure_water_material(scene, skybox, waterMesh) {
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
    return water;
}

//HEXAGON COLLISION BOX
function create_collision_box(hexagon, scene, name) {
    var boundingInfo = hexagon.getBoundingInfo();
    var renderingPosition = boundingInfo.boundingBox.centerWorld;
    var hexagonCollisionBox = BABYLON.MeshBuilder.CreateBox(name, { width: hexagonCollisionBoxDimensions.x, height: hexagonCollisionBoxDimensions.y, depth: hexagonCollisionBoxDimensions.z }, scene);
    hexagonCollisionBox.position = renderingPosition;

    hexagonCollisionBox.isVisible = false;

    hexagonsMap.push([hexagon, hexagonCollisionBox])

    hexagon.physicsImpostor = new BABYLON.PhysicsImpostor(hexagon, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
}

//GENERTE RNDOM HEXADECIMAL COLOR
function generateRandomColor() {
    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`
}

//CONFIGURATION OF THE CAMERA
function configure_camera(scene) {
    // Parameters: name, position, scene
    let camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(100 - 10, 100), scene);
    camera.heightOffset = 2;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = .1;
    camera.maxCameraSpeed = 1;
    camera.attachControl(canvas, true);
    return camera;
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
    startRenderLoop(BabylonEngine);
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
        // 'N' key or right arrow key
        player.position.y -= movementAmount;
    }
    if (keyStatus[85]) {
        // 'U' key or right arrow key
        player.position.y += movementAmount;
    }
}