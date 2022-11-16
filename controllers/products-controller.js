import { createProduct, updateById, deleteById, getById, getAll, getByCategory } from '../services/products-service.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const addProduct = async (req, res) => {
    try {
        const response = await createProduct(req.body);

        res.status(201).json(response);
    } catch (err) {
        return errorHandler(err, res);
    }
};

//GetAll
const getProducts = async (req, res) => {
    try {
        const response = await getAll()
        res.status(201).json(response);


    } catch (err) {
        return errorHandler(err, res);
    }
}

//Category

const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category
        const products = await getByCategory(category)
        res.status(201).json(products);
        

    } catch (err) {
        return errorHandler(err, res);
    }
}


//GetByID

const getProductById = async (req, res) => {
    const id = req.params.id
    let data = await getById(id)

    if (data) {
        res.send(data)
    } else {
        res.status(404).json({ error: "Producto no encontrado!" })
    }
}

// Update con id

const updateProduct = async (req, res) => {

    const id = req.params.id
    const data = req.body
    let product = await getById(id)

    if (product) {
        const productUpdate = await updateById(id, data)
        res.json({
            msg: `El producto con el id ${id} fue actualizado con exito`
        })
    } else {
        res.status(404).json({ error: "Producto no encontrado" })
    }
}

//Delete por id

const deleteProduct = async (req, res) => {
    const id = req.params.id
    let data = await deleteById(id)
    if (data) {
        res.json("Producto eliminado")
    } else {
        res.status(404).json({ error: "Producto no encontrado!" })
    }
}

export {
    addProduct,
    deleteProduct,
    updateProduct,
    getProductById,
    getProducts,
    getProductsByCategory
}

// const getAction = async (req, res, next) => {
//     const category = req.params.category
//     const products = await getByCategory(category)
//     // console.log(products)
//     res.render('shop/index', { title: 'Shopping Cart', products: products });
// };

// const getDrama = async (req, res, next) => {
//     const products = await getByCategory(Drama)
//     // console.log(products)
//     res.render('shop/index', { title: 'Shopping Cart', products: products });
// };