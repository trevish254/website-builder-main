import {
  Frame,
  Link2,
  Heading1,
  AlignLeft,
  List,
  Quote,
  FileImage,
  Film,
  FormInput,
  TextCursorInput,
  MousePointerClick,
  FileText,
  CreditCard,
  Sparkles,
  Megaphone,
  Mail,
  BoxSelect,
  AppWindow,
  ImagePlus,
  Tag,
  ChevronsDown,
  Circle,
  CheckSquare,
  Layers,
  LayoutGrid,
  Type,
  Image,
  Video,
  Building2,
  ShoppingBag,
  User,
  LayoutDashboard,
  Files,
  Filter,
  Compass,
  Menu,
  Navigation,
  PanelTop,
  Anchor,
  Zap,
  BarChart3,
  Monitor,
  Square,
  Puzzle,
  ListOrdered,
  Clock,
  ArrowRight,
  Briefcase,
  Check,
  UserPlus,
  Send,
  Plus,
  Minus,
  AlertCircle,
  Bell,
  Divide,
  Info,
  Table,
  Columns,
  Activity,
  MousePointer2,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  Play,
  Laptop,
  Smartphone,
  GalleryVertical
} from 'lucide-react'

// Custom Layout Icons based on user designs
export const SectionIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="5" height="18" rx="1" />
    <rect x="11" y="3" width="10" height="8" rx="1" />
    <rect x="11" y="13" width="10" height="8" rx="1" />
  </svg>
)

export const ThreeColumnsIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="5" height="18" rx="1" />
    <rect x="9.5" y="3" width="5" height="18" rx="1" />
    <rect x="17" y="3" width="5" height="18" rx="1" />
  </svg>
)

export const RowIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="2" width="18" height="5" rx="1" />
    <rect x="3" y="9.5" width="18" height="5" rx="1" />
    <rect x="3" y="17" width="18" height="5" rx="1" />
  </svg>
)

export const TwoColumnsIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="18" rx="1" />
    <rect x="14" y="3" width="7" height="18" rx="1" />
  </svg>
)

export const FourColumnsIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="4" height="18" rx="0.5" />
    <rect x="7.3" y="3" width="4" height="18" rx="0.5" />
    <rect x="12.6" y="3" width="4" height="18" rx="0.5" />
    <rect x="18" y="3" width="4" height="18" rx="0.5" />
  </svg>
)

export const SidebarLayoutIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="6" height="18" rx="1" />
    <rect x="11" y="3" width="10" height="18" rx="1" />
  </svg>
)

export const ContentAsideIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="12" height="18" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
)

export const CenteredIcon = ({ size = 24, strokeWidth = 2, ...props }: any) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="7" y1="8" x2="17" y2="8" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="7" y1="16" x2="17" y2="16" />
  </svg>
)

import { landingPageTemplates } from './landing-page-blocks'
import { businessWebsiteTemplates } from './business-website-blocks'
import { ecommerceTemplates } from './ecommerce-blocks'
import { personalBrandTemplates } from './personal-brand-blocks'
import { dashboardTemplates } from './dashboard-blocks'
import { contentPagesTemplates } from './content-pages-blocks'
import { funnelTemplates } from './funnel-blocks'

export type BlockCategory = {
  id: string
  label: string
  icon: any
}

export type CustomBlock = {
  id: string
  label: string
  icon: any
  category: string
  content: string
  mediaImage?: string
  attributes?: Record<string, any>
}

export const blockCategories: BlockCategory[] = [
  { id: 'layout', label: 'Layout', icon: LayoutGrid },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'forms', label: 'Forms', icon: FormInput },
  { id: 'components', label: 'Components', icon: Sparkles },
  { id: 'templates', label: 'Templates', icon: AppWindow },
  { id: 'landing-pages', label: 'Landing Pages', icon: LayoutGrid },
  { id: 'business-websites', label: 'Business Websites', icon: Building2 },
  { id: 'ecommerce-pages', label: 'E-commerce', icon: ShoppingBag },
  { id: 'personal-brand', label: 'Personal Brand', icon: User },
  { id: 'dashboard-ui', label: 'Dashboard UI', icon: LayoutDashboard },
  { id: 'content-pages', label: 'Content Pages', icon: Files },
  { id: 'funnel-pages', label: 'Funnels', icon: Filter },
  { id: 'navigation', label: 'Navigation', icon: Compass },
  { id: 'hero', label: 'Hero Sections', icon: Zap },
  { id: 'content-blocks', label: 'Content Blocks', icon: Puzzle },
  { id: 'business-blocks', label: 'Business', icon: Briefcase },
  { id: 'forms-ui', label: 'Forms UI', icon: FormInput },
  { id: 'ui-micro', label: 'UI Components', icon: Sparkles },
  { id: 'conversion', label: 'Conversion', icon: MousePointer2 },
]

