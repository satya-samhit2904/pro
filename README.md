# V Excel Tutors - Complete Platform

A professional tutor matching platform with a fully functional **Node.js/Express** backend and **MongoDB** database, separated into clean frontend and backend architecture.

## 🏗️ Project Structure

```
v-excel-tutors/
│
├── backend/                        # Backend API Server
│   ├── config/
│   │   └── database.js            # MongoDB connection
│   ├── controllers/
│   │   ├── studentController.js   # Student business logic
│   │   └── tutorController.js     # Tutor business logic
│   ├── middleware/
│   │   └── validators.js          # Request validation
│   ├── models/
│   │   ├── Student.js             # Student schema
│   │   └── Tutor.js               # Tutor schema
│   ├── routes/
│   │   ├── studentRoutes.js       # Student endpoints
│   │   └── tutorRoutes.js         # Tutor endpoints
│   ├── .env                       # Environment config
│   ├── .env.example              # Example env vars
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server
│
├── frontend/                      # Frontend Web Application
│   ├── css/
│   │   ├── styles.css            # Landing page styles
│   │   ├── StudentStyle.css      # Student form styles
│   │   └── tutorstyle.css        # Tutor form styles
│   ├── js/
│   │   ├── Studentscript.js      # Student form logic
│   │   └── tutorscript.js        # Tutor form logic
│   ├── index.html                # Landing page
│   ├── student.html              # Student registration
│   └── tutor.html                # Tutor registration
│
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
├── SETUP_INSTRUCTIONS.md         # Quick setup guide
└── test-api.js                   # API testing script
```

## ✨ Features

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ Comprehensive validation (client & server)
- ✅ Error handling and logging
- ✅ CORS configuration
- ✅ Rate limiting (100 req/15min)
- ✅ Security headers (Helmet.js)
- ✅ Environment-based configuration

### Frontend
- ✅ Responsive design
- ✅ Multi-step forms with validation
- ✅ Real-time email/phone validation
- ✅ Dynamic conditional fields
- ✅ Loading states and error handling
- ✅ Clean, modern UI

### Database Models
- **Students**: Personal info, grades, subjects, schedule preferences
- **Tutors**: Qualifications, experience, subjects, fees, verification

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- A web browser

### 1. Install MongoDB

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Run installer with default settings
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

### 2. Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment (already set for local MongoDB)
# .env file is pre-configured with:
# MONGODB_URI=mongodb://localhost:27017/v-excel-tutors
# PORT=5000

# Start the server
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║          V Excel Tutors API Server                    ║
║  Server running on: http://localhost:5000             ║
╚═══════════════════════════════════════════════════════╝

MongoDB Connected: localhost
```

### 3. Setup Frontend

**Option A - VS Code Live Server:**
1. Install "Live Server" extension
2. Right-click `frontend/index.html`
3. Select "Open with Live Server"

**Option B - Python:**
```bash
cd frontend
python -m http.server 5500
```

**Option C - Node.js:**
```bash
cd frontend
npx http-server -p 5500
```

Then navigate to: **http://localhost:5500**

### 4. Test the API

```bash
# Make sure backend is running first
node test-api.js
```

## 📡 API Endpoints

### Health & Info
```
GET  /                    # API documentation
GET  /api/health          # Health check
```

### Student Endpoints
```
POST   /api/students/register          # Register a student
GET    /api/students                   # Get all students (paginated)
GET    /api/students/:id               # Get student by ID
PATCH  /api/students/:id/status        # Update student status
```

### Tutor Endpoints
```
POST   /api/tutors/register            # Register a tutor
GET    /api/tutors                     # Get all tutors (paginated)
GET    /api/tutors/:id                 # Get tutor by ID
PATCH  /api/tutors/:id/status          # Update tutor status
GET    /api/tutors/search?subject=...  # Search tutors by subject
```

## 📋 Example API Request

### Register a Student
```bash
curl -X POST http://localhost:5000/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "grade": "10",
    "schoolName": "ABC School",
    "location": "New York",
    "curriculum": "CBSE",
    "subjects": "Math, Physics",
    "daysPerWeek": 3,
    "preferredDays": ["Monday", "Wednesday", "Friday"],
    "preferredTimings": "4 PM - 6 PM",
    "contact": "+1234567890",
    "email": "john@example.com"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Student registered successfully!",
  "student_id": "507f1f77bcf86cd799439011",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "studentName": "John Doe",
    "email": "john@example.com",
    "grade": "10"
  }
}
```

## 🔧 Development

### Backend Development Mode
```bash
cd backend
npm run dev  # Auto-restarts on file changes
```

### Frontend Development
Just use Live Server or your preferred local server in the `frontend/` directory.

### View Database
**MongoDB Compass:**
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Database: `v-excel-tutors`
4. Collections: `students`, `tutors`

**MongoDB Shell:**
```bash
mongosh
use v-excel-tutors
db.students.find().pretty()
db.tutors.find().pretty()
```

## 🛡️ Security Features

- Input validation (express-validator)
- MongoDB injection prevention
- Rate limiting
- CORS protection
- Security headers (Helmet.js)
- Environment variables for secrets

## 📦 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- express-validator
- cors
- helmet
- express-rate-limit
- dotenv

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API

## 🚢 Deployment

### Backend Deployment (Heroku Example)
```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set NODE_ENV=production
git init
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Frontend Deployment
Deploy the `frontend/` folder to:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

Update API URLs in `frontend/js/*.js` to point to your deployed backend.

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Windows: Services -> MongoDB
# macOS: brew services list
# Linux: sudo systemctl status mongod
```

### CORS Errors
Add your frontend URL to `backend/.env`:
```
ALLOWED_ORIGINS=http://localhost:5500,https://yourdomain.com
```

### Port Already in Use
Change port in `backend/.env`:
```
PORT=3000
```

## 📚 Documentation

- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Detailed setup guide
- [Backend README](backend/README.md) - Backend-specific docs
- [API Documentation](http://localhost:5000) - Interactive API docs (when server is running)

## 🎯 Future Enhancements

- [ ] Admin dashboard
- [ ] JWT authentication
- [ ] Email notifications
- [ ] SMS integration
- [ ] Tutor-student matching algorithm
- [ ] Payment gateway
- [ ] Video calling integration
- [ ] Rating and review system
- [ ] Booking/scheduling system

## 📄 License

ISC

## 🤝 Support

For issues and questions, please create an issue on GitHub.

---

**Built with ❤️ for V Excel Tutors**
