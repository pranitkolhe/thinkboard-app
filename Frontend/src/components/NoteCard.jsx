
import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Correct import
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};

const NoteCard = ({ note, setNotes }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const isOwner = user?.id === note.user_id;
  const userName = note.profiles?.username || 'Anonymous';

  const handleEdit = (e) => {
    
    e.preventDefault();
    e.stopPropagation();

    navigate(`/edit-note/${note.id}`); // Navigate to a dedicated edit route
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Are you sure you want to delete "${note.title}"?`)) return;

    try {

      await api.delete(`/notes/${note.id}`); // Use note.id


      setNotes((prev) => prev.filter(currentNote => currentNote.id !== note.id));
      toast.success("Note Deleted Successfully!");
    } catch (error) {
      console.error("Error in deleting note", error);
      toast.error("Failed to delete the note");
    }
  };

  return (

    <Link to={`/notes/${note.id}`} className="card bg-base-100 hover:shadow-xl transition-all duration-200 border-t-4 border-solid border-primary">
      <div className='card-body'>
            <span className="font-semibold">Created by: {userName}</span>

        <h3 className='card-title text-base-content'>{note.title}</h3>
        <p className='text-base-content/70 line-clamp-3'>{note.content}</p>
      

        {isOwner && (<div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">{formatDate(new Date(note.created_at))}</span>

          <div className="flex items-center gap-1">
            <button className='btn btn-ghost btn-xs' onClick={handleEdit}>
                <PenSquareIcon className="size-4" />
            </button>
            <button className='btn btn-ghost btn-xs text-error' onClick={handleDelete}>
              <Trash2Icon className='size-4' />
            </button>
          </div>
        </div>)}
      </div>
    </Link>
  );
};

export default NoteCard;

