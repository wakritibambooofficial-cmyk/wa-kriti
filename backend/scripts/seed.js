// /**
//  * Database seed script.
//  * Run with: npm run seed
//  *
//  * Creates:
//  *  - One admin user (email from ADMIN_EMAILS, password 'Admin@12345')
//  *  - A handful of sample categories
//  *  - A handful of sample published products
//  *
//  * Safe to re-run: skips creation of records that already exist.
//  */
// require('dotenv').config();
// const mongoose = require('mongoose');
// const connectDB = require('../config/db');
// const User = require('../models/User');
// const Category = require('../models/Category');
// const Product = require('../models/Product');
// const logger = require('../utils/logger');

// const SAMPLE_CATEGORIES = [
//   { name: 'Furniture', description: 'Handcrafted bamboo furniture for every room', isFeatured: true },
//   { name: 'Kitchenware', description: 'Sustainable bamboo kitchen essentials', isFeatured: true },
//   { name: 'Decor', description: 'Bamboo home decor and accents', isFeatured: true },
//   { name: 'Tea & Wellness', description: 'Bamboo tea sets and wellness products', isFeatured: true },
//   { name: 'Garden', description: 'Bamboo planters and garden accessories', isFeatured: false },
// ];

// const seed = async () => {
//   await connectDB();

//   // 1. Admin user
//   const adminEmail = (process.env.ADMIN_EMAILS || 'admin@wakriti.com').split(',')[0].trim();
//   let admin = await User.findOne({ email: adminEmail });
//   if (!admin) {
//     admin = await User.create({
//       firstName: 'Wa-Kriti',
//       lastName: 'Admin',
//       email: adminEmail,
//       password: 'Admin@12345',
//       role: 'admin',
//       emailVerified: true,
//     });
//     logger.info(`Seeded admin user: ${adminEmail} / Admin@12345 (please change after first login)`);
//   } else {
//     logger.info(`Admin user already exists: ${adminEmail}`);
//   }

//   // 2. Categories
//   const categoryDocs = {};
//   for (const cat of SAMPLE_CATEGORIES) {
//     let category = await Category.findOne({ name: cat.name });
//     if (!category) {
//       category = await Category.create({ ...cat, status: 'active', createdBy: admin._id });
//       logger.info(`Seeded category: ${cat.name}`);
//     }
//     categoryDocs[cat.name] = category;
//   }

//   // 3. Sample products
//   const SAMPLE_PRODUCTS = [
//     {
//       name: 'Premium Bamboo Dining Chair',
//       category: categoryDocs['Furniture']._id,
//       shortDescription: 'Elegant handcrafted bamboo dining chair with a natural finish.',
//       price: 3499,
//       comparePrice: 4299,
//       stockQuantity: 40,
//       sku: 'WAK-FUR-0001',
//       status: 'published',
//       isBestSeller: true,
//       isNewArrival: false,
//     },
//     {
//       name: 'Bamboo Kitchen Utensil Set',
//       category: categoryDocs['Kitchenware']._id,
//       shortDescription: 'A 6-piece bamboo kitchen utensil set, smooth and food-safe.',
//       price: 899,
//       comparePrice: 1199,
//       stockQuantity: 100,
//       sku: 'WAK-KIT-0001',
//       status: 'published',
//       isNewArrival: true,
//     },
//     {
//       name: 'Bamboo Wall Decor Panel',
//       category: categoryDocs['Decor']._id,
//       shortDescription: 'Handwoven bamboo wall panel to add natural warmth to any room.',
//       price: 1599,
//       comparePrice: 1999,
//       stockQuantity: 25,
//       sku: 'WAK-DEC-0001',
//       status: 'published',
//       isTrending: true,
//     },
//     {
//       name: 'Bamboo Tea Ceremony Set',
//       category: categoryDocs['Tea & Wellness']._id,
//       shortDescription: 'A complete bamboo tea set for a mindful tea ceremony experience.',
//       price: 1299,
//       comparePrice: 1599,
//       stockQuantity: 60,
//       sku: 'WAK-TEA-0001',
//       status: 'published',
//       isNewArrival: true,
//     },
//     {
//       name: 'Bamboo Garden Planter Set',
//       category: categoryDocs['Garden']._id,
//       shortDescription: 'A set of 3 bamboo planters, perfect for herbs and small plants.',
//       price: 749,
//       comparePrice: 999,
//       stockQuantity: 80,
//       sku: 'WAK-GAR-0001',
//       status: 'published',
//     },
//   ];

//   for (const p of SAMPLE_PRODUCTS) {
//     const existing = await Product.findOne({ sku: p.sku });
//     if (!existing) {
//       await Product.create({ ...p, createdBy: admin._id, material: 'Bamboo', isHandmade: true, isEcoFriendly: true, isMadeInIndia: true });
//       logger.info(`Seeded product: ${p.name}`);
//     }
//   }

//   logger.info('Seeding complete.');
//   await mongoose.connection.close();
//   process.exit(0);
// };

// seed().catch((error) => {
//   logger.error(`Seeding failed: ${error.message}`);
//   process.exit(1);
// });

/**
 * Seed Homepage Features Only
 * Run with: npm run seed
 */

require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Feature = require('../models/Feature');
const logger = require('../utils/logger');

const SAMPLE_FEATURES = [
  {
    title: '100% Bamboo',
    description: 'Crafted from sustainably harvested bamboo',
    order: 1,
    status: 'active',
  },
  {
    title: 'Handcrafted',
    description: 'Made by skilled artisans across India',
    order: 2,
    status: 'active',
  },
  {
    title: 'Eco Friendly',
    description: 'Biodegradable & plastic-free packaging',
    order: 3,
    status: 'active',
  },
  {
    title: 'Fast Shipping',
    description: 'Delivered across India in 5-7 days',
    order: 4,
    status: 'active',
  },
];

const seed = async () => {
  await connectDB();

  for (const feature of SAMPLE_FEATURES) {
    const existing = await Feature.findOne({ title: feature.title });

    if (!existing) {
      await Feature.create(feature);
      logger.info(`Seeded feature: ${feature.title}`);
    } else {
      logger.info(`Feature already exists: ${feature.title}`);
    }
  }

  logger.info('Feature seeding complete.');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((error) => {
  logger.error(`Seeding failed: ${error.message}`);
  process.exit(1);
});
