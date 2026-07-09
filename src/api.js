const rawUrl = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "https://flight-drone-eta.vercel.app");
export const API_URL = rawUrl.replace(/\/api\/?$/, "");
