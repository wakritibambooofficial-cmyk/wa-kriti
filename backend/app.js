const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const apiRoutes = require('./routes/index');
const swaggerSpec = require('./config/swagger');

const webhookRoutes = require('./routes/webhookRoutes');

const { getSitemap } = require('./controllers/sitemapController');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');
const { globalLimiter } = require('./middlewares/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// Trust proxy (needed for correct req.ip / secure cookies behind Nginx/Render/Railway)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/webhooks', webhookRoutes);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Sanitization against NoSQL injection and XSS
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Compression
app.use(compression());

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// Global rate limiting
app.use('/api', globalLimiter);

// SEO — dynamic sitemap
app.get('/sitemap.xml', getSitemap);

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}`, apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Wa-Kriti Bamboo E-Commerce API',
    docs: `/api/docs`,
  });
});

// 404 + Error handling (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
