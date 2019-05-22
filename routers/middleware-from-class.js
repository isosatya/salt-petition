module.exports = {
    requireNoSignature // with this syntax we can export more than one function at the same time, by addina comma
};

function requireSignature(req, res, next) {
    // next is a function that we have to call in every single middlware function we write
    if (req.session.signatureId) {
        // if signatureId exists, this block will run
        res.redirect("/petition/signed"); // this is my thank you route
    } else {
        next();
    }
}

function requireSignAndUser(req, res, next) {
    // next is a function that we have to call in every single middlware function we write
    if (req.session.signatureId && req.session.usersId) {
        // if signatureId exists, this block will run
        res.redirect("/petition/signed"); // this is my thank you route
    } else {
        next();
    }
}




Users who are logged out are redirected to the registration page when they attempt to go to the petition page

Users who are logged in are redirected to the petition page when they attempt to go to either the registration
page or the login page

Users who are logged in and have signed the petition are redirected to the thank you page when they attempt to
go to the petition page or submit a signature

Users who are logged in and have not signed the petition are redirected to the petition page when they attempt
to go to either the thank you page or the signers page
