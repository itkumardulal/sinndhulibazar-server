const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// exports.insertOrder = async (order) => {
//   const id = uuidv4();
//   const {
//     senderName,
//     senderPhone,
//     receiverName,
//     receiverPhone,
//     receiver_gender,
//      receiver_age_group,
//     message,
//     occasion,
//     deliveryCharge,
//     totalPrice,
//     relationship
//   } = order;

// const sql = `
//   INSERT INTO orders 
//   (id, sender_name, sender_phone, receiver_name, receiver_phone, receiver_gender, receiver_age_group, message, occasion, delivery_charge, total_price, relationship, claimed, delivery_delivered, whatsapp_tries, whatsapp_blocked)
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false, false, 0, false)
// `;


//   // Add this line here to check values before query execution
//   console.log({
//     id,
//     senderName,
//     senderPhone,
//     receiverName,
//     receiverPhone,
//     receiver_gender,
//      receiver_age_group,
//     message,
//     occasion,
//     deliveryCharge,
//     totalPrice,
//     relationship
//   });

//   await db.execute(sql, [
//     id,
//     senderName,
//     senderPhone,
//     receiverName,
//     receiverPhone,
//     message,
//     occasion,
//     deliveryCharge,
//     totalPrice,
//     relationship
//   ]);

//   return id;
// };

// exports.insertOrderItems = async (orderId, items) => {
//   const sql = `INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)`;

//   for (const item of items) {
//     await db.execute(sql, [orderId, item.name, item.quantity, item.price]);
//   }
// };

exports.getOrderById = async (id) => {
  const [orderRows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
  if (orderRows.length === 0) return null;

  const order = orderRows[0];
  const [itemsRows] = await db.execute('SELECT item_name AS name, quantity, price FROM order_items WHERE order_id = ?', [id]);

  return {
    id: order.id,
    senderName: order.sender_name,
    senderPhone: order.sender_phone,
    receiverName: order.receiver_name,
    receiverPhone: order.receiver_phone,
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
    createdAt: order.created_at
  };
};

//all order list


// exports.getAllOrdersList = async () => {
//   const [rows] = await db.query(`
//     SELECT 
//       o.id AS order_id,
//       o.sender_name,
//       o.sender_phone,
//       o.receiver_name,
//       o.receiver_phone,
//       o.message,
//       o.occasion,
//       o.relationship,
//       o.delivery_charge,
//       o.total_price,
//       o.claimed,
//       o.delivery_delivered,
//       o.delivery_delivered_at,
//       o.whatsapp_tries,
//       o.whatsapp_blocked,
//       o.claimed_at,
//       o.created_at,
//       i.item_name,
//       i.quantity,
//       i.price
//     FROM orders o
//     LEFT JOIN order_items i ON o.id = i.order_id
//     ORDER BY o.created_at DESC
//   `);

//   const grouped = {};

//   for (const row of rows) {
//     if (!grouped[row.order_id]) {
//       grouped[row.order_id] = {
//         id: row.order_id,
//         senderName: row.sender_name || 'Secret Person',
//         senderPhone: row.sender_phone || 'Secret Person',
//         receiverName: row.receiver_name || 'Secret Person',
//         receiverPhone: row.receiver_phone || 'Secret Person',
//         relationship: row.relationship || 'Not specified',
//         message: row.message || '',
//         occasion: row.occasion || '',
//         itemsOrdered: [],
//         deliveryCharge: parseFloat(row.delivery_charge || 0),
//         totalPrice: parseFloat(row.total_price || 0),
//         claimed: Boolean(row.claimed),
//         deliveryStatus: {
//           delivered: Boolean(row.delivery_delivered),
//           deliveredAt: row.delivery_delivered_at || null
//         },
//         whatsappTries: row.whatsapp_tries || 0,
//         whatsappBlocked: Boolean(row.whatsapp_blocked),
//         claimedAt: row.claimed_at || null,
//         createdAt: row.created_at
//       };
//     }

//     // Only add item if present (LEFT JOIN might return nulls)
//     if (row.item_name) {
//       grouped[row.order_id].itemsOrdered.push({
//         name: row.item_name,
//         quantity: row.quantity,
//         price: row.price
//       });
//     }
//   }

//   return Object.values(grouped);
// };
