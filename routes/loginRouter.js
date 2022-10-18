import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth-controller.js";

const loginRouter = Router();

loginRouter.get("/", authController.getLogin);
loginRouter.post("/", passport.authenticate('login', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        res.redirect('/');
    });


// router.get("/error", (req, res) => res.render("error.ejs", { error: "Invalid credentials" }));

export default loginRouter;