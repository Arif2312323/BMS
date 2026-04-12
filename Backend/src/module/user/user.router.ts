import { Router } from "express";
import * as UserController from "./user.controller";
import { isVerifiedUser } from "../../middlewares/auth.middleware";

const router = Router();

// 1. Create User
router.post("/", UserController.createUser);

// 2. Get All Users
router.get("/", UserController.getAllUsers);

// 3. Get User By Id
router.get("/:id", isVerifiedUser, UserController.getUserById);

// 4. Update User
router.put("/:id", UserController.updateUser);

router.post("/activate/:id",UserController.activateUser);

export default router;