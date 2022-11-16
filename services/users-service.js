import mongoose from "mongoose";
import { Cart } from '../models/cart.js';
import logger from "../middlewares/logs.js";
import order from "../models/order.js";
import { errorHandler } from "../middlewares/errorHandler.js";

class userModel {
    constructor(collectionName) {
        const userSchema = mongoose.Schema({
            username: { type: String, require: true, unique: true },
            email: { type: String, require: true, unique: true },
            password: { type: String, require: true },
            address: { type: String, require: true, unique: true },
            age: { type: Number, require: true, unique: true },
            phone: { type: String, require: true, unique: true },
            // avatar: { type: String, require: true, unique: true },
        });
        this.model = mongoose.model(collectionName, userSchema);
    }

    async getUser(req, res) {
        try {
            const user = req.user
        } catch (err) {
            return errorHandler(err, res);
        }
    }

    async createUser(data) {
        try {
            const user = await this.model.create(data);
            return user;
        } catch (err) {
            return errorHandler(err, res);
        }
    }

    async getById(id) {
        try {
            const data = await this.model.findOne({ _id: id });
            return data;
        } catch (err) {
            return errorHandler(err, res);
        }
    }

    async getByUsername(username) {
        try {
            const data = await this.model.findOne({ username });
            return data;
        } catch (err) {
            return errorHandler(err, res);
        }
    }

    async getUserOrder(req, res, next) {
        order.find({ user: req.user }, function (err, orders) {
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

export default new userModel('User');
