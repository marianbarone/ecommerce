import { Router } from "express";
import { getShop } from "../controllers/shop-controller.js";

const shopRouter = Router();

/* GET home page. */
shopRouter.get('/', getShop);

export default shopRouter;