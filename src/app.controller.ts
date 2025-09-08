import {type Express } from "express";
import authRouter from "./modules/auth/auth.controller.js"
import { connectDB } from "./DB/connection.js";

export function bootstrap (app: Express, express: any){

    app.use(express.json());

    connectDB()
// auth
app.use('/auth',authRouter)

    app.use("/{*dummy}",(req,res,next)=>{
        return res.status(200).json({message:"invalid router",success:false})
    })
};
