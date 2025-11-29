/**
 * Generates an auto-filled ID with prefix-date-time format
 * Format: PREFIX-YYYYMMDD-HHMMSS-random
 *
 * @param prefix - The prefix for the ID (e.g., 'KIT', 'SUP', 'ING')
 * @returns Generated ID string
 *
 * @example
 * generateId('KIT') // Returns: KIT-20231129-143022-abc12
 * generateId('SUP') // Returns: SUP-20231129-143022-def34
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

  // Generate random suffix (5 characters)
  const randomPart = Math.random().toString(36).substring(2, 7);

  return `${prefix}-${datePart}-${timePart}-${randomPart}`;
}

/**
 * Generates an auto-filled ID with prefix and date only
 * Format: PREFIX-YYYYMMDD-random
 *
 * @param prefix - The prefix for the ID (e.g., 'IM', 'EX', 'ADJ')
 * @returns Generated ID string
 *
 * @example
 * generateDateId('IM') // Returns: IM-20231129-abc12
 */
export function generateDateId(prefix: string): string {
  const now = new Date();

  // Format date as YYYYMMDD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;

  // Generate random suffix (5 characters)
  const randomPart = Math.random().toString(36).substring(2, 7);

  return `${prefix}-${datePart}-${randomPart}`;
}
