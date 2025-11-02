// app.js - MONGODB/EXPRESS API VERSION READY FOR DEPLOYMENT
import { BACKEND_BASE_URL, checkPort } from './config.js';

// Log API connectivity info
checkPort();

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
// NOTE: index.html uses id="profilesGrid". Ensure we target that element.
const profilesGrid = document.getElementById('profilesGrid');

async function fetchAllProfiles() {
    if (!profilesGrid) return;

    try {
        const response = await fetch(`${BACKEND_BASE_URL}/profiles`);
        if (!response.ok) {
            throw new Error('Failed to fetch profiles.');
        }

        const profiles = await response.json();
        renderProfiles(profiles);

    } catch (error) {
        console.error("Error fetching profiles:", error);
        profilesGrid.innerHTML = '<p class="text-danger">Failed to load profiles. Server error.</p>';
    }
}

function renderProfiles(profiles) {
    profilesGrid.innerHTML = '';
    if (!profiles || profiles.length === 0) {
        profilesGrid.innerHTML = '<p>No users found yet.</p>';
        return;
    }

    profiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'card';

        // Robust handling for skills: backend may return an array or a comma-separated string
        const skillsArr = Array.isArray(profile.skills)
            ? profile.skills
            : (typeof profile.skills === 'string' ? profile.skills.split(',').map(s=>s.trim()).filter(Boolean) : []);

        card.innerHTML = `
            <div class="top">
                <img class="avatar" src="${profile.profilePic || 'default-profile.png'}" alt="${profile.name}">
                <div class="info">
                    <h4>${profile.name}</h4>
                    <p>${profile.city || ''}</p>
                </div>
            </div>
            <div class="skills">
                ${skillsArr.map(s=>`<span class="badge">${s}</span>`).join('')}
            </div>
            <div class="hidden-meta">
                <p>${profile.email || ''}</p>
                <p>${profile.experience || 0} yrs experience</p>
                <a class="view-btn" href="profile.html?view=${profile.id || profile._id || profile.uid}">View Profile</a>
            </div>
        `;

        profilesGrid.appendChild(card);
    });
}

// If we're on the index page with a profilesGrid element, fetch profiles
if (profilesGrid) {
    fetchAllProfiles();
}
