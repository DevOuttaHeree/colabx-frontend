// ✅ Backend URL deployed on Render
export const BACKEND_BASE_URL = "https://colabx-api-1.onrender.com/api";

// ✅ Debug helper
export function checkPort() {
  console.log("Frontend Origin:", window.location.origin);
  console.log("Backend URL:", BACKEND_BASE_URL);
}
