//Models
import Order from '../models/order.js';
import { Cart } from '../models/cart.js';
import __dirname from "../utils/utils.js";

//Mensajeria
import { transporter } from "../middlewares/nodeMailer.js";
import client from "../middlewares/twilio.js";

//Logs
import logger from "../middlewares/logs.js";

const getCart = async (req, res, next) => {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    logger.error("error")
    res.render('shop/checkout', { total: cart.totalPrice });
};

const checkout = async (req, res, next) => {

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


};

export {
    checkout,
    getCart
}




