import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';
import logger from 'morgan';
import createError from 'http-errors';
import mongoConnection from './utilities/connections.js';
import responseManager from './utilities/response.manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import authRoutes from './routes/auth/routes.js';
import productRoutes from './routes/product/routes.js';
import galleryRoutes from './routes/gallery/routes.js';
import blogRoutes from './routes/blog/routes.js';
import inquiryRoutes from './routes/inquiry/routes.js';
import testimonialRoutes from './routes/testimonial/routes.js';
import categoryRoutes from './routes/category/routes.js';
import uploadRoutes from './routes/upload/routes.js';
import bannerRoutes from './routes/banner/routes.js';
import orderRoutes from './routes/order/routes.js';
import usersRoutes from './routes/users/routes.js';
import settingRoutes from './routes/setting/routes.js';
import instagramRoutes from './routes/instagram/routes.js';
import reportsRoutes from './routes/reports/routes.js';
import policyRoutes from './routes/policy/routes.js';
import reviewsRoutes from './routes/reviews/routes.js';




const app = express();

// Pure REST API — no view engine needed
app.use(logger('dev'));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = { origin: '*' };
app.use(cors(corsOptions));

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Safa & Paghadi API',
      version: '1.0.0',
    },
    servers: [
      {
        url: process.env.APP_URI || `http://localhost:${process.env.PORT || 5000}`,
        description: "Rajvansh API Documentation",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'Authorization',
        }
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./routes/**/*.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  basicAuth({ users: { admin: 'admin@123' }, challenge: true }),
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: { persistAuthorization: true },
    customCssUrl: '/custom.css',
  }),
);
// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    application: "Rajvansh API",
    message: "API is running successfully 🚀",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    documentation: "/api-docs",
    health: "/health"
  });
});

// Health Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    node: process.version
  });
});
// Map Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/reviews', reviewsRoutes);

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return responseManager.badrequest({ message: 'No route found' }, res);
  }
  next(createError(404));
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = req.app.get('env') === 'development' ? error.message : 'Internal Server Error';
  res.status(status).json({ success: false, status, message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
