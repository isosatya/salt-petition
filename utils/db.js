// spicedPg setup

const spicedPg = require("spiced-pg");
let secrets;

// process.env.NODE_ENV === "production"
//     ? (secrets = process.env)
//     : (secrets = require(`./secrets.json`));

const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-petition`;

var db = spicedPg(dbUrl);

// database queries

module.exports.addUsers = function addUsers(
    firstName,
    lastName,
    email,
    password
) {
    return db.query(
        `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
    `,
        [firstName, lastName, email, password]
    );
};

module.exports.updateUsers = function updateUsers(
    usersid,
    firstName,
    lastName,
    email,
    password
) {
    return db.query(
        `
        UPDATE users SET first = $2, last = $3, email = $4, password = $5 WHERE id = $1
    `,
        [usersid, firstName, lastName, email, password]
    );
};

module.exports.updateUsersNoPass = function updateUsersNoPass(
    usersid,
    firstName,
    lastName,
    email
) {
    return db.query(
        `
        UPDATE users SET first = $2, last = $3, email = $4 WHERE id = $1
    `,
        [usersid, firstName, lastName, email]
    );
};

module.exports.deleteUsers = function deleteUsers(usersid) {
    return db.query(
        `
        DELETE FROM users WHERE id = $1

        `,
        [usersid]
    );
};

module.exports.addSignature = function addSignature(usersid, signatureUrl) {
    return db.query(
        `
        INSERT INTO signatures (usersid, signature)
        VALUES ($1, $2)
    `,
        [usersid, signatureUrl]
    );
};

module.exports.deleteSignature = function deleteSignature(usersid) {
    return db.query(
        `
        DELETE FROM signatures WHERE usersid = $1

        `,
        [usersid]
    );
};

module.exports.login = function login(logEmail) {
    return db.query(`SELECT id, email, password FROM users WHERE email = $1;`, [
        logEmail
    ]);
};

module.exports.viewSignature = function viewSignature(id) {
    return db.query(
        `SELECT usersid, signature FROM signatures WHERE usersid = $1;`,
        [id]
    );
};

module.exports.addProfile = function addProfile(usersId, age, city, homepage) {
    return db.query(
        `
        INSERT INTO profiles (usersid, age, city, homepage)
        VALUES ($1, $2, $3, $4);
    `,
        [usersId, age, city, homepage]
    );
};

module.exports.editProfile = function editProfile(id) {
    return db.query(
        `
        SELECT users.id, users.first, users.last, users.email, profiles.usersid, profiles.age, profiles.city, profiles.homepage, signatures.usersid
        FROM users
        INNER JOIN profiles
            ON users.id = profiles.usersid
        INNER JOIN signatures
            ON users.id = signatures.usersid
        WHERE users.id = $1
        `,
        [id]
    );
};

module.exports.deleteProfile = function deleteProfile(usersid) {
    return db.query(
        `
        DELETE FROM profiles WHERE usersid = $1

        `,
        [usersid]
    );
};

module.exports.updateProfile = function updateProfile(
    usersid,
    age,
    city,
    homepage
) {
    return db.query(
        `
        INSERT INTO profiles (usersid, age, city, homepage)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (usersid)
        DO UPDATE SET age = $2, city = $3, homepage = $4;
    `,
        [usersid, age, city, homepage]
    );
};

module.exports.viewSigned = function viewSigned() {
    return db.query(`
        SELECT users.id, users.first, users.last, profiles.usersid, profiles.age, profiles.city, profiles.homepage, signatures.usersid
        FROM users
        INNER JOIN profiles
            ON users.id = profiles.usersid
        INNER JOIN signatures
            ON users.id = signatures.usersid;
        `);
};

module.exports.viewByCity = function viewByCity(city) {
    return db.query(
        `
        SELECT users.id, users.first, users.last, profiles.usersid, profiles.age,
        profiles.homepage, signatures.usersid
        FROM profiles
        INNER JOIN users
            ON profiles.usersid = users.id
        INNER JOIN signatures
            ON profiles.usersid = signatures.usersid
        WHERE $1 = profiles.city;
        `,
        [city]
    );
};

// SQL injections are malicious attacks

// database queries
