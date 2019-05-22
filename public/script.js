(function() {
    console.log("I am the front end javascript!!");

    var canvas = $("#canvas");
    var context = document.getElementById("canvas").getContext("2d");
    var doc = $(document);

    canvas.on("mousedown", function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log(e);

        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);

        canvas.on("mousemove", function(e) {
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
        });
    });
    doc.on("mouseup", function(e) {
        e.preventDefault(e);
        canvas.off("mousemove");
    });

    var submit = $("#submitsignature");
    submit.on("click", function() {
        var signatureUrl = document.getElementById("canvas").toDataURL();
        console.log("signatureURL", signatureUrl);
        $("#signature").val(signatureUrl);
    });

    var refresh = $("#refresh");
    refresh.on("click", function() {
        sign = 0;
        context.clearRect(0, 0, canvas.width(), canvas.height());
    });

    // var submitButton = document.getElementById("submitprofile");
    // console.log(submitButton);
    // submitButton.on("click", function() {
    //     console.log("I PRESSED SUBMIT BUTTON");
    // });
})();
