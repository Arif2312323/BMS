import express from "express";
import MovieRouter from "../module/movie/movie.route";
import ShowRouter from "../module/show/show.route";
import TheaterRouter from "../module/theater/theater.route";
import userRouter from "../module/user/user.router";


const router = express();

router.use("/movies",MovieRouter);
router.use("/shows",ShowRouter);
router.use("/theater",TheaterRouter);
router.use("/users", userRouter);

export default router;