// profile.js - MONGODB/EXPRESS API VERSION READY FOR DEPLOYMENT

// 🎯 IMPORTANT: REPLACE THIS PLACEHOLDER WITH YOUR LIVE BACKEND URL (e.g., https://your-app-name.onrender.com/api)
const BACKEND_BASE_URL = 'https://your-render-app-name.onrender.com/api'; 
// For local testing: const BACKEND_BASE_URL = 'http://localhost:3001/api'; 

const profileImage = document.getElementById('profileImage');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileCity = document.getElementById('profileCity');
const profileSkills = document.getElementById('profileSkills');
const profileExperience = document.getElementById('profileExperience');
const profilePortfolio = document.getElementById('profilePortfolio');

const editToggle = document.getElementById('editToggle');
const editArea = document.getElementById('editArea');
const e_name = document.getElementById('e_name');
const e_city = document.getElementById('e_city');
const e_skills = document.getElementById('e_skills');
const e_exp = document.getElementById('e_exp');
const e_port = document.getElementById('e_port');
const saveBtn = document.getElementById('saveBtn');

const choosePic = document.getElementById('choosePic');
const filePic = document.getElementById('filePic');
const logoutBtn = document.getElementById('logoutBtn');

let currentProfileData = JSON.parse(localStorage.getItem('currentUser')) || {};
let uid = currentProfileData.uid; 

function updateProfileUI(data) {
  profileImage.src = data.profilePic || 'default-profile.png';
  profileName.textContent = data.name;
  profileEmail.textContent = data.email;
  profileCity.textContent = data.city;
  profileSkills.textContent = (data.skills||[]).join(', ');
  profileExperience.textContent = data.experience || 0;
  profilePortfolio.textContent = data.portfolio || 'Portfolio';
  profilePortfolio.href = data.portfolio || '#';

  e_name.value = data.name;
  e_city.value = data.city;
  e_skills.value = (data.skills||[]).join(', ');
  e_exp.value = data.experience || 0;
  e_port.value = data.portfolio || '';
}

// -----------------------------------------------------------
// Fetch profile data from Express server
// -----------------------------------------------------------
async function fetchProfileData(userId) {
    if(currentProfileData && currentProfileData.uid === userId) {
        updateProfileUI(currentProfileData);
    }
    
    try {
        // UPDATED FETCH URL (GET request)
        const response = await fetch(`${BACKEND_BASE_URL}/profile/${userId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile.');
        }

        const data = await response.json();
        currentProfileData = data;
        localStorage.setItem('currentUser', JSON.stringify(data));
        updateProfileUI(data);

    } catch (error) {
        console.error("Error fetching profile:", error);
        alert('Could not load profile: ' + error.message);
        
        if(!window.location.search.includes('view=')) {
            localStorage.removeItem('currentUser');
            location.href = 'login.html'; 
        }
    }
}

// -----------------------------------------------------------
// Initial load and authentication check
// -----------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const viewUid = params.get('view');

if (viewUid) {
    uid = viewUid;
    if (editToggle) editToggle.style.display = 'none';
    if (choosePic) choosePic.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none'; 
    if (editArea) editArea.style.display = 'none';

} else if (!uid) {
    location.href = 'login.html';
    
} 

if (uid) {
    fetchProfileData(uid);
}


// edit toggle
if (editToggle) {
    editToggle.addEventListener('click', ()=> {
        editArea.style.display = editArea.style.display === 'none' ? 'block' : 'none';
        editToggle.textContent = editArea.style.display === 'none' ? 'Edit profile' : 'Close Editor';
    });
}

// choose pic (Placeholder alert)
if (choosePic) {
    choosePic.addEventListener('click', ()=> filePic.click());
}

filePic.addEventListener('change', async () => {
  const file = filePic.files[0];
  if(!file) return;

  alert("Image upload requires a server-side handler which is not yet implemented. Please update profile data manually for now.");
});


// save changes
if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const name = e_name.value.trim();
      const city = e_city.value.trim();
      const skills = e_skills.value.split(',').map(s=>s.trim()).filter(Boolean).join(', '); 
      const experience = Number(e_exp.value) || 0;
      const portfolio = e_port.value.trim();

      if(!name){ alert('Please enter a name.'); return; }

      try {
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        
        // UPDATED FETCH URL (PUT request)
        const response = await fetch(`${BACKEND_BASE_URL}/profile/${uid}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, city, skills, experience, portfolio })
        });
        
        if (!response.ok) {
            throw new Error('Update failed on server.');
        }

        const updatedProfile = await response.json(); 
        currentProfileData = updatedProfile; 
        localStorage.setItem('currentUser', JSON.stringify(currentProfileData)); 
        
        updateProfileUI(currentProfileData); 
        
        alert('Profile updated successfully!');
        editArea.style.display = 'none'; 
        editToggle.textContent = 'Edit profile';

      } catch (error) {
        console.error("Error saving profile:", error);
        alert('Failed to save profile: ' + error.message);
      } finally {
        saveBtn.textContent = 'Save changes';
        saveBtn.disabled = false;
      }
    });
}

// logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', ()=> {
        localStorage.removeItem('currentUser');
        location.href = 'index.html'; 
    });
}