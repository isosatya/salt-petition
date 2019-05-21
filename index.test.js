const supertest = require("supertest");
const { app } = require("./index");

// here we require the fake cookie session, the one that lives in the mocks directory
const cookieSession = require("cookie-session");

//
// test("GET /home returns an h1 as response", () => {
//     return supertest(app)
//         .get("/home")
//         .then(res => {
//             // res represents the response I´m getting from the server
//             // console.log("res: -->", res);
//             console.log("headers: -->", res.headers);
//             expect(res.statusCode).toBe(200);
//             expect(res.text).toBe("<h1>home</h1>");
//             expect(res.headers["content-type"]).toContain("text/html");
//         });
// });

// the 3 main properties of RES that we will be interested in are:
//
//     1- text. --> gives us the BODY of the response
//
//     2- headers. --> gives us the headers that were sent as part of the response
//
//     3- statusCode. --> gives us status code of the response

// test("GET /home with no cookies causes me to be redirected", () => {
//     return supertest(app)
//         .get("/home")
//         .then(res => {
//             // i want to check if im actually being redirected. Options are:
//             // 1. if we get statusCode 302 --> implies being redirected
//             // 2. header called "location"
//             console.log("location header:   ", res.headers.location);
//             expect(res.statusCode).toBe(302);
//             expect(res.headers.location).toBe("/register");
//         });
// });

// test("GET /home requests sends h1 as response when WHATEVER cookie is sent", () => {
//     // we mock the npm packages that we have to use but did not create ourselves
//     // mockSession can be used for multiple tests
//     // mockSessionOnce can be used only for one test
//     // a fake cookie (i.e. req.session)
//     cookieSession.mockSessionOnce({
//         whatever: true
//     });
//     // so now when we use supertest to make our request to the server, the fake cookie will automatically be sent
//     // along with the request (without us telling it to do so)
//
//     return supertest(app)
//         .get("/home")
//         .then(res => {
//             console.log("body of the response", res.text);
//         });

test('POST /welcome should set "submitted" cookie', () => {
    // we will need to work with mockSessionOnce if we want to:
    // 1) send a test/dummy cookie as part of the REQUEST we make the server
    // 2) if we ned to see the cookie we receive as part of the response. In other words, if we need to check
    // that a cookie has been set, when we´ll need mockSession / mockSessionOnce

    //send over an empty cookie as part of the REQUEST i make so the server has an empty cookie to input
    // data into. in this case "data" refers to {submitted : true}
    const obj = {};
    cookieSession.mockSessionOnce(obj);

    //nex step is to use supertest to make POST request
    return supertest(app)
        .post("/welcome")
        .then(res => {
            // obj is the cookie that my server wrote data to
            console.log("obj:  ", obj);
            expect(obj).toEqual({
                submitted: true
            });
        });
});

// SYNTAX FOR MOCKING THE QUERIES FOR THE BONUS EXERCISE
jest.mock("./utils/db"); //--> only once up at the beginnig
