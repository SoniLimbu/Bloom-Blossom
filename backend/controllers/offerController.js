const Offer = require('../models/Offer');

// @desc    Get active offers
// @route   GET /api/offers
const getOffers = async (req, res) => {
  const offers = await Offer.find({ isActive: true }).populate('applicableProducts', 'name images price');
  res.json(offers);
};

// @desc    Get all offers (admin)
// @route   GET /api/offers/admin
const getAllOffers = async (req, res) => {
  const offers = await Offer.find({}).sort({ createdAt: -1 });
  res.json(offers);
};

// @desc    Create offer (admin)
// @route   POST /api/offers
const createOffer = async (req, res) => {
  const offer = await Offer.create(req.body);
  res.status(201).json(offer);
};

// @desc    Update offer (admin)
// @route   PUT /api/offers/:id
const updateOffer = async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  res.json(offer);
};

// @desc    Delete offer (admin)
// @route   DELETE /api/offers/:id
const deleteOffer = async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  await offer.deleteOne();
  res.json({ message: 'Offer removed' });
};

module.exports = { getOffers, getAllOffers, createOffer, updateOffer, deleteOffer };
