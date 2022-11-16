import { addProduct, getProductById, updateProduct, deleteProduct, getProducts, getProductsByCategory } from '../controllers/products-controller.js';

import { Router } from "express";
import __dirname from "../utils/utils.js";

const productRouter = Router();

productRouter.post('/', addProduct);
productRouter.get('/', getProducts)
productRouter.get('/:id', getProductById)
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);
productRouter.get('/category/:category', getProductsByCategory)


export default productRouter;