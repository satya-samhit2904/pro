// Simple API test script
// Run with: node test-api.js (make sure server is running first)

const BASE_URL = 'http://localhost:5000';

// Test 1: Health Check
async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health Check Response:', data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

// Test 2: Student Registration
async function testStudentRegistration() {
  console.log('\n🔍 Testing Student Registration...');
  try {
    const studentData = {
      studentName: "Test Student",
      grade: "10",
      schoolName: "Test High School",
      location: "New York",
      curriculum: "CBSE",
      subjects: "Mathematics, Physics, Chemistry",
      daysPerWeek: 3,
      preferredDays: ["Monday", "Wednesday", "Friday"],
      preferredTimings: "4 PM - 6 PM",
      contact: "+1234567890",
      email: `test.student.${Date.now()}@example.com` // Unique email
    };

    const response = await fetch(`${BASE_URL}/api/students/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData)
    });

    const data = await response.json();
    console.log('✅ Student Registration Response:', data);
    return data.student_id;
  } catch (error) {
    console.error('❌ Student Registration Failed:', error.message);
    return null;
  }
}

// Test 3: Tutor Registration
async function testTutorRegistration() {
  console.log('\n🔍 Testing Tutor Registration...');
  try {
    const tutorData = {
      name: "Test Tutor",
      age: 30,
      educationQualification: "M.Sc in Mathematics",
      yearsOfTeachingExperience: 5,
      workingInSchool: "Y",
      onlineClassesExperience: "3 years of online teaching experience",
      subjects: "Mathematics, Statistics",
      expectedFees: "₹1000/hour",
      location: "Mumbai",
      devicesUsed: "Laptop, iPad",
      contact: "+919876543210",
      email: `test.tutor.${Date.now()}@example.com` // Unique email
    };

    const response = await fetch(`${BASE_URL}/api/tutors/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tutorData)
    });

    const data = await response.json();
    console.log('✅ Tutor Registration Response:', data);
    return data.tutor_id;
  } catch (error) {
    console.error('❌ Tutor Registration Failed:', error.message);
    return null;
  }
}

// Test 4: Get Student by ID
async function testGetStudent(studentId) {
  if (!studentId) {
    console.log('\n⚠️  Skipping Get Student test - no student ID');
    return;
  }
  console.log('\n🔍 Testing Get Student by ID...');
  try {
    const response = await fetch(`${BASE_URL}/api/students/${studentId}`);
    const data = await response.json();
    console.log('✅ Get Student Response:', data);
  } catch (error) {
    console.error('❌ Get Student Failed:', error.message);
  }
}

// Test 5: Get All Students
async function testGetAllStudents() {
  console.log('\n🔍 Testing Get All Students...');
  try {
    const response = await fetch(`${BASE_URL}/api/students?page=1&limit=5`);
    const data = await response.json();
    console.log('✅ Get All Students Response:', {
      success: data.success,
      count: data.data?.length || 0,
      total: data.total,
      totalPages: data.totalPages
    });
  } catch (error) {
    console.error('❌ Get All Students Failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting API Tests...');
  console.log('📌 Make sure the server is running at', BASE_URL);

  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Server is not running. Please start the server first with: npm start');
    return;
  }

  const studentId = await testStudentRegistration();
  const tutorId = await testTutorRegistration();

  await testGetStudent(studentId);
  await testGetAllStudents();

  console.log('\n✨ All tests completed!');
  console.log('\n📊 Summary:');
  console.log(`   - Health Check: ✅`);
  console.log(`   - Student Registration: ${studentId ? '✅' : '❌'}`);
  console.log(`   - Tutor Registration: ${tutorId ? '✅' : '❌'}`);
  console.log(`   - Get Student by ID: ${studentId ? '✅' : '⚠️  Skipped'}`);
  console.log(`   - Get All Students: ✅`);
}

// Run tests
runAllTests();
