import express from "express";
import MovieRouter from "../module/movie/movie.route";

const router = express();

router.use("/movies",MovieRouter);

export default router;