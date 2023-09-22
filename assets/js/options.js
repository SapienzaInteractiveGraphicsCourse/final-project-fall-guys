var mb = "Off";
var shadow = "Off";

// Call loadSettings() to load and apply settings when the page loads
loadSettings();

const defaultPlayerOneUsername = "Player One";
const defaultPlayerTwoUsername = "Player Two";
const playerOneUsername = localStorage.getItem("playerOne");
const playerTwoUsername = localStorage.getItem("playerTwo");

const playerOneInput = document.getElementById("playerOneUsername");
const playerTwoInput = document.getElementById("playerTwoUsername");

playerOneInput.placeholder = playerOneUsername || defaultPlayerOneUsername
playerTwoInput.placeholder = playerTwoUsername || defaultPlayerTwoUsername;

playerOneInput.value = playerOneUsername || defaultPlayerOneUsername;
playerTwoInput.value = playerTwoUsername || defaultPlayerTwoUsername;

// Function to load settings from localStorage
function loadSettings() {

    // Load other settings
    const loadedDifficulty = localStorage.getItem("difficulty") || "Normal";
    const loadedMap = localStorage.getItem("maps") || "Map-1";
    const loadedMotionBlur = localStorage.getItem("motion_blur") || "Off";
    const loadedTexture = localStorage.getItem("texture") || "Color";
    const loadedVolume = localStorage.getItem("volume") || 0.5;

    // Update UI elements with loaded settings
    document.getElementById('difficulty').innerHTML = loadedDifficulty;
    document.getElementById('maps').innerHTML = loadedMap;
    document.getElementById('motionBlur').innerHTML = loadedMotionBlur;
    document.getElementById('texture').innerHTML = loadedTexture;
    document.getElementById("volume").value = loadedVolume;
}

function decreaseDifficulty() {
    var diff = document.getElementById('difficulty').innerHTML;
    if (diff == "Normal") {
        document.getElementById('difficulty').innerHTML = "Easy";
    }
    if (diff == "Advanced") {
        document.getElementById('difficulty').innerHTML = "Normal";
    }
}
function increaseDifficulty() {
    var diff = document.getElementById('difficulty').innerHTML;
    if (diff == "Normal") {
        document.getElementById('difficulty').innerHTML = "Advanced";
    }
    if (diff == "Easy") {
        document.getElementById('difficulty').innerHTML = "Normal";
    }
}
function decreaseMap() {
    var map = document.getElementById('maps').innerHTML;
    if (map == "Map-2") {
        document.getElementById('maps').innerHTML = "Map-1";
    }
    if (map == "Map-3") {
        document.getElementById('maps').innerHTML = "Map-2";
    }
    if (map == "Map-4") {
        document.getElementById('maps').innerHTML = "Map-3";
    }
    if (map == "Map-5") {
        document.getElementById('maps').innerHTML = "Map-4";
    }
}
function increaseMap() {
    var map = document.getElementById('maps').innerHTML;
    if (map == "Map-4") {
        document.getElementById('maps').innerHTML = "Map-5";
    }
    if (map == "Map-3") {
        document.getElementById('maps').innerHTML = "Map-4";
    }
    if (map == "Map-2") {
        document.getElementById('maps').innerHTML = "Map-3";
    }
    if (map == "Map-1") {
        document.getElementById('maps').innerHTML = "Map-2";
    }
}
function changeMotion() {
    mb = document.getElementById('motionBlur').innerHTML;
    if (mb == "Off") {
        document.getElementById('motionBlur').innerHTML = "On";
    }
}
function changeMotionOn() {
    mb = document.getElementById('motionBlur').innerHTML;
    if (mb == "On") {
        document.getElementById('motionBlur').innerHTML = "Off";
    }
}
function textureOff(){
    texture = document.getElementById('texture').innerHTML;
    if (texture == "Stone"){
        document.getElementById('texture').innerHTML = "Wood";
    }
    if (texture == "Wood"){
        document.getElementById('texture').innerHTML = "Color";
    }
}

function textureOn(){
    texture = document.getElementById('texture').innerHTML;
    if (texture == "Color"){
        document.getElementById('texture').innerHTML = "Wood";
        }
    if (texture == "Wood"){
        document.getElementById('texture').innerHTML = "Stone";
         }
}

function getBack(){
    window.location.href = "index.html";    
}


function saveSettings() {
    const playerOneUsername = document.getElementById("playerOneUsername").value;
    const playerTwoUsername = document.getElementById("playerTwoUsername").value;

    localStorage.setItem(
        "playerOne",
        playerOneUsername || defaultPlayerOneUsername
    );
    localStorage.setItem(
        "playerTwo",
        playerTwoUsername || defaultPlayerTwoUsername
    );

    localStorage.setItem("difficulty", document.getElementById('difficulty').innerHTML);
    localStorage.setItem("maps", document.getElementById('maps').innerHTML);
    localStorage.setItem("motion_blur", document.getElementById('motionBlur').innerHTML);
    localStorage.setItem("texture", document.getElementById('texture').innerHTML);
    localStorage.setItem("volume", document.getElementById("volume").value);
    window.location.href = "index.html";
}



function resetSettings() {
    localStorage.setItem(
        "playerOne", defaultPlayerOneUsername
    );
    localStorage.setItem(
        "playerTwo", defaultPlayerTwoUsername
    );

    localStorage.setItem("difficulty", "Normal");
    localStorage.setItem("maps", "Map-1");
    localStorage.setItem("motion_blur", "On");
    localStorage.setItem("texture", "Color");
    localStorage.setItem("volume", 0.5);
    window.location.href = "index.html";
}
