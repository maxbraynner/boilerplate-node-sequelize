import { Request } from "express";
import { auth } from "firebase-admin";

interface Credentials extends auth.DecodedIdToken {
    scope?: {
        user: boolean
        admin: boolean
    }
}

interface AuthRequest extends Request {
    credentials: Credentials
}

export default AuthRequest;