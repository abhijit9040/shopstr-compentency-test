'use client';

import { useEffect, useState } from 'react';
import { nip04 } from 'nostr-tools';
import { subscribeToGiftWrappedEvents } from '@/lib/nostr';

interface Message {
  id: string;
  from: string;
  content: string;
  timestamp: string;
}

interface MessageListProps {
  privateKey: string;
  publicKey: string;
}

export default function MessageList({ privateKey, publicKey }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      
      try {
        unsubscribe = subscribeToGiftWrappedEvents(
          publicKey,
          async (event) => {
            try {
              // Decrypt the message
              const decryptedContent = await nip04.decrypt(
                privateKey,
                event.pubkey,
                event.content
              );
              
              // Add to messages
              setMessages((prev) => [
                ...prev,
                {
                  id: event.id,
                  from: event.pubkey,
                  content: decryptedContent,
                  timestamp: new Date(event.created_at * 1000).toLocaleString(),
                },
              ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              );
            } catch (error) {
              console.error('Error decrypting message:', error);
            }
          }
        );
      } catch (error) {
        console.error('Error subscribing to events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [privateKey, publicKey]);

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Received Messages</h3>
      
      {isLoading ? (
        <div className="text-center py-4">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded text-center">
          No messages received yet
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-gray-50 p-4 rounded">
              <div className="mb-2">
                <span className="font-semibold">From:</span>{' '}
                <code className="text-sm break-all">{msg.from}</code>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Time:</span>{' '}
                <span>{msg.timestamp}</span>
              </div>
              <div>
                <span className="font-semibold">Message:</span>
                <div className="mt-1 p-2 bg-white rounded">{msg.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}