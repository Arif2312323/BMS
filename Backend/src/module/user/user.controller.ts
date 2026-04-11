
import { Request, Response, NextFunction } from "express";
import * as UserService from "./user.service";

// 1. Create User
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

// 2. Get All Users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

// 3. Get User By Id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserById(req.params.id);

        if(!user){
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

// 4. Update User
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.updateUser(req.params.id, req.body);

        if(!user){
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}
