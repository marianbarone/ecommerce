import { Router } from "express";
import authController from "../controllers/auth-controller.js";
import __dirname from "../utils/utils.js";
import multer from "multer";

const signupRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${file.originalname}`);
    }
});

const upload = multer({ storage });

signupRouter.get("/", authController.getSignup);
signupRouter.post("/", upload.single("avatar"), authController.postSignup);

export default signupRouter;