// const db = require('../config/db');

// // List of allowed columns that can be updated in the orders table
// const allowedColumns = [
//   'sender_name',
//   'sender_phone',
//   'receiver_name',
//   'receiver_phone',
//   'receiver_gender',
//   'receiver_age_group',
//   'relationship',
//   'message',
//   'occasion',
//   'delivery_charge',
//   'total_price',
//   'claimed',
//   'delivery_delivered',
//   'delivery_delivered_at',
//   'whatsapp_tries',
//   'whatsapp_blocked',
//   'claimed_at'
// ];

// exports.updateOrder = async (orderId, updatedFields) => {
//   // Filter updatedFields to keep only allowed columns and convert keys to snake_case
//   // Assuming the client sends keys in camelCase, convert them to snake_case here

//   const camelToSnake = (str) =>
//     str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

//   const filteredFields = {};
//   for (const [key, value] of Object.entries(updatedFields)) {
//     const snakeKey = camelToSnake(key);
//     if (allowedColumns.includes(snakeKey)) {
//       filteredFields[snakeKey] = value;
//     }
//   }

//   if (Object.keys(filteredFields).length === 0) {
//     throw new Error('No valid fields to update');
//   }

//   const setClause = Object.keys(filteredFields)
//     .map((field) => `${field} = ?`)
//     .join(', ');
//   const values = Object.values(filteredFields);
//   values.push(orderId);

//   const sql = `UPDATE orders SET ${setClause} WHERE id = ?`;

//   const [result] = await db.query(sql, values);
//   return result;
// };
const db = require('../config/db'); // mysql2 connection or pool

exports.updateOrderById = async (id, updates) => {
  console.log("===== ✏ START updateOrderById =====");
  console.log("📥 Step 1: Received ID:", id);
  console.log("📥 Step 1: Received updates object:", updates);

  try {
    // STEP 2: Build dynamic update query
    console.log("🛠 Step 2: Building update query...");
    const fields = [];
    const values = [];

    for (const key in updates) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length === 0) {
      console.log("⚠ Step 2: No fields to update. Aborting.");
      console.log("===== 🛑 END updateOrderById (No Updates) =====");
      return { affectedRows: 0 };
    }

    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    console.log("📝 Step 2: Final SQL:", sql);
    console.log("📦 Step 2: SQL Values:", values);

    // STEP 3: Execute update query
    console.log("🛠 Step 3: Executing update query...");
    const [result] = await db.execute(sql, values);
    console.log("✅ Step 3: Update query executed.");
    console.log("📊 Step 3: Result:", result);

    // STEP 4: Fetch updated order for confirmation
    console.log("🛠 Step 4: Fetching updated order...");
    const [updatedRows] = await db.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    console.log("✅ Step 4: Updated order fetched:", updatedRows);

    console.log("===== 🎯 END updateOrderById =====");
    return {
      affectedRows: result.affectedRows,
      updatedOrder: updatedRows[0] || null
    };

  } catch (err) {
    console.error("❌ Step X: Error in updateOrderById:", err);
    console.log("===== 🛑 END updateOrderById (Error) =====");
    throw err;
  }
};
