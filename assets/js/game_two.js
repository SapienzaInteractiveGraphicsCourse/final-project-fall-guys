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
        platform1: {
            Url: "assets/static/models/platform/"
        },
        platform2: {
            Url: "assets/static/models/platform/"
        },
        hexagon: {
            Url: "assets/static/models/platform/"
        },
        hexagon1: {
            Url: "assets/static/models/platform/"
        },
        hexagon2: {
            Url: "assets/static/models/platform/"
        },
        sphere: {
            Url: "assets/static/models/sphere/"
        },
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
        },
        sphere1: {
            Url: "assets/static/sounds/sphere1.mp3"
        },
        sphere2: {
            Url: "assets/static/sounds/sphere2.mp3"
        }
    }
};

const playerOneUsername = localStorage.getItem("playerOne") || "Player One";
const playerTwoUsername = localStorage.getItem("playerTwo") || "Player Two";

document.getElementById("playerOneUsername").textContent = playerOneUsername;
document.getElementById("playerTwoUsername").textContent = playerTwoUsername;

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
            divFps.innerHTML = engine.getFps().toFixed() + " fps";
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
const physicsPlugin = new BABYLON.OimoJSPlugin();// Use the Cannon.js physics engine
const g = 9.81;

//MESHES
let player = null;
let playerTwo = null;
let hexagon = null;
let hexagonTwo = null;
let sphere1 = null;
let sphere2 = null;
var platform = null;
var loaded = false;
let bubbleSphere = null;
let hexagonEnd = null;
let hexagonTwoEnd = null;
let playerEnd = null;
let playerTwoEnd = null;

//FPS
const options = new BABYLON.SceneOptimizerOptions();
let divFps = document.getElementById("fps");

//STORE TUPLES OF HEXAGONS WITH HIS COLLIDE BOX
let hexagonsMap = [];
let spheresMap = [];
const LUCKY_VALUE = 0.99;
let invicible = false;
let invicibleTwo = false;

//STORING KEY PRESSED
const keyStatus = { 87: false, 65: false, 83: false, 68: false, 16: false, 32: false, 37: false, 39: false, 40: false };
const INVICIBILITY_TIME = 7000;

//SPEED OF MOVEMENT
var movementAmount = 0.04; // Adjust the movement speed as needed
var rotationAmount = 0.04; // Adjust the movement speed as needed
var jumping = false
var jumpingTwo = false

function isJumping() {
    jumping = false;
}

function isJumpingTwo() {
    jumpingTwo = false;
}

//PLAYER STATIC DIMENSION OF COLLIDE BOX
var playerCollisionBoxDimensions = new BABYLON.Vector3(0.6, 0.8, 0.4);
var playerCollisionBoxPosition = new BABYLON.Vector3(0.63, 0.2, 1.6);

//START POSITION OF PLAYER
var targetPosition = new BABYLON.Vector3(-15, 150, -15);
var targetPosition2 = new BABYLON.Vector3(-1, 8.6, -7.5);
var targetPositionTwo2 = new BABYLON.Vector3(-4, 8.6, -13.5);

//STATIC DIMENSION OF HEXAGON COLLIDE BOX
var hexagonCollisionBoxDimensions = new BABYLON.Vector3(2.0, 0.5, 1.75);

//DIFFICULTY
var diff = localStorage.getItem("difficulty") || "Normal";
var lifeHexagon = 0;
var invicibilityTime = 0;
var range_x_z_bomb = 0;

//TEXTURE
var texture = localStorage.getItem("texture") || "Color";
console.log(texture);
var model = "";
var modelName = "";
var modelPlatform = "";
var modelPlatformName="";

//LISTENER FOR MIVEMENTS
configure_movement_listeners();


function fallingAnimation(amountEndingFrame, selectedPlayer) {
    var playerId = 1;
    var selectedPlayerJumping = jumping;
    if (selectedPlayer === playerTwo) {
        playerId = 2;
        selectedPlayerJumping = jumpingTwo;
    }
    if (selectedPlayerJumping === false) {
        if (playerId == 1) {
            jumping = true;
        } else {
            jumpingTwo = true
        }

        if (selectedPlayer === player) {
            var shoulderLeft = selectedPlayer._scene.transformNodes[7]
            var elbowLeft = selectedPlayer._scene.transformNodes[8]
            var shoulderRight = selectedPlayer._scene.transformNodes[16]
            var elbowRight = selectedPlayer._scene.transformNodes[17]
            var kneeLeft = selectedPlayer._scene.transformNodes[27]
            var kneeRight = selectedPlayer._scene.transformNodes[32]

        } else {
            var shoulderLeft = selectedPlayer._scene.transformNodes[48]
            var elbowLeft = selectedPlayer._scene.transformNodes[49]
            var shoulderRight = selectedPlayer._scene.transformNodes[57]
            var elbowRight = selectedPlayer._scene.transformNodes[58]
            var kneeLeft = selectedPlayer._scene.transformNodes[68]
            var kneeRight = selectedPlayer._scene.transformNodes[73]
        }

        var animationShoulderLeft = new BABYLON.Animation("shoulderLeftAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationShoulderRight = new BABYLON.Animation("shoulderRightAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationElbowLeft = new BABYLON.Animation("elbowLeftAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationElbowRight = new BABYLON.Animation("elbowRightAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationKneeLeft = new BABYLON.Animation("kneeLefttAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationKneeRight = new BABYLON.Animation("kneeRightAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        var shoulderLeftKeys = [];
        var shoulderRightKeys = [];
        var elbowLeftKeys = [];
        var elbowRightKeys = [];
        var kneeLeftKeys = [];
        var kneeRightKeys = [];

        shoulderLeftKeys.push(
            { frame: 0, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) },
            { frame: 25 + amountEndingFrame, value: new BABYLON.Vector3(-Math.PI, Math.PI / 2, Math.PI) },
            { frame: 35 + amountEndingFrame, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) },
        )

        shoulderRightKeys.push(
            { frame: 0, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) },
            { frame: 25 + amountEndingFrame, value: new BABYLON.Vector3(-Math.PI, -Math.PI / 2, -Math.PI) },
            { frame: 35 + amountEndingFrame, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) },
        )

        elbowLeftKeys.push(
            { frame: 0, value: new BABYLON.Vector3(0, 0, 0) },
            { frame: 25 + amountEndingFrame, value: new BABYLON.Vector3(0, 0, -Math.PI / 3) },
            { frame: 35 + amountEndingFrame, value: new BABYLON.Vector3(0, 0, 0) }
        )

        elbowRightKeys.push(
            { frame: 0, value: new BABYLON.Vector3(0, 0, 0) },
            { frame: 25 + amountEndingFrame, value: new BABYLON.Vector3(0, 0, Math.PI / 3) },
            { frame: 35 + amountEndingFrame, value: new BABYLON.Vector3(0, 0, 0) }
        )

        kneeLeftKeys.push(
            { frame: 0, value: new BABYLON.Vector3(-Math.PI / 4, 0, 0) },
            { frame: 25 + amountEndingFrame, value: new BABYLON.Vector3(-Math.PI / 2, 0, 0) },
            { frame: 35 + amountEndingFrame, value: new BABYLON.Vector3(-Math.PI / 3, 0, 0) }
        )

        kneeRightKeys.push(
            { frame: 0, value: new BABYLON.Vector3(Math.PI / 16, 0, -Math.PI / 4) },
            { frame: 25 + amountEndingFrame, value: new BABYLON.Vector3(Math.PI / 16, 0, -Math.PI / 2) },
            { frame: 35 + amountEndingFrame, value: new BABYLON.Vector3(Math.PI / 16, 0, -Math.PI / 3) }
        )

        animationShoulderLeft.setKeys(shoulderLeftKeys);
        animationShoulderRight.setKeys(shoulderRightKeys);
        animationElbowLeft.setKeys(elbowLeftKeys);
        animationElbowRight.setKeys(elbowRightKeys);
        animationKneeLeft.setKeys(kneeLeftKeys);
        animationKneeRight.setKeys(kneeRightKeys);

        shoulderLeft.animations = [];
        shoulderRight.animations = [];
        elbowLeft.animations = [];
        elbowRight.animations = [];
        kneeLeft.animations = [];
        kneeRight.animations = [];

        shoulderLeft.animations.push(animationShoulderLeft)
        shoulderRight.animations.push(animationShoulderRight)
        elbowLeft.animations.push(animationElbowLeft)
        elbowRight.animations.push(animationElbowRight)
        kneeLeft.animations.push(animationKneeLeft)
        kneeRight.animations.push(animationKneeRight)

        scene.beginAnimation(shoulderLeft, 0, 35 + amountEndingFrame, false, 1, playerId == 1 ? isJumping : isJumpingTwo);
        scene.beginAnimation(shoulderRight, 0, 35 + amountEndingFrame);
        scene.beginAnimation(elbowLeft, 0, 35 + amountEndingFrame);
        scene.beginAnimation(elbowRight, 0, 35 + amountEndingFrame);
        scene.beginAnimation(kneeLeft, 0, 35 + amountEndingFrame);
        scene.beginAnimation(kneeRight, 0, 35 + amountEndingFrame);

    }
}

