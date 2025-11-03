// app.js - drop-in replacement (USE AS MODULE)
import { BACKEND_BASE_URL, checkPort } from './config.js';
checkPort();

// ----- Helpers & DOM refs -----
const profilesGrid = document.getElementById('profilesGrid');
const debugOn = true;

function log(...args) { if (debugOn) console.log('[app.js]', ...args); }

if (!profilesGrid) log('⚠️ profilesGrid element NOT FOUND. Make sure your index.html has <div id="profilesGrid"></div>');

// ----- Render fn -----
function renderProfiles(profiles) {
  if (!profilesGrid) {
    console.error('Cannot render profiles: profilesGrid element missing');
    return;
  }

  profilesGrid.innerHTML = '';

  if (!profiles || profiles.length === 0) {
    profilesGrid.innerHTML = '<p>No users found matching your search criteria.</p>';
    return;
  }

  profiles.forEach(profile => {
    const card = document.createElement('div');
    card.className = 'card';

    // Normalize skills to array for safe rendering
    const skillsArr = Array.isArray(profile.skills)
      ? profile.skills
      : (typeof profile.skills === 'string' ? profile.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    // robust profile image fallback (absolute URL allowed)
    const imgSrc = profile.profilePic && profile.profilePic.toString().trim() !== ''
      ? profile.profilePic
      : (profile.profilePic === '' ? 'assets/default-profile.png' : 'assets/default-profile.png');

    card.innerHTML = `
      <div class="top">
        <img class="avatar" src="${imgSrc}" alt="${escapeHtml(profile.name || 'profile')}">
        <div class="info">
          <h4>${escapeHtml(profile.name || '')}</h4>
          <p>${escapeHtml(profile.city || '')}</p>
        </div>
      </div>
      <div class="skills">
        ${skillsArr.map(s => `<span class="badge">${escapeHtml(s)}</span>`).join('')}
      </div>
      <div class="hidden-meta">
        <p>${escapeHtml(profile.email || '')}</p>
        <p>${escapeHtml(String(profile.experience || 0))} yrs experience</p>
        <a class="view-btn" href="profile.html?view=${encodeURIComponent(profile.uid || '')}">View Profile</a>
      </div>
    `;

    profilesGrid.appendChild(card);
  });
}

// basic HTML escaper to avoid accidental markup injection
function escapeHtml(str) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// ----- Fetch logic (exposed) -----
export async function loadProfiles() {
  if (!profilesGrid) {
    log('Aborting loadProfiles(): profilesGrid missing from DOM');
    return;
  }

  profilesGrid.innerHTML = '<p>Loading profiles...</p>';
  const url = `${BACKEND_BASE_URL}/profiles`;
  log('Attempting fetch ->', url);

  try {
    const resp = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }});
    log('Fetch response status:', resp.status);

    if (!resp.ok) {
      const text = await resp.text().catch(()=>null);
      throw new Error(`Fetch failed: ${resp.status} ${resp.statusText} - ${text}`);
    }

    const data = await resp.json();
    log('Fetched data (count):', Array.isArray(data) ? data.length : 'not-array', data);
    renderProfiles(data);

  } catch (err) {
    console.error('Error fetching profiles:', err);
    profilesGrid.innerHTML = `<p class="text-danger">Failed to load profiles: ${escapeHtml(err.message || 'unknown')}</p>`;
  }
}

// Expose for manual console testing
window._colabx = window._colabx || {};
window._colabx.loadProfiles = loadProfiles;
window._colabx.BACKEND_BASE_URL = BACKEND_BASE_URL;

// ----- Search wrapper (keeps your behavior) -----
export async function performSearch(query, location) {
  if (!profilesGrid) return;
  let url = `${BACKEND_BASE_URL}/search?`;
  if (query) url += `query=${encodeURIComponent(query)}&`;
  if (location) url += `location=${encodeURIComponent(location)}&`;
  url = url.endsWith('&') ? url.slice(0,-1) : url;

  if (!query && !location) {
    return loadProfiles();
  }

  profilesGrid.innerHTML = '<p>Searching...</p>';
  log('Search URL ->', url);

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    renderProfiles(data);
  } catch (err) {
    console.error('Search failed:', err);
    profilesGrid.innerHTML = '<p class="text-danger">Search failed. Try again.</p>';
  }
}

// ----- Auto-init on DOM ready (safe guard) -----
document.addEventListener('DOMContentLoaded', () => {
  // Delay to ensure DOM elements are present (very small)
  setTimeout(() => {
    if (profilesGrid) {
      log('DOM loaded — calling loadProfiles() automatically');
      loadProfiles();
    } else {
      log('DOM loaded but profilesGrid missing — not auto-loading');
    }
  }, 50);
});
