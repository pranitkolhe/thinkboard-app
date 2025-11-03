import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EditIcon, Trash2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import ChatSidebar from '../components/ChatSidebar';
import { useAuth } from '../context/AuthContext';

const NoteDetailPage = () => {
  const { id: noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [noteRes, messagesRes] = await Promise.all([
          api.get(`/notes/${noteId}`),
          api.get(`/notes/${noteId}/messages`)
        ]);
        setNote(noteRes.data);
        setMessages(messagesRes.data);
      } catch (error) {
        toast.error("Could not find the requested note.");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [noteId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
      return;
    }
    try {
      await api.delete(`/notes/${noteId}`);
      toast.success("Note deleted successfully!");
      navigate('/');
    } catch (error) {
      toast.error("Failed to delete note. You may not be the owner.");
    }
  };

  if (loading) {
    return <div className='text-center text-primary py-20'>Loading Note...</div>;
  }

  if (!note) {
    return <div className='text-center text-error py-20'>Note not found.</div>;
  }

  const isOwner = user?.id === note.user_id;


  return (
    <div className='flex h-screen bg-base-200'>
      <main className='flex-grow p-8 overflow-y-auto'>
        <div className='max-w-3xl mx-auto'>
          <div className='flex justify-between items-center mb-6'>
            <Link to={"/"} className="btn btn-ghost">
              <ArrowLeftIcon className='size-5 mr-2' />
              Back to Notes
            </Link>

            {isOwner && (
              <div className="flex items-center gap-2">
                <Link to={`/edit-note/${note.id}`} className="btn btn-ghost btn-square" aria-label="Edit Note">
                  <EditIcon className="size-5" />
                </Link>
                <button onClick={handleDelete} className="btn btn-ghost btn-square text-error" aria-label="Delete Note">
                  <Trash2Icon className="size-5" />
                </button>
              </div>
            )}
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className='card-body'>
              <h2 className="card-title text-3xl mb-4">{note.title}</h2>
              <p className='text-base-content whitespace-pre-wrap'>{note.content}</p>
            </div>
          </div>
        </div>
      </main>

      <aside className='w-96 border-l border-base-300 flex-shrink-0'>
        <ChatSidebar
          noteId={noteId}
          noteTitle={note.title}
          initialMessages={messages}
        />
      </aside>
    </div>
  );
};

export default NoteDetailPage;