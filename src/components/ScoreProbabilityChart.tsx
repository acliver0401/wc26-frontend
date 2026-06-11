import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { ScoreSimData } from '../types'

export function ScoreProbabilityChart({ data }: { data: ScoreSimData[] }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const simRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return
    const chart = echarts.init(chartRef.current)

    // Collect all unique scores across all matches
    const allScores = new Set<string>()
    data.forEach((d) => Object.keys(d.score_probs).forEach((s) => allScores.add(s)))
    const scoreOrder = Array.from(allScores).sort((a, b) => {
      const [ha, aa] = a.split('-').map(Number)
      const [hb, ab] = b.split('-').map(Number)
      if (ha !== hb) return ha - hb
      return aa - ab
    })

    // Build heatmap data: [matchIdx, scoreIdx, probability]
    const heatData: [number, number, number][] = []
    data.forEach((d, mi) => {
      Object.entries(d.score_probs).forEach(([score, prob]) => {
        const si = scoreOrder.indexOf(score)
        if (si >= 0) heatData.push([mi, si, +(prob * 100).toFixed(1)])
      })
    })

    const matchLabels = data.map((d) => `${d.home} vs ${d.away}`)

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        formatter: (params: any) => {
          const [mi, si, v] = params.data ?? [0, 0, 0]
          return `${matchLabels[mi]}<br/>比分 ${scoreOrder[si]}: <b>${v}%</b>`
        },
      },
      grid: { left: '14%', right: '4%', top: '2%', bottom: '10%' },
      xAxis: {
        type: 'category',
        data: matchLabels,
        axisLabel: { fontSize: 9, color: '#94a3b8', rotate: 35, interval: 0 },
        axisLine: { lineStyle: { color: '#1a1d2e' } },
        position: 'bottom',
      },
      yAxis: {
        type: 'category',
        data: scoreOrder,
        axisLabel: { fontSize: 10, color: '#94a3b8' },
        axisLine: { lineStyle: { color: '#1a1d2e' } },
        splitLine: { lineStyle: { color: '#1a1d2e' } },
      },
      visualMap: {
        min: 0,
        max: Math.max(...heatData.map((d) => d[2]), 1),
        calculable: false,
        orient: 'vertical',
        right: 0,
        top: 'center',
        textStyle: { color: '#4a5270', fontSize: 9 },
        inRange: {
          color: ['#0f111b', '#1a3a2a', '#22543d', '#2d6a4f', '#40916c', '#52b788', '#95d5b2'],
        },
      },
      series: [
        {
          type: 'heatmap',
          data: heatData,
          label: {
            show: true,
            fontSize: 9,
            color: '#e2e8f0',
            formatter: (params: any) => (params.data[2] >= 6 ? `${params.data[2]}%` : ''),
          },
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowColor: 'rgba(82, 183, 136, 0.5)' },
          },
        },
      ],
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [data])

  return (
    <div className="cd">
      <div className="cd-h">
        <span className="cd-h-dot" />
        <h2>比分概率热力图</h2>
        <span className="cd-h-b">SCORE HEATMAP</span>
      </div>
      <div ref={chartRef} className="ch" style={{ height: 380 }} />
      <div ref={simRef} className="sim-list">
        {data.slice(0, 4).map((d, i) => (
          <div key={i} className="sim-item">
            <span className="sim-teams">{d.home} vs {d.away}</span>
            <span className="sim-text">{d.simulation}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
