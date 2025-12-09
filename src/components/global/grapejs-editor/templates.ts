export const templates: Record<string, string> = {
    // Template 1: Agency Portfolio
    t1: `
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.nav-logo { font-size: 24px; font-weight: 700; color: #333; }
.nav-links { display: flex; gap: 20px; }
.nav-link { text-decoration: none; color: #666; }
.nav-link-active { text-decoration: none; color: #007bff; font-weight: 600; }
.hero { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 100px 20px; text-align: center; }
.hero-content { max-width: 800px; margin: 0 auto; }
.hero-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color: #2d3748; }
.hero-text { font-size: 1.25rem; color: #4a5568; margin-bottom: 40px; line-height: 1.6; }
.hero-buttons { display: flex; gap: 15px; justify-content: center; }
.btn-primary { padding: 15px 30px; background: #007bff; color: white; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; }
.btn-secondary { padding: 15px 30px; background: white; color: #007bff; border: 1px solid #007bff; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; }
.section { padding: 80px 20px; background: #fff; }
.section-title { text-align: center; font-size: 2.5rem; color: #333; margin-bottom: 60px; }
.container { max-width: 1200px; margin: 0 auto; }
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
.card { padding: 30px; border-radius: 12px; background: #f8f9fa; }
.card-icon { width: 50px; height: 50px; background: #e3f2fd; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: #007bff; font-weight: bold; font-size: 24px; }
.card-title { font-size: 1.5rem; margin-bottom: 15px; color: #333; }
.card-text { color: #666; line-height: 1.6; }
.cta-section { padding: 80px 20px; background: #1a202c; color: white; }
.cta-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
.cta-title { font-size: 2.5rem; margin-bottom: 20px; }
.cta-text { font-size: 1.1rem; color: #cbd5e0; margin-bottom: 30px; }
.form-box { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 12px; backdrop-filter: blur(10px); }
.form-title { font-size: 1.5rem; margin-bottom: 20px; }
.form-input { padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; width: 100%; margin-bottom: 15px; }
.btn-light { width: 100%; padding: 12px; background: white; color: #1a202c; font-weight: bold; border-radius: 6px; border: none; cursor: pointer; }
.footer { background: #111; color: #718096; padding: 40px 20px; text-align: center; }
</style>

<nav class="nav">
    <div class="nav-logo">Agency.</div>
    <div class="nav-links">
        <a href="#" class="nav-link">Work</a>
        <a href="#" class="nav-link">Services</a>
        <a href="#" class="nav-link">About</a>
        <a href="#" class="nav-link-active">Contact</a>
    </div>
</nav>

<header class="hero">
    <div class="hero-content">
        <h1 class="hero-title">We Build Digital Experiences</h1>
        <p class="hero-text">We are a creative agency focused on crafting beautiful and functional websites that help brands grow.</p>
        <div class="hero-buttons">
            <button class="btn-primary">View Our Work</button>
            <button class="btn-secondary">Contact Us</button>
        </div>
    </div>
</header>

<section class="section">
    <div class="container">
        <h2 class="section-title">Our Expertise</h2>
        <div class="grid-3">
            <div class="card">
                <div class="card-icon">🎨</div>
                <h3 class="card-title">UI/UX Design</h3>
                <p class="card-text">Creating intuitive and visually stunning interfaces that users love to interact with.</p>
            </div>
            <div class="card">
                <div class="card-icon">💻</div>
                <h3 class="card-title">Web Development</h3>
                <p class="card-text">Building robust, scalable, and high-performance websites using the latest technologies.</p>
            </div>
            <div class="card">
                <div class="card-icon">📈</div>
                <h3 class="card-title">Digital Marketing</h3>
                <p class="card-text">Helping your brand reach the right audience with data-driven marketing strategies.</p>
            </div>
        </div>
    </div>
</section>

<section class="cta-section">
    <div class="cta-grid">
        <div>
            <h2 class="cta-title">Ready to start your next project?</h2>
            <p class="cta-text">Let's work together to bring your vision to life. Our team is ready to help you achieve your goals.</p>
            <button class="btn-primary">Get a Quote</button>
        </div>
        <div class="form-box">
            <h3 class="form-title">Contact Us</h3>
            <form>
                <input type="text" placeholder="Name" class="form-input" />
                <input type="email" placeholder="Email" class="form-input" />
                <button class="btn-light">Send Message</button>
            </form>
        </div>
    </div>
</section>

<footer class="footer">
    <p>&copy; 2024 Agency Name. All rights reserved.</p>
</footer>
`,

    // Template 2: SaaS Startup  
    t2: `
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.saas-nav { display: flex; justify-content: space-between; align-items: center; padding: 25px 50px; background: #fff; }
.saas-logo { font-size: 26px; font-weight: 800; color: #5850ec; }
.saas-nav-links { display: flex; gap: 30px; align-items: center; }
.saas-nav-link { text-decoration: none; color: #4a5568; font-weight: 500; }
.saas-btn { padding: 10px 20px; background: #5850ec; color: white; border: none; border-radius: 50px; font-weight: 600; cursor: pointer; }
.saas-hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; padding: 60px 50px; max-width: 1400px; margin: 0 auto; }
.saas-badge { display: inline-block; padding: 8px 16px; background: #e0e7ff; color: #4338ca; border-radius: 50px; font-size: 0.9rem; font-weight: 600; margin-bottom: 20px; }
.saas-title { font-size: 4rem; line-height: 1.1; font-weight: 800; color: #1a202c; margin-bottom: 25px; }
.saas-text { font-size: 1.25rem; color: #4a5568; margin-bottom: 40px; max-width: 500px; }
.saas-buttons { display: flex; gap: 15px; }
.saas-btn-dark { padding: 15px 30px; background: #1a202c; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
.saas-btn-light { padding: 15px 30px; background: white; color: #4a5568; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; }
.saas-mockup { background: #f7fafc; border-radius: 20px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
.saas-card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
.saas-placeholder { width: 40px; height: 40px; background: #edf2f7; border-radius: 50%; }
.saas-bar { width: 120px; height: 10px; background: #edf2f7; border-radius: 5px; margin-bottom: 8px; }
.saas-box { height: 150px; background: #edf2f7; border-radius: 8px; }
.saas-logos { padding: 80px 20px; text-align: center; background: #fff; }
.saas-logos-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 60px; }
.saas-logos-grid { display: flex; justify-content: center; gap: 50px; opacity: 0.5; font-weight: 700; font-size: 1.5rem; color: #a0aec0; }
.saas-footer { background: white; border-top: 1px solid #e2e8f0; padding: 60px 20px; }
.saas-footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
.saas-footer-title { font-size: 20px; font-weight: 800; color: #5850ec; margin-bottom: 20px; }
.saas-footer-text { color: #718096; font-size: 0.9rem; }
.saas-footer-heading { font-weight: 700; margin-bottom: 15px; }
.saas-footer-links { display: flex; flex-direction: column; gap: 10px; color: #4a5568; }
.saas-footer-link { text-decoration: none; color: inherit; }
</style>

<nav class="saas-nav">
    <div class="saas-logo">SaaSify</div>
    <div class="saas-nav-links">
        <a href="#" class="saas-nav-link">Features</a>
        <a href="#" class="saas-nav-link">Pricing</a>
        <a href="#" class="saas-nav-link">Testimonials</a>
        <button class="saas-btn">Sign Up</button>
    </div>
</nav>

<section class="saas-hero">
    <div>
        <span class="saas-badge">New v2.0 Released</span>
        <h1 class="saas-title">Manage your team's workflow effortlessly.</h1>
        <p class="saas-text">Streamline communication, track progress, and hit deadlines with our all-in-one platform designed for modern teams.</p>
        <div class="saas-buttons">
            <button class="saas-btn-dark">Start Free Trial</button>
            <button class="saas-btn-light">▶ Watch Demo</button>
        </div>
    </div>
    <div class="saas-mockup">
        <div class="saas-card">
            <div style="display: flex; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px;">
                <div class="saas-placeholder"></div>
                <div>
                    <div class="saas-bar"></div>
                    <div class="saas-bar" style="width: 80px;"></div>
                </div>
            </div>
            <div class="saas-box"></div>
        </div>
    </div>
</section>

<section class="saas-logos">
    <h2 class="saas-logos-title">Trusted by over 10,000 teams</h2>
    <div class="saas-logos-grid">
        <div>LOGOIPSUM</div>
        <div>COMPANY</div>
        <div>BRANDNAME</div>
        <div>STARTUP</div>
    </div>
</section>

<footer class="saas-footer">
    <div class="saas-footer-grid">
        <div>
            <div class="saas-footer-title">SaaSify</div>
            <p class="saas-footer-text">Making work easier for everyone.</p>
        </div>
        <div>
            <h4 class="saas-footer-heading">Product</h4>
            <div class="saas-footer-links">
                <a href="#" class="saas-footer-link">Features</a>
                <a href="#" class="saas-footer-link">Pricing</a>
            </div>
        </div>
        <div>
            <h4 class="saas-footer-heading">Company</h4>
            <div class="saas-footer-links">
                <a href="#" class="saas-footer-link">About</a>
                <a href="#" class="saas-footer-link">Careers</a>
            </div>
        </div>
        <div>
            <h4 class="saas-footer-heading">Legal</h4>
            <div class="saas-footer-links">
                <a href="#" class="saas-footer-link">Privacy</a>
                <a href="#" class="saas-footer-link">Terms</a>
            </div>
        </div>
    </div>
</footer>
`,

    // Continue with remaining templates in next message due to length...
    t3: `<style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Inter', sans-serif; } .store-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #fff; border-bottom: 1px solid #eee; } .store-logo { font-size: 24px; font-weight: 700; color: #000; letter-spacing: -1px; } .store-nav-links { display: flex; gap: 30px; align-items: center; } .store-link { text-decoration: none; color: #666; } .store-link-active { text-decoration: none; color: #000; } .store-hero { background: #f4f4f4; height: 600px; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; overflow: hidden; } .store-hero-content { position: relative; z-index: 10; max-width: 600px; } .store-badge { font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 15px; display: block; } .store-hero-title { font-size: 4.5rem; font-weight: 900; margin-bottom: 20px; line-height: 1; } .store-hero-text { font-size: 1.1rem; color: #444; margin-bottom: 40px; } .store-btn { padding: 16px 40px; background: #000; color: white; border: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; } .store-section { padding: 80px 40px; } .store-header { display: flex; justify-content: space-between; align-items: end; margin-bottom: 50px; } .store-title { font-size: 2.5rem; font-weight: 700; } .store-link-underline { text-decoration: none; color: #000; border-bottom: 1px solid #000; padding-bottom: 2px; } .store-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px; } .store-product-img { background: #f8f8f8; aspect-ratio: 3/4; border-radius: 4px; margin-bottom: 15px; position: relative; display: flex; align-items: center; justify-content: center; font-size: 3rem; } .store-badge-new { position: absolute; top: 15px; left: 15px; background: #000; color: white; padding: 4px 10px; font-size: 0.75rem; text-transform: uppercase; } .store-product-title { font-size: 1rem; margin-bottom: 5px; font-weight: 600; } .store-product-price { color: #666; } .store-newsletter { background: #000; color: white; padding: 100px 20px; text-align: center; } .store-newsletter-title { font-size: 2.5rem; margin-bottom: 20px; } .store-newsletter-text { color: #999; margin-bottom: 40px; max-width: 400px; margin-left: auto; margin-right: auto; } .store-newsletter-form { display: flex; justify-content: center; gap: 10px; max-width: 500px; margin: 0 auto; } .store-input { padding: 15px; border: none; border-radius: 4px; flex: 1; outline: none; } .store-btn-white { padding: 15px 30px; background: #fff; color: #000; border: none; font-weight: 700; border-radius: 4px; cursor: pointer; } .store-footer { padding: 60px 40px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; } .store-footer-text { font-size: 0.9rem; color: #666; }</style><nav class="store-nav"><div class="store-logo">STORE.</div><div class="store-nav-links"><a href="#" class="store-link-active">New Arrivals</a><a href="#" class="store-link">Men</a><a href="#" class="store-link">Women</a><a href="#" class="store-link">Accessories</a><div style="display: flex; gap: 15px;"><span>🔍</span><span>🛒 (0)</span></div></div></nav><header class="store-hero"><div class="store-hero-content"><span class="store-badge">Summer Collection 2024</span><h1 class="store-hero-title">ELEVATE<br>YOUR STYLE</h1><p class="store-hero-text">Discover the new season essentials designed for the modern individual.</p><button class="store-btn">Shop Now</button></div></header><section class="store-section"><div class="store-header"><h2 class="store-title">Featured Products</h2><a href="#" class="store-link-underline">View All</a></div><div class="store-grid"><div><div class="store-product-img"><span>🧥</span><span class="store-badge-new">New</span></div><h3 class="store-product-title">Classic Trench Coat</h3><p class="store-product-price">$189.00</p></div><div><div class="store-product-img"><span>👟</span></div><h3 class="store-product-title">Urban Sneakers</h3><p class="store-product-price">$125.00</p></div><div><div class="store-product-img"><span>👜</span></div><h3 class="store-product-title">Leather Tote</h3><p class="store-product-price">$245.00</p></div><div><div class="store-product-img"><span>🕶️</span></div><h3 class="store-product-title">Aviator Sunglasses</h3><p class="store-product-price">$150.00</p></div></div></section><section class="store-newsletter"><h2 class="store-newsletter-title">Join our Newsletter</h2><p class="store-newsletter-text">Sign up for exclusive offers, new arrivals, and style inspiration sent directly to your inbox.</p><div class="store-newsletter-form"><input type="email" placeholder="Your email address" class="store-input"><button class="store-btn-white">Subscribe</button></div></section><footer class="store-footer"><div class="store-logo">STORE.</div><div class="store-footer-text">&copy; 2024 Store Inc.</div></footer>`,

    t4: `<style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: Georgia, serif; } .rest-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #2d1810; color: #f5e6d3; } .rest-logo { font-size: 28px; font-weight: 700; } .rest-nav-links { display: flex; gap: 25px; } .rest-link { text-decoration: none; color: #f5e6d3; } .rest-hero { background: linear-gradient(rgba(45, 24, 16, 0.7), rgba(45, 24, 16, 0.7)), #8b4513; padding: 120px 20px; text-align: center; color: #f5e6d3; } .rest-hero-title { font-size: 4rem; font-weight: 700; margin-bottom: 20px; } .rest-hero-text { font-size: 1.3rem; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; } .rest-btn { padding: 15px 35px; background: #d4af37; color: #2d1810; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; } .rest-section { padding: 80px 40px; background: #fff; } .rest-title { text-align: center; font-size: 2.5rem; margin-bottom: 60px; color: #2d1810; } .rest-menu { max-width: 900px; margin: 0 auto; } .rest-category { margin-bottom: 60px; } .rest-category-title { font-size: 2rem; margin-bottom: 30px; color: #8b4513; border-bottom: 2px solid #d4af37; padding-bottom: 10px; } .rest-item { display: flex; justify-content: space-between; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ddd; } .rest-item-title { font-size: 1.2rem; margin-bottom: 5px; } .rest-item-desc { color: #666; font-size: 0.9rem; } .rest-price { font-size: 1.2rem; font-weight: 600; color: #d4af37; } .rest-cta { padding: 80px 40px; background: #f5e6d3; text-align: center; } .rest-cta-title { font-size: 2.5rem; margin-bottom: 20px; color: #2d1810; } .rest-cta-text { font-size: 1.1rem; color: #666; margin-bottom: 40px; } .rest-btn-dark { padding: 15px 35px; background: #2d1810; color: #f5e6d3; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; } .rest-footer { background: #2d1810; color: #f5e6d3; padding: 40px 20px; text-align: center; }</style><nav class="rest-nav"><div class="rest-logo">Bella Cucina</div><div class="rest-nav-links"><a href="#" class="rest-link">Menu</a><a href="#" class="rest-link">Reservations</a><a href="#" class="rest-link">About</a><a href="#" class="rest-link">Contact</a></div></nav><header class="rest-hero"><h1 class="rest-hero-title">Authentic Italian Cuisine</h1><p class="rest-hero-text">Experience the taste of Italy in every bite. Fresh ingredients, traditional recipes, modern presentation.</p><button class="rest-btn">View Menu</button></header><section class="rest-section"><h2 class="rest-title">Our Menu</h2><div class="rest-menu"><div class="rest-category"><h3 class="rest-category-title">Appetizers</h3><div class="rest-item"><div><h4 class="rest-item-title">Bruschetta Classica</h4><p class="rest-item-desc">Toasted bread with tomatoes, garlic, and basil</p></div><span class="rest-price">$12</span></div><div class="rest-item"><div><h4 class="rest-item-title">Caprese Salad</h4><p class="rest-item-desc">Fresh mozzarella, tomatoes, and basil</p></div><span class="rest-price">$14</span></div></div><div class="rest-category"><h3 class="rest-category-title">Main Courses</h3><div class="rest-item"><div><h4 class="rest-item-title">Spaghetti Carbonara</h4><p class="rest-item-desc">Classic Roman pasta with eggs, cheese, and pancetta</p></div><span class="rest-price">$22</span></div><div class="rest-item"><div><h4 class="rest-item-title">Osso Buco</h4><p class="rest-item-desc">Braised veal shanks with vegetables and wine</p></div><span class="rest-price">$32</span></div></div></div></section><section class="rest-cta"><h2 class="rest-cta-title">Visit Us</h2><p class="rest-cta-text">123 Italian Street, Food District<br/>Open Daily: 11:00 AM - 10:00 PM</p><button class="rest-btn-dark">Make a Reservation</button></section><footer class="rest-footer"><p>&copy; 2024 Bella Cucina. All rights reserved.</p></footer>`,

    t5: `<style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Inter', sans-serif; } .port-nav { display: flex; justify-content: space-between; align-items: center; padding: 25px 50px; background: #fff; border-bottom: 1px solid #eee; } .port-logo { font-size: 24px; font-weight: 700; color: #111; } .port-nav-links { display: flex; gap: 30px; } .port-link { text-decoration: none; color: #666; } .port-link-active { text-decoration: none; color: #111; font-weight: 600; } .port-hero { padding: 100px 50px; background: #fafafa; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1200px; margin: 0 auto; } .port-badge { display: inline-block; padding: 6px 12px; background: #111; color: white; font-size: 0.85rem; margin-bottom: 20px; border-radius: 4px; } .port-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 25px; line-height: 1.1; color: #111; } .port-text { font-size: 1.1rem; color: #666; margin-bottom: 40px; line-height: 1.7; } .port-buttons { display: flex; gap: 15px; } .port-btn-dark { padding: 14px 28px; background: #111; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; } .port-btn-light { padding: 14px 28px; background: white; color: #111; border: 2px solid #111; border-radius: 6px; font-weight: 600; cursor: pointer; } .port-avatar { background: #e0e0e0; aspect-ratio: 1; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 4rem; } .port-section { padding: 80px 50px; background: #fff; } .port-section-title { text-align: center; font-size: 2.5rem; margin-bottom: 60px; font-weight: 700; } .port-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto; } .port-card { background: #f5f5f5; border-radius: 12px; overflow: hidden; } .port-card-img { aspect-ratio: 16/10; background: #ddd; display: flex; align-items: center; justify-content: center; font-size: 3rem; } .port-card-content { padding: 25px; } .port-card-title { font-size: 1.5rem; margin-bottom: 10px; font-weight: 600; } .port-card-text { color: #666; margin-bottom: 15px; } .port-card-link { color: #111; font-weight: 600; text-decoration: none; border-bottom: 2px solid #111; } .port-cta { padding: 80px 50px; background: #111; color: white; text-align: center; } .port-cta-title { font-size: 2.5rem; margin-bottom: 20px; font-weight: 700; } .port-cta-text { color: #999; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto; } .port-btn-white { padding: 15px 35px; background: white; color: #111; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; } .port-footer { padding: 40px 50px; background: #fafafa; text-align: center; color: #666; }</style><nav class="port-nav"><div class="port-logo">John Doe</div><div class="port-nav-links"><a href="#" class="port-link">About</a><a href="#" class="port-link">Work</a><a href="#" class="port-link">Skills</a><a href="#" class="port-link-active">Contact</a></div></nav><header class="port-hero"><div><span class="port-badge">DESIGNER & DEVELOPER</span><h1 class="port-title">Crafting Digital<br/>Experiences</h1><p class="port-text">I'm a creative professional specializing in web design and development. I help brands tell their stories through beautiful, functional digital products.</p><div class="port-buttons"><button class="port-btn-dark">View My Work</button><button class="port-btn-light">Download CV</button></div></div><div class="port-avatar">👨‍💻</div></header><section class="port-section"><h2 class="port-section-title">Featured Projects</h2><div class="port-grid"><div class="port-card"><div class="port-card-img">🎨</div><div class="port-card-content"><h3 class="port-card-title">Brand Identity Design</h3><p class="port-card-text">Complete visual identity for a tech startup</p><a href="#" class="port-card-link">View Project →</a></div></div><div class="port-card"><div class="port-card-img">💻</div><div class="port-card-content"><h3 class="port-card-title">E-commerce Platform</h3><p class="port-card-text">Custom online store with advanced features</p><a href="#" class="port-card-link">View Project →</a></div></div></div></section><section class="port-cta"><h2 class="port-cta-title">Let's Work Together</h2><p class="port-cta-text">Have a project in mind? Let's discuss how we can bring your ideas to life.</p><button class="port-btn-white">Get In Touch</button></section><footer class="port-footer"><p>&copy; 2024 John Doe. All rights reserved.</p></footer>`,

    t6: `<style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Inter', sans-serif; } .blog-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #fff; border-bottom: 2px solid #000; } .blog-logo { font-size: 28px; font-weight: 900; color: #000; letter-spacing: -1px; } .blog-nav-links { display: flex; gap: 25px; } .blog-link { text-decoration: none; color: #666; } .blog-link-active { text-decoration: none; color: #000; font-weight: 600; } .blog-hero { padding: 80px 40px; background: #000; color: white; } .blog-hero-content { max-width: 800px; margin: 0 auto; } .blog-badge { display: inline-block; padding: 6px 12px; background: #ff6b6b; color: white; font-size: 0.8rem; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; } .blog-hero-title { font-size: 3.5rem; font-weight: 900; margin-bottom: 20px; line-height: 1.1; } .blog-hero-text { font-size: 1.2rem; color: #ccc; margin-bottom: 30px; } .blog-author { display: flex; gap: 20px; align-items: center; } .blog-avatar { width: 50px; height: 50px; background: #333; border-radius: 50%; } .blog-author-name { font-weight: 600; } .blog-author-meta { color: #999; font-size: 0.9rem; } .blog-section { padding: 80px 40px; background: #fff; } .blog-container { max-width: 1200px; margin: 0 auto; } .blog-section-title { font-size: 2rem; margin-bottom: 40px; font-weight: 700; } .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; } .blog-article { border-bottom: 3px solid #000; padding-bottom: 20px; } .blog-article-img { aspect-ratio: 16/10; background: #f0f0f0; margin-bottom: 20px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 3rem; } .blog-category { font-size: 0.75rem; color: #ff6b6b; font-weight: 700; text-transform: uppercase; } .blog-article-title { font-size: 1.4rem; margin: 10px 0; font-weight: 700; } .blog-article-text { color: #666; margin-bottom: 15px; line-height: 1.6; } .blog-article-link { color: #000; font-weight: 600; text-decoration: none; } .blog-newsletter { padding: 60px 40px; background: #f9f9f9; text-align: center; } .blog-newsletter-title { font-size: 2rem; margin-bottom: 15px; font-weight: 700; } .blog-newsletter-text { color: #666; margin-bottom: 30px; } .blog-newsletter-form { display: flex; justify-content: center; gap: 10px; max-width: 500px; margin: 0 auto; } .blog-input { padding: 14px 20px; border: 2px solid #000; border-radius: 4px; flex: 1; font-size: 1rem; } .blog-btn { padding: 14px 30px; background: #000; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; } .blog-footer { padding: 40px; background: #000; color: white; text-align: center; }</style><nav class="blog-nav"><div class="blog-logo">THE BLOG</div><div class="blog-nav-links"><a href="#" class="blog-link-active">Latest</a><a href="#" class="blog-link">Technology</a><a href="#" class="blog-link">Design</a><a href="#" class="blog-link">Culture</a></div></nav><header class="blog-hero"><div class="blog-hero-content"><span class="blog-badge">Featured</span><h1 class="blog-hero-title">The Future of Web Design: Trends to Watch in 2024</h1><p class="blog-hero-text">Exploring the cutting-edge techniques and technologies shaping the digital landscape.</p><div class="blog-author"><div class="blog-avatar"></div><div><div class="blog-author-name">Sarah Johnson</div><div class="blog-author-meta">Dec 8, 2024 · 5 min read</div></div></div></div></header><section class="blog-section"><div class="blog-container"><h2 class="blog-section-title">Latest Articles</h2><div class="blog-grid"><article class="blog-article"><div class="blog-article-img">📱</div><span class="blog-category">Technology</span><h3 class="blog-article-title">Mobile-First Design Principles</h3><p class="blog-article-text">Essential strategies for creating responsive mobile experiences...</p><a href="#" class="blog-article-link">Read More →</a></article><article class="blog-article"><div class="blog-article-img">🎨</div><span class="blog-category" style="color: #4ecdc4;">Design</span><h3 class="blog-article-title">Color Theory in UI Design</h3><p class="blog-article-text">How to choose the perfect color palette for your next project...</p><a href="#" class="blog-article-link">Read More →</a></article><article class="blog-article"><div class="blog-article-img">✨</div><span class="blog-category" style="color: #ffd93d;">Culture</span><h3 class="blog-article-title">Remote Work Revolution</h3><p class="blog-article-text">Adapting to the new normal of distributed teams and collaboration...</p><a href="#" class="blog-article-link">Read More →</a></article></div></div></section><section class="blog-newsletter"><h2 class="blog-newsletter-title">Subscribe to Our Newsletter</h2><p class="blog-newsletter-text">Get the latest articles delivered to your inbox weekly.</p><div class="blog-newsletter-form"><input type="email" placeholder="your@email.com" class="blog-input"><button class="blog-btn">Subscribe</button></div></section><footer class="blog-footer"><p>&copy; 2024 The Blog. All rights reserved.</p></footer>`,

    t7: `<style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Inter', sans-serif; } .fit-nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #000; color: white; } .fit-logo { font-size: 26px; font-weight: 900; color: #00ff88; } .fit-nav-links { display: flex; gap: 25px; align-items: center; } .fit-link { text-decoration: none; color: white; } .fit-btn { padding: 10px 20px; background: #00ff88; color: #000; border: none; border-radius: 4px; font-weight: 700; cursor: pointer; } .fit-hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 100px 40px; text-align: center; color: white; } .fit-hero-title { font-size: 4rem; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; } .fit-hero-text { font-size: 1.3rem; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; } .fit-btn-hero { padding: 18px 40px; background: #00ff88; color: #000; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: 700; cursor: pointer; text-transform: uppercase; } .fit-section { padding: 80px 40px; background: #fff; } .fit-title { text-align: center; font-size: 2.5rem; margin-bottom: 60px; font-weight: 900; text-transform: uppercase; } .fit-schedule { max-width: 1000px; margin: 0 auto; display: grid; gap: 20px; } .fit-class { display: grid; grid-template-columns: 100px 1fr 150px 100px; gap: 20px; padding: 25px; background: #f8f8f8; border-radius: 8px; align-items: center; } .fit-class-icon { font-size: 2.5rem; } .fit-class-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 5px; } .fit-class-desc { color: #666; } .fit-class-time { text-align: center; } .fit-class-day { font-weight: 700; } .fit-class-hour { color: #666; font-size: 0.9rem; } .fit-btn-book { padding: 10px 20px; background: #000; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; } .fit-pricing { padding: 80px 40px; background: #000; color: white; } .fit-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1200px; margin: 0 auto; } .fit-plan { background: #1a1a1a; padding: 40px; border-radius: 12px; text-align: center; } .fit-plan-name { font-size: 1.5rem; margin-bottom: 10px; font-weight: 700; } .fit-plan-price { font-size: 3rem; font-weight: 900; margin: 20px 0; color: #00ff88; } .fit-plan-period { font-size: 1rem; color: #666; } .fit-plan-features { list-style: none; padding: 0; margin: 30px 0; text-align: left; } .fit-plan-feature { padding: 10px 0; border-bottom: 1px solid #333; } .fit-btn-plan { width: 100%; padding: 15px; background: #333; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; } .fit-plan-featured { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); transform: scale(1.05); } .fit-badge { display: inline-block; padding: 4px 12px; background: #00ff88; color: #000; font-size: 0.75rem; font-weight: 700; border-radius: 20px; margin-bottom: 10px; } .fit-btn-featured { background: #00ff88; color: #000; } .fit-footer { padding: 40px; background: #000; color: #666; text-align: center; border-top: 1px solid #333; }</style><nav class="fit-nav"><div class="fit-logo">FITZONE</div><div class="fit-nav-links"><a href="#" class="fit-link">Classes</a><a href="#" class="fit-link">Trainers</a><a href="#" class="fit-link">Pricing</a><button class="fit-btn">Join Now</button></div></nav><header class="fit-hero"><h1 class="fit-hero-title">Transform Your Body</h1><p class="fit-hero-text">Join the ultimate fitness experience. Expert trainers, state-of-the-art equipment, and a community that motivates.</p><button class="fit-btn-hero">Start Free Trial</button></header><section class="fit-section"><h2 class="fit-title">Class Schedule</h2><div class="fit-schedule"><div class="fit-class" style="border-left: 5px solid #667eea;"><div class="fit-class-icon">💪</div><div><h3 class="fit-class-title">Strength Training</h3><p class="fit-class-desc">Build muscle and increase power</p></div><div class="fit-class-time"><div class="fit-class-day">Mon, Wed, Fri</div><div class="fit-class-hour">6:00 AM</div></div><button class="fit-btn-book">Book</button></div><div class="fit-class" style="border-left: 5px solid #00ff88;"><div class="fit-class-icon">🧘</div><div><h3 class="fit-class-title">Yoga Flow</h3><p class="fit-class-desc">Flexibility and mindfulness</p></div><div class="fit-class-time"><div class="fit-class-day">Tue, Thu</div><div class="fit-class-hour">7:00 PM</div></div><button class="fit-btn-book">Book</button></div><div class="fit-class" style="border-left: 5px solid #764ba2;"><div class="fit-class-icon">🏃</div><div><h3 class="fit-class-title">HIIT Cardio</h3><p class="fit-class-desc">High-intensity interval training</p></div><div class="fit-class-time"><div class="fit-class-day">Daily</div><div class="fit-class-hour">5:30 PM</div></div><button class="fit-btn-book">Book</button></div></div></section><section class="fit-pricing"><h2 class="fit-title">Membership Plans</h2><div class="fit-pricing-grid"><div class="fit-plan"><h3 class="fit-plan-name">Basic</h3><div class="fit-plan-price">$29<span class="fit-plan-period">/mo</span></div><ul class="fit-plan-features"><li class="fit-plan-feature">✓ Gym Access</li><li class="fit-plan-feature">✓ 2 Classes/Week</li><li class="fit-plan-feature">✓ Locker Room</li></ul><button class="fit-btn-plan">Choose Plan</button></div><div class="fit-plan fit-plan-featured"><span class="fit-badge">POPULAR</span><h3 class="fit-plan-name">Pro</h3><div class="fit-plan-price">$59<span class="fit-plan-period" style="opacity: 0.7;">/mo</span></div><ul class="fit-plan-features"><li class="fit-plan-feature" style="border-bottom: 1px solid rgba(255,255,255,0.2);">✓ Unlimited Access</li><li class="fit-plan-feature" style="border-bottom: 1px solid rgba(255,255,255,0.2);">✓ All Classes</li><li class="fit-plan-feature" style="border-bottom: 1px solid rgba(255,255,255,0.2);">✓ Personal Trainer</li><li class="fit-plan-feature" style="border-bottom: 1px solid rgba(255,255,255,0.2);">✓ Nutrition Plan</li></ul><button class="fit-btn-plan fit-btn-featured">Choose Plan</button></div><div class="fit-plan"><h3 class="fit-plan-name">Elite</h3><div class="fit-plan-price">$99<span class="fit-plan-period">/mo</span></div><ul class="fit-plan-features"><li class="fit-plan-feature">✓ Everything in Pro</li><li class="fit-plan-feature">✓ 24/7 Access</li><li class="fit-plan-feature">✓ Spa & Sauna</li><li class="fit-plan-feature">✓ Guest Passes</li></ul><button class="fit-btn-plan">Choose Plan</button></div></div></section><footer class="fit-footer"><p>&copy; 2024 FitZone. All rights reserved.</p></footer>`,
}
