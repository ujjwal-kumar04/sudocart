const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schema/user-schema');
const verifyToken = require('../middleware/authMiddleware');

// Register User
router.post('/register', async (req, res) => {
  const {
    name, mobile, email, addressLine, city, state, pincode, dob, gender, password, role,
    // Seller-specific fields
    shopName, businessCategory, businessDescription, panCard, aadhaar, gstNumber,
    pickupSameAsBusiness, pickupAddressLine, pickupCity, pickupState, pickupPincode, pickupContactNumber,
    returnAddressLine, returnCity, returnState, returnPincode,
    shippingMethod,
    accountHolderName, accountNumber, ifscCode, bankName
  } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or mobile" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object with all fields
    const userData = { 
      name,
      mobile,
      email,
      addressLine,
      city,
      state,
      pincode,
      dob,
      gender,
      password: hashedPassword,
      role: role || 'user'
    };

    // Add seller-specific fields if role is seller
    if (role === 'seller') {
      if (shopName) userData.shopName = shopName;
      if (businessCategory) userData.businessCategory = businessCategory;
      if (businessDescription) userData.businessDescription = businessDescription;
      if (panCard) userData.panCard = panCard;
      if (aadhaar) userData.aadhaar = aadhaar;
      if (gstNumber) userData.gstNumber = gstNumber;
      if (pickupSameAsBusiness) userData.pickupSameAsBusiness = pickupSameAsBusiness;
      if (pickupAddressLine) userData.pickupAddressLine = pickupAddressLine;
      if (pickupCity) userData.pickupCity = pickupCity;
      if (pickupState) userData.pickupState = pickupState;
      if (pickupPincode) userData.pickupPincode = pickupPincode;
      if (pickupContactNumber) userData.pickupContactNumber = pickupContactNumber;
      if (returnAddressLine) userData.returnAddressLine = returnAddressLine;
      if (returnCity) userData.returnCity = returnCity;
      if (returnState) userData.returnState = returnState;
      if (returnPincode) userData.returnPincode = returnPincode;
      if (shippingMethod) userData.shippingMethod = shippingMethod;
      if (accountHolderName) userData.accountHolderName = accountHolderName;
      if (accountNumber) userData.accountNumber = accountNumber;
      if (ifscCode) userData.ifscCode = ifscCode;
      if (bankName) userData.bankName = bankName;
    }

    const user = new User(userData);
    await user.save();
    
    res.status(201).json({ 
      message: role === 'seller' ? "Seller Registered Successfully" : "User Registered Successfully" 
    });
  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// Register Seller
router.post('/seller/register', async (req, res) => {
  const {name,mobile,email,addressLine,city,state,pincode,password} = req.body;
  try {
    // Check if seller already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Seller already exists with this email or mobile" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const seller = new User({ 
      name,
      mobile,
      email,
      addressLine,
      city,
      state,
      pincode,
      password: hashedPassword,
      role: 'seller'
    });
    await seller.save();
    
    res.status(201).json({ message: "Seller Registered Successfully" });
  } catch (error) {
    console.log("Seller Register Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: username }, { mobile: username }]
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Wrong password" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password before sending to frontend
    const { password: pwd, ...safeUser } = user._doc;

    const message = user.role === 'seller' ? 'Seller login successful' : 'Login successful';

    res.status(200).json({ 
      message: message, 
      token,
      user: safeUser 
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Seller Login
router.post('/seller/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const seller = await User.findOne({
      $or: [{ email: username }, { mobile: username }],
      role: 'seller'
    });

    if (!seller) return res.status(404).json({ message: "Seller not found" });
    
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Wrong password" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: seller._id, email: seller.email, role: seller.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password before sending to frontend
    const { password: pwd, ...safeSeller } = seller._doc;

    res.status(200).json({ 
      message: "Seller login successful", 
      token,
      user: safeSeller 
    });
  } catch (error) {
    console.log("Seller Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


// User Info for About Page
// router.post('/userinfo', async (req, res) => {
//   const { username } = req.body;
//   try {
//     const user = await User.findOne({
//       $or: [{ email: username }, { mobile: username }]
//     });

//     if (!user) return res.status(404).json("User not found");

//     res.status(200).json({
//       name: user.name,
//       email: user.email,
//       mobile: user.mobile
//     });
//   } catch (error) {
//     console.log("UserInfo Error:", error);
//     res.status(500).json("Something went wrong");
//   }
// });
// Get user info - Protected route with JWT
router.get('/userinfo', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) return res.status(404).json({ message: "User not found" });

    // Return all user data (password already excluded)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      gender: user.gender,
      dob: user.dob,
      addressLine: user.addressLine,
      city: user.city,
      state: user.state,
      pincode: user.pincode
    };

    // Add seller-specific fields if user is a seller
    if (user.role === 'seller') {
      userData.shopName = user.shopName;
      userData.businessCategory = user.businessCategory;
      userData.businessDescription = user.businessDescription;
      userData.panCard = user.panCard;
      userData.aadhaar = user.aadhaar;
      userData.gstNumber = user.gstNumber;
      userData.pickupSameAsBusiness = user.pickupSameAsBusiness;
      userData.pickupAddressLine = user.pickupAddressLine;
      userData.pickupCity = user.pickupCity;
      userData.pickupState = user.pickupState;
      userData.pickupPincode = user.pickupPincode;
      userData.pickupContactNumber = user.pickupContactNumber;
      userData.returnAddressLine = user.returnAddressLine;
      userData.returnCity = user.returnCity;
      userData.returnState = user.returnState;
      userData.returnPincode = user.returnPincode;
      userData.shippingMethod = user.shippingMethod;
      userData.accountHolderName = user.accountHolderName;
      userData.accountNumber = user.accountNumber;
      userData.ifscCode = user.ifscCode;
      userData.bankName = user.bankName;
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("UserInfo error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});



module.exports = router;
