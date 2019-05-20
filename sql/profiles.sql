DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    usersid INT UNIQUE NOT NULL,
    age VARCHAR(5),
    city VARCHAR(255),
    homepage VARCHAR(255)
    -- usersid INT NOT NULL UNIQUE REFERENCES users(id),
);
