/**
 * Manufacturing Excellence Template
 * A modern, professional template for manufacturing and technology companies
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
    TemplateData
} from './template-helpers'

/**
 * Hero Section with Stats Cards
 */
function createHeroSection(): GrapesJSComponent {
    const statsCards = [
        { value: '100+', label: 'Projects Completed', color: '#0A3D3D' },
        { value: '1851+', label: 'Happy Clients', color: '#E8F5E9' },
        { value: '6+', label: 'Years Experience', color: '#E8F5E9' },
        { value: '24/7', label: 'Support Available', color: '#0A3D3D' }
    ]

    const statsComponents = statsCards.map(stat =>
        createGlassCard([
            createHeading(stat.value, 2, {
                'font-size': '36px',
                'font-weight': '700',
                color: stat.color === '#0A3D3D' ? '#ffffff' : '#0A3D3D',
                margin: '0 0 8px 0'
            }),
            createParagraph(stat.label, {
                'font-size': '14px',
                color: stat.color === '#0A3D3D' ? 'rgba(255,255,255,0.8)' : '#666',
                margin: '0'
            })
        ], stat.color)
    )

    return createSection([
        createContainer([
            createFlex([
                {
                    type: 'container',
                    components: [
                        createHeading('The Future of Manufacturing with Latest Technology', 1, {
                            'font-size': '56px',
                            'line-height': '1.1',
                            color: '#1a1a1a',
                            'margin-bottom': '24px'
                        }),
                        createParagraph(
                            'Transform your production process with cutting-edge technology and innovative solutions designed for modern manufacturing excellence.',
                            {
                                'font-size': '18px',
                                'line-height': '1.8',
                                color: '#666',
                                'margin-bottom': '32px',
                                'max-width': '600px'
                            }
                        ),
                        createButton('Get Started', '#', {
                            'background-color': '#0A3D3D',
                            'padding': '16px 40px',
                            'font-size': '18px'
                        })
                    ],
                    style: {
                        flex: '1',
                        'min-width': '300px'
                    }
                },
                {
                    type: 'container',
                    components: [
                        createGrid(statsComponents, 2, '20px')
                    ],
                    style: {
                        flex: '1',
                        'min-width': '300px'
                    }
                }
            ], 'row', 'center', 'space-between', '60px')
        ])
    ], {
        'background-color': '#ffffff',
        'padding': '100px 20px'
    })
}

/**
 * Services Grid Section
 */
function createServicesSection(): GrapesJSComponent {
    const services = [
        {
            icon: '⚙️',
            title: 'Precision-Driven Assembly',
            description: 'Advanced automated assembly lines with quality control at every step'
        },
        {
            icon: '🏭',
            title: 'Custom Manufacturing',
            description: 'Tailored production solutions to meet your specific requirements'
        },
        {
            icon: '✓',
            title: 'Quality Control',
            description: 'Rigorous testing and inspection processes ensuring excellence'
        },
        {
            icon: '💡',
            title: 'Technological Innovation',
            description: 'Cutting-edge technology integration for optimal efficiency'
        },
        {
            icon: '📦',
            title: 'Redesigned Logistics',
            description: 'Streamlined supply chain management and delivery systems'
        },
        {
            icon: '📊',
            title: 'Consulting/Market Research',
            description: 'Expert insights and data-driven market analysis'
        }
    ]

    const serviceCards = services.map(service =>
        createCard([
            {
                type: 'text',
                content: service.icon,
                style: {
                    'font-size': '40px',
                    'margin-bottom': '16px',
                    display: 'block'
                }
            },
            createHeading(service.title, 3, {
                'font-size': '20px',
                color: '#ffffff',
                'margin-bottom': '12px'
            }),
            createParagraph(service.description, {
                'font-size': '14px',
                color: 'rgba(255,255,255,0.8)',
                margin: '0'
            })
        ], {
            'background-color': 'rgba(255,255,255,0.05)',
            'backdrop-filter': 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        })
    )

    return createSection([
        createContainer([
            createHeading('Efficient and Integrated Manufacturing Services', 2, {
                'font-size': '42px',
                color: '#ffffff',
                'text-align': 'center',
                'margin-bottom': '60px'
            }),
            createGrid(serviceCards, 3, '30px')
        ])
    ], {
        'background-color': '#0A3D3D',
        'padding': '100px 20px'
    })
}

/**
 * Benefits Section with Chart
 */
