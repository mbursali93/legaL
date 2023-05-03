import { IUser } from "../../types/user-interface";
import PgDatabase from "../pg";
import query from "../queries/auth-query"

const db = new PgDatabase()
class UserRepository {
    private db: PgDatabase

    constructor() {
        this.db = new PgDatabase()
    }
    async saveUser(user: IUser) {
        try {
            const { id, username, email, password, iban } = user
            const savedUser = await db.pool.query(query.register, [id, email, username, password, iban])
            if(!savedUser.rows[0]) throw new Error("cgge")
            return savedUser.rows[0];
        } catch(e:any) {
            throw e
        }
    }
}

export default UserRepository