document.addEventListener("DOMContentLoaded", function () {
    let okButton = document.getElementById("okButton");

    if (okButton) {
        okButton.addEventListener("click", function () {
            console.log("OK button clicked, redirecting..."); // ✅ Debugging Log
            window.location.href = "login.html"; // ✅ Redirect to index.html
        });
    } else {
        console.error("OK button not found!");
    }
});
