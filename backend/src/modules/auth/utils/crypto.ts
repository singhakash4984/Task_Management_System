import argon2 from "argon2" 
import { env } from "../../../config/env.js"
import { AppError } from "../../shared/errors/AppError.js";
import crypto from "node:crypto" ;

  const MAX_PASSWORD_LENGTH = 72 ;


export const hashPassword = async(password:string):Promise<string> =>{


  if(password.length > MAX_PASSWORD_LENGTH) {
    throw new AppError("Password too long",400)
  }
 
const result = await argon2.hash(password,{
  type:argon2.argon2id,
  memoryCost:env.app.nodeEnv === "production"? 2 ** 16 : 2 ** 15 ,
  timeCost:3,
  parallelism:1,
  hashLength:32
})
return result ;
}

export const verifyPassword = async(hashedPassword:string, password:string):Promise<boolean> =>{
  if(!hashPassword || !password)return false ;
  try {
    return await argon2.verify(hashedPassword,password) ;
  } catch(error) {
    throw new Error("argon2 verification failed")
  }

}

export const FAKE_HASH = "$argon2id$v=19$m=32768,p=1,t=3$71byuIr6sa/GqYo3qQ9Raw$bwD8X1AJmmaAzPtKxiFT5nYVebcBxCURsVDC0TirZzA" ;


export const generateRefreshToken = () =>{
return crypto.randomBytes(64).toString("hex") ;
}

export const hashToken = (token:string) =>{
 return crypto.createHash("sha256").update(token).digest("hex")
}