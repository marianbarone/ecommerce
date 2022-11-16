import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Message', schema);