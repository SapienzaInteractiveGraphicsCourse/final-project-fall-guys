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
const physicsPlugin = new BABYLON.OimoJSPlugin();// Use the Cannon.js physics engine
const g = 9.81;

//MESHES
let player = null;
let hexagon = null;
let sphere1 = null;
let sphere2 = null;
var platform = null;
var loaded = false;
let bubbleSphere = null;

let playerEnd = null;

//FPS
const options = new BABYLON.SceneOptimizerOptions();
let divFps = document.getElementById("fps");

//STORE TUPLES OF HEXAGONS WITH HIS COLLIDE BOX
let hexagonsMap = [];
const LUCKY_VALUE = 0.99;
let invicible = false;

//STORING KEY PRESSED
const keyStatus = { 87: false, 65: false, 83: false, 68: false };
const INVICIBILITY_TIME = 7000;

//SPEED OF MOVEMENT
var movementAmount = 0.04; // Adjust the movement speed as needed
var rotationAmount = 0.04; // Adjust the movement speed as needed

//PLAYER STATIC DIMENSION OF COLLIDE BOX
var playerCollisionBoxDimensions = new BABYLON.Vector3(0.6, 0.8, 0.4);
var playerCollisionBoxPosition = new BABYLON.Vector3(0.63, 0.2, 1.6);

//START POSITION OF PLAYER
var targetPosition = new BABYLON.Vector3(-15, 150, -15);
var targetPosition2 = new BABYLON.Vector3(-1, 8.6, -11.5);

//STATIC DIMENSION OF HEXAGON COLLIDE BOX
var hexagonCollisionBoxDimensions = new BABYLON.Vector3(2.0, 0.5, 1.75);

//LISTENER FOR MIVEMENTS
configure_movement_listeners();



