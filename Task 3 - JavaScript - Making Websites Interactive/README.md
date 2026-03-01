# Interactive Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, and JavaScript featuring dark mode, form validation, and interactive elements.

## 👤 About

Personal portfolio website for **Priyanshi Shekhawat** - Web Developer | Java Enthusiast

## ✨ Features

### ☀️ Dark/Light Mode Toggle
- Seamless theme switching between light and dark modes
- User preference saved in browser's localStorage
- Smooth CSS transitions for better user experience

### 💼 Interactive Project Section
- Expandable/collapsible project details
- Click on project titles to reveal more information
- Animated toggle icons with rotation effects

### 📝 Smart Contact Form
- **Real-time validation** with instant feedback
- **Input validation rules:**
  - Name: Minimum 2 characters, letters only
  - Email: Valid email format required
  - Message: Minimum 10 characters
- Error messages displayed below each field
- Success notification after form submission
- Form data persisted in localStorage

### 🎯 Additional Features
- Responsive design for all screen sizes
- Skills and Soft Skills sections displayed side-by-side
- Professional hover effects and animations
- Clean, modern UI/UX design
- Console logging for debugging

## 📁 File Structure

```
Task 3 - JavaScript - Making Websites Interactive/
│
├── index.html          # Main HTML structure
├── style.css           # Styles and dark mode theming
├── script.js           # JavaScript functionality
├── Profile.png         # Profile image
└── README.md           # Project documentation
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Styling, animations, and responsive design
- **JavaScript (ES6)** - Interactive functionality and DOM manipulation
- **LocalStorage API** - Data persistence

## 📋 Sections

1. **Header** - Name, tagline, and theme toggle button
2. **About Me** - Introduction and profile picture
3. **Skills** - Technical skills (C/C++, Java, MySQL, HTML, CSS, JavaScript)
4. **Soft Skills** - Leadership, Problem Solving, Communication, Team Collaboration, Work Ethics
5. **Projects** - Showcase of completed projects with expandable details
6. **Contact** - Contact information and interactive form
7. **Footer** - Copyright information

## 🚀 How to Use

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser
3. **Interact** with the features:
   - Toggle between dark/light mode
   - Click on project titles to expand details
   - Fill out and submit the contact form
   - Check browser console for debug logs

## 💡 Key JavaScript Functions

| Function | Purpose |
|----------|---------|
| `toggleDarkMode()` | Switch between light and dark themes |
| `toggleProjectDetails()` | Show/hide project information |
| `validateForm()` | Validate contact form on submission |
| `validateNameField()` | Real-time name validation |
| `validateEmailField()` | Real-time email validation |
| `validateMessageField()` | Real-time message validation |
| `showSuccessMessage()` | Display success notification |

## 🌙 Dark Mode

The dark mode feature uses:
- CSS classes for theme switching
- LocalStorage to remember user preference
- Automatic theme restoration on page reload
- Smooth transitions for all color changes

## 📱 Responsive Design

- Flexbox layout for skills sections
- Mobile-friendly form inputs
- Adaptable section spacing
- Readable typography across devices

## ✅ Form Validation Rules

### Name Field
- Required field
- Minimum 2 characters
- Only letters and spaces allowed
- Real-time validation feedback

### Email Field
- Required field
- Must contain @ symbol
- Valid email format (e.g., user@example.com)
- Real-time validation feedback

### Message Field
- Required field
- Minimum 10 characters
- Character count display
- Real-time validation feedback

## 🌐 Browser Compatibility

Compatible with all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## 📞 Contact Information

- **Email:** priyanshishekhawat@gmail.com
- **Phone:** +91 82099 52254

## 📄 License

© 2026 Priyanshi Shekhawat. All rights reserved.

## 🎓 Learning Objectives Achieved

✅ JavaScript basics: variables, data types, operators  
✅ Functions and event handling  
✅ DOM manipulation: selecting and modifying elements  
✅ Event listeners: click, input, submit  
✅ Form validation with real-time feedback  
✅ LocalStorage for data persistence  
✅ Reusable function creation  
✅ Debugging with console.log()

## 🔮 Future Enhancements

- [ ] Add image slider/gallery
- [ ] Implement to-do list functionality
- [ ] Add smooth scroll navigation
- [ ] Create animations on scroll
- [ ] Add project links and live demos
- [ ] Include social media links
- [ ] Add resume download button
