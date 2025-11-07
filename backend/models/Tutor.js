const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tutor name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Age must be at least 18'],
    max: [100, 'Age cannot exceed 100']
  },
  educationQualification: {
    type: String,
    required: [true, 'Education qualification is required'],
    trim: true,
    maxlength: [300, 'Education qualification cannot exceed 300 characters']
  },
  yearsOfTeachingExperience: {
    type: Number,
    required: [true, 'Years of teaching experience is required'],
    min: [0, 'Years of experience cannot be negative'],
    max: [80, 'Years of experience seems too high']
  },
  workingInSchool: {
    type: String,
    required: [true, 'Working in school status is required'],
    enum: {
      values: ['Y', 'N'],
      message: '{VALUE} is not a valid option. Use Y or N'
    }
  },
  onlineClassesExperience: {
    type: String,
    required: [true, 'Online classes experience is required'],
    trim: true,
    maxlength: [500, 'Online classes experience cannot exceed 500 characters']
  },
  subjects: {
    type: String,
    required: [true, 'Subjects are required'],
    trim: true,
    maxlength: [500, 'Subjects cannot exceed 500 characters']
  },
  expectedFees: {
    type: String,
    required: [true, 'Expected fees are required'],
    trim: true,
    maxlength: [100, 'Expected fees cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  devicesUsed: {
    type: String,
    required: [true, 'Devices used information is required'],
    trim: true,
    maxlength: [300, 'Devices used cannot exceed 300 characters']
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // International phone number validation
        return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // RFC 5321 compliant email validation
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v);
      },
      message: 'Please enter a valid email address'
    },
    unique: true,
    index: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'inactive'],
    default: 'pending'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for faster queries
tutorSchema.index({ email: 1, contact: 1 });
tutorSchema.index({ location: 1 });
tutorSchema.index({ status: 1, verified: 1 });
tutorSchema.index({ subjects: 'text' }); // Text index for subject search

module.exports = mongoose.model('Tutor', tutorSchema);
