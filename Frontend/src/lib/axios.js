import axios from 'axios';
import { supabase } from '@/lib/supabase.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// --- ADD THIS INTERCEPTOR ---
// This checks the response from the server
api.interceptors.response.use(
  (response) => response, // If the request was successful, just return the response
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is a 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've tried this
      
      console.warn("Detected 401 Unauthorized. Token may be expired.");
      
      // Try to refresh the token
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !session) {
        // If refresh fails, the user is truly unauthenticated.
        // Force a sign-out and redirect.
        console.error("Token refresh failed. Signing out.");
        await supabase.auth.signOut();
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(error);
      }
      
      // If refresh succeeds, update the header and retry the original request
      console.log("Token refreshed. Retrying original request.");
      originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);
// --- END OF FIX ---

export default api;


// import axios from 'axios';
// import { supabase } from '@/lib/supabase.js';

// // This code tells your app:
// // 1. Use the VITE_API_URL set in Vercel (for production).
// // 2. If that's not found, fall back to localhost (for development).
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
// });

// api.interceptors.request.use(async (config) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (session?.access_token) {
//     config.headers.Authorization = `Bearer ${session.access_token}`;
//   }
//   return config;
// });

// export default api;

// import axios from 'axios';
// import { supabase } from '@/lib/supabase.js'; // Using alias

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
// });

// api.interceptors.request.use(async (config) => {
//   const { data: { session } } = await supabase.auth.getSession();
//   if (session?.access_token) {
//     config.headers.Authorization = `Bearer ${session.access_token}`;
//   }
//   return config;
// });

// export default api;