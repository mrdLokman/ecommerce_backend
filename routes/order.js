const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorisation } = require("./verifyToken");
const Order = require("../models/Order");
const router = require("express").Router();

//CREATE NEW Order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE A Order BY ID
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE Order by ID
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER Orders
router.get("/find/:userId", verifyTokenAndAuthorisation, async (req, res) => {
  try {
    const orders = await Order.find({userId: req.params.id});
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL Orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Stats on income routes
router.get("/income", verifyTokenAndAdmin, (req, res)=>{
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Orders.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
