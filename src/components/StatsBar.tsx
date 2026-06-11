interface StatsBarProps {
  accuracy: number
  trainingSamples: number
  pendingPredictions: number
}

export function StatsBar({ accuracy, trainingSamples, pendingPredictions }: StatsBarProps) {
  const now = new Date()
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`

  return (
    <div className="st">
      <div className="st-c">
        <div className="st-v" style={{ color: 'var(--accent2)' }}>{accuracy.toFixed(1)}%</div>
        <div className="st-l">回测准确率</div>
      </div>
      <div className="st-c">
        <div className="st-v" style={{ color: 'var(--away)' }}>{trainingSamples}</div>
        <div className="st-l">历史训练场次</div>
      </div>
      <div className="st-c">
        <div className="st-v" style={{ color: 'var(--green)' }}>{pendingPredictions}</div>
        <div className="st-l">待预测比赛</div>
      </div>
      <div className="st-c">
        <div className="st-v" style={{ fontSize: 22, color: 'var(--accent)' }}>{dateStr}</div>
        <div className="st-l">开幕日</div>
      </div>
    </div>
  )
}
