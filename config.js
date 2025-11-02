// config.js - Central configuration for the frontend app
export const BACKEND_BASE_URL = 'https://colabx-api.onrender.com/api';

// Helper function to log API connectivity info
export function checkPort() {
    console.log(`Frontend URL: ${window.location.origin}`);
    console.log(`Backend URL: ${BACKEND_BASE_URL}`);
}