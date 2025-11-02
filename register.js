// register.js - MONGODB/EXPRESS API VERSION

// ⚠️ DELETE ALL FIREBASE IMPORTS AND REFERENCES TO signInWithPopup ⚠️

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const cityInput = document.getElementById("city");
const skillsInput = document.getElementById("skills");
const experienceInput = document.getElementById("experience");
const portfolioInput = document.getElementById("portfolio");
const profilePicInput = document.getElementById("profilePic"); // Added for consistency

const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const googleLoginBtn = document.getElementById("googleLogin"); // This button should be hidden/deleted

// Hide Google login button as it requires server-side OAuth
if (googleLoginBtn) googleLoginBtn.style.display = 'none';

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // NOTE: ProfilePic file upload is complex and requires a new server endpoint (e.g., Multer).
  // For this migration, we'll send everything else and deal with the pic later/manually.
  
  const userData = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    city: cityInput.value,
    skills: skillsInput.value, // Send as string; server handles split
    experience: experienceInput.value,
    portfolio: portfolioInput.value,
  };

  errorMessage.textContent = "Registering...";

  try {
    const response = await fetch('https://colabx-api.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Registration failed on server.');
    }
    
    alert("Registration successful! Please log in.");
    window.location.href = "login.html";
    
  } catch (err) {
    errorMessage.textContent = "Registration failed: " + err.message;
  }
});

// REMOVED GOOGLE LOGIN EVENT LISTENER