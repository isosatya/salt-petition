SELECT users.id, users.first, users.last, profiles.usersid, profiles.age, profiles.city, signatures.usersid
FROM users
INNER JOIN profiles
    ON users.id = profiles.usersid
INNER JOIN signatures
    ON users.id = signatures.usersid
