// import { supabase } from '../config/adminSupabase.js';

// export const protect = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   const { data: { user }, error } = await supabase.auth.getUser(token);
//   if (error || !user) {
//     return res.status(401).json({ message: 'Not authorized, token failed' });
//   }

//   req.user = user;
//   next();
// };

import { supabase } from '../config/supabaseClient.js'; // Use admin client

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }

  req.user = user;
  req.token = token; // <-- Add this line
  next();
};