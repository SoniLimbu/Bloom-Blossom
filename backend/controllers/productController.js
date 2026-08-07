const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  const query = { isAvailable: true };
  if (keyword) query.name = { $regex: keyword, $options: 'i' };
  if (category) query.category = category;
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);

  let sortObj = { createdAt: -1 };
  if (sort === 'price_asc') sortObj = { price: 1 };
  if (sort === 'price_desc') sortObj = { price: -1 };
  if (sort === 'rating') sortObj = { rating: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));
  res.json({ products, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// @desc    Get featured products
// @route   GET /api/products/featured
const getFeatured = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isAvailable: true }).limit(8);
  res.json(products);
};

// @desc    Create product (admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
  const { name, description, price, discountPrice, category, stock, isFeatured, tags } = req.body;
  const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
  const product = await Product.create({ name, description, price, discountPrice, category, stock, isFeatured, tags, images });
  res.status(201).json(product);
};

// @desc    Update product (admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const fields = ['name','description','price','discountPrice','category','stock','isFeatured','isAvailable','tags'];
  fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
  if (req.files && req.files.length > 0) {
    product.images = req.files.map(f => `/uploads/${f.filename}`);
  }
  const updated = await product.save();
  res.json(updated);
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

// @desc    Create review
// @route   POST /api/products/:id/reviews
const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((a, r) => r.rating + a, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
};

// @desc    Get all products (admin, includes unavailable)
// @route   GET /api/products/admin/all
const getAdminProducts = async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
};

module.exports = { getProducts, getProduct, getFeatured, createProduct, updateProduct, deleteProduct, createReview, getAdminProducts };
