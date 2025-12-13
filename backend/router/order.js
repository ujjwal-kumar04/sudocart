
const express = require('express');
const router = express.Router();
const Order = require('../schema/order-schema');
const verifyToken = require('../middleware/authMiddleware');

console.log("Order routes loaded");

router.post('/order', async (req, res) => {
  try {
    console.log("=== ORDER CREATION DEBUG ===");
    console.log("Cart Items:", JSON.stringify(req.body.cartItems, null, 2));
    console.log("Full Order Data:", JSON.stringify(req.body, null, 2));
    
    const order = new Order(req.body);
    await order.save();
    
    console.log("Order saved successfully with ID:", order._id);
    console.log("Seller IDs in order:", order.cartItems.map(item => item.sellerId));
    
    res.status(201).json({ message: "Order placed successfully", orderId: order._id });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get('/order/all', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to get orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get seller's orders - orders containing seller's products
router.get('/api/seller/orders', verifyToken, async (req, res) => {
  try {
    const sellerId = req.userId;
    
    
    // Find all orders that contain products from this seller
    const orders = await Order.find({
      'cartItems.sellerId': sellerId
    }).populate('cartItems.productId').sort({ createdAt: -1 });
    
    console.log("Total orders found with seller's products:", orders.length);
    
    // Filter cart items to show only this seller's products
    const sellerOrders = orders.map(order => {
      console.log("\nProcessing Order:", order._id);
      console.log("Cart items in order:", order.cartItems.length);
      
      const sellerItems = order.cartItems.filter(item => {
        const hasSellerIdField = item.sellerId !== undefined && item.sellerId !== null;
        const matches = hasSellerIdField && item.sellerId.toString() === sellerId.toString();
        console.log(`  Item: ${item.name}, sellerId: ${item.sellerId}, matches: ${matches}`);
        return matches;
      });
      
      console.log("Seller items after filter:", sellerItems.length);
      
      return {
        _id: order._id,
        fullName: order.fullName,
        email: order.email,
        mobile: order.mobile,
        address: order.address,
        paymentMethod: order.paymentMethod,
        cartItems: sellerItems,
        orderTotal: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });
    
    const filteredOrders = sellerOrders.filter(order => order.cartItems.length > 0);
    console.log("Final filtered orders to return:", filteredOrders.length);
    
    res.status(200).json(filteredOrders);
  } catch (err) {
    console.error("Failed to get seller orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get seller order analytics
router.get('/api/seller/order-analytics', verifyToken, async (req, res) => {
  try {
    console.log("Order analytics endpoint hit");
    const sellerId = req.userId;
    console.log("Seller ID:", sellerId);
    
    const orders = await Order.find({
      'cartItems.sellerId': sellerId
    });
    
    let totalOrders = 0;
    let orderedCount = 0;
    let dispatchedCount = 0;
    let deliveredCount = 0;
    let totalRevenue = 0;
    
    orders.forEach(order => {
      order.cartItems.forEach(item => {
        if (item.sellerId && item.sellerId.toString() === sellerId.toString()) {
          totalOrders++;
          totalRevenue += item.price * item.quantity;
          
          if (item.status === 'Ordered') orderedCount++;
          else if (item.status === 'Dispatched') dispatchedCount++;
          else if (item.status === 'Delivered') deliveredCount++;
        }
      });
    });
    
    res.status(200).json({
      totalOrders,
      orderedCount,
      dispatchedCount,
      deliveredCount,
      totalRevenue
    });
  } catch (err) {
    console.error("Failed to get order analytics:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update order item status
router.put('/api/seller/order/:orderId/item/:itemIndex/status', verifyToken, async (req, res) => {
  try {
    const { orderId, itemIndex } = req.params;
    const { status } = req.body;
    const sellerId = req.userId;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const item = order.cartItems[itemIndex];
    
    if (!item || item.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    item.status = status;
    await order.save();
    
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error("Failed to update order status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
