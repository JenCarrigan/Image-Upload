import mongoose from 'mongoose';
let Schema = mongoose.Schema;

const provSchema = new Schema({
  provider: {type: String, required: true, unique: true},
  phone: String,
  atty: { type: Schema.Types.ObjectId, ref: 'Attorneys' },
});

let prov = mongoose.model('Providers', provSchema);
export default prov;