'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const StocksCard = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate mock stock data
  const generateDates = () => {
    const dates = []
    const now = new Date()
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      dates.push(date.getTime())
    }
    return dates
  }

  const dates = generateDates()
  const stockData = dates.map((date) => {
    const baseValue = 7000
    const variation = Math.sin(date / 1000000) * 500 + Math.random() * 200
    return [date, Math.round(baseValue + variation)]
  })

  const chartOptions = {
    series: [
      {
        name: 'Main Stocks',
        data: stockData,
      },
    ],
    chart: {
      type: 'area',
      stacked: false,
      height: 200,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#3b82f6'],
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return '$' + (val / 1000).toFixed(1) + 'K'
        },
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: false,
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val: number) {
          return '$' + val.toFixed(2)
        },
      },
    },
    theme: {
      mode: 'light',
    },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-lg">
            Main Stocks Extended and Limited
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">$7,150.80</div>
        <div className="text-sm text-green-600 mb-4">+9.1%</div>
        <div className="h-48">
          {mounted && (
            <Chart
              options={chartOptions}
              series={chartOptions.series}
              type="area"
              height={200}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StocksCard

