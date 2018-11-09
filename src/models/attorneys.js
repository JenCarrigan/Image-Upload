import mongoose from 'mongoose';
let Schema = mongoose.Schema;

const attySchema = new Schema({
  name: {type: String, required: true, unique: true},
  numOfClients: Number,
  startDate: Date,
});

let atty = mongoose.model('Attorneys', attySchema);
export default atty;