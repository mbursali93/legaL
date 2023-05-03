import { v4 } from "uuid"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class Utils {

    async generateId(): Promise<string> {
        return v4()
    }

    async hashPassword(password: string) :Promise<string> {
        return await bcrypt.hash(password, 10)
    }

    async generateAccessToken(id:string) :Promise<string> {
        return await jwt.sign({ id }, process.env.JWT_ACCESS || "", { expiresIn: "11m" })
    }

    async generateRefreshToken(id:string) :Promise<string> {
        return await jwt.sign({ id }, process.env.JWT_REFRESH || "", { expiresIn: "7d" })
    }
}



export default Utils
