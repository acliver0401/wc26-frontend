import type { Prediction, OddsData, MatchOdds } from '../types'

function matchKeyFromPred(p: Prediction): string {
  return `${p.date}_${p.home}_${p.away}`
}

function valueBadge(modelProb: number, marketProb: number) {
  const diff = modelProb - marketProb
  if (diff >= 5) return { label: '价值', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
  if (diff <= -5) return { label: '高估', cls: 'bg-red-500/15 text-red-400 border-red-500/30' }
  return { label: '一致', cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30' }
}

function probBar(pct: number, color: string, label: string) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-slate-500 w-6 tabular-nums">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
      <span className="text-[10px] font-mono tabular-nums w-9 text-right" style={{ color }}>
        {pct.toFixed(1)}%
      </span>
    </div>
  )
}

function outcomeLabel(pred_r: 'H' | 'D' | 'A', home: string, away: string) {
  if (pred_r === 'H') return home + '胜'
  if (pred_r === 'A') return away + '胜'
  return '平局'
}

export function OddsWidget({
  predictions,
  oddsData,
}: {
  predictions: Prediction[]
  oddsData: OddsData | null
}) {
  if (!oddsData || Object.keys(oddsData.matches).length === 0) {
    return null
  }

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().slice(0, 10)

  // Show today + tomorrow's matches with odds
  const upcoming = predictions
    .filter((p) => {
      const key = matchKeyFromPred(p)
      return (p.date === todayStr || p.date === tomorrowStr) && oddsData.matches[key]
    })
    .slice(0, 12)

  if (upcoming.length === 0) {
    return null
  }

  return (
    <div className="cd">
      <div className="cd-h">
        <span className="cd-h-dot" style={{ background: '#38bdf8' }} />
        <h2>博彩市场对比</h2>
        <span className="cd-h-b">
          模型 vs 市场 · 隐含概率
          {oddsData.updated_at && (
            <span className="ml-2 text-slate-500 text-[10px]">
              更新于 {new Date(oddsData.updated_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <th className="py-2 px-3 text-left font-medium">对阵</th>
              <th className="py-2 px-2 text-center font-medium">模型预测</th>
              <th className="py-2 px-2 text-center font-medium">市场隐含</th>
              <th className="py-2 px-2 text-center font-medium">差距</th>
              <th className="py-2 px-2 text-right font-medium">最佳赔率</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((p) => {
              const key = matchKeyFromPred(p)
              const odds: MatchOdds = oddsData.matches[key]
              if (!odds || !odds.implied_probs) return null

              const modelProb = p.pred_r === 'H' ? p.ph : p.pred_r === 'A' ? p.pa : p.pd
              const marketProb = p.pred_r === 'H' ? odds.implied_probs.home
                : p.pred_r === 'A' ? odds.implied_probs.away
                : odds.implied_probs.draw
              const badge = valueBadge(modelProb, marketProb)

              return (
                <tr key={key} className="border-b border-slate-800/40 hover:bg-slate-900/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-slate-100">{p.home}</span>
                      <span className="text-[10px] text-slate-600">vs</span>
                      <span className="text-sm font-semibold text-slate-100">{p.away}</span>
                      <span className="text-[10px] text-slate-600 mt-0.5">{p.date}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 align-top text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xs text-slate-200 font-semibold">
                        {outcomeLabel(p.pred_r, p.home, p.away)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{modelProb.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 align-top text-center">
                    <div className="flex flex-col gap-1.5">
                      {probBar(odds.implied_probs.home, '#fbbf24', '主')}
                      {probBar(odds.implied_probs.draw, '#94a3b8', '平')}
                      {probBar(odds.implied_probs.away, '#38bdf8', '客')}
                    </div>
                  </td>
                  <td className="py-3 px-2 align-top text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-mono tabular-nums text-slate-500">
                        {(modelProb - marketProb) > 0 ? '+' : ''}{(modelProb - marketProb).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 align-top text-right">
                    {odds.h2h ? (
                      <div className="flex flex-col gap-0.5 font-mono tabular-nums">
                        <span className="text-[10px] text-amber-400">{odds.h2h.home}</span>
                        <span className="text-[10px] text-slate-400">{odds.h2h.draw}</span>
                        <span className="text-[10px] text-sky-400">{odds.h2h.away}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600">—</span>
                    )}
                    {odds.bookmaker_count > 0 && (
                      <span className="text-[9px] text-slate-600 mt-1 block">
                        {odds.bookmaker_count}家
                      </span>
                    )}
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
