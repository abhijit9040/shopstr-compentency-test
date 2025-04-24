'use client';

import { useState } from 'react';
import KeyManager from '@/components/nostr/KeyManager';
import MessageSender from '@/components/nostr/MessageSender';
import MessageList from '@/components/nostr/MessageList';

export default function Home() {
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Shopstr Competency Test
      </h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. Nostr Gift-Wrapped Messages (NIP-17)
        </h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <KeyManager 
            privateKey={privateKey}
            publicKey={publicKey}
            setPrivateKey={setPrivateKey}
            setPublicKey={setPublicKey}
          />
          
          {privateKey && publicKey && (
            <>
              <div className="mt-8">
                <MessageSender 
                  privateKey={privateKey}
                  publicKey={publicKey}
                />
              </div>
              
              <div className="mt-8">
                <MessageList 
                  privateKey={privateKey}
                  publicKey={publicKey}
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            2. P2PK-locked Cashu Token
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <p className="mb-4">
              This demo shows how to create and spend a P2PK-locked Cashu token,
              which can be used for escrow in Shopstr.
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.href = '/cashu-demo'} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                Start Cashu Demo
              </button>
              <button 
                onClick={() => window.location.href = '/cashu-ts-demo'} 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Start Cashu-TS Demo
              </button>
              <p className="text-sm text-gray-600 mt-2">
                The Cashu-TS demo uses the actual cashu-ts library for P2PK token operations
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            3. HODL Invoice
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <p className="mb-4">
              This demo shows how to create and manage HODL invoices,
              which can be used for Lightning-based escrow in Shopstr.
            </p>
            <button 
              onClick={() => window.location.href = '/hodl-invoice'} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Start HODL Invoice Demo
            </button>
            <p>
              <a href="/hodl-invoice" className="text-blue-500 hover:underline">
                Go to HODL Invoice Demo →
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
