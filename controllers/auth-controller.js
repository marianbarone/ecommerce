import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import __dirname from "../utils/utils.js";
import userModel from '../services/users-service.js'
import { transporter } from "../middlewares/nodeMailer.js";
import dotenv from 'dotenv';
import logger from '../middlewares/logs.js'
// import { UserDao } from '../daos/index.js'
// import daos from "../daos/index.js";
import { errorHandler } from '../middlewares/errorHandler.js'


dotenv.config()

//LOGIN

const getLogin = (req, res) => {
    if (req.isAuthenticated()) return res.redirect("/");
    res.render('user/signin');
}

const isValidPassword = (password, encPassword) => {
    const isValid = bcrypt.compareSync(password, encPassword);
    return isValid;
}

passport.use('login', new LocalStrategy(
    async (username, password, done) => {

        const user = await userModel.getByUsername(username);

        logger.info(user)

        if (!user || !isValidPassword(password, user.password)) return done(null, false);

        return done(null, user);
    }
))

passport.serializeUser((user, done) => {
    done(null, user.username);
});
passport.deserializeUser(async (username, done) => {
    const user = await userModel.getByUsername(username);
    done(null, user);
});

// SIGNUP
const getSignup = (req, res) => {
    res.render('user/signup');
}

function createHash(password) {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null);
}

// PROCESS LOGIN
const postLogin = (req, res) => {
    res.redirect("/");

}

// PROCESS SIGNUP
const postSignup = async (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: createHash(req.body.password),
        address: req.body.address,
        age: req.body.age,
        phone: req.body.phone,
        // avatar: req.body.file,
    }

    const userDB = await userModel.createUser(newUser);

    logger.info(newUser)

    if (!userDB) return res.render("error", { error: "El usuario o el mail ya están registrados" });

    const sendEmail = {
        from: 'Blockbuster',
        to: process.env.TEST_MAIL,
        subject: 'Nuevo registro',
        html: `<h2> Acaba de registrarse un nuevo usuario </h2> <br>
        <h3> Datos: </h3>
        <p>Email: ${userDB.email}</p>
        <p>Usuario: ${userDB.username}</p>
        <p>Dirección: ${userDB.address}</p>
        <p>Edad: ${userDB.age}</p>
        <p>Teléfono: ${userDB.phone}</p>
        `
        // attachments: [
        //     { path: __dirname + "/public" + userDB.avatar }
        // ]
    }

    try {
        await transporter.sendMail(sendEmail);
    } catch (err) {
        return errorHandler(err, res);
    }

    res.redirect("/login");
}


// LOGOUT
const getLogout = (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const name = req.user.username;
            req.logout({}, err => err && logger.error(err));
            res.redirect("/login");
        };

        res.redirect("/login");

    } catch (err) {
        return errorHandler(err, res);
    }

}

const failRoute = (req, res) => {
    logger.warn(`Ruta: ${req.url} | Método: ${req.method}`);
    res.status(404).render('error', {});
}

export default {
    // getRoot,
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    getLogout,
    failRoute
}
