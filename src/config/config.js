export const config = {
  API_URL:
    import.meta.env.VITE_API_URL ||
    "https://anvaya-crm-backend-coral.vercel.app/api",
  // API_URL: "http://localhost:5000/api", // Local development backend
  TOKEN_KEY: import.meta.env.VITE_TOKEN_KEY || "anvaya_auth_token",
};
