const { body } = require('express-validator');

// Student registration validation
const validateStudentRegistration = [
  body('studentName')
    .trim()
    .notEmpty().withMessage('Student name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('grade')
    .notEmpty().withMessage('Grade is required')
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Undergraduate', 'Postgraduate'])
    .withMessage('Invalid grade'),

  body('year')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Year must be between 1 and 10'),

  body('schoolName')
    .trim()
    .notEmpty().withMessage('School/Institution name is required')
    .isLength({ max: 200 }).withMessage('School name cannot exceed 200 characters'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),

  body('curriculum')
    .notEmpty().withMessage('Curriculum is required')
    .isIn(['CBSE', 'ICSE', 'IB', 'State Board', 'Cambridge', 'Other'])
    .withMessage('Invalid curriculum'),

  body('otherCurriculum')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Other curriculum cannot exceed 100 characters'),

  body('subjects')
    .trim()
    .notEmpty().withMessage('Subjects are required')
    .isLength({ max: 500 }).withMessage('Subjects cannot exceed 500 characters'),

  body('daysPerWeek')
    .notEmpty().withMessage('Days per week is required')
    .isInt({ min: 1, max: 7 }).withMessage('Days per week must be between 1 and 7'),

  body('preferredDays')
    .isArray({ min: 1 }).withMessage('Preferred days must be an array with at least one day')
    .custom((value, { req }) => {
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      if (!value.every(day => validDays.includes(day))) {
        throw new Error('Invalid day names in preferred days');
      }
      if (value.length !== parseInt(req.body.daysPerWeek)) {
        throw new Error('Number of preferred days must match days per week');
      }
      return true;
    }),

  body('preferredTimings')
    .trim()
    .notEmpty().withMessage('Preferred timings are required')
    .isLength({ max: 200 }).withMessage('Preferred timings cannot exceed 200 characters'),

  body('contact')
    .trim()
    .notEmpty().withMessage('Contact number is required')
    .matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
    .withMessage('Invalid phone number format'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail()
];

// Tutor registration validation
const validateTutorRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tutor name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),

  body('educationQualification')
    .trim()
    .notEmpty().withMessage('Education qualification is required')
    .isLength({ max: 300 }).withMessage('Education qualification cannot exceed 300 characters'),

  body('yearsOfTeachingExperience')
    .notEmpty().withMessage('Years of teaching experience is required')
    .isInt({ min: 0, max: 80 }).withMessage('Years of experience must be between 0 and 80'),

  body('workingInSchool')
    .notEmpty().withMessage('Working in school status is required')
    .isIn(['Y', 'N']).withMessage('Invalid value for working in school'),

  body('onlineClassesExperience')
    .trim()
    .notEmpty().withMessage('Online classes experience is required')
    .isLength({ max: 500 }).withMessage('Online classes experience cannot exceed 500 characters'),

  body('subjects')
    .trim()
    .notEmpty().withMessage('Subjects are required')
    .isLength({ max: 500 }).withMessage('Subjects cannot exceed 500 characters'),

  body('expectedFees')
    .trim()
    .notEmpty().withMessage('Expected fees are required')
    .isLength({ max: 100 }).withMessage('Expected fees cannot exceed 100 characters'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),

  body('devicesUsed')
    .trim()
    .notEmpty().withMessage('Devices used information is required')
    .isLength({ max: 300 }).withMessage('Devices used cannot exceed 300 characters'),

  body('contact')
    .trim()
    .notEmpty().withMessage('Contact number is required')
    .matches(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/)
    .withMessage('Invalid phone number format'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail()
];

module.exports = {
  validateStudentRegistration,
  validateTutorRegistration
};
