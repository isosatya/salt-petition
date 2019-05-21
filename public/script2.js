(function() {
    var submitButton = $("#submitprofile");
    console.log(submitButton);
    var age = $("#age");
    console.log("age.val()", age.val());

    submitButton.on("click", function(e) {
        if (age.val() > 99 || age.val() < 0) {
            e.preventDefault();
            alert("Age must be number between 0 and 99");
        }
        var homepage = document.getElementById("homepage").value;
        if (
            !(
                homepage.startsWith("http://") ||
                homepage.startsWith("https://") ||
                homepage == ""
            )
        ) {
            e.preventDefault();
            console.log("homepage", homepage);
            alert(`Homepage address must start with one of these values:

                https://
                http://
                `);
        }
    });
})();
