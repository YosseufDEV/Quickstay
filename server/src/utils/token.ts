import jwt from "jsonwebtoken";

export const generateToken = (payload: object, secret_key: any, expiresIn?: string) => {
    if(!payload || !secret_key || (!Object.keys(payload).includes("exp") && !expiresIn)) return null;

    const opts: any = { algorithm: "HS256", ... ( expiresIn && { expiresIn } ) };

    return jwt.sign(payload, secret_key, opts)
}
