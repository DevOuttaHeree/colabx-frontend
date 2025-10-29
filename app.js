// app.js - MONGODB/EXPRESS API VERSION READY FOR DEPLOYMENT

// 🎯 IMPORTANT: REPLACE THIS PLACEHOLDER WITH YOUR LIVE BACKEND URL (e.g., https://your-app-name.onrender.com/api)
const BACKEND_BASE_URL = 'https://your-render-app-name.onrender.com/api'; 
// For local testing: const BACKEND_BASE_URL = 'http://localhost:3001/api'; 

// --- Registration Logic ---
const reg_name = document.getElementById('reg_name');
const reg_email = document.getElementById('reg_email');
const reg_pass = document.getElementById('reg_pass');
const reg_city = document.getElementById('reg_city');
const reg_skills = document.getElementById('reg_skills');
const reg_exp = document.getElementById('reg_exp');
const reg_port = document.getElementById('reg_port');
const reg_btn = document.getElementById('reg_btn');
const reg_status = document.getElementById('reg_status');

if (reg_btn) {
    reg_btn.addEventListener('click', async () => {
        const name = reg_name.value.trim();
        const email = reg_email.value.trim();
        const password = reg_pass.value;
        const city = reg_city.value.trim();
        const skills = reg_skills.value.trim();
        const experience = reg_exp.value;
        const portfolio = reg_port.value.trim();

        if (!name || !email || !password) {
            reg_status.textContent = "Name, email, and password are required.";
            return;
        }

        reg_status.style.color = 'tomato';
        reg_status.textContent = "Registering...";

        try {
            // UPDATED FETCH URL
            const response = await fetch(`${BACKEND_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, city, skills, experience, portfolio })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed.');
            }

            reg_status.style.color = 'green';
            reg_status.textContent = "Registration successful! You can now log in.";
            
        } catch (err) {
            reg_status.style.color = 'red';
            reg_status.textContent = err.message || 'Registration failed due to a server error.';
        }
    });
}

// --- All Profiles Logic ---
const profilesList = document.getElementById('profilesList');

async function fetchAllProfiles() {
    if (!profilesList) return;

    try {
        // UPDATED FETCH URL
        const response = await fetch(`${BACKEND_BASE_URL}/profiles`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch profiles.');
        }

        const profiles = await response.json();
        renderProfiles(profiles);

    } catch (error) {
        console.error("Error fetching profiles:", error);
        profilesList.innerHTML = '<p class="text-danger">Failed to load profiles. Server error.</p>';
    }
}

function renderProfiles(profiles) {
    profilesList.innerHTML = '';
    if (profiles.length === 0) {
        profilesList.innerHTML = '<p>No users found yet.</p>';
        return;
    }

    profiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${profile.name}</h5>
                    <p class="card-text">
                        <strong>Email:</strong> ${profile.email}<br>
                        <strong>City:</strong> ${profile.city || 'N/A'}<br>
                        <strong>Skills:</strong> ${(profile.skills || []).join(', ') || 'N/A'}<br>
                        <strong>Exp:</strong> ${profile.experience || 0} yrs
                    </p>
                    <a href="profile.html?view=${profile.uid}" class="btn btn-sm btn-primary">View Profile</a>
                </div>
            </div>
        `;
        profilesList.appendChild(card);
    });
}

// Check if the current page is index.html (where profilesList exists)
if (document.getElementById('profilesList')) {
    fetchAllProfiles();
}