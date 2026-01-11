/**
 * Renewable Energy Template (Xurya-inspired)
 * A premium template for renewable energy and sustainable technology companies
 */

import {
    createSection,
    createContainer,
    createHeading,
    createParagraph,
    createButton,
    createCard,
    createGrid,
    createGlassCard,
    createFlex,
    GrapesJSComponent,
    TemplateData,
    createImage
} from './template-helpers'

/**
 * Navbar Section
 */
function createNavbar(): GrapesJSComponent {
    return {
        type: 'container',
        style: {
            display: 'flex',
            'justify-content': 'space-between',
            'align-items': 'center',
            padding: '20px 40px',
            background: '#ffffff',
            'border-bottom': '1px solid #f0f0f0'
        },
        components: [
            {
                type: 'text',
                content: 'Xurya',
                style: { 'font-size': '24px', 'font-weight': '800', color: '#0A3D3D' }
            },
            {
                type: 'container',
                style: { display: 'flex', gap: '30px' },
                components: ['Home', 'About Us', 'Features', 'Services', 'Contact'].map(link => ({
                    type: 'link',
                    content: link,
                    attributes: { href: '#' },
                    style: { 'text-decoration': 'none', color: '#666', 'font-size': '14px' }
                }))
            },
            {
                type: 'container',
                style: { display: 'flex', gap: '15px' },
                components: [
                    {
                        type: 'link',
                        content: 'Login',
                        attributes: { href: '#' },
                        style: { padding: '10px 20px', 'text-decoration': 'none', color: '#666', 'font-size': '14px' }
                    },
                    createButton('Get in Touch', '#', {
                        'background-color': '#00D084',
                        padding: '10px 24px',
                        'font-size': '14px'
                    })
                ]
            }
        ]
    }
}

/**
 * Hero Section
 */
function createHeroSection(): GrapesJSComponent {
    return createSection([
        {
            type: 'container',
            style: {
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://images.unsplash.com/photo-1466611653911-954ff2131404?q=80&w=2070&auto=format&fit=crop")',
                'background-size': 'cover',
                'background-position': 'center',
                'border-radius': '32px',
                padding: '120px 60px',
                position: 'relative',
                overflow: 'hidden'
            },
            components: [
                createFlex([
                    {
                        type: 'container',
                        style: { flex: '1' },
                        components: [
                            createParagraph('#1 Energy provider in the World', {
                                color: 'rgba(255,255,255,0.8)',
                                'font-size': '16px',
                                'margin-bottom': '12px'
                            }),
                            createHeading('New Energy for the Future', 1, {
                                color: '#ffffff',
                                'font-size': '72px',
                                'margin-bottom': '32px',
                                'line-height': '1'
                            }),
                            createFlex([
                                createButton('Get in touch →', '#', { 'background-color': '#00D084' }),
                                {
                                    type: 'link',
                                    content: 'Our services ↗',
                                    attributes: { href: '#' },
                                    style: { color: '#ffffff', 'text-decoration': 'none', 'font-weight': '600' }
                                }
                            ], 'row', 'center', 'flex-start', '30px')
                        ]
                    },
                    {
                        type: 'container',
                        style: { flex: '0.4', display: 'flex', 'justify-content': 'flex-end', 'align-items': 'center' },
                        components: [
                            createGlassCard([
                                {
                                    type: 'text',
                                    content: '▶',
                                    style: {
                                        width: '60px',
                                        height: '60px',
                                        background: '#00D084',
                                        'border-radius': '50%',
                                        display: 'flex',
                                        'align-items': 'center',
                                        'justify-content': 'center',
                                        color: '#ffffff',
                                        margin: '0 auto 16px',
                                        'font-size': '24px'
                                    }
                                },
                                createParagraph('Discover Our Recent Project', {
                                    color: '#ffffff',
                                    'text-align': 'center',
                                    margin: '0'
                                })
                            ], 'rgba(0,0,0,0.4)')
                        ]
                    }
                ])
            ]
        },
        createContainer([
            createFlex([
                { value: '6 mil', label: "The company's annual net income" },
                { value: '315', label: "Projects completed worldwide" },
                { value: '120K', label: "Employees work in all parts of the world" }
            ].map(stat => ({
                type: 'container',
                style: { flex: '1', 'text-align': 'center', padding: '40px 0' },
                components: [
                    createHeading(stat.value, 2, { 'font-size': '48px', margin: '0 0 8px 0', color: '#1a1a1a' }),
                    createParagraph(stat.label, { margin: '0', color: '#666', 'font-size': '14px' })
                ]
            })), 'row', 'center', 'space-between', '0')
        ])
    ], { padding: '40px 20px' })
}

/**
 * Trust Section
 */
