import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true }, // Unique token for tracking
  beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', required: true }, // Reference to Beneficiary
  department: { type: String, required: true }, // Department the token is assigned to
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }, // Current status
  createdAt: { type: Date, default: Date.now }, // Track when the token was generated
});

const Token=  mongoose.model('Token', TokenSchema);



  export default  Token

