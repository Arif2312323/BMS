import { config } from "./config"
import Redis from "ioredis"


export const redis = new Redis(config.redisUrl, {
  tls: { rejectUnauthorized: false }
});

redis.on("error",(err)=>{
    console.log("Redis error", err);
})

redis.on("connect",()=>{
    console.log("Redis connected");
})