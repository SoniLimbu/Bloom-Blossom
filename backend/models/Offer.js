const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['buy2get1', 'giftHamper', 'percentDiscount', 'flatDiscount'],
    required: true
  },
  discountPercent: { type: Number, default: 0 },
  discountFlat: { type: Number, default: 0 },
  minCartValue: { type: Number, default: 0 },
  minQty: { type: Number, default: 2 },
  freeQty: { type: Number, default: 1 },
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  bannerImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
