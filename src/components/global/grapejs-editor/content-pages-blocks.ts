import {
    Users,
    Briefcase,
    Tag,
    HelpCircle,
    Mail,
    FileText,
    Check,
    Plus,
    MessageSquare,
    Globe,
    Shield,
    Zap
} from 'lucide-react'

export const contentPagesTemplates = [
    {
        id: 'cp-about-page',
        label: 'About Us Page',
        icon: Users,
        category: 'content-pages',
        content: `
            <div class="cp-container">
                <style>
                    .cp-container { font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; }
                    .cp-hero { padding: 120px 8%; text-align: center; background: #f8fafc; }
                    .cp-hero-tag { color: #6366f1; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.875rem; margin-bottom: 16px; display: block; }
                    .cp-hero-title { font-size: 4rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 24px; }
                    .cp-hero-desc { font-size: 1.25rem; color: #64748b; max-width: 700px; margin: 0 auto; line-height: 1.6; }
                    
                    .cp-section { padding: 100px 8%; }
                    .cp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
                    .cp-img-placeholder { width: 100%; aspect-ratio: 4/3; background: #e2e8f0; border-radius: 24px; }
                    
                    .cp-stats { display: flex; justify-content: space-around; padding: 60px 8%; background: #0f172a; color: #fff; text-align: center; }
                    .cp-stat-val { font-size: 3rem; font-weight: 800; display: block; margin-bottom: 8px; color: #38bdf8; }
                    .cp-stat-label { font-size: 0.875rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
                    
                    .cp-team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-top: 60px; }
                    .cp-team-card { text-align: center; }
                    .cp-team-img { width: 100%; aspect-ratio: 1; background: #f1f5f9; border-radius: 20px; margin-bottom: 20px; }
                    .cp-team-name { font-size: 1.25rem; font-weight: 700; margin-bottom: 4px; }
                    .cp-team-role { color: #6366f1; font-weight: 600; font-size: 0.9rem; }
                </style>
                <section class="cp-hero">
                    <span class="cp-hero-tag">Our Story</span>
                    <h1 class="cp-hero-title">We're on a mission to redefine the digital landscape.</h1>
                    <p class="cp-hero-desc">Founded in 2018, we've helped hundreds of brands scale through thoughtful design and cutting-edge technology.</p>
                </section>
                <section class="cp-section">
                    <div class="cp-grid-2">
                        <div>
                            <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 24px;">Built by dreamers, <br/>driven by data.</h2>
                            <p style="font-size: 1.125rem; color: #4b5563; line-height: 1.7; margin-bottom: 32px;">We believe that the best products are built at the intersection of human empathy and technical precision. Our team of designers, engineers, and strategists work in sync to bring your vision to life.</p>
                            <div style="display: flex; gap: 20px;">
                                <div style="padding: 20px; background: #f8fafc; border-radius: 12px; flex: 1;">
                                    <h4 style="font-weight: 700; margin-bottom: 8px;">Innovation</h4>
                                    <p style="font-size: 0.9rem; color: #64748b; margin: 0;">Always pushing boundaries and exploring new horizons.</p>
                                </div>
                                <div style="padding: 20px; background: #f8fafc; border-radius: 12px; flex: 1;">
                                    <h4 style="font-weight: 700; margin-bottom: 8px;">Integrity</h4>
                                    <p style="font-size: 0.9rem; color: #64748b; margin: 0;">Transparent processes and honest partnerships.</p>
                                </div>
                            </div>
                        </div>
                        <div class="cp-img-placeholder"></div>
                    </div>
                </section>
                <div class="cp-stats">
                    <div><span class="cp-stat-val">250+</span><span class="cp-stat-label">Projects Delivered</span></div>
                    <div><span class="cp-stat-val">15+</span><span class="cp-stat-label">Industry Awards</span></div>
                    <div><span class="cp-stat-val">98%</span><span class="cp-stat-label">Client Satisfaction</span></div>
                    <div><span class="cp-stat-val">24/7</span><span class="cp-stat-label">Support Available</span></div>
                </div>
                <section class="cp-section">
                    <h2 style="font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 12px;">The Core Team</h2>
                    <p style="text-align: center; color: #64748b; margin-bottom: 60px;">Meet the experts behind your favorite digital experiences.</p>
                    <div class="cp-team-grid">
                        <div class="cp-team-card"><div class="cp-team-img"></div><h3 class="cp-team-name">Marcus Chen</h3><p class="cp-team-role">CEO & Founder</p></div>
                        <div class="cp-team-card"><div class="cp-team-img"></div><h3 class="cp-team-name">Elena Vance</h3><p class="cp-team-role">Creative Director</p></div>
                        <div class="cp-team-card"><div class="cp-team-img"></div><h3 class="cp-team-name">Dave Miller</h3><p class="cp-team-role">CTO</p></div>
                        <div class="cp-team-card"><div class="cp-team-img"></div><h3 class="cp-team-name">Sarah Ross</h3><p class="cp-team-role">Head of Product</p></div>
                    </div>
                </section>
            </div>
        `
    },
    {
        id: 'cp-services-page',
        label: 'Services Page',
        icon: Briefcase,
        category: 'content-pages',
        content: `
            <div class="sv-container">
                <style>
                    .sv-container { font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; }
                    .sv-hero { padding: 100px 8%; text-align: center; }
                    .sv-hero-title { font-size: 3.5rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 24px; }
                    .sv-hero-desc { font-size: 1.25rem; color: #64748b; max-width: 800px; margin: 0 auto; }
                    
                    .sv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; padding: 60px 8%; }
                    .sv-card { padding: 48px; border: 1px solid #f1f5f9; border-radius: 32px; transition: 0.3s; }
                    .sv-card:hover { border-color: #6366f1; transform: translateY(-8px); box-shadow: 0 20px 40px rgba(99, 102, 241, 0.05); }
                    .sv-icon-wrap { width: 64px; height: 64px; background: #f5f3ff; color: #6366f1; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 32px; }
                    .sv-card-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; }
                    .sv-card-list { list-style: none; padding: 0; margin: 0; }
                    .sv-card-list li { margin-bottom: 12px; display: flex; align-items: center; gap: 10px; color: #64748b; font-size: 0.95rem; }
                    
                    .sv-cta { margin: 100px 8%; background: #6366f1; border-radius: 40px; padding: 80px; text-align: center; color: #fff; }
                </style>
                <section class="sv-hero">
                    <h1 class="sv-hero-title">Custom Solutions for <br/> Complex Challenges</h1>
                    <p class="sv-hero-desc">We offer a full suite of digital services designed to help your business thrive in a competitive market.</p>
                </section>
                <div class="sv-grid">
                    <div class="sv-card">
                        <div class="sv-icon-wrap"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
                        <h3 class="sv-card-title">Product Design</h3>
                        <ul class="sv-card-list">
                            <li>UI/UX Design</li>
                            <li>Design Systems</li>
                            <li>User Research</li>
                            <li>Prototyping</li>
                        </ul>
                    </div>
                    <div class="sv-card">
                        <div class="sv-icon-wrap"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></div>
                        <h3 class="sv-card-title">Development</h3>
                        <ul class="sv-card-list">
                            <li>Web Architecture</li>
                            <li>Mobile Apps</li>
                            <li>Cloud Infrastructure</li>
                            <li>API Integration</li>
                        </ul>
                    </div>
                    <div class="sv-card">
                        <div class="sv-icon-wrap"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                        <h3 class="sv-card-title">Growth</h3>
                        <ul class="sv-card-list">
                            <li>SEO Strategy</li>
                            <li>Content Marketing</li>
                            <li>Conversion Optimization</li>
                            <li>Data Analytics</li>
                        </ul>
                    </div>
                </div>
                <section class="sv-cta">
                    <h2 style="font-size: 3rem; font-weight: 800; margin-bottom: 24px;">Have a specific requirement?</h2>
                    <p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 40px;">We love tackling unique problems. Talk to our experts today.</p>
                    <button style="padding: 18px 48px; background: #fff; color: #6366f1; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer;">Schedule a Call</button>
                </section>
            </div>
        `
    },
    {
        id: 'cp-pricing-page',
        label: 'Pricing Page',
        icon: Tag,
        category: 'content-pages',
        content: `
            <div class="pr-container">
                <style>
                    .pr-container { font-family: 'Inter', sans-serif; color: #1e293b; background: #f8fafc; padding: 100px 8%; text-align: center; }
                    .pr-title { font-size: 3.5rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 16px; }
                    .pr-desc { color: #64748b; font-size: 1.125rem; margin-bottom: 60px; }
                    
                    .pr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1200px; margin: 0 auto; text-align: left; }
                    .pr-card { background: #fff; padding: 48px; border-radius: 32px; border: 1px solid #e2e8f0; position: relative; }
                    .pr-card.featured { border: 2px solid #6366f1; box-shadow: 0 40px 80px rgba(99, 102, 241, 0.1); }
                    .pr-badge { position: absolute; top: 24px; right: 24px; background: #6366f1; color: #fff; padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; }
                    
                    .pr-price { font-size: 3rem; font-weight: 800; margin: 24px 0; }
                    .pr-price span { font-size: 1rem; color: #64748b; font-weight: 500; }
                    
                    .pr-features { list-style: none; padding: 0; margin: 32px 0; border-top: 1px solid #f1f5f9; padding-top: 32px; }
                    .pr-features li { margin-bottom: 16px; display: flex; align-items: center; gap: 12px; font-size: 0.95rem; color: #4b5563; }
                    .pr-check { width: 20px; height: 20px; background: #ecfdf5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; }
                    
                    .pr-btn { width: 100%; border: none; border-radius: 14px; padding: 16px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.2s; }
                    .pr-btn.primary { background: #6366f1; color: #fff; }
                    .pr-btn.secondary { background: #f1f5f9; color: #1e293b; }
                    .pr-btn:hover { opacity: 0.9; transform: scale(1.02); }
                </style>
                <h1 class="pr-title">Simple, Tiered Pricing</h1>
                <p class="pr-desc">Choose the plan that fits your business stage. No hidden fees.</p>
                <div class="pr-grid">
                    <div class="pr-card">
                        <h3 style="font-weight: 700; font-size: 1.25rem;">Starter</h3>
                        <p style="color: #64748b; font-size: 0.9rem;">Perfect for small teams.</p>
                        <div class="pr-price">$29<span>/mo</span></div>
                        <button class="pr-btn secondary">Get Started</button>
                        <ul class="pr-features">
                            <li><div class="pr-check">✓</div> 5 Projects</li>
                            <li><div class="pr-check">✓</div> Basic Analytics</li>
                            <li><div class="pr-check">✓</div> Shared Support</li>
                            <li><div class="pr-check">✓</div> 10GB Storage</li>
                        </ul>
                    </div>
                    <div class="pr-card featured">
                        <div class="pr-badge">MOST POPULAR</div>
                        <h3 style="font-weight: 700; font-size: 1.25rem;">Pro</h3>
                        <p style="color: #64748b; font-size: 0.9rem;">Best for scaling startups.</p>
                        <div class="pr-price">$99<span>/mo</span></div>
                        <button class="pr-btn primary">Get Started Pro</button>
                        <ul class="pr-features">
                            <li><div class="pr-check">✓</div> Unlimited Projects</li>
                            <li><div class="pr-check">✓</div> Advanced Analytics</li>
                            <li><div class="pr-check">✓</div> Priority 24/7 Support</li>
                            <li><div class="pr-check">✓</div> 100GB Storage</li>
                            <li><div class="pr-check">✓</div> Custom Domain</li>
                        </ul>
                    </div>
                    <div class="pr-card">
                        <h3 style="font-weight: 700; font-size: 1.25rem;">Enterprise</h3>
                        <p style="color: #64748b; font-size: 0.9rem;">Custom for large orgs.</p>
                        <div class="pr-price">Custom</div>
                        <button class="pr-btn secondary">Contact Sales</button>
                        <ul class="pr-features">
                            <li><div class="pr-check">✓</div> Full Customization</li>
                            <li><div class="pr-check">✓</div> Dedicated Manager</li>
                            <li><div class="pr-check">✓</div> SLA Guarantee</li>
                            <li><div class="pr-check">✓</div> On-premise Option</li>
                        </ul>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'cp-faq-page',
        label: 'FAQ Page',
        icon: HelpCircle,
        category: 'content-pages',
        content: `
            <div class="faq-container">
                <style>
                    .faq-container { font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; padding: 100px 8%; max-width: 900px; margin: 0 auto; }
                    .faq-header { text-align: center; margin-bottom: 80px; }
                    .faq-title { font-size: 3rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 20px; }
                    
                    .faq-item { border-bottom: 1px solid #f1f5f9; padding: 32px 0; }
                    .faq-question { font-size: 1.25rem; font-weight: 700; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
                    .faq-answer { font-size: 1.05rem; color: #64748b; line-height: 1.7; margin-top: 16px; }
                    .faq-icon { color: #6366f1; transition: 0.3s; font-size: 1.5rem; font-weight: 300; }
                </style>
                <div class="faq-header">
                    <h1 class="faq-title">Common Questions</h1>
                    <p style="color: #64748b; font-size: 1.1rem;">Everything you need to know about our process and services.</p>
                </div>
                <div class="faq-list">
                    <div class="faq-item">
                        <div class="faq-question">How does the billing cycle work? <div class="faq-icon">+</div></div>
                        <p class="faq-answer">We bill monthly or annually based on your preference. Subscriptions are automatically renewed at the end of each billing period unless cancelled.</p>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">Can I cancel my subscription anytime? <div class="faq-icon">+</div></div>
                        <p class="faq-answer">Yes, you can cancel your subscription at any time from your account settings. You will maintain access to your plan until the end of the current cycle.</p>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">Do you offer custom enterprise solutions? <div class="faq-icon">+</div></div>
                        <p class="faq-answer">Absolutely. We work with many large organizations to build bespoke platforms that scale. Contact our sales team for a consultation.</p>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question">What kind of support is included? <div class="faq-icon">+</div></div>
                        <p class="faq-answer">All plans include email support. Pro and Enterprise plans also include priority support via live chat and dedicated Slack channels.</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'cp-contact-page',
        label: 'Contact Page',
        icon: Mail,
        category: 'content-pages',
        content: `
            <div class="ct-container">
                <style>
                    .ct-container { font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; display: flex; min-height: 100vh; }
                    .ct-left { flex: 1; padding: 80px 8%; background: #0f172a; color: #fff; }
                    .ct-right { flex: 1.2; padding: 80px 8%; }
                    
                    .ct-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 24px; }
                    .ct-info-item { display: flex; gap: 20px; align-items: center; margin-bottom: 40px; }
                    .ct-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                    
                    .ct-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
                    .ct-input-wrap { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
                    .ct-label { font-weight: 700; font-size: 0.9rem; color: #475569; }
                    .ct-input { padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; font-family: inherit; font-size: 1rem; transition: 0.2s; }
                    .ct-input:focus { border-color: #6366f1; outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
                    
                    .ct-btn { background: #6366f1; color: #fff; border: none; padding: 18px; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; width: 100%; transition: 0.2s; }
                    .ct-btn:hover { background: #4f46e5; }
                </style>
                <div class="ct-left">
                    <h1 class="ct-title">Let's talk.</h1>
                    <p style="font-size: 1.25rem; color: #94a3b8; margin-bottom: 60px;">Have a project in mind or just want to say hi? We'd love to hear from you.</p>
                    <div class="ct-info-item">
                        <div class="ct-icon">📧</div>
                        <div><div style="color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Email</div><strong>hello@example.com</strong></div>
                    </div>
                    <div class="ct-info-item">
                        <div class="ct-icon">📍</div>
                        <div><div style="color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Office</div><strong>123 Digital Ave, San Francisco</strong></div>
                    </div>
                </div>
                <div class="ct-right">
                    <form>
                        <div class="ct-form-row">
                            <div class="ct-input-wrap">
                                <label class="ct-label">First Name</label>
                                <input type="text" class="ct-input" placeholder="John" />
                            </div>
                            <div class="ct-input-wrap">
                                <label class="ct-label">Last Name</label>
                                <input type="text" class="ct-input" placeholder="Doe" />
                            </div>
                        </div>
                        <div class="ct-input-wrap">
                            <label class="ct-label">Work Email</label>
                            <input type="email" class="ct-input" placeholder="john@company.com" />
                        </div>
                        <div class="ct-input-wrap">
                            <label class="ct-label">Phone Number</label>
                            <input type="tel" class="ct-input" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div class="ct-input-wrap">
                            <label class="ct-label">Message</label>
                            <textarea class="ct-input" rows="5" placeholder="Tell us about your project..."></textarea>
                        </div>
                        <button type="button" class="ct-btn">Send Message</button>
                    </form>
                </div>
            </div>
        `
    },
    {
        id: 'cp-case-study',
        label: 'Case Study Page',
        icon: FileText,
        category: 'content-pages',
        content: `
            <div class="cs-container">
                <style>
                    .cs-container { font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; }
                    .cs-hero { padding: 120px 8%; background: #0f172a; color: #fff; text-align: center; }
                    .cs-hero-cat { font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem; margin-bottom: 24px; display: block; }
                    .cs-hero-title { font-size: 4.5rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 24px; line-height: 1.1; }
                    
                    .cs-overview { padding: 100px 8% 60px; display: grid; grid-template-columns: 1fr 300px; gap: 80px; }
                    .cs-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 32px; letter-spacing: -0.02em; }
                    
                    .cs-metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin: 60px 0; }
                    .cs-metric-card { background: #f8fafc; padding: 40px; border-radius: 24px; text-align: center; }
                    .cs-metric-val { font-size: 3rem; font-weight: 800; color: #6366f1; display: block; }
                    .cs-metric-label { font-size: 0.9rem; font-weight: 700; color: #64748b; }
                    
                    .cs-img-large { width: 100%; aspect-ratio: 21/9; background: #e2e8f0; border-radius: 40px; margin: 60px 0; }
                </style>
                <section class="cs-hero">
                    <span class="cs-hero-cat">Fintech Case Study</span>
                    <h1 class="cs-hero-title">Hyperion: Reimagining Digital Banking for Gen-Z.</h1>
                    <div style="display: flex; justify-content: center; gap: 40px; margin-top: 60px;">
                        <div><div style="font-size: 0.8rem; color: #94a3b8; font-weight: 700;">YEAR</div><strong>2023</strong></div>
                        <div><div style="font-size: 0.8rem; color: #94a3b8; font-weight: 700;">SERVICES</div><strong>Product, App Dev</strong></div>
                        <div><div style="font-size: 0.8rem; color: #94a3b8; font-weight: 700;">CLIENT</div><strong>Hyperion Bank Ltd</strong></div>
                    </div>
                </section>
                <main class="cs-overview">
                    <article>
                        <h2 class="cs-title">The Challenge</h2>
                        <p style="font-size: 1.25rem; line-height: 1.6; color: #475569; margin-bottom: 40px;">How do you make a traditional banking institution appeal to a generation that values speed, transparency, and aesthetics over legacy?</p>
                        <p style="font-size: 1.125rem; line-height: 1.8; color: #64748b;">Hyperion's existing platform was clunky and feature-heavy. Our goal was to strip back the noise and create a focused experience that turns financial management from a chore into a delight.</p>
                        
                        <div class="cs-metric-grid">
                            <div class="cs-metric-card"><span class="cs-metric-val">+240%</span><span class="cs-metric-label">User Engagement</span></div>
                            <div class="cs-metric-card"><span class="cs-metric-val">1.2M</span><span class="cs-metric-label">Active Users</span></div>
                            <div class="cs-metric-card"><span class="cs-metric-val">4.9</span><span class="cs-metric-label">App Store Rating</span></div>
                        </div>
                        
                        <h2 class="cs-title">The Solution</h2>
                        <p style="font-size: 1.125rem; line-height: 1.8; color: #64748b; margin-bottom: 40px;">We implemented a modular UI component library that allowed for 100% dynamic personalization. Every user receives a unique dashboard based on their spending habits and financial goals.</p>
                        <div class="cs-img-large"></div>
                    </article>
                    <aside>
                        <div style="position: sticky; top: 120px; background: #f8fafc; padding: 40px; border-radius: 24px;">
                            <h4 style="font-weight: 800; margin-bottom: 20px;">Role</h4>
                            <p style="line-height: 1.6; color: #64748b; margin-bottom: 40px;">Full-cycle product design, user testing, and frontend engineering.</p>
                            <h4 style="font-weight: 800; margin-bottom: 20px;">Technologies</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                <span style="background: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700;">React Native</span>
                                <span style="background: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700;">Elixir</span>
                                <span style="background: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700;">AWS</span>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        `
    }
]