function isPlayerFalling(selectedPlayer) {
    const raycastLength = 9.5; // The length of the ray to cast downward
    const raycastDirection = new BABYLON.Vector3(0, -1, 0); // The direction to cast the ray

    const origin = selectedPlayer.position.clone(); // Start the raycast from the player's position
    origin.y += 0.75 // Offset the starting position slightly above the player's feet

    const ray = new BABYLON.Ray(origin, raycastDirection, raycastLength);
    const hit = scene.pickWithRay(ray, (mesh) => mesh.isPickable && mesh !== selectedPlayer);
    return !hit || hit.distance > 2.5; // Return true if no collision or if the distance is greater than 1.0 (player is likely falling)
}

function jump(camera, selectedPlayer) {
    var playerId = 1;
    var selectedPlayerJumping = jumping;
    if (selectedPlayer === playerTwo) {
        playerId = 2;
        selectedPlayerJumping = jumpingTwo;
    }
    if (selectedPlayerJumping === false) {
        if (playerId == 1) {
            jumping = true;
        } else {
            jumpingTwo = true
        }
        if (selectedPlayer === player) {
            var root = selectedPlayer._scene.transformNodes[0]
            var shoulderLeft = selectedPlayer._scene.transformNodes[7]
            var elbowLeft = selectedPlayer._scene.transformNodes[8]
            var shoulderRight = selectedPlayer._scene.transformNodes[16]
            var elbowRight = selectedPlayer._scene.transformNodes[17]
        } else {
            var root = selectedPlayer._scene.transformNodes[41]
            var shoulderLeft = selectedPlayer._scene.transformNodes[48]
            var elbowLeft = selectedPlayer._scene.transformNodes[49]
            var shoulderRight = selectedPlayer._scene.transformNodes[57]
            var elbowRight = selectedPlayer._scene.transformNodes[58]
        }

        var animationShoulderLeft = new BABYLON.Animation("shoulderLeftAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationShoulderRight = new BABYLON.Animation("shoulderRightAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationElbowLeft = new BABYLON.Animation("elbowLeftAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var animationElbowRight = new BABYLON.Animation("elbowRightAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        var jumpAnimation = new BABYLON.Animation("jumpAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var jumpHeight = 2.0
        var jumpDuration = 45
        var framesPerStep = jumpDuration / 3; // Divide the jump animation into three steps (start, peak, and end)

        var jumpKeys = [];
        var shoulderLeftKeys = [];
        var shoulderRightKeys = [];
        var elbowLeftKeys = [];
        var elbowRightKeys = [];

        // Add keyframes for the first step (ascending)
        for (var i = 0; i <= framesPerStep; i++) {
            jumpKeys.push({
                frame: i,
                value: root.position.y + (jumpHeight / framesPerStep) * i,
            });
            jumpAnimation.addEvent(new BABYLON.AnimationEvent(
                i,
                function () {
                    var cameraForward = camera.getDirection(BABYLON.Vector3.Forward());
                    var speed = 0.07;
                    var currentPosition = selectedPlayer.position.clone();
                    var deltaPosition = cameraForward.scaleInPlace(speed);
                    deltaPosition.y = 0;
                    selectedPlayer.position = currentPosition.add(deltaPosition);
                },
                false
            ));
        }

        // Add keyframes for the second step (descending)
        for (var i = 1; i <= framesPerStep; i++) {
            jumpKeys.push({
                frame: framesPerStep + i,
                value: root.position.y + (jumpHeight - (jumpHeight / framesPerStep) * i),
            });
            jumpAnimation.addEvent(new BABYLON.AnimationEvent(
                framesPerStep + i,
                function () {
                    var cameraForward = camera.getDirection(BABYLON.Vector3.Forward());
                    var speed = 0.07;
                    var currentPosition = selectedPlayer.position.clone();
                    var deltaPosition = cameraForward.scaleInPlace(speed);
                    deltaPosition.y = 0;
                    selectedPlayer.position = currentPosition.add(deltaPosition);
                },
                false
            ));
        }

        // Add keyframe for the last step (return to original height)
        jumpKeys.push({
            frame: jumpDuration,
            value: root.position.y
        });

        shoulderLeftKeys.push(
            { frame: 0, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) },
            { frame: 15, value: new BABYLON.Vector3(-Math.PI / 2, Math.PI / 2, Math.PI) },
            { frame: 30, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) }
        )

        shoulderRightKeys.push(
            { frame: 0, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) },
            { frame: 15, value: new BABYLON.Vector3(-Math.PI / 2, -Math.PI / 2, -Math.PI) },
            { frame: 30, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) }
        )

        elbowLeftKeys.push(
            { frame: 0, value: new BABYLON.Vector3(0, 0, 0) },
            { frame: 15, value: new BABYLON.Vector3(0, 0, -Math.PI / 3) },
            { frame: 30, value: new BABYLON.Vector3(0, 0, 0) }
        )

        elbowRightKeys.push(
            { frame: 0, value: new BABYLON.Vector3(0, 0, 0) },
            { frame: 15, value: new BABYLON.Vector3(0, 0, Math.PI / 3) },
            { frame: 30, value: new BABYLON.Vector3(0, 0, 0) }
        )

        jumpAnimation.setKeys(jumpKeys);
        animationShoulderLeft.setKeys(shoulderLeftKeys);
        animationShoulderRight.setKeys(shoulderRightKeys);
        animationElbowLeft.setKeys(elbowLeftKeys);
        animationElbowRight.setKeys(elbowRightKeys);

        root.animations = [];
        shoulderLeft.animations = [];
        shoulderRight.animations = [];
        elbowLeft.animations = [];
        elbowRight.animations = [];

        root.animations.push(jumpAnimation);
        shoulderLeft.animations.push(animationShoulderLeft)
        shoulderRight.animations.push(animationShoulderRight)
        elbowLeft.animations.push(animationElbowLeft)
        elbowRight.animations.push(animationElbowRight)

        scene.beginAnimation(shoulderLeft, 0, 30, false, 1, playerId == 1 ? isJumping : isJumpingTwo);
        scene.beginAnimation(shoulderRight, 0, 30);
        scene.beginAnimation(elbowLeft, 0, 30);
        scene.beginAnimation(elbowRight, 0, 30);
        scene.beginAnimation(root, 0, jumpDuration);

    }
}



