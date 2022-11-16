import { Router } from "express";
import messagesController from "../controllers/messages-controller.js";

const chatRouter = Router();

chatRouter.get('/:username', messagesController.getMessages);

export default chatRouter;