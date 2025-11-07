document.addEventListener("DOMContentLoaded", () => {

  const nextBtns = document.querySelectorAll(".btn-next");
  const prevBtns = document.querySelectorAll(".btn-prev");
  const formSteps = document.querySelectorAll(".form-step");
  const daysInput = document.getElementById("daysInput");
  const dayCheckboxes = document.querySelectorAll(".days-grid input[type='checkbox']");
  const dayWarning = document.getElementById("dayWarning");

  let formStepNum = 0;

  // === Step Navigation ===
  nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Validate current step before proceeding
      if (formStepNum === 0) {
        const isValid = validateStep1();
        
        if (isValid) {
          formStepNum++;
          updateFormSteps();
        } else {
          alert("Please fill all required fields in Step 1 before proceeding.");
        }
      } else {
        formStepNum++;
        updateFormSteps();
      }
    });
  });

  prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      formStepNum--;
      updateFormSteps();
    });
  });

  function updateFormSteps() {
    formSteps.forEach((step, index) => {
      step.classList.toggle("active", index === formStepNum);
    });
  }


  // === Days Validation ===
  dayCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const selected = Array.from(dayCheckboxes).filter(cb => cb.checked);
      const limit = parseInt(daysInput.value) || 0;

      if (selected.length > limit) {
        checkbox.checked = false;
        dayWarning.textContent = `You can only select ${limit} day(s).`;
      } else {
        dayWarning.textContent = "";
      }
    });
  });

  daysInput.addEventListener("input", () => {
    const val = parseInt(daysInput.value);
    if (val < 1 || val > 7) {
      daysInput.value = "";
      dayWarning.textContent = "Please enter a number between 1 and 7.";
    } else {
      dayWarning.textContent = "";
      dayCheckboxes.forEach(cb => cb.checked = false);
    }
  });

  // === Dynamic Year Field ===
  // === Dynamic Year Field ===
  const gradeSelect = document.getElementById("gradeSelect");
  const yearField = document.getElementById("yearField");
  const yearInput = document.getElementById("yearInput");
  const yearNote = document.getElementById("yearNote");

  gradeSelect.addEventListener("change", () => {
    const value = gradeSelect.value;

    if (value === "Undergraduate") {
      yearField.style.display = "block";
      yearInput.max = 4;
      yearNote.textContent = "Please enter year between 1 and 4.";
      yearNote.style.color = "";
    } else if (value === "Postgraduate") {
      yearField.style.display = "block";
      yearInput.max = 2;
      yearNote.textContent = "Please enter year between 1 and 2.";
      yearNote.style.color = "";
    } else {
      yearField.style.display = "none";
      yearInput.value = "";
      yearNote.textContent = "";
    }
  });

  // === Year Input Validation (for Undergraduate/Postgraduate only) ===
  yearInput.addEventListener("input", () => {
    const gradeValue = gradeSelect.value;
    const entered = parseInt(yearInput.value);

    let maxYear = 0;
    if (gradeValue === "Undergraduate") maxYear = 4;
    if (gradeValue === "Postgraduate") maxYear = 2;

    if (!entered || entered < 1 || entered > maxYear) {
      yearNote.textContent = `⚠️ Please enter a valid year between 1 and ${maxYear}.`;
      yearNote.style.color = "#e74c3c"; // Red warning
    } else {
      yearNote.textContent = "";
    }
  });


  // === Dynamic Curriculum Field ===
  const curriculumSelect = document.getElementById("curriculumSelect");
  const otherCurriculumField = document.getElementById("otherCurriculumField");
  const otherCurriculumInput = document.getElementById("otherCurriculumInput");

  curriculumSelect.addEventListener("change", () => {
    if (curriculumSelect.value === "Other") {
      otherCurriculumField.style.display = "block";
    } else {
      otherCurriculumField.style.display = "none";
      otherCurriculumInput.value = "";
    }
  });

  // Time validation
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const timeError = document.getElementById("timeError");

  const minTime = "09:00";
  const maxTime = "17:00";

  function validateTimeRange() {
    const start = startTimeInput.value;
    const end = endTimeInput.value;

    // Reset visual indicators
    startTimeInput.style.borderColor = "";
    endTimeInput.style.borderColor = "";
    timeError.style.display = "none";

    if (!start || !end) return false;

    if (start < minTime || end > maxTime || end <= start) {
      timeError.style.display = "block";
      startTimeInput.style.borderColor = "red";
      endTimeInput.style.borderColor = "red";
      return false;
    }

    return true;
  }

  // Real-time validation
  startTimeInput.addEventListener("input", validateTimeRange);
  endTimeInput.addEventListener("input", validateTimeRange);



  // === Form Validation Functions ===
  function validateEmail(email) {
    
    // More comprehensive email validation
    // Supports most common email formats including international domains
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Additional checks
    if (!email || email.length === 0) {
      return false;
    }
    if (email.length > 254) {
      return false;
    } // RFC 5321 limit
    
    // Check for basic structure
    const parts = email.split('@');
    if (parts.length !== 2) {
      return false;
    }
    
    const [localPart, domainPart] = parts;
    
    // Local part validation
    if (localPart.length === 0 || localPart.length > 64) {
      return false;
    } // RFC 5321 limit
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return false;
    }
    if (localPart.includes('..')) {
      return false;
    } // No consecutive dots
    
    // Domain part validation
    if (domainPart.length === 0 || domainPart.length > 253) {
      return false;
    }
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
      return false;
    }
    if (domainPart.includes('..')) {
      return false;
    } // No consecutive dots
    
    // Must have at least one dot in domain
    if (!domainPart.includes('.')) {
      return false;
    }
    
    const regexResult = emailRegex.test(email);
    return regexResult;
  }

  function validateMobileNumber(mobile) {
    // International mobile number validation
    // Supports formats like: +1234567890, +91 9876543210, +44 20 7946 0958, etc.
    // Removes all spaces and hyphens for validation
    const cleanMobile = mobile.replace(/[\s\-\(\)]/g, '');
    
    // International mobile number regex:
    // - Must start with + followed by country code (1-3 digits)
    // - Followed by 7-15 digits (total length 8-18 including +)
    // - Or just 10-15 digits without country code
    const internationalRegex = /^(\+[1-9]\d{7,17}|[1-9]\d{9,14})$/;
    
    return internationalRegex.test(cleanMobile);
  }

  function showFieldError(field, message) {
    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Add error styling
    field.classList.add('error');
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }

  function validateStep1() {
    let isValid = true;
    
    // Get all required fields in step 1
    const step1Fields = document.querySelectorAll('#step1 input[required], #step1 select[required]');
    
    step1Fields.forEach((field, index) => {
      // Skip validation for hidden conditional fields
      const fieldContainer = field.closest('.form-group');
      const isHidden = fieldContainer && fieldContainer.style.display === 'none';
      
      
      if (isHidden) {
        return; // Skip this field
      }
      
      const value = field.value.trim();
      
      if (!value) {
        showFieldError(field, 'This field is required');
        isValid = false;
      } else {
        clearFieldError(field);
      }
    });
    
    // Special validation for year field if visible
    const yearField = document.getElementById('yearField');
    const yearInput = document.getElementById('yearInput');
    if (yearField && yearField.style.display !== 'none' && yearField.style.display !== '') {
      if (!yearInput.value.trim()) {
        showFieldError(yearInput, 'Year is required for undergraduate/postgraduate');
        isValid = false;
      } else {
        clearFieldError(yearInput);
      }
    }
    // Special validation for other curriculum field if visible
    const otherCurriculumField = document.getElementById('otherCurriculumField');
    const otherCurriculumInput = document.getElementById('otherCurriculumInput');
    if (otherCurriculumField && otherCurriculumField.style.display !== 'none' && otherCurriculumField.style.display !== '') {
      if (!otherCurriculumInput.value.trim()) {
        showFieldError(otherCurriculumInput, 'Please specify the curriculum');
        isValid = false;
      } else {
        clearFieldError(otherCurriculumInput);
      }
    }
    
    return isValid;
  }

  function validateStep2() {
    let isValid = true;
    const step2Fields = document.querySelectorAll('#step2 input[required]');

    step2Fields.forEach(field => {
      // Skip time fields as they have custom validation
      if (field.id === 'startTime' || field.id === 'endTime') {
        return;
      }

      const value = field.value.trim();

      if (!value) {
        showFieldError(field, 'This field is required');
        isValid = false;
      } else {
        clearFieldError(field);

        // Email validation
        if (field.name === 'email') {
          if (!validateEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
          }
        }

        // Mobile number validation
        if (field.name === 'contact') {
          if (!validateMobileNumber(value)) {
            showFieldError(field, 'Please enter a valid mobile number (e.g., +1234567890 or 1234567890)');
            isValid = false;
          }
        }
      }
    });

    // Validate time range
    if (!validateTimeRange()) {
      isValid = false;
    }

    // Validate preferred days selection
    const dayCheckboxes = document.querySelectorAll('.days-grid input[type="checkbox"]');
    const selectedDays = Array.from(dayCheckboxes).filter(cb => cb.checked);
    const daysInput = document.getElementById('daysInput');
    const expectedDays = parseInt(daysInput.value);

    if (selectedDays.length !== expectedDays) {
      const dayWarning = document.getElementById('dayWarning');
      dayWarning.textContent = `Please select exactly ${expectedDays} day(s) as specified`;
      dayWarning.style.color = '#e74c3c';
      isValid = false;
    } else {
      const dayWarning = document.getElementById('dayWarning');
      dayWarning.textContent = '';
    }

    return isValid;
  }

  // === Real-time Validation ===
  // Add real-time validation for email field
  document.querySelector('input[name="email"]').addEventListener('blur', function() {
    const value = this.value.trim();
    
    if (value) {
      const isValid = validateEmail(value);
      
      if (!isValid) {
        showFieldError(this, 'Please enter a valid email address');
      } else {
        clearFieldError(this);
      }
    }
  });

  // Add real-time validation for mobile number field
  document.querySelector('input[name="contact"]').addEventListener('blur', function() {
    const value = this.value.trim();
    if (value && !validateMobileNumber(value)) {
      showFieldError(this, 'Please enter a valid mobile number (e.g., +1234567890 or 1234567890)');
    } else if (value) {
      clearFieldError(this);
    }
  });

  // Clear errors when user starts typing
  document.querySelectorAll('input[required], select[required]').forEach(field => {
    field.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        clearFieldError(this);
      }
    });
  });

  // === Form Submission ===
  document.getElementById("educatorForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Validate both steps
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();
    
    if (step1Valid && step2Valid) {
      // Show loading state
      const submitBtn = document.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      try {
        // Collect form data
        const formData = new FormData(document.getElementById("educatorForm"));
    
        // Add preferred days
        const selectedDays = Array.from(document.querySelectorAll('.days-grid input[type="checkbox"]:checked'))
          .map(cb => cb.value);

        // Convert FormData to JSON object
        const jsonData = {};
        for (let [key, value] of formData.entries()) {
          // Skip year from FormData, we'll handle it separately
          if (key === 'year') {
            continue;
          }
          // Skip time fields as we'll format them into preferredTimings
          if (key === 'startTime' || key === 'endTime') {
            continue;
          }
          jsonData[key] = value.trim();
        }

        // Convert to proper types
        jsonData.daysPerWeek = parseInt(jsonData.daysPerWeek);

        // Ensure curriculum is properly formatted
        if (jsonData.curriculum) {
          jsonData.curriculum = jsonData.curriculum.trim();
        }

        // Add preferred days
        jsonData.preferredDays = Array.from(
          document.querySelectorAll('.days-grid input[type="checkbox"]:checked')
        ).map(cb => cb.value);

        // Get year value properly - ONLY if field is visible and has a value
        const yearField = document.getElementById("yearField");
        const grade = document.getElementById("gradeSelect").value;

        // Only add year if grade is Undergraduate or Postgraduate AND has a value
        if ((grade === 'Undergraduate' || grade === 'Postgraduate') &&
            yearInput.value && yearInput.value.trim() !== '') {
          jsonData.year = yearInput.value.trim();
        }

        // Format preferredTimings from start and end time
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        if (startTime && endTime) {
          jsonData.preferredTimings = `${startTime} - ${endTime}`;
        }
        const yearInput = document.getElementById('yearInput').value;
        jsonData.year = yearInput;

        // Send data to backend API
        const response = await fetch('http://localhost:5000/api/students/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData)
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert("Form submitted successfully! Your registration ID is: " + result.student_id);
          
          // Optional: Reset form
          document.getElementById("educatorForm").reset();
          formStepNum = 0;
          updateFormSteps();
          
          // Clear any error styling
          document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
          });
          document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
          });
        } else {
          if (result.errors && result.errors.length > 0) {
            alert("Please fix the following errors:\n" + result.errors.join('\n'));
          } else {
            alert("Error: " + result.message);
          }
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert("Error submitting form. Please try again.");
      } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    } else {
      // Show error message
      alert("Please fill all required fields correctly before submitting.");
      
      // Go to step 1 if it has errors
      if (!step1Valid) {
        formStepNum = 0;
        updateFormSteps();
      }
    }
  });
}); // End of DOMContentLoaded

