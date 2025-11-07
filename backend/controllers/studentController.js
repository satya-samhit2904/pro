const Student = require('../models/Student');
const { validationResult } = require('express-validator');
const ExcelJS = require('exceljs');

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

// Export students data to Excel/CSV
const exportStudentsToExcel = async (req, res) => {
  try {
    const { status, grade, format = 'xlsx' } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (grade) query.grade = grade;

    // Fetch all students matching the criteria
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found to export'
      });
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Student Name', key: 'studentName', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Contact', key: 'contact', width: 15 },
      { header: 'Grade', key: 'grade', width: 15 },
      { header: 'Year', key: 'year', width: 15 },
      { header: 'School Name', key: 'schoolName', width: 30 },
      { header: 'Location', key: 'location', width: 25 },
      { header: 'Curriculum', key: 'curriculum', width: 15 },
      { header: 'Other Curriculum', key: 'otherCurriculum', width: 20 },
      { header: 'Subjects', key: 'subjects', width: 40 },
      { header: 'Days Per Week', key: 'daysPerWeek', width: 15 },
      { header: 'Preferred Days', key: 'preferredDays', width: 30 },
      { header: 'Preferred Timings', key: 'preferredTimings', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Registration Date', key: 'registrationDate', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add rows
    students.forEach(student => {
      worksheet.addRow({
        _id: student._id.toString(),
        studentName: student.studentName,
        email: student.email,
        contact: student.contact,
        grade: student.grade,
        year: student.year || 'N/A',
        schoolName: student.schoolName,
        location: student.location,
        curriculum: student.curriculum,
        otherCurriculum: student.otherCurriculum || 'N/A',
        subjects: student.subjects,
        daysPerWeek: student.daysPerWeek,
        preferredDays: Array.isArray(student.preferredDays) ? student.preferredDays.join(', ') : student.preferredDays,
        preferredTimings: student.preferredTimings,
        status: student.status,
        registrationDate: student.registrationDate ? new Date(student.registrationDate).toLocaleDateString() : 'N/A',
        createdAt: student.createdAt ? new Date(student.createdAt).toLocaleString() : 'N/A',
        updatedAt: student.updatedAt ? new Date(student.updatedAt).toLocaleString() : 'N/A'
      });
    });

    // Apply borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Set response headers
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `students_export_${timestamp}`;

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      await workbook.csv.write(res);
    } else {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      await workbook.xlsx.write(res);
    }

    res.end();

  } catch (error) {
    console.error('Error exporting students:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while exporting students data'
    });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  exportStudentsToExcel
};
