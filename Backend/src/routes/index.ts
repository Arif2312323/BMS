import express from "express";
import MovieRouter from "../module/movie/movie.route";
import ShowRouter from "../module/show/show.route";
import TheaterRouter from "../module/theater/theater.route";
import userRouter from "../module/user/user.router";
import authRouter from "../module/auth/auth.route";
import paymentRouter from "../module/payment/payment.route"
import bookingRouter from "../module/booking/booking.route"


const router = express();

router.use("/movies",MovieRouter);
router.use("/shows",ShowRouter);
router.use("/theater",TheaterRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/payment",paymentRouter);
router.use("/booking", bookingRouter);

export default router;