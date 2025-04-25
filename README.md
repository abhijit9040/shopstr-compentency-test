# Shopstr Competency Test

This project demonstrates key technologies used in the Shopstr platform, including Nostr messaging, P2PK-locked Cashu tokens, and HODL invoices for Lightning-based escrow.

## Project Overview

This application showcases three main features:

1. **Nostr Gift-Wrapped Messages (NIP-17)** - Demonstrates encrypted direct messaging using the Nostr protocol
2. **P2PK-locked Cashu Tokens** - Shows how to create and spend tokens locked to a specific public key
3. **HODL Invoices** - Demonstrates Lightning Network-based escrow functionality

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd shopstr-competency-test
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Features

### 1. Nostr Gift-Wrapped Messages

This feature demonstrates how to:
- Generate or import Nostr keys
- Send encrypted direct messages to other Nostr users
- View and decrypt received messages

The implementation follows [NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md) for gift-wrapped (encrypted) direct messages.

### 2. P2PK-locked Cashu Tokens

This section demonstrates:
- Generating key pairs for P2PK locking
- Creating tokens locked to a specific public key
- Spending tokens by proving ownership of the private key

Two implementations are provided:
- A custom implementation in the Cashu Demo
- An implementation using the `cashu-ts` library in the Cashu-TS Demo

### 3. HODL Invoices

This feature shows how to:
- Create HODL invoices for Lightning-based escrow
- Manage the lifecycle of a HODL invoice
- Settle or cancel the invoice based on conditions

## Stretch Goals

Here are some potential enhancements for the project:

1. **Nostr Improvements**:
   - Add support for NIP-05 verification
   - Implement message threading
   - Add relay management UI
   - Support for NIP-57 zaps

2. **Cashu Enhancements**:
   - Implement multi-signature P2PK tokens
   - Add token history tracking
   - Create a visual token representation
   - Implement token splitting and merging

3. **HODL Invoice Extensions**:
   - Add timelock functionality
   - Implement multi-party escrow
   - Create a visual escrow status dashboard
   - Add webhook notifications for state changes

4. **General Improvements**:
   - Add comprehensive test suite
   - Implement persistent storage
   - Create a mobile-responsive design
   - Add user authentication

## Resources Used

### Libraries and Frameworks

- [Next.js](https://nextjs.org/) - React framework for the application
- [React](https://reactjs.org/) - UI library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools) - Tools for working with the Nostr protocol
- [@cashu/cashu-ts](https://github.com/cashubtc/cashu-ts) - TypeScript implementation of the Cashu protocol
- [secp256k1](https://github.com/cryptocoinjs/secp256k1-node) - Elliptic curve cryptography library

### Specifications

- [Nostr NIPs](https://github.com/nostr-protocol/nips) - Nostr Implementation Possibilities
- [Cashu Protocol](https://github.com/cashubtc/cashu) - Cashu ecash protocol
- [BOLT 11](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md) - Lightning Network payment encoding

## License

[MIT](LICENSE)

---

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
