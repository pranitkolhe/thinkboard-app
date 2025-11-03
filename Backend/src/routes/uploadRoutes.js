import express from 'express';
import multer from 'multer';
import { supabase } from '../config/supabaseClient.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/notes/:noteId/upload', protect, upload.single('file'), async (req, res) => {
  const { noteId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded.');

  try {
    const fileName = `${noteId}/${Date.now()}-${file.originalname}`;
    const { error } = await supabase.storage.from('chat-files').upload(fileName, file.buffer, { contentType: file.mimetype });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('chat-files').getPublicUrl(fileName);
    res.status(200).json({ publicUrl, fileName: file.originalname });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send('Error uploading file.');
  }
});

export default router;