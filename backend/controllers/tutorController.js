const Tutor = require('../models/Tutor');
const { validationResult } = require('express-validator');
const ExcelJS = require('exceljs');

// Register a new tutor
const registerTutor = async (req, res) => {
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
      name,
      age,
      educationQualification,
      yearsOfTeachingExperience,
      workingInSchool,
      onlineClassesExperience,
      subjects,
      expectedFees,
      location,
      devicesUsed,
      contact,
      email
    } = req.body;

    // Check if tutor already exists
    const existingTutor = await Tutor.findOne({
      $or: [{ email }, { contact }]
    });

    if (existingTutor) {
      return res.status(409).json({
        success: false,
        message: 'A tutor with this email or contact number already exists'
      });
    }

    // Create new tutor
    const tutor = new Tutor({
      name,
      age,
      educationQualification,
      yearsOfTeachingExperience,
      workingInSchool,
      onlineClassesExperience,
      subjects,
      expectedFees,
      location,
      devicesUsed,
      contact,
      email
    });

    // Save to database
    await tutor.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Tutor registered successfully! We will review your application and contact you soon.',
      tutor_id: tutor._id,
      data: {
        id: tutor._id,
        name: tutor.name,
        email: tutor.email,
        subjects: tutor.subjects,
        registrationDate: tutor.registrationDate
      }
    });

  } catch (error) {
    console.error('Error registering tutor:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A tutor with this email or contact number already exists'
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
      message: 'An error occurred while registering the tutor. Please try again later.'
    });
  }
};

// Get all tutors (admin endpoint)
const getAllTutors = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, verified } = req.query;

    const query = {};
    if (status) query.status = status;
    if (verified !== undefined) query.verified = verified === 'true';

    const tutors = await Tutor.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .select('-__v');

    const count = await Tutor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tutors,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching tutors'
    });
  }
};

// Get tutor by ID
const getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).select('-__v');

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tutor
    });

  } catch (error) {
    console.error('Error fetching tutor:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the tutor'
    });
  }
};

// Update tutor status
const updateTutorStatus = async (req, res) => {
  try {
    const { status, verified } = req.body;
    const validStatuses = ['pending', 'approved', 'active', 'inactive'];

    const updateData = {};

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      updateData.status = status;
    }

    if (verified !== undefined) {
      updateData.verified = verified;
    }

    const tutor = await Tutor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tutor updated successfully',
      data: tutor
    });

  } catch (error) {
    console.error('Error updating tutor:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the tutor'
    });
  }
};

// Search tutors by subject
const searchTutorsBySubject = async (req, res) => {
  try {
    const { subject } = req.query;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject query parameter is required'
      });
    }

    const tutors = await Tutor.find({
      $text: { $search: subject },
      status: 'active',
      verified: true
    }).select('-__v');

    res.status(200).json({
      success: true,
      data: tutors,
      count: tutors.length
    });

  } catch (error) {
    console.error('Error searching tutors:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while searching tutors'
    });
  }
};

// Export tutors data to Excel/CSV
const exportTutorsToExcel = async (req, res) => {
  try {
    const { status, verified, format = 'xlsx' } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (verified !== undefined) query.verified = verified === 'true';

    // Fetch all tutors matching the criteria
    const tutors = await Tutor.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    if (tutors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No tutors found to export'
      });
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tutors');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Contact', key: 'contact', width: 15 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Education Qualification', key: 'educationQualification', width: 35 },
      { header: 'Years of Experience', key: 'yearsOfTeachingExperience', width: 18 },
      { header: 'Working in School', key: 'workingInSchool', width: 18 },
      { header: 'Online Classes Experience', key: 'onlineClassesExperience', width: 35 },
      { header: 'Subjects', key: 'subjects', width: 40 },
      { header: 'Expected Fees', key: 'expectedFees', width: 20 },
      { header: 'Location', key: 'location', width: 25 },
      { header: 'Devices Used', key: 'devicesUsed', width: 30 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Verified', key: 'verified', width: 12 },
      { header: 'Registration Date', key: 'registrationDate', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF28A745' }
    };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add rows
    tutors.forEach(tutor => {
      worksheet.addRow({
        _id: tutor._id.toString(),
        name: tutor.name,
        email: tutor.email,
        contact: tutor.contact,
        age: tutor.age,
        educationQualification: tutor.educationQualification,
        yearsOfTeachingExperience: tutor.yearsOfTeachingExperience,
        workingInSchool: tutor.workingInSchool,
        onlineClassesExperience: tutor.onlineClassesExperience,
        subjects: tutor.subjects,
        expectedFees: tutor.expectedFees,
        location: tutor.location,
        devicesUsed: tutor.devicesUsed,
        status: tutor.status,
        verified: tutor.verified ? 'Yes' : 'No',
        registrationDate: tutor.registrationDate ? new Date(tutor.registrationDate).toLocaleDateString() : 'N/A',
        createdAt: tutor.createdAt ? new Date(tutor.createdAt).toLocaleString() : 'N/A',
        updatedAt: tutor.updatedAt ? new Date(tutor.updatedAt).toLocaleString() : 'N/A'
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
    const filename = `tutors_export_${timestamp}`;

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
    console.error('Error exporting tutors:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while exporting tutors data'
    });
  }
};

module.exports = {
  registerTutor,
  getAllTutors,
  getTutorById,
  updateTutorStatus,
  searchTutorsBySubject,
  exportTutorsToExcel
};
