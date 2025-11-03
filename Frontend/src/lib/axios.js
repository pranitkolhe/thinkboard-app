import axios from 'axios';
import { supabase } from '@/lib/supabase.js';

// This code tells your app:
// 1. Use the VITE_API_URL set in Vercel (for production).
// 2. If that's not found, fall back to localhost (for development).
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

export default api;