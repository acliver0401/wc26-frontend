import type { Prediction } from '../types'
import { EnvironmentalBadges, EnvironmentalWarnings } from './EnvironmentalBadges'

export function AllPredictionsTable({ predictions }: { predictions: Prediction[] }) {
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

  return (
    <div className="cd">
      <div className="cd-h">
        <span className="cd-h-dot" />
        <h2>全部预测详情</h2>
        <span className="cd-h-b">{predictions.length} MATCHES</span>
      </div>
      <div className="tw" style={{ maxHeight: 480, overflowY: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>主队</th>
              <th>客队</th>
              <th>球场</th>
              <th>环境</th>
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
              return (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.home}</td>
                  <td>{r.away}</td>
                  <td style={{ fontSize: 10, color: 'var(--text3)' }}>{r.stadium_city}</td>
                  <td style={{ fontSize: 10 }}>
                    <EnvironmentalBadges match={r} />
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
  )
}
