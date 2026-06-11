interface HeaderProps {
  generatedAt: string
  totalTeams: number
  totalMatches: number
  cacheInfo?: {
    predictions_updated_at?: string | null
    weather_updated_at?: string | null
    injuries_updated_at?: string | null
  }
}

export function Header({ generatedAt, totalTeams, totalMatches, cacheInfo }: HeaderProps) {
  const formatTs = (ts?: string | null) => {
    if (!ts) return null
    return ts.replace('T', ' ').slice(0, 16)
  }
  const predUpdated = formatTs(cacheInfo?.predictions_updated_at)
  const weatherUpdated = formatTs(cacheInfo?.weather_updated_at)

  return (
    <header className="hd">
      <div className="hd-l">
        <div className="hd-icon">⚽</div>
        <div className="hd-t">世界杯2026预测系统</div>
      </div>
      <div className="hd-r">
        <strong>{generatedAt.replace('T', ' ').slice(0, 16)}</strong>
        <br />
        {totalTeams}支球队 · {totalMatches}场比赛 · FIFA排名+ML模型
        {weatherUpdated && (
          <>
            <br />
            <span style={{ color: 'var(--green)', fontSize: 10 }}>
              📡 天气更新: {weatherUpdated}
            </span>
          </>
        )}
        {predUpdated && (
          <>
            <br />
            <span style={{ color: 'var(--text3)', fontSize: 10 }}>
              预测刷新: {predUpdated}
            </span>
          </>
        )}
      </div>
    </header>
  )
}
