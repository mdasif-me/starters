/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'BDT')
 * @param locale - The locale for formatting (default: 'en-US')
 */
export function formatCurrency(
  amount: number,
  currency: string = 'BDT',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a number as compact currency (e.g., ৳1.2K, ৳3.4M)
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'BDT')
 * @param locale - The locale for formatting (default: 'en-US')
 */
export function formatCompactCurrency(
  amount: number,
  currency: string = 'BDT',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(amount);
}

/**
 * Parse a currency string to a number
 * @param value - The currency string to parse
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
}
