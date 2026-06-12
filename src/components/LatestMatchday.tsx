import { useState, useMemo } from 'react'
import type { Prediction } from '../types'
import { EnvironmentalBadges, EnvironmentalWarnings } from './EnvironmentalBadges'
import { LineupDrawer } from './LineupDrawer'

function probBar(pct: number, color: string) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums w-10 text-right" style={{ color }}>
        {pct}%
      </span>
    </div>
  )
}

export function LatestMatchday({ allPredictions }: { allPredictions: Prediction[] }) {
  const [open, setOpen] = useState(false)
  const [lineupOpen, setLineupOpen] = useState(false)

  // Dynamically anchor to the next upcoming (or LIVE) match based on current time.
  // Kickoff convention: every match starts at 19:00 UTC on its date.
  // Uses explicit UTC parsing to avoid browser locale skew against backend CST.
  const match = useMemo(() => {
    if (!allPredictions.length) return null

    const now = Date.now()

    // Parse match kickoff: date + 19:00 UTC
    const kickoff = (p: Prediction): number =>
      new Date(p.date + 'T19:00:00Z').getTime()

    // 1. LIVE match (in progress)
    const live = allPredictions.find(
      (p) => p.result && (p.result.status === 'LIVE' || p.result.status === 'HT')
    )
    if (live) return live

    // 2. Next upcoming match (kickoff >= now, not yet finished)
    const upcoming = allPredictions
      .filter((p) => {
        if (p.result && p.result.status === 'FT') return false
        return kickoff(p) >= now
      })
      .sort((a, b) => kickoff(a) - kickoff(b))

    if (upcoming.length > 0) return upcoming[0]

    // 3. All matches in the past — show most recent completed
    const completed = allPredictions
      .filter((p) => p.result && p.result.status === 'FT')
      .sort((a, b) => kickoff(b) - kickoff(a))

    if (completed.length > 0) return completed[0]

    // 4. Fallback: first match in the list
    return allPredictions[0]
  }, [allPredictions])

  if (!match) return null

  const pc = match.pred_r === 'H' ? '#fbbf24' : match.pred_r === 'A' ? '#38bdf8' : '#cbd5e1'
  const isLive = match.prediction_status === 'Live-Lineup'
  const hasResult = match.result && match.result.status === 'FT'
  const isOngoing = match.result && (match.result.status === 'LIVE' || match.result.status === 'HT')

  return (
    <>
      <div className={`cd ${isLive ? 'border-l-[3px] border-l-emerald-500' : ''} ${isOngoing ? 'border-l-[3px] border-l-red-500' : ''} ${hasResult ? 'border-l-[3px] border-l-slate-500' : ''}`}>
        <div className="cd-h">
          <span className="cd-h-dot" style={{ background: isOngoing ? '#ef4444' : hasResult ? '#64748b' : 'var(--green)' }} />
          <h2>
            {hasResult ? '最近赛果' : isOngoing ? '进行中' : '最新比赛日'} · {match.date}
          </h2>
          <span className="cd-h-b">
            {hasResult ? 'FULL-TIME' : isOngoing ? (
              <span style={{ color: '#ef4444', fontWeight: 700 }}>LIVE</span>
            ) : (
              <>MATCHDAY{isLive && <span className="ml-2 text-emerald-400 text-[10px] font-semibold">首发已锁定</span>}</>
            )}
          </span>
        </div>

        <div className="px-5 py-4">
          {/* Teams + Score or Prediction */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-slate-100">{match.home}</span>
              {/* Score display when available */}
              {(hasResult || isOngoing) && match.result ? (
                <span style={{
                  fontSize: 22, fontWeight: 800, fontFamily: 'monospace',
                  color: isOngoing ? '#ef4444' : '#e2e8f0',
                  letterSpacing: 2,
                }}>
                  {match.result.home_score} - {match.result.away_score}
                </span>
              ) : (
                <span className="text-sm text-slate-500">vs</span>
              )}
              <span className="text-lg font-bold text-slate-100">{match.away}</span>
              {match.home_formation && match.away_formation && (
                <span className="text-[11px] text-slate-600 ml-1">
                  {match.home_formation} v {match.away_formation}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">{match.stadium_city} · {match.stadium}</span>
              {!hasResult && (
                <div className="text-center">
                  <span className="text-lg font-bold" style={{ color: pc }}>{match.pred}</span>
                  <div className="text-[10px] text-slate-500">置信{match.conf}%</div>
                </div>
              )}
              {hasResult && match.result && (
                <div className="text-center">
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: match.result.outcome === match.pred_r ? '#22c55e' : '#ef4444',
                  }}>
                    {match.result.outcome === match.pred_r ? '预测正确' : '预测偏差'}
                  </span>
                  <div className="text-[10px] text-slate-500">
                    预测{match.pred}({match.conf}%)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HDA probability bars — only for upcoming matches */}
          {!hasResult && (
            <div className="flex items-center gap-5 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-amber-400 font-medium w-6">主</span>
                {probBar(match.ph, '#fbbf24')}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium w-6">平</span>
                {probBar(match.pd, '#94a3b8')}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-sky-400 font-medium w-6">客</span>
                {probBar(match.pa, '#38bdf8')}
              </div>
            </div>
          )}

          {/* Score prediction vs actual for completed matches */}
          {hasResult && match.score_probs && (
            <div className="flex items-center gap-4 text-xs mb-3">
              <span className="text-slate-500">预测比分分布:</span>
              {Object.entries(match.score_probs).slice(0, 3).map(([s, p]) => (
                <span key={s} className="font-mono tabular-nums text-slate-300">
                  <span className="text-slate-500">{s}</span>
                  <span className="text-sky-400 ml-1">{(p * 100).toFixed(1)}%</span>
                </span>
              ))}
            </div>
          )}

          {/* Top scorelines for upcoming */}
          {!hasResult && (
            <div className="flex items-center gap-4 text-xs mb-3">
              {match.score_probs &&
                Object.entries(match.score_probs)
                  .slice(0, 4)
                  .map(([s, p]) => (
                    <span key={s} className="font-mono tabular-nums text-slate-300">
                      <span className="text-slate-500">{s}</span>
                      <span className="text-sky-400 ml-1">{(p * 100).toFixed(1)}%</span>
                    </span>
                  ))}
            </div>
          )}

          <EnvironmentalBadges match={match} />

          {/* Action buttons */}
          {!hasResult && (
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span className="inline-block transition-transform duration-200"
                      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  ▶
                </span>
                {open ? '收起详情' : '查看赛况推演与警示'}
              </button>

              {isLive && match.lineup_info && (
                <button
                  onClick={() => setLineupOpen(true)}
                  style={{
                    background: 'rgba(67,160,71,0.14)',
                    border: '1px solid rgba(67,160,71,0.35)',
                    borderRadius: 5,
                    color: '#43a047',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  查看首发阵容
                </button>
              )}
            </div>
          )}

          {/* Expanded detail */}
          {open && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-800/60 animate-expand">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">赛况推演</div>
                <p className="text-sm text-slate-200 leading-relaxed">{match.simulation}</p>
                <div className="mt-3 pt-3 border-t border-slate-800/60">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">推荐理由</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{match.reason}</p>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">环境警示与建议</div>
                {match.warnings && match.warnings.length > 0 ? (
                  <EnvironmentalWarnings warnings={match.warnings} />
                ) : (
                  <p className="text-xs text-slate-600">无特殊环境警示</p>
                )}
                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">投注建议</div>
                  <p className="text-xs text-slate-400">{match.bet_advice}</p>
                </div>
              </div>
            </div>
          )}

          {/* Inline lineup insight */}
          {isLive && match.lineup_info && (
            <div className="mt-3 pt-3 border-t border-slate-800/60">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">临场分析</div>
              <p className="text-xs text-emerald-300/80 leading-relaxed">{match.lineup_info.insight}</p>
            </div>
          )}
        </div>
      </div>

      {lineupOpen && (
        <LineupDrawer match={match} onClose={() => setLineupOpen(false)} />
      )}
    </>
  )
}
