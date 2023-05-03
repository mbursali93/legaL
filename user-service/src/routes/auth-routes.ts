import { Router } from "express"
import AuthController from "../controllers/auth-controller"

const router = Router()
const controller = new AuthController()

router.post("/", controller.register)


export default router;