function createTrustSection(): GrapesJSComponent {
    const logos = ['LOGO 1', 'LOGO 2', 'LOGO 3', 'LOGO 4', 'LOGO 5']
    return createSection([
        createContainer([
            createFlex([
                createHeading('Focusing on quality, we maintain customer trust', 2, {
                    'font-size': '36px',
                    'max-width': '400px',
                    margin: '0'
                }),
                createParagraph('We ensure that every installation we build has strict quality checks. Sustainable solutions for an environmentally friendly and renewable future.', {
                    'max-width': '500px',
                    margin: '0',
                    'font-size': '16px'
                })
            ], 'row', 'center', 'space-between', '40px'),
            {
                type: 'container',
                style: { 'margin-top': '60px' },
                components: [
                    createFlex(logos.map(logo => ({
                        type: 'container',
                        style: {
                            width: '120px',
                            height: '120px',
                            background: '#f8f9fa',
                            'border-radius': '50%',
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                            color: '#ccc',
                            'font-weight': 'bold',
                            'font-size': '12px'
                        },
                        content: logo
                    })), 'row', 'center', 'space-between')
                ]
            }
        ])
    ], { 'background-color': '#ffffff', padding: '100px 20px' })
}

/**
 * Materials Section
 */
function createMaterialsSection(): GrapesJSComponent {
    const items = [
        { title: 'Layered security', desc: 'With panel security we ensure the best of every unit we deliver' },
        { title: 'Quality control of each part', desc: 'Every unit we send is checked carefully for every detail' },
        { title: 'Reliable customer service', desc: 'Our customer service is available 24/7' },
        { title: 'Maintenance manual book', desc: 'We provide manual book that can be used for the next maintenance' },
        { title: 'Delivered safely', desc: 'Every unit we send arrives safely and quickly without any obstacles.' },
        { title: 'Based on artificial intelligence', desc: 'The products we produce are based on AI so as to optimize energy output.' }
    ]

    return createSection([
        createContainer([
            createHeading('We offer quality, with the best materials and service', 2, {
                'text-align': 'center',
                'font-size': '42px',
                'margin-bottom': '60px',
                'max-width': '700px',
                margin: '0 auto 60px'
            }),
            createGrid(items.map(item =>
                createCard([
                    {
                        type: 'text',
                        content: '●',
                        style: { color: '#00D084', 'font-size': '24px', 'margin-bottom': '16px' }
                    },
                    createHeading(item.title, 3, { 'font-size': '20px', 'margin-bottom': '12px' }),
                    createParagraph(item.desc, { 'font-size': '14px', margin: '0' })
                ], { 'box-shadow': 'none', border: '1px solid #f0f0f0', 'border-radius': '24px' })
            ), 3, '24px')
        ])
    ], { 'background-color': '#f8f9fa', padding: '100px 20px' })
}

/**
 * Solutions Section
 */
function createSolutionsSection(): GrapesJSComponent {
    const solutions = [
        { num: '01', title: 'Solar panels for home' },
        { num: '02', title: 'Solar panels for industry' },
        { num: '03', title: 'Solar panels for chargers' },
        { num: '04', title: 'Windpower generator' }
    ]

    return createSection([
        createContainer([
            createFlex([
                {
                    type: 'container',
                    style: { flex: '1' },
                    components: [
                        createHeading('Trusted service, for your various needs', 2, {
                            'font-size': '48px',
                            'margin-bottom': '24px'
                        }),
                        createButton('Get in touch →', '#', { 'background-color': '#00D084', 'margin-bottom': '48px' }),
                        createGrid(solutions.map(sol =>
                            createCard([
                                createParagraph(sol.num, { color: '#666', margin: '0 0 8px 0' }),
                                createHeading(sol.title, 3, { 'font-size': '18px', margin: '0 0 8px 0' }),
                                {
                                    type: 'link',
                                    content: 'View Details',
                                    attributes: { href: '#' },
                                    style: { 'font-size': '12px', color: '#666', 'text-decoration': 'underline' }
                                }
                            ], { padding: '24px', 'box-shadow': 'none', border: '1px solid #f0f0f0', 'border-radius': '16px' })
                        ), 2, '20px')
                    ]
                },
                {
                    type: 'container',
                    style: { flex: '1' },
                    components: [
                        createImage('https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2070&auto=format&fit=crop', 'Solutions', {
                            'border-radius': '32px',
                            'min-height': '600px',
                            'object-fit': 'cover'
                        })
                    ]
                }
            ], 'row', 'stretch', 'space-between', '60px')
        ])
    ], { padding: '100px 20px' })
}

/**
 * Case Study Section
 */
