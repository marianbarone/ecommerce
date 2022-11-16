import { Router } from "express";
import authController from "../controllers/auth-controller.js";

const logoutRouter = Router();

logoutRouter.get("/", authController.getLogout);

export default logoutRouter;