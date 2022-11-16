import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    status: {type: String, required: true, default: 'Generada'},
    timestamp: {
        type: Date,
        default: Date.now()
    },
});

export default mongoose.model('Order', schema);