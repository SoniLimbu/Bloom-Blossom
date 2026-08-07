const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Product = require('./models/Product');
const Offer = require('./models/Offer');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bloomblossomdb');
  console.log('MongoDB connected');
};

const products = [
  { name: 'Red Rose Bouquet', description: 'A stunning bouquet of 12 fresh red roses, symbolizing love and passion. Perfect for anniversaries and Valentine\'s Day.', price: 1299, discountPrice: 999, category: 'roses', stock: 50, isFeatured: true, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/BEAUTIFUL%20RED%20ROSES.jpg?width=800'], tags: ['love', 'anniversary', 'bestseller'] },
  { name: 'Pink Lily Arrangement', description: 'Beautiful pink lilies elegantly arranged. Known for their sweet fragrance and stunning appearance.', price: 1599, discountPrice: 0, category: 'lilies', stock: 30, isFeatured: true, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Pink%20Lily%20Lilium%20sp%20Flower%20Closeup%202511px.jpg?width=800'], tags: ['fragrant', 'elegant'] },
  { name: 'Sunflower Delight', description: 'Bright and cheerful sunflowers to brighten anyone\'s day. A bundle of 10 fresh sunflowers.', price: 899, discountPrice: 0, category: 'sunflowers', stock: 40, isFeatured: true, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/A%20Sunflower.jpg?width=800'], tags: ['cheerful', 'summer'] },
  { name: 'Purple Orchid Set', description: 'Exotic purple orchids in a premium ceramic pot. Long-lasting and low maintenance.', price: 2499, discountPrice: 1999, category: 'orchids', stock: 20, isFeatured: true, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Purple%20Orchid%20Flower.jpg?width=800'], tags: ['exotic', 'premium', 'plant'] },
  { name: 'Mixed Flower Bouquet', description: 'A vibrant mix of seasonal flowers including roses, lilies, and baby\'s breath. Perfect for all occasions.', price: 1199, discountPrice: 0, category: 'mixed', stock: 35, isFeatured: false, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Flower%20bouquet.jpg?width=800'], tags: ['colorful', 'occasion'] },
  { name: 'White Tulip Bunch', description: 'Elegant white tulips representing purity and grace. A bunch of 15 fresh tulips.', price: 1399, discountPrice: 0, category: 'tulips', stock: 25, isFeatured: false, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/White%20Tulips.JPG?width=800'], tags: ['elegant', 'wedding'] },
  { name: 'Luxury Rose Hamper', description: 'Premium gift hamper with 24 roses, chocolates, and a personalized card. Ultimate romantic gift.', price: 4999, discountPrice: 3999, category: 'hamper', stock: 15, isFeatured: true, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Bouquet%20de%20roses%20roses.jpg?width=800'], tags: ['luxury', 'gift', 'premium'] },
  { name: 'Forget-Me-Not Posy', description: 'Delicate forget-me-not flowers in soft blue and pink. A symbol of lasting memories.', price: 699, discountPrice: 0, category: 'mixed', stock: 45, isFeatured: false, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Forget%20me%20not.jpg?width=800'], tags: ['delicate', 'memories'] },
  { name: 'Garden Plant Collection', description: 'A collection of 3 indoor plants perfect for home decor. Includes peace lily, pothos, and snake plant.', price: 1899, discountPrice: 1499, category: 'plants', stock: 20, isFeatured: false, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Plants.jpg?width=800'], tags: ['indoor', 'home decor'] },
  { name: 'Bridal Bouquet Premium', description: 'Handcrafted bridal bouquet with white roses, peonies and greenery. Made to order.', price: 5999, discountPrice: 0, category: 'bouquets', stock: 10, isFeatured: true, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/White%20rose%20bridal%20bouquet.jpg?width=800'], tags: ['bridal', 'wedding', 'premium'] },
  { name: 'Carnation Fiesta', description: 'Colorful carnations in red, pink and white. A festive and long-lasting flower choice.', price: 799, discountPrice: 0, category: 'mixed', stock: 60, isFeatured: false, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/Carnation%20flower.jpg?width=800'], tags: ['festive', 'long-lasting'] },
  { name: 'Grand Celebration Hamper', description: 'The ultimate celebration hamper with 50 roses, premium chocolates, wine, and spa voucher.', price: 12999, discountPrice: 9999, category: 'hamper', stock: 5, isFeatured: true, images: ['https://commons.wikimedia.org/wiki/Special:FilePath/BEAUTIFUL%20RED%20ROSES.jpg?width=800'], tags: ['luxury', 'celebration', 'grand'] },
];

const offers = [
  { title: '🌹 Buy 2 Get 1 Free!', description: 'Add any 2 of the same flower to your cart and get 1 absolutely free! Limited time offer.', type: 'buy2get1', minQty: 2, freeQty: 1, isActive: true },
  { title: '🎁 Gift Hamper Reward', description: 'Shop flowers worth ₹10,000 or more and receive our exclusive Premium Gift Hamper absolutely FREE!', type: 'giftHamper', minCartValue: 10000, isActive: true },
  { title: '🚚 Free Shipping on ₹2000+', description: 'Get free delivery on all orders above ₹2,000. Fresh flowers delivered to your doorstep!', type: 'flatDiscount', discountFlat: 150, minCartValue: 2000, isActive: true },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Offer.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@bloomblossom.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create test customer
    await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'customer123',
      role: 'customer',
      phone: '9800000000',
    });

    // Create products
    await Product.insertMany(products);

    // Create offers
    await Offer.insertMany(offers);

    console.log('✅ Data seeded successfully!');
    console.log('👤 Admin: admin@bloomblossom.com / admin123');
    console.log('👤 Customer: customer@test.com / customer123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();