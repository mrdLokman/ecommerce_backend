const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorisation } = require("./verifyToken");
const Cart = require("../models/Cart");
const router = require("express").Router();

//CREATE NEW CART
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE A CART BY ID
router.put("/:id", verifyTokenAndAuthorisation, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE CART by ID
router.delete("/:id", verifyTokenAndAuthorisation, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART 
router.get("/find/:userId", verifyTokenAndAuthorisation, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.id});
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL CARTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  
  try {
    const carts = await Cart.find().sort({ _id: -1 });
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
