import { Router } from "express";
import * as UserController from "./user.controller";

const router = Router();

// 1. Create User
router.post("/", UserController.createUser);

// 2. Get All Users
router.get("/", UserController.getAllUsers);

// 3. Get User By Id
router.get("/:id", UserController.getUserById);

// 4. Update User
router.put("/:id", UserController.updateUser);

export default router;