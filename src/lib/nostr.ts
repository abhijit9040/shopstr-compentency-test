import { generateSecretKey, getPublicKey, nip04, SimplePool, finalizeEvent, Event as NostrEvent, nip19 } from 'nostr-tools';
import { hexToBytes, bytesToHex } from '@noble/hashes/utils';
import 'websocket-polyfill';

// List of relays to use
const RELAYS = [
  'wss://relay.damus.io',
  'wss://nostr.bitcoiner.social',
  'wss://nostr.fmt.wiz.biz'
];

// Create a pool for relay connections
const pool = new SimplePool();

/**
 * Publishes a gift-wrapped Nostr event (NIP-17)
 */
export const publishGiftWrappedEvent = async (
  privateKey: string,
  recipientPubkey: string,
  content: string
) => {
  try {
    // Convert hex strings to Uint8Array for nostr-tools
    const privKeyBytes = hexToBytes(privateKey);
    
    // Handle recipient pubkey format (hex or npub)
    let recipientHexPubkey = recipientPubkey;
    if (recipientPubkey.startsWith('npub1')) {
      try {
        console.log('Decoding npub:', recipientPubkey);
        console.log('npub length:', recipientPubkey.length);
        
        // Validate npub format before decoding
        if (recipientPubkey.length < 6 || !/^npub1[0-9a-zA-Z]{58,}$/.test(recipientPubkey)) {
          console.error('Invalid npub format:', {
            length: recipientPubkey.length,
            format: recipientPubkey,
            expected: 'npub1 followed by 58+ alphanumeric characters'
          });
          throw new Error('Invalid npub format: incorrect length or characters');
        }

        const decoded = nip19.decode(recipientPubkey);
        if (decoded.type === 'npub') {
          recipientHexPubkey = decoded.data;
        } else {
          console.error('Invalid npub format: not a valid npub key');
          throw new Error('Invalid npub format: not a valid npub key');
        }
      } catch (e) {
        console.error('Error decoding npub:', e);
        throw new Error('Invalid npub format: failed to decode npub key');
      }
    } else if (!/^[0-9a-fA-F]{64}$/.test(recipientPubkey)) {
      console.error('Invalid hex pubkey format:', recipientPubkey);
      throw new Error('Invalid pubkey format: must be 64-character hex string or npub1...');
    }
    
    const pubKeyBytes = hexToBytes(recipientHexPubkey);
    
    // Encrypt the message content for the recipient
    const encryptedContent = await nip04.encrypt(
      bytesToHex(privKeyBytes),
      recipientHexPubkey,
      content
    );
    
    // Create the gift-wrapped event (NIP-17)
    const unsignedEvent: Omit<NostrEvent, 'id' | 'sig'> = {
      kind: 17,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', recipientHexPubkey]],
      content: encryptedContent,
      pubkey: getPublicKey(privKeyBytes),
    };
    
    // Sign the event
    const signedEvent = finalizeEvent(unsignedEvent, privKeyBytes);
    
    // Publish to relays
    await Promise.all(RELAYS.map(relay => pool.publish([relay], signedEvent)));
    
    return signedEvent.id;
  } catch (error) {
    console.error('Error in publishGiftWrappedEvent:', error);
    throw new Error('Failed to create gift-wrapped event');
  }
};

/**
 * Subscribes to gift-wrapped events addressed to the user
 */
export function subscribeToGiftWrappedEvents(
  publicKey: string,
  onEvent: (event: NostrEvent) => void
): () => void {
  // Subscribe to gift-wrapped events addressed to us
  const sub = pool.subscribeMany(
    RELAYS,
    [{
      kinds: [1059, 17], // Support both NIP-17 and custom gift-wrapped event kinds
      '#p': [publicKey],
      limit: 50 // Limit the number of events to prevent overwhelming
    }],
    {
      onevent: (event) => {
        try {
          // Validate event before passing to handler
          if (!event.content || !event.pubkey) {
            console.warn('Received invalid gift-wrapped event:', event);
            return;
          }
          onEvent(event);
        } catch (error) {
          console.error('Error processing gift-wrapped event:', error);
        }
      }
    }
  );
  
  // Return unsubscribe function
  return () => {
    sub.close();
  };
}