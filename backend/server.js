require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/students', studentRoutes);
app.use('/api/tutors', tutorRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'V Excel Tutors API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      students: {
        register: 'POST /api/students/register',
        getAll: 'GET /api/students',
        getById: 'GET /api/students/:id',
        updateStatus: 'PATCH /api/students/:id/status'
      },
      tutors: {
        register: 'POST /api/tutors/register',
        getAll: 'GET /api/tutors',
        getById: 'GET /api/tutors/:id',
        updateStatus: 'PATCH /api/tutors/:id/status',
        search: 'GET /api/tutors/search?subject=...'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // CORS error
  if (err.message && err.message.includes('CORS policy')) {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       
║          V Excel Tutors API Server                    
║                                                       
║  Server running on: http://localhost:${PORT}          
║  Environment: ${process.env.NODE_ENV || 'development'}
║  MongoDB URI: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}                        
║                                                   
║  API Documentation: http://localhost:${PORT}/        
║  Health Check: http://localhost:${PORT}/api/health  
║                                                     
╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
