import type { Prediction } from '../types'

type Severity = 'normal' | 'warn' | 'danger'

interface BadgeItem {
  label: string
  severity: Severity
  icon: string
}

function severityClass(s: Severity): string {
  if (s === 'danger') return 'bg-red-500/15 text-red-400 border-red-500/25'
  if (s === 'warn') return 'bg-amber-500/12 text-amber-400 border-amber-500/25'
  return 'bg-slate-800 text-slate-300 border-slate-700'
}

export function EnvironmentalBadges({ match }: { match: Prediction }) {
  const items: BadgeItem[] = []

  // Elevation — warn at 1000m, danger at 2000m
  if (match.elevation_m >= 2000) {
    items.push({ label: `⛰️ ${match.elevation_m}m`, severity: 'danger', icon: '⛰️' })
  } else if (match.elevation_m >= 1000) {
    items.push({ label: `⛰️ ${match.elevation_m}m`, severity: 'warn', icon: '⛰️' })
  } else if (match.elevation_m >= 500) {
    items.push({ label: `⛰️ ${match.elevation_m}m`, severity: 'normal', icon: '⛰️' })
  }

  // Temperature — warn at 30°C, danger at 35°C, cold at ≤15°C
  if (match.temp_c >= 35) {
    items.push({ label: `🌡️ ${match.temp_c}°C`, severity: 'danger', icon: '🌡️' })
  } else if (match.temp_c >= 30) {
    items.push({ label: `🌡️ ${match.temp_c}°C`, severity: 'warn', icon: '🌡️' })
  } else if (match.temp_c <= 15) {
    items.push({ label: `❄️ ${match.temp_c}°C`, severity: 'normal', icon: '❄️' })
  } else {
    items.push({ label: `🌡️ ${match.temp_c}°C`, severity: 'normal', icon: '🌡️' })
  }

  // Humidity — warn at 70%, danger at 85%
  if (match.humidity_pct >= 85) {
    items.push({ label: `💧 ${match.humidity_pct}%`, severity: 'danger', icon: '💧' })
  } else if (match.humidity_pct >= 70) {
    items.push({ label: `💧 ${match.humidity_pct}%`, severity: 'warn', icon: '💧' })
  } else if (match.humidity_pct >= 55) {
    items.push({ label: `💧 ${match.humidity_pct}%`, severity: 'normal', icon: '💧' })
  }

  // Precipitation — warn at 50%
  const precip = match.precip_prob_pct ?? 0
  if (precip >= 50) {
    items.push({ label: `🌧️ ${precip}%`, severity: 'warn', icon: '🌧️' })
  } else if (precip >= 25) {
    items.push({ label: `🌧️ ${precip}%`, severity: 'normal', icon: '🌧️' })
  }

  // Grass — warn on artificial/temporary
  if (match.grass_warning) {
    items.push({ label: `🌱 人工草`, severity: 'warn', icon: '🌱' })
  }

  // Flight fatigue — warn at 50%, danger at 75%
  const awayFatigue = match.away_fatigue_pct ?? 0
  if (awayFatigue >= 75) {
    items.push({ label: `✈️ 客队${awayFatigue}%`, severity: 'danger', icon: '✈️' })
  } else if (awayFatigue >= 50) {
    items.push({ label: `✈️ 客队${awayFatigue}%`, severity: 'warn', icon: '✈️' })
  } else if (awayFatigue >= 30) {
    items.push({ label: `✈️ ${awayFatigue}%`, severity: 'normal', icon: '✈️' })
  }

  // Injuries — danger if 2+ core players out
  if ((match.home_injuries ?? 0) >= 2) {
    items.push({ label: `🚑 ${match.home}`, severity: 'danger', icon: '🚑' })
  }
  if ((match.away_injuries ?? 0) >= 2) {
    items.push({ label: `🚑 ${match.away}`, severity: 'danger', icon: '🚑' })
  }

  // Live weather indicator
  if (match.weather_source === 'live') {
    items.push({ label: '📡 实时', severity: 'normal', icon: '📡' })
  }

  if (items.length === 0) return null

  return (
    <div className="env-badge-grid">
      {items.map((b, i) => (
        <span key={i} className={`env-badge-chip ${severityClass(b.severity)}`}>
          {b.label}
        </span>
      ))}
    </div>
  )
}

export function EnvironmentalWarnings({ warnings }: { warnings: string[] }) {
  if (!warnings || warnings.length === 0) return null
  if (warnings.length === 1 && warnings[0].includes('环境条件中性')) return null

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {warnings.map((w, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-amber-300/90 leading-relaxed">
          <span className="mt-0.5 shrink-0">⚠️</span>
          <span>{w}</span>
        </div>
      ))}
    </div>
  )
}
