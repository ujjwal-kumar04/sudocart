const express = require("express");
const router = express.Router();
const Watchlist = require("../schema/Watchlist");

// Add to watchlist
router.post("/watchlist", async (req, res) => {
  const { username, product } = req.body;

  try {
    const item = new Watchlist({ username, ...product });
    await item.save();
    res.status(200).json("Added to watchlist");
  } catch (err) {
    res.status(500).json("Failed to save");
  }
});

// Get watchlist by username
router.get("/watchlist/:username", async (req, res) => {
  try {
    const items = await Watchlist.find({ username: req.params.username });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json("Error fetching watchlist");
  }
});

// Delete item
router.delete("/watchlist/:id", async (req, res) => {
  try {
    await Watchlist.findByIdAndDelete(req.params.id);
    res.status(200).json("Item removed");
  } catch (err) {
    res.status(500).json("Delete failed");
  }
});

module.exports = router;
