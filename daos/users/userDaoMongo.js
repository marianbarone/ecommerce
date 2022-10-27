import userMongoService from '../../services/userMongoService.js'

class userDaoMongo extends userMongoService {
    constructor() {
        super('User')
    }
}

export default userDaoMongo