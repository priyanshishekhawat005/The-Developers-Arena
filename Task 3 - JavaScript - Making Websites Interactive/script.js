// DARK MODE FUNCTIONALITY

function initializeDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeToggleButton(true);
    }
}

function updateThemeToggleButton(isDarkMode) {
    const button = document.getElementById('themeToggle');
    button.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeToggleButton(isDarkMode);
    console.log('Dark mode toggled:', isDarkMode);
}


// PROJECT DETAILS TOGGLE 

function toggleProjectDetails(titleElement) {
    const detailsElement = titleElement.nextElementSibling;
    const icon = titleElement.querySelector('.toggle-icon');
    
    if (!detailsElement) return;
    
    detailsElement.classList.toggle('show');
    icon.style.transform = detailsElement.classList.contains('show') ? 'rotate(45deg)' : 'rotate(0deg)';
    
    console.log('Project details toggled');
}


// FORM VALIDATION

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
}

function isValidMessage(message) {
    return message.trim().length >= 10;
}

function clearErrors() {
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function showSuccessMessage(message) {
    const successElement = document.getElementById('successMessage');
    successElement.textContent = message;
    successElement.classList.add('show');
    
    setTimeout(() => {
        successElement.classList.remove('show');
        successElement.textContent = '';
    }, 5000);
    
    console.log('Form submitted successfully!');
}

function validateForm(event) {
    event.preventDefault();
    clearErrors();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    let isValid = true;

    if (!name.trim()) {
        showFieldError('name', 'Name is required');
        isValid = false;
    } else if (!isValidName(name)) {
        showFieldError('name', 'Name must be at least 2 characters and contain only letters');
        isValid = false;
    }

    if (!email.trim()) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!message.trim()) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (!isValidMessage(message)) {
        showFieldError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    if (isValid) {
        const formData = {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        let submittedMessages = JSON.parse(localStorage.getItem('submittedMessages')) || [];
        submittedMessages.push(formData);
        localStorage.setItem('submittedMessages', JSON.stringify(submittedMessages));
        
        showSuccessMessage('✓ Message sent successfully! We\'ll get back to you soon.');
        document.getElementById('contactForm').reset();
        clearErrors();
    }
    
    return isValid;
}

function validateNameField() {
    const name = document.getElementById('name').value;
    const errorElement = document.getElementById('nameError');
    
    if (name.trim() && !isValidName(name)) {
        errorElement.textContent = 'Name must contain only letters (minimum 2 characters)';
    } else {
        errorElement.textContent = '';
    }
}

function validateEmailField() {
    const email = document.getElementById('email').value;
    const errorElement = document.getElementById('emailError');
    
    if (email.trim() && !isValidEmail(email)) {
        errorElement.textContent = 'Please enter a valid email address';
    } else {
        errorElement.textContent = '';
    }
}

function validateMessageField() {
    const message = document.getElementById('message').value;
    const errorElement = document.getElementById('messageError');
    
    if (message.trim() && !isValidMessage(message)) {
        errorElement.textContent = `Message must be at least 10 characters (${message.trim().length}/10)`;
    } else {
        errorElement.textContent = '';
    }
}


// EVENT LISTENERS SETUP

function initializeEventListeners() {
    // Dark mode toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
        console.log('Dark mode toggle listener added');
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
        console.log('Form submit listener added');
        
        document.getElementById('name').addEventListener('input', validateNameField);
        document.getElementById('email').addEventListener('input', validateEmailField);
        document.getElementById('message').addEventListener('input', validateMessageField);
        console.log('Real-time validation listeners added');
    }
}


// INITIALIZATION

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing portfolio');
    initializeDarkMode();
    initializeEventListeners();
});