const createScene = async function () {
    BabylonEngine.displayLoadingUI();

    /*-----END GAME SCENE-----*/

    const scene2 = new BABYLON.Scene(BabylonEngine);
    // Optimizer
    var optimizer2 = new BABYLON.SceneOptimizer(scene2, options);

    const camera2 = new BABYLON.ArcRotateCamera("Camera2", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene2);
    // Set the cameraFirst position and target
    camera2.setPosition(new BABYLON.Vector3(5, 10, -15));
    camera2.setTarget(new BABYLON.Vector3(-20, 10, 0));
    // Attach cameraFirst controls to the canvas
    camera2.attachControl(canvas, true);

    //MUSIC IN BACKGROUND
    var endgametrack = new BABYLON.Sound("endgame", Assets.musics.endgame.Url, scene2, null, {
        loop: true,
        autoplay: false
    });

    // Create a hemispheric light
    var hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene2);

    // Set the light's intensity
    hemiLight.intensity = 0.5;

    //  SKYBOX
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene2);
    var skyboxMaterial = configure_skybox_material(scene2, skybox);

    var advancedTextureEnd = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Banner with top and bottom borders
    var bannerEnd = new BABYLON.GUI.Rectangle();
    bannerEnd.width = 0.6;
    bannerEnd.height = "250px";
    bannerEnd.cornerRadius = 30;
    bannerEnd.color = "#9a84be";
    bannerEnd.thickness = 10;
    bannerEnd.background = "#000000AA";
    bannerEnd.top = "-100px";
    advancedTextureEnd.addControl(bannerEnd);

    var stackPanelEnd = new BABYLON.GUI.StackPanel();
    stackPanelEnd.isVertical = true; // Arrange elements vertically
    stackPanelEnd.height = "100%";
    bannerEnd.addControl(stackPanelEnd);


    var textblockEnd1 = create_end_text("Game Ended", 1);
    stackPanelEnd.addControl(textblockEnd1);

    var textblockEnd2 = create_end_text("", 2);
    stackPanelEnd.addControl(textblockEnd2);

    // Banner with top and bottom borders
    var bannerEnd1 = new BABYLON.GUI.Rectangle();
    bannerEnd1.width = 0.6;
    bannerEnd1.height = "150px";
    bannerEnd1.cornerRadius = 30;
    bannerEnd1.color = "#9a84be";
    bannerEnd1.thickness = 10;
    bannerEnd1.background = "#000000AA";
    // Position the second banner below the first one
    bannerEnd1.top = `${(parseFloat(bannerEnd.height) + parseFloat(bannerEnd1.height)) / 2}px`;
    advancedTextureEnd.addControl(bannerEnd1);

    var stackPanelEnd1 = new BABYLON.GUI.StackPanel();
    stackPanelEnd1.isVertical = false; // Arrange elements vertically
    stackPanelEnd1.height = "100%";
    bannerEnd1.addControl(stackPanelEnd1);

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("button1", "Restart");
    button1.width = "200px";
    button1.height = "60px";
    button1.color = "white";
    button1.background = "#9a84be";
    button1.paddingRight = "30px"; // Add padding between the buttons
    button1.cornerRadius = 20; // Set the corner radius
    button1.fontFamily = "Comic Sans MS"; // Set the font family
    button1.fontSize = 25; // Set the font size
    button1.onPointerClickObservable.add(function () {
        onButtonClick("game_two.html"); // Pass parameters to the click event function
    });
    stackPanelEnd1.addControl(button1);

    // Create the second button
    var button2 = BABYLON.GUI.Button.CreateSimpleButton("button2", "Home");
    button2.width = "200px";
    button2.height = "60px";
    button2.color = "white";
    button2.background = "#9a84be";
    button2.paddingRight = "30px"; // Add padding between the buttons
    button2.cornerRadius = 20; // Set the corner radius
    button2.fontFamily = "Comic Sans MS"; // Set the font family
    button2.fontSize = 25; // Set the font size
    button2.onPointerClickObservable.add(function () {
        onButtonClick("index.html"); // Pass parameters to the click event function
    });
    stackPanelEnd1.addControl(button2);

    // Create the third button
    var button3 = BABYLON.GUI.Button.CreateSimpleButton("button3", "Options");
    button3.width = "200px";
    button3.height = "60px";
    button3.color = "white";
    button3.background = "#9a84be";
    button3.cornerRadius = 20; // Set the corner radius
    button3.fontFamily = "Comic Sans MS"; // Set the font family
    button3.fontSize = 25; // Set the font size
    button3.onPointerClickObservable.add(function () {
        onButtonClick("options.html"); // Pass parameters to the click event function
    });
    stackPanelEnd1.addControl(button3);

    //IMPORTING OF THE MESHES
    let [playerScene2, playerSceneTwo2, hexagonScene2] = await Promise.all([
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.player.Url, "player.glb", scene2),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.player.Url, "PlayerTwo.glb", scene2),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.hexagon.Url, "hexagon.glb", scene2)
    ])

    // Detach the meshes from their parent nodes
    hexagonEnd = hexagonScene2["meshes"][0]._children[0];
    hexagonEnd.material = generate_material_with_random_color(scene2, "HexagonEnd");
    hexagonEnd.parent = null;


    // Create the hexagon mesh

    // Set the position of the hexagon and player to the same vector
    hexagonEnd.position.copyFrom(targetPosition2);
    hexagonEnd.scaling = new BABYLON.Vector3(2, 2, 1); // Scale the player mesh by a factor of 2 along all axes

    // Detach the meshes from their parent nodes
    hexagonTwoEnd = hexagonEnd.clone("HexagonEnd Two")
    hexagonTwoEnd.position.copyFrom(targetPositionTwo2);

    playerEnd = playerScene2["meshes"][0];
    playerEnd.position.copyFrom(targetPosition2);
    playerEnd.position.z += 3.0;
    playerEnd.position.x += 1.0;
    playerEnd.position.y += 0.06;

    playerEnd.scaling = new BABYLON.Vector3(2, 2, 2); // Scale the player mesh by a factor of 2 along all axes



    playerTwoEnd = playerSceneTwo2["meshes"][0];
    playerTwoEnd.position.copyFrom(targetPositionTwo2);
    playerTwoEnd.position.z += 3.0;
    playerTwoEnd.position.x += 2.2;
    playerTwoEnd.position.y += 0.06;

    playerTwoEnd.scaling = new BABYLON.Vector3(2, 2, 2); // Scale the player m

    var animationEndGameOne = endGameAnimation(playerScene2, playerEnd);
    var animationEndGameTwo = endGameAnimation(playerScene2, playerTwoEnd);
    /*-----START GAME SCENE-----*/

    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(BabylonEngine);


    //ENABLE PHYSICS
    scene.enablePhysics(new BABYLON.Vector3(0, -g, 0), physicsPlugin); // Enable physics with gravity 

    //MUSIC IN BACKGROUND
    var soundtrack = new BABYLON.Sound("soundtrack", Assets.musics.soundtrack.Url, scene, null, {
        loop: true,
        autoplay: true
    });

    var sphere1Sound = new BABYLON.Sound("endgame", Assets.musics.sphere1.Url, scene2, null, {
        loop: false,
        autoplay: false
    });

    var sphere2Sound = new BABYLON.Sound("endgame", Assets.musics.sphere2.Url, scene2, null, {
        loop: true,
        autoplay: false
    });

    function endSphereSound1() {
        sphere1Sound.stop();
    }

    function endSphereSound2() {
        sphere2Sound.stop();
    }


    const cameraFirst = configure_camera(scene, "First");

    const cameraSecond = configure_camera(scene, "Second");


    scene.activeCameras.push(cameraFirst);
    scene.activeCameras.push(cameraSecond);

    // Create two viewports
    var viewport1 = new BABYLON.Viewport(0, 0, 0.5, 1);
    var viewport2 = new BABYLON.Viewport(0.5, 0, 0.5, 1);

    // Set the viewports on the cameras
    cameraFirst.viewport = viewport1;
    cameraSecond.viewport = viewport2;

   
    /* //MOTION BLUR CONFIGURATION
     configure_motion_blur(scene,cameraFirst);
     configure_motion_blur(scene,cameraSecond);*/
    

    //DIFFICULTY CONFIGURATION
    configure_difficulty(diff);

    //TEXTURE CONFIGURATION
    configure_texture_platform(texture);


    // Optimizer
    var optimizer = new BABYLON.SceneOptimizer(scene, options);

    //LIGHT CONFIGRATION
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    //  SKYBOX
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
    var skyboxMaterial = configure_skybox_material(scene, skybox);

    // Water
    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 2048, 2048, 16, scene, false);
    var water = configure_water_material(scene, skybox, waterMesh);

    //IMPORTING OF THE MESHES
    let [playerScene, playerSceneTwo, platformScene, hexagonScene, sphere1Scene, sphere2Scene] = await Promise.all([
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.player.Url, "player.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.player.Url, "PlayerTwo.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.platform.Url, "platform.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.hexagon.Url, "hexagon.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.sphere.Url, "sphere1.glb", scene),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.sphere.Url, "sphere2.glb", scene)
    ])

    // Create the sphere mesh
    sphere1 = sphere1Scene["meshes"][0];
    sphere2 = sphere2Scene["meshes"][0];

    platform = platformScene["meshes"][0];
    var exagons = platform._children;

    //CREATING HEXAGONS AND COLLIDING BOXING FOR EACH
    for (var i = 0; i < exagons.length; i++) {
        exagons[i].material = generate_material_with_random_color(scene, "Hexagon_" + i + "_platform_0");
        create_collision_box(exagons[i], scene, "HexagonCollisionBox_" + i + "_platform_0", 0);
    };

    platform.position.y += 100;

    //CREATE CLONE OF PLATFORM
    for (var i = 1; i < 5; i++) {

        var clonedPlatform = platform.clone("Cloned_Platform_" + i);
        var clonedExagons = clonedPlatform._children;

        //CREATING HEXAGONS AND COLLIDING BOXING FOR EACH
        for (var j = 0; j < clonedExagons.length; j++) {
            clonedExagons[j].material = generate_material_with_random_color(scene, "Hexagon_" + j + "_platform_" + i);
            create_collision_box(clonedExagons[j], scene, "HexagonCollisionBox_" + j + "_platform_" + i, i);
        }

        clonedPlatform.position.y += 10 * i;

        for (var j = 0; j < clonedExagons.length; j++) {
            var hexagonCollisionBox = hexagonsMap[j][1];
            hexagonCollisionBox.position.copyFrom(clonedExagons[j].position);
        }
    }

    // Detach the meshes from their parent nodes
    hexagon = hexagonScene["meshes"][0]._children[0];
    hexagon.material = generate_material_with_random_color(scene, "Hexagon");
    hexagon.parent = null;


    // Set the position of the hexagon and player to the same vector
    hexagon.position.copyFrom(targetPosition);


    hexagonTwo = hexagon.clone("HexagonTwo");
    hexagonTwo.material = generate_material_with_random_color(scene, "HexagonTwo");
    hexagonTwo.position.x += 3;
    hexagonTwo.position.z += 5;


    player = playerScene["meshes"][0];
    player.position.copyFrom(targetPosition);
    player.position.y += 0.14;
    player.position.x += 0.5;
    player.position.z -= 1.6;

    cameraFirst.lockedTarget = playerScene["transformNodes"][5];

    playerTwo = playerSceneTwo["meshes"][0];
    playerTwo.position.copyFrom(targetPosition);
    playerTwo.position.y += 0.14;
    playerTwo.position.x += 3.5;
    playerTwo.position.z += 3.6;

    // Create custom collision boxes based on the defined dimensions and positions
    var playerCollisionBox = BABYLON.MeshBuilder.CreateBox("playerCollisionBox", { width: playerCollisionBoxDimensions.x, height: playerCollisionBoxDimensions.y, depth: playerCollisionBoxDimensions.z }, scene);
    playerCollisionBox.parent = player;
    playerCollisionBox.position.copyFrom(playerCollisionBoxPosition);

    // Set the visibility of the collision boxes to false
    playerCollisionBox.isVisible = false;

    // Create custom collision boxes based on the defined dimensions and positions
    var playerCollisionBoxTwo = BABYLON.MeshBuilder.CreateBox("playerCollisionBoxTwo", { width: playerCollisionBoxDimensions.x, height: playerCollisionBoxDimensions.y, depth: playerCollisionBoxDimensions.z }, scene);
    playerCollisionBoxTwo.parent = playerTwo;
    playerCollisionBoxTwo.position.copyFrom(playerCollisionBoxPosition);

    // Set the visibility of the collision boxes to false
    playerCollisionBoxTwo.isVisible = false;

    // Setup keyframes animations
    playerNodes = playerScene["transformNodes"];
    playerNodesTwo = playerSceneTwo["meshes"][0]._scene.transformNodes;

    shoulderRight = playerNodes[17]
    shoulderLeft = playerNodes[8]
    chest = playerNodes[4]
    pelvis = playerNodes[26]
    torso = playerNodes[37]
    root = playerNodes[0]

    shoulderRightTwo = playerNodesTwo[57]
    shoulderLeftTwo = playerNodesTwo[48]
    chestTwo = playerNodesTwo[44]
    pelvisTwo = playerNodesTwo[66]
    torsoTwo = playerNodesTwo[77]
    rootTwo = playerNodesTwo[41]

    cameraSecond.lockedTarget = playerSceneTwo["meshes"][0]._scene.transformNodes[45];


    // Create a sphere
    bubbleSphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 3 }, scene);

    // Create a sphere
    bubbleSphereTwo = BABYLON.MeshBuilder.CreateSphere('sphereTwo', { diameter: 3 }, scene);

    // Create a material for the sphere
    let bubbleMaterial = new BABYLON.StandardMaterial('bubbleMaterial', scene);
    bubbleMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // Blueish color
    bubbleMaterial.alpha = 0.3; // Set transparency
    bubbleMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Disable specularity
    bubbleMaterial.backFaceCulling = false; // Show both sides of the sphere

    // Apply the material to the sphere
    bubbleSphere.material = bubbleMaterial;
    bubbleSphereTwo.material = bubbleMaterial;

    // Parent the sphere to the player object
    bubbleSphere.parent = chest;
    bubbleSphereTwo.parent = chestTwo;

    // Set initial visibility to true
    bubbleSphere.isVisible = false;
    bubbleSphereTwo.isVisible = false;

    hipLeft = playerNodes[27]
    kneeLeft = playerNodes[28]
    hipRight = playerNodes[32]
    kneeRight = playerNodes[33]

    hipLeftTwo = playerNodesTwo[67]
    kneeLeftTwo = playerNodesTwo[68]
    hipRightTwo = playerNodesTwo[72]
    kneeRightTwo = playerNodesTwo[73]

    var animationShoulderRight = new BABYLON.Animation("rotationAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var animationShoulderLeft = new BABYLON.Animation("rotationAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var animationKneeLeft = new BABYLON.Animation("kneeLeftAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var animationKneeRight = new BABYLON.Animation("kneeRightAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    animationShoulderLeft.setKeys([
        { frame: 0, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) },
        { frame: 5, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI * 220 / 180) },
        { frame: 10, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) },
        { frame: 15, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI * 140 / 180) },
        { frame: 20, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) }
    ]);
    animationShoulderRight.setKeys([
        { frame: 0, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) },
        { frame: 5, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI * 140 / 180) },
        { frame: 10, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) },
        { frame: 15, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI * 220 / 180) },
        { frame: 20, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) }
    ]);
    animationKneeLeft.setKeys([
        { frame: 0, value: new BABYLON.Vector3(-Math.PI / 4, 0, 0) },
        { frame: 10, value: new BABYLON.Vector3(-Math.PI / 2, 0, 0) },
        { frame: 20, value: new BABYLON.Vector3(-Math.PI / 4, 0, 0) }
    ])
    animationKneeRight.setKeys([
        { frame: 0, value: new BABYLON.Vector3(Math.PI / 16, 0, -Math.PI / 2) },
        { frame: 10, value: new BABYLON.Vector3(Math.PI / 16, 0, -Math.PI / 4) },
        { frame: 20, value: new BABYLON.Vector3(Math.PI / 16, 0, -Math.PI / 2) }
    ])

    kneeLeft.animations.push(animationKneeLeft);
    kneeRight.animations.push(animationKneeRight);
    shoulderRight.animations.push(animationShoulderRight);
    shoulderLeft.animations.push(animationShoulderLeft);
    var animationGroupW = new BABYLON.AnimationGroup("rotationAnimationGroup");
    animationGroupW.addTargetedAnimation(animationShoulderRight, shoulderRight);
    animationGroupW.addTargetedAnimation(animationShoulderLeft, shoulderLeft);
    animationGroupW.addTargetedAnimation(animationKneeLeft, kneeLeft);
    animationGroupW.addTargetedAnimation(animationKneeRight, kneeRight);

    kneeLeftTwo.animations.push(animationKneeLeft);
    kneeRightTwo.animations.push(animationKneeRight);
    shoulderRightTwo.animations.push(animationShoulderRight);
    shoulderLeftTwo.animations.push(animationShoulderLeft);
    var animationGroupWTwo = new BABYLON.AnimationGroup("rotationAnimationGroupTwo");
    animationGroupWTwo.addTargetedAnimation(animationShoulderRight, shoulderRightTwo);
    animationGroupWTwo.addTargetedAnimation(animationShoulderLeft, shoulderLeftTwo);
    animationGroupWTwo.addTargetedAnimation(animationKneeLeft, kneeLeftTwo);
    animationGroupWTwo.addTargetedAnimation(animationKneeRight, kneeRightTwo);

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
                add_physic(scene);
                hexagon.dispose();
                hexagonTwo.dispose();
            }, 2000); // Wait for 2 seconds before starting the game
        }
    }, 1000); // Update the countdown every second


    /* CHANGE SCENE */

    var scenes = [];
    scenes.push(scene);
    scenes.push(scene2);

    var currentScene = scene;

    // Register a collision function for the player and hexagon collision boxes
    scene.registerBeforeRender(function () {
        if (panel.isVisible) return;

        //HANDLE END GAME
        if (player.position.y < 80 || playerTwo.position.y < 80) {
            BabylonEngine.stopRenderLoop();

            currentScene = scene2;

            soundtrack.stop();
            endgametrack.play();

            if (player.position.y < 80) {
                textblockEnd2.text = playerTwoUsername + " win! (BLUE)"
                animationEndGameOne.stop();
                playerEnd.dispose();
                hexagonEnd.dispose();
            } else {
                textblockEnd2.text = playerOneUsername + " win! (RED)"
                animationEndGameTwo.stop();
                playerTwoEnd.dispose();
                hexagonTwoEnd.dispose();
            }

            document.getElementById("containerUsernames").style.display = "none";

            BabylonEngine.runRenderLoop(function () {

                currentScene.render();

            });
        }
        for (var i = 0; i < hexagonsMap.length; i++) {
            var life = hexagonsMap[i][3];
            var collided = hexagonsMap[i][2];
            var hexagonBox = hexagonsMap[i][1];
            var hexagonReal = hexagonsMap[i][0];
            var currentSphere = hexagonsMap[i][4];
            var currentSphereType = hexagonsMap[i][5];
            // Perform intersection check between player mesh and hexagon mesh
            if (!hexagonReal.isDisposed()) {
                if (playerCollisionBox.intersectsMesh(hexagonBox, true)) {
                    var currentVelocity = player.physicsImpostor.getLinearVelocity().clone();
                    player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, Math.ceil(Math.abs(currentVelocity.y)) * 0.7, 0));
                    if (!collided && !invicible) {
                        hexagonsMap[i][2] = true;
                        hexagon_pressed(hexagonReal);
                        if (currentSphere != null) {
                            var index = 0;
                            for (var tuple in spheresMap) {
                                if (tuple[0] == currentSphere) {
                                    tuple[1].stop();
                                    tuple[1].dispose();
                                    break;
                                }
                                index++;
                            }
                            currentSphere.dispose();
                            spheresMap.splice(index, 1);

                            if (currentSphereType == 1) {
                                sphere1Sound.play();
                                setTimeout(endSphereSound1, 1000); // Call after 2 seconds
                                invicible = true;
                                bubbleSphere.isVisible = true;
                                setTimeout(finishInvicibility, INVICIBILITY_TIME); // Call after 2 seconds
                            } else {
                                sphere2Sound.play();
                                setTimeout(endSphereSound2, 2000); // Call after 2 seconds
                                player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Math.random() * 40 - 20, Math.ceil(Math.abs(currentVelocity.y)) * 12, Math.random() * 40 - 20));
                            }
                        }
                    }
                }
                if (playerCollisionBoxTwo.intersectsMesh(hexagonBox, true)) {
                    var currentVelocity = playerTwo.physicsImpostor.getLinearVelocity().clone();
                    playerTwo.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, Math.ceil(Math.abs(currentVelocity.y)) * 0.7, 0));
                    if (!collided && !invicibleTwo) {
                        hexagonsMap[i][2] = true;
                        hexagon_pressed(hexagonReal);
                        if (currentSphere != null) {
                            var index = 0;
                            for (var tuple in spheresMap) {
                                if (tuple[0] == currentSphere) {
                                    tuple[1].stop();
                                    tuple[1].dispose();
                                    break;
                                }
                                index++;
                            }
                            currentSphere.dispose();
                            spheresMap.splice(index, 1);

                            if (currentSphereType == 1) {
                                sphere1Sound.play();
                                setTimeout(endSphereSound1, 1000); // Call after 2 seconds
                                invicibleTwo = true;
                                bubbleSphereTwo.isVisible = true;
                                setTimeout(finishInvicibilityTwo, INVICIBILITY_TIME); // Call after 2 seconds
                            } else {
                                sphere2Sound.play();
                                setTimeout(endSphereSound2, 2000); // Call after 2 seconds
                                playerTwo.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Math.random() * 40 - 20, Math.ceil(Math.abs(currentVelocity.y)) * 12, Math.random() * 40 - 20));
                            }
                        }
                    }
                }
            }

            if (collided) {
                playerTwo
                if (life == 0 && hexagonBox != undefined) {
                    dispose_hexagons(hexagonBox, hexagonReal)
                } else {
                    hexagonsMap[i][3] = life - 1;
                }
            }
        }
        if (player.position.y < 139 && player.position.y >= 100) {
            ret = isPlayerFalling(player)
            if (ret) {
                fallingAnimation(0, player)
            }
        } else if (player.position.y < 100) {
            fallingAnimation(30, player)
        }

        if (playerTwo.position.y < 139 && playerTwo.position.y >= 100) {
            ret = isPlayerFalling(playerTwo)
            if (ret) {
                fallingAnimation(0, playerTwo)
            }
        } else if (playerTwo.position.y < 100) {
            fallingAnimation(30, playerTwo)
        }

        // If W is pressed, start movement of shoulders
        if (keyStatus[87] || keyStatus[83]) {
            move_player(cameraFirst, player);
            if (!jumping) {
                animationGroupW.start();
            }
        }
        if (keyStatus[68]) { //press D
            move_player(cameraFirst, player);
            if (!jumping) {
                animationGroupW.start();
            }
        }
        if (keyStatus[65]) { //press A
            move_player(cameraFirst, player);
            if (!jumping) {
                animationGroupW.start();
            }
        }
        if (keyStatus[38] || keyStatus[40]) {
            move_player(cameraSecond, playerTwo);
            if (!jumpingTwo) {
                animationGroupWTwo.start();
            }
        }
        if (keyStatus[39]) { //press D
            move_player(cameraSecond, playerTwo);
            if (!jumpingTwo) {
                animationGroupWTwo.start();
            }
        }
        if (keyStatus[37]) { //press A
            move_player(cameraSecond, playerTwo);
            if (!jumpingTwo) {
                animationGroupWTwo.start();
            }
        }
        if (keyStatus[32]) { //press spacebar
            jump(cameraFirst, player);
        }
        if (keyStatus[16]) {
            jump(cameraSecond, playerTwo);
        }
    }
    );

    return currentScene;
};

