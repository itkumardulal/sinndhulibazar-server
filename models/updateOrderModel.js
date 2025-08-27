const db = require("../config/db");

exports.updateOrderById = async (orderId, updateData = {}) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1️⃣ Fetch current claimed and whatsapp_tries
    const [rows] = await connection.execute(
      "SELECT claimed, whatsapp_tries FROM orders WHERE id = ?",
      [orderId]
    );

    if (rows.length === 0) {
      await connection.rollback();
      connection.release();
      return { success: false, message: "Order not found" };
    }

    const { claimed, whatsapp_tries } = rows[0];

    // 2️⃣ If already claimed, return message
    if (claimed === 1) {
      connection.release();
      return { success: false, message: "You have already claimed this order" };
    }

    // 3️⃣ Build dynamic SET clause including claimed and incremented whatsapp_tries
    const fields = ["claimed = 1", "whatsapp_tries = ?"];
    const values = [whatsapp_tries + 1];

    for (const key in updateData) {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }

    const query = `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`;
    values.push(orderId);

    const [result] = await connection.execute(query, values);

    await connection.commit();
    connection.release();

    return { success: result.affectedRows > 0, orderId };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};
