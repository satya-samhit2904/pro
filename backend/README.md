# V Excel Tutors - Backend API

Professional Node.js/Express REST API with MongoDB for the V Excel Tutors platform.

## 🏗️ Architecture

```
backend/
├── config/
│   └── database.js           # MongoDB connection with error handling
├── controllers/
│   ├── studentController.js  # Student business logic
│   └── tutorController.js    # Tutor business logic
├── middleware/
│   └── validators.js         # express-validator rules
├── models/
│   ├── Student.js           # Mongoose schema for students
│   └── Tutor.js             # Mongoose schema for tutors
├── routes/
│   ├── studentRoutes.js     # Student endpoint definitions
│   └── tutorRoutes.js       # Tutor endpoint definitions
├── .env                     # Environment configuration
├── .env.example            # Example environment variables
├── package.json            # Dependencies and scripts
└── server.js               # Express app configuration
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode (auto-restart)
npm run dev
```

## 📦 Dependencies

### Core
- **express** (^4.18.2) - Web framework
- **mongoose** (^8.0.3) - MongoDB ODM
- **dotenv** (^16.3.1) - Environment variables

### Security & Validation
- **express-validator** (^7.0.1) - Request validation
- **helmet** (^7.1.0) - Security headers
- **cors** (^2.8.5) - Cross-origin resource sharing
- **express-rate-limit** (^7.1.5) - Rate limiting

### Development
- **nodemon** (^3.0.2) - Auto-restart on file changes

## 🔧 Configuration

### Environment Variables (.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/v-excel-tutors
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/v-excel-tutors

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Health & Info

#### GET /
Get API documentation and available endpoints
```bash
curl http://localhost:5000/
```

#### GET /api/health
Health check endpoint
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-30T12:00:00.000Z",
  "environment": "development"
}
```

### Student Endpoints

#### POST /api/students/register
Register a new student

Request:
```bash
curl -X POST http://localhost:5000/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "grade": "10",
    "schoolName": "ABC High School",
    "location": "New York",
    "curriculum": "CBSE",
    "subjects": "Math, Physics, Chemistry",
    "daysPerWeek": 3,
    "preferredDays": ["Monday", "Wednesday", "Friday"],
    "preferredTimings": "4 PM - 6 PM",
    "contact": "+1234567890",
    "email": "john@example.com"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Student registered successfully!",
  "student_id": "507f1f77bcf86cd799439011",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "studentName": "John Doe",
    "email": "john@example.com",
    "grade": "10",
    "registrationDate": "2025-10-30T12:00:00.000Z"
  }
}
```

#### GET /api/students
Get all students (paginated, admin endpoint)

Query parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional: pending, contacted, matched, inactive)
- `grade` (optional: filter by grade)

```bash
curl http://localhost:5000/api/students?page=1&limit=10&status=pending
```

#### GET /api/students/:id
Get student by ID

```bash
curl http://localhost:5000/api/students/507f1f77bcf86cd799439011
```

#### PATCH /api/students/:id/status
Update student status (admin endpoint)

```bash
curl -X PATCH http://localhost:5000/api/students/507f1f77bcf86cd799439011/status \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

### Tutor Endpoints

#### POST /api/tutors/register
Register a new tutor

Request:
```bash
curl -X POST http://localhost:5000/api/tutors/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "age": 30,
    "educationQualification": "M.Sc Mathematics",
    "yearsOfTeachingExperience": 5,
    "workingInSchool": "Y",
    "onlineClassesExperience": "3 years online teaching",
    "subjects": "Mathematics, Statistics",
    "expectedFees": "₹1000/hour",
    "location": "Mumbai",
    "devicesUsed": "Laptop, iPad",
    "contact": "+919876543210",
    "email": "jane@example.com"
  }'
```

#### GET /api/tutors
Get all tutors (paginated, admin endpoint)

Query parameters:
- `page`, `limit`, `status`, `verified`

```bash
curl http://localhost:5000/api/tutors?page=1&limit=10&verified=true
```

#### GET /api/tutors/:id
Get tutor by ID

#### PATCH /api/tutors/:id/status
Update tutor status and verification

```bash
curl -X PATCH http://localhost:5000/api/tutors/507f1f77bcf86cd799439012/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved", "verified": true}'
```

