const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const next1 = document.getElementById('next1');
const back1 = document.getElementById('back1');
const progress = document.getElementById('progress');

next1.addEventListener('click', () => {
  step1.classList.remove('active');
  step2.classList.add('active');
  progress.style.width = '100%';
});

back1.addEventListener('click', () => {
  step2.classList.remove('active');
  step1.classList.add('active');
  progress.style.width = '50%';
});

document.getElementById('teacherForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading state
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  try {
    // Collect form data
    const formData = new FormData(document.getElementById('teacherForm'));

    // Convert FormData to JSON object
    const jsonData = {};
    for (let [key, value] of formData.entries()) {
      jsonData[key] = value;
    }

    // Convert age and yearsOfTeachingExperience to numbers
    jsonData.age = parseInt(jsonData.age);
    jsonData.yearsOfTeachingExperience = parseInt(jsonData.yearsOfTeachingExperience);

    // Send data to backend API
    const response = await fetch('http://localhost:5000/api/tutors/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData)
    });

    const result = await response.json();

    if (result.success) {
      alert("Registration successful! " + result.message + "\nYour registration ID is: " + result.tutor_id);

      // Reset form
      document.getElementById('teacherForm').reset();
      step2.classList.remove('active');
      step1.classList.add('active');
      progress.style.width = '50%';
    } else {
      if (result.errors && result.errors.length > 0) {
        alert("Please fix the following errors:\n" + result.errors.join('\n'));
      } else {
        alert("Error: " + result.message);
      }
    }
  } catch (error) {
    console.error('Submission error:', error);
  } finally {
    // Restore button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
