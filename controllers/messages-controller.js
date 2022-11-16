// import Message from '../models/messages.js'
// import logger from '../middlewares/logs.js'

// export const getMessages = async (req, res) => {
//   try {
//     const { username } = req.params
//     const messages = await Message.find({ username })
//     console.log('MessagesController - GetAll',messages)
//     if (messages.length === 0) {
//       return res.status(401).json({ msg: 'No hay mensajes de este usuario' })
//     }
//     res.status(200).json({ messages })
//   } catch (error) {
//     logger.info('error', error)
//     res.status(500).json({ msg: error })
//   }
// }

import mongoose from "mongoose";
import { errorHandler } from "../middlewares/errorHandler.js";

//Clase contenedora de MongoDB para mensajes.
class messagesController {
  constructor(collectionName) {
    const MessageSchema = mongoose.Schema({
      author: {
        email: { type: String, require: true },
        nombre: { type: String, default: null },
        apellido: { type: String, default: null },
        edad: { type: Number, default: null },
        alias: { type: String, default: null },
        avatar: { type: String, default: "https://cdn3.iconfinder.com/data/icons/avatars-set1/32/ava32px040-256.png" }
      },
      text: { type: String, require: true },
      date: { type: Date, default: Date.now }
    });
    this.model = mongoose.model(collectionName, MessageSchema);
  }

  async addMessage(data) {
    try {
      await this.model.create(data);
    } catch (err) {
      return errorHandler(err, res);
    }
  }

  async getMessages() {
    try {
      const data = await this.model.find();
      return data;
    } catch (err) {
      return errorHandler(err, res);
    }
  }
}

export default new messagesController('message');