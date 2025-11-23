'use client'

import React from 'react'
import { ResponsivePolarBar } from '@nivo/polar-bar'

const data = [
    {
        month: 'Jan',
        Rent: 45,
        Groceries: 174,
        Transport: 68,
        Savings: 72,
        Misc: 168,
    },
    {
        month: 'Feb',
        Rent: 165,
        Groceries: 96,
        Transport: 91,
        Savings: 13,
        Misc: 194,
    },
    {
        month: 'Mar',
        Rent: 190,
        Groceries: 78,
        Transport: 91,
        Savings: 103,
        Misc: 89,
    },
    {
        month: 'Apr',
        Rent: 13,
        Groceries: 53,
        Transport: 103,
        Savings: 183,
        Misc: 101,
    },
    {
        month: 'May',
        Rent: 174,
        Groceries: 127,
        Transport: 16,
        Savings: 144,
        Misc: 189,
    },
    {
        month: 'Jun',
        Rent: 10,
        Groceries: 174,
        Transport: 122,
        Savings: 143,
        Misc: 170,
    },
    {
        month: 'Jul',
        Rent: 88,
        Groceries: 80,
        Transport: 11,
        Savings: 140,
        Misc: 163,
    },
    {
        month: 'Aug',
        Rent: 2,
        Groceries: 100,
        Transport: 7,
        Savings: 31,
        Misc: 110,
    },
    {
        month: 'Sep',
        Rent: 158,
        Groceries: 22,
        Transport: 33,
        Savings: 174,
        Misc: 53,
    },
    {
        month: 'Oct',
        Rent: 17,
        Groceries: 193,
        Transport: 166,
        Savings: 157,
        Misc: 41,
    },
    {
        month: 'Nov',
        Rent: 173,
        Groceries: 85,
        Transport: 136,
        Savings: 168,
        Misc: 174,
    },
    {
        month: 'Dec',
        Rent: 182,
        Groceries: 192,
        Transport: 165,
        Savings: 159,
        Misc: 91,
    },
]

const IncomePolarBar = () => (
    <ResponsivePolarBar
        data={data}
        keys={['Rent', 'Groceries', 'Transport', 'Savings', 'Misc']}
        indexBy="month"
        valueSteps={5}
        valueFormat=">-$.0f"
        margin={{ top: 30, right: 20, bottom: 70, left: 20 }}
        innerRadius={0.25}
        cornerRadius={2}
        borderWidth={1}
        arcLabelsSkipRadius={28}
        radialAxis={{
            angle: 180,
            ticksPosition: 'after',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
        }}
        circularAxisOuter={{ tickSize: 5, tickPadding: 15, tickRotation: 0 }}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                translateY: 50,
                itemWidth: 90,
                itemHeight: 16,
                symbolShape: 'circle',
            },
        ]}
        theme={{
            tooltip: {
                container: {
                    fontSize: '12px',
                    color: '#000000',
                },
            },
        }}
    />
)

export default IncomePolarBar
