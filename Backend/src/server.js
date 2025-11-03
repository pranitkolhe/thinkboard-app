import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from 'http';
import { Server } from 'socket.io';
import { supabase } from './config/supabaseClient.js';
import notesRoutes from "./routes/notesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import rateLimitter from "./middleware/rateLimitter.js"; // Assuming rateLimitter.js exists

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", rateLimitter); // Apply rate limiter to all api routes

app.use("/api/notes", notesRoutes);
app.use("/api", uploadRoutes); // Contains '/notes/:noteId/upload'

io.on('connection', (socket) => {
  socket.on('join-room', (noteId) => socket.join(noteId));

  socket.on('send-message', async (data) => {
    try {
      const { noteId, content, type, fileUrl, fileName, token } = data;
      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();

      const messageData = {
        note_id: noteId, user_id: user.id, author: user.email.split('@')[0],
        avatar_url: profile?.avatar_url, content, type, file_url: fileUrl, file_name: fileName,
      };

      const { data: savedMessage, error } = await supabase.from('messages').insert(messageData).select().single();
      if (error) throw error;

      io.to(noteId).emit('receive-message', savedMessage);
    } catch (error) {
      console.error('Socket message error:', error.message);
    }
  });
});

server.listen(PORT,'0.0.0.0', () => {
  console.log(`Server listening on port: http://localhost:${PORT}`);
});


export default app;