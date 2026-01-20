import { Link } from '@tanstack/react-router'

export const formatValue = (key: string, value: unknown): React.ReactNode => {
  if (!value) return '—'

  if (key === 'date_of_incorporation') {
    return new Date(value as string).toLocaleDateString()
  }

  if (key === 'website') {
    return (
      <Link
        to={value as string}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline"
      >
        {String(value)}
      </Link>
    )
  }

  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}
