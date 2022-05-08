const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_SECRET
    ).toString(),
  });
 
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
    const _username = req.body.username;
    const _password = req.body.password;
    
    try {
      const user = await User.findOne({username: _username});
      const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECRET);
      
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
