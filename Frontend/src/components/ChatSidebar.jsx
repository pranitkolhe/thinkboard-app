import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Message from './Message';
import MessageInput from './MessageInput';
import { useAuth } from '../context/AuthContext';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const ChatSidebar = ({ noteId, noteTitle, initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user, session } = useAuth(); // Get the current user

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    const socket = socketRef.current;
    socket.emit('join-room', noteId);

    socket.on('receive-message', (newMessage) => {
      setMessages((prev) => {
        if (prev.find(msg => msg.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      socket.emit('leave-room', noteId);
      socket.disconnect();
    };
  }, [noteId]);

  const handleSendMessage = async (content) => {
    const socket = socketRef.current;
    if (socket && content.trim()) {
        const { data } = await session;
        const messageData = {
            noteId, content, token: data.session.access_token, type: 'text'
        };
        socket.emit('send-message', messageData);
    }
  };

  return (
    <div className='h-full flex flex-col bg-base-200'>
      <div className='p-4 border-b border-base-300'>
        <h3 className='text-xl font-bold'>Discussion</h3>
        <p className='text-sm text-base-content/70 truncate'>{noteTitle}</p>
      </div>
      <div className='flex-grow p-4 overflow-y-auto space-y-4'>
        {messages.map((msg) => (
          // Pass 'isCurrentUser' prop to the Message component
          <Message 
            key={msg.id} 
            message={msg} 
            isCurrentUser={msg.user_id === user?.id} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className='p-4 border-t border-base-300'>
        <MessageInput onSendMessage={handleSendMessage} noteId={noteId} socket={socketRef.current} />
      </div>
    </div>
  );
};
export default ChatSidebar;