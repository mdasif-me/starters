/**
 * Format a date in a localized format
 * @param date - The date to format
 * @param locale - The locale for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(
    dateObj
  );
}

/**
 * Format a date as a short date string (MM/DD/YYYY)
 * @param date - The date to format
 * @param locale - The locale for formatting (default: 'en-US')
 */
export function formatShortDate(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

/**
 * Format a date with time
 * @param date - The date to format
 * @param locale - The locale for formatting (default: 'en-US')
 */
export function formatDateTime(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format a relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - The date to format
 * @param locale - The locale for formatting (default: 'en-US')
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ] as const;

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(diffInSeconds > 0 ? -count : count, interval.label);
    }
  }

  return rtf.format(0, 'second');
}
