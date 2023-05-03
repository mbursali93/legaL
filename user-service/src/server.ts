import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"

import PgDatabase from "./database/pg"

import authRouter from "./routes/auth-routes"

const app = express()
const database = new PgDatabase()

app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
database.connect()

app.use("/auth", authRouter)





const PORT = process.env.PORT || 2001
app.listen(PORT, ()=> console.log(`user service is running on PORT: ${PORT}`))