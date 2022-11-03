import { addProduct } from '../controllers/products-controller.js';

import { Router } from "express";
import __dirname from "../utils/utils.js";

const productRouter = Router();

productRouter.post('/', addProduct);

export default productRouter;