import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { SocialHeat } from '../types'

export function SocialHeatChart({ data }: { data: SocialHeat[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { left: '22%', right: '6%', top: '6%', bottom: '10%' },
      xAxis: {
        type: 'value',
        max: 1.0,
        axisLabel: { color: '#4a5270', fontSize: 9, formatter: '{value}' },
        splitLine: { lineStyle: { color: '#1a1d2e' } },
      },
      yAxis: {
        type: 'category',
        data: data.map((d) => d.team),
        axisLabel: { color: '#94a3b8', fontSize: 9 },
        axisLine: { lineStyle: { color: '#1a1d2e' } },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: data.map((d) => d.heat_score),
          barWidth: '45%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#f97316' },
                { offset: 1, color: '#f59e0b' },
              ],
            },
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
        <h2>社交媒体热度</h2>
      </div>
      <div ref={ref} className="ch-sm" />
    </div>
  )
}
