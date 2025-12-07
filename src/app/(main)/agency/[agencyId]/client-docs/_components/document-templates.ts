// Document templates with pre-filled content
export const DOCUMENT_TEMPLATES = [
    {
        id: 'agreement',
        name: 'Service Agreement',
        type: 'AGREEMENT',
        description: 'Professional service agreement template',
        icon: '📄',
        content: {
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
                        text: 'This Service Agreement ("Agreement") is entered into as of [Date] by and between:'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Parties',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: [
                            '<b>Service Provider:</b> [Your Company Name]',
                            '<b>Client:</b> [Client Name]'
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Scope of Services',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'The Service Provider agrees to provide the following services:'
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'ordered',
                        items: [
                            '[Service 1]',
                            '[Service 2]',
                            '[Service 3]'
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Terms and Conditions',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: '[Add your terms and conditions here]'
                    }
                }
            ]
        }
    },
    {
        id: 'welcome',
        name: 'Welcome Letter',
        type: 'WELCOME',
        description: 'Welcome new clients with a friendly introduction',
        icon: '👋',
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Welcome to [Your Company]!',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'Dear [Client Name],'
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'We\'re thrilled to have you on board! This letter will help you get started with our services and understand what to expect.'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'What Happens Next?',
                        level: 2
                    }
                },
                {
                    type: 'checklist',
                    data: {
                        items: [
                            { text: 'Review and sign the service agreement', checked: false },
                            { text: 'Complete the onboarding questionnaire', checked: false },
                            { text: 'Schedule your kickoff call', checked: false }
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Your Team',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: '[Introduce your team members here]'
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'We look forward to working with you!'
                    }
                }
            ]
        }
    },
    {
        id: 'invoice',
        name: 'Invoice',
        type: 'INVOICE',
        description: 'Professional invoice template',
        icon: '💰',
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
                        text: '<b>Invoice #:</b> [INV-001]<br><b>Date:</b> [Date]<br><b>Due Date:</b> [Due Date]'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Bill To',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: '[Client Name]<br>[Client Address]<br>[Client Email]'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Services Rendered',
                        level: 2
                    }
                },
                {
                    type: 'table',
                    data: {
                        withHeadings: true,
                        content: [
                            ['Service', 'Quantity', 'Rate', 'Amount'],
                            ['[Service Description]', '1', '$0.00', '$0.00'],
                            ['', '', '<b>Total:</b>', '<b>$0.00</b>']
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Payment Terms',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'Payment is due within [X] days of invoice date.'
                    }
                }
            ]
        }
    },
    {
        id: 'strategy',
        name: 'Strategy Call Notes',
        type: 'STRATEGY_CALL',
        description: 'Document strategy call discussions',
        icon: '🎯',
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Strategy Call Notes',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: '<b>Date:</b> [Date]<br><b>Client:</b> [Client Name]<br><b>Attendees:</b> [Names]'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Discussion Points',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: [
                            '[Point 1]',
                            '[Point 2]',
                            '[Point 3]'
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Action Items',
                        level: 2
                    }
                },
                {
                    type: 'checklist',
                    data: {
                        items: [
                            { text: '[Action item 1]', checked: false },
                            { text: '[Action item 2]', checked: false }
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Next Steps',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: '[Outline next steps here]'
                    }
                }
            ]
        }
    },
    {
        id: 'monthly-report',
        name: 'Monthly Report',
        type: 'MONTHLY_REPORT',
        description: 'Monthly performance report template',
        icon: '📊',
        content: {
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Monthly Report - [Month Year]',
                        level: 1
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: '<b>Client:</b> [Client Name]<br><b>Period:</b> [Date Range]'
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
                        text: '[Brief overview of the month\'s performance]'
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Key Metrics',
                        level: 2
                    }
                },
                {
                    type: 'table',
                    data: {
                        withHeadings: true,
                        content: [
                            ['Metric', 'This Month', 'Last Month', 'Change'],
                            ['[Metric 1]', '0', '0', '0%'],
                            ['[Metric 2]', '0', '0', '0%']
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Accomplishments',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'unordered',
                        items: [
                            '[Accomplishment 1]',
                            '[Accomplishment 2]'
                        ]
                    }
                },
                {
                    type: 'header',
                    data: {
                        text: 'Next Month Goals',
                        level: 2
                    }
                },
                {
                    type: 'list',
                    data: {
                        style: 'ordered',
                        items: [
                            '[Goal 1]',
                            '[Goal 2]'
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
        icon: '📝',
        content: {
            blocks: []
        }
    }
]
