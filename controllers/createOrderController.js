const { createOrderModel } = require('../models/createOrderModel');

exports.createOrderController = async (req, res) => {
  try {
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
      itemsOrdered,     // This can be stored separately, or in another table if needed
      deliveryCharge,
      totalPrice,
      giftRange,
      giftCost
    } = req.body;

    // Validate required fields
    if (!senderName || !receiverName || !Array.isArray(itemsOrdered) || itemsOrdered.length === 0) {
      return res.status(400).json({ error: 'Missing required fields or no items in order' });
    }

    // Save order to DB
    const result = await createOrderModel({
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
       itemsOrdered,
         giftRange,
         giftCost 
    });

    // If you want to save itemsOrdered separately, do it here in another table

    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.orderId,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};
// controllers/getOrderController.js
// const OrderModel = require('../models/orderModel');

// exports.getOrderController = async (req, res) => {
//   try {
//     const { id } = req.body; // Get id from URL params

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Order ID is required in params",
//       });
//     }

//     const order = await OrderModel.findById(id); // Adjust based on DB query method

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Order fetched successfully",
//       data: order,
//     });

//   } catch (error) {
//     console.error("Error fetching order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching order",
//       error: error.message,
//     });
//   }
// };

