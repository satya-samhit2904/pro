# V Excel Tutors - Frontend

Modern, responsive web interface for the V Excel Tutors platform.

## 📂 Structure

```
frontend/
├── css/
│   ├── styles.css          # Landing page styles
│   ├── StudentStyle.css    # Student form styles
│   └── tutorstyle.css      # Tutor form styles
├── js/
│   ├── Studentscript.js    # Student form logic + API integration
│   └── tutorscript.js      # Tutor form logic + API integration
├── index.html              # Landing page
├── student.html            # Student registration form
└── tutor.html              # Tutor registration form
```

## 🚀 Running the Frontend

### Option 1: VS Code Live Server (Recommended)
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Opens at: http://localhost:5500

### Option 2: Python HTTP Server
```bash
cd frontend
python -m http.server 5500
```

### Option 3: Node.js HTTP Server
```bash
cd frontend
npx http-server -p 5500
```

## 🎨 Pages

### Landing Page (index.html)
- Hero section with CTAs
- Featured tutors
- Testimonials carousel
- Demo booking form
- FAQs section
- Responsive navigation

**Features:**
- Fully responsive design
- Mobile hamburger menu
- Smooth scrolling
- Interactive cards

### Student Registration (student.html)
- Multi-step form (2 steps)
- Dynamic conditional fields
- Real-time validation

**Step 1:**
- Student name
- Grade selection (1-12, undergraduate, postgraduate)
- Year (conditional - for undergrad/postgrad)
- School/Institution name
- Location
- Curriculum selection
- Other curriculum (conditional)
- Subjects

**Step 2:**
- Days per week (1-7)
- Preferred days (checkbox selection)
- Preferred timings
- Contact number
- Email address

**Validation:**
- Email: RFC 5321 compliant
- Phone: International format (+country code)
- Days: Must match selected count
- Conditional fields validated when visible

### Tutor Registration (tutor.html)
- Multi-step form (2 steps)
- Professional onboarding

**Step 1:**
- Name
- Age
- Education qualifications
- Teaching experience (years)
- Currently working in school (Y/N)

**Step 2:**
- Online teaching experience
- Subjects taught
- Expected fees
- Location
- Devices used for teaching
- Contact number
- Email address

## 🔗 API Integration

### Backend Connection
Both registration forms connect to the backend API at:
```
http://localhost:5000/api/students/register
http://localhost:5000/api/tutors/register
```

### Changing API URL
If backend runs on different port/domain, update in JavaScript files:

**js/Studentscript.js (line ~421):**
```javascript
const response = await fetch('http://localhost:5000/api/students/register', {
```

**js/tutorscript.js (line ~43):**
```javascript
const response = await fetch('http://localhost:5000/api/tutors/register', {
```

## 🎯 Features

### Form Validation
- Real-time email validation
- International phone number validation
- Required field validation
- Conditional field handling
- Error message display
- Clear error on typing

### User Experience
- Loading states during submission
- Success/error alerts
- Form reset after successful submission
- Step navigation with validation gates
- Dynamic field visibility

### Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Touch-friendly buttons
- Accessible navigation

## 🎨 Styling

### Design System
- **Primary Color:** #5b86ff (Blue)
- **Background:** #0b1220 (Dark Navy)
- **Font:** Inter (Google Fonts)
- **Dark theme** with blue accents

### CSS Files
- `styles.css` - Global styles, landing page
- `StudentStyle.css` - Student form specific
- `tutorstyle.css` - Tutor form specific

### Components
- Cards
- Buttons (primary, outline, ghost)
- Form inputs with validation states
- Badges and tags
- Navigation (desktop + mobile)

## 🔍 Form Flow

### Student Registration Flow
1. User fills Step 1 → Validates → Next
2. User fills Step 2 → Validates → Submit
3. Data sent to API as JSON
4. Success → Alert + Reset form
5. Error → Display error message

