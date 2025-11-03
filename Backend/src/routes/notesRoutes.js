import express from 'express';
import { createNote, deleteNote, getAllNotes, getSingleNote, updateNote, getNoteMessages } from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ALL note and message routes should be protected
router.route('/')
  .get(protect, getAllNotes)
  .post(protect, createNote);

router.route('/:id')
  .get(protect, getSingleNote) // Add protect here
  .patch(protect, updateNote)
  .delete(protect, deleteNote);

router.route('/:id/messages')
  .get(protect, getNoteMessages);

export default router;