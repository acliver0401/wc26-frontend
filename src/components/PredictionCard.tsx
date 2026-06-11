import type { Prediction } from '../types'
import { EnvironmentalBadges } from './EnvironmentalBadges'

export function PredictionCard({ p }: { p: Prediction }) {
  const c = p.pred_r === 'H' ? 'var(--home)' : p.pred_r === 'D' ? 'var(--draw)' : 'var(--away)'
  const conf = p.conf
  const confColor = conf >= 50 ? 'var(--green)' : conf >= 40 ? 'var(--draw)' : 'var(--text3)'

  return (
    <div className="pc">
      <span className="pc-d">{p.date}</span>
      <div className="pc-t">
        {p.home}
        <span style={{ color: 'var(--text3)' }}> vs </span>
        {p.away}
      </div>
      <EnvironmentalBadges match={p} />
      <div className="pc-pr" style={{ color: c }}>
        {p.pred} <span>{p.conf}% 置信度</span>
      </div>
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
      <div className="pc-cb">
        <div className="f" style={{ width: `${conf}%`, background: confColor }} />
      </div>
    </div>
  )
}
