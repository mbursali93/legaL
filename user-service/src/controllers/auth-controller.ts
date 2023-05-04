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
           if(!user) throw new Error("Something went wrong")

            const accessToken = await utils.generateAccessToken(id)
            const refreshToken = await utils.generateRefreshToken(id)

            res.cookie("refreshToken", refreshToken, {
                path: "/",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })

           res.status(200).json({...user, accessToken})

        } catch(e:any) {
            
            
            res.status(500).json(e.message)
        }
    }

    async login(req: Request, res: Response) {
        try {
        
            const user = await service.login(req.body.email, req.body.password)

            const accessToken = await utils.generateAccessToken(user.id)
            const refreshToken = await utils.generateRefreshToken(user.id)

            res.cookie("refreshToken", refreshToken, {
                path: "/",
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })

            const { password, iban, ...userInfo } = user;

            res.status(200).json({ ...userInfo, accessToken })
        } catch(e:any){
            res.status(500).json(e.message)
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie("refreshToken", { path: "/" })
            res.status(203).json("Logged out")
        } catch(e:any) {
            res.status(500).json(e.message)
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const token = req.cookies.refreshToken
            if(!token) return res.status(403).json("no token to be found")
            const accessToken = await utils.getNewToken(token)
            res.status(200).json(token)
        } catch(e:any) {
            res.status(500).json(e.message)
        }
    }
}

export default AuthController