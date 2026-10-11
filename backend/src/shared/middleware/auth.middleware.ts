import { Request, Response, NextFunction } from "express"
import { AppError } from "../errors/AppError.js";
import { env } from "../../config/env.js";
import jwt from "jsonwebtoken"
import { AccessTokenPayload } from "../types/auth.type.js";
export const authMiddleware = async(
  req:Request,
  res:Response,
  next:NextFunction  
) =>{
    const authHeader = req.headers?.authorization ;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new AppError("Unauthorized",401)
    };
   const token = authHeader.split(" ")[1] ;

   if(!token){
     throw new AppError("Unauthorized",401)
   }
   try {
    const decoded = jwt.verify(
        token,env.auth.accessSecret
    ) as AccessTokenPayload ;

    req.user = {
        id: decoded.id,
        role: decoded.role
    }
    next()
   } catch (error) {
    throw new AppError("Invalid or expired token",401)
   }
   

}