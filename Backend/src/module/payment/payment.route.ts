import { Router } from "express";
import * as PaymentController from "./payment.controller"
import router from "../movie/movie.route";
import { isVerifiedUser } from "../../middlewares/auth.middleware";

router.post("/create-order",isVerifiedUser,PaymentController.createOrder);
router.post("/verify-payment",isVerifiedUser,PaymentController.verifyPayment);

export default router;