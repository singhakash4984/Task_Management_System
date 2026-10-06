import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validation = (
    schema: z.ZodType
) =>(req:Request, res:Response, next:NextFunction) =>{

    const result = schema.safeParse(req.body) ;

    if(!result.success){
        const error = result.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
        })) ;

        return res.status(400).json({
            success: false,
            error
        })
    }

        req.body = result.data ;

    next()
}