'use client'
import { useEffect, useRef } from 'react'

type Props = {
    content: any
}

export default function DocumentThumbnail({ content }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const width = 300
        const height = 192
        canvas.width = width
        canvas.height = height

        // Fill background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)

        // Add subtle paper texture
        ctx.fillStyle = '#f8f9fa'
        ctx.fillRect(10, 10, width - 20, height - 20)

        if (!content || !content.blocks || content.blocks.length === 0) {
            // Empty document
            ctx.fillStyle = '#9ca3af'
            ctx.font = '14px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Empty document', width / 2, height / 2)
            return
        }

        let y = 25
        const leftMargin = 20
        const rightMargin = width - 20
        const lineHeight = 16

        // Render blocks
        content.blocks.slice(0, 8).forEach((block: any) => {
            if (y > height - 20) return // Stop if we're out of space

            switch (block.type) {
                case 'header':
                    const level = block.data?.level || 2
                    const fontSize = level === 1 ? 18 : level === 2 ? 16 : 14
                    ctx.font = `bold ${fontSize}px Arial`
                    ctx.fillStyle = '#1f2937'

                    const headerText = block.data?.text || ''
                    const headerLines = wrapText(ctx, headerText, rightMargin - leftMargin)
                    headerLines.slice(0, 2).forEach(line => {
                        ctx.fillText(line, leftMargin, y)
                        y += fontSize + 4
                    })
                    y += 6
                    break

                case 'paragraph':
                    ctx.font = '12px Arial'
                    ctx.fillStyle = '#4b5563'

                    const paraText = (block.data?.text || '').replace(/<[^>]*>/g, '')
                    const paraLines = wrapText(ctx, paraText, rightMargin - leftMargin)
                    paraLines.slice(0, 3).forEach(line => {
                        ctx.fillText(line, leftMargin, y)
                        y += lineHeight
                    })
                    y += 4
                    break

                case 'list':
                    ctx.font = '12px Arial'
                    ctx.fillStyle = '#4b5563'

                    const items = Array.isArray(block.data?.items) ? block.data.items : []
                    items.slice(0, 3).forEach((item: any, index: number) => {
                        const bullet = block.data?.style === 'ordered' ? `${index + 1}.` : '•'

                        let content = ''
                        if (typeof item === 'string') {
                            content = item
                        } else if (item && typeof item === 'object') {
                            content = item.content || item.text || ''
                        }

                        const itemText = content.replace(/<[^>]*>/g, '')
                        ctx.fillText(`${bullet} ${itemText.substring(0, 40)}`, leftMargin + 5, y)
                        y += lineHeight
                    })
                    y += 4
                    break

                case 'quote':
                    // Draw quote line
                    ctx.fillStyle = '#d1d5db'
                    ctx.fillRect(leftMargin, y - 12, 3, lineHeight + 4)

                    ctx.font = 'italic 12px Arial'
                    ctx.fillStyle = '#6b7280'
                    const quoteText = block.data?.text || ''
                    ctx.fillText(quoteText.substring(0, 50), leftMargin + 10, y)
                    y += lineHeight + 4
                    break

                case 'table':
                    ctx.strokeStyle = '#d1d5db'
                    ctx.fillStyle = '#4b5563'
                    ctx.font = '10px Arial'

                    const tableHeight = 30
                    const tableWidth = rightMargin - leftMargin
                    ctx.strokeRect(leftMargin, y - 10, tableWidth, tableHeight)
                    ctx.fillText('Table', leftMargin + 5, y)
                    y += tableHeight + 4
                    break

                case 'checklist':
                    ctx.font = '12px Arial'
                    ctx.fillStyle = '#4b5563'

                    const checkItems = block.data?.items || []
                    checkItems.slice(0, 2).forEach((item: any) => {
                        const checkbox = item.checked ? '☑' : '☐'
                        ctx.fillText(`${checkbox} ${item.text.substring(0, 35)}`, leftMargin + 5, y)
                        y += lineHeight
                    })
                    y += 4
                    break

                case 'delimiter':
                    ctx.strokeStyle = '#d1d5db'
                    ctx.beginPath()
                    ctx.moveTo(leftMargin, y)
                    ctx.lineTo(rightMargin, y)
                    ctx.stroke()
                    y += 12
                    break
            }
        })

        // Add "..." if there are more blocks
        if (content.blocks.length > 8) {
            ctx.fillStyle = '#9ca3af'
            ctx.font = '12px Arial'
            ctx.fillText('...', leftMargin, y)
        }

    }, [content])

    // Helper function to wrap text
    function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
        const words = text.split(' ')
        const lines: string[] = []
        let currentLine = ''

        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word
            const metrics = ctx.measureText(testLine)

            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine)
                currentLine = word
            } else {
                currentLine = testLine
            }
        })

        if (currentLine) {
            lines.push(currentLine)
        }

        return lines
    }

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{ imageRendering: 'high-quality' }}
        />
    )
}
