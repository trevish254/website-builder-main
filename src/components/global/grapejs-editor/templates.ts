export const templates: Record<string, string> = {
    // Template 1: Agency Portfolio
    t1: `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
        <div style="font-size: 24px; font-weight: 700; color: #333;">Agency.</div>
        <div style="display: flex; gap: 20px;">
            <a href="#" style="text-decoration: none; color: #666;">Work</a>
            <a href="#" style="text-decoration: none; color: #666;">Services</a>
            <a href="#" style="text-decoration: none; color: #666;">About</a>
            <a href="#" style="text-decoration: none; color: #007bff; font-weight: 600;">Contact</a>
        </div>
    </nav>

    <header style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 100px 20px; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
            <h1 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color: #2d3748;">We Build Digital Experiences</h1>
            <p style="font-size: 1.25rem; color: #4a5568; margin-bottom: 40px; line-height: 1.6;">
                We are a creative agency focused on crafting beautiful and functional websites that help brands grow.
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button style="padding: 15px 30px; background: #007bff; color: white; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s;">
                    View Our Work
                </button>
                <button style="padding: 15px 30px; background: white; color: #007bff; border: 1px solid #007bff; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                    Contact Us
                </button>
            </div>
        </div>
    </header>

    <section style="padding: 80px 20px; background: #fff;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; font-size: 2.5rem; color: #333; margin-bottom: 60px;">Our Expertise</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
                <div style="padding: 30px; border-radius: 12px; background: #f8f9fa; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="width: 50px; height: 50px; background: #e3f2fd; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: #007bff; font-weight: bold; font-size: 24px;">🎨</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #333;">UI/UX Design</h3>
                    <p style="color: #666; line-height: 1.6;">Creating intuitive and visually stunning interfaces that users love to interact with.</p>
                </div>
                <div style="padding: 30px; border-radius: 12px; background: #f8f9fa; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="width: 50px; height: 50px; background: #e8f5e9; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: #2e7d32; font-weight: bold; font-size: 24px;">💻</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #333;">Web Development</h3>
                    <p style="color: #666; line-height: 1.6;">Building robust, scalable, and high-performance websites using the latest technologies.</p>
                </div>
                <div style="padding: 30px; border-radius: 12px; background: #f8f9fa; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="width: 50px; height: 50px; background: #fff3e0; border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: #ef6c00; font-weight: bold; font-size: 24px;">📈</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #333;">Digital Marketing</h3>
                    <p style="color: #666; line-height: 1.6;">Helping your brand reach the right audience with data-driven marketing strategies.</p>
                </div>
            </div>
        </div>
    </section>

    <section style="padding: 80px 20px; background: #1a202c; color: white;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;">
            <div>
                <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Ready to start your next project?</h2>
                <p style="font-size: 1.1rem; color: #cbd5e0; margin-bottom: 30px;">Let's work together to bring your vision to life. Our team is ready to help you achieve your goals.</p>
                <button style="padding: 15px 30px; background: #007bff; color: white; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                    Get a Quote
                </button>
            </div>
            <div style="background: rgba(255,255,255,0.1); padding: 40px; border-radius: 12px; backdrop-filter: blur(10px);">
                <h3 style="font-size: 1.5rem; margin-bottom: 20px;">Contact Us</h3>
                <form style="display: flex; flex-col; gap: 15px;">
                    <input type="text" placeholder="Name" style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; width: 100%; margin-bottom: 15px;" />
                    <input type="email" placeholder="Email" style="padding: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; width: 100%; margin-bottom: 15px;" />
                    <button style="width: 100%; padding: 12px; background: white; color: #1a202c; font-weight: bold; border-radius: 6px; border: none; cursor: pointer;">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <footer style="background: #111; color: #718096; padding: 40px 20px; text-align: center;">
        <p>&copy; 2024 Agency Name. All rights reserved.</p>
    </footer>
  `,

    // Template 2: SaaS Startup
    t2: `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 25px 50px; background: #fff;">
        <div style="font-size: 26px; font-weight: 800; color: #5850ec;">SaaSify</div>
        <div style="display: flex; gap: 30px; align-items: center;">
            <a href="#" style="text-decoration: none; color: #4a5568; font-weight: 500;">Features</a>
            <a href="#" style="text-decoration: none; color: #4a5568; font-weight: 500;">Pricing</a>
            <a href="#" style="text-decoration: none; color: #4a5568; font-weight: 500;">Testimonials</a>
            <button style="padding: 10px 20px; background: #5850ec; color: white; border: none; border-radius: 50px; font-weight: 600; cursor: pointer;">Sign Up</button>
        </div>
    </nav>

    <section style="display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; padding: 60px 50px; max-width: 1400px; margin: 0 auto;">
        <div>
            <span style="display: inline-block; padding: 8px 16px; background: #e0e7ff; color: #4338ca; border-radius: 50px; font-size: 0.9rem; font-weight: 600; margin-bottom: 20px;">New v2.0 Released</span>
            <h1 style="font-size: 4rem; line-height: 1.1; font-weight: 800; color: #1a202c; margin-bottom: 25px;">Manage your team's workflow effortlessly.</h1>
            <p style="font-size: 1.25rem; color: #4a5568; margin-bottom: 40px; max-width: 500px;">
                Streamline communication, track progress, and hit deadlines with our all-in-one platform designed for modern teams.
            </p>
            <div style="display: flex; gap: 15px;">
                <button style="padding: 15px 30px; background: #1a202c; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">Start Free Trial</button>
                <button style="padding: 15px 30px; background: white; color: #4a5568; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px;">
                    <span>▶</span> Watch Demo
                </button>
            </div>
        </div>
        <div style="background: #f7fafc; border-radius: 20px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
             <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px;">
                    <div style="width: 40px; height: 40px; background: #edf2f7; border-radius: 50%;"></div>
                    <div>
                        <div style="width: 120px; height: 10px; background: #edf2f7; border-radius: 5px; margin-bottom: 8px;"></div>
                        <div style="width: 80px; height: 10px; background: #edf2f7; border-radius: 5px;"></div>
                    </div>
                </div>
                <div style="height: 150px; background: #edf2f7; border-radius: 8px;"></div>
             </div>
        </div>
    </section>

    <section style="padding: 80px 20px; text-align: center; background: #fff;">
        <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 60px;">Trusted by over 10,000 teams</h2>
        <div style="display: flex; justify-content: center; gap: 50px; opacity: 0.5; font-weight: 700; font-size: 1.5rem; color: #a0aec0;">
            <div>LOGOIPSUM</div>
            <div>COMPANY</div>
            <div>BRANDNAME</div>
            <div>STARTUP</div>
        </div>
    </section>

    <footer style="background: white; border-top: 1px solid #e2e8f0; padding: 60px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px;">
            <div>
                <div style="font-size: 20px; font-weight: 800; color: #5850ec; margin-bottom: 20px;">SaaSify</div>
                <p style="color: #718096; font-size: 0.9rem;">Making work easier for everyone.</p>
            </div>
            <div>
                <h4 style="font-weight: 700; margin-bottom: 15px;">Product</h4>
                <div style="display: flex; flex-direction: column; gap: 10px; color: #4a5568;">
                    <a href="#" style="text-decoration: none; color: inherit;">Features</a>
                    <a href="#" style="text-decoration: none; color: inherit;">Pricing</a>
                </div>
            </div>
            <div>
                <h4 style="font-weight: 700; margin-bottom: 15px;">Company</h4>
                <div style="display: flex; flex-direction: column; gap: 10px; color: #4a5568;">
                    <a href="#" style="text-decoration: none; color: inherit;">About</a>
                    <a href="#" style="text-decoration: none; color: inherit;">Careers</a>
                </div>
            </div>
            <div>
                <h4 style="font-weight: 700; margin-bottom: 15px;">Legal</h4>
                <div style="display: flex; flex-direction: column; gap: 10px; color: #4a5568;">
                    <a href="#" style="text-decoration: none; color: inherit;">Privacy</a>
                    <a href="#" style="text-decoration: none; color: inherit;">Terms</a>
                </div>
            </div>
        </div>
    </footer>
  `,

    // Template 3: E-commerce Store
    t3: `
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #fff; border-bottom: 1px solid #eee;">
        <div style="font-size: 24px; font-weight: 700; color: #000; letter-spacing: -1px;">STORE.</div>
        <div style="display: flex; gap: 30px; align-items: center;">
            <a href="#" style="text-decoration: none; color: #000;">New Arrivals</a>
            <a href="#" style="text-decoration: none; color: #666;">Men</a>
            <a href="#" style="text-decoration: none; color: #666;">Women</a>
            <a href="#" style="text-decoration: none; color: #666;">Accessories</a>
            <div style="display: flex; gap: 15px;">
               <span>🔍</span>
               <span>🛒 (0)</span>
            </div>
        </div>
    </nav>

    <header style="background: #f4f4f4; height: 600px; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; overflow: hidden;">
        <div style="position: relative; z-index: 10; max-width: 600px;">
            <span style="font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 15px; display: block;">Summer Collection 2024</span>
            <h1 style="font-size: 4.5rem; font-weight: 900; margin-bottom: 20px; line-height: 1;">ELEVATE<br>YOUR STYLE</h1>
            <p style="font-size: 1.1rem; color: #444; margin-bottom: 40px;">Discover the new season essentials designed for the modern individual.</p>
            <button style="padding: 16px 40px; background: #000; color: white; border: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; transition: opacity 0.2s;">
                Shop Now
            </button>
        </div>
        <!-- Abstract Shape Background -->
        <div style="position: absolute; width: 600px; height: 600px; background: #e0e0e0; border-radius: 50%; opacity: 0.5; top: 50%; left: 50%; transform: translate(-50%, -50%); filter: blur(80px);"></div>
    </header>

    <section style="padding: 80px 40px;">
        <div style="display: flex; justify-content: space-between; align-items: end; margin-bottom: 50px;">
            <h2 style="font-size: 2.5rem; font-weight: 700;">Featured Products</h2>
            <a href="#" style="text-decoration: none; color: #000; border-bottom: 1px solid #000; padding-bottom: 2px;">View All</a>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 40px;">
            <!-- Product 1 -->
            <div>
                <div style="background: #f8f8f8; aspect-ratio: 3/4; border-radius: 4px; margin-bottom: 15px; position: relative; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 3rem;">🧥</span>
                    <span style="position: absolute; top: 15px; left: 15px; background: #000; color: white; padding: 4px 10px; font-size: 0.75rem; text-transform: uppercase;">New</span>
                </div>
                <h3 style="font-size: 1rem; margin-bottom: 5px; font-weight: 600;">Classic Trench Coat</h3>
                <p style="color: #666;">$189.00</p>
            </div>
            <!-- Product 2 -->
             <div>
                <div style="background: #f8f8f8; aspect-ratio: 3/4; border-radius: 4px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 3rem;">👟</span>
                </div>
                <h3 style="font-size: 1rem; margin-bottom: 5px; font-weight: 600;">Urban Sneakers</h3>
                <p style="color: #666;">$125.00</p>
            </div>
            <!-- Product 3 -->
             <div>
                <div style="background: #f8f8f8; aspect-ratio: 3/4; border-radius: 4px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 3rem;">👜</span>
                </div>
                <h3 style="font-size: 1rem; margin-bottom: 5px; font-weight: 600;">Leather Tote</h3>
                <p style="color: #666;">$245.00</p>
            </div>
             <!-- Product 4 -->
             <div>
                <div style="background: #f8f8f8; aspect-ratio: 3/4; border-radius: 4px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 3rem;">🕶️</span>
                </div>
                <h3 style="font-size: 1rem; margin-bottom: 5px; font-weight: 600;">Aviator Sunglasses</h3>
                <p style="color: #666;">$150.00</p>
            </div>
        </div>
    </section>

    <section style="background: #000; color: white; padding: 100px 20px; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Join our Newsletter</h2>
        <p style="color: #999; margin-bottom: 40px; max-width: 400px; margin-left: auto; margin-right: auto;">Sign up for exclusive offers, new arrivals, and style inspiration sent directly to your inbox.</p>
        <div style="display: flex; justify-content: center; gap: 10px; max-width: 500px; margin: 0 auto;">
            <input type="email" placeholder="Your email address" style="padding: 15px; border: none; border-radius: 4px; flex: 1; outline: none;">
            <button style="padding: 15px 30px; background: #fff; color: #000; border: none; font-weight: 700; border-radius: 4px; cursor: pointer;">Subscribe</button>
        </div>
    </section>

    <footer style="padding: 60px 40px; border-top: 1px solid #eee;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700;">STORE.</div>
            <div style="font-size: 0.9rem; color: #666;">&copy; 2024 Store Inc.</div>
        </div>
    </footer>
    `
}
