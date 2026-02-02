// Document templates with pre-filled content
export const DOCUMENT_TEMPLATES = [
    {
        id: 'agreement',
        name: 'Service Agreement',
        type: 'AGREEMENT',
        description: 'Professional service agreement template',
        icon: 'FileText',
        color: '#3b82f6', // blue
        content: {
            // ... content remains the same
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Service Agreement',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'This Service Agreement ("Agreement") is entered into as of <b>[Date]</b> by and between:'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: '1. The Parties',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: [
                            '<b>Service Provider:</b> [Your Company Name], a company registered in [Country/State], with its principal place of business at [Your Address].',
                            '<b>Client:</b> [Client Name], an individual/entity with its principal place of business at [Client Address].'
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: '2. Scope of Services',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'The Service Provider agrees to perform the following services for the Client (the "Services"): '
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'ordered',
                        items: [
                            'Complete website audit and competitor analysis.',
                            'Development of a custom digital marketing strategy.',
                            'On-page SEO optimization for 10 target keywords.',
                            'Creation and management of monthly content calendar.',
                            'Fortnightly performance reporting and strategy adjustment.'
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: '3. Fees and Payment',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'In consideration for the Services, the Client shall pay the Service Provider the following fees:'
                    }
                },
                {
                    type: 'table',
                    data: {
                        withHeadings: true,
                        content: [
                            ['Service Component', 'Quantity', 'Rate', 'Amount'],
                            ['Initial Strategy & Setup', '1', '$1,500.00', '$1,500.00'],
                            ['Monthly Management Fee', '1', '$2,000.00', '$2,000.00'],
                            ['<b>Total Initial Payment</b>', '', '', '<b>$3,500.00</b>']
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: '4. Confidentiality',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'The Service Provider acknowledges that they may have access to confidential info of the Client. The Service Provider agrees to maintain the strict confidentiality of all such information and not to disclose it to any third party without the Client\'s prior written consent.'
                    }
                }
            ]
        }
    },
    {
        id: 'onboarding',
        name: 'Client Onboarding Guide',
        type: 'WELCOME',
        description: 'Comprehensive guide for new clients',
        icon: 'Rocket',
        color: '#10b981', // green
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Welcome to [Your Agency Name]!',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'We are excited to partner with you and help your business grow. This guide will walk you through our process and what you can expect in the first 30 days.'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Phase 1: Discovery (Days 1-7)',
                        level: 2
                    }
                },
                {
                    type: 'checklist',
                    data: {
                        items: [
                            { text: 'Complete the Onboarding Questionnaire', checked: true },
                            { text: 'Provide access to Google Analytics & Search Console', checked: false },
                            { text: 'Schedule a discovery kickoff call', checked: false },
                            { text: 'Review and approve project timeline', checked: false }
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Phase 2: Strategy (Days 8-21)',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'During this phase, we will deep dive into your business and competitors to create a winning strategy. We will present our findings for your feedback and approval.'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Communication Tools',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: [
                            '<b>Slack:</b> For quick day-to-day communication.',
                            '<b>ClickUp:</b> For project management and task tracking.',
                            '<b>Zoom:</b> For scheduled meetings and strategy calls.',
                            '<b>Email:</b> For formal approvals and documentation.'
                        ]
                    }
                }
            ]
        }
    },
    {
        id: 'marketing-report',
        name: 'Growth Performance Report',
        type: 'MONTHLY_REPORT',
        description: 'Detailed monthly performance and growth analysis',
        icon: 'TrendingUp',
        color: '#8b5cf6', // violet
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Monthly Growth Report',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: '<b>Report Date:</b> October 1, 2023<br><b>Client:</b> [Client Name]<br><b>Reporting Period:</b> September 2023'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Executive Summary',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'September was a strong month for [Client Name], with significant growth in organic traffic and lead conversion rates. We successfully launched the new PPC campaign which is already showing positive ROI.'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Performance Metrics',
                        level: 2
                    }
                },
                {
                    type: 'table',
                    data: {
                        withHeadings: true,
                        content: [
                            ['Metric', 'Target', 'Actual', 'Performance'],
                            ['Website Sessions', '25,000', '28,450', '+13.8%'],
                            ['Conversions', '500', '582', '+16.4%'],
                            ['Cost per lead', '$45.00', '$38.50', '-14.4%'],
                            ['SEO Visibility', '15%', '18.2%', '+3.2%']
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Key Wins This Month',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: [
                            'Ranking #1 for the primary keyword "[Keyword]".',
                            'Reduction in bounce rate from 65% to 48%.',
                            'Successful integration of new lead magnet on the homepage.',
                            'Achieved record-high open rates (32%) on the weekly newsletter.'
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Next Month Priorities',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'ordered',
                        items: [
                            'A/B testing the high-converting landing pages.',
                            'Expanding the content strategy to include Video Marketing.',
                            'Launching the Q4 seasonal campaign prep.',
                            'Setting up advanced remarketing pixels for paid traffic.'
                        ]
                    }
                }
            ]
        }
    },
    {
        id: 'marketing-proposal',
        name: 'Marketing Strategy Proposal',
        type: 'CUSTOM',
        description: 'Comprehensive marketing strategy and proposal',
        icon: 'Target',
        color: '#f59e0b', // amber
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Digital Marketing Strategy & Proposal',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'Prepared for: <b>[Client Name]</b><br>Prepared by: <b>[Your Agency]</b><br>Date: [Current Date]'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: '1. Executive Summary',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'Our objective is to increase [Client Name]\'s digital footprint and drive meaningful ROI through a multi-channel approach. Based on our preliminary research, we see significant room for growth in [Specific Niche].'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: '2. Target Audience & Personas',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: [
                            '<b>Persona A:</b> [Description of primary target].',
                            '<b>Persona B:</b> [Description of secondary target].'
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: '3. Strategic Roadmap',
                        level: 2
                    }
                },
                {
                    type: 'table',
                    data: {
                        withHeadings: true,
                        content: [
                            ['Phase', 'Focus', 'Timeline', 'Deliverables'],
                            ['Phase 1', 'Foundations & SEO', 'Month 1', 'Audit, Keyword Strategy'],
                            ['Phase 2', 'Content & Social', 'Month 2', 'Blog Content, Social Growth'],
                            ['Phase 3', 'Paid Acquisition', 'Month 3', 'Google Ads, Meta Ads']
                        ]
                    }
                }
            ]
        }
    },
    {
        id: 'project-plan',
        name: 'Website Project Plan',
        type: 'CUSTOM',
        description: 'Detailed roadmap for website development projects',
        icon: 'Layout',
        color: '#06b6d4', // cyan
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Website Development Project Plan',
                        level: 1
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Project Overview',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'This document outlines the timeline and milestones for the redesign and development of [Project URL].'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Key Milestones',
                        level: 2
                    }
                },
                {
                    type: 'checklist',
                    data: {
                        items: [
                            { text: 'Wireframe Approval', checked: false },
                            { text: 'Final Design Sign-off', checked: false },
                            { text: 'Development Phase 1 (Frontend)', checked: false },
                            { text: 'Content Integration', checked: false },
                            { text: 'QA & Testing', checked: false },
                            { text: 'Launch!', checked: false }
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Technical Requirements',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: [
                            'Responsive design (Mobile, Tablet, Desktop).',
                            'CMS Integration (WordPress/Next.js).',
                            'Email marketing integration.',
                            'SEO-ready structure.'
                        ]
                    }
                }
            ]
        }
    },
    {
        id: 'competitor-analysis',
        name: 'Competitor Analysis',
        type: 'COMPETITOR_ANALYSIS',
        description: 'Detailed analysis of market competitors',
        icon: 'Search',
        color: '#ec4899', // pink
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Competitor Market Analysis',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'This report provides a comprehensive look at your top 3 competitors, their strengths, weaknesses, and where we have opportunities to outperform them.'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Competitive Landscape',
                        level: 2
                    }
                },
                {
                    type: 'table',
                    data: {
                        withHeadings: true,
                        content: [
                            ['Feature', 'You', 'Comp A', 'Comp B'],
                            ['Market Share', 'Medium', 'High', 'Medium'],
                            ['Pricing', 'Premium', 'Low', 'Value'],
                            ['UI/UX', 'Modern', 'Outdated', 'Average'],
                            ['Customer Support', '24/7', 'Business Hours', 'Email-only']
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Our Opportunity Strategy',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'Based on our findings, we should focus on highlighting our 24/7 customer support and superior UI/UX, as these are significant weaknesses for Competitor A.'
                    }
                }
            ]
        }
    },
    {
        id: 'invoice',
        name: 'Premium Invoice',
        type: 'INVOICE',
        description: 'Professional invoice with detailed breakdown',
        icon: 'CreditCard',
        color: '#6366f1', // indigo
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Invoice',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: '<b>Invoice Number:</b> INV-2023-001<br><b>Issue Date:</b> October 2, 2023<br><b>Due Date:</b> October 16, 2023'
                    }
                },
                {
                    type: 'table',
                    data: {
                        withHeadings: true,
                        content: [
                            ['Description', 'Quantity', 'Price', 'Total'],
                            ['Website Design Phase 1', '1', '$2,500.00', '$2,500.00'],
                            ['Logo Branding Package', '1', '$1,200.00', '$1,200.00'],
                            ['Domain & Hosting (1yr)', '1', '$250.00', '$250.00'],
                            ['<b>Subtotal</b>', '', '', '$3,950.00'],
                            ['Tax (10%)', '', '', '$395.00'],
                            ['<b>Total Due</b>', '', '', '<b>$4,345.00</b>']
                        ]
                    }
                }
            ]
        }
    },
    {
        id: 'blank',
        name: 'Blank Document',
        type: 'CUSTOM',
        description: 'Start from scratch',
        icon: 'Plus',
        color: '#64748b', // slate
        content: {
            blocks: []
        }
    }
]
