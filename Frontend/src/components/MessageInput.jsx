import React, { useState, useRef } from 'react';
import { SendIcon, PaperclipIcon } from 'lucide-react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const MessageInput = ({ onSendMessage, noteId, socket }) => {
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const { session } = useAuth(); // Get the user's session

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(content);
    setContent('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // The axios interceptor automatically adds the token here
      const res = await api.post(`/notes/${noteId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { publicUrl, fileName } = res.data;

      // Get the token from the session before emitting
      const { data: sessionData } = await session;
      if (!sessionData.session) throw new Error('User not authenticated');

      if (socket) {
        // Add the token to the socket payload
        socket.emit('send-message', {
          noteId,
          type: 'file',
          fileUrl: publicUrl,
          fileName: fileName,
          token: sessionData.session.access_token, // This is the fix
        });
      }
      toast.success('File sent successfully!');
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('File upload failed.');
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        className="btn btn-ghost btn-square"
        onClick={() => fileInputRef.current.click()}
        disabled={isUploading}
      >
        {isUploading ? <span className="loading loading-spinner"></span> : <PaperclipIcon className="size-5" />}
      </button>

      <input
        type="text"
        placeholder="Type a message..."
        className="input input-bordered flex-grow"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isUploading}
      />
      <button type="submit" className="btn btn-primary btn-square" disabled={isUploading}>
        <SendIcon className="size-5" />
      </button>
    </form>
  );
};

export default MessageInput;