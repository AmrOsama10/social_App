import { NextFunction, Request, Response } from "express"
import { BadRequestException } from "../utils";
import { ZodType } from "zod";


export const isValid = (schema:ZodType)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
let data = {...req.body,...req.params,...req.query}
    const result = schema.safeParse(data);
    if (!result.success) {
      let errorMessage = result.error.issues.map((issus)=>({
        path:issus.path[0],
        message:issus.message
      }))
      throw new BadRequestException("validation failed",errorMessage);
    }
    next()
    }
    
}