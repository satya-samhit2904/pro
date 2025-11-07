# 🚀 Quick Setup Guide - V Excel Tutors

## Complete Setup in 5 Minutes

### Step 1: Install MongoDB

**Windows:**
1. Download: https://www.mongodb.com/try/download/community
2. Run installer (keep all default options)
3. MongoDB will start automatically

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Start Backend Server

```bash
# From backend folder
npm start
```

Expected output:
```
╔═══════════════════════════════════════════════════════╗
║          V Excel Tutors API Server                    ║
║  Server running on: http://localhost:5000             ║
╚═══════════════════════════════════════════════════════╝

MongoDB Connected: localhost
Database Name: v-excel-tutors
```

### Step 4: Open Frontend

**VS Code Live Server (Recommended):**
1. Install "Live Server" extension in VS Code
2. Right-click on `frontend/index.html`
3. Select "Open with Live Server"
4. Browser opens at http://localhost:5500

**Alternative - Python:**
```bash
cd frontend
python -m http.server 5500
```

**Alternative - Node.js:**
```bash
cd frontend
npx http-server -p 5500
```

### Step 5: Test Everything Works

**Quick Browser Test:**
- Open: http://localhost:5000/api/health
- Should see: `{"success": true, "message": "Server is running"}`

**Automated Test:**
```bash
# From project root
node test-api.js
```

## ✅ Verify Installation

### 1. Test Student Registration
1. Go to http://localhost:5500/student.html
2. Fill the form:
   - Name: Test Student
   - Grade: 10
   - School: Test School
   - Location: New York
   - Curriculum: CBSE
   - Subjects: Math, Physics
   - Days: 3 (select Mon, Wed, Fri)
   - Timings: 4 PM - 6 PM
   - Contact: +1234567890
   - Email: test@example.com
3. Submit
4. Should see success message with registration ID

### 2. Test Tutor Registration
1. Go to http://localhost:5500/tutor.html
2. Fill the form and submit
3. Should see success message

### 3. View Saved Data

**Using MongoDB Compass (GUI - Recommended):**
1. Download: https://www.mongodb.com/try/download/compass
2. Open Compass
3. Connect to: `mongodb://localhost:27017`
4. Select database: `v-excel-tutors`
5. View collections: `students` and `tutors`

**Using MongoDB Shell:**
```bash
mongosh
use v-excel-tutors
db.students.find().pretty()
db.tutors.find().pretty()
```

## 🔧 Configuration

### Default Configuration
The `.env` file in `backend/` is pre-configured for local development:

```env
MONGODB_URI=mongodb://localhost:27017/v-excel-tutors
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://127.0.0.1:5500,http://localhost:5500
```

### Using MongoDB Atlas (Cloud Database)
1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster (Free M0 tier)
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (for development)
5. Get connection string
6. Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/v-excel-tutors
```

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:** Port 5000 is in use. Either:
1. Kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```
2. OR change port in `backend/.env`:
   ```env
   PORT=3000
   ```

### MongoDB Connection Failed

**Problem:** `Error connecting to MongoDB: connect ECONNREFUSED`

**Solution:** MongoDB is not running. Start it:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### CORS Error in Browser

**Problem:** `Access to fetch has been blocked by CORS policy`

**Solution:** Add your frontend URL to `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500,http://localhost:8080
```

### Frontend Files Not Loading

**Problem:** CSS/JS not loading, 404 errors

**Solution:** Make sure you're serving from the `frontend/` folder and paths are correct:
- CSS files should be in `frontend/css/`
- JS files should be in `frontend/js/`
- HTML files reference: `css/styles.css` and `js/script.js`

## 📂 Folder Structure Quick Reference

```
project/
├── backend/           ← cd here, run: npm start
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/          ← Serve with Live Server
│   ├── index.html
│   ├── css/
│   └── js/
│
└── test-api.js       ← Run from project root
```

## 🎯 Next Steps

### Development Workflow
```bash
# Terminal 1 - Backend (auto-restart on changes)
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
# Use Live Server OR:
python -m http.server 5500
```

### Check Running Services
- Backend API: http://localhost:5000
- Frontend: http://localhost:5500
- MongoDB: mongodb://localhost:27017

### API Documentation
Visit http://localhost:5000 when backend is running for full API documentation.

## 💡 Tips

1. **Development:** Use `npm run dev` in backend for auto-restart
2. **Database:** Use MongoDB Compass for easy database viewing
3. **Testing:** Run `node test-api.js` after any backend changes
4. **Debugging:** Check browser console (F12) for frontend errors
5. **Logs:** Backend terminal shows all API requests and errors

## ✨ You're Ready!

Everything should be working now. Try registering a student or tutor and check MongoDB to see the data saved!

**Need Help?** Check the main [README.md](README.md) for detailed documentation.
