import dotenv from "dotenv";
dotenv.config();

let ProductDao;
let UserDao;

switch (process.env.DATABASE) {
    
    case 'mongoDB':
        const { default: productDaoMongo } = await import('../daos/products/productDaoMongo.js')
        const { default: userDaoMongo } = await import('../daos/users/userDaoMongo.js')
        
        ProductDao = productDaoMongo
        UserDao = userDaoMongo

        break;
}

export { ProductDao, UserDao }