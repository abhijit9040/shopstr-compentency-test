'use client';

import { useEffect } from 'react';
import { generateSecretKey, getPublicKey } from 'nostr-tools/pure';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { nip19 } from 'nostr-tools';

interface KeyManagerProps {
  privateKey: string | null;
  publicKey: string | null;
  setPrivateKey: (key: string) => void;
  setPublicKey: (key: string) => void;
}

export default function KeyManager({ 
  privateKey, 
  publicKey, 
  setPrivateKey, 
  setPublicKey 
}: KeyManagerProps) {
  
  useEffect(() => {
    // Generate keys on first load if not already present
    if (!privateKey || !publicKey) {
      generateKeys();
    }
  }, [privateKey, publicKey]);

  const generateKeys = () => {
    const newPrivateKeyBytes = generateSecretKey();
    const newPublicKey = getPublicKey(newPrivateKeyBytes);
    
    // Convert Uint8Array to hex string
    const newPrivateKey = bytesToHex(newPrivateKeyBytes);
    
    setPrivateKey(newPrivateKey);
    setPublicKey(newPublicKey);
  };

  if (!privateKey || !publicKey) {
    return <div>Generating keys...</div>;
  }

  // For demo purposes, show the encoded keys
  const npub = nip19.npubEncode(publicKey);
  const nsec = nip19.nsecEncode(hexToBytes(privateKey));

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Your Nostr Keys</h3>
      
      <div className="mb-2">
        <span className="font-semibold">Public Key (npub):</span>
        <div className="bg-gray-100 p-2 rounded overflow-x-auto">
          <code className="text-sm break-all">{npub}</code>
        </div>
      </div>
      
      <div className="mb-4">
        <span className="font-semibold">Private Key (nsec):</span>
        <div className="bg-gray-100 p-2 rounded overflow-x-auto">
          <code className="text-sm break-all">{nsec}</code>
        </div>
        <p className="text-red-500 text-xs mt-1">
          Keep this private! Never share your private key with anyone.
        </p>
      </div>
      
      <button
        onClick={generateKeys}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate New Keys
      </button>
    </div>
  );
}