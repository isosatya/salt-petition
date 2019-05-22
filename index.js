//////////////////////////////////////// CONSTANTS AND MIDDLEWARES ///////////////////////////////////////////////

////////https://cool-petition.herokuapp.com/

const express = require("express");
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./utils/db");
const app = express();
exports.app = app;
const bc = require("./utils/bc");
var cookieSession = require("cookie-session");
const csurf = require("csurf");
const {
    requireUser,
    requireSignature,
    requireNoCookies
} = require("./routers/middleware");

app.use(cookieParser());

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(csurf());

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.setHeader(`X-FRAME-OPTIONS`, `DENY`);
    next();
});

////////////////////////////////////////////////////////// ROUTES ///////////////////////////////////////////////

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    db.login(email)
        .then(match => {
            bc.checkPassword(password, match.rows[0].password)
                .then(doesMatch => {
                    if (doesMatch) {
                        req.session.usersId = match.rows[0].id;
                        db.viewSignature(req.session.usersId)
                            .then(results => {
                                req.session.signatureId =
                                    results.rows[0].usersid;
                                var imgUrl = results.rows[0].signature;
                                res.render("signed", {
                                    layout: "main",
                                    image: imgUrl
                                });
                            })
                            .catch(err => {
                                console.log(
                                    "Error at the viewSignature query",
                                    err
                                );
                                res.render("petition", {
                                    layout: "main"
                                });
                            });
                    } else {
                        res.render("login", {
                            layout: "main",
                            error: "Password not correct",
                            email
                        });
                    }
                })
                .catch(err => {
                    console.log(
                        "Error at checkPasswordpassword function ->",
                        err
                    );
                    res.render("login", {
                        layout: "main",
                        error: "Error with the Password"
                    });
                });
        })
        .catch(err => {
            console.log("Error in email check function ->", err);
            res.render("login", {
                layout: "main",
                error: "E-mail not existent"
            });
        });
});

app.get("/register", requireUser, (req, res) => {
    res.render("register", {
        layout: "main"
    });
});

console.log("heroku!");

app.post("/register", (req, res) => {
    var firstName = req.body.first;
    var lastName = req.body.last;
    var email = req.body.email;
    var password = req.body.password;
    bc.hashPassword(password)
        .then(hash => {
            db.addUsers(firstName, lastName, email, hash)
                .then(results => {
                    req.session.usersId = results.rows[0].id;
                    res.redirect("/profile");
                })
                .catch(err => {
                    if (err.code == "23505") {
                        var text = "e-Mail already registered";
                    } else {
                        text = err.detail;
                    }
                    res.render("register", {
                        layout: "main",
                        err: text
                    });
                    console.log("Error at register page -->", err);
                });
        })
        .catch(err => {
            console.log("Error at hashPassword function", err);
        });
});

app.get("/profile", requireNoCookies, (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    var age = req.body.age;
    var city = req.body.city;
    var homepage = req.body.homepage;
    var usersId = req.session.usersId;

    db.addProfile(usersId, age, city, homepage)
        .then(() => {
            res.redirect("/petition");
        })
        .catch(err => {
            console.log("Error at addProfile query -->", err);
        });
});

app.get("/petition", requireNoCookies, requireSignature, (req, res) => {
    res.render("petition", {
        layout: "main"
    });
});

app.post("/petition", (req, res) => {
    var usersId = req.session.usersId;
    var signatureUrl = req.body.signature;

    db.addSignature(usersId, signatureUrl)
        .then(() => {
            req.session.signatureId = usersId;
            res.redirect("/petition/signed"); /////////////////////////////// ERROR
        })
        .catch(err => {
            console.log("Error at the addSignature query", err);
        });
});

app.get("/petition/signed", requireNoCookies, (req, res) => {
    db.viewSignature(req.session.signatureId)
        .then(results => {
            var imgUrl = results.rows[0].signature;
            res.render("signed", {
                layout: "main",
                image: imgUrl
            });
        })
        .catch(err => {
            console.log("Error at the viewSignature query", err);
        });
});

app.post("/petition/signed", (req, res) => {
    if (req.body.delete == "true") {
        db.deleteSignature(req.session.usersId)
            .then(() => {
                console.log(
                    `Signature for user ${req.session.usersId} DELETED`
                );
                delete req.session.signatureId;
                res.redirect("/petition");
            })
            .catch(err => {
                console.log("Error at deleteSignature query -->", err);
            });
    } else if (req.body.logout == "true") {
        req.session = null;
        res.redirect("/register");
    } else if (req.body.deleteaccount == "true") {
        db.deleteSignature(req.session.usersId)
            .then(() => {
                db.deleteProfile(req.session.usersId)
                    .then(() => {
                        db.deleteUsers(req.session.usersId)
                            .then(() => {
                                req.session = null;
                                res.redirect("/register");
                            })
                            .catch(err =>
                                console.log("Error at deleteUsers query", err)
                            );
                    })
                    .catch(err =>
                        console.log("Error at deleteProfile query", err)
                    );
            })
            .catch(err => {
                console.log("Error at deleteSignature query -->", err);
            });
    }
});

app.get("/profile/edit", requireNoCookies, (req, res) => {
    db.editProfile(req.session.usersId)
        .then(results => {
            res.render("profileedit", {
                layout: "main",
                profile: results.rows
            });
        })
        .catch(err => {
            console.log("Error at editProfile query -->", err);
        });
});

app.post("/profile/edit", (req, res) => {
    if (req.body.password != "") {
        bc.hashPassword(req.body.password)
            .then(hash => {
                db.updateUsers(
                    req.body.usersid,
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hash
                );
            })
            .then(
                db.updateProfile(
                    req.body.usersid,
                    req.body.age,
                    req.body.city,
                    req.body.homepage
                )
            )
            .then(() => {
                console.log("UPDATE OF PROFILE W/ Password SUCCESSFULL");
                res.redirect("/petition/signed");
            })
            .catch(err => {
                console.log("Error at updating profile with password -->", err);
            });
    } else {
        db.updateUsersNoPass(
            req.body.usersid,
            req.body.first,
            req.body.last,
            req.body.email
        )
            .then(() => {
                db.updateProfile(
                    req.body.usersid,
                    req.body.age,
                    req.body.city,
                    req.body.homepage
                );
            })
            .then(() => {
                console.log("UPDATE OF PROFILE Without Password SUCCESSFULL");
                res.redirect("/petition/signed");
            })
            .catch(err => {
                console.log(
                    "Error at updating profile withOUT password -->",
                    err
                );
            });
    }
});

app.get("/petition/signers", requireNoCookies, (req, res) => {
    db.viewSigned()
        .then(results => {
            res.render("signers", {
                layout: "main",
                signers: results.rows
            });
        })
        .catch(err => console.log("Error at viewSigned query -->", err));
});

app.get("/petition/signers/:city", requireNoCookies, (req, res) => {
    const city = req.params.city;
    if (city == "Berlin") {
        var photo = "berghain";
    } else {
        photo = "oktoberfest";
    }
    db.viewByCity(city)
        .then(results => {
            res.render("signersByCity", {
                layout: "main",
                city,
                photo,
                signers: results.rows
            });
        })
        .catch(err => console.log("Error at the viewByCity query -->", err));
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log("Im listening new file!!")
    );
}
