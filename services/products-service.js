import Product from '../models/product.js';

const getAll = async () => {
    try {
        const products = await Product.find();
        return { products };
    } catch (error) {
        console.log("error al obtener productos", error);
    }
}

export {
    getAll
}