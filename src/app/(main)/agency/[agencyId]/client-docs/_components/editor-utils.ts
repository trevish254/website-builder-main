
export const editorJsToHtml = (data: any) => {
    if (!data || !data.blocks) return ''

    let html = '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">'

    data.blocks.forEach((block: any) => {
        switch (block.type) {
            case 'header':
                const level = block.data.level || 2
                html += `<h${level} style="margin-top: 1em; margin-bottom: 0.5em; font-weight: bold;">${block.data.text}</h${level}>`
                break
            case 'paragraph':
                html += `<p style="margin-bottom: 1em;">${block.data.text}</p>`
                break
            case 'list':
                const tag = block.data.style === 'ordered' ? 'ol' : 'ul'
                html += `<${tag} style="margin-bottom: 1em; padding-left: 20px;">`
                block.data.items.forEach((item: string) => {
                    html += `<li style="margin-bottom: 0.5em;">${item}</li>`
                })
                html += `</${tag}>`
                break
            case 'image':
                const width = block.data.width ? `width: ${block.data.width}px;` : 'width: 100%;'
                const height = block.data.height ? `height: ${block.data.height}px;` : 'height: auto;'
                html += `<div style="margin-bottom: 1em; text-align: center;">
                            <img src="${block.data.url}" style="${width} ${height} max-width: 100%; object-fit: cover; border-radius: 4px;" />
                            ${block.data.caption ? `<div style="font-size: 0.9em; color: #666; margin-top: 0.5em;">${block.data.caption}</div>` : ''}
                         </div>`
                break
            case 'quote':
                html += `<blockquote style="border-left: 4px solid #ccc; margin: 1em 0; padding-left: 1em; font-style: italic;">
                            ${block.data.text}
                            <footer style="font-size: 0.9em; margin-top: 0.5em;">— ${block.data.caption}</footer>
                         </blockquote>`
                break
            case 'delimiter':
                html += `<hr style="border: 0; border-top: 1px solid #eee; margin: 2em 0;" />`
                break
            case 'table':
                html += `<table style="width: 100%; border-collapse: collapse; margin-bottom: 1em;">`
                if (block.data.withHeadings) {
                    // Assuming first row is header
                }
                block.data.content.forEach((row: string[], rowIndex: number) => {
                    html += `<tr>`
                    row.forEach((cell: string) => {
                        html += `<td style="border: 1px solid #ddd; padding: 8px;">${cell}</td>`
                    })
                    html += `</tr>`
                })
                html += `</table>`
                break
            case 'code':
                html += `<pre style="background: #f4f4f4; padding: 1em; border-radius: 4px; overflow-x: auto;"><code>${block.data.code}</code></pre>`
                break
            case 'checklist':
                block.data.items.forEach((item: any) => {
                    const checked = item.checked ? 'checked' : ''
                    html += `<div style="display: flex; align-items: center; margin-bottom: 0.5em;">
                                <input type="checkbox" ${checked} disabled style="margin-right: 0.5em;">
                                <span>${item.text}</span>
                             </div>`
                })
                break
            default:
                break
        }
    })

    html += '</div>'
    return html
}
