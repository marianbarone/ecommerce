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

const app = express();

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

    const error404 = (request, response, next) => {
        let mensajeError = {
            error: "-2",
            descripcion: `ruta: ${request.url} método: ${request.method} no implementado`
        };
        response.status(404).json(mensajeError);
        next();
    };

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

    app.use('/', routes);

    app.use((req, res, next) => {
        logger.info(`Ruta: ${req.url} | Método: ${req.method}`);
        next();
    });    


}