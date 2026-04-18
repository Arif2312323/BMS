import { Request,Response,NextFunction } from "express";
import createHttpError from "http-errors";
import { isValidEmail } from "../../utils";
import { generateOTP, hashOTP, sendOTPtoEmail, verifyOTP } from "./otp.service";
import { createUser, getUserByEmail } from "../user/user.service";
import { deleteRefreshToken, generateToken, storeRefreshToken } from "./token.service";
import { tr } from "zod/v4/locales";



export const sendOtp = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email} = req.body;

        if(!email)
        {
            const err = new createHttpError.BadRequest("Email is required");
            return next(err);
        }
        if(!isValidEmail(email))
        {
            const err = new createHttpError.BadRequest("Invalid email format");
            return next(err);
        }

        const otp = generateOTP();

        const ttl = 1000*60*2;
        const expires = Date.now()+ttl;
        const data = `${email}.${otp}.${expires}`;
        const hashedOTP = hashOTP(data);

        try{
            await sendOTPtoEmail(email,otp);
        }
        catch(error)
        {
            const err = new createHttpError.InternalServerError("Error sending email");
            return next(err);
        }

        res.json({
            hash : `${hashedOTP}.${expires}`,
            email,msg:"OTP sent to email successfully"
        })
    }
    catch(error)
    {
        next(error);
    }
}

export const verify = async(req:Request,res:Response,next:NextFunction) => {
    const {email,otp,hash} = req.body;
    if(!email || !otp || !hash)
    {
        const err = new createHttpError.BadRequest("All fields are required");
        return next(err);
    }

    const [hashedOTP,expires] = hash.split(".");
    if(Date.now() > expires)
    {
        const err = new createHttpError.Gone("OTP Expired");
        return next(err);
    }

    const data = `${email}.${otp}.${expires}`;
    const isValid = verifyOTP(hashedOTP,data);

    if(!isValid)
    {
        const err = new createHttpError.Unauthorized("Invalid OTP");
        return next(err);
    }

    let user = await getUserByEmail(email);
    if(!user){
        user = await createUser({email, name : email.split("@")[0], role : "user", createdAt : new Date(), updatetAt : new Date()});
    }

    const {accessToken,refreshToken} = await generateToken({
        _id:user._id,
        email : user.email,
    });

    await storeRefreshToken(refreshToken, user._id as string);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : isProduction,
        sameSite : isProduction ? "none" : "lax",
        maxAge : 7*24*60*60*1000
    });

    res.cookie("accessToken", accessToken, {
        httpOnly : true,
        secure : isProduction,
        sameSite : isProduction ? "none" : "lax",
        maxAge : 7*24*60*60*1000
    });

    res.json({auth:true, accessToken});
};

export const logout = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {refreshToken} = req.cookies;

        await deleteRefreshToken(refreshToken);

        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("accessToken", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: isProduction, sameSite: isProduction ? "none" : "lax" });

        res.json({msg:"Logged out successfully"})
    }
    catch(error)
    {
        next(error)
    }
}

