// app.js - MONGODB/EXPRESS API VERSION READY FOR DEPLOYMENT
import { BACKEND_BASE_URL, checkPort } from './config.js';

// Log API connectivity info
checkPort();

// ---------------------------- REGISTRATION LOGIC ----------------------------
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
            const response = await fetch(`${BACKEND_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, city, skills, experience, portfolio })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Registration failed.');

            reg_status.style.color = 'green';
            reg_status.textContent = "✅ Registration successful! You can now log in.";
            
        } catch (err) {
            reg_status.style.color = 'red';
            reg_status.textContent = err.message || 'Server error.';
        }
    });
}

// ---------------------------- PROFILE RENDERING ----------------------------
const profilesGrid = document.getElementById('profilesGrid');

function renderProfiles(profiles) {
    profilesGrid.innerHTML = '';

    if (!profiles || profiles.length === 0) {
        profilesGrid.innerHTML = '<p>No users found matching your search criteria.</p>';
        return;
    }

    profiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'card';

        const skillsArr = Array.isArray(profile.skills)
            ? profile.skills
            : (typeof profile.skills === 'string' ? profile.skills.split(',').map(s=>s.trim()) : []);

        const imgSrc = profile.profilePic && profile.profilePic.trim() !== ""
            ? profile.profilePic
            : "assets/default-profile.png";

        card.innerHTML = `
            <div class="top">
                <img class="avatar" src="${imgSrc}" alt="${profile.name}">
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
                <a class="view-btn" href="profile.html?view=${profile.uid}">View Profile</a>
            </div>
        `;

        profilesGrid.appendChild(card);
    });
}

// ---------------------------- FETCH ALL PROFILES ----------------------------
async function fetchAllProfiles() {
    if (!profilesGrid) return;

    try {
        const res = await fetch(`${BACKEND_BASE_URL}/profiles`);
        const data = await res.json();

        console.log("✅ Loaded profiles:", data);
        renderProfiles(data);

    } catch (err) {
        console.error("❌ Error loading profiles:", err);
        profilesGrid.innerHTML = '<p class="text-danger">Failed to load profiles.</p>';
    }
}

// ---------------------------- SEARCH ----------------------------
async function performSearch(query, location) {
    if (!profilesGrid) return;

    let url = `${BACKEND_BASE_URL}/search?`;
    if (query) url += `query=${encodeURIComponent(query)}&`;
    if (location) url += `location=${encodeURIComponent(location)}&`;
    url = url.endsWith('&') ? url.slice(0, -1) : url;

    if (!query && !location) {
        fetchAllProfiles();
        return;
    }

    profilesGrid.innerHTML = '<p>Searching...</p>';

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderProfiles(data);

    } catch (error) {
        console.error('Search error:', error);
        profilesGrid.innerHTML = '<p class="text-danger">Search failed.</p>';
    }
}

// ---------------------------- INITIAL LOAD & EVENT LISTENERS ----------------------------
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const locationInput = document.getElementById('locationInput');

    if (profilesGrid) {
        fetchAllProfiles(); 
    }

    if (searchButton && searchInput && locationInput) {
        const triggerSearch = () => {
            performSearch(searchInput.value, locationInput.value);
        };

        searchButton.addEventListener('click', triggerSearch);

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); triggerSearch(); }
        });

        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); triggerSearch(); }
        });
    }
});
