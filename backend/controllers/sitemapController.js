const Product = require('../models/Product');
const Category = require('../models/Category');
const { Blog } = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');

const STATIC_ROUTES = [
  '', 'shop', 'about', 'founder', 'contact', 'blog', 'knowledge-center',
  'privacy-policy', 'refund-policy', 'shipping-policy', 'cancellation-policy', 'terms-and-conditions',
];

/**
 * @route GET /sitemap.xml
 * Public. Dynamically generates a sitemap covering static routes, published
 * products, active categories, and published blog posts.
 */
const getSitemap = asyncHandler(async (req, res) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const [products, categories, blogs] = await Promise.all([
    Product.find({ status: 'published', deletedAt: null }).select('slug updatedAt'),
    Category.find({ status: 'active', deletedAt: null }).select('slug updatedAt'),
    Blog.find({ status: 'published' }).select('slug updatedAt'),
  ]);

  const urlEntries = [];

  STATIC_ROUTES.forEach((route) => {
    urlEntries.push(`<url><loc>${baseUrl}/${route}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
  });

  products.forEach((p) => {
    urlEntries.push(
      `<url><loc>${baseUrl}/product/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`
    );
  });

  categories.forEach((c) => {
    urlEntries.push(
      `<url><loc>${baseUrl}/category/${c.slug}</loc><lastmod>${c.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
    );
  });

  blogs.forEach((b) => {
    urlEntries.push(
      `<url><loc>${baseUrl}/blog/${b.slug}</loc><lastmod>${b.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = { getSitemap };
