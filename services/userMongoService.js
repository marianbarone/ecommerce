import mongoose from "mongoose";
import { Cart } from '../models/cart.js';

class userMongoService {
    constructor(collectionName) {
        const userSchema = mongoose.Schema({
            username: { type: String, require: true, unique: true },
            email: { type: String, require: true, unique: true },
            password: { type: String, require: true },
            address: { type: String, require: true, unique: true },
            age: { type: Number, require: true, unique: true },
            phone: { type: String, require: true, unique: true },
            avatar: { type: String, require: true, unique: true },
        });
        this.model = mongoose.model(collectionName, userSchema);
    }

    async getUser(req, res) {
        try {
            const user = req.user
        } catch (error) {
            res.status(500).json({ message: 'Error getting users' })
        }
    }

    async createUser(data) {
        try {
            const user = await this.model.create(data);
            return user;
        } catch (error) {
            logger.error("error al crear usuario: ", error);
        }
    }

    async getById(id) {
        try {
            const data = await this.model.findOne({ _id: id });
            return data;
        } catch (error) {
            logger.error("error al obtener user por ID", error);
        }
    }

    async getByUsername(username) {
        try {
            const data = await this.model.findOne({ username });
            return data;
        } catch (error) {
            logger.error("error al obtener user por USERNAME", error);
        }
    }

    async getUserOrder(req, res, next) {
        Order.find({ user: req.user }, function (err, orders) {
            if (err) {
                return res.write('Error!');
            }
            let cart;
            orders.forEach(function (order) {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('user/profile', { orders: orders });
        });
    }

}

export default userMongoService;

// const getUserOrder = async (req, res, next) => {
//     Order.find({ user: req.user }, function (err, orders) {
//         if (err) {
//             return res.write('Error!');
//         }
//         let cart;
//         orders.forEach(function (order) {
//             cart = new Cart(order.cart);
//             order.items = cart.generateArray();
//         });
//         res.render('user/profile', { orders: orders });
//     });
// };

// export {
//     getUserOrder
// }