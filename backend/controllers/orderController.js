const Order = require('../models/Order');
const Product = require('../models/Product');

// Calculate buy2get1 - for every 2 of same product, 1 is free
const applyBuy2Get1 = (items) => {
  let buy2get1Applied = false;
  const updatedItems = items.map(item => {
    const freeQty = Math.floor(item.qty / 2);
    if (freeQty > 0) buy2get1Applied = true;
    return { ...item, freeQty };
  });
  return { updatedItems, buy2get1Applied };
};

// @desc    Create order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, notes } = req.body;
  if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'No items in order' });

  const { updatedItems, buy2get1Applied } = applyBuy2Get1(orderItems);

  // Calculate prices
  const itemsPrice = updatedItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const freeValue = updatedItems.reduce((acc, item) => acc + item.price * item.freeQty, 0);
  const giftHamperAdded = itemsPrice >= 10000;
  const shippingPrice = itemsPrice > 2000 ? 0 : 150;
  const discountAmount = freeValue;
  const totalPrice = itemsPrice - discountAmount + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: updatedItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    itemsPrice,
    discountAmount,
    shippingPrice,
    totalPrice: Math.max(0, totalPrice),
    giftHamperAdded,
    buy2get1Applied,
    notes,
  });

  // Update stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
  }

  res.status(201).json(order);
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name images').sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'name images');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status;
  if (req.body.status === 'delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
  const updated = await order.save();
  res.json(updated);
};

// @desc    Pay order (mark as paid)
// @route   PUT /api/orders/:id/pay
const payOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = { id: req.body.id, status: req.body.status, updateTime: req.body.update_time };
  const updated = await order.save();
  res.json(updated);
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  if (['shipped', 'delivered'].includes(order.status))
    return res.status(400).json({ message: 'Cannot cancel shipped/delivered order' });
  order.status = 'cancelled';
  await order.save();
  // Restore stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
  }
  res.json({ message: 'Order cancelled' });
};

// @desc    Dashboard stats (admin)
// @route   GET /api/orders/stats
const getStats = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
  res.json({ totalOrders, totalRevenue: totalRevenue[0]?.total || 0, pendingOrders, deliveredOrders });
};

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, payOrder, cancelOrder, getStats };