// Function to handle button click in the first banner
function onButtonClick(name) {
    window.location.href = name;
}


function dispose_hexagons(hexagon, hexagonCollisionBox) {
    hexagon.dispose();
    hexagonCollisionBox.dispose();
}

function hexagon_pressed(hexagon) {
    // Setup keyframes animations
    var animationHexagon = new BABYLON.Animation("positionAnimation", "position", BabylonEngine.getFps().toFixed(), BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var initialPosition = hexagon.position.clone(); // Store the initial position of the hexagon

    // Define the keyframes for the hexagon animation
    animationHexagon.setKeys([
        { frame: 0, value: initialPosition },
        { frame: 15, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y - 0.06, initialPosition.z) }, // Hexagon goes down
        { frame: 30, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y - 0.12, initialPosition.z) },
        { frame: 45, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y - 0.06, initialPosition.z) }, // Hexagon goes down
        { frame: 60, value: initialPosition } // Hexagon returns to initial position
    ]);

    // Define the keyframes for the color animation
    var animationColor = new BABYLON.Animation("colorAnimation", "material.diffuseColor", BabylonEngine.getFps().toFixed(), BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var initialColor = hexagon.material.diffuseColor.clone(); // Store the initial color of the hexagon material

    animationColor.setKeys([
        { frame: 0, value: initialColor },
        { frame: 10, value: new BABYLON.Color3(1, 0, 0) }, // Red color throughout the animation
        { frame: 15, value: initialColor }, // Red color throughout the animation
        { frame: 20, value: new BABYLON.Color3(1, 0, 0) }, // Red color throughout the animation
        { frame: 25, value: initialColor }, // Red color throughout the animation
        { frame: 30, value: new BABYLON.Color3(1, 0, 0) },// Red color throughout the animation
        { frame: 35, value: initialColor }, // Red color throughout the animation
        { frame: 40, value: new BABYLON.Color3(1, 0, 0) }, // Red color throughout the animation
        { frame: 45, value: initialColor },// Red color throughout the animation
        { frame: 50, value: new BABYLON.Color3(1, 0, 0) },// Red color throughout the animation
        { frame: 55, value: initialColor },// Red color throughout the animation
        { frame: 60, value: new BABYLON.Color3(1, 0, 0) }
    ]);

    // Apply the animations to the hexagon
    hexagon.animations.push(animationHexagon); invicibleTwo
    hexagon.animations.push(animationColor);

    // Create an animation group and add the animations to it
    var animationGroupHexagon = new BABYLON.AnimationGroup("hexagonAnimationGroup");
    animationGroupHexagon.addTargetedAnimation(animationHexagon, hexagon);
    animationGroupHexagon.addTargetedAnimation(animationColor, hexagon);

    // Start the animation group
    animationGroupHexagon.start();
}

