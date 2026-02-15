import {
    User,
    Briefcase,
    Code,
    Palette,
    FileText,
    ExternalLink,
    Mail,
    Github,
    Linkedin,
    Twitter,
    Instagram,
    MapPin,
    Calendar,
    Award,
    CheckCircle2
} from 'lucide-react'

export const personalBrandTemplates = [
    {
        id: 'pb-portfolio',
        label: 'Professional Portfolio',
        icon: User,
        category: 'personal-brand',
        content: `
            <div class="pb-container">
                <style>
                    .pb-container { font-family: 'Outfit', sans-serif; color: #1a1a1a; background: #fff; line-height: 1.6; }
                    .pb-nav { display: flex; justify-content: space-between; align-items: center; padding: 30px 8%; position: sticky; top: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); z-index: 100; }
                    .pb-logo { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; }
                    .pb-nav-links { display: flex; gap: 40px; font-weight: 500; font-size: 0.95rem; }
                    
                    .pb-hero { padding: 120px 8% 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
                    .pb-hero-tag { display: inline-block; padding: 6px 16px; background: #f0f0f0; border-radius: 100px; font-size: 0.85rem; font-weight: 600; margin-bottom: 24px; }
                    .pb-hero-title { font-size: 4.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 32px; letter-spacing: -0.04em; }
                    .pb-hero-title span { color: #6366f1; }
                    .pb-hero-desc { font-size: 1.25rem; color: #4b5563; margin-bottom: 40px; max-width: 500px; }
                    .pb-hero-btns { display: flex; gap: 20px; }
                    .pb-btn-primary { background: #1a1a1a; color: #fff; padding: 16px 32px; border-radius: 12px; font-weight: 600; text-decoration: none; transition: 0.3s; }
                    .pb-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
                    .pb-btn-secondary { background: transparent; color: #1a1a1a; padding: 16px 32px; border-radius: 12px; font-weight: 600; text-decoration: none; border: 1px solid #e5e7eb; transition: 0.3s; }
                    
                    .pb-hero-visual { position: relative; }
                    .pb-hero-img { width: 100%; aspect-ratio: 1; background: #f3f4f6; border-radius: 30px; object-fit: cover; }
                    .pb-floating-card { position: absolute; bottom: 40px; left: -40px; background: #fff; padding: 20px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 15px; }
                    
                    .pb-section { padding: 100px 8%; }
                    .pb-sec-header { margin-bottom: 60px; }
                    .pb-sec-title { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; }
                    
                    .pb-work-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                    .pb-work-card { border-radius: 24px; overflow: hidden; background: #f9fafb; transition: 0.4s; }
                    .pb-work-card:hover { transform: translateY(-10px); }
                    .pb-work-img { width: 100%; aspect-ratio: 16/10; background: #e5e7eb; }
                    .pb-work-info { padding: 30px; }
                    .pb-work-cat { font-size: 0.85rem; font-weight: 600; color: #6366f1; text-transform: uppercase; margin-bottom: 12px; display: block; }
                    .pb-work-name { font-size: 1.5rem; font-weight: 700; margin-bottom: 15px; }
                    
                    .pb-footer { padding: 80px 8%; background: #1a1a1a; color: #fff; text-align: center; }
                    .pb-footer-title { font-size: 3rem; font-weight: 800; margin-bottom: 40px; }
                </style>
                <nav class="pb-nav">
                    <div class="pb-logo">ALEX.DESIGN</div>
                    <div class="pb-nav-links">
                        <a href="#">Work</a>
                        <a href="#">About</a>
                        <a href="#">Services</a>
                        <a href="#">Contact</a>
                    </div>
                </nav>
                <section class="pb-hero">
                    <div class="pb-hero-content">
                        <span class="pb-hero-tag">Available for new projects</span>
                        <h1 class="pb-hero-title">Digital <span>Experience</span> Designer</h1>
                        <p class="pb-hero-desc">I help brands create meaningful connections through thoughtful design and interactive storytelling.</p>
                        <div class="pb-hero-btns">
                            <a href="#" class="pb-btn-primary">View My Work</a>
                            <a href="#" class="pb-btn-secondary">Get in Touch</a>
                        </div>
                    </div>
                    <div class="pb-hero-visual">
                        <div class="pb-hero-img"></div>
                        <div class="pb-floating-card">
                            <div style="width: 40px; height: 40px; background: #6366f1; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                            </div>
                            <div>
                                <div style="font-weight: 700; font-size: 1.1rem;">50+ Projects</div>
                                <div style="font-size: 0.8rem; color: #666;">Completed successfully</div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="pb-section">
                    <div class="pb-sec-header">
                        <h2 class="pb-sec-title">Selected Works</h2>
                    </div>
                    <div class="pb-work-grid">
                        <div class="pb-work-card">
                            <div class="pb-work-img"></div>
                            <div class="pb-work-info">
                                <span class="pb-work-cat">Mobile App</span>
                                <h3 class="pb-work-name">Fintech Revolution</h3>
                            </div>
                        </div>
                        <div class="pb-work-card">
                            <div class="pb-work-img"></div>
                            <div class="pb-work-info">
                                <span class="pb-work-cat">Branding</span>
                                <h3 class="pb-work-name">Organic Skincare Co.</h3>
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="pb-footer">
                    <h2 class="pb-footer-title">Let's build something <br/> amazing together.</h2>
                    <a href="mailto:hello@alex.design" style="font-size: 2rem; color: #fff; font-weight: 700; text-decoration: underline; text-underline-offset: 10px;">hello@alex.design</a>
                </footer>
            </div>
        `
    },
    {
        id: 'pb-freelancer',
        label: 'Freelancer Profile',
        icon: Briefcase,
        category: 'personal-brand',
        content: `
            <div class="fl-container">
                <style>
                    .fl-container { font-family: 'Inter', sans-serif; color: #0f172a; background: #f8fafc; }
                    .fl-card { max-width: 1000px; margin: 60px auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.05); }
                    .fl-header { background: linear-gradient(135deg, #1e293b, #0f172a); padding: 60px; color: #fff; display: flex; gap: 40px; align-items: center; }
                    .fl-avatar { width: 140px; height: 140px; background: #334155; border-radius: 30px; border: 4px solid rgba(255,255,255,0.1); }
                    .fl-name { font-size: 2.5rem; font-weight: 800; margin-bottom: 8px; }
                    .fl-title { font-size: 1.1rem; color: #94a3b8; font-weight: 500; }
                    
                    .fl-stats { display: flex; gap: 40px; padding: 24px 60px; border-bottom: 1px solid #f1f5f9; background: #fff; }
                    .fl-stat-item { text-align: center; }
                    .fl-stat-val { font-size: 1.25rem; font-weight: 700; display: block; }
                    .fl-stat-label { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
                    
                    .fl-content { padding: 60px; display: grid; grid-template-columns: 1fr 300px; gap: 60px; }
                    .fl-sec-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
                    .fl-about-text { color: #475569; font-size: 1.05rem; line-height: 1.7; }
                    
                    .fl-badges { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
                    .fl-badge { background: #f1f5f9; padding: 6px 14px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; color: #475569; }
                    
                    .fl-sidebar-item { margin-bottom: 32px; }
                    .fl-btn-hire { width: 100%; background: #0f172a; color: #fff; padding: 16px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; margin-bottom: 16px; }
                </style>
                <div class="fl-card">
                    <header class="fl-header">
                        <div class="fl-avatar"></div>
                        <div>
                            <h1 class="fl-name">Sarah Jenkins</h1>
                            <p class="fl-title">Content Strategist & Copywriter Specialist</p>
                            <div style="margin-top: 20px; display: flex; gap: 15px;">
                                <span style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem; color: #94a3b8;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> London, UK</span>
                                <span style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem; color: #4ade80;"><span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%;"></span> Available Now</span>
                            </div>
                        </div>
                    </header>
                    <div class="fl-stats">
                        <div class="fl-stat-item"><span class="fl-stat-val">98%</span><span class="fl-stat-label">Job Success</span></div>
                        <div class="fl-stat-item"><span class="fl-stat-val">$85</span><span class="fl-stat-label">Hourly Rate</span></div>
                        <div class="fl-stat-item"><span class="fl-stat-val">1.2k</span><span class="fl-stat-label">Hours Worked</span></div>
                    </div>
                    <div class="fl-content">
                        <main>
                            <section>
                                <h2 class="fl-sec-title">About Me</h2>
                                <p class="fl-about-text">Over 8 years of experience helping SaaS companies find their voice. I specialize in turning complex technical concepts into compelling stories that drive conversions.</p>
                                <div class="fl-badges">
                                    <span class="fl-badge">Copywriting</span>
                                    <span class="fl-badge">SEO Strategy</span>
                                    <span class="fl-badge">Email Marketing</span>
                                    <span class="fl-badge">Content Planning</span>
                                </div>
                            </section>
                        </main>
                        <aside>
                            <div class="fl-sidebar-item">
                                <button class="fl-btn-hire">Invite to Job</button>
                                <button style="width: 100%; border: 1px solid #e2e8f0; background: #fff; padding: 16px; border-radius: 12px; font-weight: 700; cursor: pointer;">Save Profile</button>
                            </div>
                            <div class="fl-sidebar-item">
                                <h3 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 12px; color: #64748b; text-transform: uppercase;">Socials</h3>
                                <div style="display: flex; gap: 12px;">
                                    <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px;"></div>
                                    <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px;"></div>
                                    <div style="width: 40px; height: 40px; background: #f1f5f9; border-radius: 10px;"></div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'pb-developer',
        label: 'Developer Portfolio',
        icon: Code,
        category: 'personal-brand',
        content: `
            <div class="dev-container">
                <style>
                    .dev-container { font-family: 'JetBrains Mono', monospace; background: #0a0a0a; color: #00ff41; padding: 40px; line-height: 1.5; }
                    .dev-terminal { max-width: 900px; margin: 0 auto; background: #000; border: 1px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
                    .term-header { background: #1a1a1a; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
                    .term-btns { display: flex; gap: 8px; }
                    .term-btn { width: 12px; height: 12px; border-radius: 50%; }
                    .term-body { padding: 40px; }
                    
                    .dev-prompt { color: #f8206d; }
                    .dev-cmd { color: #00ff41; margin-left: 10px; }
                    .dev-res { color: #fff; margin: 15px 0 30px 25px; }
                    
                    .dev-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
                    .dev-project { border: 1px solid #333; padding: 20px; border-radius: 8px; transition: 0.2s; }
                    .dev-project:hover { background: rgba(0,255,65,0.05); border-color: #00ff41; }
                    .proj-name { font-weight: bold; color: #00ff41; margin-bottom: 8px; display: block; }
                    .proj-desc { color: #888; font-size: 0.9rem; }
                    
                    .blink { animation: blink 1s infinite; }
                    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
                </style>
                <div class="dev-terminal">
                    <div class="term-header">
                        <div class="term-btns">
                            <div class="term-btn" style="background: #ff5f56;"></div>
                            <div class="term-btn" style="background: #ffbd2e;"></div>
                            <div class="term-btn" style="background: #27c93f;"></div>
                        </div>
                        <div style="color: #666; font-size: 0.8rem;">trevor@vps-main:~</div>
                    </div>
                    <div class="term-body">
                        <div><span class="dev-prompt">➜</span> <span class="dev-cmd">whoami</span></div>
                        <div class="dev-res">
                            Trevor. Fullstack Engineer focused on high-performance web systems and AI integration.
                        </div>
                        
                        <div><span class="dev-prompt">➜</span> <span class="dev-cmd">ls projects/featured</span></div>
                        <div class="dev-res dev-grid">
                            <div class="dev-project">
                                <span class="proj-name">Skyline-AI</span>
                                <p class="proj-desc">Autonomous trading bot using reinforcement learning.</p>
                            </div>
                            <div class="dev-project">
                                <span class="proj-name">Nexus-Framework</span>
                                <p class="proj-desc">Edge-optimized React framework for low-latency apps.</p>
                            </div>
                        </div>
                        
                        <div><span class="dev-prompt">➜</span> <span class="dev-cmd">cat tech-stack.json</span></div>
                        <div class="dev-res">
                            {
                                "languages": ["TypeScript", "Rust", "Go", "Python"],
                                "frontend": ["React", "Next.js", "Three.js"],
                                "backend": ["Node.js", "PostgreSQL", "Redis"]
                            }
                        </div>
                        
                        <div><span class="dev-prompt">➜</span> <span class="dev-cmd">contact --email</span></div>
                        <div class="dev-res">
                            Opening mailto:dev@trevor.sh...
                        </div>
                        
                        <div><span class="dev-prompt">➜</span> <span class="blink">_</span></div>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'pb-designer',
        label: 'Designer Showcase',
        icon: Palette,
        category: 'personal-brand',
        content: `
            <div class="ds-container">
                <style>
                    .ds-container { font-family: 'Space Grotesk', sans-serif; background: #000; color: #fff; overflow-x: hidden; }
                    .ds-nav { padding: 40px; display: flex; justify-content: space-between; mix-blend-mode: difference; position: fixed; width: 100%; top: 0; z-index: 100; box-sizing: border-box; }
                    .ds-logo { font-weight: 800; font-size: 1.5rem; letter-spacing: -0.05em; }
                    
                    .ds-hero { height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 0 8%; }
                    .ds-hero-title { font-size: clamp(4rem, 15vw, 12rem); font-weight: 900; line-height: 0.85; letter-spacing: -0.06em; text-transform: uppercase; }
                    .ds-scroll { position: absolute; bottom: 40px; right: 40px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem; }
                    
                    .ds-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; padding: 80px 40px; }
                    .ds-item { grid-column: span 6; margin-bottom: 80px; }
                    .ds-item.wide { grid-column: span 12; }
                    .ds-img-wrap { aspect-ratio: 16/10; background: #1a1a1a; margin-bottom: 24px; position: relative; overflow: hidden; border-radius: 4px; }
                    .ds-item-title { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
                    .ds-item-meta { color: #666; font-weight: 500; }
                    
                    .ds-cta { padding: 150px 8%; text-align: center; }
                    .ds-cta-title { font-size: 5rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 40px; }
                    .ds-link { font-size: 2.5rem; font-weight: 800; color: #fff; text-decoration: none; border-bottom: 4px solid #fff; padding-bottom: 8px; }
                </style>
                <nav class="ds-nav">
                    <div class="ds-logo">M.STUDIO</div>
                    <div>Menu</div>
                </nav>
                <section class="ds-hero">
                    <h1 class="ds-hero-title">Visual<br/>Explorer</h1>
                    <div class="ds-scroll">Scroll — Down</div>
                </section>
                <div class="ds-grid">
                    <div class="ds-item">
                        <div class="ds-img-wrap"></div>
                        <h3 class="ds-item-title">Ethereal Motion</h3>
                        <p class="ds-item-meta">Art Direction / 3D Design</p>
                    </div>
                    <div class="ds-item">
                        <div class="ds-img-wrap"></div>
                        <h3 class="ds-item-title">Quiet Minimal</h3>
                        <p class="ds-item-meta">Photography / Print</p>
                    </div>
                    <div class="ds-item wide">
                        <div class="ds-img-wrap" style="aspect-ratio: 21/9;"></div>
                        <h3 class="ds-item-title">Future Archive</h3>
                        <p class="ds-item-meta">Exhibition Design / Digital</p>
                    </div>
                </div>
                <section class="ds-cta">
                    <h2 class="ds-cta-title">Ready to create?</h2>
                    <a href="#" class="ds-link">Start a project</a>
                </section>
            </div>
        `
    },
    {
        id: 'pb-resume',
        label: 'Modern Resume',
        icon: FileText,
        category: 'personal-brand',
        content: `
            <div class="res-container">
                <style>
                    .res-container { font-family: 'Inter', sans-serif; background: #fff; color: #1f2937; padding: 60px 5%; height: 100%; box-sizing: border-box; }
                    .res-wrapper { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: 280px 1fr; gap: 80px; }
                    
                    .res-sidebar { border-right: 1px solid #f3f4f6; padding-right: 40px; }
                    .res-avatar { width: 100px; height: 100px; background: #e5e7eb; border-radius: 50%; margin-bottom: 24px; }
                    .res-name { font-size: 2rem; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.02em; }
                    .res-role { color: #6366f1; font-weight: 600; font-size: 0.95rem; margin-bottom: 24px; display: block; }
                    
                    .res-sec { margin-bottom: 40px; }
                    .res-sec-title { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 20px; display: block; }
                    
                    .exp-item { margin-bottom: 32px; }
                    .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
                    .exp-role { font-weight: 700; font-size: 1.1rem; }
                    .exp-date { font-size: 0.85rem; color: #6b7280; font-weight: 500; }
                    .exp-company { font-weight: 600; color: #4b5563; font-size: 0.95rem; margin-bottom: 12px; display: block; }
                    .exp-desc { color: #4b5563; font-size: 0.95rem; margin-bottom: 0; padding-left: 15px; border-left: 2px solid #f3f4f6; }
                    
                    .skill-grid { display: grid; gap: 10px; }
                    .skill-item { font-size: 0.9rem; font-weight: 500; display: flex; justify-content: space-between; }
                </style>
                <div class="res-wrapper">
                    <aside class="res-sidebar">
                        <div class="res-avatar"></div>
                        <h1 class="res-name">Elena Rodriguez</h1>
                        <span class="res-role">Project Manager</span>
                        
                        <div class="res-sec" style="margin-top: 60px;">
                            <span class="res-sec-title">Contact</span>
                            <div style="font-size: 0.9rem; display: flex; flex-direction: column; gap: 12px;">
                                <div>hello@elena.com</div>
                                <div>+1 234 567 890</div>
                                <div>Boston, MA</div>
                            </div>
                        </div>
                        
                        <div class="res-sec">
                            <span class="res-sec-title">Skills</span>
                            <div class="skill-grid">
                                <div class="skill-item">Agile / Scrum <span>●●●●○</span></div>
                                <div class="skill-item">Team Lead <span>●●●●●</span></div>
                                <div class="skill-item">Jira / Asana <span>●●●●○</span></div>
                            </div>
                        </div>
                    </aside>
                    <main>
                        <section class="res-sec">
                            <span class="res-sec-title">Profile</span>
                            <p style="font-size: 1.1rem; line-height: 1.7; color: #374151;">Results-driven Project Manager with 7+ years of experience leading cross-functional teams in high-growth tech environments. Proven track record of delivering complex digital products ahead of schedule.</p>
                        </section>
                        
                        <section class="res-sec">
                            <span class="res-sec-title">Experience</span>
                            <div class="exp-item">
                                <div class="exp-header">
                                    <span class="exp-role">Senior Project Manager</span>
                                    <span class="exp-date">2021 — Present</span>
                                </div>
                                <span class="exp-company">Global Tech Solutions</span>
                                <p class="exp-desc">Managing a team of 15 designers and developers. Increased delivery efficiency by 25% through agile process optimization.</p>
                            </div>
                            <div class="exp-item">
                                <div class="exp-header">
                                    <span class="exp-role">Digital Producer</span>
                                    <span class="exp-date">2018 — 2021</span>
                                </div>
                                <span class="exp-company">Creative Pulse Agency</span>
                                <p class="exp-desc">Led 20+ award-winning marketing campaigns for Fortune 500 clients including Nike and Apple.</p>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        `
    }
]
