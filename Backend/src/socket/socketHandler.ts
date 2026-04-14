import { Socket,Server } from "socket.io";
import {redis} from "../config/redis"

export const registerSocketHandlers = (socket:Socket,io:Server)=>{
    socket.on("join-show",async({showId})=>{
        socket.join(showId);
        socket.data.showId = showId;

        console.log(`${socket.id} joined show ${showId}`);

        const lockedSeats = await redis.smembers(`locked-seats:${showId}`);
        const activeLockedSeats = [];
        for(const seatId of lockedSeats){
            const lockKey = `seat-lock:${showId}:${seatId}`;
            const exists = await redis.exists(lockKey);

            if(exists){
                activeLockedSeats.push(seatId);
            }else{
                await redis.srem(`locked-seats:${showId}`, seatId);
            }

        }

        socket.emit("locked-seat-initials",{seatIds:activeLockedSeats});
    })

    socket.on("lock-seats", async ({ showId, seatIds, userId })=>{
        if (!seatIds || !showId || !userId)
        {
            console.log("something is missing",showId,seatIds,userId);
            return;
        }

        const lockedSeatsKeys: string = `locked-seats:${showId}`;
        const unavailableSeats: string[] = [];

        /**
         * STEP 1: Check if seats are already locked
         */

        for (const seatId of seatIds) {
            const seatLockKey = `seat-lock:${showId}:${seatId}`;
            const exisitingLock = await redis.get(seatLockKey);
            const result = await redis.set(seatLockKey, userId, "EX", 300, "NX");
            if (exisitingLock || !result) {
                unavailableSeats.push(seatId);
            }
        }

        /**
         * If any seat already locked → reject request
         */
        if (unavailableSeats.length > 0) {
            socket.emit("seat-locked-failed", {
                showId,
                requested: seatIds,
                alreadyLocked: unavailableSeats,
            });
            return;
        }

        /**
         * STEP 2: Lock all seats
         */

        for (const seatId of seatIds) {
            const seatLockKey = `seat-lock:${showId}:${seatId}`;
            /**
             * Add seat to locked seats SET
             */
            await redis.sadd(lockedSeatsKeys, seatId);
        }
        io.to(showId).emit("seats-locked-update", { seatIds,action: "lock"});
        console.log("seat-locked-succesfully")
    })
    
    socket.on("unlock-seats",async ({showId, seatIds, userId})=>{
        const lockedSeatsKeys: string = `locked-seats:${showId}`;

        for(const seatId of seatIds)
        {
            const seatLockKey = `seat-lock:${showId}:${seatId}`;
            await redis.del(seatLockKey);
            await redis.srem(lockedSeatsKeys,seatId);
        }
        io.to(showId).emit("seats-locked-update", { seatIds,action: "unlock" });
        console.log("Seats unlocked successfully")
    })
    socket.on("Disconnect",(socket)=>{
        console.log(`${socket.id} disconnected from ${socket.data.showId}`)
    })
}