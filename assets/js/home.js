function goToGame() {
    window.location.href = "game.html";
}

function goToGameTwo() {
    window.location.href = "game_two.html";
}

function goToOptions() {
    window.location.href = "options.html";
}

function goToTutorial() {
    window.location.href = "tutorial.html";
}

// Retrieve the record value from local web storage or use default value
var record = localStorage.getItem("record_one_player") || "0 seconds";

// Update the record element in the HTML
document.getElementById("record").textContent = record;