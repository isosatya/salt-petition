DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    usersid INT NOT NULL UNIQUE,
    -- we gray these fields out because we now have them in users.sql
    -- first VARCHAR(255) NOT NULL,
    -- last VARCHAR(255) NOT NULL,
    -- but now how to relate the entries here with the entries in the users table (signature, user)
    signature TEXT NOT NULL
    -- userId field from the users table, to connect the entries between both tables (FOREIGN KEY concept)
);
