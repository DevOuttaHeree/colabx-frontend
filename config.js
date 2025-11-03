// config.js
// Backend base URL - must be your Render service + /api
export const BACKEND_BASE_URL = "https://colabx-api-1.onrender.com/api";

// small helper so we can see values in console quickly
export function checkPort() {
  console.log("Frontend Origin:", window.location.origin);
  console.log("Backend URL:", BACKEND_BASE_URL);
}
