import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError.js";


export const errorHandler = (
    err: any,
    req:Request,
    res:Response,
    next:NextFunction
) =>{

    if(res.headersSent){
        return next(err)
    }
    const isAppError = err instanceof AppError
    let statusCode = isAppError?err.statusCode:500 ;
    let message = isAppError && err.isOperational ? err.message: "Something went wrong" ;

    console.log({
        message: err.message,
        stack:err.stack,
        path:req.originalUrl,
        method: req.method
    })

    return res.status(statusCode).json({
        success: false ,
        message
    })
}