const createScene = async function () {
    BabylonEngine.displayLoadingUI();

    /*-----END GAME SCENE-----*/

    const scene2 = new BABYLON.Scene(BabylonEngine);
    // Optimizer
    var optimizer2 = new BABYLON.SceneOptimizer(scene2, options);

    const camera2 = new BABYLON.ArcRotateCamera("Camera2", Math.PI / 2, Math.PI / 4, 10, new BABYLON.Vector3(0, 0, 0), scene2);
    // Set the camera position and target
    camera2.setPosition(new BABYLON.Vector3(5, 10, -15));
    camera2.setTarget(new BABYLON.Vector3(-20, 10, 0));
    // Attach camera controls to the canvas
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

    var textblockEnd2 = create_end_text("Your Score: 0 Seconds", 2);
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
        onButtonClick("game.html"); // Pass parameters to the click event function
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
    let [playerScene2, hexagonScene2] = await Promise.all([
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.player.Url, "player.glb", scene2),
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.hexagon.Url, "hexagon.glb", scene2)
    ])

    // Detach the meshes from their parent nodes
    let hexagonEnd = hexagonScene2["meshes"][0]._children[0];
    hexagonEnd.material = generate_material_with_random_color(scene2, "HexagonEnd");
    hexagonEnd.parent = null;

    // Create the hexagon mesh

    // Set the position of the hexagon and player to the same vector
    hexagonEnd.position.copyFrom(targetPosition2);
    hexagonEnd.scaling = new BABYLON.Vector3(2, 2, 1); // Scale the player mesh by a factor of 2 along all axes

    playerEnd = playerScene2["meshes"][0];
    playerEnd.position.copyFrom(targetPosition2);
    playerEnd.position.z += 3.0;
    playerEnd.position.x += 1.0;
    playerEnd.position.y += 0.06;

    transformNodes = playerEnd._scene.transformNodes;
    chest = transformNodes[3];
    pelvis = transformNodes[25];
    torso = transformNodes[36];


    chest.rotation.y -= 1.2;
    pelvis.rotation.y -= 1.2;
    torso.rotation.y -= 1.2;
    chest.rotation = chest.rotation.clone();
    pelvis.rotation = pelvis.rotation.clone();
    torso.rotation = torso.rotation.clone();

    playerEnd.scaling = new BABYLON.Vector3(2, 2, 2); // Scale the player mesh by a factor of 2 along all axes



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

    //CAMERA CONFIGURATION
    const camera = configure_camera(scene);


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
    let [playerScene, platformScene, hexagonScene, sphere1Scene, sphere2Scene] = await Promise.all([
        BABYLON.SceneLoader.ImportMeshAsync("", Assets.models.player.Url, "player.glb", scene),
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

    player = playerScene["meshes"][0];
    player.position.copyFrom(targetPosition);
    player.position.y += 0.14;
    player.position.x += 0.5;
    player.position.z -= 1.6;
    camera.lockedTarget = player;

    // Create a sphere
    bubbleSphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 3 }, scene);

    // Create a material for the sphere
    let bubbleMaterial = new BABYLON.StandardMaterial('bubbleMaterial', scene);
    bubbleMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1); // Blueish color
    bubbleMaterial.alpha = 0.3; // Set transparency
    bubbleMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Disable specularity
    bubbleMaterial.backFaceCulling = false; // Show both sides of the sphere

    // Apply the material to the sphere
    bubbleSphere.material = bubbleMaterial;

    // Parent the sphere to the player object
    bubbleSphere.parent = player;

    // Set the position of the sphere relative to the player's coordinate system
    bubbleSphere.position = new BABYLON.Vector3(0.65, 1.4, 1.5);

    // Set initial visibility to true
    bubbleSphere.isVisible = false;

    // Create custom collision boxes based on the defined dimensions and positions
    var playerCollisionBox = BABYLON.MeshBuilder.CreateBox("playerCollisionBox", { width: playerCollisionBoxDimensions.x, height: playerCollisionBoxDimensions.y, depth: playerCollisionBoxDimensions.z }, scene);
    playerCollisionBox.parent = player;
    playerCollisionBox.position.copyFrom(playerCollisionBoxPosition);

    // Set the visibility of the collision boxes to false
    playerCollisionBox.isVisible = false;

    // Setup keyframes animations
    playerNodes = playerScene["transformNodes"];
    shoulderRight = playerNodes[17]
    shoulderLeft = playerNodes[8]

    var animationShoulderRight = new BABYLON.Animation("rotationAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    animationShoulderRight.setKeys([
        { frame: 0, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) },
        { frame: 5, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI * 140 / 180) },
        { frame: 10, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) },
        { frame: 15, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI * 220 / 180) },
        { frame: 20, value: new BABYLON.Vector3(0, -Math.PI / 2, -Math.PI) }
    ]);
    var animationShoulderLeft = new BABYLON.Animation("rotationAnimation", "rotation", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    animationShoulderLeft.setKeys([
        { frame: 0, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) },
        { frame: 5, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI * 220 / 180) },
        { frame: 10, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) },
        { frame: 15, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI * 140 / 180) },
        { frame: 20, value: new BABYLON.Vector3(0, Math.PI / 2, Math.PI) }
    ]);
    shoulderRight.animations.push(animationShoulderRight);
    shoulderLeft.animations.push(animationShoulderLeft);
    var animationGroupW = new BABYLON.AnimationGroup("rotationAnimationGroup");
    animationGroupW.addTargetedAnimation(animationShoulderRight, shoulderRight);
    animationGroupW.addTargetedAnimation(animationShoulderLeft, shoulderLeft);


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
                startTimer(); // Start the timer after the countdown
            }, 2000); // Wait for 2 seconds before starting the game
        }
    }, 1000); // Update the countdown every second

    var timerPanel = new BABYLON.GUI.StackPanel();
    timerPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(timerPanel);

    var startTime = 0;
    var timerText = create_time_text();
    timerPanel.addControl(timerText);

    function startTimer() {
        startTime = performance.now();
        updateTimer();
    }

    function updateTimer() {
        var elapsedTime = (performance.now() - startTime) / 1000;
        var minutes = Math.floor(elapsedTime / 60);
        var seconds = Math.floor(elapsedTime % 60);
        var timeString = "Time survived: ";
        if (minutes > 0) {
            timeString += minutes + " minute" + (minutes > 1 ? "s" : "") + " ";
        }
        timeString += seconds + " second" + (seconds > 1 ? "s" : "");
        timerText.text = timeString;
        requestAnimationFrame(updateTimer);
    }

    /* CHANGE SCENE */

    var scenes = [];
    scenes.push(scene);
    scenes.push(scene2);

    var currentScene = scene;


    //DYNAMIC OF GAME

    // Register a collision function for the player and hexagon collision boxes
    scene.registerBeforeRender(function () {
        if (panel.isVisible) return;

        //HANDLE END GAME
        if (player.position.y < 80) {
            BabylonEngine.stopRenderLoop();

            currentScene = scene2;
            cancelAnimationFrame(updateTimer);

            var elapsedTime = (performance.now() - startTime) / 1000;
            var minutes = Math.floor(elapsedTime / 60);
            var seconds = Math.floor(elapsedTime % 60);
            var timeString = ""
            if (minutes > 0) {
                timeString += minutes + " minute" + (minutes > 1 ? "s" : "") + " ";
            }
            timeString += seconds + " second" + (seconds > 1 ? "s" : "");


            // Retrieve the record value from local web storage or use default value
            var currentRecord = localStorage.getItem("record_one_player") || "0 seconds";
            localStorage.setItem("score_one_player", timeString);


            textblockEnd2.text = "Your score: " + timeString;

            // Compare the time values in seconds
            var currentTimeInSeconds = convertTimeStringToSeconds(timeString);
            var currentRecordInSeconds = convertTimeStringToSeconds(currentRecord);

            if (currentTimeInSeconds > currentRecordInSeconds) {
                // Update the new record in local storage
                localStorage.setItem("record_one_player", timeString);
            }

            soundtrack.stop();
            endgametrack.play();


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
            if (!hexagonReal.isDisposed() && playerCollisionBox.intersectsMesh(hexagonBox, true)) {
                var currentVelocity = player.physicsImpostor.getLinearVelocity().clone();
                player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, Math.ceil(Math.abs(currentVelocity.y)) * 0.7, 0));
                if (!collided && !invicible) {
                    hexagonsMap[i][2] = true;
                    hexagon_pressed(hexagonReal);
                    if (currentSphere != null) {
                        currentSphere.dispose();
                        if (currentSphereType == 1) {
                            sphere1Sound.play();
                            setTimeout(endSphereSound1, 1000); // Call after 2 seconds
                            invicible = true;
                            bubbleSphere.isVisible = true;
                            setTimeout(finishInvicibility, INVICIBILITY_TIME); // Call after 2 seconds
                        } else {
                            sphere2Sound.play();
                            setTimeout(endSphereSound2, 2000); // Call after 2 seconds
                            player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(Math.random() * 40 - 20, 16, Math.random() * 40 - 20));
                        }
                    }
                }
            }

            if (collided) {
                if (life == 0 && hexagonBox != undefined) {
                    dispose_hexagons(hexagonBox, hexagonReal)
                } else {
                    hexagonsMap[i][3] = life - 1;
                }
            }
        }

        // If W is pressed, start movement of shoulders
        if (keyStatus[87] || keyStatus[83] || keyStatus[65] || keyStatus[68]) {
            animationGroupW.start();
        }
    }
    );

    return currentScene;
};

