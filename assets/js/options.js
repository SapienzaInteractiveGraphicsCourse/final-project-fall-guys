var mb = "Off";
var shadow = "Off";

function decreaseDifficulty(){
    var diff = document.getElementById('difficulty').innerHTML;
    if (diff == "Normal"){
        document.getElementById('difficulty').innerHTML = "Easy";
    }
    if (diff == "Advanced"){
        document.getElementById('difficulty').innerHTML = "Normal";
    }
}
function increaseDifficulty(){
    var diff = document.getElementById('difficulty').innerHTML;
    if (diff == "Normal"){
        document.getElementById('difficulty').innerHTML = "Advanced";
    }
    if (diff == "Easy"){
        document.getElementById('difficulty').innerHTML = "Normal";
    }
}
function decreaseMap(){
    var map = document.getElementById('maps').innerHTML;
    if (map == "Map-2"){
        document.getElementById('maps').innerHTML = "Map-1";
    }
    if (map == "Map-3"){
        document.getElementById('maps').innerHTML = "Map-2";
    }
    if (map == "Map-4"){
        document.getElementById('maps').innerHTML = "Map-3";
    }
    if (map == "Map-5"){
        document.getElementById('maps').innerHTML = "Map-4";
    }
}
function increaseMap(){
    var map = document.getElementById('maps').innerHTML;
    if (map == "Map-4"){
        document.getElementById('maps').innerHTML = "Map-5";
    }
    if (map == "Map-3"){
        document.getElementById('maps').innerHTML = "Map-4";
    }
    if (map == "Map-2"){
        document.getElementById('maps').innerHTML = "Map-3";
    }
    if (map == "Map-1"){
        document.getElementById('maps').innerHTML = "Map-2";
    }
}
function changeMotion(){
    mb = document.getElementById('motionBlur').innerHTML;
    if (mb == "Off"){
        document.getElementById('motionBlur').innerHTML = "On";
        }
}
function changeMotionOn(){
    mb = document.getElementById('motionBlur').innerHTML;
    if (mb == "On"){
        document.getElementById('motionBlur').innerHTML = "Off";
    }
}
function textureOff(){
    texture = document.getElementById('texture').innerHTML;
    if (texture == "On"){
        document.getElementById('texture').innerHTML = "Off";
    }
}

function textureOn(){
    texture = document.getElementById('texture').innerHTML;
    if (texture == "Off"){
        document.getElementById('texture').innerHTML = "On";
        }
}

function getBack(){
    window.location.href = "index.html";    
}


function saveSettings(){
    localStorage.setItem("difficulty", document.getElementById('difficulty').innerHTML)
    localStorage.setItem("maps", document.getElementById('maps').innerHTML);
    localStorage.setItem("motion_blur", document.getElementById('motionBlur').innerHTML);
    localStorage.setItem("texture", document.getElementById('texture').innerHTML);
    localStorage.setItem("volume", document.getElementById("volume").value);
    window.location.href = "index.html";
}

function resetSettings(){
    localStorage.setItem("difficulty", "Normal");
    localStorage.setItem("maps", "Map-1");
    localStorage.setItem("motion_blur", "On");
    localStorage.setItem("texture", "Off");
    localStorage.setItem("volume", 0.5);
    window.location.href = "index.html";
}
