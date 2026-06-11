import type { Prediction } from '../types'

export function EnvironmentalBadges({ match }: { match: Prediction }) {
  const badges: { label: string; className: string }[] = []

  // Elevation
  if (match.elevation_m >= 1500) {
    badges.push({ label: `⛰️ ${match.elevation_m}m`, className: 'danger' })
  } else if (match.elevation_m >= 500) {
    badges.push({ label: `⛰️ ${match.elevation_m}m`, className: 'warn' })
  }

  // Temperature (live when weather_source === 'live')
  const tempLabel = match.weather_source === 'live' ? `🌡️ ${match.temp_c}°C` : `🌡️ ${match.temp_c}°C`
  if (match.temp_c >= 32) {
    badges.push({ label: tempLabel, className: 'danger' })
  } else if (match.temp_c >= 28) {
    badges.push({ label: tempLabel, className: 'warn' })
  } else if (match.temp_c <= 18) {
    badges.push({ label: `❄️ ${match.temp_c}°C`, className: '' })
  }

  // Humidity
  if (match.humidity_pct >= 75) {
    badges.push({ label: `💧 ${match.humidity_pct}%`, className: 'warn' })
  } else if (match.humidity_pct >= 65) {
    badges.push({ label: `💧 ${match.humidity_pct}%`, className: '' })
  }

  // Precipitation
  if ((match.precip_prob_pct ?? 0) >= 50) {
    badges.push({ label: `🌧️ ${match.precip_prob_pct}%`, className: 'warn' })
  }

  // Grass
  if (match.grass_warning) {
    badges.push({ label: `🌱 ${match.grass_label}`, className: 'warn' })
  }

  // Flight fatigue
  if ((match.away_fatigue_pct ?? 0) >= 75) {
    badges.push({ label: `✈️ 客队${match.away_fatigue_pct}%`, className: 'danger' })
  } else if ((match.away_fatigue_pct ?? 0) >= 50) {
    badges.push({ label: `✈️ 客队${match.away_fatigue_pct}%`, className: 'warn' })
  }

  // Injuries
  if ((match.home_injuries ?? 0) >= 2) {
    badges.push({ label: `🚑 ${match.home}缺${match.home_injuries}人`, className: 'danger' })
  }
  if ((match.away_injuries ?? 0) >= 2) {
    badges.push({ label: `🚑 ${match.away}缺${match.away_injuries}人`, className: 'danger' })
  }

  // Live weather indicator
  if (match.weather_source === 'live') {
    badges.push({ label: '📡 实时天气', className: '' })
  }

  if (badges.length === 0) return null

  return (
    <div className="env-badges">
      {badges.map((b, i) => (
        <span key={i} className={`env-badge ${b.className}`}>
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
    <div className="env-warnings">
      {warnings.map((w, i) => (
        <span key={i} className="warn-line">
          ⚠️ {w}
        </span>
      ))}
    </div>
  )
}
