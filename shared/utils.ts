/**
 * Utility functions for the application
 */

/**
 * Formats a number as a currency string
 * @param value The number to format
 * @param currency The currency code (default: 'USD')
 * @returns The formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Truncates a string to a specified length and adds an ellipsis if truncated
 * @param text The string to truncate
 * @param maxLength The maximum length of the string
 * @returns The truncated string
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}