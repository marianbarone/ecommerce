import { Router } from "express";
import messagesController from "../controllers/messages-controller.js";

const chatRouter = Router();

chatRouter.get('/', messagesController.getChat);

export default chatRouter;