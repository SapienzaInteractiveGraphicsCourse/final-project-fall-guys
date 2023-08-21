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
}
function increaseMap(){
    var map = document.getElementById('maps').innerHTML;
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
function shadowOff(){
    shadow = document.getElementById('shadow').innerHTML;
    if (shadow == "On"){
        document.getElementById('shadow').innerHTML = "Off";
    }
}

function shadowOn(){
    shadow = document.getElementById('shadow').innerHTML;
    if (shadow == "Off"){
        document.getElementById('shadow').innerHTML = "On";
        }
}


function saveSettings(){
    localStorage.setItem("motion_blur", document.getElementById('motionBlur').innerHTML);
    localStorage.setItem("shadow", document.getElementById('shadow').innerHTML);
    localStorage.setItem("maps", document.getElementById('maps').innerHTML);
    localStorage.setItem("volume", document.getElementById("volume").value);
    window.location.href = "game.html";
}
