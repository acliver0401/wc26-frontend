import type { Prediction } from '../types'

interface Props {
  match: Prediction
  onClose: () => void
}

const POS_COLORS: Record<string, string> = {
  GK: '#e8c547',
  CB: '#4a90d9',
  RB: '#5ba0e8',
  LB: '#5ba0e8',
  DM: '#e05738',
  CM: '#e5734a',
  AM: '#f0835c',
  RW: '#43a047',
  LW: '#43a047',
  ST: '#c62828',
  SS: '#d32f2f',
}

function PosBadge({ pos }: { pos: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: POS_COLORS[pos] || '#666',
        color: '#fff',
        fontSize: 9,
        fontWeight: 700,
        padding: '1px 4px',
        borderRadius: 3,
        minWidth: 22,
        textAlign: 'center',
        marginRight: 5,
      }}
    >
      {pos}
    </span>
  )
}

export function LineupDrawer({ match, onClose }: Props) {
  if (!match || match.prediction_status !== 'Live-Lineup' || !match.lineup_info) return null

  const { home, away } = match.lineup_info

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '24px 28px',
          maxWidth: 720,
          width: '90vw',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{match.home}</span>
            <span style={{ margin: '0 8px', color: 'var(--text3)' }}>vs</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{match.away}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                background: 'rgba(67,160,71,0.18)',
                color: '#43a047',
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 10,
                border: '1px solid rgba(67,160,71,0.4)',
              }}
            >
              🔒 首发已锁定
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text3)',
                cursor: 'pointer',
                fontSize: 20,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Formation comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, marginBottom: 16 }}>
          {/* Home formation */}
          <div
            style={{
              background: 'var(--cd-bg)',
              borderRadius: 8,
              padding: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{match.home}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--home)', marginBottom: 2 }}>
              {home.formation}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              {match.home_formation_label || ''}
            </div>
          </div>

          {/* VS */}
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text3)' }}>
            VS
          </div>

          {/* Away formation */}
          <div
            style={{
              background: 'var(--cd-bg)',
              borderRadius: 8,
              padding: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{match.away}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--away)', marginBottom: 2 }}>
              {away.formation}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              {match.away_formation_label || ''}
            </div>
          </div>
        </div>

        {/* Insight */}
        {home.insight && (
          <div
            style={{
              background: 'rgba(255,193,7,0.08)',
              border: '1px solid rgba(255,193,7,0.25)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 12,
              lineHeight: 1.6,
              color: 'var(--text2)',
              marginBottom: 16,
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>📋 临场分析：</span>
            {home.insight}
          </div>
        )}

        {/* Starting XI side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {/* Home XI */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: 'var(--home)' }}>
              {match.home} 首发11人
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {home.players.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    padding: '2px 4px',
                    borderRadius: 3,
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <PosBadge pos={p.pos} />
                    <span style={{ color: 'var(--text1)' }}>{p.name}</span>
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: p.rating >= 85 ? '#ffd54f' : p.rating >= 82 ? '#a5d6a7' : 'var(--text3)',
                    }}
                  >
                    {p.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Away XI */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 6, color: 'var(--away)' }}>
              {match.away} 首发11人
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {away.players.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    padding: '2px 4px',
                    borderRadius: 3,
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <PosBadge pos={p.pos} />
                    <span style={{ color: 'var(--text1)' }}>{p.name}</span>
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: p.rating >= 85 ? '#ffd54f' : p.rating >= 82 ? '#a5d6a7' : 'var(--text3)',
                    }}
                  >
                    {p.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Probability impact note */}
        <div
          style={{
            marginTop: 16,
            padding: '8px 12px',
            background: 'rgba(99,179,237,0.08)',
            borderRadius: 6,
            fontSize: 11,
            color: 'var(--text3)',
            textAlign: 'center',
          }}
        >
          以上首发数据基于 FIFA 官方公布 &middot; 模型已实时修正泊松预期进球参数
          <br />
          主胜概率 {match.ph}% / 平局 {match.pd}% / 客胜 {match.pa}% &middot; 置信度 {match.conf}%
        </div>
      </div>
    </div>
  )
}
