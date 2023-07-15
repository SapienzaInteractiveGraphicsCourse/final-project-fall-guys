function goToGame() {
    window.location.href = "game.html";
}
function goToOptions() {
    window.location.href = "options.html";
}

// Retrieve the record value from local web storage or use default value
var record = localStorage.getItem("record_one_player") || "0 seconds";

// Update the record element in the HTML
document.getElementById("record").textContent = record;