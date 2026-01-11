/**
 * Legal/Tax Consultant Template (Thomas Northman inspired)
 * A premium template for law firms and tax consultants
 */

import {
    createSection,
    createContainer,
    createHeading,
    createParagraph,
    createButton,
    createCard,
    createGrid,
    createFlex,
    GrapesJSComponent,
    TemplateData,
    createImage
} from './template-helpers'

/**
 * Navbar
 */
function createNavbar(): GrapesJSComponent {
    return {
        type: 'container',
        style: {
            display: 'flex',
            'justify-content': 'space-between',
            'align-items': 'center',
            padding: '24px 40px',
            background: '#ffffff'
        },
        components: [
            {
                type: 'container',
                style: { display: 'flex', 'align-items': 'center', gap: '8px' },
                components: [
                    { type: 'text', content: '⚖️', style: { 'font-size': '20px' } },
                    { type: 'text', content: 'THOMAS NORTHMAN', style: { 'font-size': '16px', 'font-weight': '700', 'letter-spacing': '1px' } }
                ]
            },
            {
                type: 'container',
                style: { display: 'flex', gap: '30px' },
                components: ['About', 'Disputes', 'International', 'Rates & Fees', 'Contact'].map(link => ({
                    type: 'link',
                    content: link,
                    attributes: { href: '#' },
                    style: { 'text-decoration': 'none', color: '#1a1a1a', 'font-size': '14px', 'font-weight': '500' }
                }))
            },
            createButton('Consultation', '#', {
                'background-color': '#111111',
                padding: '10px 24px',
                'font-size': '14px',
                'border-radius': '50px'
            })
        ]
    }
}

/**
 * Hero Section
 */
function createHeroSection(): GrapesJSComponent {
    const tags = ['International Taxation', 'Tax Disputes', 'Tax Planning', 'Tax Compliance', 'Consultations']

    return createSection([
        createContainer([
            createFlex([
                {
                    type: 'container',
                    style: { flex: '1.2' },
                    components: [
                        createParagraph('TAX LAWYER', {
                            color: '#666',
                            'font-size': '14px',
                            'font-weight': '600',
                            'letter-spacing': '2px',
                            'margin-bottom': '16px'
                        }),
                        {
                            type: 'text',
                            tagName: 'h1',
                            content: 'Guiding You Through <span style="color: #00D084">Tax Complexity</span>',
                            style: { 'font-size': '64px', 'font-weight': '800', 'line-height': '1.1', 'margin-bottom': '24px', color: '#1a1a1a' }
                        },
                        createParagraph('We simplify tax complexities with tailored strategies, resolving disputes and ensuring compliance for local and international needs.', {
                            'font-size': '18px',
                            'max-width': '500px',
                            'margin-bottom': '32px'
                        }),
                        createButton('Start Consultation', '#', {
                            'background-color': '#00D084',
                            padding: '16px 36px',
                            'margin-bottom': '48px'
                        }),
                        createFlex(tags.map(tag => ({
                            type: 'container',
                            style: {
                                padding: '8px 20px',
                                border: '1px solid #e0e0e0',
                                'border-radius': '50px',
                                'font-size': '12px',
                                color: '#666'
                            },
                            content: tag
                        })), 'row', 'center', 'flex-start', '12px', 'wrap')
                    ]
                },
                {
                    type: 'container',
                    style: { flex: '1', position: 'relative' },
                    components: [
                        createImage('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop', 'Justice', {
                            'border-radius': '40px',
                            'aspect-ratio': '4/5',
                            'object-fit': 'cover'
                        })
                    ]
                }
            ], 'row', 'center', 'space-between', '60px')
        ])
    ], { padding: '60px 20px' })
}

/**
 * Quote Section
 */
function createQuoteSection(): GrapesJSComponent {
    return createSection([
        createContainer([
            {
                type: 'container',
                style: { 'text-align': 'center', 'max-width': '800px', margin: '0 auto', background: '#fcfcfc', padding: '80px', 'border-radius': '100px' },
                components: [
                    {
                        type: 'text',
                        content: '"',
                        style: { 'font-size': '120px', 'line-height': '0', color: '#f0f0f0', 'font-family': 'serif', 'margin-bottom': '-40px' }
                    },
                    createParagraph('Tax law is a puzzle - one that, with the right insight, can reveal a clear path forward.', {
                        'font-size': '24px',
                        'font-style': 'italic',
                        color: '#1a1a1a',
                        'line-height': '1.6',
                        margin: '0'
                    })
                ]
            }
        ])
    ], { padding: '80px 20px' })
}

/**
 * Brand/Video Section
 */
