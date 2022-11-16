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
import Message from './models/messages.js';


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

    const io = new IOServer(serverExpress);

    let nickNames = [];

    io.on('connection', socket => {
        console.log('Nuevo usuario conectado');

        //Al recibir un mensaje recojemos los datos
        socket.on('enviar mensaje', async (datos) => {
            

            io.sockets.emit('nuevo mensaje', {
                msg: datos,
                nick: socket.nickname
            });

            let chatMessage = new Message({ msg: datos, nick: socket.nickname });
            chatMessage.save();

        });

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