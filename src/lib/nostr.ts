import { generateSecretKey, getPublicKey, nip04, SimplePool, finalizeEvent, Event as NostrEvent } from 'nostr-tools';
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
    const pubKeyBytes = hexToBytes(recipientPubkey);
    
    // Encrypt the message content for the recipient
    const encryptedContent = await nip04.encrypt(
      bytesToHex(privKeyBytes),
      bytesToHex(pubKeyBytes),
      content
    );
    
    // Create the gift-wrapped event (NIP-17)
    const unsignedEvent: Omit<NostrEvent, 'id' | 'sig'> = {
      kind: 17,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', recipientPubkey]],
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
      kinds: [1059],
      '#p': [publicKey],
    }],
    {
      onevent: onEvent
    }
  );
  
  // Return unsubscribe function
  return () => {
    sub.close();
  };
}