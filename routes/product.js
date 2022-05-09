const { verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const Product = require("../models/Product");
const router = require("express").Router();

//CREATE NEW PRODUCT
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE A PRODUCT BY ID
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE PRODUCT by ID
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT by ID
router.get("/find/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const qLimit = req.query.limit;
  const qCategory = req.query.category;
  try {
    let products;
    if (qLimit) {
      products = await Product.find().sort({ _id: -1 }).limit(qLimit);
    } else  if (qCategory) {
        products = await Product.find({
          categories: { $in: [qCategory] },
        }).sort({ _id: -1 });
    } else {
        products = await Product.find().sort({ _id: -1 });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
