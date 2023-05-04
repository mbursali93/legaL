import { v4 } from "uuid"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"

class Utils {

    async generateId(): Promise<string> {
        return v4()
    }

    async hashPassword(password: string) :Promise<string> {
        return await bcrypt.hash(password, 10)
    }

    async comparePassword(inputPassword: string, userPassword:string ) :Promise<boolean> {
        return await bcrypt.compare(inputPassword, userPassword)
        
    }

    async generateAccessToken(id:string) :Promise<string> {
        return await jwt.sign({ id }, process.env.JWT_ACCESS || "", { expiresIn: "11m" })
    }

    async generateRefreshToken(id:string) :Promise<string> {
        return await jwt.sign({ id }, process.env.JWT_REFRESH || "", { expiresIn: "7d" })
    }

    async getNewToken(token:string) {
        const user = await jwt.verify(token, process.env.JWT_ACCESS || "") as JwtPayload
        return await this.generateAccessToken(user.id)
    }
}



export default Utils