function finishInvicibility() {
    bubbleSphere.isVisible = false;
    invicible = false;
}

function finishInvicibilityTwo() {
    bubbleSphereTwo.isVisible = false;
    invicibleTwo = false;
}

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
    var textblock = new BABYLON.GUI.TextBlock("Countdown", "5");
    textblock.width = 1.0;
    textblock.height = "300px";
    textblock.color = "white";
    textblock.fontFamily = "Comic Sans MS"; // Use the desired font family
    textblock.outlineColor = "#9a84be"; // Set the outline color
    textblock.outlineWidth = 30; // Set the outline width
    textblock.fontSize = 300;
    return textblock;
}

function create_end_text(text, element) {
    var textblock = new BABYLON.GUI.TextBlock("Endgame " + element, text);
    textblock.width = 1.0;
    textblock.height = "100px";
    textblock.color = "white";
    textblock.fontFamily = "Comic Sans MS"; // Use the desired font family
    textblock.outlineColor = "#9a84be"; // Set the outline color
    textblock.outlineWidth = 10; // Set the outline width
    textblock.fontSize = 50;
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
function create_collision_box(hexagon, scene, name, platformLevel) {

    var boundingInfo = hexagon.getBoundingInfo();
    var renderingPosition = boundingInfo.boundingBox.centerWorld;

    var hexagonCollisionBox = BABYLON.MeshBuilder.CreateDisc(name, { radius: 1, tessellation: 6 }, scene);
    // Apply rotation to make the hexagon perpendicular to the viewer
    hexagonCollisionBox.rotation.x = Math.PI / 2;

    // Set the position of the collision box to match the hexagon's position
    hexagonCollisionBox.position = renderingPosition;
    // Set the visibility of the collision box
    hexagonCollisionBox.isVisible = false;

    let sphere = null;
    let type = 0;
    let randomValue = Math.random();
    if (randomValue > LUCKY_VALUE) {
        if (randomValue > (LUCKY_VALUE + ((1 - LUCKY_VALUE) / 2))) {
            sphere = sphere1.clone("sphere1_" + name);
            type = 1;
        } else {
            sphere = sphere2.clone("sphere2_" + name);
            type = 2;
        }
        sphere.position = new BABYLON.Vector3(renderingPosition.x, renderingPosition.y + 0.5 * type + platformLevel * 10, renderingPosition.z);
        sphere.scaling = new BABYLON.Vector3(0.6, 0.6, 0.6);
    }

    if (sphere != null) {
        if (platformLevel == 0) {
            sphere.position.y += 100;
        }
        spheresMap.push([sphere, spheresAnimation(sphere)]);
    }
    hexagonsMap.push([hexagon, hexagonCollisionBox, false, 60, sphere, type]);

}

function add_physic(scene) {
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, friction: 0 }, scene);
    playerTwo.physicsImpostor = new BABYLON.PhysicsImpostor(playerTwo, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, friction: 0 }, scene);
    return;
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
function configure_camera(scene, name) {
    // Parameters: name, position, scene
    let camera = new BABYLON.FollowCamera("FollowCam" + name, new BABYLON.Vector3(90, 100, 0), scene);
    camera.heightOffset = 2;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = .02;
    camera.maxCameraSpeed = 1;
    return camera;
}
//CONFIGURATION OF MOTION BLUR
function configure_motion_blur(scene, camera) {

    //CHECK MOTION BLUR
    var mbValue = localStorage.getItem("motion_blur") || "Off";
    console.log(mbValue);

    if (mbValue == "On") {
        var motionBlur = new BABYLON.MotionBlurPostProcess(
            'motionBlur', // name
            scene, // scene
            1.0, // motion blur strength
            camera // camera
        );

        motionBlur.motionStrength = 2;
        motionBlur.motionBlurSamples = 16;

    }
}

