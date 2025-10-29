// login.js - MONGODB/EXPRESS API VERSION READY FOR DEPLOYMENT

// 🎯 IMPORTANT: REPLACE THIS PLACEHOLDER WITH YOUR LIVE BACKEND URL (e.g., https://your-app-name.onrender.com/api)
const BACKEND_BASE_URL = 'https://colabx-api.onrender.com/api'; 
// For local testing: const BACKEND_BASE_URL = 'http://localhost:3001/api'; 

const l_email = document.getElementById('l_email');
const l_pass = document.getElementById('l_pass');
const l_btn = document.getElementById('l_btn');
const l_status = document.getElementById('l_status');

l_btn.addEventListener('click', async () => {
    const email = l_email.value.trim();
    const password = l_pass.value;
    if(!email || !password){
        l_status.textContent = "Please enter email and password.";
        return;
    }
    
    l_status.style.color = 'tomato';
    l_status.textContent = "Signing in...";
    
    try {
        // UPDATED FETCH URL
        const response = await fetch(`${BACKEND_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed.');
        }

        const userData = result.user; 
        
        // Save profile data to localStorage 
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Redirect to profile page
        l_status.textContent = "Login successful. Redirecting...";
        location.href = 'profile.html';

    } catch (err) {
        l_status.textContent = err.message || 'Login failed due to a network error.';
    }
});