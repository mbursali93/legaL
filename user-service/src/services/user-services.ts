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

            const savedUser = await repository.saveUser({ id, username, email, password: hashedPassword, iban })
            return savedUser;

        } catch(e) {

        }
    }
}

export default AuthService;