//Models
import Order from '../models/order.js';
import { Cart } from '../models/cart.js';
import __dirname from "../utils/utils.js";
import { errorHandler } from '../middlewares/errorHandler.js';
import { createOrder, getOrderById } from '../services/order-service.js';

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

const checkout = async (req, res) => {

    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }

    const cart = new Cart(req.session.cart);

    const order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
    });

    await order.save()

    const saveOrder = async (order, res) => {
        try {
            const response = await createOrder(order);
            res.status(201).json(response);
        } catch (err) {
            return errorHandler(err, res);
        }
    };

    const orderJson = async(id) => {
        const response = await getOrderById(id)
        return {response}
    }

    console.log(orderJson)

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
        <ul>
            ${order.cart.forEach(prod => {
                return `<li>Nombre: ${prod.item.title} | Precio unitario: ${prod.item.price} | Cantidad: ${prod.item.qty} | Total: ${prod.precio * prod.quantity}</li>`
            }).join("")}
        </ul>
        <p>${order.cart.items}</p >
        <p>Cantidades totales: ${order.cart.totalQty}</p >
        <p>Total: ${order.cart.totalPrice}</p >
        `
    }

    //Whatsapp
    // const whatsapp = {
    //     body: `Nuevo pedido de ${req.user.username} (${req.user.email})

    //     Datos del usuario:
    //     Email: ${req.user.email}
    //     Nombre: ${req.user.username}
    //     Teléfono: ${req.user.phone}
        
    //     Datos del pedido:
    //     ID de carrito: ${cart}
    //     Cart: ${order.cart}
    //     Productos:${Cart.arr}
    //     Cantidades totales: ${Cart.totalQty}
    //     Total: ${Cart.totalPrice}
    // `,
    //     from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
    //     to: `whatsapp:${req.user.phone}`
    // }

    
    //SMS
    //Envio de SMS al cliente (Con twilio en version de prueba solo se puede enviara numeros verificados... Por eso no se pasa el del cliente como deberia ser).
    const sms = {
        body: `Hola, ${req.user.username}. Su pedido ha sido recibido y se encuentra en proceso.`,
        from: process.env.TWILIO_SMS_FROM,
        to: `${req.user.phone}`
    }

    try {
        await transporter.sendMail(sendEmail);
        // await client.messages.create(whatsapp);
        await client.messages.create(sms);
    } catch (err) {
        return errorHandler(err, res);
    }

    res.redirect('/profile')
};

export {
    checkout,
    getCart
}




