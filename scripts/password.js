function authenticate(e) {
    if (e.keyCode == 13) {
        var database = firebase.database();
        var ref = database.ref("password");
        ref.once("value", function (data) {
            if (document.getElementById("password-input").value == data.val()) {
                console.log("Correct");
                document.getElementById('main').classList.remove("blur");
                document.getElementById('password').style.display = 'none';
                document.getElementById('footer').style.position = 'static';
                document.getElementById('header').style.position = 'static';
                updateStatus("Unlocked.", "#0abe0a");
            } else {
                console.log("False");
                updateStatus("Incorrect password.", "#ff4c4c");
            }
        });
    }
}

function updateStatus(message, color) {
    document.getElementById('header-status').innerHTML = message;
    document.getElementById('header-status').style.color = color;
}
