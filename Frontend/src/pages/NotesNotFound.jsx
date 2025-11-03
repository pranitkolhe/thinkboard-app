import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon } from 'lucide-react';

const NotesNotFound = () => {
  return (
    <div className='text-center py-20'>
      <div className='flex justify-center mb-4'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary opacity-50"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <h2 className='text-2xl font-semibold mb-2'>No Notes Found</h2>
      <p className='text-base-content/70 mb-6'>
        It looks like you haven't created any notes yet.
      </p>
      <Link to="/create-note" className="btn btn-primary">
        <PlusCircleIcon className="size-5 mr-2" />
        Create Your First Note
      </Link>
    </div>
  );
};

export default NotesNotFound;