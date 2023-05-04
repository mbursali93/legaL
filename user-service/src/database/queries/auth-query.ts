const AuthQueries = {
    register: "INSERT INTO users(id, email, username, password, iban, last_online) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, last_online",
    getUserByEmail: "SELECT * FROM users WHERE email = $1",
}

export default AuthQueries;