//CONFIGURATION DIFFICULTY
function configure_difficulty(diff){
    if(diff == "Easy"){
        lifeHexagon = 90;
        invicibilityTime = 10000;
        range_x_z_bomb = 40;
    }
    else if(diff == "Normal"){
        lifeHexagon = 60;
        invicibilityTime = 5000;
        range_x_z_bomb = 300;
    }
    else if(diff == "Advanced"){
        lifeHexagon=30;
        invicibilityTime = 1000
        range_x_z_bomb = 700;
    }
    else{
        lifeHexagon = 60;
        invicibilityTime = 5000;
        range_x_z_bomb = 300;
    }
}

//FUNCTION TO CONFIGURE THE TEXTURE PLATFORM
function configure_texture_platform(texture){
    
    if(texture == "Wood"){
        model = Assets.models.hexagon1.Url;
        modelName = "hexagon1.glb";
        modelPlatform = Assets.models.platform1.Url ;
        modelPlatformName = "platform1.glb";

    }
    else if(texture == "Stone"){
        model = Assets.models.hexagon2.Url;
        modelName = "hexagon2.glb";
        modelPlatform = Assets.models.platform2.Url ;
        modelPlatformName = "platform2.glb";
    }
    else{
        model = Assets.models.hexagon.Url;
        modelName = "hexagon.glb";
        modelPlatform = Assets.models.platform.Url ;
        modelPlatformName = "platform.glb";
    }
}

