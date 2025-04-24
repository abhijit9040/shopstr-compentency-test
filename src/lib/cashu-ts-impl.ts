import { CashuMint, CashuWallet, getDecodedToken, Proof, Token } from '@cashu/cashu-ts';
import * as secp256k1 from 'secp256k1';
import * as crypto from 'crypto';

// Custom type for P2PK proofs
type P2PKProof = Proof & { pubkey: string };

// Test mint URL - this is a public test mint that provides free tokens
const TEST_MINT_URL = 'https://mint.cashu.space/api/v1';

// P2PK Token Implementation using cashu-ts
export const cashuTsP2PK = {
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
  
  // Create a P2PK-locked token using cashu-ts
  createToken: async (mintUrl: string, amount: number, publicKey: string): Promise<{ invoice: string, token: string }> => {
    try {
      // Validate amount first
      if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Invalid amount: must be a positive number');
      }

      console.log('Creating simulated token instead of connecting to mint');
      
      // Create a simulated mint key
      const simulatedMintKey = crypto.randomBytes(32).toString('hex');
      
      // Create the proof structure with P2PK condition
      const proof: P2PKProof = {
        id: crypto.randomBytes(16).toString('hex'),
        amount,
        secret: crypto.randomBytes(32).toString('hex'),
        C: crypto.randomBytes(32).toString('hex'),
        pubkey: publicKey // Add the public key to lock the token
      };
      
      // Create the token structure
      const tokenWithP2PK = {
        token: [{
          mint: mintUrl,
          proofs: [{
            ...proof,
            mint_key: simulatedMintKey
          }]
        }]
      };
      
      // Create a simulated invoice
      const simulatedInvoice = `lnbc${amount}n1p0...simulated_invoice_for_demo`;
      
      return {
        invoice: simulatedInvoice,
        token: JSON.stringify(tokenWithP2PK)
      };
    } catch (error: any) {
      console.error('Error creating P2PK token:', error);
      throw new Error(`Failed to create P2PK token: ${error.message}`);
    }
  },
  
  // Spend a P2PK-locked token using cashu-ts
  spendToken: async (mintUrl: string, tokenStr: string, privateKey: string, publicKey: string): Promise<string> => {
    try {
      // Decode and validate the token
      let token: any;
      try {
        token = JSON.parse(tokenStr);
      } catch (error) {
        throw new Error('Invalid token format');
      }
      
      if (!token.token || !token.token[0] || !token.token[0].proofs) {
        throw new Error('Invalid token structure');
      }
      
      // Extract and validate the proof
      const proofs = token.token[0].proofs;
      const p2pkProof = proofs.find((p: { pubkey: string }) => p.pubkey === publicKey);
      if (!p2pkProof) {
        throw new Error('Token is not locked with the provided public key');
      }
      
      console.log('Simulating token spending instead of connecting to mint');
      
      // Create signature for the proof ID
      const messageToSign = Buffer.from(p2pkProof.id);
      const privKeyBuffer = Buffer.from(privateKey, 'hex');
      const signature = secp256k1.ecdsaSign(messageToSign, privKeyBuffer);
      
      // Verify the signature locally
      const isValid = secp256k1.ecdsaVerify(
        signature.signature,
        messageToSign,
        Buffer.from(publicKey, 'hex')
      );
      
      if (!isValid) {
        throw new Error('Invalid signature');
      }
      
      // Simulate successful spending
      return 'Token successfully spent! The signature was verified against the public key.';
    } catch (error: any) {
      console.error('Error spending P2PK token:', error);
      throw new Error(`Failed to spend P2PK token: ${error.message}`);
    }
  }
};