export const customBlocks: CustomBlock[] = [
  ...landingPageTemplates,
  ...businessWebsiteTemplates,
  ...ecommerceTemplates,
  ...personalBrandTemplates,
  ...dashboardTemplates,
  ...contentPagesTemplates,
  ...funnelTemplates,
  // Layout Blocks
  {
    id: 'cb-section',
    label: 'Section Container',
    icon: SectionIcon,
    category: 'layout',
    content: `
      <section style="padding: 60px 20px; min-height: 150px;">
        <div style="max-width: 1200px; margin: 0 auto; width: 100%;">
          <div style="padding: 10px; border: 1px dashed #ddd; min-height: 50px;">Section Content</div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-full-section',
    label: 'Full-Width Section',
    icon: LayoutGrid,
    category: 'layout',
    content: `
      <section style="padding: 60px 20px; width: 100%; min-height: 150px;">
        <div style="padding: 10px; border: 1px dashed #ddd; min-height: 50px;">Full Width Content</div>
      </section>
    `,
  },
  {
    id: 'cb-split-section',
    label: 'Split Section (50/50)',
    icon: TwoColumnsIcon,
    category: 'layout',
    content: `
      <section style="padding: 60px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 30px;">
          <div style="flex: 1; min-width: 300px; min-height: 100px; padding: 10px; border: 1px dashed #ddd;">Left Side content</div>
          <div style="flex: 1; min-width: 300px; min-height: 100px; padding: 10px; border: 1px dashed #ddd;">Right Side content</div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-4-columns',
    label: '4-Column Grid',
    icon: FourColumnsIcon,
    category: 'layout',
    content: `
      <div style="max-width: 1200px; margin: 20px auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; padding: 20px;">
        <div style="padding: 20px; border: 1px dashed #ddd; min-height: 100px;">Column 1</div>
        <div style="padding: 20px; border: 1px dashed #ddd; min-height: 100px;">Column 2</div>
        <div style="padding: 20px; border: 1px dashed #ddd; min-height: 100px;">Column 3</div>
        <div style="padding: 20px; border: 1px dashed #ddd; min-height: 100px;">Column 4</div>
      </div>
    `,
  },
  {
    id: 'cb-sidebar-layout',
    label: 'Sidebar Layout',
    icon: SidebarLayoutIcon,
    category: 'layout',
    content: `
      <div style="max-width: 1200px; margin: 20px auto; display: flex; gap: 30px; padding: 20px;">
        <aside style="flex: 0 0 280px; padding: 20px; border: 1px dashed #ddd; min-height: 200px;">Sidebar area</aside>
        <main style="flex: 1; padding: 20px; border: 1px dashed #ddd; min-height: 200px;">Main content area</main>
      </div>
    `,
  },
  {
    id: 'cb-content-aside',
    label: 'Content + Aside',
    icon: ContentAsideIcon,
    category: 'layout',
    content: `
      <div style="max-width: 1200px; margin: 20px auto; display: flex; gap: 30px; padding: 20px;">
        <main style="flex: 1; padding: 20px; border: 1px dashed #ddd; min-height: 200px;">Main content area</main>
        <aside style="flex: 0 0 280px; padding: 20px; border: 1px dashed #ddd; min-height: 200px;">Aside area</aside>
      </div>
    `,
  },
  {
    id: 'cb-centered-block',
    label: 'Centered Content',
    icon: CenteredIcon,
    category: 'layout',
    content: `
      <div style="max-width: 800px; margin: 40px auto; padding: 40px 20px; text-align: center; border: 1px dashed #ddd;">
        <h2 style="margin-bottom: 20px;">Centered Heading</h2>
        <p>This is a centered content block ideal for focused messaging.</p>
      </div>
    `,
  },
  {
    id: 'cb-card-grid',
    label: 'Card Grid Wrapper',
    icon: LayoutGrid,
    category: 'layout',
    content: `
      <section style="padding: 60px 0;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; padding: 0 20px;">
          <div style="padding: 20px; border: 1px solid #eee; border-radius: 8px; min-height: 200px;">Card 1 placeholder</div>
          <div style="padding: 20px; border: 1px solid #eee; border-radius: 8px; min-height: 200px;">Card 2 placeholder</div>
          <div style="padding: 20px; border: 1px solid #eee; border-radius: 8px; min-height: 200px;">Card 3 placeholder</div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-container',
    label: 'Container',
    icon: Frame,
    category: 'layout',
    content: `
      <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        <p>Container content</p>
      </div>
    `,
  },
  {
    id: 'cb-2-columns',
    label: '2 Columns',
    icon: TwoColumnsIcon,
    category: 'layout',
    content: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px;">
        <div style="padding: 20px; background: #f5f5f5;">
          <p>Column 1</p>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <p>Column 2</p>
        </div>
      </div>
    `,
  },
  {
    id: 'cb-3-columns',
    label: '3 Columns',
    icon: ThreeColumnsIcon,
    category: 'layout',
    content: `
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; padding: 20px;">
        <div style="padding: 20px; background: #f5f5f5;">
          <p>Column 1</p>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <p>Column 2</p>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <p>Column 3</p>
        </div>
      </div>
    `,
  },

  // Business Blocks
  {
    id: 'cb-services-cards',
    label: 'Services Cards',
    icon: Sparkles,
    category: 'business-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
          <div style="padding: 40px; background: white; border: 1px solid #f0f0f0; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
            <div style="width: 50px; height: 50px; background: #1e3a8a; border-radius: 12px; margin-bottom: 25px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
            </div>
            <h3 style="font-weight: 800; font-size: 1.5rem; margin-bottom: 15px;">Web Development</h3>
            <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">We build scalable, high-performance web applications using the latest modern technologies.</p>
            <a href="#" style="color: #1e3a8a; font-weight: 700; text-decoration: none; font-size: 0.9rem;">Learn More →</a>
          </div>
          <div style="padding: 40px; background: white; border: 1px solid #f0f0f0; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
            <div style="width: 50px; height: 50px; background: #3b82f6; border-radius: 12px; margin-bottom: 25px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M4 4h16v16H4zM4 9h16M9 4v16"/></svg>
            </div>
            <h3 style="font-weight: 800; font-size: 1.5rem; margin-bottom: 15px;">Brand Identity</h3>
            <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">Crafting unique visual identities that help your business stand out in a crowded market.</p>
            <a href="#" style="color: #3b82f6; font-weight: 700; text-decoration: none; font-size: 0.9rem;">Learn More →</a>
          </div>
          <div style="padding: 40px; background: white; border: 1px solid #f0f0f0; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.02);">
            <div style="width: 50px; height: 50px; background: #10b981; border-radius: 12px; margin-bottom: 25px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <h3 style="font-weight: 800; font-size: 1.5rem; margin-bottom: 15px;">Cloud Solutions</h3>
            <p style="color: #666; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">Seamlessly transition your infrastructure to the cloud for maximum efficiency and scale.</p>
            <a href="#" style="color: #10b981; font-weight: 700; text-decoration: none; font-size: 0.9rem;">Learn More →</a>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-pricing-tiered',
    label: 'Pricing: 3-Tier',
    icon: CreditCard,
    category: 'business-blocks',
    content: `
      <section style="padding: 80px 20px; background: #fafafa;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; align-items: end;">
          <div style="padding: 40px; background: white; border-radius: 16px; border: 1px solid #eee;">
            <div style="font-weight: 700; color: #666; margin-bottom: 10px; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Basic</div>
            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 20px;">$29<span style="font-size: 1rem; color: #999; font-weight: 400;">/mo</span></div>
            <ul style="list-style: none; padding: 0; margin-bottom: 30px; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; color: #555;">
              <li>✓ 5 Projects</li>
              <li>✓ Standard Support</li>
              <li>✓ 10GB Storage</li>
            </ul>
            <button style="width: 100%; padding: 12px; border: 2px solid #111; background: transparent; color: #111; font-weight: 700; border-radius: 8px;">Get Started</button>
          </div>
          <div style="padding: 50px 40px; background: #111; color: white; border-radius: 16px; position: relative; transform: scale(1.05); z-index: 2;">
            <div style="position: absolute; top: 0; left: 50%; transform: translate(-50%, -50%); background: #3b82f6; padding: 5px 15px; border-radius: 20px; font-size: 0.75rem; font-weight: 800;">MOST POPULAR</div>
            <div style="font-weight: 700; color: #9ca3af; margin-bottom: 10px; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Pro</div>
            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 20px;">$79<span style="font-size: 1rem; color: #6b7280; font-weight: 400;">/mo</span></div>
            <ul style="list-style: none; padding: 0; margin-bottom: 30px; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; color: #d1d5db;">
              <li>✓ Unlimited Projects</li>
              <li>✓ Priority 24/7 Support</li>
              <li>✓ 100GB Storage</li>
              <li>✓ Advanced Analytics</li>
            </ul>
            <button style="width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; font-weight: 700; border-radius: 8px;">Upgrade Now</button>
          </div>
          <div style="padding: 40px; background: white; border-radius: 16px; border: 1px solid #eee;">
            <div style="font-weight: 700; color: #666; margin-bottom: 10px; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px;">Enterprise</div>
            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 20px;">$199<span style="font-size: 1rem; color: #999; font-weight: 400;">/mo</span></div>
            <ul style="list-style: none; padding: 0; margin-bottom: 30px; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; color: #555;">
              <li>✓ Multi-user (up to 50)</li>
              <li>✓ Dedicated Manager</li>
              <li>✓ Unlimited Storage</li>
            </ul>
            <button style="width: 100%; padding: 12px; border: 2px solid #111; background: transparent; color: #111; font-weight: 700; border-radius: 8px;">Contact Sales</button>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-pricing-comparison',
    label: 'Pricing: Comparison',
    icon: List,
    category: 'business-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1000px; margin: 0 auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #111;">
                <th style="padding: 20px; font-size: 1.2rem; font-weight: 800;">Features</th>
                <th style="padding: 20px; text-align: center;">Personal</th>
                <th style="padding: 20px; text-align: center; background: #f8fafc;">Business</th>
                <th style="padding: 20px; text-align: center;">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 20px; font-weight: 500;">Custom Domains</td>
                <td style="padding: 20px; text-align: center;">1</td>
                <td style="padding: 20px; text-align: center; background: #f8fafc;">Unlimited</td>
                <td style="padding: 20px; text-align: center;">Unlimited</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 20px; font-weight: 500;">SSL Certificates</td>
                <td style="padding: 20px; text-align: center;">✓</td>
                <td style="padding: 20px; text-align: center; background: #f8fafc;">✓</td>
                <td style="padding: 20px; text-align: center;">✓</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 20px; font-weight: 500;">API Access</td>
                <td style="padding: 20px; text-align: center;">-</td>
                <td style="padding: 20px; text-align: center; background: #f8fafc;">✓</td>
                <td style="padding: 20px; text-align: center;">✓</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 20px; font-weight: 500;">Private GitHub Repo</td>
                <td style="padding: 20px; text-align: center;">-</td>
                <td style="padding: 20px; text-align: center; background: #f8fafc;">-</td>
                <td style="padding: 20px; text-align: center;">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-testimonial-cards',
    label: 'Testimonial Cards',
    icon: Quote,
    category: 'business-blocks',
    content: `
      <section style="padding: 80px 20px; background: #f9fafb;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
          <div style="padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="display: flex; gap: 4px; margin-bottom: 15px; color: #fbbf24;">★★★★★</div>
            <p style="color: #444; font-style: italic; margin-bottom: 20px; line-height: 1.6;">"Absolutely game-changing builder. I launched my MVP in 3 days instead of 3 weeks."</p>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #ddd;"></div>
              <div>
                <div style="font-weight: 700; font-size: 0.9rem;">Mark Rivera</div>
                <div style="color: #888; font-size: 0.8rem;">CEO @ TechFlow</div>
              </div>
            </div>
          </div>
          <div style="padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="display: flex; gap: 4px; margin-bottom: 15px; color: #fbbf24;">★★★★★</div>
            <p style="color: #444; font-style: italic; margin-bottom: 20px; line-height: 1.6;">"The cleanest interface I've ever used. The drag-and-drop mechanics are simply flawless."</p>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #ddd;"></div>
              <div>
                <div style="font-weight: 700; font-size: 0.9rem;">Elena Chen</div>
                <div style="color: #888; font-size: 0.8rem;">UI Designer @ Nexus</div>
              </div>
            </div>
          </div>
          <div style="padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="display: flex; gap: 4px; margin-bottom: 15px; color: #fbbf24;">★★★★★</div>
            <p style="color: #444; font-style: italic; margin-bottom: 20px; line-height: 1.6;">"Support is incredible. They helped me set up my custom domain in under 5 minutes."</p>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #ddd;"></div>
              <div>
                <div style="font-weight: 700; font-size: 0.9rem;">James Wilson</div>
                <div style="color: #888; font-size: 0.8rem;">Freelancer</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-testimonial-slider-static',
    label: 'Testimonial Slider (Static)',
    icon: Navigation,
    category: 'business-blocks',
    content: `
      <section style="padding: 100px 40px; text-align: center; position: relative; background: #fff;">
        <div style="max-width: 800px; margin: 0 auto;">
          <div style="font-size: 1.5rem; font-weight: 500; line-height: 1.6; color: #111; margin-bottom: 40px;">
            "This platform has completely redefined how we ship software. The integration is seamless and the builder is more powerful than anything we've seen on the market."
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div style="font-weight: 800; font-size: 1.1rem;">Alex Stanford</div>
            <div style="color: #666;">Director of Software @ Innovate AI</div>
          </div>
          <div style="display: flex; justify-content: center; gap: 10px; margin-top: 40px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #111;"></div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #ddd;"></div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #ddd;"></div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-team-members',
    label: 'Team Members',
    icon: User,
    category: 'business-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px;">
          <div style="text-align: center;">
            <div style="width: 100%; aspect-ratio: 1; background: #f3f4f6; border-radius: 20px; margin-bottom: 20px; overflow: hidden;">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=400&h=400" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <h4 style="font-weight: 700; margin-bottom: 5px;">David Lynch</h4>
            <div style="color: #3b82f6; font-size: 0.85rem; font-weight: 600; margin-bottom: 10px;">CTO & Cofounder</div>
            <div style="display: flex; justify-content: center; gap: 10px; color: #999; font-size: 0.8rem;">
              <span>𝕏</span> <span>In</span>
            </div>
          </div>
          <div style="text-align: center;">
            <div style="width: 100%; aspect-ratio: 1; background: #f3f4f6; border-radius: 20px; margin-bottom: 20px; overflow: hidden;">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=400&h=400" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <h4 style="font-weight: 700; margin-bottom: 5px;">Sarah Miller</h4>
            <div style="color: #3b82f6; font-size: 0.85rem; font-weight: 600; margin-bottom: 10px;">Head of Design</div>
            <div style="display: flex; justify-content: center; gap: 10px; color: #999; font-size: 0.8rem;">
              <span>𝕏</span> <span>In</span>
            </div>
          </div>
          <div style="text-align: center;">
            <div style="width: 100%; aspect-ratio: 1; background: #f3f4f6; border-radius: 20px; margin-bottom: 20px; overflow: hidden;">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=400&h=400" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <h4 style="font-weight: 700; margin-bottom: 5px;">Robert Fox</h4>
            <div style="color: #3b82f6; font-size: 0.85rem; font-weight: 600; margin-bottom: 10px;">Product Architect</div>
            <div style="display: flex; justify-content: center; gap: 10px; color: #999; font-size: 0.8rem;">
              <span>𝕏</span> <span>In</span>
            </div>
          </div>
          <div style="text-align: center;">
            <div style="width: 100%; aspect-ratio: 1; background: #f3f4f6; border-radius: 20px; margin-bottom: 20px; overflow: hidden;">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?fit=crop&w=400&h=400" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <h4 style="font-weight: 700; margin-bottom: 5px;">Jenny Wilson</h4>
            <div style="color: #3b82f6; font-size: 0.85rem; font-weight: 600; margin-bottom: 10px;">Full-Stack Engineer</div>
            <div style="display: flex; justify-content: center; gap: 10px; color: #999; font-size: 0.8rem;">
              <span>𝕏</span> <span>In</span>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-logo-grid',
    label: 'Logo Grid',
    icon: LayoutGrid,
    category: 'business-blocks',
    content: `
      <section style="padding: 60px 20px; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; opacity: 0.4; flex-wrap: wrap; gap: 40px;">
          <div style="font-weight: 800; font-size: 1.5rem; letter-spacing: -2px;">SaaS-X</div>
          <div style="font-weight: 800; font-size: 1.5rem; letter-spacing: -2px;">FLOW_</div>
          <div style="font-weight: 800; font-size: 1.5rem; letter-spacing: -2px;">MODERN_</div>
          <div style="font-weight: 800; font-size: 1.5rem; letter-spacing: -2px;">NEX_US</div>
          <div style="font-weight: 800; font-size: 1.5rem; letter-spacing: -2px;">PROTO</div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-case-study',
    label: 'Case Study Card',
    icon: Files,
    category: 'business-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1000px; margin: 0 auto; background: #111; border-radius: 24px; padding: 60px; display: flex; align-items: center; gap: 50px; color: white; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 300px;">
            <div style="color: #3b82f6; font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 20px;">Case Study: FinTech Inc.</div>
            <h3 style="font-size: 2.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 25px;">How we helped FinTech scale to 1M+ users.</h3>
            <p style="color: #9ca3af; font-size: 1.1rem; line-height: 1.6; margin-bottom: 35px;">Real-time results achieving 40% reduction in latency while maintaining 100% data integrity during migration.</p>
            <a href="#" style="background: white; color: #111; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 800;">Read Full Story</a>
          </div>
          <div style="flex: 1; min-width: 300px;">
            <div style="font-size: 4rem; font-weight: 900; color: #3b82f6;">40%</div>
            <div style="color: #9ca3af; font-weight: 600;">Performance Boost</div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-portfolio-grid',
    label: 'Portfolio Grid',
    icon: ImagePlus,
    category: 'business-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px;">
          <div style="position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 16/10;">
            <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; bottom: 0; left: 0; padding: 30px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); width: 100%; color: white;">
              <h4 style="font-weight: 700; margin-bottom: 5px;">Oceanic Brand Refresh</h4>
              <div style="font-size: 0.8rem; opacity: 0.8;">Branding & Identity</div>
            </div>
          </div>
          <div style="position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 16/10;">
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; bottom: 0; left: 0; padding: 30px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); width: 100%; color: white;">
              <h4 style="font-weight: 700; margin-bottom: 5px;">DevTools Dashboard</h4>
              <div style="font-size: 0.8rem; opacity: 0.8;">UI/UX Design</div>
            </div>
          </div>
          <div style="position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 16/10;">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; bottom: 0; left: 0; padding: 30px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); width: 100%; color: white;">
              <h4 style="font-weight: 700; margin-bottom: 5px;">FinTech Analytics App</h4>
              <div style="font-size: 0.8rem; opacity: 0.8;">Product Strategy</div>
            </div>
          </div>
          <div style="position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 16/10;">
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; bottom: 0; left: 0; padding: 30px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); width: 100%; color: white;">
              <h4 style="font-weight: 700; margin-bottom: 5px;">Agency Site Redesign</h4>
              <div style="font-size: 0.8rem; opacity: 0.8;">Web Development</div>
            </div>
          </div>
        </div>
      </section>
    `,
  },

  // Content Blocks
  {
    id: 'cb-feature-cards',
    label: 'Feature Grid: Cards',
    icon: LayoutGrid,
    category: 'content-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
          <div style="padding: 40px; border: 1px solid #eee; border-radius: 12px; text-align: center; transition: transform 0.3s;">
            <div style="width: 60px; height: 60px; background: #eff6ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style="font-weight: 700; font-size: 1.25rem; margin-bottom: 15px;">Secure Platform</h3>
            <p style="color: #666; font-size: 0.95rem; line-height: 1.5;">Top-tier encryption and security protocols protecting every piece of your data.</p>
          </div>
          <div style="padding: 40px; border: 1px solid #eee; border-radius: 12px; text-align: center; transition: transform 0.3s;">
            <div style="width: 60px; height: 60px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <h3 style="font-weight: 700; font-size: 1.25rem; margin-bottom: 15px;">Fast Delivery</h3>
            <p style="color: #666; font-size: 0.95rem; line-height: 1.5;">Optimized performance that ensures your site loads instantly for every user.</p>
          </div>
          <div style="padding: 40px; border: 1px solid #eee; border-radius: 12px; text-align: center; transition: transform 0.3s;">
            <div style="width: 60px; height: 60px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </div>
            <h3 style="font-weight: 700; font-size: 1.25rem; margin-bottom: 15px;">Global Scale</h3>
            <p style="color: #666; font-size: 0.95rem; line-height: 1.5;">A worldwide CDN network that brings your content closer to your audience.</p>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-feature-minimal',
    label: 'Feature Grid: Minimal',
    icon: List,
    category: 'content-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 50px 80px;">
          <div style="display: flex; gap: 20px;">
            <div style="flex-shrink: 0; width: 40px; height: 40px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h4 style="font-weight: 700; margin-bottom: 8px;">Intuitive Interface</h4>
              <p style="color: #666; font-size: 0.9rem;">Clean design that makes navigation natural for everyone.</p>
            </div>
          </div>
          <div style="display: flex; gap: 20px;">
            <div style="flex-shrink: 0; width: 40px; height: 40px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h4 style="font-weight: 700; margin-bottom: 8px;">Advanced Analytics</h4>
              <p style="color: #666; font-size: 0.9rem;">Deep insights into your visitors' behavior and trends.</p>
            </div>
          </div>
          <div style="display: flex; gap: 20px;">
            <div style="flex-shrink: 0; width: 40px; height: 40px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h4 style="font-weight: 700; margin-bottom: 8px;">Custom Domain</h4>
              <p style="color: #666; font-size: 0.9rem;">Launch on your own unique web address instantly.</p>
            </div>
          </div>
          <div style="display: flex; gap: 20px;">
            <div style="flex-shrink: 0; width: 40px; height: 40px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <h4 style="font-weight: 700; margin-bottom: 8px;">24/7 Monitoring</h4>
              <p style="color: #666; font-size: 0.9rem;">Around the clock watch to ensure everything is perfect.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-steps-row',
    label: 'Process Steps',
    icon: ListOrdered,
    category: 'content-blocks',
    content: `
      <section style="padding: 80px 20px; background: #f9fafb;">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; position: relative;">
          <div style="position: absolute; top: 30px; left: 0; width: 100%; height: 2px; background: #e5e7eb; z-index: 1;"></div>
          <div style="position: relative; z-index: 2; text-align: center; width: 33%;">
            <div style="width: 60px; height: 60px; background: #1e3a8a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-weight: 800; font-size: 1.25rem; border: 4px solid white;">1</div>
            <h4 style="font-weight: 700; margin-bottom: 10px;">Select Plan</h4>
            <p style="color: #666; font-size: 0.85rem; padding: 0 20px;">Choose a workspace tailored to your goals.</p>
          </div>
          <div style="position: relative; z-index: 2; text-align: center; width: 33%;">
            <div style="width: 60px; height: 60px; background: #1e3a8a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-weight: 800; font-size: 1.25rem; border: 4px solid white;">2</div>
            <h4 style="font-weight: 700; margin-bottom: 10px;">Build Canvas</h4>
            <p style="color: #666; font-size: 0.85rem; padding: 0 20px;">Drag components and customize your site flow.</p>
          </div>
          <div style="position: relative; z-index: 2; text-align: center; width: 33%;">
            <div style="width: 60px; height: 60px; background: #1e3a8a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-weight: 800; font-size: 1.25rem; border: 4px solid white;">3</div>
            <h4 style="font-weight: 700; margin-bottom: 10px;">Go Live</h4>
            <p style="color: #666; font-size: 0.85rem; padding: 0 20px;">One click to deploy to a global server network.</p>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-timeline-vertical',
    label: 'Timeline: Vertical',
    icon: Clock,
    category: 'content-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 800px; margin: 0 auto; position: relative;">
          <div style="position: absolute; left: 50%; top: 0; height: 100%; width: 2px; background: #e5e7eb; transform: translateX(-50%);"></div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; position: relative;">
            <div style="width: 45%; text-align: right;">
              <h4 style="font-weight: 700; margin-bottom: 5px;">Company Founded</h4>
              <p style="color: #666; font-size: 0.9rem;">The initial spark that started our journey in tech.</p>
            </div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #3b82f6; border: 4px solid white; box-shadow: 0 0 0 2px #3b82f6; z-index: 2;"></div>
            <div style="width: 45%; color: #3b82f6; font-weight: 800;">2018</div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; position: relative;">
            <div style="width: 45%; color: #3b82f6; font-weight: 800; text-align: right;">2020</div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #3b82f6; border: 4px solid white; box-shadow: 0 0 0 2px #3b82f6; z-index: 2;"></div>
            <div style="width: 45%;">
              <h4 style="font-weight: 700; margin-bottom: 5px;">Series A Funding</h4>
              <p style="color: #666; font-size: 0.9rem;">Expanding our team and our vision for the future.</p>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
            <div style="width: 45%; text-align: right;">
              <h4 style="font-weight: 700; margin-bottom: 5px;">Global Launch</h4>
              <p style="color: #666; font-size: 0.9rem;">Making our builder available in over 150 countries.</p>
            </div>
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #3b82f6; border: 4px solid white; box-shadow: 0 0 0 2px #3b82f6; z-index: 2;"></div>
            <div style="width: 45%; color: #3b82f6; font-weight: 800;">2024</div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-timeline-horizontal',
    label: 'Timeline: Horizontal',
    icon: Clock,
    category: 'content-blocks',
    content: `
      <section style="padding: 80px 20px; overflow-x: auto;">
        <div style="min-width: 1000px; max-width: 1200px; margin: 0 auto; position: relative; padding-top: 50px;">
          <div style="position: absolute; top: 105px; left: 0; width: 100%; height: 2px; background: #e2e8f0; z-index: 1;"></div>
          <div style="display: flex; justify-content: space-around;">
            <div style="text-align: center; width: 200px; position: relative; z-index: 2;">
              <div style="color: #3b82f6; font-weight: 800; margin-bottom: 40px;">Q1 2024</div>
              <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; margin: 0 auto 30px; border: 4px solid white;"></div>
              <h5 style="font-weight: 700; margin-bottom: 10px;">Ideation</h5>
              <p style="font-size: 0.85rem; color: #64748b;">Nailing down the core mechanics.</p>
            </div>
            <div style="text-align: center; width: 200px; position: relative; z-index: 2;">
              <div style="color: #3b82f6; font-weight: 800; margin-bottom: 40px;">Q2 2024</div>
              <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; margin: 0 auto 30px; border: 4px solid white;"></div>
              <h5 style="font-weight: 700; margin-bottom: 10px;">Development</h5>
              <p style="font-size: 0.85rem; color: #64748b;">Writing the secure foundation.</p>
            </div>
            <div style="text-align: center; width: 200px; position: relative; z-index: 2;">
              <div style="color: #3b82f6; font-weight: 800; margin-bottom: 40px;">Q3 2024</div>
              <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; margin: 0 auto 30px; border: 4px solid white;"></div>
              <h5 style="font-weight: 700; margin-bottom: 10px;">Beta Release</h5>
              <p style="font-size: 0.85rem; color: #64748b;">Gathering user feedback early.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-stats-counter',
    label: 'Stats Counter',
    icon: BarChart3,
    category: 'content-blocks',
    content: `
      <section style="padding: 60px 20px; background: #111827; color: white; border-radius: 16px; margin: 40px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; text-align: center;">
          <div>
            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 5px;">500k</div>
            <div style="color: #9ca3af; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Downloads</div>
          </div>
          <div>
            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 5px;">98%</div>
            <div style="color: #9ca3af; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Satisfaction</div>
          </div>
          <div>
            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 5px;">24/7</div>
            <div style="color: #9ca3af; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Expert Care</div>
          </div>
          <div>
            <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 5px;">120+</div>
            <div style="color: #9ca3af; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">Countries</div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-text-image',
    label: 'Text + Image',
    icon: ArrowRight,
    category: 'content-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 60px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 350px;">
            <h2 style="font-size: 2.25rem; font-weight: 800; color: #111; margin-bottom: 20px;">Create without limits.</h2>
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">Our platform removes the technical barriers so you can focus on what matters most—your vision. Drag, drop, and customize every pixel until it's perfect.</p>
            <a href="#" style="color: #3b82f6; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 8px;">Explore all features →</a>
          </div>
          <div style="flex: 1; min-width: 350px;">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" style="width: 100%; border-radius: 12px;" />
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-image-text-rev',
    label: 'Image + Text (Rev)',
    icon: ArrowRight,
    category: 'content-blocks',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 60px; flex-wrap: wrap-reverse;">
          <div style="flex: 1; min-width: 350px;">
            <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" style="width: 100%; border-radius: 12px;" />
          </div>
          <div style="flex: 1; min-width: 350px;">
            <h2 style="font-size: 2.25rem; font-weight: 800; color: #111; margin-bottom: 20px;">Collaborate in real-time.</h2>
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">Invite your team and watch the magic happen. Real-time syncing ensures everyone is on the same page, literally. Built for modern agile teams.</p>
            <button style="padding: 12px 24px; background: #111; color: white; border: none; border-radius: 6px; font-weight: 600;">Get Team Access</button>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-quote-premium',
    label: 'Quote Block',
    icon: Quote,
    category: 'content-blocks',
    content: `
      <section style="padding: 80px 20px; background: #ffffff;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <div style="color: #e5e7eb; font-size: 80px; font-family: serif; line-height: 1; margin-bottom: -20px;">"</div>
          <blockquote style="font-size: 1.75rem; font-weight: 500; color: #111; line-height: 1.4; font-style: italic; margin-bottom: 30px;">
            The best way to predict the future is to create it. Our builder makes that creation process seamless for everyone.
          </blockquote>
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #3b82f6;"></div>
            <div style="text-align: left;">
              <div style="font-weight: 700;">Sarah Johnson</div>
              <div style="color: #666; font-size: 0.85rem;">CEO at PixelForge</div>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-highlight-p',
    label: 'Highlighted Paragraph',
    icon: Type,
    category: 'content-blocks',
    content: `
      <section style="padding: 60px 40px; border-left: 6px solid #1e3a8a; background: #f8fafc; margin: 40px 0;">
        <h3 style="font-weight: 800; font-size: 1.5rem; margin-bottom: 15px; color: #1e3a8a;">Important Note</h3>
        <p style="font-size: 1.15rem; color: #334155; line-height: 1.7;">This is a premium highlighted section. Use it to draw immediate attention to key information, testimonials, or specialized insights that should not be missed by your audience.</p>
      </section>
    `,
  },

  // Form UI Blocks
  {
    id: 'cb-form-contact',
    label: 'Contact Form',
    icon: Mail,
    category: 'forms-ui',
    content: `
      <div style="max-width: 600px; margin: 40px auto; padding: 40px; background: white; border: 1px solid #eee; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
        <h3 style="font-weight: 800; font-size: 1.5rem; margin-bottom: 30px; color: #111;">Get in Touch</h3>
        <form style="display: flex; flex-direction: column; gap: 20px;">
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: #374151;">Full Name</label>
            <input type="text" placeholder="John Doe" style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; outline: none;" />
          </div>
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: #374151;">Email Address</label>
            <input type="email" placeholder="john@example.com" style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; outline: none;" />
          </div>
          <div>
            <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: #374151;">Message</label>
            <textarea rows="4" placeholder="How can we help you?" style="width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; outline: none; resize: vertical;"></textarea>
          </div>
          <button type="submit" style="width: 100%; padding: 14px; background: #1e3a8a; color: white; border: none; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer;">Send Message</button>
        </form>
      </div>
    `,
  },
  {
    id: 'cb-form-newsletter',
    label: 'Newsletter Form',
    icon: Send,
    category: 'forms-ui',
    content: `
      <section style="padding: 60px 20px; text-align: center; background: #111; color: white; border-radius: 12px; margin: 40px auto; max-width: 800px;">
        <h2 style="font-weight: 800; font-size: 1.75rem; margin-bottom: 15px;">Join our newsletter</h2>
        <p style="color: #9ca3af; margin-bottom: 35px;">Get the latest updates, articles, and resources directly to your inbox.</p>
        <form style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <input type="email" placeholder="enter@youremail.com" style="flex: 1; min-width: 250px; padding: 16px 20px; border-radius: 8px; border: 1px solid #333; background: #000; color: white; outline: none;" />
          <button type="submit" style="padding: 16px 32px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Subscribe Now</button>
        </form>
      </section>
    `,
  },
  {
    id: 'cb-form-lead',
    label: 'Lead Capture Form',
    icon: UserPlus,
    category: 'forms-ui',
    content: `
      <div style="background: white; padding: 30px; border-radius: 12px; border: 2px solid #3b82f6;">
        <h4 style="font-weight: 800; margin-bottom: 10px; color: #1d4ed8;">Start your Free Trial</h4>
        <p style="font-size: 0.85rem; color: #6b7280; margin-bottom: 25px;">Join 5,000+ companies growing with our platform.</p>
        <form style="display: flex; flex-direction: column; gap: 15px;">
          <input type="text" placeholder="Workspace Name" style="width: 100%; padding: 10px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px;" />
          <input type="email" placeholder="Work Email" style="width: 100%; padding: 10px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px;" />
          <button style="padding: 12px; background: #1d4ed8; color: white; border: none; border-radius: 6px; font-weight: 700; cursor: pointer;">Get Started Free</button>
        </form>
      </div>
    `,
  },
  {
    id: 'cb-form-minimal-row',
    label: 'Minimal Input Row',
    icon: Minus,
    category: 'forms-ui',
    content: `
      <div style="display: flex; width: 100%; max-width: 500px; border-bottom: 2px solid #111; padding: 10px 0; margin-bottom: 20px;">
        <input type="text" placeholder="Type something here..." style="flex: 1; border: none; background: transparent; padding: 10px; font-size: 1.1rem; outline: none; font-weight: 500;" />
        <button style="background: transparent; border: none; color: #111; font-weight: 800; padding: 0 10px; cursor: pointer;">SUBMIT</button>
      </div>
    `,
  },
  {
    id: 'cb-form-multi-field',
    label: 'Multi-Field Layout',
    icon: LayoutGrid,
    category: 'forms-ui',
    content: `
      <form style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 800px; margin: 40px auto; padding: 40px; background: #f8fafc; border-radius: 16px;">
        <div style="grid-column: span 1;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px;">First Name</label>
          <input type="text" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;" />
        </div>
        <div style="grid-column: span 1;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px;">Last Name</label>
          <input type="text" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;" />
        </div>
        <div style="grid-column: span 2;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px;">Organization</label>
          <input type="text" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px;" />
        </div>
        <div style="grid-column: span 2;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px;">Role</label>
          <select style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white;">
            <option>Product Manager</option>
            <option>Designer</option>
            <option>Developer</option>
          </select>
        </div>
        <div style="grid-column: span 2;">
          <button style="width: 100%; padding: 14px; background: #1e3a8a; color: white; border: none; border-radius: 8px; font-weight: 800;">Complete Profile</button>
        </div>
      </form>
    `,
  },
  {
    id: 'cb-form-inline',
    label: 'Inline Form',
    icon: AlignLeft,
    category: 'forms-ui',
    content: `
      <form style="display: flex; align-items: center; gap: 15px; background: #ffffff; padding: 15px 30px; border-radius: 100px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); max-width: 600px; margin: 40px auto;">
        <input type="email" placeholder="Email" style="border: none; outline: none; flex: 1; font-size: 0.95rem;" />
        <input type="password" placeholder="Password" style="border: none; outline: none; flex: 1; font-size: 0.95rem; border-left: 1px solid #eee; padding-left: 15px;" />
        <button style="background: #111; color: white; border: none; padding: 10px 24px; border-radius: 100px; font-weight: 600; cursor: pointer;">GO</button>
      </form>
    `,
  },
  {
    id: 'cb-form-card',
    label: 'Form Card Layout',
    icon: CreditCard,
    category: 'forms-ui',
    content: `
      <div style="display: flex; max-width: 900px; margin: 40px auto; border-radius: 20px; overflow: hidden; background: white; box-shadow: 0 30px 60px rgba(0,0,0,0.08);">
        <div style="flex: 1; background: #1e3a8a; color: white; padding: 60px;">
          <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 20px;">Contact us.</h2>
          <p style="opacity: 0.7; line-height: 1.6;">Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.</p>
        </div>
        <div style="flex: 1.5; padding: 60px;">
          <form style="display: grid; grid-template-columns: 1fr; gap: 20px;">
            <input type="text" placeholder="Your Name" style="width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 6px;" />
            <input type="email" placeholder="Email Address" style="width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 6px;" />
            <textarea placeholder="Message" rows="5" style="width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 6px;"></textarea>
            <button style="background: #1e3a8a; color: white; padding: 15px; border: none; border-radius: 6px; font-weight: 700;">Submit Ticket</button>
          </form>
        </div>
      </div>
    `,
  },

  // Conversion Blocks
  {
    id: 'cb-cta-strip',
    label: 'CTA Strip',
    icon: Megaphone,
    category: 'conversion',
    content: `
      <section style="padding: 40px; background: #1e3a8a; color: white; display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap;">
        <h3 style="font-weight: 700; font-size: 1.5rem; margin: 0;">Ready to transform your business today?</h3>
        <button style="padding: 14px 28px; background: white; color: #1e3a8a; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; white-space: nowrap;">Get Started Now</button>
      </section>
    `,
  },
  {
    id: 'cb-cta-card',
    label: 'CTA Card Block',
    icon: Megaphone,
    category: 'conversion',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1000px; margin: 0 auto; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 24px; padding: 60px; text-align: center;">
          <h2 style="font-size: 2.5rem; font-weight: 800; color: #0369a1; margin-bottom: 20px;">Boost your productivity by 200%.</h2>
          <p style="color: #075985; font-size: 1.1rem; margin-bottom: 35px; max-width: 600px; margin-left: auto; margin-right: auto;">Join over 10,000 teams who have already streamlined their workflow with our premium builder tools.</p>
          <div style="display: flex; justify-content: center; gap: 20px;">
            <button style="padding: 16px 32px; background: #0369a1; color: white; border: none; border-radius: 8px; font-weight: 700;">Claim Your Free Trial</button>
            <button style="padding: 16px 32px; background: white; color: #0369a1; border: 1px solid #0369a1; border-radius: 8px; font-weight: 700;">Watch Demo Video</button>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-offer-box',
    label: 'Offer Box',
    icon: Tag,
    category: 'conversion',
    content: `
      <div style="margin: 40px auto; max-width: 500px; border: 2px dashed #f59e0b; background: #fffbeb; border-radius: 16px; padding: 30px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; background: #f59e0b; color: white; padding: 5px 20px; font-weight: 800; font-size: 0.75rem; transform: rotate(15deg) translate(20px, -5px);">WINTER SALE</div>
        <h4 style="font-weight: 800; color: #92400e; margin-bottom: 10px; font-size: 1.25rem;">Limited Time Offer!</h4>
        <p style="color: #b45309; font-size: 0.95rem; margin-bottom: 20px;">Get 50% off your first 3 months with code <strong>CHAPA50</strong>. Offer ends in 24 hours.</p>
        <button style="width: 100%; padding: 12px; background: #f59e0b; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Activate My Discount</button>
      </div>
    `,
  },
  {
    id: 'cb-guarantee',
    label: 'Guarantee Block',
    icon: ShieldCheck,
    category: 'conversion',
    content: `
      <section style="padding: 60px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; text-align: center;">
        <div style="max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 20px;">
          <div style="width: 80px; height: 80px; background: #edf2f7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 11 13 15 9"/></svg>
          </div>
          <h3 style="font-weight: 800; font-size: 1.5rem; color: #1e3a8a;">30-Day Money-Back Guarantee</h3>
          <p style="color: #64748b; font-size: 1rem; line-height: 1.6;">We're so confident in our platform that if you're not absolutely satisfied within the first 30 days, we'll refund every penny. No questions asked.</p>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-feature-comparison',
    label: 'Feature Comparison',
    icon: TrendingUp,
    category: 'conversion',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div style="background: #fdf2f2; padding: 40px; border-radius: 20px; border: 1px solid #fecaca;">
            <h4 style="font-weight: 800; color: #991b1b; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">The Old Way ✕</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 15px; color: #b91c1c; font-weight: 500;">
              <li>Slow development cycles</li>
              <li>High maintenance costs</li>
              <li>Brittle codebases</li>
              <li>Limited scalability</li>
            </ul>
          </div>
          <div style="background: #f0fdf4; padding: 40px; border-radius: 20px; border: 1px solid #bbf7d0;">
            <h4 style="font-weight: 800; color: #166534; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">The Chapabiz Way ✓</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 15px; color: #15803d; font-weight: 600;">
              <li>Instant deployment</li>
              <li>Zero maintenance required</li>
              <li>Robust design system</li>
              <li>Infinite global scale</li>
            </ul>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-trust-badges',
    label: 'Trust Badges Row',
    icon: ShieldCheck,
    category: 'conversion',
    content: `
      <div style="padding: 40px 20px; display: flex; justify-content: center; align-items: center; gap: 60px; flex-wrap: wrap; opacity: 0.6;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">SSL Secured</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path min-x="12" y1="8" x2="12" y2="12"/><path x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">GDPR Compliant</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>
          <span style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">PCI DSS Ready</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          <span style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Cloud Verified</span>
        </div>
      </div>
    `,
  },
  {
    id: 'cb-faq-accordion',
    label: 'FAQ Accordion',
    icon: HelpCircle,
    category: 'conversion',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h2 style="font-size: 2rem; font-weight: 800; text-align: center; margin-bottom: 50px;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: white;">
              <div style="padding: 20px; font-weight: 700; display: flex; justify-content: space-between; border-bottom: 1px solid #efefef; cursor: pointer;">
                <span>How does the data synchronization work?</span>
                <span style="color: #999;">+</span>
              </div>
              <div style="padding: 20px; color: #666; font-size: 0.95rem; line-height: 1.6;">Our real-time engine ensures that every change you make is instantly propagated across all linked services and regions globally.</div>
            </div>
            <div style="border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: white;">
              <div style="padding: 20px; font-weight: 700; display: flex; justify-content: space-between; cursor: pointer;">
                <span>Is there a limit on bandwidth?</span>
                <span style="color: #999;">+</span>
              </div>
            </div>
            <div style="border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: white;">
              <div style="padding: 20px; font-weight: 700; display: flex; justify-content: space-between; cursor: pointer;">
                <span>Can I export my project data?</span>
                <span style="color: #999;">+</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  },

  // UI Micro Components
  {
    id: 'cb-ui-buttons',
    label: 'Button Styles',
    icon: MousePointerClick,
    category: 'ui-micro',
    content: `
      <div style="display: flex; gap: 20px; padding: 20px; align-items: center; flex-wrap: wrap;">
        <button style="padding: 12px 24px; background: #1e3a8a; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;">Solid Button</button>
        <button style="padding: 12px 24px; background: transparent; color: #1e3a8a; border: 2px solid #1e3a8a; border-radius: 6px; font-weight: 600; cursor: pointer;">Outline Button</button>
        <button style="padding: 12px 24px; background: transparent; color: #64748b; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Ghost Button</button>
      </div>
    `,
  },
  {
    id: 'cb-ui-badges',
    label: 'Badge Labels',
    icon: Tag,
    category: 'ui-micro',
    content: `
      <div style="display: flex; gap: 10px; padding: 20px; flex-wrap: wrap;">
        <span style="padding: 4px 12px; background: #dcfce7; color: #166534; border-radius: 100px; font-size: 0.75rem; font-weight: 700;">Success</span>
        <span style="padding: 4px 12px; background: #fee2e2; color: #991b1b; border-radius: 100px; font-size: 0.75rem; font-weight: 700;">Error</span>
        <span style="padding: 4px 12px; background: #fef9c3; color: #854d0e; border-radius: 100px; font-size: 0.75rem; font-weight: 700;">Warning</span>
        <span style="padding: 4px 12px; background: #e0e7ff; color: #3730a3; border-radius: 100px; font-size: 0.75rem; font-weight: 700;">Info</span>
      </div>
    `,
  },
  {
    id: 'cb-ui-chips',
    label: 'Tag Chips',
    icon: Tag,
    category: 'ui-micro',
    content: `
      <div style="display: flex; gap: 8px; padding: 20px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 0.85rem; color: #475569; border: 1px solid #e2e8f0;">
          <span>Design</span>
          <span style="cursor: pointer; font-weight: bold; opacity: 0.5;">×</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 0.85rem; color: #475569; border: 1px solid #e2e8f0;">
          <span>Development</span>
          <span style="cursor: pointer; font-weight: bold; opacity: 0.5;">×</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px dashed #cbd5e1; border-radius: 6px; font-size: 0.85rem; color: #94a3b8; cursor: pointer;">
          + Add Tag
        </div>
      </div>
    `,
  },
  {
    id: 'cb-ui-alert',
    label: 'Alert Box',
    icon: AlertCircle,
    category: 'ui-micro',
    content: `
      <div style="margin: 20px; padding: 16px 20px; background: #fdf2f2; border: 1px solid #f8d7da; border-radius: 8px; display: flex; gap: 12px; align-items: flex-start;">
        <div style="color: #dc2626; font-size: 1.25rem;">⚠️</div>
        <div>
          <h4 style="font-weight: 700; color: #991b1b; margin-bottom: 4px; font-size: 0.95rem;">Action Required</h4>
          <p style="color: #b91c1c; font-size: 0.85rem; line-height: 1.5;">Your subscription will expire in 2 days. Please update your payment method to avoid service interruption.</p>
        </div>
      </div>
    `,
  },
  {
    id: 'cb-ui-notification',
    label: 'Notification Bar',
    icon: Bell,
    category: 'ui-micro',
    content: `
      <div style="width: 100%; background: #1e3a8a; color: white; padding: 10px 20px; display: flex; justify-content: center; align-items: center; gap: 15px; font-size: 0.9rem;">
        <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 800;">NEW</span>
        <span>Version 2.0 is now live! Explore the updated builder today.</span>
        <a href="#" style="color: white; text-decoration: underline; font-weight: 600;">Learn more</a>
      </div>
    `,
  },
  {
    id: 'cb-ui-divider',
    label: 'Divider Styles',
    icon: Divide,
    category: 'ui-micro',
    content: `
      <div style="padding: 40px 20px; display: flex; flex-direction: column; gap: 30px; width: 100%;">
        <hr style="border: none; border-top: 1px solid #e2e8f0; width: 100%;" />
        <div style="display: flex; align-items: center; gap: 20px; width: 100%;">
          <hr style="border: none; border-top: 1px solid #e2e8f0; flex: 1;" />
          <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Or continue with</span>
          <hr style="border: none; border-top: 1px solid #e2e8f0; flex: 1;" />
        </div>
        <hr style="border: none; border-top: 2px dashed #cbd5e1; width: 100%;" />
      </div>
    `,
  },
  {
    id: 'cb-ui-info-card',
    label: 'Info Card',
    icon: Info,
    category: 'ui-micro',
    content: `
      <div style="padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; width: 100%; max-width: 350px;">
        <div style="width: 32px; height: 32px; background: #3b82f6; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-weight: 800;">i</div>
        <h5 style="font-weight: 700; color: #1e293b; margin-bottom: 8px;">Pro Tip: Shortcuts</h5>
        <p style="color: #64748b; font-size: 0.85rem; line-height: 1.6;">Use [CMD+S] to quickly save your project progress without leaving the editor canvas.</p>
      </div>
    `,
  },
  {
    id: 'cb-ui-metric',
    label: 'Metric Card',
    icon: Activity,
    category: 'ui-micro',
    content: `
      <div style="padding: 20px; background: white; border: 1px solid #eee; border-radius: 12px; width: 100%; max-width: 240px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 4px; font-weight: 500;">Active Sessions</div>
        <div style="display: flex; align-items: flex-end; gap: 10px;">
          <div style="font-size: 1.75rem; font-weight: 800; color: #1e293b;">1,284</div>
          <div style="color: #10b981; font-size: 0.75rem; font-weight: 700; margin-bottom: 6px;">+12.4% ↑</div>
        </div>
      </div>
    `,
  },
  {
    id: 'cb-ui-progress',
    label: 'Progress Bar',
    icon: Activity,
    category: 'ui-micro',
    content: `
      <div style="padding: 20px; width: 100%; max-width: 400px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem; font-weight: 600; color: #475569;">
          <span>Setup Progress</span>
          <span>75%</span>
        </div>
        <div style="width: 100%; height: 8px; background: #f1f5f9; border-radius: 100px; overflow: hidden;">
          <div style="width: 75%; height: 100%; background: #3b82f6; border-radius: 100px;"></div>
        </div>
      </div>
    `,
  },
  {
    id: 'cb-ui-table',
    label: 'Table Layout',
    icon: Table,
    category: 'ui-micro',
    content: `
      <div style="width: 100%; overflow: hidden; border: 1px solid #e2e8f0; border-radius: 12px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead style="background: #f8fafc; text-align: left; border-bottom: 1px solid #e2e8f0;">
            <tr>
              <th style="padding: 12px 16px; font-weight: 700; color: #475569;">Item</th>
              <th style="padding: 12px 16px; font-weight: 700; color: #475569;">Status</th>
              <th style="padding: 12px 16px; font-weight: 700; color: #475569; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 16px; color: #1e293b;">Pro Subscription</td>
              <td style="padding: 12px 16px;"><span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">Active</span></td>
              <td style="padding: 12px 16px; text-align: right; font-weight: 600;">$99.00</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; color: #1e293b;">Standard Domain</td>
              <td style="padding: 12px 16px;"><span style="background: #f1f5f9; color: #64748b; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">Pending</span></td>
              <td style="padding: 12px 16px; text-align: right; font-weight: 600;">$12.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: 'cb-ui-tabs',
    label: 'Tabs Layout',
    icon: Columns,
    category: 'ui-micro',
    content: `
      <div style="width: 100%; max-width: 500px; padding: 20px;">
        <div style="display: flex; gap: 4px; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px;">
          <div style="padding: 10px 20px; border-bottom: 2px solid #1e3a8a; color: #1e3a8a; font-weight: 700; font-size: 0.9rem; cursor: pointer;">General</div>
          <div style="padding: 10px 20px; color: #64748b; font-weight: 500; font-size: 0.9rem; cursor: pointer;">Security</div>
          <div style="padding: 10px 20px; color: #64748b; font-weight: 500; font-size: 0.9rem; cursor: pointer;">Billing</div>
        </div>
        <div style="padding: 10px; color: #475569; font-size: 0.9rem; line-height: 1.6;">
          Customize your general workspace settings and preferences here. This will apply to all team members within the organization.
        </div>
      </div>
    `,
  },

  // Typography Blocks
  {
    id: 'cb-heading',
    label: 'Heading',
    icon: Heading1,
    category: 'typography',
    content: '<h1 style="font-size: 2.5rem; font-weight: bold; margin: 20px 0;">Your Heading Here</h1>',
  },
  {
    id: 'cb-paragraph',
    label: 'Paragraph',
    icon: AlignLeft,
    category: 'typography',
    content: '<p style="font-size: 1rem; line-height: 1.6; margin: 15px 0;">Your paragraph text goes here. Edit this to add your content.</p>',
  },
  {
    id: 'cb-list',
    label: 'List',
    icon: List,
    category: 'typography',
    content: `
      <ul style="margin: 15px 0; padding-left: 20px;">
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
      </ul>
    `,
  },
  {
    id: 'cb-quote',
    label: 'Quote',
    icon: Quote,
    category: 'typography',
    content: `
      <blockquote style="border-left: 4px solid #ddd; padding-left: 20px; margin: 20px 0; font-style: italic; color: #666;">
        "Your inspirational quote goes here."
      </blockquote>
    `,
  },

  // Media Blocks
  {
    id: 'cb-image',
    label: 'Image',
    icon: FileImage,
    category: 'media',
    content: `
      <img 
        src="https://via.placeholder.com/800x400" 
        alt="Placeholder image" 
        style="max-width: 100%; height: auto; display: block;"
      />
    `,
  },
  {
    id: 'cb-video',
    label: 'Video',
    icon: Film,
    category: 'media',
    content: `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
        <iframe 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
          frameborder="0" 
          allowfullscreen
        ></iframe>
      </div>
    `,
  },

  // Form Blocks
  {
    id: 'cb-input',
    label: 'Input',
    icon: TextCursorInput,
    category: 'forms',
    content: `
      <input 
        type="text" 
        placeholder="Enter text..." 
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;"
      />
    `,
  },
  {
    id: 'cb-textarea',
    label: 'Textarea',
    icon: FileText,
    category: 'forms',
    content: `
      <textarea 
        placeholder="Enter your message..." 
        rows="5"
        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; resize: vertical;"
      ></textarea>
    `,
  },
  {
    id: 'cb-button',
    label: 'Button',
    icon: MousePointerClick,
    category: 'forms',
    content: `
      <button style="padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer;">
        Click Me
      </button>
    `,
  },
  {
    id: 'cb-form',
    label: 'Form',
    icon: FormInput,
    category: 'forms',
    content: `
      <form style="max-width: 500px; margin: 20px 0;">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Name</label>
          <input type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" />
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
          <input type="email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;" />
        </div>
        <button type="submit" style="padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Submit
        </button>
      </form>
    `,
  },

  // Component Blocks
  {
    id: 'cb-card',
    label: 'Card',
    icon: CreditCard,
    category: 'components',
    content: `
      <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; max-width: 350px;">
        <img src="https://via.placeholder.com/350x200" alt="Card image" style="width: 100%; border-radius: 4px; margin-bottom: 15px;" />
        <h3 style="font-size: 1.5rem; margin-bottom: 10px;">Card Title</h3>
        <p style="color: #666; margin-bottom: 15px;">Card description goes here. Add your content.</p>
        <button style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Learn More
        </button>
      </div>
    `,
  },
  // Hero Blocks
  {
    id: 'cb-hero-split',
    label: 'Hero: Text + Image',
    icon: SectionIcon,
    category: 'hero',
    content: `
      <section style="padding: 100px 40px; background: #ffffff;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 60px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 400px;">
            <h1 style="font-size: 3.5rem; font-weight: 800; color: #111; line-height: 1.1; margin-bottom: 25px;">Design your future with precision.</h1>
            <p style="font-size: 1.2rem; color: #555; line-height: 1.6; margin-bottom: 35px;">Our platform gives you the tools to build, launch, and scale your digital products in record time.</p>
            <div style="display: flex; gap: 15px;">
              <button style="padding: 16px 32px; background: #1e3a8a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Get Started Now</button>
              <button style="padding: 16px 32px; background: #f3f4f6; color: #111; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Learn More</button>
            </div>
          </div>
          <div style="flex: 1; min-width: 400px;">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" alt="Hero" />
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-hero-centered',
    label: 'Centered Hero',
    icon: CenteredIcon,
    category: 'hero',
    content: `
      <section style="padding: 120px 20px; text-align: center; background: #fafafa; border-bottom: 1px solid #eee;">
        <div style="max-width: 800px; margin: 0 auto;">
          <span style="display: inline-block; padding: 6px 16px; background: #e0e7ff; color: #4338ca; border-radius: 100px; font-size: 0.85rem; font-weight: 700; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">New Feature: AI Sync</span>
          <h1 style="font-size: 4rem; font-weight: 900; color: #111; line-height: 1; margin-bottom: 25px;">The only builder you'll ever need.</h1>
          <p style="font-size: 1.25rem; color: #666; line-height: 1.6; margin-bottom: 40px;">Stop wasting hours on brittle code. Use our drag-and-drop system to launch professional sites in minutes.</p>
          <div style="display: flex; justify-content: center; gap: 20px;">
            <button style="padding: 18px 40px; background: #111; color: white; border: none; border-radius: 50px; font-weight: 600; cursor: pointer; font-size: 1rem;">Start Free Trial</button>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-hero-stats',
    label: 'Hero with Stats',
    icon: BarChart3,
    category: 'hero',
    content: `
      <section style="padding: 100px 40px; background: #111; color: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 80px;">
            <h1 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 20px;">Trusted by 20,000+ Teams</h1>
            <p style="font-size: 1.2rem; color: #9ca3af; max-width: 700px; margin: 0 auto;">We power the fastest growing startups globally with enterprise-grade infrastructure.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; text-align: center;">
            <div>
              <div style="font-size: 3.5rem; font-weight: 800; color: #3b82f6;">99.9%</div>
              <div style="color: #6b7280; font-weight: 500; text-transform: uppercase; font-size: 0.9rem;">Uptime Guarantee</div>
            </div>
            <div>
              <div style="font-size: 3.5rem; font-weight: 800; color: #3b82f6;">10M+</div>
              <div style="color: #6b7280; font-weight: 500; text-transform: uppercase; font-size: 0.9rem;">Users Managed</div>
            </div>
            <div>
              <div style="font-size: 3.5rem; font-weight: 800; color: #3b82f6;">24/7</div>
              <div style="color: #6b7280; font-weight: 500; text-transform: uppercase; font-size: 0.9rem;">Expert Support</div>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-hero-cards',
    label: 'Hero with Highlights',
    icon: LayoutGrid,
    category: 'hero',
    content: `
      <section style="padding: 100px 40px; background: #ffffff;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 60px;">
          <div style="text-align: center;">
            <h1 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 20px;">Streamline your workflow.</h1>
            <p style="color: #666; font-size: 1.1rem;">Everything you need to manage your business in one place.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; width: 100%;">
            <div style="padding: 30px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 48px; height: 48px; background: #1e3a8a; border-radius: 12px; margin-bottom: 20px;"></div>
              <h3 style="font-weight: 700; margin-bottom: 10px;">Automated Sales</h3>
              <p style="color: #666; font-size: 0.95rem;">Set it and forget it with our powerful automation engine.</p>
            </div>
            <div style="padding: 30px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 48px; height: 48px; background: #3b82f6; border-radius: 12px; margin-bottom: 20px;"></div>
              <h3 style="font-weight: 700; margin-bottom: 10px;">Cloud Sync</h3>
              <p style="color: #666; font-size: 0.95rem;">Access your data from any device, anywhere in the world.</p>
            </div>
            <div style="padding: 30px; background: #f9fafb; border-radius: 16px;">
              <div style="width: 48px; height: 48px; background: #10b981; border-radius: 12px; margin-bottom: 20px;"></div>
              <h3 style="font-weight: 700; margin-bottom: 10px;">Ultra Secure</h3>
              <p style="color: #666; font-size: 0.95rem;">Military-grade encryption for all your sensitive data.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-hero-mockup',
    label: 'Hero with Mockup',
    icon: Monitor,
    category: 'hero',
    content: `
      <section style="padding: 100px 40px; background: #f3f4f6; overflow: hidden;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <h1 style="font-size: 3.8rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 30px;">Modern apps, built faster.</h1>
          <div style="perspective: 1000px; margin: 60px auto 0; max-width: 1000px;">
            <div style="background: white; padding: 10px; border-radius: 12px; box-shadow: 0 50px 100px rgba(0,0,0,0.1); transform: rotateX(5deg);">
              <div style="background: #e5e7eb; height: 30px; border-radius: 6px 6px 0 0; margin-bottom: 10px; display: flex; align-items: center; padding-left: 15px; gap: 6px;">
                <div style="width: 8px; height: 8px; background: #ff5f56; border-radius: 50%;"></div>
                <div style="width: 8px; height: 8px; background: #ffbd2e; border-radius: 50%;"></div>
                <div style="width: 8px; height: 8px; background: #27c93f; border-radius: 50%;"></div>
              </div>
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80" style="width: 100%; height: auto; display: block;" alt="App Mockup" />
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: 'cb-hero-split-solid',
    label: 'Split Solid Hero',
    icon: Square,
    category: 'hero',
    content: `
      <section style="display: flex; min-height: 600px; flex-wrap: wrap;">
        <div style="flex: 1; background: #1e3a8a; padding: 80px; display: flex; align-items: center; justify-content: center; color: white; min-width: 400px;">
          <div>
            <h1 style="font-size: 4rem; font-weight: 800; line-height: 1; margin-bottom: 30px;">Simple.<br/>Powerful.<br/>Direct.</h1>
            <p style="font-size: 1.2rem; opacity: 0.8; margin-bottom: 40px;">No distractions. Just pure results with our direct-to-market strategy.</p>
            <button style="padding: 16px 36px; background: white; color: #1e3a8a; border: none; font-weight: 700; border-radius: 4px; cursor: pointer;">Join the Club</button>
          </div>
        </div>
        <div style="flex: 1; background: #f59e0b; min-width: 400px;">
          <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" alt="Hero Image" />
        </div>
      </section>
    `,
  },
  {
    id: 'cb-welcome-panel',
    label: 'Welcome Panel',
    icon: AppWindow,
    category: 'templates',
    content: `
      <div class="panel">
        <h1 class="welcome">Welcome to</h1>
        <div class="big-title">
          <svg class="logo" viewBox="0 0 100 100">
            <path d="M40 5l-12.9 7.4 -12.9 7.4c-1.4 0.8-2.7 2.3-3.7 3.9 -0.9 1.6-1.5 3.5-1.5 5.1v14.9 14.9c0 1.7 0.6 3.5 1.5 5.1 0.9 1.6 2.2 3.1 3.7 3.9l12.9 7.4 12.9 7.4c1.4 0.8 3.3 1.2 5.2 1.2 1.9 0 3.8-0.4 5.2-1.2l12.9-7.4 12.9-7.4c1.4-0.8 2.7-2.2 3.7-3.9 0.9-1.6 1.5-3.5 1.5-5.1v-14.9 -12.7c0-4.6-3.8-6-6.8-4.2l-28 16.2" />
          </svg>
          <span>GrapesJS</span>
        </div>
        <div class="description">
          This is a demo showing how to integrate custom content. You can drag and drop this block to see the welcome message template in action.
        </div>
      </div>
      <style>
        .panel {
          width: 90%;
          max-width: 700px;
          border-radius: 3px;
          padding: 30px 20px;
          margin: 150px auto 0px;
          background-color: #d983a6;
          box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.25);
          color: rgba(255, 255, 255, 0.75);
          font: caption;
          font-weight: 100;
        }

        .welcome {
          text-align: center;
          font-weight: 100;
          margin: 0px;
        }

        .logo {
          width: 70px;
          height: 70px;
          vertical-align: middle;
        }

        .logo path {
          pointer-events: none;
          fill: none;
          stroke-linecap: round;
          stroke-width: 7;
          stroke: #fff
        }

        .big-title {
          text-align: center;
          font-size: 3.5rem;
          margin: 15px 0;
        }

        .description {
          text-align: justify;
          font-size: 1rem;
          line-height: 1.5rem;
        }
      </style>
    `,
  },

  // Basic Layout
  {
    id: 'cb-div-block',
    label: 'Div Block',
    icon: BoxSelect,
    category: 'layout',
    content: '<div style="padding: 10px; min-height: 50px;"></div>',
  },
  {
    id: 'cb-row',
    label: 'Row',
    icon: RowIcon,
    category: 'layout',
    content: '<div style="display: flex; gap: 10px; padding: 10px; flex-wrap: wrap;"><div style="flex: 1; min-height: 50px; padding: 10px; border: 1px dashed #ddd;">Col 1</div><div style="flex: 1; min-height: 50px; padding: 10px; border: 1px dashed #ddd;">Col 2</div></div>',
  },
  {
    id: 'cb-link-block',
    label: 'Link Block',
    icon: Link2,
    category: 'layout',
    content: '<a href="#" style="display: inline-block; padding: 10px; color: inherit; text-decoration: none;">Link Block</a>',
  },

  // Navigation Blocks
  {
    id: 'cb-top-nav',
    label: 'Top Navigation',
    icon: PanelTop,
    category: 'navigation',
    content: `
      <nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background-color: #ffffff; border-bottom: 1px solid #eaeaea; position: relative; z-index: 10;">
        <div style="font-weight: 800; font-size: 1.4rem; color: #1e3a8a; letter-spacing: -0.5px;">LOGO</div>
        <div style="display: flex; gap: 30px; align-items: center;">
          <a href="#" style="text-decoration: none; color: #444; font-weight: 500; font-size: 0.95rem; transition: color 0.2s;">Home</a>
          <a href="#" style="text-decoration: none; color: #444; font-weight: 500; font-size: 0.95rem; transition: color 0.2s;">Services</a>
          <a href="#" style="text-decoration: none; color: #444; font-weight: 500; font-size: 0.95rem; transition: color 0.2s;">About</a>
          <a href="#" style="padding: 10px 20px; background: #1e3a8a; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.9rem;">Contact Us</a>
        </div>
      </nav>
    `,
  },
  {
    id: 'cb-transparent-nav',
    label: 'Transparent Nav',
    icon: Compass,
    category: 'navigation',
    content: `
      <nav style="display: flex; justify-content: space-between; align-items: center; padding: 25px 40px; background: transparent; position: absolute; width: 100%; top: 0; left: 0; z-index: 100;">
        <div style="font-weight: 800; font-size: 1.4rem; color: #ffffff; letter-spacing: -0.5px;">PREMIUM</div>
        <div style="display: flex; gap: 35px; align-items: center;">
          <a href="#" style="text-decoration: none; color: #ffffff; font-weight: 500; font-size: 0.95rem; opacity: 0.9;">Product</a>
          <a href="#" style="text-decoration: none; color: #ffffff; font-weight: 500; font-size: 0.95rem; opacity: 0.9;">Features</a>
          <a href="#" style="text-decoration: none; color: #ffffff; font-weight: 500; font-size: 0.95rem; opacity: 0.9;">Pricing</a>
          <button style="background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 10px 22px; border-radius: 100px; cursor: pointer; font-weight: 600;">Sign In</button>
        </div>
      </nav>
    `,
  },
  {
    id: 'cb-sticky-nav',
    label: 'Sticky Nav (Glass)',
    icon: Navigation,
    category: 'navigation',
    content: `
      <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 1000; width: 100%;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; background: #3b82f6; border-radius: 8px;"></div>
          <span style="font-weight: 700; font-size: 1.1rem; color: #111;">Modern UI</span>
        </div>
        <div style="display: flex; gap: 24px;">
          <a href="#" style="text-decoration: none; color: #555; font-weight: 500; font-size: 0.9rem;">Docs</a>
          <a href="#" style="text-decoration: none; color: #555; font-weight: 500; font-size: 0.9rem;">Components</a>
          <a href="#" style="text-decoration: none; color: #555; font-weight: 500; font-size: 0.9rem;">Showcase</a>
        </div>
      </nav>
    `,
  },
  {
    id: 'cb-sidebar-nav',
    label: 'Sidebar Nav',
    icon: Menu,
    category: 'navigation',
    content: `
      <aside style="width: 260px; height: 100vh; background: #111827; color: white; padding: 30px 20px; display: flex; flex-direction: column; gap: 40px;">
        <div style="font-weight: 800; font-size: 1.5rem; text-align: center; color: #3b82f6;">DASHBOARD</div>
        <nav style="display: flex; flex-direction: column; gap: 10px;">
          <a href="#" style="padding: 12px 16px; background: rgba(255,255,255,0.1); border-radius: 8px; color: white; text-decoration: none; font-weight: 500; display: flex; align-items: center; gap: 12px;">📊 Overview</a>
          <a href="#" style="padding: 12px 16px; border-radius: 8px; color: #9ca3af; text-decoration: none; font-weight: 500; display: flex; align-items: center; gap: 12px;">📈 Analytics</a>
          <a href="#" style="padding: 12px 16px; border-radius: 8px; color: #9ca3af; text-decoration: none; font-weight: 500; display: flex; align-items: center; gap: 12px;">👥 Customers</a>
          <a href="#" style="padding: 12px 16px; border-radius: 8px; color: #9ca3af; text-decoration: none; font-weight: 500; display: flex; align-items: center; gap: 12px;">⚙️ Settings</a>
        </nav>
      </aside>
    `,
  },
  {
    id: 'cb-simple-footer',
    label: 'Simple Footer',
    icon: PanelTop,
    category: 'navigation',
    content: `
      <footer style="padding: 40px; background: #f9fafb; border-top: 1px solid #efefef; text-align: center;">
        <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px;">
          <a href="#" style="text-decoration: none; color: #6b7280; font-size: 0.9rem;">Privacy Policy</a>
          <a href="#" style="text-decoration: none; color: #6b7280; font-size: 0.9rem;">Terms of Service</a>
          <a href="#" style="text-decoration: none; color: #6b7280; font-size: 0.9rem;">Contact</a>
        </div>
        <p style="color: #9ca3af; font-size: 0.85rem;">© 2026 Your Brand Inc. All rights reserved.</p>
      </footer>
    `,
  },
  {
    id: 'cb-mega-footer',
    label: 'Mega Footer',
    icon: Anchor,
    category: 'navigation',
    content: `
      <footer style="background: #0f172a; color: #f8fafc; padding: 80px 40px 40px;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px;">
          <div>
            <div style="font-weight: 800; font-size: 1.5rem; margin-bottom: 20px;">BUILDER.</div>
            <p style="color: #94a3b8; line-height: 1.6; font-size: 0.95rem;">The world's leading platform for creating high-conversion websites without writing a single line of code.</p>
          </div>
          <div>
            <h4 style="font-weight: 700; margin-bottom: 25px; font-size: 1.1rem;">Product</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px;">
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Templates</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Integrations</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Page Builder</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-weight: 700; margin-bottom: 25px; font-size: 1.1rem;">Company</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px;">
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">About Us</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Careers</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Press Kit</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font-weight: 700; margin-bottom: 25px; font-size: 1.1rem;">Legal</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px;">
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Privacy</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Terms</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div style="max-width: 1200px; margin: 60px auto 0; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; color: #64748b; font-size: 0.85rem;">
          <p>© 2026 Builder AI. Built with love.</p>
          <div style="display: flex; gap: 20px;">
            <span>Twitter</span>
            <span>GitHub</span>
            <span>Discord</span>
          </div>
        </div>
      </footer>
    `,
  },

  // Media Components
  {
    id: 'cb-image-card',
    label: 'Image Card',
    icon: Image,
    category: 'media',
    content: `
      <div style="max-width: 350px; border-radius: 16px; overflow: hidden; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" style="width: 100%; display: block;" />
        <div style="padding: 20px;">
          <h4 style="font-weight: 700; margin-bottom: 5px;">Product Spotlight</h4>
          <p style="font-size: 0.85rem; color: #666; line-height: 1.5;">A brief description of the featured image or product shown above.</p>
        </div>
      </div>
    `,
  },
  {
    id: 'cb-gallery-grid',
    label: 'Gallery: Grid',
    icon: ImagePlus,
    category: 'media',
    content: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 20px;">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&h=400&q=80" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;" />
        <img src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=400&h=400&q=80" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;" />
        <img src="https://images.unsplash.com/photo-1532270660266-d47290aa38fd?auto=format&fit=crop&w=400&h=400&q=80" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;" />
      </div>
    `,
  },
  {
    id: 'cb-gallery-masonry',
    label: 'Gallery: Masonry',
    icon: GalleryVertical,
    category: 'media',
    content: `
      <div style="column-count: 3; column-gap: 15px; padding: 20px;">
        <div style="margin-bottom: 15px;"><img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=400&q=80" style="width: 100%; display: block; border-radius: 12px;" /></div>
        <div style="margin-bottom: 15px;"><img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=800&q=80" style="width: 100%; display: block; border-radius: 12px;" /></div>
        <div style="margin-bottom: 15px;"><img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&h=600&q=80" style="width: 100%; display: block; border-radius: 12px;" /></div>
        <div style="margin-bottom: 15px;"><img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80" style="width: 100%; display: block; border-radius: 12px;" /></div>
      </div>
    `,
  },
  {
    id: 'cb-video-frame',
    label: 'Video Frame',
    icon: Play,
    category: 'media',
    content: `
      <div style="position: relative; width: 100%; padding-bottom: 56.25%; background: #000; border-radius: 16px; overflow: hidden;">
        <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80" style="position: absolute; width: 100%; height: 100%; object-fit: cover; opacity: 0.6;" />
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid white;">
          <div style="width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 18px solid white; margin-left: 5px;"></div>
        </div>
      </div>
    `,
  },
  {
    id: 'cb-mockup-browser',
    label: 'Browser Mockup',
    icon: Laptop,
    category: 'media',
    content: `
      <div style="width: 100%; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 30px 60px rgba(0,0,0,0.12); overflow: hidden;">
        <div style="background: #f1f5f9; height: 32px; display: flex; align-items: center; padding: 0 16px; gap: 8px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; gap: 6px;">
            <div style="width: 10px; height: 10px; background: #ff5f56; border-radius: 50%;"></div>
            <div style="width: 10px; height: 10px; background: #ffbd2e; border-radius: 50%;"></div>
            <div style="width: 10px; height: 10px; background: #27c93f; border-radius: 50%;"></div>
          </div>
          <div style="background: white; border-radius: 4px; height: 18px; flex: 1; max-width: 400px; margin: 0 auto;"></div>
        </div>
        <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" style="width: 100%; display: block;" />
      </div>
    `,
  },
  {
    id: 'cb-mockup-phone',
    label: 'Smartphone Mockup',
    icon: Smartphone,
    category: 'media',
    content: `
      <div style="max-width: 300px; margin: 0 auto; border: 12px solid #111; border-radius: 48px; background: #111; box-shadow: 0 50px 100px rgba(0,0,0,0.25); position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 120px; height: 25px; background: #111; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; z-index: 2;"></div>
        <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&h=1200&q=80" style="width: 100%; display: block; border-radius: 36px;" />
      </div>
    `,
  },

  // Forms
  {
    id: 'cb-label',
    label: 'Label',
    icon: Tag,
    category: 'forms',
    content: '<label style="display: block; margin-bottom: 5px; font-weight: 500;">Label</label>',
  },
  {
    id: 'cb-select',
    label: 'Select',
    icon: ChevronsDown,
    category: 'forms',
    content: '<select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: white;"><option value="">Select option</option><option value="1">Option 1</option><option value="2">Option 2</option></select>',
  },
  {
    id: 'cb-checkbox',
    label: 'Checkbox',
    icon: CheckSquare,
    category: 'forms',
    content: '<div style="display: flex; items-center; gap: 8px; margin-bottom: 10px;"><input type="checkbox" id="check1" /><label for="check1">Checkbox</label></div>',
  },
  {
    id: 'cb-radio',
    label: 'Radio',
    icon: Circle,
    category: 'forms',
    content: '<div style="display: flex; items-center; gap: 8px; margin-bottom: 10px;"><input type="radio" name="radio-group" id="radio1" /><label for="radio1">Radio</label></div>',
  },

  // Buttons
  {
    id: 'cb-outline-button',
    label: 'Outline Button',
    icon: MousePointerClick,
    category: 'forms',
    content: '<button style="padding: 12px 24px; background: transparent; color: #007bff; border: 2px solid #007bff; border-radius: 4px; font-size: 1rem; cursor: pointer;">Outline Button</button>',
  },
  {
    id: 'cb-link-button',
    label: 'Link Button',
    icon: Link2,
    category: 'forms',
    content: '<a href="#" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-size: 1rem; text-align: center;">Link Button</a>',
  },
]
