const orderModel = require('../models/orderModel');

exports.createOrder = async (req, res) => {
  try {
    const {
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      relationship,   // <-- Add relationship here
      message,
      occasion,
      itemsOrdered,
      deliveryCharge,
      totalPrice
    } = req.body;

    // Basic validation
    if (
      !senderName || !senderPhone ||
      !receiverName || !receiverPhone ||
      !itemsOrdered || !Array.isArray(itemsOrdered) || itemsOrdered.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields or invalid itemsOrdered" });
    }

    // Validate each item has name, quantity, price
    for (const item of itemsOrdered) {
      if (
        !item.name ||
        typeof item.quantity !== 'number' ||
        typeof item.price !== 'number' ||
        item.quantity <= 0 ||
        item.price < 0
      ) {
        return res.status(400).json({ error: "Each item must have valid name, quantity (>0) and price (>=0)" });
      }
    }

    // Insert order - pass relationship here as well
    const orderId = await orderModel.insertOrder({
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      relationship,  // <-- pass relationship here
      message,
      occasion,
      deliveryCharge,
      totalPrice
    });

    if (!orderId) {
      return res.status(500).json({ error: 'Failed to insert order' });
    }

    // Insert order items
    await orderModel.insertOrderItems(orderId, itemsOrdered);

    res.status(201).json({ success: true, orderId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrdersList();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