// Function to handle button click in the first banner
function onButtonClick(name) {
    window.location.href = name;
}



// Function to convert time in "X minutes Y seconds" format to seconds
function convertTimeStringToSeconds(timeString) {
    var timeArray = timeString.split(" ");
    var minutes;
    var seconds;
    if (timeArray.length == 4) {
        minutes = parseInt(timeArray[0]) || 0;
        seconds = parseInt(timeArray[2]) || 0;
    } else {
        minutes = 0;
        seconds = parseInt(timeArray[0]) || 0;
    }
    return minutes * 60 + seconds;
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
    hexagon.animations.push(animationHexagon);
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

function create_time_text() {
    var timerText = new BABYLON.GUI.TextBlock();
    timerText.text = "Time survived: 0 seconds";
    timerText.height = "100px";
    timerText.color = "white";
    timerText.fontFamily = "Comic Sans MS"; // Use the desired font family
    timerText.outlineColor = "#9a84be"; // Set the outline color
    timerText.outlineWidth = 10; // Set the outline width
    timerText.fontSize = 50;
    return timerText;
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

    hexagonsMap.push([hexagon, hexagonCollisionBox, false, 60, sphere, type])

}

function add_physic(scene) {
    player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0, friction: 0 }, scene);
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
function configure_camera(scene) {
    var fov = localStorage.getItem("camera_fov") || 120;
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

function rotatePlayer(direction) {
    transformNodes = player._scene.transformNodes
    chest = transformNodes[3]
    pelvis = transformNodes[25]
    torso = transformNodes[36]
    if (direction == 'right') {
        chest.rotation.y -= 0.03
        pelvis.rotation.y -= 0.03
        torso.rotation.y -= 0.03
    } else {
        chest.rotation.y += 0.03
        pelvis.rotation.y += 0.03
        torso.rotation.y += 0.03
    }
    chest.rotation = chest.rotation.clone()
    pelvis.rotation = pelvis.rotation.clone()
    torso.rotation = torso.rotation.clone()
}


function move_player() {
    if (player == null) return;
    if (keyStatus[87]) {
        // 'W' key or up arrow key
        player.position.z -= movementAmount;
    }
    if (keyStatus[65]) {
        rotatePlayer('left')
        // 'A' key or left arrow key
        player.position.x += movementAmount;
    }

    if (keyStatus[83]) {
        // 'S' key or down arrow key
        player.position.z += movementAmount;
    }

    if (keyStatus[68]) {
        // 'D' key or right arrow key
        rotatePlayer('right');
        player.position.x -= movementAmount;
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