import { Router } from "express";
import userModel from '../services/users-service.js'

const profileRouter = Router();

//Middleware de autenticacion.
const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    next();
};

profileRouter.get('/', authMiddleware, userModel.getUserOrder);

export default profileRouter;