import { useState } from 'react'
import type { Prediction } from '../types'
import { EnvironmentalBadges } from './EnvironmentalBadges'
import { LineupDrawer } from './LineupDrawer'

export function PredictionCard({ p }: { p: Prediction }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const c = p.pred_r === 'H' ? 'var(--home)' : p.pred_r === 'D' ? 'var(--draw)' : 'var(--away)'
  const conf = p.conf
  const confColor = conf >= 50 ? 'var(--green)' : conf >= 40 ? 'var(--draw)' : 'var(--text3)'
  const isLive = p.prediction_status === 'Live-Lineup'
  const hasResult = p.result && p.result.status === 'FT'
  const isOngoing = p.result && (p.result.status === 'LIVE' || p.result.status === 'HT')

  return (
    <>
      <div className={`pc ${isLive ? 'pc-live' : ''} ${hasResult ? 'pc-result' : ''}`}>
        <span className="pc-d">
          {isOngoing ? (
            <span style={{ color: '#ef4444', fontWeight: 700 }}>LIVE</span>
          ) : hasResult ? 'FT' : p.date}
        </span>
        <div className="pc-t">
          {p.home}
          <span style={{ color: 'var(--text3)' }}> vs </span>
          {p.away}
        </div>

        {/* Score display for completed/ongoing matches */}
        {(hasResult || isOngoing) && p.result ? (
          <div style={{
            fontSize: 24, fontWeight: 800, fontFamily: 'monospace',
            color: isOngoing ? '#ef4444' : '#e2e8f0',
            textAlign: 'center', margin: '8px 0', letterSpacing: 3,
          }}>
            {p.result.home_score} - {p.result.away_score}
            {hasResult && p.result.outcome === p.pred_r && (
              <span style={{ fontSize: 10, color: '#22c55e', marginLeft: 8, fontWeight: 600 }}>
                ✓
              </span>
            )}
          </div>
        ) : (
          <>
            <EnvironmentalBadges match={p} />
            <div className="pc-pr" style={{ color: c }}>
              {p.pred} <span>{p.conf}% 置信度</span>
            </div>
          </>
        )}
        <div className="pc-prb">
          <div className="pc-prb-b">
            <div className="p" style={p.ph > 40 ? { color: 'var(--home)', fontWeight: 600 } : undefined}>
              {p.ph}%
            </div>
            <div className="l">主胜</div>
          </div>
          <div className="pc-prb-b">
            <div className="p" style={p.pd > 35 ? { color: 'var(--draw)', fontWeight: 600 } : undefined}>
              {p.pd}%
            </div>
            <div className="l">平局</div>
          </div>
          <div className="pc-prb-b">
            <div className="p" style={p.pa > 40 ? { color: 'var(--away)', fontWeight: 600 } : undefined}>
              {p.pa}%
            </div>
            <div className="l">客胜</div>
          </div>
        </div>
        {p.score_probs && (
          <div className="pc-sp">
            {Object.entries(p.score_probs).slice(0, 3).map(([s, prob]) => (
              <span key={s} className="pc-sp-i">
                {s} <em>{(prob * 100).toFixed(1)}%</em>
              </span>
            ))}
          </div>
        )}

        {/* Formation indicators when Live-Lineup */}
        {isLive && p.home_formation && p.away_formation && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
            fontSize: 10,
            color: 'var(--text3)',
          }}>
            <span style={{
              background: 'rgba(67,160,71,0.12)',
              color: '#43a047',
              padding: '1px 6px',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 9,
            }}>
              {p.home_formation}
            </span>
            <span>vs</span>
            <span style={{
              background: 'rgba(59,130,246,0.12)',
              color: '#3b82f6',
              padding: '1px 6px',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 9,
            }}>
              {p.away_formation}
            </span>
          </div>
        )}

        {/* View lineup button */}
        {isLive && p.lineup_info && (
          <button
            onClick={(e) => { e.stopPropagation(); setDrawerOpen(true) }}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 10,
              padding: '6px 0',
              background: 'rgba(67,160,71,0.12)',
              border: '1px solid rgba(67,160,71,0.3)',
              borderRadius: 6,
              color: '#43a047',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(67,160,71,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(67,160,71,0.12)'
            }}
          >
            查看首发阵容
          </button>
        )}

        <div className="pc-cb">
          <div className="f" style={{ width: `${conf}%`, background: confColor }} />
        </div>
      </div>

      {drawerOpen && (
        <LineupDrawer match={p} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  )
}
