import { Router } from 'express'

//Routes
import cartRouter from './cartRouter.js'
import loginRouter from './loginRouter.js'
import logoutRouter from './logoutRouter.js'
import checkoutRouter from './checkoutRouter.js'
import signupRouter from './signupRouter.js'
import shopRouter from './shopRouter.js'
import profileRouter from './profileRouter.js'
import productRouter from './productRouter.js'
import chatRouter from './chatRouter.js'
import infoRouter from './infoRouter.js'
import configRouter from './configRouter.js'

const routes = Router()

routes.use('/profile', profileRouter)
routes.use('/signup', signupRouter)
routes.use('/login', loginRouter)
routes.use('/logout', logoutRouter)
routes.use('/', shopRouter)
routes.use('/shop', shopRouter)
routes.use('/products', productRouter)
routes.use('/shopping-cart', cartRouter)
routes.use('/checkout', checkoutRouter)
routes.use('/chat', chatRouter)
routes.use('/info', infoRouter)
routes.use('/config', configRouter)


export default routes
