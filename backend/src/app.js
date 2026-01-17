import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.static("public"))
app.use(cookieParser())


//routes import
// import materialRoute from './routes/material.routes.js'

//routes declaration
// app.use("/api", materialRoute)


export { app }