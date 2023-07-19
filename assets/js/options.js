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
    var mb = document.getElementById('motionBlur').innerHTML;
    if (mb == "Off"){
        document.getElementById('motionBlur').innerHTML = "On";
    }
}
function changeMotionOn(){
    var mb = document.getElementById('motionBlur').innerHTML;
    if (mb == "On"){
        document.getElementById('motionBlur').innerHTML = "Off";
    }
}
function decreaseShadow(){
    var shadow = document.getElementById('shadow').innerHTML;
    if (shadow == "Medium"){
        document.getElementById('shadow').innerHTML = "Low";
    }
    if (shadow == "High"){
        document.getElementById('shadow').innerHTML = "Medium";
    }
}
function increaseShadow(){
    var shadow = document.getElementById('shadow').innerHTML;
    if (shadow == "Low"){
        document.getElementById('shadow').innerHTML = "Medium";
    }
    if (shadow == "Medium"){
        document.getElementById('shadow').innerHTML = "High";
    }
}