### Tutor Registration Flow
1. User fills Step 1 → Next
2. User fills Step 2 → Submit
3. Data sent to API as JSON
4. Success → Alert + Reset to Step 1
5. Error → Display error message

## 🧪 Testing

### Manual Testing
1. **Landing Page:**
   - Check responsive design
   - Test navigation menu
   - Check mobile hamburger menu
   - Verify links to student.html and tutor.html

2. **Student Form:**
   - Fill all fields correctly → Should submit
   - Leave required fields empty → Should show errors
   - Enter invalid email → Should show error
   - Select grade "undergraduate" → Year field should appear
   - Select curriculum "Other" → Other curriculum field should appear
   - Select 3 days per week → Should only allow 3 day checkboxes

3. **Tutor Form:**
   - Fill all fields correctly → Should submit
   - Check form reset after submission
   - Verify back button works

### Check Console
Press F12 in browser to see:
- API responses
- Validation logs
- Any JavaScript errors

## 🔧 Customization

### Update Colors
Edit CSS variables in respective CSS files:
```css
--primary-color: #5b86ff;
--background: #0b1220;
--text-color: #ffffff;
```

### Add New Fields
1. Add HTML input in the form
2. Add validation in JavaScript
3. Update API call to include new field
4. Update backend to accept new field

### Change Form Steps
Modify in HTML:
```html
<div class="form-step active" id="step1">
  <!-- Step 1 fields -->
</div>
<div class="form-step" id="step2">
  <!-- Step 2 fields -->
</div>
```

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Features
- Hamburger menu
- Stack form fields vertically
- Larger touch targets
- Simplified navigation

## 🚀 Performance

### Optimizations
- Minimal external dependencies
- CSS organized by component
- JavaScript separated by page
- Lazy loading for images (if added)

### Load Times
- Landing page: ~200-300ms
- Student form: ~150-200ms
- Tutor form: ~150-200ms

## 🐛 Common Issues

### CSS Not Loading
**Problem:** Styles not applied

**Solution:** Check file paths in HTML:
```html
<link rel="stylesheet" href="css/styles.css" />
```

### JavaScript Not Working
**Problem:** Form doesn't submit

**Solution:**
1. Check script path: `<script src="js/Studentscript.js"></script>`
2. Open browser console (F12) for errors
3. Ensure backend is running at http://localhost:5000

### Form Submission Fails
**Problem:** "Error submitting form"

**Solution:**
1. Backend must be running
2. Check API URL in JavaScript
3. Check CORS settings in backend
4. Look for errors in browser console

### Validation Not Working
**Problem:** Form submits with empty fields

**Solution:** Ensure:
1. Fields have `required` attribute
2. Validation functions are called
3. Check JavaScript console for errors

## 🎓 Code Examples

### Adding a New Field
```html
<!-- 1. Add in HTML -->
<div class="form-group">
  <label>New Field:</label>
  <input type="text" name="newField" required>
</div>
```

```javascript
// 2. It will automatically be included in form submission
// FormData collects all named inputs

// 3. Optionally add custom validation
if (!jsonData.newField || jsonData.newField.length < 3) {
  alert('New field must be at least 3 characters');
  return;
}
```

### Custom Validation
```javascript
function validateCustomField(value) {
  // Your validation logic
  const pattern = /^[A-Z]{3}$/;
  return pattern.test(value);
}

// In form submission
if (!validateCustomField(formData.get('customField'))) {
  alert('Invalid format');
  return;
}
```

## 📚 Technologies Used

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- Fetch API for HTTP requests
- Google Fonts (Inter)

## 🔮 Future Enhancements

- [ ] Form progress indicator
- [ ] Save draft functionality
- [ ] File upload for documents
- [ ] Calendar picker for availability
- [ ] Subject autocomplete
- [ ] Location autocomplete
- [ ] Profile picture upload
- [ ] Email verification
- [ ] SMS OTP verification

## 📖 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

---

**Frontend crafted with ❤️ for V Excel Tutors**
