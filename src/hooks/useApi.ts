import { useState, useEffect } from 'react'
import type { DashboardData, OddsData } from '../types'

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

export function useApi() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [oddsData, setOddsData] = useState<OddsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/dashboard`).then((res) => {
        if (!res.ok) throw new Error(`Dashboard HTTP ${res.status}`)
        return res.json()
      }),
      fetch(`${API_BASE}/odds`).then((res) => {
        if (!res.ok) throw new Error(`Odds HTTP ${res.status}`)
        return res.json()
      }).catch(() => null),
    ])
      .then(([dashboardJson, oddsJson]) => {
        setData(dashboardJson)
        setOddsData(oddsJson)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, oddsData, loading, error }
}
