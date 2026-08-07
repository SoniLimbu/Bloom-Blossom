const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getFeatured, createProduct, updateProduct, deleteProduct, createReview, getAdminProducts } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/admin/all', protect, adminOnly, getAdminProducts);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.get('/:id', getProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, createReview);

module.exports = router;
