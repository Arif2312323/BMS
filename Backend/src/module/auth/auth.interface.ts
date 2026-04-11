import mongoose from "mongoose";

export interface IAuth {
  email: string;
  password: string;
}

export interface IRefreshTokenPayload {
  token : string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IAccessTokenPayload {
    id : string;
    email? : string;
    phone? : string;
    role? : string;
}