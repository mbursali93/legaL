import { IUser } from "../../types/user-interface";
import PgDatabase from "../pg";
import query from "../queries/auth-query"

const db = new PgDatabase()
class UserRepository {
    private db: PgDatabase

    constructor() {
        this.db = new PgDatabase()
    }
    
    async saveUser(user: IUser) :Promise<IUser> {
       
            const { id, username, email, password, iban, last_online } = user
            const savedUser = await this.db.pool.query(query.register, [id, email, username, password, iban, last_online])
            
           return savedUser.rows[0];
        
    }

    async getUserByEmail(email: string) {
        return await this.db.pool.query(query.getUserByEmail, [email])
    }

    async updateLastOnline(id:string) {

    }
}

export default UserRepository