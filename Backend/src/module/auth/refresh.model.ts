import mongoose from "mongoose";
import { IRefreshTokenPayload } from "./auth.interface";
import { Schema } from "mongoose";

const refreshTokenSchema = new mongoose.Schema<IRefreshTokenPayload>({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // Token expires after 7 days
});

const RefreshTokenModel = mongoose.model<IRefreshTokenPayload>("RefreshToken", refreshTokenSchema);  

export default RefreshTokenModel;