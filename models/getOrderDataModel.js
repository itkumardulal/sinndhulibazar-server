const db = require('../config/db'); // mysql2 connection or pool

exports.getOrderDataById = async (id) => {
  console.log("===== 📦 START getOrderById =====");
  console.log("📥 Step 1: Received ID from server:", id);

  try {
    // STEP 2: Fetch main order
    console.log("🛠 Step 2: Running order query...");
    const [orderRows] = await db.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    // console.log("✅ Step 2: Order query executed.");
    // console.log("🗂 Step 2 Result:", orderRows);

    if (orderRows.length === 0) {
      console.log("⚠ Step 2: No order found for ID:", id);
      console.log("===== 🛑 END getOrderById (No Data) =====");  

      return null;
    }

    const order = orderRows[0];
    // console.log("📋 Step 2: Selected Order:", order);

    // STEP 3: Fetch order items
    console.log("🛠 Step 3: Running items query...");
    const [itemsRows] = await db.execute(
      'SELECT item_name AS name, quantity, price FROM order_items WHERE order_id = ?',
      [id]
    );
    // console.log("✅ Step 3: Items query executed.");
    // console.log("📦 Step 3 Result:", itemsRows);

    // STEP 4: Build response object
    // console.log("🛠 Step 4: Building response object...");
    // const response = {
    //   id: order.id,
    //   senderName: order.sender_name,
    //   senderPhone: order.sender_phone,
    //   receiverName: order.receiver_name,
    //   receiverPhone: order.receiver_phone,
    //   relationship: order.relationship,
    //   message: order.message,
    //   occasion: order.occasion,
    //   itemsOrdered: itemsRows,
    //   deliveryCharge: order.delivery_charge,
    //   totalPrice: order.total_price,
    //   claimed: Boolean(order.claimed),
    //   deliveryStatus: {
    //     delivered: Boolean(order.delivery_delivered),
    //     deliveredAt: order.delivery_delivered_at || null
    //   },
    //   whatsappTries: order.whatsapp_tries,
    //   whatsappBlocked: Boolean(order.whatsapp_blocked),
    //   claimedAt: order.claimed_at || null,
    //   createdAt: order.created_at,
    //   giftRange:order.giftRange
    // };
    const response = {
  id: order.id,
  senderName: order.sender_name,
  senderPhone: order.sender_phone,
  receiverName: order.receiver_name,
  receiverPhone: order.receiver_phone,
  receiverAgeGroup: order.receiver_age_group, // NEW
  receiverGender: order.receiver_gender,      // NEW
  relationship: order.relationship,
  message: order.message,
  occasion: order.occasion,
  itemsOrdered: itemsRows,
  deliveryCharge: order.delivery_charge,
  totalPrice: order.total_price,
  claimed: Boolean(order.claimed),
  deliveryStatus: {
    delivered: Boolean(order.delivery_delivered),
    deliveredAt: order.delivery_delivered_at || null
  },
  whatsappTries: order.whatsapp_tries,
  whatsappBlocked: Boolean(order.whatsapp_blocked),
  claimedAt: order.claimed_at || null,
  createdAt: order.created_at,
  giftRange: order.giftRange,
  giftCost:order.giftCost
};


    // console.log("✅ Step 4: Final Response:", response);
    // console.log("===== 🎯 END getOrderById =====");

    return response;

  } catch (err) {
    console.error("❌ Step X: Error in getOrderById:", err);
    console.log("===== 🛑 END getOrderById (Error) =====");
    throw err;
  }
};
