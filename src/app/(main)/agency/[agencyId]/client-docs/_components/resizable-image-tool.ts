
import interact from 'interactjs'

export default class ResizableImageTool {
    data: {
        url: string
        caption: string
        width: number
        height: number
    }
    wrapper: HTMLElement | null = null
    image: HTMLImageElement | null = null
    readOnly: boolean
    api: any

    static get toolbox() {
        return {
            title: 'Image',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
        }
    }

    static get isReadOnlySupported() {
        return true
    }

    constructor({ data, readOnly, api }: { data: any, readOnly: boolean, api: any }) {
        this.data = {
            url: data.url || '',
            caption: data.caption || '',
            width: data.width || 0, // 0 means auto/full
            height: data.height || 0
        }
        this.readOnly = readOnly
        this.api = api
    }

    render() {
        this.wrapper = document.createElement('div')
        this.wrapper.classList.add('resizable-image-tool')
        this.wrapper.style.position = 'relative'
        this.wrapper.style.display = 'flex'
        this.wrapper.style.flexDirection = 'column'
        this.wrapper.style.alignItems = 'center'
        this.wrapper.style.width = '100%'

        if (this.data.url) {
            this._createImage(this.data.url)
        } else {
            const input = document.createElement('input')
            input.placeholder = 'Paste an image URL...'
            input.classList.add('cdx-input')
            input.addEventListener('paste', (event) => {
                this._createImage((event.clipboardData || (window as any).clipboardData).getData('text'))
            })
            input.addEventListener('change', (event) => {
                this._createImage((event.target as HTMLInputElement).value)
            })
            this.wrapper.appendChild(input)
        }

        return this.wrapper
    }

    _createImage(url: string) {
        if (!this.wrapper) return
        this.wrapper.innerHTML = '' // Clear input

        const container = document.createElement('div')
        container.classList.add('image-container')
        container.style.position = 'relative'
        container.style.display = 'flex'
        container.style.justifyContent = 'center'
        container.style.maxWidth = '100%'

        // Initial size
        if (this.data.width) {
            container.style.width = `${this.data.width}px`
        } else {
            container.style.width = '100%'
        }

        if (this.data.height) {
            container.style.height = `${this.data.height}px`
        } else {
            container.style.height = 'auto'
        }

        this.image = document.createElement('img')
        this.image.src = url
        this.image.style.width = '100%'
        this.image.style.height = '100%'
        this.image.style.objectFit = 'cover'
        this.image.style.borderRadius = '4px'

        // Caption
        const caption = document.createElement('div')
        caption.contentEditable = 'true'
        caption.innerHTML = this.data.caption || ''
        caption.classList.add('cdx-input')
        caption.dataset.placeholder = 'Enter a caption'
        caption.style.marginTop = '8px'
        caption.style.textAlign = 'center'
        caption.style.minHeight = '1em'
        caption.style.color = '#707684'
        caption.style.fontSize = '14px'
        caption.style.outline = 'none'

        caption.addEventListener('input', () => {
            this.data.caption = caption.innerHTML
        })

        // Handles (only if not readOnly)
        if (!this.readOnly) {
            interact(container)
                .resizable({
                    edges: { left: false, right: true, bottom: true, top: false }, // Only resize from right/bottom which is less jarring
                    listeners: {
                        move: (event) => {
                            let { width, height } = event.rect

                            // Prevent weird jumps. Just set width/height.
                            container.style.width = `${width}px`
                            container.style.height = `${height}px`

                            this.data.width = width
                            this.data.height = height
                        }
                    },
                    modifiers: [
                        interact.modifiers.restrictEdges({
                            outer: 'parent'
                        }),
                        interact.modifiers.restrictSize({
                            min: { width: 100, height: 100 }
                        })
                    ]
                })
        }

        container.appendChild(this.image)
        this.wrapper.appendChild(container)
        this.wrapper.appendChild(caption)

        this.data.url = url
    }

    save(blockContent: HTMLElement) {
        return this.data
    }
}
