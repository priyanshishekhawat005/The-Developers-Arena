const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
const menuItems = document.querySelectorAll(".menu-item");

if (filterButtons.length && menuItems.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;

      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      menuItems.forEach((item) => {
        const matches = category === "all" || item.dataset.category === category;
        item.style.display = matches ? "block" : "none";
      });
    });
  });
}

const forms = document.querySelectorAll(".needs-validation");

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  const errorText = wrapper ? wrapper.querySelector(".error-text") : null;

  field.classList.add("field-invalid");
  if (errorText) {
    errorText.textContent = message;
  }
}

function clearFieldError(field) {
  const wrapper = field.closest(".form-field");
  const errorText = wrapper ? wrapper.querySelector(".error-text") : null;

  field.classList.remove("field-invalid");
  if (errorText) {
    errorText.textContent = "";
  }
}

function validateField(field) {
  const name = field.name;
  const value = field.value.trim();

  if (field.hasAttribute("required") && !value) {
    setFieldError(field, "This field is required.");
    return false;
  }

  if (name === "email" && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setFieldError(field, "Enter a valid email address.");
      return false;
    }
  }

  if (name === "phone" && value) {
    const phonePattern = /^[0-9+\-\s]{10,15}$/;
    if (!phonePattern.test(value)) {
      setFieldError(field, "Use 10-15 digits, spaces, + or -.");
      return false;
    }
  }

  if (name === "date" && value) {
    const selected = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      setFieldError(field, "Choose today or a future date.");
      return false;
    }
  }

  if (field.hasAttribute("minlength")) {
    const minLength = Number(field.getAttribute("minlength"));
    if (value.length < minLength) {
      setFieldError(field, `Use at least ${minLength} characters.`);
      return false;
    }
  }

  clearFieldError(field);
  return true;
}

forms.forEach((form) => {
  const statusText = form.querySelector(".form-status");

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => validateField(field));
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let formIsValid = true;
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      const fieldIsValid = validateField(field);
      if (!fieldIsValid) {
        formIsValid = false;
      }
    });

    if (!statusText) {
      return;
    }

    if (!formIsValid) {
      statusText.textContent = "Please fix the highlighted fields before submitting.";
      statusText.classList.add("error");
      statusText.classList.remove("success");
      return;
    }

    const formType = form.dataset.formType === "booking" ? "Booking" : "Message";
    statusText.textContent = `${formType} submitted successfully. We will contact you shortly.`;
    statusText.classList.add("success");
    statusText.classList.remove("error");
    form.reset();
  });
});
