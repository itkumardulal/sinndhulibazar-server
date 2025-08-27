const { updateOrderById } = require("../models/updateOrderModel");

exports.updateOrderController = async (req, res) => {
  try {
    const { id } = req.params;           // order ID from URL
    const { gift_item } = req.body;      // expected field

    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    if (!gift_item) {
      return res.status(400).json({ error: "gift_item is required" });
    }

    const result = await updateOrderById(id, { gift_item });

    if (!result.success) {
      // Could be already claimed or order not found
      return res.status(400).json({ message: result.message });
    }

    return res.json({ message: "Gift updated successfully", orderId: id });
  } catch (error) {
    console.error("Error updating gift:", error);
    return res.status(500).json({ error: error.message || "Failed to update gift" });
  }
};
