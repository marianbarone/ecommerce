import Product from '../models/product.js';
// import { ProductDao } from '../daos/index.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const getAll = async () => {
    try {
        const products = await Product.find();
        return { products };

    } catch (err) {
        return errorHandler(err, res);
    }
}

const createProduct = async (productToCreate) => {
    const createdProduct = await Product.create(productToCreate);

    return createdProduct;
};

const deleteById = async(id) => {
    const product = await Product.deleteOne({ _id: id })
    return product

}

const updateById = async(id, data) => {
    const productToUpdate = await Product.updateOne({ _id: id }, { $set: data })
    return productToUpdate
}

const getById = async(id) =>  {
    const product = await Product.find({ _id: id })
    return product
}

const getByCategory = async(data) => {
    const products = Product.find({category: data})
    return products
}

export {
    getAll,
    createProduct,
    deleteById,
    updateById, 
    getById,
    getByCategory
}