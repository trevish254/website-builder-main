import {
    Building2,
    Users,
    Zap,
    Scale,
    Cpu,
    Briefcase,
    Globe,
    BarChart3,
    Shield,
    Megaphone
} from 'lucide-react'

export const businessWebsiteTemplates = [
    {
        id: 'bw-corporate',
        label: 'Corporate Company',
        icon: Building2,
        category: 'business-websites',
        content: `
            <div class="bw-container">
                <style>
                    .bw-container { font-family: 'Inter', sans-serif; color: #1a1a1a; background: #fff; line-height: 1.6; }
                    .bw-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 8%; background: #fff; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 100; }
                    .bw-logo { font-size: 1.5rem; font-weight: 800; color: #000; letter-spacing: -0.02em; }
                    .bw-nav { display: flex; gap: 40px; }
                    .bw-nav a { text-decoration: none; color: #444; font-weight: 500; font-size: 0.95rem; transition: color 0.2s; }
                    .bw-nav a:hover { color: #000; }
                    .bw-cta { background: #000; color: #fff; padding: 12px 24px; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
                    
                    .bw-hero { padding: 120px 8%; background: #fcfcfc; display: flex; align-items: center; min-height: 80vh; }
                    .bw-hero-content { max-width: 700px; }
                    .bw-hero-label { font-weight: 700; color: #666; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; display: block; }
                    .bw-hero-title { font-size: 4.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 32px; letter-spacing: -0.03em; }
                    .bw-hero-desc { font-size: 1.25rem; color: #555; margin-bottom: 48px; max-width: 580px; }
                    .bw-btn-group { display: flex; gap: 20px; }
                    .bw-btn-primary { background: #000; color: #fff; padding: 16px 36px; border-radius: 4px; font-weight: 700; text-decoration: none; }
                    .bw-btn-secondary { border: 1px solid #ddd; color: #000; padding: 16px 36px; border-radius: 4px; font-weight: 700; text-decoration: none; }
                    
                    .bw-stats { padding: 100px 8%; background: #fff; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; text-align: center; }
                    .bw-stat-item { display: flex; flex-direction: column; gap: 8px; }
                    .bw-stat-num { font-size: 3rem; font-weight: 800; color: #000; }
                    .bw-stat-label { font-size: 0.9rem; color: #666; font-weight: 500; text-transform: uppercase; }
                    
                    .bw-services { padding: 120px 8%; background: #f9f9f9; }
                    .bw-section-header { text-align: center; margin-bottom: 80px; }
                    .bw-section-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; }
                    .bw-section-desc { font-size: 1.1rem; color: #666; max-width: 600px; margin: 0 auto; }
                    .bw-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
                    .bw-card { background: #fff; padding: 48px; border-radius: 8px; border: 1px solid #eee; transition: transform 0.3s, box-shadow 0.3s; }
                    .bw-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
                    .bw-card-icon { width: 48px; height: 48px; background: #f0f0f0; border-radius: 4px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
                    .bw-card-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 16px; }
                    .bw-card-desc { font-size: 0.95rem; color: #666; line-height: 1.7; }
                    
                    .bw-footer { padding: 100px 8% 60px; background: #000; color: #fff; }
                    .bw-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 80px; margin-bottom: 80px; }
                    .bw-footer-logo { font-size: 1.5rem; font-weight: 800; margin-bottom: 24px; display: block; }
                    .bw-footer-about { color: #999; max-width: 320px; line-height: 1.8; }
                    .bw-footer-title { font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 32px; display: block; color: #fff; }
                    .bw-footer-links { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 16px; }
                    .bw-footer-links a { text-decoration: none; color: #999; transition: color 0.2s; }
                    .bw-footer-links a:hover { color: #fff; }
                    .bw-copyright { border-top: 1px solid #222; padding-top: 40px; color: #666; font-size: 0.85rem; display: flex; justify-content: space-between; }
                </style>
                <header class="bw-header">
                    <div class="bw-logo">GLOBAL.CORP</div>
                    <nav class="bw-nav">
                        <a href="#">Solutions</a>
                        <a href="#">Industries</a>
                        <a href="#">Resources</a>
                        <a href="#">Company</a>
                    </nav>
                    <a href="#" class="bw-cta">Work with us</a>
                </header>
                <section class="bw-hero">
                    <div class="bw-hero-content">
                        <span class="bw-hero-label">Established 1994</span>
                        <h1 class="bw-hero-title">Shaping the future of global enterprise.</h1>
                        <p class="bw-hero-desc">We provide the infrastructure and expertise that powers the world's most successful organizations through innovation and strategic growth.</p>
                        <div class="bw-btn-group">
                            <a href="#" class="bw-btn-primary">Our Solutions</a>
                            <a href="#" class="bw-btn-secondary">View Case Studies</a>
                        </div>
                    </div>
                </section>
                <section class="bw-stats">
                    <div class="bw-stat-item">
                        <span class="bw-stat-num">500+</span>
                        <span class="bw-stat-label">Clients Worldwide</span>
                    </div>
                    <div class="bw-stat-item">
                        <span class="bw-stat-num">$12B+</span>
                        <span class="bw-stat-label">Capital Managed</span>
                    </div>
                    <div class="bw-stat-item">
                        <span class="bw-stat-num">24/7</span>
                        <span class="bw-stat-label">Global Support</span>
                    </div>
                    <div class="bw-stat-item">
                        <span class="bw-stat-num">15yr</span>
                        <span class="bw-stat-label">Market Leader</span>
                    </div>
                </section>
                <section class="bw-services">
                    <div class="bw-section-header">
                        <h2 class="bw-section-title">Comprehensive Solutions</h2>
                        <p class="bw-section-desc">Our integrated approach delivers measurable results across every aspect of your business operations.</p>
                    </div>
                    <div class="bw-grid">
                        <div class="bw-card">
                            <div class="bw-card-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>
                            <h3 class="bw-card-title">Strategic Finance</h3>
                            <p class="bw-card-desc">Advanced financial modeling and capital allocation strategies designed for sustainable long-term growth.</p>
                        </div>
                        <div class="bw-card">
                            <div class="bw-card-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10v10H7z"/></svg>
                            </div>
                            <h3 class="bw-card-title">Digital Transformation</h3>
                            <p class="bw-card-desc">Modernizing legacy systems and implementing AI-driven processes to increase operational efficiency.</p>
                        </div>
                        <div class="bw-card">
                            <div class="bw-card-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/><path d="M11 13H5a2 2 0 0 0-2 2v2"/><path d="M11 21v-8"/><path d="M21 15v-2a2 2 0 0 0-2-2H5"/><path d="M21 21v-2a2 2 0 0 0-2-2"/></svg>
                            </div>
                            <h3 class="bw-card-title">Enterprise Logistics</h3>
                            <p class="bw-card-desc">Optimizing global supply chains with real-time tracking and intelligent data-driven distribution.</p>
                        </div>
                    </div>
                </section>
                <footer class="bw-footer">
                    <div class="bw-footer-grid">
                        <div>
                            <span class="bw-footer-logo">GLOBAL.CORP</span>
                            <p class="bw-footer-about">Providing world-class strategic advisory and infrastructure since 1994. Headquartered in London with offices in New York, Tokyo, and Dubai.</p>
                        </div>
                        <div>
                            <span class="bw-footer-title">Solutions</span>
                            <ul class="bw-footer-links">
                                <li><a href="#">Strategic Finance</a></li>
                                <li><a href="#">Digital Systems</a></li>
                                <li><a href="#">Operations</a></li>
                                <li><a href="#">Technology</a></li>
                            </ul>
                        </div>
                        <div>
                            <span class="bw-footer-title">Company</span>
                            <ul class="bw-footer-links">
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Our Team</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Governance</a></li>
                            </ul>
                        </div>
                        <div>
                            <span class="bw-footer-title">Support</span>
                            <ul class="bw-footer-links">
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Partners</a></li>
                                <li><a href="#">Legal</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="bw-copyright">
                        <span>© 2024 Global Corp International. All rights reserved.</span>
                        <span>Privacy Policy · Terms of Service · Cookies</span>
                    </div>
                </footer>
            </div>
        `
    },
    {
        id: 'bw-agency',
        label: 'Digital Agency',
        icon: Zap,
        category: 'business-websites',
        content: `
            <div class="agency-container">
                <style>
                    .agency-container { font-family: 'Outfit', sans-serif; color: #000; background: #fff; line-height: 1.5; }
                    .agn-header { border-bottom: 1px solid #000; padding: 24px 5%; display: flex; justify-content: space-between; align-items: center; }
                    .agn-logo { font-size: 1.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
                    .agn-nav { display: flex; gap: 40px; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; }
                    .agn-nav a { text-decoration: none; color: #000; }
                    .agn-contact { border: 2px solid #000; padding: 10px 24px; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; text-decoration: none; color: #000; }
                    
                    .agn-hero { padding: 120px 5%; border-bottom: 1px solid #000; }
                    .agn-hero-title { font-size: 9rem; font-weight: 900; line-height: 0.9; text-transform: uppercase; letter-spacing: -0.04em; margin-bottom: 40px; }
                    .agn-hero-flex { display: flex; justify-content: space-between; align-items: flex-end; }
                    .agn-hero-desc { font-size: 1.5rem; max-width: 500px; font-weight: 500; }
                    .agn-scroll { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                    
                    .agn-work { padding: 0; display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #000; }
                    .agn-work-item { border-right: 1px solid #000; padding: 80px 10%; min-height: 600px; display: flex; flex-direction: column; justify-content: space-between; transition: background 0.4s; }
                    .agn-work-item:last-child { border-right: none; }
                    .agn-work-item:hover { background: #f5f5f5; }
                    .agn-work-cat { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #666; margin-bottom: 20px; display: block; }
                    .agn-work-title { font-size: 3rem; font-weight: 800; line-height: 1; margin-bottom: 24px; }
                    .agn-work-img { background: #eee; height: 350px; width: 100%; border-radius: 4px; overflow: hidden; position: relative; }
                    .agn-work-img::after { content: 'Project Preview'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #999; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; }
                    
                    .agn-services { padding: 120px 5%; border-bottom: 1px solid #000; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
                    .agn-svc-left h2 { font-size: 4rem; font-weight: 800; line-height: 1; text-transform: uppercase; margin-bottom: 40px; }
                    .agn-svc-item { border-top: 1px solid #000; padding: 32px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
                    .agn-svc-item:last-child { border-bottom: 1px solid #000; }
                    .agn-svc-name { font-size: 1.5rem; font-weight: 700; text-transform: uppercase; }
                    .agn-svc-arrow { font-size: 1.5rem; font-weight: 400; }
                    
                    .agn-footer { padding: 120px 5%; display: flex; flex-direction: column; align-items: center; text-align: center; }
                    .agn-footer-title { font-size: 6rem; font-weight: 900; line-height: 1; text-transform: uppercase; margin-bottom: 60px; }
                    .agn-footer-email { font-size: 2rem; font-weight: 700; text-decoration: underline; color: #000; margin-bottom: 80px; }
                    .agn-footer-bottom { width: 100%; border-top: 1px solid #000; padding-top: 40px; display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                </style>
                <header class="agn-header">
                    <div class="agn-logo">STUDIO.X</div>
                    <nav class="agn-nav">
                        <a href="#">Work</a>
                        <a href="#">Services</a>
                        <a href="#">About</a>
                        <a href="#">Journal</a>
                    </nav>
                    <a href="#" class="agn-contact">Start a Project</a>
                </header>
                <section class="agn-hero">
                    <h1 class="agn-hero-title">Bolder<br/>Digital<br/>Design.</h1>
                    <div class="agn-hero-flex">
                        <p class="agn-hero-desc">An independent design & development studio building highly immersive digital experiences for global brands.</p>
                        <span class="agn-scroll">Scroll to explore ↘</span>
                    </div>
                </section>
                <section class="agn-work">
                    <div class="agn-work-item">
                        <div>
                            <span class="agn-work-cat">Branding / Web</span>
                            <h3 class="agn-work-title">The New Era of Sustainable Fashion</h3>
                        </div>
                        <div class="agn-work-img"></div>
                    </div>
                    <div class="agn-work-item">
                        <div>
                            <span class="agn-work-cat">Product / Identity</span>
                            <h3 class="agn-work-title">Re-imagining Modern Banking</h3>
                        </div>
                        <div class="agn-work-img"></div>
                    </div>
                </section>
                <section class="agn-services">
                    <div class="agn-svc-left">
                        <h2>What we<br/>excel at.</h2>
                    </div>
                    <div class="agn-svc-right">
                        <div class="agn-svc-item">
                            <span class="agn-svc-name">Digital Strategy</span>
                            <span class="agn-svc-arrow">→</span>
                        </div>
                        <div class="agn-svc-item">
                            <span class="agn-svc-name">UX Design</span>
                            <span class="agn-svc-arrow">→</span>
                        </div>
                        <div class="agn-svc-item">
                            <span class="agn-svc-name">E-commerce</span>
                            <span class="agn-svc-arrow">→</span>
                        </div>
                        <div class="agn-svc-item">
                            <span class="agn-svc-name">Content Strategy</span>
                            <span class="agn-svc-arrow">→</span>
                        </div>
                    </div>
                </section>
                <footer class="agn-footer">
                    <h2 class="agn-footer-title">Let's create<br/>something great.</h2>
                    <a href="mailto:hello@studiox.com" class="agn-footer-email">hello@studiox.com</a>
                    <div class="agn-footer-bottom">
                        <span>© 2024 Studio X. All rights reserved.</span>
                        <span>Twitter / Instagram / LinkedIn</span>
                        <span>Built in Berlin</span>
                    </div>
                </footer>
            </div>
        `
    },
    {
        id: 'bw-marketing',
        label: 'Marketing Agency',
        icon: Megaphone,
        category: 'business-websites',
        content: `
            <div class="market-container">
                <style>
                    .market-container { font-family: 'Inter', sans-serif; color: #0f172a; background: #fff; line-height: 1.5; }
                    .mkt-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; background: #fff; position: sticky; top: 0; z-index: 50; }
                    .mkt-logo { font-size: 1.5rem; font-weight: 800; color: #4f46e5; }
                    .mkt-nav { display: flex; gap: 32px; }
                    .mkt-nav a { text-decoration: none; color: #64748b; font-weight: 500; font-size: 0.9375rem; }
                    .mkt-nav a:hover { color: #4f46e5; }
                    .mkt-cta { background: #4f46e5; color: #fff; padding: 12px 24px; border-radius: 99px; font-weight: 600; text-decoration: none; font-size: 0.9375rem; }
                    
                    .mkt-hero { padding: 80px 5% 100px; text-align: center; background: radial-gradient(circle at top right, #eef2ff 0%, #fff 50%); }
                    .mkt-hero-label { background: #eef2ff; color: #4f46e5; padding: 6px 16px; border-radius: 99px; font-size: 0.8125rem; font-weight: 700; margin-bottom: 24px; display: inline-block; }
                    .mkt-hero-title { font-size: 3.75rem; font-weight: 800; line-height: 1.2; color: #0f172a; margin-bottom: 24px; letter-spacing: -0.02em; }
                    .mkt-hero-title span { color: #4f46e5; }
                    .mkt-hero-desc { font-size: 1.125rem; color: #64748b; max-width: 680px; margin: 0 auto 40px; }
                    
                    .mkt-logos { padding: 40px 5%; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: center; gap: 60px; filter: grayscale(1); opacity: 0.6; }
                    .mkt-logo-item { font-weight: 700; font-size: 1.25rem; color: #94a3b8; }
                    
                    .mkt-grid { padding: 100px 5%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
                    .mkt-card { background: #fff; padding: 32px; border-radius: 20px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01); }
                    .mkt-card-icon { width: 48px; height: 48px; background: #eef2ff; color: #4f46e5; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                    .mkt-card-title { font-weight: 700; font-size: 1.25rem; }
                    .mkt-card-desc { color: #64748b; font-size: 0.9375rem; line-height: 1.6; }
                    
                    .mkt-cta-section { margin: 60px 5%; padding: 80px; background: #4f46e5; border-radius: 32px; text-align: center; color: #fff; }
                    .mkt-cta-title { font-size: 3rem; font-weight: 800; margin-bottom: 24px; }
                    .mkt-cta-desc { font-size: 1.125rem; opacity: 0.9; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto; }
                    .mkt-cta-btn { background: #fff; color: #4f46e5; padding: 16px 32px; border-radius: 99px; font-weight: 700; text-decoration: none; }
                </style>
                <header class="mkt-header">
                    <div class="mkt-logo">UPWARD</div>
                    <nav class="mkt-nav">
                        <a href="#">Services</a>
                        <a href="#">Case Studies</a>
                        <a href="#">Resources</a>
                        <a href="#">About</a>
                    </nav>
                    <a href="#" class="mkt-cta">Book a Call</a>
                </header>
                <section class="mkt-hero">
                    <span class="mkt-hero-label">Over 200+ companies reached</span>
                    <h1 class="mkt-hero-title">Dominate your niche with <span>Performance</span> marketing.</h1>
                    <p class="mkt-hero-desc">We use data-driven insights and creative storytelling to high-growth brands scale their revenue through multi-channel marketing campaigns.</p>
                    <a href="#" class="mkt-cta" style="padding: 16px 32px; font-size: 1rem;">View Our Work</a>
                </section>
                <div class="mkt-logos">
                    <div class="mkt-logo-item">VELOCITY</div>
                    <div class="mkt-logo-item">STORM</div>
                    <div class="mkt-logo-item">HORIZON</div>
                    <div class="mkt-logo-item">COBALT</div>
                    <div class="mkt-logo-item">NEXUS</div>
                </div>
                <section class="mkt-grid">
                    <div class="mkt-card">
                        <div class="mkt-card-icon">1</div>
                        <h3 class="mkt-card-title">Paid Acquisition</h3>
                        <p class="mkt-card-desc">Scale your revenue with profitable campaigns across Facebook, Google, and TikTok.</p>
                    </div>
                    <div class="mkt-card">
                        <div class="mkt-card-icon">2</div>
                        <h3 class="mkt-card-title">SEO & Content</h3>
                        <p class="mkt-card-desc">Build a long-term organic engine that drives high-intent traffic to your website daily.</p>
                    </div>
                    <div class="mkt-card">
                        <div class="mkt-card-icon">3</div>
                        <h3 class="mkt-card-title">CRM & Email</h3>
                        <p class="mkt-card-desc">Maximize your customer LTV with automated lifecycle marketing and personalized messaging.</p>
                    </div>
                </section>
                <section class="mkt-cta-section">
                    <h2 class="mkt-cta-title">Ready to grow?</h2>
                    <p class="mkt-cta-desc">Let's audit your current marketing stack and build a roadmap for your next $10M in revenue.</p>
                    <a href="#" class="mkt-cta-btn">Start My Free Audit</a>
                </section>
            </div>
        `
    },
    {
        id: 'bw-consulting',
        label: 'Consulting Firm',
        icon: Scale,
        category: 'business-websites',
        content: `
            <div class="cons-container">
                <style>
                    .cons-container { font-family: 'Lora', serif; color: #1a1a1a; background: #fff; line-height: 1.7; }
                    .cns-header { display: flex; justify-content: space-between; align-items: center; padding: 40px 8%; background: #fff; }
                    .cns-logo { font-size: 1.25rem; font-weight: 700; color: #0f172a; font-family: 'Inter', sans-serif; letter-spacing: 0.2em; text-transform: uppercase; }
                    .cns-nav { display: flex; gap: 48px; font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; }
                    .cns-nav a { text-decoration: none; color: #666; }
                    
                    .cns-hero { padding: 120px 8%; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
                    .cns-hero-label { font-family: 'Inter', sans-serif; font-weight: 600; color: #999; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 24px; display: block; }
                    .cns-hero-title { font-size: 3.5rem; font-weight: 500; line-height: 1.2; margin-bottom: 32px; color: #000; }
                    .cns-hero-desc { font-size: 1.25rem; color: #444; margin-bottom: 48px; font-style: italic; }
                    .cns-hero-img { background: #f5f5f5; height: 500px; border-radius: 2px; }
                    
                    .cns-services { padding: 120px 8%; background: #0f172a; color: #fff; }
                    .cns-svc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 60px 100px; }
                    .cns-svc-item { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 40px; }
                    .cns-svc-title { font-size: 1.75rem; font-weight: 500; margin-bottom: 16px; font-family: 'Lora', serif; }
                    .cns-svc-text { font-family: 'Inter', sans-serif; color: #94a3b8; font-size: 1rem; line-height: 1.8; }
                    
                    .cns-quote { padding: 140px 15%; text-align: center; background: #fff; }
                    .cns-quote-text { font-size: 2.25rem; font-weight: 500; line-height: 1.5; color: #000; margin-bottom: 40px; }
                    .cns-quote-author { font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.9rem; }
                    
                    .cns-footer { padding: 80px 8%; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; font-family: 'Inter', sans-serif; font-size: 0.8rem; color: #666; }
                </style>
                <header class="cns-header">
                    <div class="cns-logo">SYNERGY.ADVISORY</div>
                    <nav class="cns-nav">
                        <a href="#">Expertise</a>
                        <a href="#">Perspectives</a>
                        <a href="#">Philosophy</a>
                        <a href="#">Contact</a>
                    </nav>
                </header>
                <section class="cns-hero">
                    <div class="cns-hero-content">
                        <span class="cns-hero-label">Management Consultants</span>
                        <h1 class="cns-hero-title">Navigating complexity with clarity and precision.</h1>
                        <p class="cns-hero-desc">"We partner with leaders to solve their most critical challenges and capture their greatest opportunities."</p>
                        <a href="#" style="font-family: 'Inter', sans-serif; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #000; text-decoration: none; border-bottom: 2px solid #000; padding-bottom: 4px;">Learn more about our approach</a>
                    </div>
                    <div class="cns-hero-img"></div>
                </section>
                <section class="cns-services">
                    <div class="cns-svc-grid">
                        <div class="cns-svc-item">
                            <h3 class="cns-svc-title">Operational Excellence</h3>
                            <p class="cns-svc-text">We streamline operations to maximize efficiency without compromising the quality of your core product or service.</p>
                        </div>
                        <div class="cns-svc-item">
                            <h3 class="cns-svc-title">Growth Strategy</h3>
                            <p class="cns-svc-text">Identifying new market opportunities and building robust roadmaps for competitive differentiation.</p>
                        </div>
                        <div class="cns-svc-item">
                            <h3 class="cns-svc-title">Mergers & Acquisitions</h3>
                            <p class="cns-svc-text">Strategic due diligence and post-merger integration services to ensure long-term value creation.</p>
                        </div>
                        <div class="cns-svc-item">
                            <h3 class="cns-svc-title">Leadership Advisory</h3>
                            <p class="cns-svc-text">Providing the executive coaching and organizational design needed to build world-class teams.</p>
                        </div>
                    </div>
                </section>
                <section class="cns-quote">
                    <p class="cns-quote-text">"Strategy without execution is the slow road to victory. Execution without strategy is the noise before defeat."</p>
                    <span class="cns-quote-author">— Sun Tzu, Strategic Foundations</span>
                </section>
                <footer class="cns-footer">
                    <span>© 2024 Synergy Advisory Group.</span>
                    <span>London · New York · Singapore · Zurich</span>
                </footer>
            </div>
        `
    },
    {
        id: 'bw-tech',
        label: 'Tech Company',
        icon: Cpu,
        category: 'business-websites',
        content: `
            <div class="tech-container">
                <style>
                    .tech-container { font-family: 'Inter', sans-serif; color: #fff; background: #050505; line-height: 1.5; }
                    .tch-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 5%; border-bottom: 1px solid rgba(255,255,255,0.05); }
                    .tch-logo { font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, #0ea5e9, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                    .tch-nav { display: flex; gap: 32px; }
                    .tch-nav a { text-decoration: none; color: #888; font-weight: 500; transition: color 0.2s; }
                    .tch-nav a:hover { color: #fff; }
                    .tch-cta { background: #fff; color: #000; padding: 10px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; }
                    
                    .tch-hero { padding: 120px 5%; position: relative; overflow: hidden; height: 90vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
                    .tch-hero-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 800px; height: 400px; background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%); filter: blur(60px); pointer-events: none; }
                    .tch-hero-title { font-size: 6rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 24px; line-height: 1; }
                    .tch-hero-desc { font-size: 1.25rem; color: #888; max-width: 600px; margin-bottom: 48px; }
                    
                    .tch-grid { padding: 100px 5%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
                    .tch-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; transition: background 0.3s; }
                    .tch-card:hover { background: rgba(255,255,255,0.05); }
                    .tch-card-icon { width: 40px; height: 40px; color: #0ea5e9; margin-bottom: 24px; }
                    .tch-card-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; }
                    .tch-card-desc { font-size: 0.9rem; color: #666; }
                    
                    .tch-feature { padding: 120px 5%; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center; }
                    .tch-feat-content h2 { font-size: 3rem; font-weight: 800; margin-bottom: 24px; }
                    .tch-feat-list { list-style: none; padding: 0; }
                    .tch-feat-item { display: flex; gap: 16px; margin-bottom: 24px; }
                    .tch-feat-item span { color: #0ea5e9; font-weight: 800; }
                    .tch-feat-img { background: linear-gradient(135deg, #111, #222); height: 400px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); }
                </style>
                <header class="tch-header">
                    <div class="tch-logo">QUANTUM.IO</div>
                    <nav class="tch-nav">
                        <a href="#">Platform</a>
                        <a href="#">Network</a>
                        <a href="#">Developers</a>
                        <a href="#">Docs</a>
                    </nav>
                    <a href="#" class="tch-cta">Get Started</a>
                </header>
                <section class="tch-hero">
                    <div class="tch-hero-glow"></div>
                    <h1 class="tch-hero-title">The Next Era of<br/>Distributed Computing.</h1>
                    <p class="tch-hero-desc">Scaling infrastructure for the decentralized web with unparalleled speed, security, and developer experience.</p>
                    <div style="display: flex; gap: 16px;">
                        <a href="#" class="tch-cta" style="background: #0ea5e9; color: #fff; padding: 16px 32px;">Deploy Now</a>
                        <a href="#" class="tch-cta" style="background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 16px 32px;">Read Documention</a>
                    </div>
                </section>
                <section class="tch-grid">
                    <div class="tch-card">
                        <div class="tch-card-icon">01</div>
                        <h3 class="tch-card-title">0ms Latency</h3>
                        <p class="tch-card-desc">Edge nodes distributed globally for instant response times.</p>
                    </div>
                    <div class="tch-card">
                        <div class="tch-card-icon">02</div>
                        <h3 class="tch-card-title">AI Powered</h3>
                        <p class="tch-card-desc">Automated resource scaling using machine learning.</p>
                    </div>
                    <div class="tch-card">
                        <div class="tch-card-icon">03</div>
                        <h3 class="tch-card-title">Secured by Design</h3>
                        <p class="tch-card-desc">End-to-end encryption for all enterprise data.</p>
                    </div>
                    <div class="tch-card">
                        <div class="tch-card-icon">04</div>
                        <h3 class="tch-card-title">Open Source</h3>
                        <p class="tch-card-desc">Built in public with a global community of devs.</p>
                    </div>
                </section>
            </div>
        `
    },
    {
        id: 'bw-finance',
        label: 'Finance Business',
        icon: Shield,
        category: 'business-websites',
        content: `
            <div class="fin-container">
                <style>
                    .fin-container { font-family: 'Inter', sans-serif; color: #020617; background: #fff; line-height: 1.6; }
                    .fin-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 8%; border-bottom: 1px solid #f1f5f9; }
                    .fin-logo { font-size: 1.25rem; font-weight: 800; color: #1e293b; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; }
                    .fin-logo span { color: #3b82f6; }
                    .fin-nav { display: flex; gap: 40px; }
                    .fin-nav a { text-decoration: none; color: #64748b; font-weight: 500; font-size: 0.9rem; }
                    .fin-login { font-weight: 600; color: #1e293b; text-decoration: none; font-size: 0.9rem; }
                    .fin-cta { background: #1e293b; color: #fff; padding: 10px 24px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.875rem; }
                    
                    .fin-hero { padding: 100px 8%; display: flex; gap: 80px; align-items: center; }
                    .fin-hero-content { flex: 1; }
                    .fin-hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: #0f172a; }
                    .fin-hero-desc { font-size: 1.25rem; color: #64748b; margin-bottom: 40px; max-width: 520px; }
                    .fin-hero-form { background: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #f1f5f9; width: 450px; }
                    
                    .fin-trust { padding: 60px 8%; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; }
                    .fin-trust-text { font-size: 0.875rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
                    
                    .fin-benefits { padding: 120px 8%; display: grid; grid-template-columns: 1fr 1fr; gap: 100px; }
                    .fin-benefit-item { display: flex; gap: 24px; margin-bottom: 48px; }
                    .fin-benefit-icon { min-width: 48px; height: 48px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #3b82f6; }
                    .fin-benefit-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; }
                    .fin-benefit-desc { color: #64748b; font-size: 0.9375rem; }
                    
                    .fin-footer { padding: 80px 8%; background: #0f172a; color: #fff; text-align: center; }
                </style>
                <header class="fin-header">
                    <div class="fin-logo">MERIDIAN<span>CAPITAL</span></div>
                    <nav class="fin-nav">
                        <a href="#">Wealth Management</a>
                        <a href="#">Private Banking</a>
                        <a href="#">Corporate</a>
                        <a href="#">Insights</a>
                    </nav>
                    <div style="display: flex; gap: 24px; align-items: center;">
                        <a href="#" class="fin-login">Login</a>
                        <a href="#" class="fin-cta">Open Account</a>
                    </div>
                </header>
                <section class="fin-hero">
                    <div class="fin-hero-content">
                        <h1 class="fin-hero-title">Your future,<br/>securely architected.</h1>
                        <p class="fin-hero-desc">Bespoke financial solutions for high-net-worth individuals and global enterprises. We protect what matters most.</p>
                        <div style="display: flex; gap: 16px;">
                            <a href="#" class="fin-cta" style="padding: 16px 32px; font-size: 1rem;">Speak with an Advisor</a>
                            <a href="#" style="font-weight: 700; display: flex; align-items: center; gap: 8px; text-decoration: none; color: #0f172a;">Our Performance History →</a>
                        </div>
                    </div>
                    <div class="fin-hero-form">
                        <h3 style="margin-bottom: 20px; font-weight: 700;">Investment Calculator</h3>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 8px;">Initial Deposit</label>
                            <input type="text" value="$50,000" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;"/>
                        </div>
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 8px;">Investment Horizon</label>
                            <select style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <option>5 Years</option>
                                <option>10 Years</option>
                                <option>20 Years</option>
                            </select>
                        </div>
                        <button style="width: 100%; background: #3b82f6; color: #fff; padding: 16px; border-radius: 8px; font-weight: 700; border: none;">Calculate Projection</button>
                    </div>
                </section>
                <div class="fin-trust">
                    <span class="fin-trust-text">Trusted by Forbes 500 companies</span>
                    <div style="display: flex; gap: 40px; font-weight: 800; color: #cbd5e1; font-size: 1.5rem;">
                        <span>MORGAN.S</span>
                        <span>GOLDMAN.H</span>
                        <span>CHASE.B</span>
                    </div>
                </div>
            </div>
        `
    }
]
