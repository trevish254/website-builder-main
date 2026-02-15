import {
    Filter,
    Target,
    Zap,
    Gift,
    CheckCircle,
    PlayCircle,
    Mail,
    ArrowRight,
    Users,
    Clock,
    Star,
    Shield
} from 'lucide-react'

export const funnelTemplates = [
    {
        id: 'fn-lead-capture',
        label: 'Lead Capture Page',
        icon: Mail,
        category: 'funnel-pages',
        content: `
            <div class="fn-container">
                <style>
                    .fn-container { font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; line-height: 1.6; }
                    .fn-top-bar { background: #6366f1; color: #fff; text-align: center; padding: 12px; font-weight: 600; font-size: 0.9rem; }
                    
                    .fn-hero { padding: 80px 8%; display: flex; flex-direction: column; align-items: center; text-align: center; background: radial-gradient(circle at top, #f5f3ff 0%, #fff 70%); }
                    .fn-hero-tag { background: #eef2ff; color: #6366f1; padding: 6px 16px; border-radius: 100px; font-weight: 700; font-size: 0.85rem; margin-bottom: 24px; text-transform: uppercase; }
                    .fn-hero-title { font-size: 3.5rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 24px; max-width: 800px; line-height: 1.1; }
                    .fn-hero-desc { font-size: 1.25rem; color: #64748b; max-width: 600px; margin-bottom: 48px; }
                    
                    .fn-form-card { width: 100%; max-width: 500px; background: #fff; padding: 40px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); border: 1px solid #f1f5f9; }
                    .fn-input-group { margin-bottom: 20px; text-align: left; }
                    .fn-label { display: block; font-weight: 700; font-size: 0.85rem; color: #475569; margin-bottom: 8px; }
                    .fn-input { width: 100%; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 1rem; box-sizing: border-box; }
                    .fn-btn { width: 100%; background: #6366f1; color: #fff; border: none; padding: 18px; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3); }
                    .fn-btn:hover { background: #4f46e5; transform: translateY(-2px); }
                    
                    .fn-social-proof { display: flex; gap: 40px; justify-content: center; margin-top: 64px; opacity: 0.6; grayscale: 100%; }
                </style>
                <div class="fn-top-bar">FREE GUIDE: 10 Ways to Scale Your SaaS locally in 2024</div>
                <section class="fn-hero">
                    <span class="fn-hero-tag">Limited Time Access</span>
                    <h1 class="fn-hero-title">Generate 10x more leads without spending more on ads.</h1>
                    <p class="fn-hero-desc">Enter your email below to get instant access to the framework used by 500+ high-growth companies.</p>
                    
                    <div class="fn-form-card">
                        <form>
                            <div class="fn-input-group">
                                <label class="fn-label">Full Name</label>
                                <input type="text" class="fn-input" placeholder="Enter your name" />
                            </div>
                            <div class="fn-input-group">
                                <label class="fn-label">Work Email</label>
                                <input type="email" class="fn-input" placeholder="email@company.com" />
                            </div>
                            <button type="button" class="fn-btn">Get My Free Guide Now</button>
                            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 20px;">No spam. Just high-value insights. Unsubscribe at any time.</p>
                        </form>
                    </div>
                </section>
                <div class="fn-social-proof">
                    <div style="font-weight: 800; font-size: 1.25rem;">FORBES</div>
                    <div style="font-weight: 800; font-size: 1.25rem;">TECHCRUNCH</div>
                    <div style="font-weight: 800; font-size: 1.25rem;">WIRED</div>
                </div>
            </div>
        `
    },
    {
        id: 'fn-webinar-signup',
        label: 'Webinar Signup',
        icon: PlayCircle,
        category: 'funnel-pages',
        content: `
            <div class="wn-container">
                <style>
                    .wn-container { font-family: 'Outfit', sans-serif; background: #0f172a; color: #fff; min-height: 100vh; overflow-x: hidden; }
                    .wn-nav { padding: 40px 8%; display: flex; justify-content: space-between; align-items: center; }
                    .wn-hero { padding: 60px 8%; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
                    
                    .wn-badge { background: #38bdf8; color: #0f172a; padding: 6px 14px; border-radius: 100px; font-weight: 800; font-size: 0.75rem; margin-bottom: 24px; display: inline-block; }
                    .wn-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; line-height: 1.1; margin-bottom: 32px; letter-spacing: -0.05em; }
                    .wn-title span { color: #38bdf8; }
                    
                    .wn-details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
                    .wn-detail-item { display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 1.1rem; }
                    
                    .wn-form-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 32px; padding: 48px; backdrop-filter: blur(10px); }
                    .wn-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; width: 100%; padding: 18px; border-radius: 16px; margin-bottom: 16px; font-size: 1rem; box-sizing: border-box; }
                    .wn-btn { width: 100%; background: #38bdf8; color: #0f172a; border: none; padding: 20px; border-radius: 16px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; }
                    .wn-btn:hover { background: #7dd3fc; transform: scale(1.02); }
                    
                    .wn-visual { position: relative; border-radius: 32px; overflow: hidden; height: 500px; background: #1e293b; border: 4px solid rgba(56, 189, 248, 0.2); }
                    .wn-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; background: #38bdf8; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                </style>
                <nav class="wn-nav">
                    <div style="font-weight: 900; font-size: 1.5rem;">WEBINAR.HUB</div>
                    <div style="font-weight: 700; color: #38bdf8;">Feb 28, 2024 • 10:00 AM EST</div>
                </nav>
                <section class="wn-hero">
                    <div>
                        <span class="wn-badge">EXCLUSIVE MASTERCLASS</span>
                        <h1 class="wn-title">Scale your <span>Agency</span> to $100k/mo using AI.</h1>
                        <p style="font-size: 1.25rem; color: #94a3b8; margin-bottom: 40px;">Exactly how we automated 75% of our operations and doubled our profit margins in 6 months.</p>
                        
                        <div class="wn-details">
                            <div class="wn-detail-item">✅ Step-by-step Framework</div>
                            <div class="wn-detail-item">✅ Live QA Session</div>
                            <div class="wn-detail-item">✅ Free Automation Tools</div>
                            <div class="wn-detail-item">✅ Limited to 100 Spots</div>
                        </div>
                        
                        <div class="wn-form-box">
                            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 24px;">Reserve Your Seat</h3>
                            <form>
                                <input type="text" class="wn-input" placeholder="Full Name" />
                                <input type="email" class="wn-input" placeholder="Best Email Address" />
                                <button type="button" class="wn-btn">Register for Webinar</button>
                            </form>
                        </div>
                    </div>
                    <div class="wn-visual">
                        <div class="wn-play">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="#0f172a"><path d="M5 3l14 9-14 9V3z"/></svg>
                        </div>
                        <div style="position: absolute; bottom: 32px; left: 32px; display: flex; align-items: center; gap: 16px;">
                            <div style="width: 48px; height: 48px; background: #4ade80; border-radius: 50%;"></div>
                            <div>
                                <div style="font-weight: 800;">David Miller</div>
                                <div style="font-size: 0.9rem; color: #94a3b8;">Growth Expert</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `
    },
    {
        id: 'fn-sales-page',
        label: 'High-Ticket Sales Page',
        icon: Target,
        category: 'funnel-pages',
        content: `
            <div class="sl-container">
                <style>
                    .sl-container { font-family: 'Inter', sans-serif; background: #fff; color: #1a1a1a; line-height: 1.7; }
                    .sl-section { padding: 100px 8%; }
                    .sl-header { text-align: center; max-width: 900px; margin: 0 auto; padding: 100px 8%; }
                    .sl-pre { font-weight: 800; color: #6366f1; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 20px; }
                    .sl-title { font-size: clamp(3rem, 6vw, 5rem); font-weight: 900; letter-spacing: -0.05em; line-height: 1; margin-bottom: 32px; }
                    
                    .sl-highlight { background: #fdf2f8; border-radius: 24px; padding: 80px; margin: 60px 0; text-align: center; }
                    .sl-sub { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; color: #be185d; }
                    
                    .sl-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 60px; }
                    .sl-feat-card { text-align: center; }
                    .sl-feat-icon { width: 80px; height: 80px; background: #6366f1; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; font-size: 2rem; }
                    
                    .sl-atc { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 800px; background: #1a1a1a; padding: 24px 40px; border-radius: 100px; display: flex; justify-content: space-between; align-items: center; color: #fff; z-index: 1000; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
                    .sl-btn-buy { background: #fdf2f8; color: #be185d; border: none; padding: 16px 32px; border-radius: 100px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.2s; }
                </style>
                <div class="sl-atc">
                    <div>
                        <div style="font-weight: 800; font-size: 1.25rem;">The Founders Accelerator</div>
                        <div style="font-size: 0.85rem; opacity: 0.7;">Secure your exclusive invite-only access.</div>
                    </div>
                    <button class="sl-btn-buy">Join the Cohort</button>
                </div>
                
                <header class="sl-header">
                    <span class="sl-pre">For Serious Entrepreneurs Only</span>
                    <h1 class="sl-title">The blueprint for your next $10M exit.</h1>
                    <p style="font-size: 1.5rem; color: #4b5563;">Stop guessing. Start executing the exact strategies used by unicorn founders.</p>
                </header>
                
                <section class="sl-section" style="background: #0f172a; color: #fff;">
                    <h2 style="font-size: 3rem; font-weight: 800; text-align: center; margin-bottom: 80px;">What You'll Achieve</h2>
                    <div class="sl-grid-3">
                        <div class="sl-feat-card">
                            <div class="sl-feat-icon">🎯</div>
                            <h4 style="font-size: 1.5rem; margin-bottom: 16px;">Precision Strategy</h4>
                            <p style="color: #94a3b8;">Eliminate busy work and focus on the 2% of activities that drive 98% of growth.</p>
                        </div>
                        <div class="sl-feat-card">
                            <div class="sl-feat-icon">⚡</div>
                            <h4 style="font-size: 1.5rem; margin-bottom: 16px;">Hyper-Growth</h4>
                            <p style="color: #94a3b8;">Learn the specific customer acquisition systems that scale without breaking budget.</p>
                        </div>
                        <div class="sl-feat-card">
                            <div class="sl-feat-icon">🤝</div>
                            <h4 style="font-size: 1.5rem; margin-bottom: 16px;">Master Network</h4>
                            <p style="color: #94a3b8;">Direct access to founders who have already survived the journey you're on.</p>
                        </div>
                    </div>
                </section>
                
                <section class="sl-section">
                    <div class="sl-highlight">
                        <h3 class="sl-sub">Wait... is this for you?</h3>
                        <p style="font-size: 1.25rem; color: #4b5563; max-width: 700px; margin: 0 auto;">This is NOT a course. This is a high-intensity mentorship program for founders doing $20k+/mo who are ready to break through the next glass ceiling.</p>
                    </div>
                </section>
            </div>
        `
    },
    {
        id: 'fn-offer-page',
        label: 'Limited Offer Page',
        icon: Gift,
        category: 'funnel-pages',
        content: `
            <div class="of-container">
                <style>
                    .of-container { font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; padding: 100px 8%; text-align: center; }
                    .of-timer { display: flex; justify-content: center; gap: 20px; font-weight: 900; font-size: 3rem; color: #ef4444; margin-bottom: 40px; }
                    .of-timer-unit { display: flex; flex-direction: column; align-items: center; }
                    .of-timer-label { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
                    
                    .of-card { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; border: 1px solid #f1f5f9; padding: 60px; border-radius: 40px; }
                    .of-price { margin: 32px 0; }
                    .of-old { text-decoration: line-through; color: #94a3b8; font-size: 1.5rem; margin-right: 12px; }
                    .of-new { font-size: 4rem; font-weight: 900; color: #1e293b; }
                    
                    .of-btn-claim { background: #ef4444; color: #fff; border: none; padding: 20px 60px; border-radius: 100px; font-weight: 800; font-size: 1.25rem; cursor: pointer; transition: 0.2s; box-shadow: 0 20px 40px rgba(239, 68, 68, 0.2); }
                    .of-btn-claim:hover { transform: translateY(-3px); background: #dc2626; }
                </style>
                <div class="of-timer">
                    <div class="of-timer-unit">05 <span class="of-timer-label">Hours</span></div>
                    <span>:</span>
                    <div class="of-timer-unit">42 <span class="of-timer-label">Minutes</span></div>
                    <span>:</span>
                    <div class="of-timer-unit">18 <span class="of-timer-label">Seconds</span></div>
                </div>
                <h1 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 80px;">Flash Sale Extravaganza!</h1>
                <div class="of-card">
                    <div style="width: 100%; aspect-ratio: 1; background: #f8fafc; border-radius: 20px;"></div>
                    <div style="text-align: left;">
                        <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 16px;">Premium Software Suite</h2>
                        <p style="color: #64748b; font-size: 1.1rem;">Get lifetime access to our entire toolkit. One payment. Forever updates. No monthly fees.</p>
                        <div class="of-price">
                            <span class="of-old">$997</span>
                            <span class="of-new">$297</span>
                        </div>
                        <button class="of-btn-claim">Claim My 70% Discount</button>
                        <p style="margin-top: 24px; font-weight: 600; color: #ef4444;">Only 12 license keys remaining.</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'fn-thank-you',
        label: 'Funnel Thank You',
        icon: CheckCircle,
        category: 'funnel-pages',
        content: `
            <div class="ty-container">
                <style>
                    .ty-container { font-family: 'Inter', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; background: #fcfcfc; text-align: center; padding: 20px; }
                    .ty-box { max-width: 600px; }
                    .ty-icon { width: 100px; height: 100px; background: #ecfdf5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 40px; font-size: 3rem; }
                    .ty-title { font-size: 3.5rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -0.04em; }
                    .ty-desc { font-size: 1.25rem; color: #64748b; line-height: 1.6; margin-bottom: 60px; }
                    
                    .ty-next { background: #fff; border: 1px solid #e2e8f0; padding: 32px; border-radius: 24px; text-align: left; display: flex; gap: 24px; align-items: center; }
                    .ty-next-tag { background: #6366f1; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: inline-block; margin-bottom: 12px; }
                </style>
                <div class="ty-box">
                    <div class="ty-icon">✓</div>
                    <h1 class="ty-title">You're in!</h1>
                    <p class="ty-desc">We've sent the access link to your inbox. While you wait, check out your next step below.</p>
                    
                    <div class="ty-next">
                        <div style="width: 80px; height: 80px; background: #f1f5f9; border-radius: 12px; flex-shrink: 0;"></div>
                        <div>
                            <span class="ty-next-tag">NEXT STEP</span>
                            <h4 style="font-weight: 800; font-size: 1.2rem; margin-bottom: 4px;">Join Our Inner Circle</h4>
                            <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Get daily scaling strategies and network with other successful founders.</p>
                        </div>
                        <div style="font-size: 1.5rem; font-weight: 800;">→</div>
                    </div>
                </div>
            </div>
        `
    }
]
