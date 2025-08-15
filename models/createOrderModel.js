const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createOrderModel = async (orderData) =>{
  const {
    senderName,
    senderPhone,
    receiverName,
    receiverPhone,
    receiverGender,
     receiverAgeGroup,
    relationship,
    message,
    occasion,

    deliveryCharge,
    totalPrice,
        itemsOrdered, // [{ name, price, quantity }]
        giftRange,
        giftCost
        
    
  } = orderData;

  const orderId = uuidv4();

  // Start transaction
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insert into orders table
    await connection.execute(
      `INSERT INTO orders 
      (id, sender_name, sender_phone, receiver_name, receiver_phone,receiver_gender, receiver_age_group, relationship, message, occasion, delivery_charge, total_price,giftRange,giftCost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`,
      [
        orderId,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        receiverGender,
        receiverAgeGroup,
        relationship,
        message,
        occasion,
      
        deliveryCharge,
        totalPrice,
        giftRange,
        giftCost
        
      ]
    );

    // Insert each item into order_items table
    for (const item of itemsOrdered) {
      await connection.execute(
        `INSERT INTO order_items (order_id, item_name, price, quantity)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.name, item.price, item.quantity]
      );
    }

    // Commit transaction
    await connection.commit();
    connection.release();

    return { success: true, orderId };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};
