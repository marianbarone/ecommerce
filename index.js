import * as path from 'path'
import hbs from 'hbs'
import express from "express";
import __dirname from "./utils/utils.js";
import session from "express-session";
import passport from "passport";
import dotenv from 'dotenv';
dotenv.config()
import connectDB from './config/config.js'
import routes from './routes/api.js'
import os from "os";
import cluster from "cluster"
import compression from 'compression'
import logger from "./middlewares/logs.js";
import { Server as IOServer } from "socket.io";
import MessageService from './services/messages-service.js';
import messagesController from './controllers/messages-controller.js';
import flash from 'connect-flash'


const app = express();

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression())

const modo = parseInt(process.argv[3]) || 'FORK'
const cpus = os.cpus();

if (modo == "CLUSTER" && cluster.isPrimary) {
    cpus.map(() => {
        cluster.fork();
    });

    cluster.on("exit", (worker) => {
        logger.info(`worker ${worker.process.pid} died :(`);
        cluster.fork();
    })
} else {

    const PORT = process.env.PORT || 8080;
    const serverExpress = app.listen(PORT, (err) => err ? logger.info(`Error en el server: ${err}`) : logger.info(`Server listening on PORT: ${PORT}`));

    connectDB()

    //Sockets

    // const io = new IOServer(serverExpress)
    // const chat = new MessageService()
    // io.on('connection', async socket => {
    //     console.log(`Se conecto un usuario ${socket.id}`)
    //     const messages = await chat.getAllMessages()

    //     io.emit('server:message', messages)

    //     socket.on('client:message', async messageInfo => {
    //         const { email, message } = messageInfo
    //         await chat.newMessages(email, message)
    //         const messages = await chat.getAllMessages()
    //         io.emit('server:message', messages)
    //     })
    // })

    const io = new IOServer(serverExpress);

    let nickNames = [];

    io.on('connection', socket => {
        console.log('Nuevo usuario conectado');

        //Al recibir un mensaje recojemos los datos
        socket.on('enviar mensaje', async (datos) => {
            //console.log(datos);
            //Lo enviamos a todos los usuarios (clientes)
            io.sockets.emit('nuevo mensaje', {
                messsage: datos,
                email: socket.nickname
            });

            // await messagesController.addMessage(datos);         

        });

        // socket.on('client:message', async messageInfo => {
        //     await messagesController.addMessage(messageInfo);         
        //     chat = await messagesController.getMessages();                  
        //     io.emit('server:messages', chat);
        // })


        socket.on('nuevo usuario', (datos, callback) => {

            //Nos devuelve el indice si el dato existe, es decir, si ya existe el nombre de usuario:
            if (nickNames.indexOf(datos) != -1) {
                callback(false);
            } else {
                //Si no existe le respondemos al cliente con true y agregamos el nuevo usuario:
                callback(true);
                socket.nickname = datos;
                nickNames.push(socket.nickname);
                //Enviamos al cliente el array de usuarios:
                actualizarUsuarios();
            }
        });

        socket.on('disconnect', datos => {
            //Si un usuario se desconecta lo eliminamos del array
            if (!socket.nickname) {
                return;
            } else {
                //buscamos su posición en el array y lo eliminamos con splice()
                nickNames.splice(nickNames.indexOf(socket.nickname), 1);

                //Enviamos al cliente el array de usuarios actualizado:
                actualizarUsuarios();
            }
        });

        function actualizarUsuarios() {
            io.sockets.emit('usernames', nickNames);
        }

    });

    //Conexion websockets
    // io.on('connection', async socket => {
    //     console.log(`Un usuario se ha conectado: ${socket.id}`);
    //       // CREA LA TABLA DE CHATS SI ESTA NO EXISTIA
    //     let chat = await messagesController.getMessages();                 // SE TRAEN TODOS LOS CHATS DE LA TABLA

    //     io.emit('server:messages', chat);                             // AL ESTABLECERSE LA CONEXION SE LE ENVIAN AL CLIENTE LOS PRODUCTOS QUE HAYA EN LA BBDD
    //     socket.on('client:message', async messageInfo => {
    //         await messagesController.addMessage(messageInfo);         // CUANDO EL CLIENTE LE ENVIA AL SERVIDOR UN NUEVO PRODUCTO DESDE EL SERVIDOR SE LO GUARDA EN LA BBDD
    //         chat = await messagesController.getMessages();                   // SE ESPERA A QUE SE TRAIGAN TODOS LOS PRODUCTOS DE LA BBDD Y SE LOS ALMACENA EN UNA VARIABLE  
    //         io.emit('server:messages', chat);                        // SE ENVIA AL CLIENTE LA VARIABLE CONTENEDORA DE TODOS LOS PRODUCTOS PARA QUE SE RENDERICEN
    //     })
    // })

    const error404 = (request, response, next) => {
        let mensajeError = {
            error: "-2",
            descripcion: `ruta: ${request.url} método: ${request.method} no implementado`
        };
        // response.status(404).json(mensajeError);
        response.render('error.hbs');

        next();
    };


    app.use(session({
        secret: 'keyboard cat',
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: Number(process.env.EXPIRATION)
        },
        rolling: true,
        resave: true,
        saveUninitialized: false
    }));

    // view engine setup
    app.set('view engine', 'hbs', ({ defaultLayout: 'layout', extname: '.hbs' }))
    hbs.registerPartials('views/partials')

    app.use(session({
        secret: 'keyboard cat',
        cookie: {
            httpOnly: false,
            secure: false,
            // maxAge: config.TIEMPO_EXPIRACION
        },
        rolling: true,
        resave: true,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function (req, res, next) {
        res.locals.login = req.isAuthenticated();
        res.locals.session = req.session;
        next();
    });

    app.use('/api', routes);
    app.use('/', routes);

    app.use((req, res, next) => {
        logger.info(`Ruta: ${req.url} | Método: ${req.method}`);
        next();
    });

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });



}