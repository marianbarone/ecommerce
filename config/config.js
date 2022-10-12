import mongoose from "mongoose";
import dotenv from 'dotenv'
import logger from '../services/logs.js'

dotenv.config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.URLMongo)
        logger.info(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        logger.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB
