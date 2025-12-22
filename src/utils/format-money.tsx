type MoneyMode = 'short' | 'full'

export function formatMoney(amount: number, mode: MoneyMode = 'short'): string {
  if (!Number.isFinite(amount)) return '৳0.00'

  if (mode === 'short') {
    if (amount >= 1e7) {
      return `৳${(amount / 1e7).toFixed(2)} Crore`
    }

    if (amount >= 1e5) {
      return `৳${(amount / 1e5).toFixed(2)} Lakh`
    }

    return `৳${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // full money
  return `৳${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
