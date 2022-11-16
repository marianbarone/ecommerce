import Message from '../models/messages.js'

class MessagesService {
    async getAllMessages() {
        const messages = await Message.find()
        console.log('MessagesService - GetAll',messages)
        return messages
    }

    async newMessages(username, message) {
        const userMessage = new Message({ username, message })
        await userMessage.save()
        console.log('MessagesService - newMessage',userMessage)

        return userMessage
    }
}

export default MessagesService
