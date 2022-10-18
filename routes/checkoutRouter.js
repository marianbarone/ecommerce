import { getCart, checkout } from '../controllers/checkout-controller.js';
import { Router } from "express";

const checkoutRouter = Router();

//Middleware de autenticacion.
const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    next();
};

checkoutRouter.get('/', authMiddleware, getCart)

checkoutRouter.post('/', authMiddleware, checkout);

export default checkoutRouter;