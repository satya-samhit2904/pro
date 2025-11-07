const express = require('express');
const router = express.Router();
const {
  registerTutor,
  getAllTutors,
  getTutorById,
  updateTutorStatus,
  searchTutorsBySubject
} = require('../controllers/tutorController');
const { validateTutorRegistration } = require('../middleware/validators');

// Public routes
router.post('/register', validateTutorRegistration, registerTutor);
router.get('/search', searchTutorsBySubject);

// Admin routes (add authentication middleware in production)
router.get('/', getAllTutors);
router.get('/:id', getTutorById);
router.patch('/:id/status', updateTutorStatus);

module.exports = router;