#### GET /api/tutors/search
Search tutors by subject

```bash
curl "http://localhost:5000/api/tutors/search?subject=Mathematics"
```

## 🗄️ Database Models

### Student Schema
```javascript
{
  studentName: String (required, 2-100 chars),
  grade: String (required, enum),
  year: Number (conditional),
  schoolName: String (required),
  location: String (required),
  curriculum: String (required, enum),
  otherCurriculum: String (conditional),
  subjects: String (required),
  daysPerWeek: Number (1-7),
  preferredDays: [String] (must match daysPerWeek),
  preferredTimings: String,
  contact: String (validated phone),
  email: String (validated, unique),
  status: String (enum: pending, contacted, matched, inactive),
  timestamps: true
}
```

### Tutor Schema
```javascript
{
  name: String (required, 2-100 chars),
  age: Number (18-100),
  educationQualification: String (required),
  yearsOfTeachingExperience: Number (0-80),
  workingInSchool: String (Y/N),
  onlineClassesExperience: String,
  subjects: String (text-indexed),
  expectedFees: String,
  location: String,
  devicesUsed: String,
  contact: String (validated phone),
  email: String (validated, unique),
  status: String (enum: pending, approved, active, inactive),
  verified: Boolean,
  timestamps: true
}
```

## 🛡️ Security Features

### Rate Limiting
- 100 requests per 15 minutes per IP address
- Applied to all `/api/*` endpoints

### CORS
- Configurable allowed origins
- Credentials support enabled
- Environment-based whitelist

### Input Validation
- Server-side validation with express-validator
- Sanitization of all inputs
- Proper error messages

### Security Headers
- Helmet.js middleware
- Protection against common vulnerabilities

### MongoDB Protection
- Mongoose handles injection prevention
- Input sanitization
- Type validation at schema level

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test student registration
curl -X POST http://localhost:5000/api/students/register \
  -H "Content-Type: application/json" \
  -d @test-student.json
```

### Automated Testing
```bash
# Run test script from project root
cd ..
node test-api.js
```

## 🔍 Monitoring & Debugging

### Check Logs
All requests and errors are logged to console:
```bash
npm start
# Watch the terminal for logs
```

### MongoDB Connection
Check database connection status in startup logs:
```
MongoDB Connected: localhost
Database Name: v-excel-tutors
```

### View Data
```bash
# Using MongoDB Compass (GUI)
# Connect to: mongodb://localhost:27017
# Database: v-excel-tutors

# Using mongosh
mongosh
use v-excel-tutors
db.students.find().pretty()
db.tutors.find().pretty()

# Count documents
db.students.countDocuments()
db.tutors.countDocuments()
```

## 🚢 Deployment

### Environment Variables
Set these in your deployment platform:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/v-excel-tutors
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
```

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set NODE_ENV=production
heroku config:set ALLOWED_ORIGINS=https://yourdomain.com
git push heroku main
```

### Railway/Render
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

### PM2 (VPS/Server)
```bash
npm install -g pm2
pm2 start server.js --name "v-excel-api"
pm2 save
pm2 startup
```

## 📊 Performance

### Indexes
- `students`: email, contact, grade, curriculum, location, status
- `tutors`: email, contact, location, status, verified, subjects (text)

### Response Times
- Health check: ~5ms
- Registration: ~50-100ms
- Get all (paginated): ~20-50ms
- Search: ~30-70ms

## 🐛 Common Issues

### MongoDB Connection Timeout
```
Solution: Check if MongoDB is running
Windows: net start MongoDB
macOS: brew services start mongodb-community
Linux: sudo systemctl start mongod
```

### Port Already in Use
```
Solution: Change PORT in .env or kill the process
lsof -ti:5000 | xargs kill -9  # macOS/Linux
taskkill /PID <PID> /F         # Windows
```

### Validation Errors
```
Response will include specific field errors:
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Email is required", "Age must be at least 18"]
}
```

## 📚 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## 🔄 API Versioning

Currently: v1 (implicit)
Future: `/api/v2/...` for breaking changes

## 📖 Further Reading

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

**Backend maintained with ❤️ for V Excel Tutors**
