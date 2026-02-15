import {
    ShoppingBag,
    Search,
    Heart,
    ShoppingCart,
    Filter,
    ArrowRight,
    Star,
    LayoutGrid,
    List,
    ChevronDown,
    CreditCard,
    Truck,
    CheckCircle,
    User,
    Package
} from 'lucide-react'

export const ecommerceTemplates = [
    {
        id: 'ec-store-home',
        label: 'Store Homepage',
        icon: ShoppingBag,
        category: 'ecommerce-pages',
        content: `
            <div class="ec-container">
                <style>
                    .ec-container { font-family: 'Outfit', sans-serif; color: #111; background: #fff; line-height: 1.5; }
                    .ec-nav-top { background: #000; color: #fff; text-align: center; padding: 10px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em; }
                    .ec-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 100; background: #fff; }
                    .ec-logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.05em; }
                    .ec-nav { display: flex; gap: 32px; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
                    .ec-header-actions { display: flex; gap: 24px; align-items: center; }
                    
                    .ec-hero { height: 80vh; background: #f5f5f5; display: flex; align-items: center; padding: 0 5%; position: relative; overflow: hidden; }
                    .ec-hero-content { max-width: 600px; position: relative; z-index: 2; }
                    .ec-hero-label { font-weight: 700; color: #ff4d00; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 16px; display: block; }
                    .ec-hero-title { font-size: 5rem; font-weight: 900; line-height: 1; margin-bottom: 24px; letter-spacing: -0.02em; }
                    .ec-hero-btn { background: #000; color: #fff; padding: 18px 40px; text-decoration: none; font-weight: 700; text-transform: uppercase; font-size: 0.9rem; display: inline-block; }
                    .ec-hero-img-placeholder { position: absolute; right: 0; top: 0; width: 50%; height: 100%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: #999; font-weight: 800; font-size: 2rem; }
                    
                    .ec-section { padding: 80px 5%; }
                    .ec-section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
                    .ec-section-title { font-size: 2.5rem; font-weight: 800; }
                    .ec-view-all { font-weight: 700; text-decoration: underline; font-size: 0.9rem; }
                    
                    .ec-cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                    .ec-cat-card { height: 400px; background: #eee; position: relative; display: flex; align-items: flex-end; padding: 40px; overflow: hidden; }
                    .ec-cat-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); }
                    .ec-cat-name { color: #fff; font-size: 2rem; font-weight: 800; position: relative; z-index: 1; }
                    
                    .ec-prod-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
                    .ec-prod-card { display: flex; flex-direction: column; gap: 16px; cursor: pointer; }
                    .ec-prod-img { aspect-ratio: 1/1.2; background: #f9f9f9; width: 100%; border-radius: 4px; display: flex; align-items: center; justify-content: center; position: relative; }
                    .ec-prod-badge { position: absolute; top: 12px; left: 12px; background: #000; color: #fff; padding: 4px 10px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
                    .ec-prod-title { font-weight: 700; font-size: 1.1rem; }
                    .ec-prod-price { color: #666; font-weight: 500; }
                    
                    .ec-newsletter { background: #000; color: #fff; padding: 100px 5%; text-align: center; }
                    .ec-news-title { font-size: 3.5rem; font-weight: 900; margin-bottom: 24px; }
                    .ec-news-form { display: flex; max-width: 600px; margin: 40px auto 0; border-bottom: 2px solid #fff; padding-bottom: 10px; }
                    .ec-news-input { background: transparent; border: none; color: #fff; flex: 1; font-size: 1.25rem; outline: none; }
                    .ec-news-btn { background: transparent; border: none; color: #fff; font-weight: 700; text-transform: uppercase; cursor: pointer; }
                    
                    .ec-footer { padding: 80px 5% 40px; background: #fcfcfc; }
                    .ec-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 80px; }
                    .ec-footer-logo { font-size: 1.5rem; font-weight: 900; margin-bottom: 24px; display: block; }
                    .ec-footer-links { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; }
                    .ec-footer-links a { text-decoration: none; color: #666; font-size: 0.9rem; }
                </style>
                <div class="ec-nav-top">FREE WORLDWIDE SHIPPING ON ORDERS OVER $200</div>
                <header class="ec-header">
                    <div class="ec-logo">MODERN.SKN</div>
                    <nav class="ec-nav">
                        <a href="#">Shop All</a>
                        <a href="#">New Arrivals</a>
                        <a href="#">Collections</a>
                        <a href="#">About</a>
                    </nav>
                    <div class="ec-header-actions">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                        <div style="position: relative;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            <span style="position: absolute; top: -8px; right: -8px; background: #ff4d00; color: #fff; font-size: 0.6rem; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800;">3</span>
                        </div>
                    </div>
                </header>
                <section class="ec-hero">
                    <div class="ec-hero-content">
                        <span class="ec-hero-label">The Summer Release</span>
                        <h1 class="ec-hero-title">Skincare for the Next Era.</h1>
                        <a href="#" class="ec-hero-btn">Shop Collection</a>
                    </div>
                    <div class="ec-hero-img-placeholder">HERO_IMAGE</div>
                </section>
                <section class="ec-section">
                    <div class="ec-section-header">
                        <h2 class="ec-section-title">Shop by Category</h2>
                        <a href="#" class="ec-view-all">Explore All</a>
                    </div>
                    <div class="ec-cat-grid">
                        <div class="ec-cat-card"><span class="ec-cat-name">Face</span></div>
                        <div class="ec-cat-card"><span class="ec-cat-name">Body</span></div>
                        <div class="ec-cat-card"><span class="ec-cat-name">Kits</span></div>
                    </div>
                </section>
                <section class="ec-section" style="background: #fafafa;">
                    <div class="ec-section-header">
                        <h2 class="ec-section-title">The Best Sellers</h2>
                    </div>
                    <div class="ec-prod-grid">
                        <div class="ec-prod-card">
                            <div class="ec-prod-img"><span class="ec-prod-badge">New</span></div>
                            <span class="ec-prod-title">Hydrating Facial Serum</span>
                            <span class="ec-prod-price">$48.00</span>
                        </div>
                        <div class="ec-prod-card">
                            <div class="ec-prod-img"></div>
                            <span class="ec-prod-title">Ceramide Cream</span>
                            <span class="ec-prod-price">$32.00</span>
                        </div>
                        <div class="ec-prod-card">
                            <div class="ec-prod-img"><span class="ec-prod-badge">Sale</span></div>
                            <span class="ec-prod-title">Clay Mask Set</span>
                            <span class="ec-prod-price">$24.00</span>
                        </div>
                        <div class="ec-prod-card">
                            <div class="ec-prod-img"></div>
                            <span class="ec-prod-title">Oil Cleanser</span>
                            <span class="ec-prod-price">$28.00</span>
                        </div>
                    </div>
                </section>
                <section class="ec-newsletter">
                    <h2 class="ec-news-title">Join the Inner Circle.</h2>
                    <p>15% off your first order when you sign up.</p>
                    <form class="ec-news-form">
                        <input class="ec-news-input" type="email" placeholder="Email Address"/>
                        <button class="ec-news-btn" type="submit">Subscribe</button>
                    </form>
                </section>
            </div>
        `
    },
    {
        id: 'ec-product-catalog',
        label: 'Product Catalog',
        icon: LayoutGrid,
        category: 'ecommerce-pages',
        content: `
            <div class="cat-container">
                <style>
                    .cat-container { font-family: 'Inter', sans-serif; color: #111; background: #fff; }
                    .cat-header { padding: 40px 5%; border-bottom: 1px solid #f0f0f0; }
                    .cat-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; }
                    .cat-crumbs { display: flex; gap: 8px; color: #888; font-size: 0.85rem; font-weight: 500; }
                    
                    .cat-layout { display: grid; grid-template-columns: 280px 1fr; gap: 60px; padding: 60px 5%; }
                    
                    .cat-filters { position: sticky; top: 120px; }
                    .filter-group { margin-bottom: 40px; }
                    .filter-title { font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; display: block; }
                    .filter-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; }
                    .filter-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; cursor: pointer; color: #444; }
                    .filter-item span:last-child { color: #aaa; font-size: 0.8rem; }
                    
                    .cat-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
                    .cat-count { font-weight: 600; color: #666; font-size: 0.9rem; }
                    .cat-sort { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; }
                    
                    .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 30px; }
                    .cat-item { display: flex; flex-direction: column; gap: 16px; }
                    .cat-item-img { aspect-ratio: 1/1; background: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 8px; }
                    .cat-item-info { display: flex; flex-direction: column; gap: 4px; }
                    .cat-item-name { font-weight: 600; font-size: 1.1rem; }
                    .cat-item-brand { color: #888; font-size: 0.85rem; font-weight: 500; }
                    .cat-item-price { font-weight: 700; font-size: 1.1rem; margin-top: 8px; }
                </style>
                <div class="cat-header">
                    <h1 class="cat-title">Living Room</h1>
                    <div class="cat-crumbs">Home / Furniture / Living Room</div>
                </div>
                <div class="cat-layout">
                    <aside class="cat-filters">
                        <div class="filter-group">
                            <span class="filter-title">Category</span>
                            <ul class="filter-list">
                                <li class="filter-item"><span>Sofas</span> <span>(12)</span></li>
                                <li class="filter-item"><span>Coffee Tables</span> <span>(8)</span></li>
                                <li class="filter-item"><span>Armchairs</span> <span>(15)</span></li>
                                <li class="filter-item"><span>Storage</span> <span>(6)</span></li>
                            </ul>
                        </div>
                        <div class="filter-group">
                            <span class="filter-title">Price</span>
                            <ul class="filter-list">
                                <li class="filter-item"><span>$0 - $500</span> <span>(24)</span></li>
                                <li class="filter-item"><span>$500 - $1500</span> <span>(10)</span></li>
                                <li class="filter-item"><span>$1500+</span> <span>(4)</span></li>
                            </ul>
                        </div>
                        <div class="filter-group">
                            <span class="filter-title">Color</span>
                            <div style="display: flex; gap: 10px;">
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: #000; cursor: pointer;"></div>
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: #8b4513; cursor: pointer;"></div>
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: #d3d3d3; cursor: pointer;"></div>
                                <div style="width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 1px solid #ddd; cursor: pointer;"></div>
                            </div>
                        </div>
                    </aside>
                    <main>
                        <div class="cat-controls">
                            <span class="cat-count">Showing 38 Products</span>
                            <div class="cat-sort">SORT BY: NEWEST <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg></div>
                        </div>
                        <div class="cat-grid">
                            <div class="cat-item">
                                <div class="cat-item-img"></div>
                                <div class="cat-item-info">
                                    <span class="cat-item-brand">HEMNES</span>
                                    <span class="cat-item-name">Velvet Armchair</span>
                                    <span class="cat-item-price">$899.00</span>
                                </div>
                            </div>
                            <div class="cat-item">
                                <div class="cat-item-img"></div>
                                <div class="cat-item-info">
                                    <span class="cat-item-brand">SKOVBY</span>
                                    <span class="cat-item-name">Minimal Oak Sofa</span>
                                    <span class="cat-item-price">$1,450.00</span>
                                </div>
                            </div>
                            <div class="cat-item">
                                <div class="cat-item-img"></div>
                                <div class="cat-item-info">
                                    <span class="cat-item-brand">NORDIC</span>
                                    <span class="cat-item-name">Round Coffee Table</span>
                                    <span class="cat-item-price">$420.00</span>
                                </div>
                            </div>
                            <div class="cat-item">
                                <div class="cat-item-img"></div>
                                <div class="cat-item-info">
                                    <span class="cat-item-brand">BOOMERANG</span>
                                    <span class="cat-item-name">Leather Ottoman</span>
                                    <span class="cat-item-price">$299.00</span>
                                </div>
                            </div>
                            <div class="cat-item">
                                <div class="cat-item-img"></div>
                                <div class="cat-item-info">
                                    <span class="cat-item-brand">HEMNES</span>
                                    <span class="cat-item-name">Floor Mirror</span>
                                    <span class="cat-item-price">$180.00</span>
                                </div>
                            </div>
                            <div class="cat-item">
                                <div class="cat-item-img"></div>
                                <div class="cat-item-info">
                                    <span class="cat-item-brand">VANGSTA</span>
                                    <span class="cat-item-name">Dining Chair</span>
                                    <span class="cat-item-price">$95.00</span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `
    },
    {
        id: 'ec-product-detail',
        label: 'Product Detail',
        icon: List,
        category: 'ecommerce-pages',
        content: `
            <div class="pd-container">
                <style>
                    .pd-container { font-family: 'Inter', sans-serif; color: #111; background: #fff; }
                    .pd-layout { display: grid; grid-template-columns: 1.2fr 1fr; gap: 80px; padding: 60px 8%; align-items: flex-start; }
                    
                    .pd-gallery { display: flex; flex-direction: column; gap: 20px; }
                    .pd-main-img { aspect-ratio: 1/1; background: #f9f9f9; border-radius: 12px; width: 100%; border: 1px solid #f0f0f0; }
                    .pd-thumbs { display: flex; gap: 16px; }
                    .pd-thumb { width: 100px; height: 100px; background: #f9f9f9; border-radius: 8px; border: 1px solid #f0f0f0; cursor: pointer; }
                    .pd-thumb.active { border: 2px solid #000; }
                    
                    .pd-info { display: flex; flex-direction: column; gap: 32px; position: sticky; top: 120px; }
                    .pd-title-box { display: flex; flex-direction: column; gap: 12px; }
                    .pd-brand { font-weight: 700; color: #666; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; }
                    .pd-title { font-size: 3rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.025em; }
                    .pd-price { font-size: 1.75rem; font-weight: 700; }
                    
                    .pd-options { display: flex; flex-direction: column; gap: 24px; border-top: 1px solid #f0f0f0; padding-top: 32px; }
                    .pd-label { font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 12px; display: block; }
                    .pd-size-grid { display: flex; gap: 10px; }
                    .pd-size-btn { width: 60px; height: 48px; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; }
                    .pd-size-btn.active { background: #000; color: #fff; border-color: #000; }
                    
                    .pd-actions { display: flex; gap: 16px; margin-top: 16px; }
                    .pd-add-btn { flex: 1; background: #000; color: #fff; height: 60px; border-radius: 8px; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.95rem; }
                    .pd-wish-btn { width: 60px; height: 60px; border: 1px solid #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                    
                    .pd-details { margin-top: 40px; border-top: 1px solid #f0f0f0; }
                    .pd-detail-item { border-bottom: 1px solid #f0f0f0; padding: 24px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
                    .pd-detail-label { font-weight: 700; font-size: 0.95rem; }
                </style>
                <div class="pd-layout">
                    <div class="pd-gallery">
                        <div class="pd-main-img"></div>
                        <div class="pd-thumbs">
                            <div class="pd-thumb active"></div>
                            <div class="pd-thumb"></div>
                            <div class="pd-thumb"></div>
                            <div class="pd-thumb"></div>
                        </div>
                    </div>
                    <div class="pd-info">
                        <div class="pd-title-box">
                            <span class="pd-brand">Studio Collection</span>
                            <h1 class="pd-title">Structured Wool Blend Coat</h1>
                            <div class="pd-price">$299.00</div>
                        </div>
                        <div class="pd-options">
                            <div>
                                <span class="pd-label">Color: Charcoal</span>
                                <div style="display: flex; gap: 12px;">
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #2f2f2f; border: 2px solid #000; padding: 2px; background-clip: content-box;"></div>
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #dcdcdc;"></div>
                                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #4a4a4a;"></div>
                                </div>
                            </div>
                            <div>
                                <span class="pd-label">Size</span>
                                <div class="pd-size-grid">
                                    <div class="pd-size-btn">S</div>
                                    <div class="pd-size-btn active">M</div>
                                    <div class="pd-size-btn">L</div>
                                    <div class="pd-size-btn">XL</div>
                                </div>
                            </div>
                            <div class="pd-actions">
                                <div class="pd-add-btn">Add to Bag</div>
                                <div class="pd-wish-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>
                            </div>
                        </div>
                        <div class="pd-details">
                            <div class="pd-detail-item">
                                <span class="pd-detail-label">Description</span>
                                <span>+</span>
                            </div>
                            <div class="pd-detail-item">
                                <span class="pd-detail-label">Composition & Care</span>
                                <span>+</span>
                            </div>
                            <div class="pd-detail-item">
                                <span class="pd-detail-label">Shipping & Returns</span>
                                <span>+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'ec-category-grid',
        label: 'Category Grid',
        icon: ChevronDown,
        category: 'ecommerce-pages',
        content: `
            <div class="cg-container">
                <style>
                    .cg-container { font-family: 'Outfit', sans-serif; padding: 100px 5%; background: #fff; }
                    .cg-header { text-align: center; margin-bottom: 80px; }
                    .cg-label { font-weight: 700; color: #888; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.2em; display: block; margin-bottom: 16px; }
                    .cg-title { font-size: 3.5rem; font-weight: 900; letter-spacing: -0.02em; }
                    
                    .cg-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
                    .cg-item { aspect-ratio: 1/1.4; background: #eee; position: relative; overflow: hidden; display: flex; align-items: flex-end; padding: 32px; text-decoration: none; border-radius: 8px; transition: transform 0.5s; }
                    .cg-item:hover { transform: scale(1.02); }
                    .cg-item::before { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); }
                    .cg-content { position: relative; z-index: 1; color: #fff; }
                    .cg-name { font-size: 1.75rem; font-weight: 800; display: block; margin-bottom: 4px; }
                    .cg-count { font-size: 0.85rem; font-weight: 600; opacity: 0.7; }
                    
                    .cg-item.large { grid-column: span 2; aspect-ratio: auto; }
                </style>
                <div class="cg-header">
                    <span class="cg-label">Our Collections</span>
                    <h2 class="cg-title">Curated Essentials.</h2>
                </div>
                <div class="cg-grid">
                    <a href="#" class="cg-item large">
                        <div class="cg-content">
                            <span class="cg-name">Summer 24</span>
                            <span class="cg-count">84 Items</span>
                        </div>
                    </a>
                    <a href="#" class="cg-item">
                        <div class="cg-content">
                            <span class="cg-name">Accessories</span>
                            <span class="cg-count">120 Items</span>
                        </div>
                    </a>
                    <a href="#" class="cg-item">
                        <div class="cg-content">
                            <span class="cg-name">Outerwear</span>
                            <span class="cg-count">48 Items</span>
                        </div>
                    </a>
                    <a href="#" class="cg-item">
                        <div class="cg-content">
                            <span class="cg-name">Footwear</span>
                            <span class="cg-count">32 Items</span>
                        </div>
                    </a>
                    <a href="#" class="cg-item large">
                        <div class="cg-content">
                            <span class="cg-name">Limited Edition</span>
                            <span class="cg-count">12 Items</span>
                        </div>
                    </a>
                    <a href="#" class="cg-item">
                        <div class="cg-content">
                            <span class="cg-name">New Jewelry</span>
                            <span class="cg-count">24 Items</span>
                        </div>
                    </a>
                </div>
            </div>
        `
    },
    {
        id: 'ec-cart-page',
        label: 'Shopping Cart',
        icon: ShoppingCart,
        category: 'ecommerce-pages',
        content: `
            <div class="cart-container">
                <style>
                    .cart-container { font-family: 'Inter', sans-serif; color: #111; padding: 60px 8%; background: #fff; }
                    .cart-title { font-size: 3rem; font-weight: 800; margin-bottom: 48px; letter-spacing: -0.02em; }
                    
                    .cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 60px; }
                    
                    .cart-items { border-top: 1px solid #eee; }
                    .cart-item { display: grid; grid-template-columns: 120px 1fr 120px 100px; gap: 32px; padding: 32px 0; border-bottom: 1px solid #eee; align-items: center; }
                    .cart-item-img { aspect-ratio: 1/1; background: #f9f9f9; border-radius: 8px; }
                    .cart-item-info { display: flex; flex-direction: column; gap: 8px; }
                    .cart-item-name { font-weight: 700; font-size: 1.1rem; }
                    .cart-item-meta { color: #888; font-size: 0.9rem; }
                    
                    .cart-qty { display: flex; align-items: center; gap: 12px; border: 1px solid #eee; padding: 10px; border-radius: 4px; width: fit-content; }
                    .cart-qty button { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
                    .cart-item-price { font-weight: 700; text-align: right; }
                    
                    .cart-summary { background: #f8fafc; padding: 40px; border-radius: 12px; position: sticky; top: 120px; }
                    .summary-title { font-weight: 800; font-size: 1.5rem; margin-bottom: 24px; display: block; }
                    .summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 0.95rem; color: #444; }
                    .summary-total { border-top: 1px solid #ddd; padding-top: 24px; margin-top: 24px; font-weight: 800; font-size: 1.25rem; color: #000; display: flex; justify-content: space-between; }
                    
                    .checkout-btn { background: #000; color: #fff; width: 100%; padding: 20px; border-radius: 8px; font-weight: 700; text-transform: uppercase; margin-top: 32px; border: none; cursor: pointer; display: flex; justify-content: center; }
                </style>
                <h1 class="cart-title">Your Bag <span style="color: #888; font-weight: 500;">(3 Items)</span></h1>
                <div class="cart-layout">
                    <div class="cart-items">
                        <div class="cart-item">
                            <div class="cart-item-img"></div>
                            <div class="cart-item-info">
                                <span class="cart-item-name">Premium Cotton Tee</span>
                                <span class="cart-item-meta">Color: Black | Size: M</span>
                            </div>
                            <div class="cart-qty">
                                <button>−</button>
                                <span>1</span>
                                <button>+</button>
                            </div>
                            <div class="cart-item-price">$45.00</div>
                        </div>
                        <div class="cart-item">
                            <div class="cart-item-img"></div>
                            <div class="cart-item-info">
                                <span class="cart-item-name">Heavyweight Hoodie</span>
                                <span class="cart-item-meta">Color: Heather Grey | Size: L</span>
                            </div>
                            <div class="cart-qty">
                                <button>−</button>
                                <span>1</span>
                                <button>+</button>
                            </div>
                            <div class="cart-item-price">$120.00</div>
                        </div>
                    </div>
                    <aside class="cart-summary">
                        <span class="summary-title">Summary</span>
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>$165.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Estimated Shipping</span>
                            <span>$12.00</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax</span>
                            <span>$13.20</span>
                        </div>
                        <div class="summary-total">
                            <span>Total</span>
                            <span>$190.20</span>
                        </div>
                        <button class="checkout-btn">Checkout Now</button>
                    </aside>
                </div>
            </div>
        `
    },
    {
        id: 'ec-checkout-page',
        label: 'Checkout Page',
        icon: CreditCard,
        category: 'ecommerce-pages',
        content: `
            <div class="ck-container">
                <style>
                    .ck-container { font-family: 'Inter', sans-serif; color: #111; background: #fff; padding: 60px 8%; }
                    .ck-layout { display: grid; grid-template-columns: 1fr 400px; gap: 80px; }
                    
                    .ck-section { margin-bottom: 60px; }
                    .ck-step-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 32px; display: flex; align-items: center; gap: 16px; }
                    .ck-step-num { width: 32px; height: 32px; background: #000; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
                    
                    .ck-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .ck-input-group { display: flex; flex-direction: column; gap: 8px; }
                    .ck-input-group.full { grid-column: span 2; }
                    .ck-label { font-size: 0.85rem; font-weight: 600; color: #666; }
                    .ck-input { padding: 14px; border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem; outline: none; }
                    
                    .ck-order-summary { background: #f9f9f9; padding: 40px; border-radius: 12px; height: fit-content; }
                    .ck-prod-list { list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 20px; }
                    .ck-prod-item { display: flex; gap: 16px; align-items: center; }
                    .ck-prod-img { width: 64px; height: 64px; background: #eee; border-radius: 4px; flex-shrink: 0; }
                    .ck-prod-info { flex: 1; }
                    .ck-prod-title { font-weight: 600; font-size: 0.9rem; }
                    .ck-prod-price { font-weight: 700; font-size: 0.9rem; }
                    
                    .ck-pay-options { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
                    .ck-pay-btn { display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; font-weight: 600; }
                    .ck-pay-btn.active { border: 2px solid #000; background: #fff; }
                </style>
                <div class="ck-layout">
                    <main>
                        <div class="ck-section">
                            <h2 class="ck-step-title"><span class="ck-step-num">1</span> Shipping Information</h2>
                            <form class="ck-form-grid">
                                <div class="ck-input-group"><label class="ck-label">First Name</label><input class="ck-input" type="text" placeholder="Jane"/></div>
                                <div class="ck-input-group"><label class="ck-label">Last Name</label><input class="ck-input" type="text" placeholder="Doe"/></div>
                                <div class="ck-input-group full"><label class="ck-label">Address</label><input class="ck-input" type="text" placeholder="123 Luxury Ave"/></div>
                                <div class="ck-input-group"><label class="ck-label">City</label><input class="ck-input" type="text" placeholder="Paris"/></div>
                                <div class="ck-input-group"><label class="ck-label">Postal Code</label><input class="ck-input" type="text" placeholder="75001"/></div>
                            </form>
                        </div>
                        <div class="ck-section">
                            <h2 class="ck-step-title"><span class="ck-step-num">2</span> Payment Method</h2>
                            <div class="ck-pay-options">
                                <div class="ck-pay-btn active"><span>Credit / Debit Card</span> <span>💳</span></div>
                                <div class="ck-pay-btn"><span>Paypal</span> <span>P</span></div>
                                <div class="ck-pay-btn"><span>Apple Pay</span> <span></span></div>
                            </div>
                        </div>
                    </main>
                    <aside class="ck-order-summary">
                        <h3 style="margin-bottom: 24px; font-weight: 800;">Order Summary</h3>
                        <ul class="ck-prod-list">
                            <li class="ck-prod-item">
                                <div class="ck-prod-img"></div>
                                <div class="ck-prod-info"><div class="ck-prod-title">Modern Skn Serum</div><div style="color: #888; font-size: 0.8rem;">Qty: 1</div></div>
                                <div class="ck-prod-price">$48.00</div>
                            </li>
                            <li class="ck-prod-item">
                                <div class="ck-prod-img"></div>
                                <div class="ck-prod-info"><div class="ck-prod-title">Ceramide Cream</div><div style="color: #888; font-size: 0.8rem;">Qty: 1</div></div>
                                <div class="ck-prod-price">$32.00</div>
                            </li>
                        </ul>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: 600;"><span>Subtotal</span> <span>$80.00</span></div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-weight: 600;"><span>Shipping</span> <span>FREE</span></div>
                        <div style="display: flex; justify-content: space-between; padding-top: 24px; border-top: 1px solid #ddd; font-weight: 800; font-size: 1.25rem;"><span>Total</span> <span>$80.00</span></div>
                        <button style="margin-top: 32px; width: 100%; background: #000; color: #fff; padding: 20px; border-radius: 8px; font-weight: 700; text-transform: uppercase;">Place Order</button>
                    </aside>
                </div>
            </div>
        `
    },
    {
        id: 'ec-order-success',
        label: 'Order Success',
        icon: CheckCircle,
        category: 'ecommerce-pages',
        content: `
            <div class="success-container">
                <style>
                    .success-container { font-family: 'Inter', sans-serif; height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 5%; }
                    .success-icon { width: 80px; height: 80px; background: #eafaf1; color: #2ecc71; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 32px; }
                    .success-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em; }
                    .success-desc { color: #666; font-size: 1.125rem; max-width: 500px; margin-bottom: 48px; line-height: 1.6; }
                    .order-num { font-weight: 700; color: #000; background: #f0f0f0; padding: 6px 12px; border-radius: 4px; }
                    
                    .success-actions { display: flex; gap: 16px; }
                    .btn-track { background: #000; color: #fff; padding: 16px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; }
                    .btn-home { background: #fff; color: #000; border: 1px solid #ddd; padding: 16px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; }
                </style>
                <div class="success-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h1 class="success-title">Order Confirmed!</h1>
                <p class="success-desc">Thank you for your purchase. We've sent a confirmation email to <span style="font-weight: 700; color: #000;">hello@user.com</span>. Your order <span class="order-num">#MSK-92815</span> is being processed.</p>
                <div class="success-actions">
                    <a href="#" class="btn-track">Track Order</a>
                    <a href="#" class="btn-home">Back to Shop</a>
                </div>
            </div>
        `
    },
    {
        id: 'ec-user-account',
        label: 'User Account',
        icon: User,
        category: 'ecommerce-pages',
        content: `
            <div class="acc-container">
                <style>
                    .acc-container { font-family: 'Inter', sans-serif; color: #111; background: #fff; padding: 60px 8%; }
                    .acc-header { margin-bottom: 60px; }
                    .acc-title { font-size: 2.5rem; font-weight: 800; }
                    
                    .acc-layout { display: grid; grid-template-columns: 240px 1fr; gap: 80px; }
                    .acc-nav { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; position: sticky; top: 120px; }
                    .acc-nav-link { text-decoration: none; color: #888; font-weight: 600; font-size: 1rem; padding: 12px 0; display: block; }
                    .acc-nav-link.active { color: #000; border-left: 3px solid #000; padding-left: 20px; }
                    
                    .acc-section { margin-bottom: 48px; }
                    .sec-title { display: block; font-size: 1.25rem; font-weight: 800; margin-bottom: 24px; }
                    .order-card { border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; transition: box-shadow 0.3s; }
                    .order-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    .status-badge { background: #f0f0f0; padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                    .status-shipped { background: #eafaf1; color: #2ecc71; }
                </style>
                <div class="acc-header">
                    <h1 class="acc-title">Hello, Trevor</h1>
                    <p style="color: #666;">Manage your orders, returns, and personal settings.</p>
                </div>
                <div class="acc-layout">
                    <nav>
                        <ul class="acc-nav">
                            <li><a href="#" class="acc-nav-link active">Order History</a></li>
                            <li><a href="#" class="acc-nav-link">Personal Info</a></li>
                            <li><a href="#" class="acc-nav-link">Wishlist</a></li>
                            <li><a href="#" class="acc-nav-link">Addresses</a></li>
                            <li><a href="#" class="acc-nav-link">Log Out</a></li>
                        </ul>
                    </nav>
                    <main>
                        <section class="acc-section">
                            <span class="sec-title">Recent Orders</span>
                            <div class="order-card">
                                <div>
                                    <div style="font-weight: 700; margin-bottom: 4px;">Order #MSK-92815</div>
                                    <div style="color: #888; font-size: 0.85rem;">March 12, 2024 • 3 Items • $190.20</div>
                                </div>
                                <div class="status-badge status-shipped">Shipped</div>
                            </div>
                            <div class="order-card">
                                <div>
                                    <div style="font-weight: 700; margin-bottom: 4px;">Order #MSK-91522</div>
                                    <div style="color: #888; font-size: 0.85rem;">Feb 28, 2024 • 1 Item • $45.00</div>
                                </div>
                                <div class="status-badge">Delivered</div>
                            </div>
                        </section>
                        <section class="acc-section">
                            <span class="sec-title">Account Settings</span>
                            <div style="background: #fafafa; padding: 32px; border-radius: 12px; display: flex; justify-content: space-between;">
                                <div>
                                    <div style="font-weight: 700;">Email Address</div>
                                    <div style="color: #666;">trevor@example.com</div>
                                </div>
                                <button style="background: none; border: 1px solid #ddd; padding: 8px 16px; border-radius: 6px; font-weight: 600;">Edit</button>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        `
    },
    {
        id: 'ec-wishlist',
        label: 'Wishlist Page',
        icon: Heart,
        category: 'ecommerce-pages',
        content: `
            <div class="wl-container">
                <style>
                    .wl-container { font-family: 'Inter', sans-serif; color: #111; padding: 60px 8%; background: #fff; }
                    .wl-header { margin-bottom: 60px; text-align: center; }
                    .wl-title { font-size: 3rem; font-weight: 800; margin-bottom: 12px; }
                    
                    .wl-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
                    .wl-item { border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; position: relative; }
                    .wl-remove { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                    .wl-img { aspect-ratio: 1/1; background: #f9f9f9; }
                    .wl-info { padding: 20px; text-align: center; }
                    .wl-name { font-weight: 700; display: block; margin-bottom: 8px; }
                    .wl-price { color: #888; font-weight: 600; font-size: 0.95rem; }
                    .wl-add { margin-top: 20px; width: 100%; padding: 12px; background: #000; color: #fff; border-radius: 6px; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; border: none; cursor: pointer; }
                </style>
                <div class="wl-header">
                    <h1 class="wl-title">Your Wishlist</h1>
                    <p style="color: #666;">Items you've saved for later. Prices and availability may change.</p>
                </div>
                <div class="wl-grid">
                    <div class="wl-item">
                        <span class="wl-remove">×</span>
                        <div class="wl-img"></div>
                        <div class="wl-info">
                            <span class="wl-name">Linen Button-Up</span>
                            <span class="wl-price">$68.00</span>
                            <button class="wl-add">Add to Bag</button>
                        </div>
                    </div>
                    <div class="wl-item">
                        <span class="wl-remove">×</span>
                        <div class="wl-img"></div>
                        <div class="wl-info">
                            <span class="wl-name">Tailored Trousers</span>
                            <span class="wl-price">$110.00</span>
                            <button class="wl-add">Add to Bag</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
]
