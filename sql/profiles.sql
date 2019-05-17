DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    usersid INT NOT NULL UNIQUE REFERENCES users(id),
    age INT,
    city VARCHAR(255),
    homepage VARCHAR(255)
);
