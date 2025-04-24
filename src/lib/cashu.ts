import * as secp256k1 from 'secp256k1';
import * as crypto from 'crypto';

// P2PK Token Creation
export const createP2PKToken = {
  // Generate a key pair for P2PK
  generateKeyPair: () => {
    let privateKey;
    do {
      privateKey = crypto.randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privateKey));
    
    const publicKey = secp256k1.publicKeyCreate(privateKey);
    
    return {
      privateKey: Buffer.from(privateKey).toString('hex'),
      publicKey: Buffer.from(publicKey).toString('hex')
    };
  },
  
  // Create a P2PK-locked token
  createToken: async (mintUrl: string, amount: number, publicKey: string) => {
    try {
      // For demo purposes, we'll simulate the token creation
      // In a real implementation, you would wait for the invoice to be paid
      
      // Simulate token creation with P2PK locking
      const simulatedToken = {
        token: [
          {
            mint: mintUrl,
            proofs: [
              {
                id: crypto.randomBytes(16).toString('hex'),
                amount: amount,
                secret: crypto.randomBytes(32).toString('hex'),
                C: crypto.randomBytes(32).toString('hex'),
                pubkey: publicKey, // This would be the P2PK condition
              }
            ]
          }
        ]
      };
      
      const encodedToken = JSON.stringify(simulatedToken);
      
      return {
        invoice: "simulated_invoice",
        token: encodedToken
      };
    } catch (error) {
      console.error('Error creating P2PK token:', error);
      throw new Error('Failed to create P2PK token');
    }
  }
};

// P2PK Token Spending
export const spendP2PKToken = {
  // Spend a P2PK-locked token
  spendToken: async (mintUrl: string, tokenStr: string, privateKey: string, publicKey: string) => {
    try {
      // Parse and validate the token
      const token = JSON.parse(tokenStr);
      if (!token.token || !token.token[0] || !token.token[0].proofs) {
        throw new Error('Invalid token structure');
      }
      
      // Find the proof locked with our public key
      const proof = token.token[0].proofs.find((p: { pubkey: string }) => p.pubkey === publicKey);
      if (!proof) {
        throw new Error('Token is not locked with the provided public key');
      }
      
      // Sign the proof ID to prove ownership
      const messageToSign = Buffer.from(proof.id);
      const privKeyBuffer = Buffer.from(privateKey, 'hex');
      const signature = secp256k1.ecdsaSign(messageToSign, privKeyBuffer);
      
      // Verify the signature (this would normally be done by the mint)
      const isValid = secp256k1.ecdsaVerify(
        signature.signature,
        messageToSign,
        Buffer.from(publicKey, 'hex')
      );
      
      if (!isValid) {
        throw new Error('Invalid signature');
      }
      
      // Simulate successful spending
      return "Token successfully spent! The signature was verified against the public key.";
    } catch (error: any) {
      console.error('Error spending P2PK token:', error);
      throw new Error(`Failed to spend P2PK token: ${error.message}`);
    }
  }
};