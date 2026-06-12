interface StatsBarProps {
  accuracy: number
  trainingSamples: number
  pendingPredictions: number
  liveLineupCount?: number
}

export function StatsBar({ accuracy, trainingSamples, pendingPredictions, liveLineupCount }: StatsBarProps) {
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
        <div className="st-v" style={{ fontSize: 22, color: liveLineupCount ? 'var(--green)' : 'var(--accent)' }}>
          {liveLineupCount && liveLineupCount > 0 ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
                display: 'inline-block', animation: 'pulse 2s infinite',
              }} />
              {liveLineupCount} 场已锁定
            </span>
          ) : (
            dateStr
          )}
        </div>
        <div className="st-l">{liveLineupCount && liveLineupCount > 0 ? '首发阵容' : '开幕日'}</div>
      </div>
    </div>
  )
}
