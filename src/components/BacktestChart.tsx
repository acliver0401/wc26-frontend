import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const cumRet: number[] = []

export function BacktestChart() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        formatter: (p: { axisValue: string; marker: string; value: number }[]) =>
          `<b>${p[0].axisValue}</b><br/>${p[0].marker} 累计收益: ¥${p[0].value.toFixed(0)}`,
      },
      grid: { left: '8%', right: '4%', top: '8%', bottom: '10%' },
      xAxis: {
        type: 'category',
        data: Array.from({ length: cumRet.length }, (_, i) => `#${i + 1}`),
        axisLabel: { fontSize: 9, color: '#4a5270', show: false },
        axisLine: { lineStyle: { color: '#1a1d2e' } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: '累计盈亏 (¥)',
        nameTextStyle: { color: '#4a5270', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1a1d2e' } },
        axisLabel: { color: '#4a5270', fontSize: 10, formatter: '¥{value}' },
      },
      series: [
        {
          name: '策略收益',
          type: 'line',
          data: cumRet,
          smooth: true,
          lineStyle: { width: 2, color: '#f59e0b' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(245,158,11,.25)' },
                { offset: 1, color: 'rgba(245,158,11,0)' },
              ],
            },
          },
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 0,
                lineStyle: { color: '#2a2d42', type: 'dashed', width: 1 },
                label: { formatter: '盈亏平衡', color: '#4a5270', fontSize: 10 },
              },
            ],
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
  }, [])

  return (
    <div className="cd">
      <div className="cd-h">
        <span className="cd-h-dot" />
        <h2>模型回测收益曲线</h2>
      </div>
      <div ref={ref} className="ch" />
    </div>
  )
}
