import type { TeamAnalysis } from '../types'

export function TeamAnalysisGrid({ teams }: { teams: TeamAnalysis[] }) {
  if (teams.length === 0) {
    return (
      <div className="cd">
        <div className="cd-h">
          <span className="cd-h-dot" />
          <h2>球队综合分析</h2>
          <span className="cd-h-b">媒体情感 + 社交热度</span>
        </div>
        <div style={{ textAlign: 'center', padding: 30, color: 'var(--text3)', fontSize: 13 }}>
          暂无分析数据
        </div>
      </div>
    )
  }

  return (
    <div className="cd">
      <div className="cd-h">
        <span className="cd-h-dot" />
        <h2>球队综合分析</h2>
        <span className="cd-h-b">媒体情感 + 社交热度</span>
      </div>
      <div className="ag">
        {teams.map((t) => (
          <div key={t.team} className="ac">
            <div className="ac-n">{t.team}</div>
            <div className="ac-v">媒体情感: {(t.sentiment * 100).toFixed(0)}%</div>
            <div className="bc">
              <div
                className="b"
                style={{
                  width: `${t.sentiment * 100}%`,
                  background: t.sentiment > 0.5 ? '#22c55e' : '#ef4444',
                }}
              />
            </div>
            <div className="ac-v">社交热度: {(t.heat * 100).toFixed(0)}%</div>
            <div className="bc">
              <div
                className="b"
                style={{
                  width: `${t.heat * 100}%`,
                  background: 'linear-gradient(90deg, #f97316, #f59e0b)',
                }}
              />
            </div>
            <div className="ac-v" style={{ color: 'var(--text2)', fontWeight: 500, marginTop: 2 }}>
              综合评分: {t.score.toFixed(0)}/100
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
