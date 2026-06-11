import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { MediaSentiment } from '../types'

export function MediaSentimentChart({ data }: { data: MediaSentiment[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const topMedia = [...data]
      .sort((a, b) => b.sentiment_score - a.sentiment_score)
      .slice(0, 15)

    const chart = echarts.init(ref.current)
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        formatter: (p: { name: string; marker: string; value: number }[]) =>
          `${p[0].name}<br/>${p[0].marker} 情感得分: ${(p[0].value * 100).toFixed(0)}%`,
      },
      grid: { left: '22%', right: '6%', top: '6%', bottom: '10%' },
      xAxis: {
        type: 'value',
        max: 0.9,
        axisLabel: { color: '#4a5270', fontSize: 9, formatter: '{value}' },
        splitLine: { lineStyle: { color: '#1a1d2e' } },
      },
      yAxis: {
        type: 'category',
        data: topMedia.map((d) => d.team),
        axisLabel: { color: '#94a3b8', fontSize: 9 },
        axisLine: { lineStyle: { color: '#1a1d2e' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: topMedia.map((d) => d.sentiment_score),
          barWidth: '55%',
          itemStyle: {
            color: (p: { value: number }) => (p.value > 0.5 ? '#22c55e' : '#ef4444'),
            borderRadius: [0, 3, 3, 0],
          },
          label: {
            show: true,
            position: 'right',
            color: '#94a3b8',
            fontSize: 9,
            formatter: (p: { value: number }) => `${(p.value * 100).toFixed(0)}%`,
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
        <h2>媒体情感分析</h2>
      </div>
      <div ref={ref} className="ch-sm" />
    </div>
  )
}
