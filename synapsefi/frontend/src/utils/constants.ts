export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const isHexAddress = (value: string): boolean => {
  return !!value && /^0x[a-fA-F0-9]{40}$/.test(value)
}

export const isZeroAddress = (address: string): boolean => {
  return isHexAddress(address) && address.toLowerCase() === ZERO_ADDRESS.toLowerCase()
}

export const addressEquals = (a?: string, b?: string): boolean => {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase()
}

const envAddress = (
  key: 'VITE_CREDIT_PASSPORT_ADDRESS' | 'VITE_SYNAPSE_TOKEN_ADDRESS'
): string => {
  const value = import.meta.env[key] as string | undefined
  return value && isHexAddress(value) ? value : ZERO_ADDRESS
}

export const CONTRACT_ADDRESSES = {
  CREDIT_PASSPORT: envAddress('VITE_CREDIT_PASSPORT_ADDRESS'),
  SYNAPSE_TOKEN: envAddress('VITE_SYNAPSE_TOKEN_ADDRESS'),
} as const

export const clampScore = (score: number): number => {
  const s = Number.isFinite(score) ? score : 0
  return Math.max(0, Math.min(850, Math.round(s)))
}

export const getScoreTier = (score: number): {
  tier: string
  color: string
  risk: 'Low' | 'Medium' | 'High'
} => {
  const s = clampScore(score)
  if (s >= 800) {
    return { tier: 'Excellent', color: '#10B981', risk: 'Low' }
  } else if (s >= 700) {
    return { tier: 'Good', color: '#3B82F6', risk: 'Low' }
  } else if (s >= 600) {
    return { tier: 'Fair', color: '#F59E0B', risk: 'Medium' }
  } else if (s >= 500) {
    return { tier: 'Poor', color: '#EF4444', risk: 'High' }
  } else {
    return { tier: 'Very Poor', color: '#DC2626', risk: 'High' }
  }
}

export const scoreToProgress = (score: number): number => {
  return Math.round((clampScore(score) / 850) * 100)
}

export const formatAddress = (address: string, leading = 6, trailing = 4): string => {
  if (!isHexAddress(address)) return ''
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`
}

export const formatNumber = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  const n = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...options,
  }).format(n)
}

export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string => {
  const n = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    ...options,
  }).format(n)
}

export const toPercent = (ratio: number, fractionDigits = 0): string => {
  const r = Number.isFinite(ratio) ? ratio : 0
  const clamped = Math.max(0, Math.min(1, r))
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
  }).format(clamped)
}

export const formatTimestamp = (timestamp: number): string => {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return ''
  const date = new Date(timestamp * 1000)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export const relativeTimeFromSeconds = (timestamp: number): string => {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return ''
  const ms = timestamp * 1000
  const diff = Date.now() - ms
  const ahead = diff < 0
  const abs = Math.abs(diff)
  const minutes = Math.floor(abs / 60000)
  const hours = Math.floor(abs / 3600000)
  const days = Math.floor(abs / 86400000)
  const suffix = ahead ? '' : ' ago'
  if (days) return `${ahead ? 'in ' : ''}${days} day${days > 1 ? 's' : ''}${suffix}`
  if (hours) return `${ahead ? 'in ' : ''}${hours} hour${hours > 1 ? 's' : ''}${suffix}`
  return `${ahead ? 'in ' : ''}${minutes} min${minutes > 1 ? 's' : ''}${suffix}`
}

export const ensureDefined = <T>(value: T | undefined | null, fallback: T): T => {
  return value ?? fallback
}