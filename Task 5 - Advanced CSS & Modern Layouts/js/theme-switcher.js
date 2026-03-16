const selectors = {
    body: document.body,
    themeToggle: document.getElementById("themeToggle"),
    themeText: document.querySelector("#themeToggle .button__text"),
    themeIcon: document.querySelector("#themeToggle .button__icon"),
    menuToggle: document.getElementById("menuToggle"),
    navigation: document.getElementById("siteNavigation"),
    navLinks: document.querySelectorAll(".site-header__link"),
    revealSections: document.querySelectorAll("[data-reveal]"),
    projectToggles: document.querySelectorAll(".project-card__toggle"),
    contactForm: document.getElementById("contactForm"),
    successMessage: document.getElementById("successMessage")
};

function updateThemeToggleButton(isDarkMode) {
    if (!selectors.themeToggle || !selectors.themeText || !selectors.themeIcon) {
        return;
    }

    selectors.themeText.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
    selectors.themeIcon.textContent = isDarkMode ? "☀️" : "🌙";
    selectors.themeToggle.setAttribute("aria-pressed", String(isDarkMode));
}

function initializeDarkMode() {
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    if (isDarkMode) {
        selectors.body.classList.add("dark-mode");
    }

    updateThemeToggleButton(isDarkMode);
}

function toggleDarkMode() {
    selectors.body.classList.toggle("dark-mode");
    const isDarkMode = selectors.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", String(isDarkMode));
    updateThemeToggleButton(isDarkMode);
}

function toggleNavigation() {
    if (!selectors.menuToggle || !selectors.navigation) {
        return;
    }

    const isOpen = selectors.menuToggle.getAttribute("aria-expanded") === "true";
    selectors.menuToggle.setAttribute("aria-expanded", String(!isOpen));
    selectors.navigation.classList.toggle("is-open", !isOpen);
}

function closeNavigation() {
    if (!selectors.menuToggle || !selectors.navigation) {
        return;
    }

    selectors.menuToggle.setAttribute("aria-expanded", "false");
    selectors.navigation.classList.remove("is-open");
}

function toggleProjectDetails(event) {
    const toggleButton = event.currentTarget;
    const detailsElement = toggleButton.parentElement.querySelector(".project-card__details");

    if (!detailsElement) {
        return;
    }

    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));
    detailsElement.hidden = isExpanded;
}

function initializeRevealAnimations() {
    if (!("IntersectionObserver" in window)) {
        selectors.revealSections.forEach((section) => section.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    selectors.revealSections.forEach((section) => observer.observe(section));
}

function initializeSectionTracking() {
    const sections = document.querySelectorAll("main section[id]");

    if (!("IntersectionObserver" in window) || sections.length === 0) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                selectors.navLinks.forEach((link) => {
                    const matchesSection = link.getAttribute("href") === `#${entry.target.id}`;
                    if (matchesSection) {
                        link.setAttribute("aria-current", "page");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            threshold: 0.55
        }
    );

    sections.forEach((section) => observer.observe(section));
}

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
    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("messageError").textContent = "";
}

function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function showSuccessMessage(message) {
    if (!selectors.successMessage) {
        return;
    }

    selectors.successMessage.textContent = message;
    selectors.successMessage.classList.add("show");

    window.setTimeout(() => {
        selectors.successMessage.classList.remove("show");
        selectors.successMessage.textContent = "";
    }, 5000);
}

function validateForm(event) {
    event.preventDefault();
    clearErrors();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    let isValid = true;

    if (!name.trim()) {
        showFieldError("name", "Name is required");
        isValid = false;
    } else if (!isValidName(name)) {
        showFieldError("name", "Name must be at least 2 characters and contain only letters");
        isValid = false;
    }

    if (!email.trim()) {
        showFieldError("email", "Email is required");
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError("email", "Please enter a valid email address");
        isValid = false;
    }

    if (!message.trim()) {
        showFieldError("message", "Message is required");
        isValid = false;
    } else if (!isValidMessage(message)) {
        showFieldError("message", "Message must be at least 10 characters");
        isValid = false;
    }

    if (!isValid) {
        return false;
    }

    const formData = {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
    };

    const submittedMessages = JSON.parse(localStorage.getItem("submittedMessages")) || [];
    submittedMessages.push(formData);
    localStorage.setItem("submittedMessages", JSON.stringify(submittedMessages));

    showSuccessMessage("✓ Message sent successfully! We'll get back to you soon.");
    selectors.contactForm.reset();
    clearErrors();
    return true;
}

function validateNameField() {
    const name = document.getElementById("name").value;
    const errorElement = document.getElementById("nameError");
    errorElement.textContent = name.trim() && !isValidName(name)
        ? "Name must contain only letters (minimum 2 characters)"
        : "";
}

function validateEmailField() {
    const email = document.getElementById("email").value;
    const errorElement = document.getElementById("emailError");
    errorElement.textContent = email.trim() && !isValidEmail(email)
        ? "Please enter a valid email address"
        : "";
}

function validateMessageField() {
    const message = document.getElementById("message").value;
    const errorElement = document.getElementById("messageError");
    errorElement.textContent = message.trim() && !isValidMessage(message)
        ? `Message must be at least 10 characters (${message.trim().length}/10)`
        : "";
}

function initializeEventListeners() {
    selectors.themeToggle?.addEventListener("click", toggleDarkMode);
    selectors.menuToggle?.addEventListener("click", toggleNavigation);

    selectors.navLinks.forEach((link) => {
        link.addEventListener("click", closeNavigation);
    });

    selectors.projectToggles.forEach((toggleButton) => {
        toggleButton.addEventListener("click", toggleProjectDetails);
    });

    if (selectors.contactForm) {
        selectors.contactForm.addEventListener("submit", validateForm);
        document.getElementById("name").addEventListener("input", validateNameField);
        document.getElementById("email").addEventListener("input", validateEmailField);
        document.getElementById("message").addEventListener("input", validateMessageField);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeDarkMode();
    initializeEventListeners();
    initializeRevealAnimations();
    initializeSectionTracking();
});
