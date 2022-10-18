import Product from '../models/product.js';
import { getAll } from '../services/products-service.js';

/* GET home page. */
// const getShop = async (req, res, next) => {
//     Product.find(function (err, docs) {
//         const products = []
//         const shop = products.push(docs);
//         res.render('shop/index', { title: 'Shopping Cart', products: products });
//     });
// };

const getShop = async (req, res, next) => {
    const products = await getAll()
    console.log(products)
    res.render('shop/index', { title: 'Shopping Cart', products: products });
};


export{
    getShop
}