const express = require('express');
const router = express.Router();
const Cart = require('../schema/cart-schema');

// Add to cart
router.post("/cart", async (req, res) => {
  const { username, product } = req.body;

  try {
    // Check if item already in cart
    const existingItem = await Cart.findOne({ username, productId: product.id || product._id });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const sellerId = product.seller?._id || product.seller || product.sellerId;
    console.log("Adding to cart - Product:", product._id, "Seller:", sellerId);

    const newCartItem = new Cart({
      username,
      productId: product.id || product._id,
      sellerId: sellerId,
      name: product.name,
      img: product.img,
      price: product.price,
    });

    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Get cart by username
router.get("/cart/:username", async (req, res) => {
  try {
    const items = await Cart.find({ username: req.params.username }).populate('sellerId', 'name email');
    // Ensure sellerId is returned in the response
    const formattedItems = items.map(item => ({
      _id: item._id,
      username: item.username,
      productId: item.productId,
      sellerId: item.sellerId?._id || item.sellerId,
      name: item.name,
      img: item.img,
      price: item.price,
      quantity: item.quantity
    }));
    res.status(200).json(formattedItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart" });
  }
});
router.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Item deleted");
  } catch (err) {
    res.status(500).json("Delete failed");
  }
});
router.put("/cart/:id", async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: { quantity: req.body.quantity } },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json("Update failed");
  }
});


module.exports = router;