function createBenefitsSection(): GrapesJSComponent {
    const benefits = [
        'Seamlessly integrate with tools',
        'Optimized production processes',
        'AI-Driven Predictions',
        'Real-time monitoring'
    ]

    const benefitsList = benefits.map(benefit =>
        createFlex([
            {
                type: 'text',
                content: '✓',
                style: {
                    'font-size': '20px',
                    color: '#0A3D3D',
                    'font-weight': '700'
                }
            },
            createParagraph(benefit, {
                'font-size': '16px',
                color: '#333',
                margin: '0'
            })
        ], 'row', 'center', 'flex-start', '12px')
    )

    return createSection([
        createContainer([
            createHeading('Key Benefits of Our System for Your Business Efficiency', 2, {
                'font-size': '42px',
                color: '#1a1a1a',
                'margin-bottom': '60px'
            }),
            createFlex([
                {
                    type: 'container',
                    components: [
                        // Placeholder for chart visualization
                        {
                            type: 'container',
                            components: [
                                createHeading('1851+', 2, {
                                    'font-size': '48px',
                                    color: '#0A3D3D',
                                    margin: '0 0 8px 0'
                                }),
                                createParagraph('Successful Projects', {
                                    'font-size': '16px',
                                    color: '#666'
                                })
                            ],
                            style: {
                                padding: '40px',
                                'background-color': '#f8f9fa',
                                'border-radius': '12px',
                                'text-align': 'center'
                            }
                        }
                    ],
                    style: {
                        flex: '1',
                        'min-width': '300px'
                    }
                },
                {
                    type: 'container',
                    components: benefitsList,
                    style: {
                        flex: '1',
                        'min-width': '300px',
                        display: 'flex',
                        'flex-direction': 'column',
                        gap: '20px'
                    }
                }
            ], 'row', 'center', 'space-between', '60px')
        ])
    ], {
        'background-color': '#ffffff',
        'padding': '100px 20px'
    })
}

/**
 * Pricing Section
 */
function createPricingSection(): GrapesJSComponent {
    const plans = [
        {
            name: 'Starter',
            price: '$299',
            period: '/month',
            features: [
                'Up to 10 projects',
                'Basic analytics',
                'Email support',
                '5GB storage'
            ],
            featured: false
        },
        {
            name: 'Professional',
            price: '$599',
            period: '/month',
            features: [
                'Unlimited projects',
                'Advanced analytics',
                'Priority support',
                '50GB storage',
                'API access',
                'Custom integrations'
            ],
            featured: true
        }
    ]

    const pricingCards = plans.map(plan =>
        createCard([
            createHeading(plan.name, 3, {
                'font-size': '24px',
                color: plan.featured ? '#ffffff' : '#1a1a1a',
                'margin-bottom': '16px'
            }),
            createFlex([
                createHeading(plan.price, 2, {
                    'font-size': '48px',
                    color: plan.featured ? '#ffffff' : '#0A3D3D',
                    margin: '0'
                }),
                createParagraph(plan.period, {
                    'font-size': '18px',
                    color: plan.featured ? 'rgba(255,255,255,0.7)' : '#666',
                    margin: '0'
                })
            ], 'row', 'baseline', 'flex-start', '8px'),
            {
                type: 'container',
                components: plan.features.map(feature =>
                    createParagraph(`• ${feature}`, {
                        'font-size': '14px',
                        color: plan.featured ? 'rgba(255,255,255,0.9)' : '#666',
                        'margin-bottom': '12px'
                    })
                ),
                style: {
                    'margin-top': '30px',
                    'margin-bottom': '30px'
                }
            },
            createButton('Get Started', '#', {
                'background-color': plan.featured ? '#ffffff' : '#0A3D3D',
                color: plan.featured ? '#0A3D3D' : '#ffffff',
                width: '100%',
                'text-align': 'center'
            })
        ], {
            'background': plan.featured
                ? 'linear-gradient(135deg, #0A3D3D 0%, #0A5555 100%)'
                : '#ffffff',
            border: plan.featured ? 'none' : '1px solid #e0e0e0',
            transform: plan.featured ? 'scale(1.05)' : 'scale(1)',
            'z-index': plan.featured ? '10' : '1'
        })
    )

    return createSection([
        createContainer([
            createHeading('Tailored Plans for Your Manufacturing Scale', 2, {
                'font-size': '42px',
                color: '#ffffff',
                'text-align': 'center',
                'margin-bottom': '20px'
            }),
            createParagraph('Choose the perfect plan to accelerate your production', {
                'font-size': '18px',
                color: 'rgba(255,255,255,0.8)',
                'text-align': 'center',
                'margin-bottom': '60px'
            }),
            createGrid(pricingCards, 2, '40px')
        ])
    ], {
        'background-color': '#1a1a1a',
        'padding': '100px 20px'
    })
}

