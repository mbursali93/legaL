import { Pool } from "pg"
import fs from "fs"
import path from "path"

class PgDatabase {
    pool: Pool;
    
    constructor() {
        this.pool = new Pool({

            user: process.env.POSTGRES_USER,
            database: process.env.POSTGRES_DATABASE,
            port: 5432,
            password: process.env.POSTGRES_PASSWORD,
            host: "localhost"
        })
    }

    private async createTable() {
        const tablePath = path.join(__dirname, "./models/users.sql")
        const sql = fs.readFileSync(tablePath, "utf8")

        this.pool.query(sql)
    }

    async connect() {
        let client;
        try {
            client = await this.pool.connect()
            await this.createTable()
            console.log("database connection is successful")
        } catch(e:any) {

            console.log(e.message)
        } finally {
            if(client) client.release()
        }
    }
}

export default PgDatabase;