import { useState } from 'react'
import type { Prediction } from '../types'
import { EnvironmentalBadges, EnvironmentalWarnings } from './EnvironmentalBadges'
import { LineupDrawer } from './LineupDrawer'

const LIVE_LINEUP_GLOW = '0 0 8px rgba(67,160,71,0.4), inset 0 0 4px rgba(67,160,71,0.12)'

export function AllPredictionsTable({ predictions }: { predictions: Prediction[] }) {
  const [selectedMatch, setSelectedMatch] = useState<Prediction | null>(null)

  if (predictions.length === 0) {
    return (
      <div className="cd">
        <div className="cd-h">
          <span className="cd-h-dot" />
          <h2>全部预测详情</h2>
        </div>
        <div style={{ textAlign: 'center', padding: 30, color: 'var(--text3)', fontSize: 13 }}>
          暂无预测数据
        </div>
      </div>
    )
  }

  const liveCount = predictions.filter((p) => p.prediction_status === 'Live-Lineup').length

  return (
    <>
      <div className="cd">
        <div className="cd-h">
          <span className="cd-h-dot" />
          <h2>全部预测详情</h2>
          <span className="cd-h-b">
            {predictions.length} MATCHES
            {liveCount > 0 && (
              <span style={{ marginLeft: 8, color: '#43a047', fontSize: 9, fontWeight: 600 }}>
                🔒 {liveCount} LIVE-LINEUP
              </span>
            )}
          </span>
        </div>
        <div className="tw" style={{ maxHeight: 520, overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>日期</th>
                <th>主队</th>
                <th>客队</th>
                <th>球场</th>
                <th>状态</th>
                <th>环境</th>
                <th>阵型</th>
                <th>预测</th>
                <th>主胜</th>
                <th>平局</th>
                <th>客胜</th>
                <th>置信度</th>
                <th>比分概率</th>
                <th>赛况推演</th>
                <th>警示</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((r, i) => {
                const pc = r.pred_r === 'H' ? 'var(--home)' : r.pred_r === 'D' ? 'var(--draw)' : 'var(--away)'
                const isLive = r.prediction_status === 'Live-Lineup'

                return (
                  <tr
                    key={i}
                    onClick={() => isLive && setSelectedMatch(r)}
                    style={{
                      cursor: isLive ? 'pointer' : 'default',
                      transition: 'box-shadow 1.5s ease-in-out',
                      boxShadow: isLive ? LIVE_LINEUP_GLOW : undefined,
                      borderLeft: isLive ? '3px solid #43a047' : undefined,
                      background: isLive ? 'rgba(67,160,71,0.04)' : undefined,
                    }}
                    title={isLive ? '点击查看首发阵容与阵型对比' : '首发尚未公布'}
                  >
                    <td>{r.date}</td>
                    <td>{r.home}</td>
                    <td>{r.away}</td>
                    <td style={{ fontSize: 10, color: 'var(--text3)' }}>{r.stadium_city}</td>
                    <td style={{ fontSize: 10 }}>
                      {isLive ? (
                        <span
                          style={{
                            background: 'rgba(67,160,71,0.15)',
                            color: '#43a047',
                            padding: '2px 6px',
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 9,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          🔒 首发已锁定
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text3)', fontSize: 9 }}>Pre-Match</span>
                      )}
                    </td>
                    <td style={{ fontSize: 10 }}>
                      <EnvironmentalBadges match={r} />
                    </td>
                    <td style={{ fontSize: 10, color: 'var(--text2)' }}>
                      {r.home_formation && r.away_formation ? (
                        <span>
                          <span style={{ color: 'var(--home)' }}>{r.home_formation}</span>
                          <span style={{ margin: '0 3px', color: 'var(--text3)' }}>vs</span>
                          <span style={{ color: 'var(--away)' }}>{r.away_formation}</span>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text3)', fontSize: 9 }}>--</span>
                      )}
                    </td>
                    <td style={{ color: pc, fontWeight: 600 }}>{r.pred}</td>
                    <td>{r.ph}%</td>
                    <td>{r.pd}%</td>
                    <td>{r.pa}%</td>
                    <td>{r.conf}%</td>
                    <td style={{ fontSize: 10 }}>
                      {r.score_probs && Object.entries(r.score_probs).slice(0, 3).map(([s, p]) => (
                        <span key={s} style={{ display: 'inline-block', marginRight: 5, whiteSpace: 'nowrap' }}>
                          {s}: <span style={{ color: 'var(--accent)' }}>{(p * 100).toFixed(1)}%</span>
                        </span>
                      ))}
                    </td>
                    <td style={{ fontSize: 10, color: 'var(--text2)', maxWidth: 220, lineHeight: 1.5 }}>
                      {r.simulation?.slice(0, 80)}{r.simulation?.length > 80 ? '...' : ''}
                    </td>
                    <td style={{ fontSize: 10, maxWidth: 160 }}>
                      <EnvironmentalWarnings warnings={r.warnings} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lineup Drawer overlay */}
      {selectedMatch && (
        <LineupDrawer match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </>
  )
}