function goToSettings() {
    window.location.href = "options.html";
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

function rotatePlayer(direction, selectedPlayer) {

    var transformNodes = selectedPlayer._scene.transformNodes
    if (selectedPlayer === player) {
        var chest = transformNodes[3]
        var pelvis = transformNodes[25]
        var torso = transformNodes[36]
        if (direction == 'right') {
            chest.rotation.y -= 0.02
            pelvis.rotation.y -= 0.02
            torso.rotation.y -= 0.02
        } else {
            chest.rotation.y += 0.02
            pelvis.rotation.y += 0.02
            torso.rotation.y += 0.02
        }
        chest.rotation = chest.rotation.clone()
        pelvis.rotation = pelvis.rotation.clone()
        torso.rotation = torso.rotation.clone()
    } else {
        var chest = transformNodes[44]
        var pelvis = transformNodes[66]
        var torso = transformNodes[77]
        if (direction == 'right') {
            chest.rotation.y -= 0.02
            pelvis.rotation.y -= 0.02
            torso.rotation.y -= 0.02
        } else {
            chest.rotation.y += 0.02
            pelvis.rotation.y += 0.02
            torso.rotation.y += 0.02
        }
        chest.rotation = chest.rotation.clone()
        pelvis.rotation = pelvis.rotation.clone()
        torso.rotation = torso.rotation.clone()

    }
}

function move_player(camera, selectedPlayer) {
    if (selectedPlayer == null) return;

    var speed = 0.04;
    var currentPosition = selectedPlayer.position.clone();

    if (selectedPlayer === player) {
        if (keyStatus[87]) { // 'W' key or up arrow key  
            var cameraForward = camera.getDirection(BABYLON.Vector3.Forward());
            var deltaPosition = cameraForward.scaleInPlace(speed);
            deltaPosition.y = 0;
            selectedPlayer.position = currentPosition.add(deltaPosition);
        }
        if (keyStatus[83]) { // 'S' key or down arrow key

            var cameraForward = camera.getDirection(BABYLON.Vector3.Backward());
            var deltaPosition = cameraForward.scaleInPlace(speed);
            deltaPosition.y = 0;
            selectedPlayer.position = currentPosition.add(deltaPosition);

        }
        if (keyStatus[65]) { // 'A' key or left arrow key
            rotatePlayer("left", selectedPlayer)
        }
        if (keyStatus[68]) { // 'D' key or right arrow key
            rotatePlayer("right", selectedPlayer)
        }
    } else {

        if (keyStatus[38]) { // '^' key or up arrow key  
            var cameraForward = camera.getDirection(BABYLON.Vector3.Forward());
            var deltaPosition = cameraForward.scaleInPlace(speed);
            deltaPosition.y = 0;
            selectedPlayer.position = currentPosition.add(deltaPosition);
        }
        if (keyStatus[40]) { // 'v' key or down arrow key
            var cameraForward = camera.getDirection(BABYLON.Vector3.Backward());
            var deltaPosition = cameraForward.scaleInPlace(speed);
            deltaPosition.y = 0;
            selectedPlayer.position = currentPosition.add(deltaPosition);

        }
        if (keyStatus[37]) { // '<-' key or left arrow key
            rotatePlayer("left", selectedPlayer)
        }
        if (keyStatus[39]) { // '->' key or right arrow key
            rotatePlayer("right", selectedPlayer)
        }
    }
}


function endGameAnimation(player_scene, selectedPlayer) {

    var transformNodes = player_scene["meshes"][0]._scene.transformNodes;

    console.log(transformNodes)
    if (selectedPlayer === playerEnd) {
        var chest = transformNodes[3];
        var pelvis = transformNodes[25];
        var torso = transformNodes[36];

        var playerEndBones = player_scene["transformNodes"];
        var root = playerEndBones[0]
        var leftEye = playerEndBones[6]
        var rightEye = playerEndBones[7]
        var shoulderLeft = playerEndBones[8]
        var shoulderRight = playerEndBones[17]
        var kneeLeft = playerEndBones[28]
        var kneeRight = playerEndBones[33]

        var initialPositionHexagon = hexagonEnd.position.clone();
        var initialColorHexagon = hexagonEnd.material.diffuseColor.clone();

    } else {

        var chest = transformNodes[44];
        var pelvis = transformNodes[66];
        var torso = transformNodes[77];
        var root = transformNodes[41]
        var leftEye = transformNodes[46]
        var rightEye = transformNodes[47]
        var shoulderLeft = transformNodes[48]
        var shoulderRight = transformNodes[57]
        var kneeLeft = transformNodes[68]
        var kneeRight = transformNodes[73]

        var initialPositionHexagon = hexagonTwoEnd.position.clone();
        var initialColorHexagon = hexagonTwoEnd.material.diffuseColor.clone();
    }

    var animationShoulderLeftEnd = new BABYLON.Animation("EndGameAnimation_shoulderLeft", "rotation", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var animationShoulderRightEnd = new BABYLON.Animation("EndGameAnimation_shoulderRight", "rotation", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var animationPositionHexagonEnd = new BABYLON.Animation("EndGameAnimation_hexagonPosition", "position", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);


    var animationColorHexagonEnd = new BABYLON.Animation("EndGameAnimation_hexagonColor", "material.diffuseColor", 240, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var animationRotationEnd = new BABYLON.Animation("EndGameAnimation_rotation", "rotation", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var animationJumpEnd = new BABYLON.Animation("EndGameAnimation_jump", "position", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var animationEyeLeftEnd = new BABYLON.Animation("EndGameAnimation_eyeLeft", "position", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var animationEyeRightEnd = new BABYLON.Animation("EndGameAnimation_eyeRight", "position", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var animationKneeLeftEnd = new BABYLON.Animation("EndGameAnimation_kneeLeft", "rotation", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var animationKneeRightEnd = new BABYLON.Animation("EndGameAnimation_kneeRight", "rotation", 240, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var initialPosition = root['_position'];
    var initialPositionLeftEye = leftEye['_position'];
    var initialPositionRightEye = rightEye['_position'];


    animationPositionHexagonEnd.setKeys([
        { frame: 0, value: initialPositionHexagon },
        { frame: 120, value: new BABYLON.Vector3(initialPositionHexagon.x, initialPositionHexagon.y - 0.06, initialPositionHexagon.z) },
        { frame: 240, value: new BABYLON.Vector3(initialPositionHexagon.x, initialPositionHexagon.y - 0.12, initialPositionHexagon.z) },
        { frame: 360, value: new BABYLON.Vector3(initialPositionHexagon.x, initialPositionHexagon.y - 0.06, initialPositionHexagon.z) },
        { frame: 480, value: initialPositionHexagon },
        { frame: 600, value: new BABYLON.Vector3(initialPositionHexagon.x, initialPositionHexagon.y - 0.06, initialPositionHexagon.z) },
        { frame: 720, value: new BABYLON.Vector3(initialPositionHexagon.x, initialPositionHexagon.y - 0.12, initialPositionHexagon.z) },
        { frame: 840, value: new BABYLON.Vector3(initialPositionHexagon.x, initialPositionHexagon.y - 0.06, initialPositionHexagon.z) },
        { frame: 960, value: initialPositionHexagon }
    ]);

    animationColorHexagonEnd.setKeys([
        { frame: 0, value: initialColorHexagon },
        { frame: 120, value: new BABYLON.Color3(1, 0, 1) },
        { frame: 240, value: initialColorHexagon },
        { frame: 360, value: new BABYLON.Color3(1, 0, 0) },
        { frame: 480, value: initialColorHexagon },
        { frame: 600, value: new BABYLON.Color3(0, 1, 1) },
        { frame: 720, value: initialColorHexagon },
        { frame: 840, value: new BABYLON.Color3(1, 1, 0) },
        { frame: 960, value: initialColorHexagon }
    ]);

    animationKneeRightEnd.setKeys([
        { frame: 0, value: new BABYLON.Vector3(Math.PI / 16, Math.PI * 2, Math.PI * 5 / 3) },
        { frame: 240, value: new BABYLON.Vector3(Math.PI / 16, Math.PI * 2, Math.PI * 5 / 4) },
        { frame: 480, value: new BABYLON.Vector3(Math.PI / 16, Math.PI * 2, Math.PI * 11 / 6) },
        { frame: 720, value: new BABYLON.Vector3(Math.PI / 16, Math.PI * 2, Math.PI * 5 / 4) },
        { frame: 960, value: new BABYLON.Vector3(Math.PI / 16, Math.PI * 2, Math.PI * 5 / 3) }
    ]);

    animationKneeLeftEnd.setKeys([
        { frame: 0, value: new BABYLON.Vector3(Math.PI * 5 / 3, Math.PI * 2, 0) },
        { frame: 240, value: new BABYLON.Vector3(Math.PI * 5 / 4, Math.PI * 2, 0) },
        { frame: 480, value: new BABYLON.Vector3(Math.PI * 11 / 6, Math.PI * 2, 0) },
        { frame: 720, value: new BABYLON.Vector3(Math.PI * 5 / 4, Math.PI * 2, 0) },
        { frame: 960, value: new BABYLON.Vector3(Math.PI * 5 / 3, Math.PI * 2, 0) }
    ]);


    animationJumpEnd.setKeys([
        { frame: 0, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y, initialPosition.z) },
        { frame: 120, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.3, initialPosition.z) },
        { frame: 240, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.5, initialPosition.z) },
        { frame: 360, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.3, initialPosition.z) },
        { frame: 480, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y, initialPosition.z) },
        { frame: 600, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.3, initialPosition.z) },
        { frame: 720, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.5, initialPosition.z) },
        { frame: 840, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.3, initialPosition.z) },
        { frame: 960, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y, initialPosition.z) },
    ]);


    animationEyeLeftEnd.setKeys([
        { frame: 0, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y, initialPositionLeftEye.z) },
        { frame: 120, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y + 0.05, initialPositionLeftEye.z) },
        { frame: 240, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y + 0.1, initialPositionLeftEye.z) },
        { frame: 360, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y + 0.05, initialPositionLeftEye.z) },
        { frame: 480, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y, initialPositionLeftEye.z) },
        { frame: 600, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y - 0.05, initialPositionLeftEye.z) },
        { frame: 720, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y - 0.1, initialPositionLeftEye.z) },
        { frame: 840, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y - 0.05, initialPositionLeftEye.z) },
        { frame: 960, value: new BABYLON.Vector3(initialPositionLeftEye.x, initialPositionLeftEye.y, initialPositionLeftEye.z) },
    ]);


    animationEyeRightEnd.setKeys([
        { frame: 0, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y, initialPositionRightEye.z) },
        { frame: 120, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y + 0.05, initialPositionRightEye.z) },
        { frame: 240, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y + 0.1, initialPositionRightEye.z) },
        { frame: 360, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y + 0.05, initialPositionRightEye.z) },
        { frame: 480, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y, initialPositionRightEye.z) },
        { frame: 600, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y - 0.05, initialPositionRightEye.z) },
        { frame: 720, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y - 0.1, initialPositionRightEye.z) },
        { frame: 840, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y - 0.05, initialPositionRightEye.z) },
        { frame: 960, value: new BABYLON.Vector3(initialPositionRightEye.x, initialPositionRightEye.y, initialPositionRightEye.z) },
    ]);


    animationShoulderRightEnd.setKeys([
        { frame: 0, value: new BABYLON.Vector3(0, Math.PI, Math.PI * 3 / 2) },
        { frame: 150, value: new BABYLON.Vector3(0, Math.PI, Math.PI * 11 / 6) },
        { frame: 270, value: new BABYLON.Vector3(0, Math.PI, Math.PI * 7 / 4) },
        { frame: 390, value: new BABYLON.Vector3(0, Math.PI, Math.PI * 11 / 6) },
        { frame: 510, value: new BABYLON.Vector3(0, Math.PI, Math.PI * 3 / 2) },
        { frame: 630, value: new BABYLON.Vector3(0, Math.PI, Math.PI * 11 / 6) },
        { frame: 750, value: new BABYLON.Vector3(0, Math.PI, Math.PI * 7 / 4) },
        { frame: 960, value: new BABYLON.Vector3(0, Math.PI, Math.PI * 11 / 6) },
    ]);

    animationShoulderLeftEnd.setKeys([
        { frame: 0, value: new BABYLON.Vector3(0, Math.PI, 0) },
        { frame: 150, value: new BABYLON.Vector3(0, Math.PI, Math.PI / 3) },
        { frame: 270, value: new BABYLON.Vector3(0, Math.PI, Math.PI / 4) },
        { frame: 390, value: new BABYLON.Vector3(0, Math.PI, Math.PI / 3) },
        { frame: 510, value: new BABYLON.Vector3(0, Math.PI, 0) },
        { frame: 630, value: new BABYLON.Vector3(0, Math.PI, Math.PI / 3) },
        { frame: 750, value: new BABYLON.Vector3(0, Math.PI, Math.PI / 4) },
        { frame: 960, value: new BABYLON.Vector3(0, Math.PI, Math.PI / 3) }
    ]);

    animationRotationEnd.setKeys([
        { frame: 0, value: new BABYLON.Vector3(0, Math.PI * 2, 0) },
        { frame: 240, value: new BABYLON.Vector3(0, Math.PI * 3 / 2, 0) },
        { frame: 480, value: new BABYLON.Vector3(0, Math.PI, 0) },
        { frame: 720, value: new BABYLON.Vector3(0, Math.PI / 2, 0) },
        { frame: 960, value: new BABYLON.Vector3(0, 0, 0) }
    ]);

    shoulderRight.animations.push(animationShoulderRightEnd);
    shoulderLeft.animations.push(animationShoulderLeftEnd);
    kneeRight.animations.push(animationKneeRightEnd);
    kneeLeft.animations.push(animationKneeLeftEnd);
    pelvis.animations.push(animationRotationEnd);
    torso.animations.push(animationRotationEnd);
    root.animations.push(animationJumpEnd)
    chest.animations.push(animationRotationEnd);

    if (selectedPlayer === playerEnd) {
        hexagonEnd.animations.push(animationColorHexagonEnd);
        hexagonEnd.animations.push(animationPositionHexagonEnd);
    } else {
        hexagonTwoEnd.animations.push(animationColorHexagonEnd);
        hexagonTwoEnd.animations.push(animationPositionHexagonEnd);
    }
    leftEye.animations.push(animationEyeLeftEnd);
    rightEye.animations.push(animationEyeRightEnd);

    var animationGroupEndGame = new BABYLON.AnimationGroup("EndGameAnimationGroup");
    animationGroupEndGame.addTargetedAnimation(animationShoulderRightEnd, shoulderRight);
    animationGroupEndGame.addTargetedAnimation(animationShoulderLeftEnd, shoulderLeft);
    animationGroupEndGame.addTargetedAnimation(animationRotationEnd, pelvis)
    animationGroupEndGame.addTargetedAnimation(animationRotationEnd, torso)
    animationGroupEndGame.addTargetedAnimation(animationJumpEnd, root)
    animationGroupEndGame.addTargetedAnimation(animationKneeRightEnd, kneeRight)
    animationGroupEndGame.addTargetedAnimation(animationKneeLeftEnd, kneeLeft)
    animationGroupEndGame.addTargetedAnimation(animationRotationEnd, chest)
    if (selectedPlayer === playerEnd) {
        animationGroupEndGame.addTargetedAnimation(animationColorHexagonEnd, hexagonEnd)
        animationGroupEndGame.addTargetedAnimation(animationPositionHexagonEnd, hexagonEnd)
    } else {
        animationGroupEndGame.addTargetedAnimation(animationColorHexagonEnd, hexagonTwoEnd)
        animationGroupEndGame.addTargetedAnimation(animationPositionHexagonEnd, hexagonTwoEnd)
    }
    animationGroupEndGame.addTargetedAnimation(animationEyeLeftEnd, leftEye)
    animationGroupEndGame.addTargetedAnimation(animationEyeRightEnd, rightEye)

    animationGroupEndGame.loopAnimation = false;


    animationGroupEndGame.onAnimationGroupEndObservable.add(function (event) {
        animationGroupEndGame.start();
    });


    animationGroupEndGame.start();

    return animationGroupEndGame;
}

