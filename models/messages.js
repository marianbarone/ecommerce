import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var schema = new Schema({
  nick: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Message', schema);