/**
 * Generates an auto-filled ID with prefix-date-time format
 * Format: PREFIX-YYYYMMDD-HHMMSS-MMM
 * Where MMM is milliseconds for uniqueness
 *
 * @param prefix - The prefix for the ID (e.g., 'ORD', 'KIT', 'SUP', 'ING', 'DISH')
 * @returns Generated ID string
 *
 * @example
 * generateId('KIT') // Returns: KIT-20231129-143022-456
 * generateId('ORD') // Returns: ORD-20231129-143022-789
 */
export function generateId(prefix: string): string {
  const now = new Date();

  // Format date as YYYYMMDD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;

  // Format time as HHMMSS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timePart = `${hours}${minutes}${seconds}`;

  // Add milliseconds for uniqueness (3 digits)
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  return `${prefix}-${datePart}-${timePart}-${milliseconds}`;
}

/**
 * Generates an auto-filled ID with prefix and date-time format
 * Format: PREFIX-YYYYMMDD-HHMMSS-MMM
 * Same as generateId, but kept for backward compatibility
 *
 * @param prefix - The prefix for the ID (e.g., 'IM', 'EX', 'ADJ', 'REQ')
 * @returns Generated ID string
 *
 * @example
 * generateDateId('IM') // Returns: IM-20231129-143022-456
 */
export function generateDateId(prefix: string): string {
  return generateId(prefix);
}
