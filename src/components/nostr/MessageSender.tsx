'use client';

import { useState } from 'react';
import { publishGiftWrappedEvent } from '@/lib/nostr';

// Remove direct import of nip04 and nip19 from nostr-tools
// and handle it in the lib/nostr.ts file instead

interface MessageSenderProps {
  privateKey: string;
  publicKey: string;
}

export default function MessageSender({ privateKey, publicKey }: MessageSenderProps) {
  const [recipientInput, setRecipientInput] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSend = async () => {
    setError(null);
    setSuccess(null);
    
    if (!recipientInput.trim()) {
      setError('Please enter a recipient public key');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Send the gift-wrapped message
      // Let the nostr.ts file handle npub conversion
      await publishGiftWrappedEvent(privateKey, recipientInput, message);
      
      setSuccess('Message sent successfully!');
      setMessage('');
    } catch (e) {
      console.error('Error sending message:', e);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Send Gift-Wrapped Message</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Recipient Public Key (hex or npub)
        </label>
        <input
          type="text"
          value={recipientInput}
          onChange={(e) => setRecipientInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="npub1..."
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter your message here..."
        />
      </div>
      
      <button
        onClick={handleSend}
        disabled={isSending}
        className={`px-4 py-2 rounded text-white ${
          isSending ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isSending ? 'Sending...' : 'Send Gift-Wrapped Message'}
      </button>
    </div>
  );
}