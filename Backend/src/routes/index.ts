import express from "express";
import MovieRouter from "../module/movie/movie.route";
import ShowRouter from "../module/show/show.route";
import TheaterRouter from "../module/theater/theater.route";

const router = express();

router.use("/movies",MovieRouter);
router.use("/shows",ShowRouter);
router.use("/theater",TheaterRouter);

export default router;