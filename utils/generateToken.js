/**
 * Generates a unique token number for the system.
 * Format: TOKEN-{timestamp}-{random4DigitNumber}
 * 
 * @returns {string} Unique token number
 */
export default function generateToken() {
    const timestamp = Date.now(); // Current timestamp
    const random4Digits = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `TOKEN-${timestamp}-${random4Digits}`;
  }