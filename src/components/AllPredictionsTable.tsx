import { useState } from 'react'
import type { Prediction } from '../types'
import { EnvironmentalBadges, EnvironmentalWarnings } from './EnvironmentalBadges'
import { LineupDrawer } from './LineupDrawer'

function matchKey(m: Prediction) {
  return `${m.date}-${m.home}-${m.away}`
}

function predColor(r: 'H' | 'D' | 'A') {
  if (r === 'H') return 'text-amber-400'
  if (r === 'A') return 'text-sky-400'
  return 'text-slate-300'
}

function probBar(pct: number, color: string) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-10 h-1 rounded-full bg-slate-800 overflow-hidden">
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

export function AllPredictionsTable({ predictions }: { predictions: Prediction[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [lineupMatch, setLineupMatch] = useState<Prediction | null>(null)

  if (predictions.length === 0) {
    return (
      <div className="cd">
        <div className="cd-h">
          <span className="cd-h-dot" />
          <h2>全部预测详情</h2>
        </div>
        <div className="text-center py-8 text-slate-500 text-sm">暂无预测数据</div>
      </div>
    )
  }

  const liveCount = predictions.filter((p) => p.prediction_status === 'Live-Lineup').length

  const toggle = (k: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  return (
    <>
      <div className="cd">
        <div className="cd-h">
          <span className="cd-h-dot" />
          <h2>全部预测详情</h2>
          <span className="cd-h-b">
            {predictions.length} MATCHES
            {liveCount > 0 && (
              <span className="ml-2 text-emerald-400 text-[10px] font-semibold">
                 {liveCount} LIVE
              </span>
            )}
          </span>
        </div>

        <div className="tw" style={{ maxHeight: 560, overflowY: 'auto' }}>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <th className="py-2.5 px-2 text-left font-medium">日期</th>
                <th className="py-2.5 px-3 text-left font-medium">对阵</th>
                <th className="py-2.5 px-2 text-center font-medium">状态</th>
                <th className="py-2.5 px-2 text-center font-medium">预测</th>
                <th className="py-2.5 px-2 text-left font-medium">比分概率</th>
                <th className="py-2.5 px-2 text-left font-medium">环境因子</th>
                <th className="py-2.5 px-2 text-center font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((r) => {
                const key = matchKey(r)
                const isOpen = expanded.has(key)
                const isLive = r.prediction_status === 'Live-Lineup'
                const pc = r.pred_r === 'H' ? '#fbbf24' : r.pred_r === 'A' ? '#38bdf8' : '#cbd5e1'

                return (
                  <tr key={key} className="border-b border-slate-800/60">
                    <td className="py-3 px-2 align-top">
                      <span className="text-xs text-slate-400 tabular-nums whitespace-nowrap">
                        {r.date}
                      </span>
                    </td>

                    {/* Teams */}
                    <td className="py-3 px-3 align-top">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-100 leading-tight">
                          {r.home}
                        </span>
                        <span className="text-[10px] text-slate-500">vs</span>
                        <span className="text-sm font-semibold text-slate-100 leading-tight">
                          {r.away}
                        </span>
                        <span className="text-[10px] text-slate-600 mt-0.5">
                          {r.stadium_city}
                          {r.home_formation && r.away_formation && (
                            <span className="ml-1">
                              · {r.home_formation} v {r.away_formation}
                            </span>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-2 align-top text-center">
                      {isLive ? (
                        <span
                          className="inline-block text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full cursor-pointer hover:bg-emerald-500/25 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setLineupMatch(r)
                          }}
                          title="点击查看首发阵容"
                        >
                          首发
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600">赛前</span>
                      )}
                    </td>

                    {/* Prediction + HDA */}
                    <td className="py-3 px-2 align-top">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-bold ${predColor(r.pred_r)}`}>
                          {r.pred}
                        </span>
                        <span className="text-[10px] font-mono tabular-nums text-slate-500">
                          {r.conf}%
                        </span>
                      </div>
                    </td>

                    {/* Scorelines */}
                    <td className="py-3 px-2 align-top">
                      <div className="flex flex-col gap-0.5">
                        {r.score_probs &&
                          Object.entries(r.score_probs)
                            .slice(0, 3)
                            .map(([s, p]) => (
                              <span
                                key={s}
                                className="text-xs font-mono tabular-nums text-slate-300 whitespace-nowrap"
                              >
                                <span className="text-slate-400">{s}</span>
                                <span className="text-sky-400 ml-1.5">
                                  {(p * 100).toFixed(1)}%
                                </span>
                              </span>
                            ))}
                      </div>
                    </td>

                    {/* Environment */}
                    <td className="py-3 px-2 align-top">
                      <EnvironmentalBadges match={r} />
                    </td>

                    {/* Expand toggle */}
                    <td className="py-3 px-2 align-top text-center">
                      <button
                        onClick={() => toggle(key)}
                        className="text-slate-500 hover:text-slate-300 transition-colors text-sm w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800"
                        title="展开赛况推演"
                      >
                        <span
                          className="inline-block transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          ▼
                        </span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Expanded detail panels rendered below the table */}
        <div className="border-t border-slate-800/60">
          {predictions
            .filter((r) => expanded.has(matchKey(r)))
            .map((r) => {
              const key = matchKey(r)
              const pc = r.pred_r === 'H' ? '#fbbf24' : r.pred_r === 'A' ? '#38bdf8' : '#cbd5e1'

              return (
                <div
                  key={`exp-${key}`}
                  className="border-b border-slate-800/60 overflow-hidden animate-expand"
                >
                  <div className="p-5">
                    {/* Header bar */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm font-semibold text-slate-200">
                        {r.home}
                      </span>
                      <span className="text-xs text-slate-500">vs</span>
                      <span className="text-sm font-semibold text-slate-200">
                        {r.away}
                      </span>
                      <span className="text-[10px] text-slate-600 ml-1">
                        {r.date}
                      </span>
                      <span className="ml-auto text-[10px] text-slate-500">
                        置信度 {r.conf}% · {r.bet_advice}
                      </span>
                    </div>

                    {/* Two-column content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left: Simulation */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                          赛况推演
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {r.simulation}
                        </p>

                        {/* Reason */}
                        <div className="mt-3 pt-3 border-t border-slate-800/60">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">
                            推荐理由
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {r.reason}
                          </p>
                        </div>
                      </div>

                      {/* Right: Warnings + HDA bars */}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                          环境警示
                        </div>
                        {r.warnings && r.warnings.length > 0 ? (
                          <EnvironmentalWarnings warnings={r.warnings} />
                        ) : (
                          <p className="text-xs text-slate-600">无特殊环境警示</p>
                        )}

                        {/* HDA probability bars */}
                        <div className="mt-4 pt-3 border-t border-slate-800/60">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                            胜平负概率
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-amber-400 w-8 tabular-nums">主胜</span>
                              {probBar(r.ph, '#fbbf24')}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 w-8 tabular-nums">平局</span>
                              {probBar(r.pd, '#94a3b8')}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-sky-400 w-8 tabular-nums">客胜</span>
                              {probBar(r.pa, '#38bdf8')}
                            </div>
                          </div>
                        </div>

                        {/* Extra stats */}
                        <div className="mt-4 pt-3 border-t border-slate-800/60">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                            核心指标
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <span className="text-slate-500">FIFA排名</span>
                            <span className="text-slate-300 tabular-nums text-right">
                              {r.home_rank} v {r.away_rank}
                            </span>
                            <span className="text-slate-500">进攻系数</span>
                            <span className="text-slate-300 tabular-nums text-right">
                              {r.home_as?.toFixed(2)} v {r.away_as?.toFixed(2)}
                            </span>
                            <span className="text-slate-500">防守弱点</span>
                            <span className="text-slate-300 tabular-nums text-right">
                              {r.home_dw?.toFixed(2)} v {r.away_dw?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {lineupMatch && (
        <LineupDrawer
          match={lineupMatch}
          onClose={() => setLineupMatch(null)}
        />
      )}

      {/* Accordion animation styles */}
      <style>{`
        @keyframes expand-in {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 800px; }
        }
        .animate-expand {
          animation: expand-in 0.3s ease-out;
        }
        .env-badge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 4px;
          max-width: 280px;
        }
        .env-badge-chip {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 9px;
          font-weight: 500;
          line-height: 1;
          padding: 2px 5px;
          border-radius: 4px;
          border: 1px solid;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
      `}</style>
    </>
  )
}
