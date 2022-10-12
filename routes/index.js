import express from "express";
var router = express.Router();
import passport from "passport";
import __dirname from "../utils/utils.js";

//Models
import Product from '../models/product.js';
import Order from '../models/order.js';
import { Cart } from '../models/cart.js';

//Env
import dotenv from 'dotenv'
dotenv.config()

//Mensajeria
import { transporter } from "../services/nodeMailer.js";
import client from "../services/twilio.js";

import { Router } from 'express'
// import cartRouter from './cartRouter.js'
// import loginRouter from './loginRouter.js'
// import productsRouter from './productsRouter.js'
// import registerRouter from './registerRouter.js'
// import usersRouter from './usersRoutes.js'

import authController from "../controllers/auth-controller.js";
import multer from "multer";
import logger from "../services/logs.js";
// import { upload } from "../services/uploadService.js";

//Middleware de autenticacion.
const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    next();
};

router.get("/login", authController.getLogin);
router.post("/login", passport.authenticate('login', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        res.redirect('/');
    });

// "login", { failureRedirect: "error.hbs" })
/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        const products = []
        const shop = products.push(docs);
        res.render('shop/index', { title: 'Shopping Cart', products: products });
    });
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get("/signup", authController.getSignup);
router.post("/signup", upload.single("avatar"), authController.postSignup);
// router.post("/signup", upload.single("avatar"), (req, res, next) => {
//     const file = req.file;
//     console.log(file)
//     if (!file) return res.status(400).json('Error al subir archivo de imagen (avatar)');
//     next();
// }, authController.postSignup);

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    });
});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { products: null });
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', authMiddleware, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    logger.error("error")
    res.render('shop/checkout', { total: cart.totalPrice });
});

router.post('/checkout', authMiddleware, async function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    const cart = await new Cart(req.session.cart);

    logger.info(cart)

    const order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
    });

    logger.info(order)

    order.save(function (err, result) {
        logger.info("Comprado")
        req.session.cart = null;
        res.redirect('/');
    });

    //Envío de mail con los datos del nuevo pedido.
    const sendEmail = {
        from: 'Blockbuster',
        to: process.env.TEST_MAIL,
        subject: `Nuevo pedido de ${req.user.username} (${req.user.email})`,
        html: `<h2> Nuevo pedido </h2> <br>
        <h3> Datos del usuario: </h3>
        <p>Email: ${req.user.email}</p>
        <p>Nombre: ${req.user.username}</p>
        <p>Teléfono: ${req.user.phone}</p>
        <br>
        <h3> Datos del pedido: </h3>
        <br>
        <p>${Cart.items}</p >
        <p>Cantidades totales: ${Cart.totalQty}</p >
        <p> Total: ${Cart.totalPrice}</p >
        `
    }

    //Whatsapp
    const whatsapp = {
        body: `Nuevo pedido de ${req.user.username} (${req.user.email})

        Datos del usuario:
        Email: ${req.user.email}
        Nombre: ${req.user.username}
        Teléfono: ${req.user.phone}
        
        Datos del pedido:
        ID de carrito: ${cart}
        Cart: ${order.cart}
        Productos:${Cart.arr}
        Cantidades totales: ${Cart.totalQty}
        Total: ${Cart.totalPrice}
    `,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:${req.user.phone}`
    }
    //SMS
    //Envio de SMS al cliente (Con twilio en version de prueba solo se puede enviara numeros verificados... Por eso no se pasa el del cliente como deberia ser).
    const sms = {
        body: `Hola, ${req.user.username}. Su pedido ha sido recibido y se encuentra en proceso.`,
        from: process.env.TWILIO_SMS_FROM,
        to: `${req.user.phone}`
    }

    try {
        await transporter.sendMail(sendEmail);
        await client.messages.create(whatsapp);
        await client.messages.create(sms);
    } catch (error) {
        logger.warn(error);
    }


});

router.get('/profile', authMiddleware, function (req, res, next) {
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
});

router.get('/logout', authMiddleware, function (req, res, next) {
    req.logout();
    res.redirect('/');
});

export default router;
