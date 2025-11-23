'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

type Props = {
    data: number[]
    color?: string
}

const TinyChart = ({ data, color = '#10B981' }: Props) => {
    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 60,
            sparkline: {
                enabled: true,
            },
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        colors: [color],
        tooltip: {
            fixed: {
                enabled: false,
            },
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: () => '',
                },
            },
            marker: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
    }

    const series = [
        {
            name: 'Value',
            data: data,
        },
    ]

    return (
        <div className="w-full h-[60px]">
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={60}
                width="100%"
            />
        </div>
    )
}

export default TinyChart
