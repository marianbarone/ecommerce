import { getCart, reduceItemFromCart, removeFromCart, addToCart } from '../controllers/cart-controller.js';

import { Router } from "express";
import __dirname from "../utils/utils.js";

const cartRouter = Router();

cartRouter.get('/add-to-cart/:id', addToCart);

cartRouter.get('/reduce/:id', reduceItemFromCart)

cartRouter.get('/remove/:id', removeFromCart)

cartRouter.get('/', getCart);

export default cartRouter;