'use client';

import { useState } from 'react';
import { createP2PKToken, spendP2PKToken } from '@/lib/cashu';

export default function CashuDemo() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [amount, setAmount] = useState(100);
  const [mintUrl, setMintUrl] = useState('https://legend.lnbits.com/cashu/api/v1/4gr9Xcmz3XEkUNwiBiQGoC');
  const [invoice, setInvoice] = useState<string | null>(null);
  const [spendResult, setSpendResult] = useState<string | null>(null);

  const handleGenerateKeys = () => {
    setError(null);
    
    try {
      const { privateKey: priv, publicKey: pub } = createP2PKToken.generateKeyPair();
      setPrivateKey(priv);
      setPublicKey(pub);
    } catch (e) {
      console.error('Error generating keys:', e);
      setError('Failed to generate keys');
    }
  };

  const handleCreateToken = async () => {
    if (!publicKey) {
      setError('Please generate keys first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { invoice: inv, token: tok } = await createP2PKToken.createToken(
        mintUrl,
        amount,
        publicKey
      );
      
      setInvoice(inv);
      setToken(tok);
      setStep(2);
    } catch (e) {
      console.error('Error creating token:', e);
      setError('Failed to create token');
    } finally {
      setLoading(false);
    }
  };

  const handleSpendToken = async () => {
    if (!privateKey || !publicKey || !token) {
      setError('Missing required information');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await spendP2PKToken.spendToken(
        mintUrl,
        token,
        privateKey,
        publicKey
      );
      
      setSpendResult(result);
      setStep(3);
    } catch (e) {
      console.error('Error spending token:', e);
      setError('Failed to spend token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">P2PK-locked Cashu Token Demo</h1>
      
      <div className="mb-4">
        <a href="" className="text-blue-500 hover:underline">
          ← Back to Home
        </a>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Step 1: Generate Keys for P2PK Locking</h2>
          
          {privateKey && publicKey ? (
            <div className="bg-gray-50 p-4 rounded">
              <div className="mb-2">
                <span className="font-semibold">Private Key:</span>
                <div className="bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                  <code className="text-sm break-all">{privateKey}</code>
                </div>
              </div>
              <div>
                <span className="font-semibold">Public Key:</span>
                <div className="bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                  <code className="text-sm break-all">{publicKey}</code>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerateKeys}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Generate Key Pair
            </button>
          )}
        </div>
        
        {privateKey && publicKey && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Step 2: Create P2PK-locked Token
            </h2>
            
            {step < 2 ? (
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Mint URL</label>
                  <input
                    type="text"
                    value={mintUrl}
                    onChange={(e) => setMintUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Amount (sats)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    min="1"
                  />
                </div>
                
                <button
                  onClick={handleCreateToken}
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white ${
                    loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? 'Creating...' : 'Create P2PK Token'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded">
                <div className="mb-4">
                  <span className="font-semibold">Lightning Invoice:</span>
                  <div className="bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                    <code className="text-sm break-all">{invoice}</code>
                  </div>
                  <p className="text-sm mt-1">
                    Pay this invoice to fund the token
                  </p>
                </div>
                
                <div className="mb-4">
                  <span className="font-semibold">P2PK-locked Token:</span>
                  <div className="bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                    <code className="text-sm break-all">{token}</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {step >= 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Step 3: Spend P2PK-locked Token
            </h2>
            
            {step < 3 ? (
              <div>
                <p className="mb-4">
                  After paying the invoice, you can now spend the token by proving ownership
                  of the private key.
                </p>
                
                <button
                  onClick={handleSpendToken}
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white ${
                    loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? 'Spending...' : 'Spend P2PK Token'}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded">
                <span className="font-semibold">Spend Result:</span>
                <div className="bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                  <code className="text-sm break-all">{spendResult}</code>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}