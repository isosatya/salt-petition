(function() {
    console.log("I am the front end javascript!!");

    var canvas = $("#canvas");
    var context = document.getElementById("canvas").getContext("2d");
    var doc = $(document);
    var sign = 0;

    canvas.on("mousedown", function(e) {
        e.preventDefault();
        e.stopPropagation();

        context.beginPath();
        context.moveTo(e.offsetX, e.offsetY);

        canvas.on("mousemove", function(e) {
            sign = 1;
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
        });
    });
    doc.on("mouseup", function(e) {
        e.preventDefault(e);
        canvas.off("mousemove");
    });

    var submit = $("#submit");
    submit.on("click", function(e) {
        if (sign == 1) {
            var signatureUrl = document.getElementById("canvas").toDataURL();
            $("#signature").val(signatureUrl);
        } else {
            e.preventDefault();
            $("#warning").text("Please include a signature");
        }
        // e.preventDefault();
    });

    var refresh = $("#refresh");
    refresh.on("click", function() {
        sign = 0;
        context.clearRect(0, 0, canvas.width(), canvas.height());
    });

    document.getElementById("first").value = "testing name value";
})();
