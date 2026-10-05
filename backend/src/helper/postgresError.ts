import { DatabaseError } from "pg"

export const isUniqueViolation = (
 err:unknown,
 constraint?:string   
):boolean =>{
if(!(err instanceof DatabaseError)) return false ;
if(err.code !== "23505") return false ;
if(constraint) return err.constraint === constraint
return true
}