-- now we set up the table we need for part 1 and 2

DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL
);

-- create TABLE
-- create db for the tables

-- how do we interact with our table in our code? so how do i tell my express
-- server to talk to my table

next steps for petition part 1

1- create the templates you need for petition, thank you page, and signers page
    - make it so the user can navigate to:
        + the /petition route and see the petition template+
        + the /petition/signed route to see the thank you template
        + and the /petition/signers to see the signers template

2- GET/petition
    - renders petition template (the one with input fields and the canvas element)
        + <form> tag needed!, becuase it will make POST requests to our servers, when the user
        clicks the "submit" button, input for first, input for last, and input for signature (in HIDDEN
            mode)
        + mouse down, mouse move, mouse up -> for the canvas signature, on javascript code
        + when the user signs the petition, we need to convert the canvas drasing into a URL that
        can be inserted into our table. That url should be assigned as the value of the hidden input field
        when the user finish signing the petition
        script.js is the JS code for the canvas and goes in public folder with styles.css

3- POST/petition
    runs when the user enters a first name, last name, and signs the canvas element, and then
    clicks the "submit" botton.
    Here we use an INSERT QUERY. Everytime the server gets a request, it must send a response (redirect
    to the thank you website). this is done with a PROMISE, so we get the SOLVE and THEN, where it redirects to
    the other website.
    Change this POST fuction, so it returns the id of the new signature and put it in the cookie
    log to see the id of the just made signature


4- GET /petition/signed
    renders the thank you template, thats it!
    We show the just signed signature from the user. We could use SQL (use last entry of table) but for
    a normal size website its not enough
    Here we use cookies, to remember that the user HAS SIGNED the petition. We cant put the signature URL in the
    cookie. Instead we use a reference to the signature, which is the ID (from SQL) posted in the database. But for
    this we need the COOKIE SESSION --> I have to add the cookie configuration
        first cookie
        {
            signatureId: 1
        }
        second cookie {
            aölsdjfaldksj : "aösdjflaksdfjl" --> hashed copy of the first cookie
        }
    we have to setup the cookie session, middelware (app.use)
    change this GET route, to get the users signature from the database and render it on the screen
    for the rendering of the signature, the the url and put it in the img tag

5- GET /petition/signers
    renders the signers templates


handlebars templates etc that we´ll need:

- petition template (the one with input fields)
- thank you template (thats the one that just says, "thank you signing", along with the # of signers
and a link to signers page)
- signers template (the one that lists everyone who has signed the petition so far)
- layout (our link to CSS, front-end JS will go here)
- (optional) partials for things like naviation bars

queries we´ll need:
- insert into signatures
    should be invoked when the user signs the petition (so the
    user gives us the firs, last and signature)

-select the name of the signers
    query that runs when the user goes to petition/signers page

-(optional) select

addSignature function (export it) (arguments from the array below)
return db.query("insert into signature(first, last etc)
values ($1, $2, $3)
returnig id;")
, [firstname, lastname, signatureUrl])

/////////////////////////////////////////////////////////////////////////////////////////////////////
