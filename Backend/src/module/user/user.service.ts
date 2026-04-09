import { UserModel } from "./user.model";
import { IUser } from "./user.interface";


export const createUser = async (userData : IUser) => {
    try {
        const user = await UserModel.create(userData);
        return user;  
    }
    catch (error) {
        throw error;
    }       
}

export const getAllUsers = async () => {
    try {
        const users = await UserModel.find();
        return users;
    } catch (error) {
        throw error;
    }
};

export const getUserById = async (id : string) => {
    try {
        const user = await UserModel.findById(id);
        return user;
    } catch (error) {
        throw error;
    }       
}

export const updateUser = async (id : string, userData : Partial<IUser>) => {
    try {
        const user = await UserModel.findByIdAndUpdate(id, userData, { new: true });
        return user;
    }   catch (error) {
        throw error;
    }       
}