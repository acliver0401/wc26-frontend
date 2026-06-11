import { useState } from 'react'
import type { Prediction } from '../types'
import { EnvironmentalBadges, EnvironmentalWarnings } from './EnvironmentalBadges'

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

export function LatestMatchday({ match }: { match: Prediction }) {
  const [open, setOpen] = useState(false)
  if (!match) return null

  const pc = match.pred_r === 'H' ? '#fbbf24' : match.pred_r === 'A' ? '#38bdf8' : '#cbd5e1'
  const isLive = match.prediction_status === 'Live-Lineup'

  return (
    <div className={`cd ${isLive ? 'border-l-[3px] border-l-emerald-500' : ''}`}>
      <div className="cd-h">
        <span className="cd-h-dot" />
        <h2>最新比赛日 · {match.date}</h2>
        <span className="cd-h-b">
          MATCHDAY
          {isLive && (
            <span className="ml-2 text-emerald-400 text-[10px] font-semibold">
              首发已锁定
            </span>
          )}
        </span>
      </div>

      {/* Match card — large typography */}
      <div className="px-5 py-4">
        {/* Teams and prediction */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-slate-100">{match.home}</span>
            <span className="text-sm text-slate-500">vs</span>
            <span className="text-lg font-bold text-slate-100">{match.away}</span>
            {match.home_formation && match.away_formation && (
              <span className="text-[11px] text-slate-600 ml-1">
                {match.home_formation} v {match.away_formation}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">{match.stadium_city} · {match.stadium}</span>
            <div className="text-center">
              <span className="text-lg font-bold" style={{ color: pc }}>{match.pred}</span>
              <div className="text-[10px] text-slate-500">置信{match.conf}%</div>
            </div>
          </div>
        </div>

        {/* HDA probability bars */}
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

        {/* Top scorelines */}
        <div className="flex items-center gap-4 text-xs mb-3">
          {match.score_probs &&
            Object.entries(match.score_probs)
              .slice(0, 4)
              .map(([s, p]) => (
                <span key={s} className="font-mono tabular-nums text-slate-300">
                  <span className="text-slate-500">{s}</span>
                  <span className="text-sky-400 ml-1">
                    {(p * 100).toFixed(1)}%
                  </span>
                </span>
              ))}
        </div>

        {/* Environmental badges */}
        <EnvironmentalBadges match={match} />

        {/* Expand toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="mt-3 flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
        >
          <span className="inline-block transition-transform duration-200"
                style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            ▶
          </span>
          {open ? '收起详情' : '查看赛况推演与警示'}
        </button>

        {/* Expanded detail */}
        {open && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-800/60 animate-expand">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                赛况推演
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{match.simulation}</p>

              <div className="mt-3 pt-3 border-t border-slate-800/60">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">
                  推荐理由
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{match.reason}</p>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                环境警示与建议
              </div>
              {match.warnings && match.warnings.length > 0 ? (
                <EnvironmentalWarnings warnings={match.warnings} />
              ) : (
                <p className="text-xs text-slate-600">无特殊环境警示</p>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">
                  投注建议
                </div>
                <p className="text-xs text-slate-400">{match.bet_advice}</p>
              </div>
            </div>
          </div>
        )}

        {isLive && match.lineup_info && (
          <div className="mt-3 pt-3 border-t border-slate-800/60">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">
              临场分析
            </div>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              {match.lineup_info.insight}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
