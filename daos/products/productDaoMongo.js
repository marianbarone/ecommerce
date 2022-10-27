import productMongoService from '../../services/productMongoService.js'

class productDaoMongo extends productMongoService {
    constructor() {
        super('Product')
    }
}

export default productDaoMongo