function createBrandSection(): GrapesJSComponent {
    return createSection([
        createContainer([
            createHeading('Discover Our Brand', 2, { 'text-align': 'left', 'margin-bottom': '32px', 'font-size': '32px' }),
            {
                type: 'container',
                style: {
                    position: 'relative',
                    'border-radius': '32px',
                    overflow: 'hidden',
                    background: 'url("https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop") center/cover'
                },
                components: [
                    {
                        type: 'container',
                        style: {
                            padding: '200px 0',
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                            'background-color': 'rgba(0,0,0,0.2)'
                        },
                        components: [
                            {
                                type: 'text',
                                content: '▶',
                                style: {
                                    width: '80px',
                                    height: '80px',
                                    background: 'rgba(255,255,255,0.9)',
                                    'border-radius': '50%',
                                    display: 'flex',
                                    'align-items': 'center',
                                    'justify-content': 'center',
                                    'font-size': '24px',
                                    cursor: 'pointer'
                                }
                            }
                        ]
                    }
                ]
            }
        ])
    ])
}

/**
 * About Section
 */
function createAboutSection(): GrapesJSComponent {
    return createSection([
        createContainer([
            createFlex([
                {
                    type: 'container',
                    style: { flex: '1' },
                    components: [
                        createHeading('About Thomas', 2, { 'font-size': '40px', 'margin-bottom': '24px' }),
                        createParagraph('Thomas started his own practice in 2012, and prior to that, worked in various law firms in and around San Francisco. He also formerly worked at the United States Tax Court and in the Tax Division of the Justice Department, where he helped prosecute a number of sophisticated international tax shelters.', {
                            'font-size': '16px',
                            'line-height': '1.8',
                            'margin-bottom': '24px',
                            color: '#444'
                        }),
                        {
                            type: 'link',
                            content: 'Learn more →',
                            attributes: { href: '#' },
                            style: { color: '#00D084', 'text-decoration': 'none', 'font-weight': '600' }
                        }
                    ]
                },
                {
                    type: 'container',
                    style: { flex: '1' },
                    components: [
                        createImage('https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop', 'Thomas', {
                            'border-radius': '32px',
                            'max-height': '400px',
                            'object-fit': 'cover'
                        })
                    ]
                }
            ], 'row', 'center', 'space-between', '80px')
        ])
    ], { padding: '100px 20px' })
}

/**
 * Testimonials Section
 */
function createTestimonialsSection(): GrapesJSComponent {
    const testimonials = [
        {
            date: 'November 18',
            content: 'I actually called in for tax planning instead of responding to an audit. Thomas gave a concise explanation of my situation in easy to understand terms, and suggested ways to reduce my tax liability. He is obviously very knowledgeable and patient, totally recommended!',
            author: 'Huan C.',
            location: 'Austin, TX'
        },
        {
            date: 'July 24',
            content: 'He is a film flam guy. Every time he speaks he gives you confidence that he is the competent involved person you want representing you. Lays it out like it is, no false promises. There are people that can and do earn their living honestly and with integrity, He appears to be one of them.',
            author: 'Daniel R.',
            location: 'Oakland, CA'
        }
    ]

    return createSection([
        createContainer([
            createHeading('Testimonials', 2, { 'font-size': '36px', 'margin-bottom': '48px' }),
            createGrid(testimonials.map(t =>
                createCard([
                    createParagraph(t.date, { 'font-size': '12px', color: '#999', 'margin-bottom': '16px' }),
                    createParagraph(t.content, { 'font-size': '15px', color: '#333', 'margin-bottom': '24px', 'line-height': '1.6' }),
                    {
                        type: 'text',
                        content: '★★★★★ 5',
                        style: { color: '#f39c12', 'font-size': '14px', 'margin-bottom': '24px' }
                    },
                    createFlex([
                        {
                            type: 'container',
                            style: { width: '40px', height: '40px', background: '#eee', 'border-radius': '50%' }
                        },
                        {
                            type: 'container',
                            components: [
                                { type: 'text', content: t.author, style: { display: 'block', 'font-size': '14px', 'font-weight': '600' } },
                                { type: 'text', content: t.location, style: { display: 'block', 'font-size': '12px', color: '#999' } }
                            ]
                        }
                    ], 'row', 'center', 'flex-start', '12px')
                ], { background: '#f9f9f9', 'box-shadow': 'none', border: 'none', 'border-radius': '24px', padding: '40px' })
            ), 2, '30px')
        ])
    ])
}

/**
 * Contact Section
 */
