module.exports = {
    requireUser,
    requireSignature,
    requireNoCookies
};

function requireNoCookies(req, res, next) {
    if (!req.session.usersId) {
        res.redirect("/register");
    } else {
        next();
    }
}

function requireUser(req, res, next) {
    if (req.session.usersId) {
        res.redirect("/petition");
    } else {
        next();
    }
}

function requireSignature(req, res, next) {
    if (req.session.usersId && req.session.signatureId) {
        res.redirect("/petition/signed");
    } else {
        next();
    }
}
