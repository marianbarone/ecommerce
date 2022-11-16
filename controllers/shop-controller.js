import Product from '../models/product.js';
import { getAll } from '../services/products-service.js';

const getShop = async (req, res, next) => {
    const products = await getAll()
    // console.log(products)
    res.render('shop/index', { title: 'Shopping Cart', products: products });
};



export{
    getShop
}