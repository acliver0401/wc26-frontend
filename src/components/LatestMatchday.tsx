import type { Prediction } from '../types'
import { EnvironmentalBadges, EnvironmentalWarnings } from './EnvironmentalBadges'

export function LatestMatchday({ match }: { match: Prediction }) {
  if (!match) return null
  const pc = match.pred_r === 'H' ? 'var(--home)' : match.pred_r === 'D' ? 'var(--draw)' : 'var(--away)'
  const isLive = match.prediction_status === 'Live-Lineup'

  return (
    <div className="cd cd-md" style={isLive ? { borderLeft: '3px solid #43a047' } : undefined}>
      <div className="cd-h">
        <span className="cd-h-dot" />
        <h2>最新比赛日 · {match.date}</h2>
        <span className="cd-h-b">
          MATCHDAY
          {isLive && (
            <span style={{ marginLeft: 8, color: '#43a047', fontSize: 9, fontWeight: 600 }}>
              🔒 首发已锁定
            </span>
          )}
        </span>
      </div>
      <div className="tw">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th>主队</th>
              <th>客队</th>
              <th>预测</th>
              <th>概率</th>
              <th>比分概率</th>
              <th>赛况推演</th>
              <th>环境因素</th>
              <th>推荐理由</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{match.date}</td>
              <td style={{ fontWeight: 600 }}>{match.home}</td>
              <td style={{ fontWeight: 600 }}>{match.away}</td>
              <td style={{ color: pc, fontWeight: 600 }}>{match.pred}</td>
              <td>{match.conf}%</td>
              <td style={{ fontSize: 10 }}>
                {match.score_probs && Object.entries(match.score_probs).slice(0, 4).map(([s, p]) => (
                  <span key={s} style={{ display: 'inline-block', marginRight: 6, whiteSpace: 'nowrap' }}>
                    {s}: <span style={{ color: 'var(--accent)' }}>{(p * 100).toFixed(1)}%</span>
                  </span>
                ))}
              </td>
              <td style={{ fontSize: 10, color: 'var(--text2)', maxWidth: 260, lineHeight: 1.6 }}>
                {match.simulation}
              </td>
              <td style={{ fontSize: 10 }}>
                <EnvironmentalBadges match={match} />
              </td>
              <td style={{ fontSize: 11, color: 'var(--text3)', maxWidth: 220 }}>
                {match.reason}
                <EnvironmentalWarnings warnings={match.warnings} />
              </td>
              <td style={{ fontSize: 11, whiteSpace: 'nowrap', color: 'var(--text3)' }}>
                {match.bet_advice}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
