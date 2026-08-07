const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  qty: Number,
  freeQty: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  paymentMethod: { type: String, default: 'COD' },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
  },
  itemsPrice: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  giftHamperAdded: { type: Boolean, default: false },
  buy2get1Applied: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
