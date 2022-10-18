import { Router } from 'express'

//Routes
import cartRouter from './cartRouter.js'
import loginRouter from './loginRouter.js'
import logoutRouter from './logoutRouter.js'
import checkoutRouter from './checkoutRouter.js'
import signupRouter from './signupRouter.js'
import shopRouter from './shopRouter.js'
import profileRouter from './profileRouter.js'

const routes = Router()

routes.use('/profile', profileRouter)
routes.use('/signup', signupRouter)
routes.use('/login', loginRouter)
routes.use('/logout', logoutRouter)
routes.use('/', shopRouter)
routes.use('/shopping-cart', cartRouter)
routes.use('/checkout', checkoutRouter)

export default routes
