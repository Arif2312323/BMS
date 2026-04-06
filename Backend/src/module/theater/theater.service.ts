import { Theater } from "./theater.model";

// 1. CreateTheater

import { ITheater } from "./theater.interface";

export const createTheater = async (data: ITheater): Promise<ITheater> => {
    return await Theater.create(data);
}
// 2. GetAllTheaters
export const getAllTheaters = async (): Promise<ITheater[]> => {
    return await Theater.find();
}
// 3. GetTheaterById
export const getTheaterById = async (id: string): Promise<ITheater | null> => {
    return await Theater.findById(id);
}
// 4. GetTheaterByState
export const getTheaterByState = async (state: string): Promise<ITheater[]> => {
    return await Theater.find({state: { $regex: state, $options: "i" }});
}