import {
    Monitor,
    Layout,
    Smartphone,
    Briefcase,
    Rocket,
    ShoppingBag
} from 'lucide-react'

export const landingPageTemplates = [
    {
        id: 'lp-saas',
        label: 'SaaS Platform',
        icon: Monitor,
        category: 'landing-pages',
        mediaImage: '/templates/lp-saas.png',
        content: `
            <div class="lp-container">
                <style>
                    .lp-container { font-family: 'Inter', sans-serif; color: #111827; background: #fff; line-height: 1.5; }
                    .lp-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; border-bottom: 1px solid #f3f4f6; }
                    .lp-logo { font-weight: 700; font-size: 1.25rem; letter-spacing: -0.025em; }
                    .lp-nav { display: flex; gap: 32px; font-size: 0.875rem; font-weight: 500; color: #4b5563; }
                    .lp-cta-btn { background: #111827; color: #fff; padding: 10px 20px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 0.875rem; }
                    
                    .lp-hero { padding: 100px 5% 120px; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
                    .lp-hero-content { display: flex; flex-direction: column; gap: 24px; }
                    .lp-hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.05em; color: #000; }
                    .lp-hero-desc { font-size: 1.25rem; color: #4b5563; max-width: 480px; }
                    .lp-hero-btns { display: flex; gap: 16px; margin-top: 12px; }
                    .lp-hero-mockup { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; height: 400px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
                    .lp-hero-mockup::after { content: 'Platform View'; color: #9ca3af; font-weight: 500; font-size: 0.875rem; }

                    .lp-features { padding: 100px 5%; background: #f9fafb; }
                    .lp-section-label { color: #4f46e5; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 12px; text-align: center; }
                    .lp-section-title { font-size: 2.25rem; font-weight: 800; text-align: center; color: #111827; margin-bottom: 60px; letter-spacing: -0.025em; }
                    .lp-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1200px; margin: 0 auto; }
                    .lp-feature-card { background: #fff; padding: 40px; border-radius: 12px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 16px; }
                    .lp-feature-icon { width: 40px; height: 40px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
                    .lp-feature-title { font-weight: 700; font-size: 1.125rem; }
                    .lp-feature-desc { color: #6b7280; font-size: 0.9375rem; line-height: 1.6; }
                    
                    .lp-pricing { padding: 100px 5%; }
                    .lp-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
                    .lp-price-card { padding: 40px; border: 1px solid #e5e7eb; border-radius: 16px; display: flex; flex-direction: column; gap: 24px; }
                    .lp-price-card.featured { border: 2px solid #111827; background: #fff; position: relative; }
                    .lp-price-tag { font-size: 3rem; font-weight: 800; }
                    .lp-price-period { font-size: 1rem; color: #6b7280; font-weight: 400; }
                    
                    .lp-footer { padding: 80px 5%; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; color: #6b7280; font-size: 0.875rem; }
                </style>

                <header class="lp-header">
                    <div class="lp-logo">MODERN.SAAS</div>
                    <nav class="lp-nav">
                        <span>Product</span>
                        <span>Solutions</span>
                        <span>Pricing</span>
                        <span>Company</span>
                    </nav>
                    <a href="#" class="lp-cta-btn">Start 14-day trial</a>
                </header>

                <section class="lp-hero">
                    <div class="lp-hero-content">
                        <h1 class="lp-hero-title">Scale your team with ease.</h1>
                        <p class="lp-hero-desc">The ultimate workspace for modern teams to build, ship, and scale their most ambitious ideas without the friction.</p>
                        <div class="lp-hero-btns">
                            <a href="#" class="lp-cta-btn" style="padding: 14px 28px; font-size: 1rem;">Get started for free</a>
                            <a href="#" style="font-weight: 600; text-decoration: none; color: #111827; display: flex; align-items: center; padding: 14px 28px;">Book a demo</a>
                        </div>
                    </div>
                    <div class="lp-hero-mockup"></div>
                </section>

                <section class="lp-features">
                    <span class="lp-section-label">Features</span>
                    <h2 class="lp-section-title">Everything you need to ship faster</h2>
                    <div class="lp-features-grid">
                        <div class="lp-feature-card">
                            <div class="lp-feature-icon">⚡</div>
                            <h3 class="lp-feature-title">Real-time sync</h3>
                            <p class="lp-feature-desc">Experience lightning fast synchronization across all your devices and team members instantly.</p>
                        </div>
                        <div class="lp-feature-card">
                            <div class="lp-feature-icon">🛡️</div>
                            <h3 class="lp-feature-title">Bank-grade security</h3>
                            <p class="lp-feature-desc">Your data is encrypted at rest and in transit. We follow the highest security standards in the industry.</p>
                        </div>
                        <div class="lp-feature-card">
                            <div class="lp-feature-icon">📊</div>
                            <h3 class="lp-feature-title">Deep analytics</h3>
                            <p class="lp-feature-desc">Gain insights into your team's productivity with built-in analytics and custom reporting tools.</p>
                        </div>
                    </div>
                </section>

                <section class="lp-pricing">
                    <h2 class="lp-section-title" style="margin-bottom: 60px;">Simple, transparent pricing</h2>
                    <div class="lp-pricing-grid">
                        <div class="lp-price-card">
                            <div>
                                <h3 style="font-weight: 700; margin-bottom: 8px;">Starter</h3>
                                <p style="color: #6b7280; font-size: 0.875rem;">Best for small teams just getting started.</p>
                            </div>
                            <div class="lp-price-tag">$0<span class="lp-price-period">/mo</span></div>
                            <a href="#" class="lp-cta-btn" style="background: #f3f4f6; color: #111827; text-align: center;">Choose Starter</a>
                        </div>
                        <div class="lp-price-card featured">
                            <div>
                                <h3 style="font-weight: 700; margin-bottom: 8px;">Pro</h3>
                                <p style="color: #6b7280; font-size: 0.875rem;">Perfect for scaling teams and startups.</p>
                            </div>
                            <div class="lp-price-tag">$29<span class="lp-price-period">/mo</span></div>
                            <a href="#" class="lp-cta-btn" style="text-align: center;">Choose Pro</a>
                        </div>
                        <div class="lp-price-card">
                            <div>
                                <h3 style="font-weight: 700; margin-bottom: 8px;">Enterprise</h3>
                                <p style="color: #6b7280; font-size: 0.875rem;">Advanced features for large organizations.</p>
                            </div>
                            <div class="lp-price-tag">Custom</div>
                            <a href="#" class="lp-cta-btn" style="background: #f3f4f6; color: #111827; text-align: center;">Contact Sales</a>
                        </div>
                    </div>
                </section>

                <footer class="lp-footer">
                    <div>© 2024 MODERN.SAAS. All rights reserved.</div>
                    <div style="display: flex; gap: 24px;">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </footer>
            </div>
        `
    },
    {
        id: 'lp-business',
        label: 'Local Business',
        icon: Briefcase,
        category: 'landing-pages',
        mediaImage: '/templates/lp-business.png',
        content: `
            <div class="biz-container">
                <style>
                    .biz-container { font-family: 'Inter', sans-serif; color: #1c1917; background: #fff; line-height: 1.6; }
                    .biz-top-bar { background: #1c1917; color: #fff; padding: 12px 5%; display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; }
                    .biz-header { display: flex; justify-content: space-between; align-items: center; padding: 32px 5%; background: #fff; border-bottom: 1px solid #e7e5e4; }
                    .biz-logo { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; }
                    .biz-nav { display: flex; gap: 40px; }
                    .biz-nav a { text-decoration: none; color: #44403c; font-weight: 500; }
                    
                    .biz-hero { padding: 120px 5%; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; max-width: 1200px; margin: 0 auto; }
                    .biz-hero-tag { background: #f5f5f4; color: #44403c; padding: 6px 16px; border-radius: 4px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; margin-bottom: 24px; }
                    .biz-hero-title { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: #1c1917; }
                    .biz-hero-desc { font-size: 1.125rem; color: #57534e; margin-bottom: 32px; max-width: 500px; }
                    .biz-btn { background: #1c1917; color: #fff; padding: 16px 32px; font-weight: 700; text-decoration: none; display: inline-block; border-radius: 4px; transition: opacity 0.2s; }
                    .biz-hero-img { background: #f5f5f4; height: 500px; border-radius: 8px; position: relative; }

                    .biz-services { padding: 100px 5%; background: #fafaf9; }
                    .biz-section-title { font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 64px; }
                    .biz-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto; }
                    .biz-card { background: #fff; padding: 48px; border-radius: 4px; border: 1px solid #e7e5e4; }
                    .biz-card-icon { font-size: 2rem; margin-bottom: 24px; }
                    .biz-card-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 16px; }
                    .biz-card-desc { color: #57534e; font-size: 0.9375rem; }

                    .biz-cta { padding: 100px 5%; text-align: center; background: #1c1917; color: #fff; }
                    .biz-cta-title { font-size: 2.25rem; font-weight: 800; margin-bottom: 24px; }
                    .biz-cta-desc { color: #a8a29e; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; }
                    
                    .biz-footer { padding: 80px 5%; background: #fafaf9; border-top: 1px solid #e7e5e4; }
                    .biz-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 80px; max-width: 1200px; margin: 0 auto; }
                </style>

                <div class="biz-top-bar">
                    <div>123 MAIN STREET, METROPOLIS</div>
                    <div style="display: flex; gap: 24px;">
                        <span>MON-FRI: 9AM - 6PM</span>
                        <span>(555) 123-4567</span>
                    </div>
                </div>

                <header class="biz-header">
                    <div class="biz-logo">CRAFT&CO.</div>
                    <nav class="biz-nav">
                        <a href="#">Services</a>
                        <a href="#">Projects</a>
                        <a href="#">Process</a>
                        <a href="#">About</a>
                    </nav>
                    <a href="#" class="biz-btn" style="padding: 12px 24px;">Get a Quote</a>
                </header>

                <section class="biz-hero">
                    <div>
                        <span class="biz-hero-tag">Est. 1998</span>
                        <h1 class="biz-hero-title">Quality Craftsmanship for your Home</h1>
                        <p class="biz-hero-desc">We provide premium renovation and custom building services with a focus on durability, aesthetics, and attention to detail.</p>
                        <a href="#" class="biz-btn">Schedule Consultation</a>
                    </div>
                    <div class="biz-hero-img"></div>
                </section>

                <section class="biz-services">
                    <h2 class="biz-section-title">Our Services</h2>
                    <div class="biz-grid">
                        <div class="biz-card">
                            <div class="biz-card-icon">🛠️</div>
                            <h3 class="biz-card-title">Custom Builds</h3>
                            <p class="biz-card-desc">From initial design to final construction, we create unique spaces tailored to your lifestyle.</p>
                        </div>
                        <div class="biz-card">
                            <div class="biz-card-icon">🏠</div>
                            <h3 class="biz-card-title">Full Renovations</h3>
                            <p class="biz-card-desc">Transform your existing home into a modern masterpiece with our expert renovation team.</p>
                        </div>
                        <div class="biz-card">
                            <div class="biz-card-icon">📐</div>
                            <h3 class="biz-card-title">Interior Design</h3>
                            <p class="biz-card-desc">Work with our designers to select the perfect finishes, materials, and layouts for your space.</p>
                        </div>
                    </div>
                </section>

                <section class="biz-cta">
                    <h2 class="biz-cta-title">Ready to start your project?</h2>
                    <p class="biz-cta-desc">Join hundreds of satisfied homeowners across the city. Get a free, no-obligation estimate today.</p>
                    <a href="#" class="biz-btn" style="background: #fff; color: #1c1917;">Request Estimate</a>
                </section>

                <footer class="biz-footer">
                    <div class="biz-footer-grid">
                        <div>
                            <div class="biz-logo" style="margin-bottom: 24px;">CRAFT&CO.</div>
                            <p style="color: #6b7280; max-width: 300px;">Providing world-class craftsmanship and building services since 1998.</p>
                        </div>
                        <div>
                            <h4 style="font-weight: 700; margin-bottom: 20px;">Contact</h4>
                            <p style="color: #6b7280; margin-bottom: 12px;">hello@craftco.com</p>
                            <p style="color: #6b7280;">(555) 123-4567</p>
                        </div>
                        <div>
                            <h4 style="font-weight: 700; margin-bottom: 20px;">Legal</h4>
                            <p style="color: #6b7280; margin-bottom: 12px;">Privacy Policy</p>
                            <p style="color: #6b7280;">Modern Terms</p>
                        </div>
                    </div>
                </footer>
            </div>
        `
    },
    {
        id: 'lp-product',
        label: 'Product Showcase',
        icon: ShoppingBag,
        category: 'landing-pages',
        content: `
                <style>
                    .prod-container { font-family: 'Inter', sans-serif; background: #fff; color: #000; }
                    .prod-nav { display: flex; justify-content: center; padding: 40px; border-bottom: 1px solid #eee; }
                    .prod-logo { font-size: 1rem; font-weight: 900; letter-spacing: 0.5em; text-transform: uppercase; }
                    
                    .prod-hero { padding: 120px 5%; text-align: center; max-width: 900px; margin: 0 auto; }
                    .prod-hero-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px; display: block; color: #666; }
                    .prod-hero-title { font-size: 5rem; font-weight: 900; line-height: 1; margin-bottom: 40px; letter-spacing: -0.04em; }
                    .prod-hero-img { width: 100%; height: 600px; background: #f5f5f5; border-radius: 0; margin-bottom: 80px; display: flex; align-items: center; justify-content: center; color: #999; font-weight: 500; }
                    
                    .prod-feature-alt { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #000; border-bottom: 1px solid #000; }
                    .prod-feature-item { padding: 80px 10%; display: flex; flex-direction: column; gap: 24px; border-right: 1px solid #000; }
                    .prod-feature-item:last-child { border-right: none; }
                    .prod-feature-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
                    .prod-feature-desc { color: #666; font-size: 1rem; line-height: 1.6; }

                    .prod-specs { padding: 120px 5%; max-width: 1200px; margin: 0 auto; }
                    .prod-specs-title { font-size: 3rem; font-weight: 900; margin-bottom: 80px; text-align: center; }
                    .prod-specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #000; border: 1px solid #000; }
                    .prod-spec-cell { background: #fff; padding: 40px; }
                    .prod-spec-label { font-size: 0.75rem; font-weight: 700; color: #999; text-transform: uppercase; margin-bottom: 8px; display: block; }
                    .prod-spec-val { font-size: 1.25rem; font-weight: 800; }

                    .prod-footer { padding: 120px 5%; text-align: center; }
                    .prod-btn { background: #000; color: #fff; padding: 20px 60px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; display: inline-block; font-size: 0.875rem; }
                </style>
            <div class="prod-container">
                <nav class="prod-nav">
                    <div class="prod-logo">ELEMENT</div>
                </nav>

                <section class="prod-hero">
                    <span class="prod-hero-label">Introducing v4</span>
                    <h1 class="prod-hero-title">The Masterpiece of Sound.</h1>
                    <div class="prod-hero-img">Main Product Image</div>
                    <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 60px; color: #666;">Crafted with precision, delivered with passion. Experience audio like never before with our most advanced acoustic engine yet.</p>
                    <a href="#" class="prod-btn">Order Now</a>
                </section>

                <section class="prod-feature-alt">
                    <div class="prod-feature-item">
                        <h3 class="prod-feature-title">Pure Acoustics</h3>
                        <p class="prod-feature-desc">Active noise cancellation technology that adapts to your environment for a truly immersive experience.</p>
                    </div>
                    <div class="prod-feature-item">
                        <h3 class="prod-feature-title">40h Battery</h3>
                        <p class="prod-feature-desc">Power that stays with you. Up to 40 hours of playback on a single charge with fast-charging support.</p>
                    </div>
                </section>

                <section class="prod-specs">
                    <h2 class="prod-specs-title">Technical Specifications</h2>
                    <div class="prod-specs-grid">
                        <div class="prod-spec-cell">
                            <span class="prod-spec-label">Drivers</span>
                            <div class="prod-spec-val">40mm Custom</div>
                        </div>
                        <div class="prod-spec-cell">
                            <span class="prod-spec-label">Bluetooth</span>
                            <div class="prod-spec-val">v5.3 LE</div>
                        </div>
                        <div class="prod-spec-cell">
                            <span class="prod-spec-label">Weight</span>
                            <div class="prod-spec-val">250g</div>
                        </div>
                        <div class="prod-spec-cell">
                            <span class="prod-spec-label">Range</span>
                            <div class="prod-spec-val">100m</div>
                        </div>
                    </div>
                </section>

                <footer class="prod-footer">
                    <a href="#" class="prod-btn">Secure Your Order</a>
                    <p style="margin-top: 40px; color: #999; font-size: 0.75rem;">© 2024 ELEMENT AUDIO. ALL RIGHTS RESERVED.</p>
                </footer>
            </div>
        `
    },
    {
        id: 'lp-service',
        label: 'Service Company',
        icon: Layout,
        category: 'landing-pages',
        mediaImage: '/templates/lp-service.png',
        content: `
            <div class="svc-container">
                <style>
                    .svc-container { font-family: 'Inter', sans-serif; color: #1a1a1a; background: #fff; }
                    .svc-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 8%; border-bottom: 2px solid #1a1a1a; }
                    .svc-logo { font-size: 1.5rem; font-weight: 800; text-transform: uppercase; }
                    .svc-nav { display: flex; gap: 40px; font-weight: 600; font-size: 1rem; }
                    .svc-hero { padding: 120px 8%; background: #fff; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
                    .svc-hero-title { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 32px; letter-spacing: -0.03em; }
                    .svc-hero-desc { font-size: 1.25rem; line-height: 1.6; color: #444; margin-bottom: 48px; }
                    .svc-btn { background: #1a1a1a; color: #fff; padding: 18px 36px; font-weight: 700; text-decoration: none; border: none; font-size: 1.1rem; }
                    
                    .svc-stats { padding: 64px 8%; background: #1a1a1a; color: #fff; display: flex; justify-content: space-between; }
                    .svc-stat-item { text-align: left; }
                    .svc-stat-num { font-size: 3rem; font-weight: 800; display: block; margin-bottom: 4px; }
                    .svc-stat-label { font-size: 0.875rem; color: #999; text-transform: uppercase; letter-spacing: 0.1em; }

                    .svc-list { padding: 120px 8%; }
                    .svc-item { display: grid; grid-template-columns: 350px 1fr; gap: 80px; margin-bottom: 120px; align-items: start; }
                    .svc-item-num { font-size: 1rem; font-weight: 800; border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 24px; display: block; width: 40px; }
                    .svc-item-title { font-size: 2.25rem; font-weight: 800; margin-bottom: 24px; }
                    .svc-item-desc { font-size: 1.125rem; line-height: 1.7; color: #444; }

                    .svc-footer { padding: 120px 8%; background: #f5f5f5; text-align: center; }
                    .svc-footer-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 64px; }
                </style>

                <header class="svc-header">
                    <div class="svc-logo">STRATEGIC.CORE</div>
                    <nav class="svc-nav">
                        <span>Strategy</span>
                        <span>Ops</span>
                        <span>Capital</span>
                        <span>About</span>
                    </nav>
                </header>

                <section class="svc-hero">
                    <div>
                        <h1 class="svc-hero-title">Elevate your business strategy.</h1>
                        <p class="svc-hero-desc">We help mid-market companies optimize their operations and maximize shareholder value through expert advisory services.</p>
                        <a href="#" class="svc-btn">Talk to an advisor</a>
                    </div>
                    <div style="background: #f5f5f5; height: 100%; min-height: 400px; border: 2px solid #1a1a1a;"></div>
                </section>

                <section class="svc-stats">
                    <div class="svc-stat-item">
                        <span class="svc-stat-num">250+</span>
                        <span class="svc-stat-label">Clients served</span>
                    </div>
                    <div class="svc-stat-item">
                        <span class="svc-stat-num">$2B+</span>
                        <span class="svc-stat-label">Capital raised</span>
                    </div>
                    <div class="svc-stat-item">
                        <span class="svc-stat-num">15yr</span>
                        <span class="svc-stat-label">Market experience</span>
                    </div>
                    <div class="svc-stat-item">
                        <span class="svc-stat-num">98%</span>
                        <span class="svc-stat-label">Client retention</span>
                    </div>
                </section>

                <section class="svc-list">
                    <div class="svc-item">
                        <div>
                            <span class="svc-item-num">01</span>
                            <h3 class="svc-item-title">Operational Excellence</h3>
                        </div>
                        <p class="svc-item-desc">We dive deep into your company's workflows to identify bottlenecks and implement lean methodologies that drive efficiency and reduce costs across the board.</p>
                    </div>
                    <div class="svc-item">
                        <div>
                            <span class="svc-item-num">02</span>
                            <h3 class="svc-item-title">Growth Strategy</h3>
                        </div>
                        <p class="svc-item-desc">Our team develops comprehensive market entry and expansion strategies, leveraging data analytics to pinpoint the most lucrative opportunities for your business.</p>
                    </div>
                </section>

                <section class="svc-footer">
                    <h2 class="svc-footer-title">Let's build the future together.</h2>
                    <a href="#" class="svc-btn" style="font-size: 1.5rem; padding: 24px 64px;">Contact Us</a>
                    <div style="margin-top: 100px; font-weight: 800; opacity: 0.1; font-size: 8rem; letter-spacing: -0.05em; text-transform: uppercase;">Strategic</div>
                </section>
            </div>
        `
    },
    {
        id: 'lp-app',
        label: 'App Promotion',
        icon: Smartphone,
        category: 'landing-pages',
        mediaImage: '/templates/lp-app.png',
        content: `
            <div class="app-container">
                <style>
                    .app-container { font-family: 'Inter', sans-serif; color: #000; background: #fff; }
                    .app-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 5%; }
                    .app-logo { font-weight: 900; font-size: 1.5rem; letter-spacing: -0.04em; }
                    .app-hero { text-align: center; padding: 100px 5% 0; }
                    .app-hero-title { font-size: 4.5rem; font-weight: 900; line-height: 1; margin-bottom: 24px; letter-spacing: -0.05em; }
                    .app-hero-desc { font-size: 1.25rem; color: #666; max-width: 600px; margin: 0 auto 48px; }
                    .app-store-btns { display: flex; justify-content: center; gap: 16px; margin-bottom: 80px; }
                    .app-store-btn { background: #000; color: #fff; padding: 14px 28px; border-radius: 12px; display: flex; align-items: center; gap: 12px; text-decoration: none; font-weight: 600; text-align: left; }
                    
                    .app-mockup-container { max-width: 800px; margin: 0 auto; background: #f5f5f5; border-radius: 40px 40px 0 0; height: 500px; padding: 40px 40px 0; border: 1px solid #eee; border-bottom: none; }
                    .app-mockup-screen { background: #fff; height: 100%; border-radius: 20px 20px 0 0; box-shadow: 0 -10px 40px rgba(0,0,0,0.05); }

                    .app-benefits { padding: 100px 5%; background: #fafafa; }
                    .app-benefits-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 64px; max-width: 1000px; margin: 0 auto; }
                    .app-benefit { display: flex; flex-direction: column; gap: 16px; }
                    .app-benefit-num { font-size: 0.875rem; font-weight: 800; color: #999; }
                    .app-benefit-title { font-size: 1.75rem; font-weight: 800; }
                    .app-benefit-desc { color: #666; line-height: 1.6; }

                    .app-cta { padding: 120px 5%; text-align: center; background: #000; color: #fff; }
                    .app-footer { padding: 40px 5%; border-top: 1px solid #eee; display: flex; justify-content: space-between; font-size: 0.875rem; color: #999; }
                </style>

                <header class="app-header">
                    <div class="app-logo">FLOW.APP</div>
                    <div style="font-weight: 700;">Sign In</div>
                </header>

                <section class="app-hero">
                    <h1 class="app-hero-title">Flow through your day.</h1>
                    <p class="app-hero-desc">The only task manager that uses AI to predict your needs and automate your schedule.</p>
                    <div class="app-store-btns">
                        <a href="#" class="app-store-btn">
                            <div style="font-size: 1.25rem;"></div>
                            <div>
                                <div style="font-size: 0.6rem; opacity: 0.7;">Download on the</div>
                                <div style="font-size: 1rem;">App Store</div>
                            </div>
                        </a>
                        <a href="#" class="app-store-btn">
                            <div style="font-size: 1.25rem;">▶</div>
                            <div>
                                <div style="font-size: 0.6rem; opacity: 0.7;">Get it on</div>
                                <div style="font-size: 1rem;">Google Play</div>
                            </div>
                        </a>
                    </div>
                    <div class="app-mockup-container">
                        <div class="app-mockup-screen"></div>
                    </div>
                </section>

                <section class="app-benefits">
                    <div class="app-benefits-grid">
                        <div class="app-benefit">
                            <span class="app-benefit-num">Step 01</span>
                            <h3 class="app-benefit-title">Smart Scheduling</h3>
                            <p class="app-benefit-desc">Our engine analyzes your habits and suggests the best times for deep work and meetings.</p>
                        </div>
                        <div class="app-benefit">
                            <span class="app-benefit-num">Step 02</span>
                            <h3 class="app-benefit-title">Auto-Prioritize</h3>
                            <p class="app-benefit-desc">Tasks are automatically sorted based on deadlines, effort required, and your current energy levels.</p>
                        </div>
                    </div>
                </section>

                <section class="app-cta">
                    <h2 style="font-size: 3rem; font-weight: 900; margin-bottom: 40px;">Ready to find your flow?</h2>
                    <a href="#" style="background: #fff; color: #000; padding: 20px 48px; border-radius: 50px; font-weight: 800; text-decoration: none; display: inline-block;">Get Flow Now</a>
                </section>

                <footer class="app-footer">
                    <div>© 2024 FLOW TECHNOLOGIES</div>
                    <div style="display: flex; gap: 24px;">
                        <span>Instagram</span>
                        <span>Twitter</span>
                    </div>
                </footer>
            </div>
        `
    },
    {
        id: 'lp-startup',
        label: 'Startup Pitch',
        icon: Rocket,
        category: 'landing-pages',
        content: `
            <div class="pitch-container">
                <style>
                    .pitch-container { font-family: 'Inter', sans-serif; color: #000; background: #fff; }
                    .pitch-hero { padding: 160px 8%; text-align: left; max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr; gap: 80px; align-items: start; }
                    .pitch-hero-title { font-size: 5.5rem; font-weight: 900; line-height: 0.9; margin-bottom: 40px; letter-spacing: -0.05em; }
                    .pitch-hero-tagline { font-size: 1.5rem; color: #444; line-height: 1.4; max-width: 500px; font-weight: 500; }
                    
                    .pitch-manifesto { padding: 120px 8%; background: #000; color: #fff; }
                    .pitch-manifesto-title { font-size: 1rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 60px; display: block; }
                    .pitch-manifesto-text { font-size: 3rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; max-width: 1000px; }
                    .pitch-highlight { color: #888; }

                    .pitch-grid { padding: 120px 8%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #eee; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
                    .pitch-cell { background: #fff; padding: 60px 40px; }
                    .pitch-cell-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 16px; }
                    .pitch-cell-desc { color: #666; font-size: 1rem; line-height: 1.6; }

                    .pitch-cta { padding: 160px 8%; display: flex; justify-content: space-between; align-items: end; }
                    .pitch-cta-title { font-size: 4rem; font-weight: 900; letter-spacing: -0.04em; }
                    .pitch-btn { padding: 24px 48px; background: #000; color: #fff; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; border-radius: 0; }
                </style>

                <section class="pitch-hero">
                    <div>
                        <h1 class="pitch-hero-title">Beyond the<br/>Horizon.</h1>
                        <p class="pitch-hero-tagline">Building the infrastructure for the next generation of decentralized commerce and digital ownership.</p>
                    </div>
                    <div style="border: 2px solid #000; padding: 40px; border-radius: 0;">
                        <h4 style="font-weight: 800; margin-bottom: 24px; text-transform: uppercase; font-size: 0.75rem;">Join the Waitlist</h4>
                        <input type="text" placeholder="Email Address" style="width: 100%; padding: 16px; border: 1px solid #000; margin-bottom: 16px; outline: none;" />
                        <a href="#" class="pitch-btn" style="display: block; text-align: center; padding: 16px;">Secure Access</a>
                    </div>
                </section>

                <section class="pitch-manifesto">
                    <span class="pitch-manifesto-title">The Manifesto</span>
                    <p class="pitch-manifesto-text">
                        The current internet is broken. <span class="pitch-highlight">We are building a world where creators own their audience,</span> where data is sovereign, and where trust is baked into the protocol, not the platform.
                    </p>
                </section>

                <section class="pitch-grid">
                    <div class="pitch-cell">
                        <h3 class="pitch-cell-title">Protocol First</h3>
                        <p class="pitch-cell-desc">Open-source at its core. Our infrastructure is designed to be built upon, not walled off.</p>
                    </div>
                    <div class="pitch-cell">
                        <h3 class="pitch-cell-title">Privacy Native</h3>
                        <p class="pitch-cell-desc">Zero-knowledge proofs integrated from day one to ensure user data remains exactly that—the users.</p>
                    </div>
                    <div class="pitch-cell">
                        <h3 class="pitch-cell-title">Global Velocity</h3>
                        <p class="pitch-cell-desc">Settlements that happen in milliseconds, not days. Built for a world that never sleeps.</p>
                    </div>
                </section>

                <section class="pitch-cta">
                    <h2 class="pitch-cta-title">Are you<br/>in?</h2>
                    <a href="#" class="pitch-btn">Get Early Access</a>
                </section>

                <footer style="padding: 60px 8%; border-top: 1px solid #eee; display: flex; justify-content: space-between; font-weight: 700; font-size: 0.875rem;">
                    <div>VESTA LABS</div>
                    <div>2024 SERIES A</div>
                </footer>
            </div>
        `
    }
]
