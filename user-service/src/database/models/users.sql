CREATE TABLE IF NOT EXISTS users (

    id TEXT UNIQUE NOT NULL,
    email VARCHAR(31) UNIQUE NOT NULL,
    username VARCHAR(31) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    iban TEXT NOT NULL,
    credits INT NOT NULL DEFAULT 1000,
    last_online DATE,

    PRIMARY KEY (id)

);