import { config } from "../../config/config";
import jwt from "jsonwebtoken";
import RefreshTokenModel from "./refresh.model";

export const generateToken = async (payload : any) => {
    const accessToken = jwt.sign(payload, config.jwtSecretKey as string, {
        expiresIn : "1h"
    });
    const refreshToken = jwt.sign(payload, config.jwtSecretKey as string, {
        expiresIn : "7d"
    });
    return {accessToken,refreshToken};
}

export const storeRefreshToken = async (refreshToken : string, userId : string) => {
    try{
        await RefreshTokenModel.create({token:refreshToken,userId});
    }catch(error){
        console.error("Error storing refresh token:", error);
    }
}

export const verifyToken = (token:string)=>{
    return jwt.verify(token, config.jwtSecretKey as string);
}

export const getRefreshTokenForUser = async (userId : string) => {
    try{
        return await RefreshTokenModel.findOne({userId});
    }catch(error){
        console.error("Error fetching refresh token:", error);
    }
}

export const deleteRefreshToken = async (userId : string) => {
    try{
        await RefreshTokenModel.deleteOne({userId});    
    } catch(error){
        console.error("Error deleting refresh token:", error);
    }
}

export const updateRefreshToken = async (userId : string, newRefreshToken : string) => {
    try{
        await RefreshTokenModel.findOneAndUpdate({userId}, {token: newRefreshToken}, {new: true});
    } catch(error){
        console.error("Error updating refresh token:", error);
    }
}