const express = require('express');
const router = express.Router();

const createOrderController = require('../controllers/createOrderController');
// const updateOrderController = require('../controllers/updateOrderController');
const {getOrderbyIdController} = require('../controllers/getOrderbyIdController');

const {updateOrderController} = require('../controllers/updateOrderController');

// Create a new order
router.post('/create_order', createOrderController.createOrderController);

router.get('/getGiftData/:id', getOrderbyIdController);
router.get('/updateGiftWin:id', updateOrderController);

module.exports = router;