function spheresAnimation(sphere) {

    var animationSpherePosition = new BABYLON.Animation("AnimationSphere_position", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var animationSphereRotation = new BABYLON.Animation("ANimationSphere_rotation", "rotation", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    var initialPosition = sphere.position;

    animationSphereRotation.setKeys([
        { frame: 0, value: new BABYLON.Vector3(0, 0, 0) },
        { frame: 30, value: new BABYLON.Vector3(0, Math.PI / 2, 0) },
        { frame: 60, value: new BABYLON.Vector3(0, Math.PI, 0) },
        { frame: 90, value: new BABYLON.Vector3(0, Math.PI * 3 / 2, 0) },
        { frame: 120, value: new BABYLON.Vector3(0, Math.PI * 2, 0) }
    ]);


    animationSpherePosition.setKeys([
        { frame: 0, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y, initialPosition.z) },
        { frame: 15, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.2, initialPosition.z) },
        { frame: 30, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.3, initialPosition.z) },
        { frame: 45, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y + 0.2, initialPosition.z) },
        { frame: 60, value: new BABYLON.Vector3(initialPosition.x, initialPosition.y, initialPosition.z) }
    ]);

    sphere.animations.push(animationSpherePosition);
    sphere.animations.push(animationSphereRotation);

    var animationSphere = new BABYLON.AnimationGroup("AnimationSphereGroup");
    animationSphere.addTargetedAnimation(animationSpherePosition, sphere);
    animationSphere.addTargetedAnimation(animationSphereRotation, sphere);

    animationSphere.loopAnimation = false;


    animationSphere.onAnimationGroupEndObservable.add(function (event) {
        animationSphere.start();
    });


    animationSphere.start();

    return animationSphere;
}