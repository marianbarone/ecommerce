import mongoose from "mongoose";
import dotenv from 'dotenv'
import logger from '../middlewares/logs.js'
import { errorHandler } from '../middlewares/errorHandler.js'

dotenv.config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.URLMongo)
        logger.info(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        return errorHandler(err, res);
    }

}

export default connectDB
