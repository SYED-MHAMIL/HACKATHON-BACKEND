import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  cnic: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  purpose: { type: String, required: true },
  history: [
    {
      date: { type: Date, default: Date.now },
      department: String,
      status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' },
      remarks: String,
      token:String,
    },
  ],
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);
export default Beneficiary;
