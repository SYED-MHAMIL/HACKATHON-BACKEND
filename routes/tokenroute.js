import express from 'express';
import Token from '../models/Token.js';
import Beneficiary from '../models/Beneficiary.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();


router.post('/generate', async (req, res) => {
  const { cnic, department } = req.body;
  try {
    const beneficiary = await Beneficiary.findOne({ cnic });
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found.' });

    const tokenNumber = generateToken(); // Use the utility function
    const token = await Token.create({ 
      beneficiaryId: beneficiary._id, 
      department, 
      tokenNumber 
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const token = await Token.findById(req.params.id).populate('beneficiaryId');
    if (!token) return res.status(404).json({ error: 'Token not found.' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

export default router;
