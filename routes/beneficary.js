"use client";
import express from "express";
import Beneficiary from "../model/baneficary.js";
import Token from "../model/token.js";

import { nanoid } from "nanoid";
import dotenv from "dotenv";
import nodemailer from 'nodemailer'
const router = express.Router();
dotenv.config();



const { senderEmail, senderPassword } = process.env;

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
});

function verifyEmail(email, token) {
  const mailOptions = {
    from: senderEmail,
    to: email,
    html: `<p>welcome to the saylani bebeficiary Management app</p> 
    <p>your token is ${token}</p>    
 `,
    subject: "Token sent",
  };

  transporter.sendMail(mailOptions, (error, sucesss) => {
    if (error)  return error
    if(sucesss)   return console.log("successs");
    
    console.log("emailMessage======>>>>>>>>", "suceesfull");
  });
}










router.post("/beneficiaries", async (req, res) => {
  const { cnic, name, email, address, purpose, department } = req.body;
  const token = nanoid(8);
    //  const  data= await Beneficiary.find({'cnic': cnic})
    //  if(data) return res.status(404).send('Beneficiary already exists')

  try {
    const newBeneficiary = new Beneficiary({
      cnic,
      name,
      email,
      address,
      purpose,
      history: [
        {
          department,
          status: "In Progress",
          remarks: "token generate",
          token,
        },
      ],
    });

    await Token.create({
      token,
      beneficiary: newBeneficiary._id,
      department,
    });

    await newBeneficiary.save();
    verifyEmail(email,token)
    res.status(201).send("Beneficiary created successfully");
  } catch (error) {
    res.status(500).send("Error creating beneficiary");
  }
});


router.get("/beneficiaries", async (req, res) => {
  try {
    const data = await Beneficiary.find();
    res.send({ data });
  } catch (error) {
    res.status(404).send({ message: error });
  }
});

router.get("/beneficiaries/:id", async (req, res) => {
  try {
    const {id} =req.params
    const data = await Beneficiary.findById({_id:id});
    res.send(data);
  } catch (error) {
    res.status(404).send({ message: error });
  }
});


router.put("/beneficiaries/admin/:id", async (req, res) => {
  const { department, status, remarks, cnic, name, email, address, purpose,} = req.body;
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) return res.status(404).send("Beneficiary not found");

  const token = nanoid(8);
      

    beneficiary.cnic=cnic;
    beneficiary.name=name;
    beneficiary.phone=email;
    beneficiary.address=address;
    beneficiary.purpose=purpose;

    beneficiary.history.push({
      department,
      status,
      remarks,
    });
    await beneficiary.save();
    verifyEmail(email,token)
    res.status(200).send("History record added successfully");
  } catch (error) {
    res.status(500).send("Error adding history record");
  }
});



router.delete("/beneficiaries/:id", async (req, res) => {
        const {id} = req.params
  try {
    const data = await  Beneficiary.findByIdAndDelete({ _id: id });
    if (!data) return res.status(404).send({ msg: "item not found" });
    res.status(200).send({ msg: "successfully Delete",data


    });
  } catch (error) {
    res.status(404).send({ msg: error });
  }
});






router.get("/beneficiaries/token/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Search for the beneficiary with the token in history
    const beneficiary = await Beneficiary.findOne({
      "history.token": token,
    });

    if (!beneficiary) {
      return res.status(404).json({ error: "Beneficiary not found." });
    }

    res.status(200).json(beneficiary);
  } catch (error) {
    console.error("Error fetching beneficiary details:", error);
    res.status(500).json({ error: "Failed to fetch beneficiary details." });
  }
});

// Add History Record
router.put("/beneficiaries/:id", async (req, res) => {
  const { department, status, remarks } = req.body;
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) return res.status(404).send("Beneficiary not found");

    beneficiary.history.push({
      department,
      status,
      remarks,
    });
    await beneficiary.save();
    res.status(200).send("History record added successfully");
  } catch (error) {
    res.status(500).send("Error adding history record");
  }
});

// Get Beneficiary by CNIC
router.get("/beneficiaries/cnic/:cnic", async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOne({ cnic: req.params.cnic });
    if (!beneficiary) return res.status(404).send("Beneficiary not found");
    res.json(beneficiary);
  } catch (error) {
    res.status(500).send("Error fetching beneficiary details");
  }
});

// Update Status of Specific History Record
router.put("/beneficiaries/:id/history/:historyId", async (req, res) => {
  const { status, remarks } = req.body;
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary) return res.status(404).send("Beneficiary not found");

    const historyRecord = beneficiary.history.id(req.params.historyId);
    if (!historyRecord) return res.status(404).send("History record not found");

    historyRecord.status = status;
    historyRecord.remarks = remarks;

    await beneficiary.save();
    res.status(200).send("History record updated successfully");
  } catch (error) {
    res.status(500).send("Error updating history record");
  }
});

export default router;
