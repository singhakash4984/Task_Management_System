export type loginDTO = {
    email:string,
    password: string
}

export type payload = {
    id: string,
    role: string
}

export type session = {
    userId:string ;
    tokenHash:string ;
    expiresAt:Date;
    ip:string
    userAgent?: string ;
    rotatedFrom?: string ;
    
}

export type User = {
    id: string;
    email:string;
    password_hash:string;
    role:string ;
}

export type meta = {
ip: string ;
userAgent?:string ;
}

export type AccessTokenPayload = {
    id:string;
    role: string;
    iat: number;
    exp: number;
}