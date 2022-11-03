import { createProduct } from '../services/products-service.js';

const addProduct = async (req, res) => {
    try {
        const response = await createProduct(req.body);

        res.status(201).json(response);
    } catch (err) {
        console.log(err);
        if (err.statusCode) {
            return res.status(statusCode).send(err);
        }

        res.sendStatus(500);
    }
};

export {
    addProduct
}