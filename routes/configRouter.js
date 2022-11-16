import { Router } from "express";

const configRouter = Router();

configRouter.get("/", (req, res) => {
    res.render("config.hbs");
});

export default configRouter;