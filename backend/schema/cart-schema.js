const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  username: String,
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  name: String,
  img: String,
  price: Number,
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model("Cart", cartSchema);