/**
 * Integration Showcase Section
 */
function createIntegrationSection(): GrapesJSComponent {
    return createSection([
        createContainer([
            createHeading('Empowering Top Companies with Seamless Integrations', 2, {
                'font-size': '42px',
                color: '#0A3D3D',
                'text-align': 'center',
                'margin-bottom': '60px'
            }),
            {
                type: 'container',
                components: [
                    createParagraph('Connect with 100+ industry-leading platforms', {
                        'font-size': '18px',
                        color: '#666',
                        'text-align': 'center'
                    })
                ],
                style: {
                    padding: '60px 20px',
                    'background-color': 'rgba(10, 61, 61, 0.05)',
                    'border-radius': '16px'
                }
            }
        ])
    ], {
        'background-color': '#E8F5E9',
        'padding': '100px 20px'
    })
}

/**
 * Final CTA Section
 */
function createFinalCTASection(): GrapesJSComponent {
    return createSection([
        createContainer([
            createHeading('From Idea to Production in Days', 2, {
                'font-size': '48px',
                color: '#ffffff',
                'text-align': 'center',
                'margin-bottom': '24px'
            }),
            createParagraph('Start your manufacturing transformation today', {
                'font-size': '18px',
                color: 'rgba(255,255,255,0.8)',
                'text-align': 'center',
                'margin-bottom': '40px'
            }),
            {
                type: 'container',
                components: [
                    createButton('Get Started Now', '#', {
                        'background-color': '#E8F5E9',
                        color: '#0A3D3D',
                        'padding': '18px 48px',
                        'font-size': '18px'
                    })
                ],
                style: {
                    'text-align': 'center'
                }
            }
        ])
    ], {
        'background-color': '#0A3D3D',
        'padding': '100px 20px'
    })
}

/**
 * Footer Section
 */
function createFooterSection(): GrapesJSComponent {
    const footerLinks = {
        Company: ['About Us', 'Careers', 'Press', 'Contact'],
        Solutions: ['Manufacturing', 'Logistics', 'Quality Control', 'Analytics'],
        Support: ['Help Center', 'Documentation', 'API Reference', 'Community'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance']
    }

    const linkColumns = Object.entries(footerLinks).map(([title, links]) => ({
        type: 'container',
        components: [
            createHeading(title, 4, {
                'font-size': '16px',
                color: '#ffffff',
                'margin-bottom': '20px'
            }),
            ...links.map(link => ({
                type: 'link',
                attributes: { href: '#' },
                content: link,
                style: {
                    display: 'block',
                    color: 'rgba(255,255,255,0.7)',
                    'text-decoration': 'none',
                    'font-size': '14px',
                    'margin-bottom': '12px',
                    transition: 'color 0.3s ease'
                }
            }))
        ],
        style: {
            flex: '1',
            'min-width': '200px'
        }
    }))

    return createSection([
        createContainer([
            createFlex(linkColumns, 'row', 'flex-start', 'space-between', '40px'),
            {
                type: 'container',
                components: [
                    createParagraph('© 2026 Manufacturing Excellence. All rights reserved.', {
                        'font-size': '14px',
                        color: 'rgba(255,255,255,0.5)',
                        'text-align': 'center',
                        margin: '0'
                    })
                ],
                style: {
                    'margin-top': '60px',
                    'padding-top': '30px',
                    'border-top': '1px solid rgba(255,255,255,0.1)'
                }
            }
        ])
    ], {
        'background-color': '#0A3D3D',
        'padding': '80px 20px 40px'
    })
}

/**
 * Complete Manufacturing Template
 */
export function createManufacturingTemplate(): TemplateData {
    const pageComponents = [
        createHeroSection(),
        createServicesSection(),
        createBenefitsSection(),
        createPricingSection(),
        createIntegrationSection(),
        createFinalCTASection(),
        createFooterSection()
    ]

    return {
        name: 'Manufacturing Excellence',
        description: 'A modern, professional template for manufacturing and technology companies. Features hero section with stats, services grid, benefits showcase, pricing plans, and more.',
        category: 'Business',
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
                    style: {
                        margin: '0',
                        padding: '0',
                        'font-family': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                    }
                },
                {
                    selectors: ['*'],
                    style: {
                        'box-sizing': 'border-box'
                    }
                }
            ],
            assets: []
        },
        isPublic: true
    }
}
