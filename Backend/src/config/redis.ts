import { config } from "./config"
import Redis from "ioredis"


export const redis = new Redis({
    host : config.redisHost,
    port : parseInt(config.redisPort || "6379"),
    retryStrategy : ()=>5000
})

redis.on("error",(err)=>{
    console.log("Redis error", err);
})

redis.on("connect",()=>{
    console.log("Redis connected");
})