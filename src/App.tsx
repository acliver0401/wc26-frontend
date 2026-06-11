import { useApi } from './hooks/useApi'
import { Header } from './components/Header'
import { StatsBar } from './components/StatsBar'
import { LatestMatchday } from './components/LatestMatchday'
import { HighConfidenceGrid } from './components/HighConfidenceGrid'
import { BacktestChart } from './components/BacktestChart'
import { MediaSentimentChart } from './components/MediaSentimentChart'
import { SocialHeatChart } from './components/SocialHeatChart'
import { ScoreProbabilityChart } from './components/ScoreProbabilityChart'
import { TeamAnalysisGrid } from './components/TeamAnalysisGrid'
import { AllPredictionsTable } from './components/AllPredictionsTable'
import { Footer } from './components/Footer'

export default function App() {
  const { data, loading, error } = useApi()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--text3)', fontSize: 14 }}>
          <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>⚽</div>
          加载世界杯预测数据中...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--home)', fontSize: 14 }}>
          数据加载失败: {error || '未知错误'}
          <br />
          <span style={{ color: 'var(--text3)', fontSize: 12 }}>请确保后端 API 已启动 (uvicorn main:app --port 8000)</span>
        </div>
      </div>
    )
  }

  const highConf = data.predictions
    .filter((p) => p.conf >= 47.5)
    .sort((a, b) => b.conf - a.conf)
    .slice(0, 20)

  const scoreSimData = data.predictions
    .map((p) => ({ home: p.home, away: p.away, score_probs: p.score_probs, simulation: p.simulation }))
    .slice(0, 15)

  const teamMap: Record<string, { sentiment: number; heat: number }> = {}
  data.media_sentiment.forEach((m) => {
    if (!teamMap[m.team]) teamMap[m.team] = { sentiment: 0.5, heat: 0.5 }
    teamMap[m.team].sentiment = m.sentiment_score
  })
  data.social_heat.forEach((s) => {
    if (!teamMap[s.team]) teamMap[s.team] = { sentiment: 0.5, heat: 0.5 }
    teamMap[s.team].heat = s.heat_score
  })
  const teamAnalysis = Object.entries(teamMap)
    .map(([team, v]) => ({ team, ...v, score: (v.sentiment + v.heat) / 2 * 100 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  return (
    <>
      <Header
        generatedAt={data.meta.generated_at}
        totalTeams={data.meta.total_teams}
        totalMatches={data.meta.total_matches}
        cacheInfo={data.meta.cache}
      />
      <StatsBar
        accuracy={data.meta.backtest_accuracy}
        trainingSamples={data.meta.training_samples}
        pendingPredictions={data.predictions.length}
      />
      <LatestMatchday match={data.predictions[0]} />
      <HighConfidenceGrid predictions={highConf} />
      <BacktestChart />
      <div className="l2">
        <MediaSentimentChart data={data.media_sentiment} />
        <SocialHeatChart data={data.social_heat} />
      </div>
      <ScoreProbabilityChart data={scoreSimData} />
      <TeamAnalysisGrid teams={teamAnalysis} />
      <AllPredictionsTable predictions={data.predictions} />
      <Footer />
    </>
  )
}
