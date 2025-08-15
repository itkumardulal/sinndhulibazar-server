const { updateOrder } = require('../models/updateOrderModel');

exports.updateOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",id)

    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    if (!updatedFields || Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const result = await updateOrder(id, updatedFields);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: error.message || 'Failed to update order' });
  }
};
