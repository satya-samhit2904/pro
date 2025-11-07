const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required'],
    enum: {
      values: [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
        'Undergraduate', 'Postgraduate'
      ],
      message: '{VALUE} is not a valid grade'
    }
  },
  year: {
    type: String,
  },
  schoolName: {
    type: String,
    required: [true, 'School/Institution name is required'],
    trim: true,
    maxlength: [200, 'School name cannot exceed 200 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  curriculum: {
    type: String,
    required: [true, 'Curriculum is required'],
    enum: {
      values: ['CBSE', 'ICIC', 'IB', 'State Board', 'Other'],
      message: '{VALUE} is not a valid curriculum'
    }
  },
  otherCurriculum: {
    type: String,
    trim: true,
    maxlength: [100, 'Other curriculum cannot exceed 100 characters'],
    required: function() {
      return this.curriculum === 'Other';
    }
  },
  subjects: {
    type: String,
    required: [true, 'Subjects are required'],
    trim: true,
    maxlength: [500, 'Subjects cannot exceed 500 characters']
  },
  daysPerWeek: {
    type: Number,
    required: [true, 'Days per week is required'],
    min: [1, 'Must select at least 1 day'],
    max: [7, 'Cannot exceed 7 days per week']
  },
  preferredDays: {
    type: [String],
    required: [true, 'Preferred days are required'],
    validate: {
      validator: function(days) {
        const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.length > 0 &&
               days.length === this.daysPerWeek &&
               days.every(day => validDays.includes(day));
      },
      message: 'Preferred days must match the number of days per week and be valid day names'
    }
  },
  preferredTimings: {
    type: String,
    required: [true, 'Preferred timings are required'],
    trim: true,
    maxlength: [200, 'Preferred timings cannot exceed 200 characters']
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
    enum: ['pending', 'contacted', 'matched', 'inactive'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for faster queries
studentSchema.index({ email: 1, contact: 1 });
studentSchema.index({ grade: 1, curriculum: 1 });
studentSchema.index({ location: 1 });
studentSchema.index({ status: 1 });

// Pre-save middleware to handle conditional validation
studentSchema.pre('save', function(next) {
  // Remove year if not undergraduate/postgraduate
  if (this.grade !== 'undergraduate' && this.grade !== 'postgraduate') {
    this.year = undefined;
  }

  // Remove otherCurriculum if curriculum is not 'Other'
  if (this.curriculum !== 'Other') {
    this.otherCurriculum = undefined;
  }

  next();
});

module.exports = mongoose.model('Student', studentSchema);
