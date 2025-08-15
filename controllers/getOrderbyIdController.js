const getOrderDataModel = require('../models/getOrderDataModel');

exports.getOrderbyIdController = async (req, res) => {
  try {
    const { id } = req.params;  // read id from URL
    console.log("Id i svalaibale here in server start",id)

    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const orderData = await getOrderDataModel.getOrderDataById(id);

    if (!orderData) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(orderData);
  } catch (error) {
    console.error('Error fetching order data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
