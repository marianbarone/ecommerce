import mongoose from'mongoose';
var Schema = mongoose.Schema;

var schema = new Schema({
    thumbnail: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: { type: String, required: true },
    price: {type: Number, required: true}
});

export default mongoose.model('Product', schema);