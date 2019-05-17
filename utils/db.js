// spicedPg setup

const spicedPg = require("spiced-pg");

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

module.exports.addSignature = function addSignature(usersId, signatureUrl) {
    return db.query(
        `
        INSERT INTO signatures (usersid, signature)
        VALUES ($1, $2)
        RETURNING id;
    `,
        [usersId, signatureUrl]
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
    return (
        db.query(`
        SELECT users.id, users.first, users.last, profiles.usersid, profiles.age, profiles.city, profiles.homepage, signatures.usersid
        FROM users
        INNER JOIN profiles
            ON users.id = profiles.usersid
        INNER JOIN signatures
            ON users.id = signatures.usersid
        WHERE users.id = $1
        `),
        [id]
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
