/**
 * Template Helper Functions
 * Utilities for creating GrapesJS components and templates
 */

export interface GrapesJSComponent {
    type?: string
    tagName?: string
    attributes?: Record<string, any>
    components?: GrapesJSComponent[] | string
    style?: Record<string, string>
    content?: string
}

export interface TemplateData {
    name: string
    description: string
    category: string
    thumbnail?: string
    content: {
        pages: any[]
        styles: any[]
        assets?: any[]
    }
    isPublic: boolean
}

/**
 * Create a section component
 */
export function createSection(
    components: GrapesJSComponent[],
    styles: Record<string, string> = {},
    className: string = ''
): GrapesJSComponent {
    return {
        type: 'section',
        attributes: { class: className },
        components,
        style: {
            padding: '80px 20px',
            ...styles
        }
    }
}

/**
 * Create a container component
 */
export function createContainer(
    components: GrapesJSComponent[],
    maxWidth: string = '1200px'
): GrapesJSComponent {
    return {
        type: 'container',
        components,
        style: {
            'max-width': maxWidth,
            margin: '0 auto',
            padding: '0 20px'
        }
    }
}

/**
 * Create a heading component
 */
export function createHeading(
    text: string,
    level: 1 | 2 | 3 | 4 | 5 | 6 = 1,
    styles: Record<string, string> = {}
): GrapesJSComponent {
    return {
        type: 'text',
        tagName: `h${level}`,
        content: text,
        style: {
            'font-size': level === 1 ? '48px' : level === 2 ? '36px' : '24px',
            'font-weight': '700',
            'line-height': '1.2',
            margin: '0 0 20px 0',
            ...styles
        }
    }
}

/**
 * Create a paragraph component
 */
export function createParagraph(
    text: string,
    styles: Record<string, string> = {}
): GrapesJSComponent {
    return {
        type: 'text',
        tagName: 'p',
        content: text,
        style: {
            'font-size': '16px',
            'line-height': '1.6',
            margin: '0 0 20px 0',
            color: '#666',
            ...styles
        }
    }
}

/**
 * Create a button component
 */
export function createButton(
    text: string,
    href: string = '#',
    styles: Record<string, string> = {}
): GrapesJSComponent {
    return {
        type: 'link',
        attributes: { href },
        content: text,
        style: {
            display: 'inline-block',
            padding: '14px 32px',
            'background-color': '#0A3D3D',
            color: '#ffffff',
            'text-decoration': 'none',
            'border-radius': '8px',
            'font-weight': '600',
            'font-size': '16px',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            ...styles
        }
    }
}

/**
 * Create a card component
 */
export function createCard(
    components: GrapesJSComponent[],
    styles: Record<string, string> = {}
): GrapesJSComponent {
    return {
        type: 'container',
        components,
        style: {
            'background-color': '#ffffff',
            'border-radius': '12px',
            padding: '30px',
            'box-shadow': '0 4px 6px rgba(0,0,0,0.1)',
            ...styles
        }
    }
}

/**
 * Create a grid layout
 */
export function createGrid(
    components: GrapesJSComponent[],
    columns: number = 3,
    gap: string = '30px'
): GrapesJSComponent {
    return {
        type: 'container',
        components,
        style: {
            display: 'grid',
            'grid-template-columns': `repeat(${columns}, 1fr)`,
            gap,
            '@media (max-width: 768px)': {
                'grid-template-columns': '1fr'
            }
        }
    }
}

/**
 * Create an icon component (SVG)
 */
export function createIcon(
    svgContent: string,
    size: string = '24px',
    color: string = 'currentColor'
): GrapesJSComponent {
    return {
        type: 'svg',
        content: svgContent,
        style: {
            width: size,
            height: size,
            fill: color
        }
    }
}

/**
 * Create a glassmorphic card
 */
export function createGlassCard(
    components: GrapesJSComponent[],
    backgroundColor: string = 'rgba(255,255,255,0.1)'
): GrapesJSComponent {
    return {
        type: 'container',
        components,
        style: {
            background: backgroundColor,
            'backdrop-filter': 'blur(10px)',
            '-webkit-backdrop-filter': 'blur(10px)',
            'border-radius': '16px',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '24px',
            'box-shadow': '0 8px 32px 0 rgba(0,0,0,0.1)'
        }
    }
}

/**
 * Create a flex container
 */
export function createFlex(
    components: GrapesJSComponent[],
    direction: 'row' | 'column' = 'row',
    align: string = 'center',
    justify: string = 'flex-start',
    gap: string = '20px'
): GrapesJSComponent {
    return {
        type: 'container',
        components,
        style: {
            display: 'flex',
            'flex-direction': direction,
            'align-items': align,
            'justify-content': justify,
            gap
        }
    }
}

/**
 * Create responsive image
 */
export function createImage(
    src: string,
    alt: string = '',
    styles: Record<string, string> = {}
): GrapesJSComponent {
    return {
        type: 'image',
        attributes: { src, alt },
        style: {
            'max-width': '100%',
            height: 'auto',
            display: 'block',
            ...styles
        }
    }
}
