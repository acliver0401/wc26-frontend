import type { Prediction } from '../types'
import { PredictionCard } from './PredictionCard'

export function HighConfidenceGrid({ predictions }: { predictions: Prediction[] }) {
  return (
    <div className="cd">
      <div className="cd-h">
        <span className="cd-h-dot" />
        <h2>高置信度预测</h2>
        <span className="cd-h-b">{predictions.length} MATCHES</span>
      </div>
      {predictions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 30, color: 'var(--text3)', fontSize: 13 }}>
          暂无预测数据，请先运行主流程
        </div>
      ) : (
        <div className="pg">
          {predictions.map((p, i) => (
            <PredictionCard key={`${p.date}-${p.home}-${p.away}-${i}`} p={p} />
          ))}
        </div>
      )}
    </div>
  )
}
