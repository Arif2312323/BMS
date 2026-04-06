import express from "express"
import * as TheaterController from "./theater.controller";

const router = express.Router();

router.post("/", TheaterController.createTheater);
router.get("/",TheaterController.getTheaters);

export default router;