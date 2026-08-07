const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, payOrder, cancelOrder, getStats } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/pay', protect, payOrder);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
