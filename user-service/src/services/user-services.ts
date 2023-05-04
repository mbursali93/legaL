import UserRepository from "../database/repository/user-repository"
import { IUserInputs } from "../types/user-interface"
import Utils from "../utils/utils"

const utils = new Utils()
const repository = new UserRepository()

class AuthService {
    
    async register(userInputs:IUserInputs) {
        try {
            const { username, email, password, iban } = userInputs

            const id:string = await utils.generateId()
            const hashedPassword = await utils.hashPassword(password)
            const last_online = new Date()

            const savedUser = await repository.saveUser({ id, username, email, password: hashedPassword, iban, last_online })
            
            return savedUser;

        } catch(e:any) {
            
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await repository.getUserByEmail(email)
            if(user.rows.length === 0) throw new Error("no user to be found")
            const isCorrect = await utils.comparePassword(password, user.rows[0].password)
            if(!isCorrect) throw new Error("password is wrong")

            return user.rows[0];
        } catch(e:any) {
            throw new Error(e.message)
        }
    }

}

export default AuthService;