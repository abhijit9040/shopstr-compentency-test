'use client';

import { useState } from 'react';
import { createHodlInvoice, settleHodlInvoice, cancelHodlInvoice } from '@/lib/lightning';
import Link from 'next/link';

export default function HodlInvoicePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(1000);
  const [memo, setMemo] = useState('Test HODL Invoice');
  const [expirySeconds, setExpirySeconds] = useState(3600);
  const [invoiceData, setInvoiceData] = useState<{
    paymentRequest: string;
    paymentHash: string;
    preimage: string;
  } | null>(null);
  const [invoiceStatus, setInvoiceStatus] = useState<string | null>(null);
  const [settleResult, setSettleResult] = useState<string | null>(null);

  const handleCreateInvoice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await createHodlInvoice(amount, memo, expirySeconds);
      setInvoiceData(data);
      setStep(2);
    } catch (e) {
      console.error('Error creating HODL invoice:', e);
      setError('Failed to create HODL invoice. This is a simulation only.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!invoiceData) {
      setError('No invoice data available');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would check with LND
      // For the demo, we'll simulate a status
      const statuses = ['OPEN', 'ACCEPTED', 'SETTLED', 'CANCELED'];
      const randomStatus = statuses[Math.floor(Math.random() * 2)]; // Only OPEN or ACCEPTED for demo
      
      setInvoiceStatus(randomStatus);
      
      if (randomStatus === 'ACCEPTED') {
        setStep(3);
      }
    } catch (e) {
      console.error('Error checking invoice status:', e);
      setError('Failed to check invoice status');
    } finally {
      setLoading(false);
    }
  };

  const handleSettleInvoice = async () => {
    if (!invoiceData) {
      setError('No invoice data available');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await settleHodlInvoice(invoiceData.preimage);
      setSettleResult(result);
      setInvoiceStatus('SETTLED');
      setStep(4);
    } catch (e) {
      console.error('Error settling invoice:', e);
      setError('Failed to settle invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInvoice = async () => {
    if (!invoiceData) {
      setError('No invoice data available');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await cancelHodlInvoice(invoiceData.paymentHash);
      setSettleResult(result);
      setInvoiceStatus('CANCELED');
      setStep(4);
    } catch (e) {
      console.error('Error canceling invoice:', e);
      setError('Failed to cancel invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">HODL Invoice Demo</h1>
      
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Step 1: Create HODL Invoice</h2>
          
          {step === 1 ? (
            <div>
              <p className="mb-4 text-gray-600">
                A HODL invoice is a Lightning invoice where the payment is held until 
                you explicitly settle or cancel it. This is useful for escrow scenarios.
              </p>
              
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
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Memo</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Expiry (seconds)</label>
                <input
                  type="number"
                  value={expirySeconds}
                  onChange={(e) => setExpirySeconds(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  min="60"
                />
              </div>
              
              <button
                onClick={handleCreateInvoice}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {loading ? 'Creating...' : 'Create HODL Invoice'}
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded">
              <div className="mb-2">
                <span className="font-semibold">Amount:</span> {invoiceData?.paymentRequest ? amount : 0} sats
              </div>
              <div className="mb-2">
                <span className="font-semibold">Memo:</span> {invoiceData?.paymentRequest ? memo : ''}
              </div>
              <div>
                <span className="font-semibold">Expiry:</span> {invoiceData?.paymentRequest ? expirySeconds : 0} seconds
              </div>
            </div>
          )}
        </div>
        
        {step >= 2 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Step 2: Invoice Details</h2>
            
            <div className="bg-gray-50 p-4 rounded">
              <div className="mb-4">
                <span className="font-semibold">Payment Request:</span>
                <div className="bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                  <code className="text-sm break-all">{invoiceData?.paymentRequest}</code>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="font-semibold">Payment Hash:</span>
                <div className="bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                  <code className="text-sm break-all">{invoiceData?.paymentHash}</code>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="font-semibold">Preimage (secret):</span>
                <div className="bg-gray-100 p-2 rounded overflow-x-auto mt-1">
                  <code className="text-sm break-all">{invoiceData?.preimage}</code>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  In a real application, you would keep this secret until you want to settle the invoice.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleCheckStatus}
                  disabled={loading}
                  className={`px-4 py-2 rounded text-white ${
                    loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {loading ? 'Checking...' : 'Check Invoice Status'}
                </button>
              </div>
              
              {invoiceStatus && (
                <div className="mt-4">
                  <span className="font-semibold">Current Status:</span>{' '}
                  <span className={`font-medium ${
                    invoiceStatus === 'SETTLED' ? 'text-green-600' :
                    invoiceStatus === 'ACCEPTED' ? 'text-blue-600' :
                    invoiceStatus === 'CANCELED' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {invoiceStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {step >= 3 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Step 3: Settle or Cancel Invoice
            </h2>
            
            {step === 3 ? (
              <div>
                <p className="mb-4 text-gray-600">
                  The invoice is in <span className="font-medium text-blue-600">ACCEPTED</span> state,
                  which means the payment has been received but is being held.
                  You can now either settle the invoice (release the funds to the recipient)
                  or cancel it (return the funds to the sender).
                </p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleSettleInvoice}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${
                      loading ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {loading ? 'Settling...' : 'Settle Invoice (Release Funds)'}
                  </button>
                  
                  <button
                    onClick={handleCancelInvoice}
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white ${
                      loading ? 'bg-red-300' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {loading ? 'Canceling...' : 'Cancel Invoice (Return Funds)'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded">
                <div className="mb-2">
                  <span className="font-semibold">Final Status:</span>{' '}
                  <span className={`font-medium ${
                    invoiceStatus === 'SETTLED' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {invoiceStatus}
                  </span>
                </div>
                
                <div>
                  <span className="font-semibold">Result:</span>{' '}
                  <span>{settleResult}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {step >= 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Step 4: Complete
            </h2>
            
            <div className="bg-gray-50 p-4 rounded">
              <p>
                The HODL invoice demonstration is complete. In a real application:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>You would connect to a real LND node</li>
                <li>The invoice would be paid by a real user</li>
                <li>You would settle or cancel based on business logic</li>
                <li>This mechanism could be used for escrow in Shopstr</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}