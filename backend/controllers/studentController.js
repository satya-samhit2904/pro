const Student = require('../models/Student');
const { validationResult } = require('express-validator');

// Register a new student
const registerStudent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Extract data from request body
    const {
      studentName,
      grade,
      year,
      schoolName,
      location,
      curriculum,
      otherCurriculum,
      subjects,
      daysPerWeek,
      preferredDays,
      preferredTimings,
      contact,
      email
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ email }, { contact }]
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'A student with this email or contact number already exists'
      });
    }

    // Create new student
    const studentData = {
      studentName,
      grade,
      year,
      schoolName,
      location,
      curriculum,
      otherCurriculum,
      subjects,
      daysPerWeek,
      preferredDays,
      preferredTimings,
      contact,
      email
    };


    const student = new Student(studentData);

    // Save to database
    await student.save();
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Student registered successfully! We will contact you soon.',
      student_id: student._id,
      data: {
        id: student._id,
        studentName: student.studentName,
        email: student.email,
        grade: student.grade,
        registrationDate: student.registrationDate,
        year: student.year,
        preferredTimings: student.preferredTimings
      }
    });

  } catch (error) {
    console.error('Error registering student:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A student with this email or contact number already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'An error occurred while registering the student. Please try again later.'
    });
  }
};

// Get all students (admin endpoint)
const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, grade } = req.query;

    const query = {};
    if (status) query.status = status;
    if (grade) query.grade = grade;

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .select('-__v');

    const count = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      data: students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching students'
    });
  }
};

// Get student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-__v');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the student'
    });
  }
};

// Update student status
const updateStudentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'contacted', 'matched', 'inactive'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student status updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the student status'
    });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudentStatus
};
