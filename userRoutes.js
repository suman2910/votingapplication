
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const isLoggedin = require("../middleware/middlefunction");


router.post("/signup", async (req, res) => {
  try {
    const { name, age, email, mobile, address, aadharCardNumber, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      age,
      email,
      mobile,
      address,
      aadharCardNumber,
      password: hash,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => { 
  try {
    const { aadharCardNumber, password } = req.body;

   
    const user = await User.findOne({ aadharCardNumber });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
  { _id: user._id, email: user.email, role: user.role },
  "secret",
  { expiresIn: "1h" }
   );
    res.cookie("token", token, {
  httpOnly: true,
  secure: false,  
  sameSite: "lax",// 1 hour in milliseconds (optional)
});


    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/changepass", isLoggedin, async (req, res) => {
  try {
    const { password } = req.body;
    const userEmail = req.user.email;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { password: hash },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/profilee",isLoggedin,(req,res)=>{
  const dataid=req.user;
  console.log(dataid);
  res.status(200).json({dataid});
})


module.exports = router;
