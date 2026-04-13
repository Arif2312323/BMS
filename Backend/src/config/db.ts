import { error } from "console";
import {config} from "./config"
import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(config.databaseUrl as string,{
            serverSelectionTimeoutMS: 5000,
        })
        console.log("Connected to Database")
    }
    catch(error){
        console.log("Error connecting to DB",error);
        process.exit(1);
    }
}

export default connectDB;