'use client'

import React, { useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { useTheme } from 'next-themes'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

interface OrderAnalysisChartProps {
    orders: Array<{
        createdAt: string
        totalPrice: number
        orderStatus: string
    }>
    chartType: 'Line' | 'Bar'
}

const OrderAnalysisChart = ({ orders, chartType }: OrderAnalysisChartProps) => {
    const { theme } = useTheme()
    const hasData = orders.length > 0

    const { chartData, totalFulfilled, totalCancelled } = useMemo(() => {
        // Group orders by month
        const monthlyData: Record<string, { fulfilled: number, cancelled: number }> = {}

        orders.forEach(order => {
            const date = new Date(order.createdAt)
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' })

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { fulfilled: 0, cancelled: 0 }
            }

            // Consider "Order Confirmed" as fulfilled for the sake of the visualization if it's new
            if (order.orderStatus === 'Delivered' || order.orderStatus === 'Order Confirmed') {
                monthlyData[monthKey].fulfilled += Number(order.totalPrice)
            } else if (order.orderStatus === 'Cancelled' || order.orderStatus === 'Failed' || order.orderStatus === 'Returned') {
                monthlyData[monthKey].cancelled += Number(order.totalPrice)
            }
        })

        // Get last 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const currentMonth = new Date().getMonth()
        const labels = []
        const fulfilledData = []
        const cancelledData = []

        let fulfilledSum = 0
        let cancelledSum = 0

        for (let i = 0; i < 12; i++) {
            const monthIndex = (currentMonth - 11 + i + 12) % 12
            const month = months[monthIndex]
            labels.push(month)

            const fulfilledVal = monthlyData[month]?.fulfilled || (hasData ? 0 : Math.random() * 10000 + 2000)
            const cancelledVal = monthlyData[month]?.cancelled || (hasData ? 0 : Math.random() * 1000 + 500)

            fulfilledData.push(fulfilledVal)
            cancelledData.push(cancelledVal)

            fulfilledSum += monthlyData[month]?.fulfilled || 0
            cancelledSum += monthlyData[month]?.cancelled || 0
        }

        return {
            chartData: {
                labels,
                datasets: [
                    {
                        label: 'Fulfilled',
                        data: fulfilledData,
                        borderColor: '#ef4444',
                        backgroundColor: chartType === 'Line' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.8)',
                        fill: chartType === 'Line',
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    },
                    {
                        label: 'Cancel',
                        data: cancelledData,
                        borderColor: '#94a3b8',
                        backgroundColor: chartType === 'Line' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.8)',
                        fill: chartType === 'Line',
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#94a3b8',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    },
                ],
            },
            totalFulfilled: hasData ? fulfilledSum : 366,
            totalCancelled: hasData ? cancelledSum : 76
        }
    }, [orders, chartType, hasData])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                titleColor: theme === 'dark' ? '#fff' : '#000',
                bodyColor: theme === 'dark' ? '#94a3b8' : '#666',
                borderColor: theme === 'dark' ? '#1e293b' : '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || ''
                        if (label) {
                            label += ': '
                        }
                        if (context.parsed.y !== null) {
                            label += '$' + context.parsed.y.toLocaleString()
                        }
                        return label
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: theme === 'dark' ? '#64748b' : '#9ca3af',
                    font: {
                        size: 12,
                    },
                },
            },
            y: {
                grid: {
                    color: theme === 'dark' ? '#1e293b' : '#f3f4f6',
                    drawBorder: false,
                },
                ticks: {
                    color: theme === 'dark' ? '#64748b' : '#9ca3af',
                    font: {
                        size: 12,
                    },
                    callback: function (value: any) {
                        return '$' + (value / 1000) + 'K'
                    },
                },
                beginAtZero: true,
            },
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
    }

    return (
        <div className="relative">
            {/* Legend */}
            <div className="absolute top-0 right-0 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-muted-foreground">Fulfilled</span>
                    <span className="font-semibold text-foreground">{hasData ? totalFulfilled.toLocaleString() : '366'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-muted-foreground">Cancel</span>
                    <span className="font-semibold text-foreground">{hasData ? totalCancelled.toLocaleString() : '76'}</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-full pt-10 pb-2">
                {chartType === 'Line' ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <Bar data={chartData} options={options} />
                )}
            </div>
        </div>
    )
}

export default OrderAnalysisChart