function createContactSection(): GrapesJSComponent {
    return createSection([
        createContainer([
            createHeading('Schedule a Consult', 2, { 'font-size': '36px', 'margin-bottom': '48px' }),
            createFlex([
                {
                    type: 'container',
                    style: { flex: '0.8', background: '#f9f9f9', padding: '48px', 'border-radius': '24px' },
                    components: [
                        {
                            type: 'container',
                            style: { 'margin-bottom': '32px' },
                            components: [
                                createHeading('Address', 4, { 'font-size': '14px', color: '#999', 'margin-bottom': '8px' }),
                                createParagraph('The Law Office of Thomas Northman\n300 Green St.\nSuite 1300\nSan Francisco, CA 9400', { 'font-size': '14px', margin: '0', 'white-space': 'pre-line' })
                            ]
                        },
                        {
                            type: 'container',
                            style: { 'margin-bottom': '32px' },
                            components: [
                                createHeading('Email', 4, { 'font-size': '14px', color: '#999', 'margin-bottom': '8px' }),
                                createParagraph('tm@thomasnorthman.com', { 'font-size': '14px', margin: '0' })
                            ]
                        },
                        {
                            type: 'container',
                            style: { 'margin-bottom': '32px' },
                            components: [
                                createHeading('Phone', 4, { 'font-size': '14px', color: '#999', 'margin-bottom': '8px' }),
                                createParagraph('(415) 867-7753', { 'font-size': '14px', margin: '0' })
                            ]
                        }
                    ]
                },
                {
                    type: 'container',
                    style: { flex: '1.2' },
                    components: [
                        createGrid([
                            { type: 'input', attributes: { placeholder: 'First Name' }, style: { padding: '16px', border: '1px solid #e0e0e0', 'border-radius': '8px' } },
                            { type: 'input', attributes: { placeholder: 'Last Name' }, style: { padding: '16px', border: '1px solid #e0e0e0', 'border-radius': '8px' } },
                            { type: 'input', attributes: { placeholder: 'Email' }, style: { padding: '16px', border: '1px solid #e0e0e0', 'border-radius': '8px' } },
                            { type: 'input', attributes: { placeholder: 'Phone' }, style: { padding: '16px', border: '1px solid #e0e0e0', 'border-radius': '8px' } }
                        ], 2, '20px'),
                        { type: 'textarea', attributes: { placeholder: 'Please type your message here...', rows: '6' }, style: { width: '100%', padding: '16px', border: '1px solid #e0e0e0', 'border-radius': '8px', 'margin-top': '20px' } },
                        createButton('Send message', '#', { 'background-color': '#00D084', 'margin-top': '24px', width: '100%', 'text-align': 'center' })
                    ]
                }
            ], 'row', 'stretch', 'space-between', '60px')
        ])
    ], { padding: '100px 20px' })
}

/**
 * Footer
 */
function createFooter(): GrapesJSComponent {
    return createSection([
        createContainer([
            {
                type: 'container',
                style: { 'text-align': 'center', 'margin-bottom': '40px' },
                components: [
                    { type: 'text', content: '⚖️', style: { 'font-size': '32px', display: 'block', 'margin-bottom': '12px' } },
                    { type: 'text', content: 'THOMAS NORTHMAN', style: { color: '#ffffff', 'letter-spacing': '2px', 'font-weight': '700' } }
                ]
            },
            createFlex(['About', 'Disputes', 'International', 'Rates & Fees', 'Contact'].map(link => ({
                type: 'link',
                content: link,
                attributes: { href: '#' },
                style: { color: '#666', 'text-decoration': 'none', 'font-size': '14px' }
            })), 'row', 'center', 'center', '40px'),
            createParagraph('copyright 2024 © all rights reserved', { 'text-align': 'center', 'margin-top': '40px', 'font-size': '12px', color: '#333' })
        ])
    ], { 'background-color': '#0d0d0d', padding: '80px 20px' })
}

/**
 * Main Template
 */
export function createLegalTemplate(): TemplateData {
    const pageComponents = [
        createNavbar(),
        createHeroSection(),
        createQuoteSection(),
        createBrandSection(),
        createAboutSection(),
        createTestimonialsSection(),
        createContactSection(),
        createFooter()
    ]

    return {
        name: 'Law & Tax Advisor',
        description: 'A sophisticated, professional template for law firms and tax consultants. Features high-trust hero, testimonial carousels, and complex consult forms.',
        category: 'Legal',
        content: {
            pages: [
                {
                    component: {
                        type: 'wrapper',
                        components: pageComponents,
                        style: { 'font-family': "'Inter', sans-serif" }
                    }
                }
            ],
            styles: [
                { selectors: ['body'], style: { margin: '0', padding: '0', 'font-family': "'Inter', sans-serif" } },
                { selectors: ['*'], style: { 'box-sizing': 'border-box' } }
            ],
            assets: []
        },
        isPublic: true
    }
}
