import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// import bcrypt from 'bcrypt';

// var userSchema = new Schema({
//     email: {type: String, required: true},
//     password: {type: String, required: true}
// });

const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  address: { type: String, require: true, unique: true },
  age: { type: Number, require: true, unique: true },
  phone: { type: String, require: true, unique: true },
  avatar: { type: String, require: true, unique: true },
});

// userSchema.methods.encryptPassword = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
// };

// userSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.password);  
// };

export default mongoose.model('User', userSchema);