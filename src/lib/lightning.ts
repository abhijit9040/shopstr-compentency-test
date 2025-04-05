export async function createHodlInvoice(amount: number, memo: string, expirySeconds: number) {
  // Mock implementation
  return {
    paymentRequest: `lnbc${amount}1p${memo}${expirySeconds}${Math.random().toString(36).substring(2)}`,
    paymentHash: Math.random().toString(36).substring(2),
    preimage: Math.random().toString(36).substring(2)
  };
}

export async function settleHodlInvoice(preimage: string) {
  // Mock implementation
  return `Invoice settled successfully with preimage: ${preimage.slice(0, 8)}...`;
}

export async function cancelHodlInvoice(paymentHash: string) {
  // Mock implementation
  return `Invoice canceled successfully for hash: ${paymentHash.slice(0, 8)}...`;
}