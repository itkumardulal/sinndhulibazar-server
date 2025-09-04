const getOrderDataModel = require("../models/getOrderDataModel");
const db = require("../config/db"); // adjust path if needed

exports.getOrderbyIdController = async (req, res) => {
  try {
    const { id } = req.params; // read id from URL
    console.log("Id i svalaibale here in server start", id);

    if (!id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    const orderData = await getOrderDataModel.getOrderDataById(id);

    if (!orderData) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(orderData);
  } catch (error) {
    console.error("Error fetching order data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.id,
        o.sender_name,
        o.sender_phone,
        o.receiver_name,
        o.receiver_phone,
        o.receiver_gender,
        o.receiver_age_group,
        o.relationship,
        o.message,
        o.occasion,
        o.delivery_charge,
        o.total_price,
        o.gift_Range,
        o.gift_Cost,
        o.gift_item,        -- Add this line
        o.claimed,
        o.delivery_delivered,
        oi.id AS item_id,
        oi.item_name,
        oi.price,
        oi.quantity
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ORDER BY o.created_at DESC
    `);

    // Group items by order
    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          sender_name: row.sender_name,
          sender_phone: row.sender_phone,
          receiver_name: row.receiver_name,
          receiver_phone: row.receiver_phone,
          receiver_gender: row.receiver_gender,
          receiver_age_group: row.receiver_age_group,
          relationship: row.relationship,
          message: row.message,
          occasion: row.occasion,
          delivery_charge: row.delivery_charge,
          total_price: row.total_price,
          gift_Range: row.gift_Range,
          gift_Cost: row.gift_Cost,
          gift_item: row.gift_item, // now will have value
          claimed: row.claimed,
          delivery_delivered: row.delivery_delivered,
          items: [],
        };
      }
      if (row.item_id) {
        ordersMap[row.id].items.push({
          id: row.item_id,
          item_name: row.item_name,
          price: row.price,
          quantity: row.quantity,
        });
      }
    });

    res.json(Object.values(ordersMap));
  } catch (err) {
    console.error("DB Error getAllOrders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
