import React from 'react';
import { FileIcon, DownloadIcon } from 'lucide-react';
import { isImage } from '@/lib/utils.js'; // Make sure this path is correct

const Message = ({ message, isCurrentUser }) => {
  const { author, avatar_url, content, type, fileUrl, fileName, created_at } = message;

  const chatAlignment = isCurrentUser ? 'chat-end' : 'chat-start';
  const bubbleColor = isCurrentUser ? 'chat-bubble-primary' : 'chat-bubble-secondary';

  // --- THIS IS THE FIX ---
  // This function bypasses React Router by creating an in-memory link
  // and clicking it programmatically.
  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = `${fileUrl}?download=true`; // Keep the Supabase download parameter
      link.setAttribute('download', fileName || 'download'); // Tell the browser the filename
      
      // Append to the document, click, and then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  // --- END OF FIX ---

  const renderAvatar = () => (
    <div className="chat-image avatar">
      <div className="w-10 rounded-full">
        <img src={avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${author}`} alt="User avatar" />
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="chat-header text-xs opacity-50 mb-1">
      {author}
      <time className="text-xs opacity-50 ml-2">
        {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
    </div>
  );

  // Generic file bubble (for docs, pdfs, etc.)
  const renderFileMessage = () => (
    <div className={`chat-bubble flex items-center gap-3 ${bubbleColor}`}>
      <FileIcon className="size-6 flex-shrink-0" />
      <div className="flex-grow">
        <p className="font-semibold">{fileName || 'Attached File'}</p>
      </div>
      
      {/* Use the new handleDownload function on a button */}
      <button onClick={handleDownload} className="btn btn-ghost btn-sm btn-square">
        <DownloadIcon className="size-5" />
      </button>
    </div>
  );

  // Image preview bubble
  const renderImageMessage = () => (
    <div className={`chat-bubble p-0 ${bubbleColor} overflow-hidden`}>
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        <img 
          src={fileUrl} 
          alt={fileName || 'Uploaded image'} 
          className="max-w-xs cursor-pointer" 
        />
      </a>
    </div>
  );
  
  const renderTextMessage = () => (
      <div className={`chat-bubble ${bubbleColor}`}>{content}</div>
  );

  return (
    <div className={`chat ${chatAlignment}`}>
      {renderAvatar()}
      <div className='flex flex-col'>
        {renderHeader()}
        {type === 'text' && renderTextMessage()}
        {type === 'file' && isImage(fileName) && renderImageMessage()}
        {type === 'file' && !isImage(fileName) && renderFileMessage()}
      </div>
    </div>
  );
};

export default Message;