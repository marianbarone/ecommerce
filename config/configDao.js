import dotenv from 'dotenv';
dotenv.config()

export default {
    mongoDB: {
        connectionString: (process.env.URLMongo),
    }
}