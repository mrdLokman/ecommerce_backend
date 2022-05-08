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
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) res.status(401).json("User doen't exist!");
    else {
      const encryptedPassword = CryptoJs.AES.decrypt(
        user.password,
        process.env.CRYPTO_SECRET
      );
      const password = encryptedPassword.toString(CryptoJs.enc.Utf8);
      
      if (req.body.password !== password)
        res.status(401).json("Wrong Password!");
      else {
        res.status(200).json(user);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