function createCaseStudySection(): GrapesJSComponent {
    return createSection([
        createContainer([
            createHeading('See how we solve problems, right on target', 2, {
                'text-align': 'center',
                'font-size': '42px',
                'margin-bottom': '60px'
            }),
            {
                type: 'container',
                style: {
                    background: '#f8f9fa',
                    'border-radius': '32px',
                    padding: '60px',
                    display: 'flex',
                    gap: '40px',
                    'align-items': 'center'
                },
                components: [
                    {
                        type: 'container',
                        style: { flex: '1' },
                        components: [
                            createHeading('Medtronic', 3, { margin: '0 0 24px 0' }),
                            createParagraph('"We have used services from Xurya for most of our stations, this is our strategic step to continue to increase the number of solar panel usage for our stations, we are very satisfied with the services from Xurya"', {
                                'font-size': '18px',
                                'line-height': '1.6',
                                color: '#1a1a1a',
                                'font-style': 'italic',
                                'margin-bottom': '32px'
                            }),
                            createButton('View Case Study', '#', { 'background-color': '#00D084', 'font-size': '14px' }),
                            {
                                type: 'text',
                                content: 'Jennifer Kostov – CEO of Medtronic',
                                style: { display: 'block', 'margin-top': '24px', 'font-size': '14px', color: '#666' }
                            }
                        ]
                    },
                    {
                        type: 'container',
                        style: { flex: '1.2' },
                        components: [
                            createImage('https://images.unsplash.com/photo-1508514177221-188b1cc16467?q=80&w=2070&auto=format&fit=crop', 'Case Study', {
                                'border-radius': '24px'
                            })
                        ]
                    }
                ]
            }
        ])
    ], { padding: '100px 20px' })
}

/**
 * Footer CTA Section
 */
function createFooterCTASection(): GrapesJSComponent {
    return createSection([
        createContainer([
            createFlex([
                {
                    type: 'container',
                    style: { flex: '1' },
                    components: [
                        createHeading("It's time to support zero pollution, with renewable resources", 2, { color: '#ffffff', 'font-size': '42px' }),
                        createFlex([
                            { type: 'text', content: '● Experienced for more than 12 years', style: { color: 'rgba(255,255,255,0.7)', 'font-size': '14px' } },
                            { type: 'text', content: '● Support for the latest technology', style: { color: 'rgba(255,255,255,0.7)', 'font-size': '14px' } }
                        ], 'row', 'center', 'flex-start', '30px')
                    ]
                },
                createButton('Get in Touch →', '#', { 'background-color': '#ffffff', color: '#000000', padding: '18px 40px' })
            ], 'row', 'center', 'space-between', '60px')
        ])
    ], { 'background-color': '#000000', padding: '100px 20px' })
}

/**
 * Main Footer
 */
function createMainFooter(): GrapesJSComponent {
    return createSection([
        createContainer([
            createFlex([
                {
                    type: 'text',
                    content: 'Xurya',
                    style: { 'font-size': '20px', 'font-weight': '800', color: '#ffffff' }
                },
                createFlex(['Home', 'About Us', 'Features', 'Services', 'Contact'].map(link => ({
                    type: 'link',
                    content: link,
                    attributes: { href: '#' },
                    style: { color: 'rgba(255,255,255,0.5)', 'text-decoration': 'none', 'font-size': '14px' }
                })), 'row', 'center', 'center', '30px'),
                createFlex(['in', 'f', 't', 'ig'].map(icon => ({
                    type: 'container',
                    style: {
                        width: '32px',
                        height: '32px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        'border-radius': '50%',
                        display: 'flex',
                        'align-items': 'center',
                        'justify-content': 'center',
                        color: '#ffffff',
                        'font-size': '12px'
                    },
                    content: icon
                })), 'row', 'center', 'flex-end', '12px')
            ], 'row', 'center', 'space-between', '40px'),
            {
                type: 'container',
                style: { 'margin-top': '60px', 'padding-top': '30px', 'border-top': '1px solid rgba(255,255,255,0.1)', display: 'flex', 'justify-content': 'space-between' },
                components: [
                    createParagraph('© 2024 Xurya Inc. All rights reserved.', { color: 'rgba(255,255,255,0.3)', 'font-size': '12px', margin: '0' }),
                    createFlex(['Terms of Service', 'Privacy Policy'].map(p => ({
                        type: 'link',
                        content: p,
                        attributes: { href: '#' },
                        style: { color: 'rgba(255,255,255,0.3)', 'font-size': '12px', 'text-decoration': 'none' }
                    })))
                ]
            }
        ])
    ], { 'background-color': '#000000', padding: '40px 20px' })
}

/**
 * Complete Renewable Energy Template
 */
export function createRenewableEnergyTemplate(): TemplateData {
    const pageComponents = [
        createNavbar(),
        createHeroSection(),
        createTrustSection(),
        createMaterialsSection(),
        createSolutionsSection(),
        createCaseStudySection(),
        createFooterCTASection(),
        createMainFooter()
    ]

    return {
        name: 'Renewable Future',
        description: 'A professional, modern template for energy and sustainability brands. Features high-impact hero, grid services, split solution layouts, and case studies.',
        category: 'Sustainability',
        content: {
            pages: [
                {
                    component: {
                        type: 'wrapper',
                        components: pageComponents,
                        style: {
                            'font-family': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                        }
                    }
                }
            ],
            styles: [
                {
                    selectors: ['body'],
                    style: { margin: '0', padding: '0', 'font-family': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }
                },
                {
                    selectors: ['*'],
                    style: { 'box-sizing': 'border-box' }
                }
            ],
            assets: []
        },
        isPublic: true
    }
}
