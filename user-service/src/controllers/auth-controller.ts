import { Request, Response } from "express"
import AuthService from "../services/user-services"
import Utils from "../utils/utils";

const service = new AuthService()
const utils = new Utils()

class AuthController {
    
    async register(req: Request, res: Response) {
        try {
            const id = req.body.id;
           const user = await service.register(req.body)

            const accessToken = await utils.generateAccessToken(id)
            const refreshToken = await utils.generateRefreshToken(id)

            res.cookie("refreshToken", refreshToken, {
                path: "/",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })

           res.status(200).json({...user, accessToken})

        } catch(e:any) {
            
            console.log(e)
            res.status(500).json(e.message)
        }
    }
}

export default AuthController