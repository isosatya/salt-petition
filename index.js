const express = require("express");
const hb = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./utils/db");
const app = express();
const bc = require("./utils/bc");
var cookieSession = require("cookie-session");
const csurf = require("csurf");

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
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

// app.use(csurf()); //this is for protection of the malicious cookies
// //////////////////////      this is for security
// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken(); // --> include the csrfToken in every html FORM
//     res.setHeader("x-frame-options", "DENY");
//     next();
// });

/*
app.get("/cookie-test", (req, res) => {
    // session property comes from the middlware function (cookieSession) from above
    // req.session is an OBJECT
    // we are addibg a property to our cookie thats called cookie, with value "true"
    req.session.cookie = true;
    console.log("checking whats in my cookie", req.session);
    // res.redirect("/petition/signers");   // CHECK WHETHER THIS IS CORRECT --> this is the workaround for the empty cookie
    // every single route in my server(so every app.GET and app.POST will have this cookie)
});
*/

app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    });
});

app.post("/register", (req, res) => {
    // console.log("request body", req.body);
    var firstName = req.body.first;
    var lastName = req.body.last;
    var email = req.body.email;
    var password = req.body.password;

    bc.hashPassword(password).then(hash => {
        db.addUsers(firstName, lastName, email, hash).then(results => {
            req.session.usersId = results.rows[0].id;
            res.redirect("/petition");
        });
    });
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
            // console.log("return from email function", match.rows[0]);
            bc.checkPassword(password, match.rows[0].password)
                .then(doesMatch => {
                    if (doesMatch) {
                        // console.log("IM HERE -->    if (doesMatch) {");
                        // console.log(
                        //     "logging match.rows[0].id from email function",
                        //     match.rows[0].id
                        // );
                        db.viewSignature(match.rows[0].id).then(results => {
                            req.session.signatureId = results.rows[0].id;

                            console.log(
                                "I HAVE ASSIGNED THE req.session.signatureId = results.rows[0].id;",
                                req.session.signatureId
                            );
                            var imgUrl = results.rows[0].signature;
                            res.render("signed", {
                                layout: "main",
                                image: imgUrl
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
                    console.log("Error in the password function ->", err);
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

// 7 | Otto    | Gomez     | perinola@gmail.com | 12345 (password)

app.get("/petition", (req, res) => {
    if (req.session.signatureId) {
        db.viewSignature(req.session.signatureId).then(results => {
            console.log(
                "VALUE FOR req.session.signatureId",
                req.session.signatureId
            );
            // console.log("results at line 130 viewSignature", results.rows);

            var imgUrl = results.rows[0].signature;

            res.render("signed", {
                layout: "main",
                image: imgUrl
            });
        });
    } else {
        res.render("petition", {
            // csrfToken: req.csrfToken(),  --> dont put it here, because we put it in the middlware up there
            layout: "main"
        });
    }
});

app.post("/petition", (req, res) => {
    var usersId = req.session.usersId;
    var signatureUrl = req.body.signature;

    db.addSignature(usersId, signatureUrl).then(results => {
        req.session.signatureId = results.rows[0].id;
        res.redirect("/profile");
    });
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    var age = req.body.age;
    var city = req.body.city;
    var homepage = req.body.homepage;
    var usersId = req.session.usersId;

    db.addProfile(usersId, age, city, homepage).then(() => {
        res.redirect("/petition/signers");
    });

    // res.render("profile", {
    //     layout: "main"
    // });
});

app.get("/profile/edit", (req, res) => {
    console.log("req.session.signatureId", req.session.signatureId);
    if (req.session.signatureId) {
        db.editProfile(req.session.signatureId).then(results => {
            console.log("Profile edit information", results.rows);

            // res.render("profileedit", {
            //     layout: "main",
            //     profile: results.rows
            // });
        });
    }
});

app.get("/petition/signed", (req, res) => {
    if (req.session.signatureId) {
        db.viewSignature(req.session.signatureId).then(results => {
            // console.log("retrieving from the db", results.rows[0].signature);
            var imgUrl = results.rows[0].signature;
            // console.log(imgUrl);

            res.render("signed", {
                layout: "main",
                image: imgUrl
            });
        });
    } else {
        res.render("signed", {
            layout: "main",
            image: "/penguin.jpg",
            message: "Thanks for being cool!",
            id: "penguin"
        });
    }
});

app.post("/petition/signed", (req, res) => {
    res.clearCookie("session");
    res.clearCookie("session.sig");
    res.render("signed", {
        layout: "main",
        image: "/penguin.jpg",
        message: "Thanks for being cool!",
        id: "penguin"
    });
});

app.get("/petition/signers", (req, res) => {
    db.viewSigned().then(results => {
        // console.log("signers so far ", results.rows);
        res.render("signers", {
            layout: "main",
            signers: results.rows
        });
    });
});

app.get("/petition/signers/:city", (req, res) => {
    // console.log("parameters of the request by city page", req.params);
    const city = req.params.city;

    db.viewByCity(city).then(results => {
        // console.log("results from rows query   ", results.rows);
        res.render("signersByCity", {
            layout: "main",
            city,
            signers: results.rows
        });
    });
});

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/logout", (req, res) => {
    req.session = null; //CHECK IF THIS ACTUALLY WORKS
    res.redirect("/register");
});

app.listen(process.env.PORT || 8080, () => console.log("Im listening!!"));

/*
//POST route, because the query is modifying the database, and queries that modify
//databases must be done within POST routes

app.post("/add-city", (req, res) => {
    // this is not for the project, but just to show, because in the project
    // the values come from input fields
    db.addCity("Berlin", "DE").then(() => {
        res.redirect("/thank-you");
    });
});

*/

// storing the user ID in the cookie, so the user stays logged in (use req.session again)
// req.session.userId = 3, for example
// signatureId: 2 corresponds with ID from signatures-- NOT USERID!!
// userId: 3 corresponds with ID from USERS!!!
// {
//     signatureId:2,
//     userid
// }

/////////////////      PART 4        ///////////////////
// CREATE TABLE user_profiles(
//     user_id INTEGER NOT NULL REFERENCES (users.id) UNIQUE
//     id
//     city
//     age
//     url
// )
//
// {{#if url}}
// href = {{url}} - first and lastname as href url link
// {{else}}
// first and lastname as text only
// {{/if}}
//
// when they submit their form,
// the url in the profile form has to start with http:// or https:/ or just //
// we can either throw the url away, or prepend any of the 3 options from above
//
// app.get("/signers/:city") --> to use the city of the user as parameter
//
// i.e. /signers/berlin -> the same query as the /signers query, only that
// req.params.addCity
// dbgetSignersByCity(city).then() --> query with WHERE city = $1 --> city name
// in this query we have to make sure the capitalizatino is taken care of
// WHERE LOWER(city) = LOWER($1)

/////////////-----------------> PART 5 - UPSERTING
// promise.all([
//     db.updateuser(req.session.userId, req.body)
//     db.upsertuserprofile(req.session.userId, req.body)
//         ]).then(function() {})
//
//     db.updateuser(req.session.userId, req.body).then( () => db.upsertuserprofile(req.session.userId, req.body))
//         .then(function() {})
//
//
// for deleting the signature
// FORM METHOD = "POST" action="signature/delete" --> sending them to petition makes no sense (?)
//     input name "_csrf"
//     button Delete Signature
//
//
// for deleting the user, it has to be done in the right order (not users first, for example)
