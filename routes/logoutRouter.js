import { Router } from "express";

const logoutRouter = Router();

//Middleware de autenticacion.
const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    next();
};

logoutRouter.get('/', authMiddleware, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

export default logoutRouter;