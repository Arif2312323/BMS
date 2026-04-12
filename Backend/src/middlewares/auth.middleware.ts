import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { verifyToken } from '../module/auth/token.service';
import { getUserById } from '../module/user/user.service';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any; // You can replace 'any' with your actual User type
        }
    }
}

export const isVerifiedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {accessToken} = req.cookies;
        if (!accessToken) {
            return next(createHttpError.Unauthorized("Access token is missing"));
        }

        const decodedToken = verifyToken(accessToken)
        // console.log("Decoded Token:", decodedToken);
        if(!decodedToken || typeof decodedToken === 'string')
        {
            return next(createHttpError.Unauthorized("Invalid access token"));
        }
        const user = await getUserById(decodedToken._id);
        req.user = user;
        next();
    }
    catch(error)
    {
        return next(createHttpError.Unauthorized("Unauthorized access"));
    }
};