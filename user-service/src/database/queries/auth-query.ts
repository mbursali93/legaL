const AuthQueries = {
    register: "INSERT INTO users(id, email, username, password, iban) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email",
}

export default AuthQueries;