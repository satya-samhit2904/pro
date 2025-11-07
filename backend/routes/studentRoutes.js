const express = require('express');
const router = express.Router();
const {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  exportStudentsToExcel
} = require('../controllers/studentController');
const { validateStudentRegistration } = require('../middleware/validators');

// Public routes
router.post('/register', validateStudentRegistration, registerStudent);

// Admin routes (add authentication middleware in production)
router.get('/', getAllStudents);
router.get('/export/excel', exportStudentsToExcel);
router.get('/:id', getStudentById);
router.patch('/:id/status', updateStudentStatus);

module.exports = router;
