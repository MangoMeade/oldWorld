var button = document.getElementById("submit");

    button.addEventListener("click", function() {

    var text = document.getElementById("address").value;

    if (typeof(Storage) !== "undefined") {
        // Store
        sessionStorage.setItem("geo", text);
        // Retrieve
        document.getElementById("result").innerHTML = sessionStorage.getItem("geo");
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
    });