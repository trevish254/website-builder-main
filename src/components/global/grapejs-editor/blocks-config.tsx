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
  Video
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
  attributes?: Record<string, any>
}

export const blockCategories: BlockCategory[] = [
  { id: 'layout', label: 'Layout', icon: LayoutGrid },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'media', label: 'Media', icon: Image },
  { id: 'forms', label: 'Forms', icon: FormInput },
  { id: 'components', label: 'Components', icon: Sparkles },
]

export const customBlocks: CustomBlock[] = [
  // Layout Blocks
  {
    id: 'section',
    label: 'Section',
    icon: SectionIcon,
    category: 'layout',
    content: `
      <section style="padding: 50px 20px; min-height: 200px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <p>Section content goes here</p>
        </div>
      </section>
    `,
  },
  {
    id: 'container',
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
    id: '2-columns',
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
    id: '3-columns',
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

  // Typography Blocks
  {
    id: 'heading',
    label: 'Heading',
    icon: Heading1,
    category: 'typography',
    content: '<h1 style="font-size: 2.5rem; font-weight: bold; margin: 20px 0;">Your Heading Here</h1>',
  },
  {
    id: 'paragraph',
    label: 'Paragraph',
    icon: AlignLeft,
    category: 'typography',
    content: '<p style="font-size: 1rem; line-height: 1.6; margin: 15px 0;">Your paragraph text goes here. Edit this to add your content.</p>',
  },
  {
    id: 'list',
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
    id: 'quote',
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
    id: 'image',
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
    id: 'video',
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
    id: 'input',
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
    id: 'textarea',
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
    id: 'button',
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
    id: 'form',
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
    id: 'card',
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
  {
    id: 'hero',
    label: 'Hero Section',
    icon: Megaphone,
    category: 'components',
    content: `
      <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 20px; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 20px;">Welcome to Your Website</h1>
          <p style="font-size: 1.25rem; margin-bottom: 30px; opacity: 0.9;">Create amazing experiences with our platform</p>
          <button style="padding: 15px 30px; background: white; color: #667eea; border: none; border-radius: 4px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
            Get Started
          </button>
        </div>
      </section>
    `,
  },
  {
    id: 'cta',
    label: 'Call to Action',
    icon: Mail,
    category: 'components',
    content: `
      <section style="background: #f8f9fa; padding: 60px 20px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="font-size: 2rem; margin-bottom: 15px;">Ready to Get Started?</h2>
          <p style="font-size: 1.1rem; color: #666; margin-bottom: 25px;">Join thousands of satisfied customers today</p>
          <button style="padding: 15px 40px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
            Sign Up Now
          </button>
        </div>
      </section>
    `,
  },
  // Basic Layout
  {
    id: 'div-block',
    label: 'Div Block',
    icon: BoxSelect,
    category: 'layout',
    content: '<div style="padding: 10px; min-height: 50px;"></div>',
  },
  {
    id: 'row',
    label: 'Row',
    icon: RowIcon,
    category: 'layout',
    content: '<div style="display: flex; gap: 10px; padding: 10px; flex-wrap: wrap;"><div style="flex: 1; min-height: 50px; padding: 10px; border: 1px dashed #ddd;">Col 1</div><div style="flex: 1; min-height: 50px; padding: 10px; border: 1px dashed #ddd;">Col 2</div></div>',
  },
  {
    id: 'link-block',
    label: 'Link Block',
    icon: Link2,
    category: 'layout',
    content: '<a href="#" style="display: inline-block; padding: 10px; color: inherit; text-decoration: none;">Link Block</a>',
  },

  // Navigation
  {
    id: 'navbar',
    label: 'Navbar',
    icon: AppWindow,
    category: 'components',
    content: '<nav style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background-color: #ffffff; border-bottom: 1px solid #eee;"><div style="font-weight: bold; font-size: 1.2rem;">Brand</div><div style="display: flex; gap: 20px;"><a href="#" style="text-decoration: none; color: #333;">Home</a><a href="#" style="text-decoration: none; color: #333;">About</a><a href="#" style="text-decoration: none; color: #333;">Contact</a></div></nav>',
  },

  // Media
  {
    id: 'image-gallery',
    label: 'Image Gallery',
    icon: ImagePlus,
    category: 'media',
    content: '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; padding: 20px;"><img src="https://via.placeholder.com/200" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;" /><img src="https://via.placeholder.com/200" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;" /><img src="https://via.placeholder.com/200" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;" /><img src="https://via.placeholder.com/200" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;" /></div>',
  },

  // Forms
  {
    id: 'label',
    label: 'Label',
    icon: Tag,
    category: 'forms',
    content: '<label style="display: block; margin-bottom: 5px; font-weight: 500;">Label</label>',
  },
  {
    id: 'select',
    label: 'Select',
    icon: ChevronsDown,
    category: 'forms',
    content: '<select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: white;"><option value="">Select option</option><option value="1">Option 1</option><option value="2">Option 2</option></select>',
  },
  {
    id: 'checkbox',
    label: 'Checkbox',
    icon: CheckSquare,
    category: 'forms',
    content: '<div style="display: flex; items-center; gap: 8px; margin-bottom: 10px;"><input type="checkbox" id="check1" /><label for="check1">Checkbox</label></div>',
  },
  {
    id: 'radio',
    label: 'Radio',
    icon: Circle,
    category: 'forms',
    content: '<div style="display: flex; items-center; gap: 8px; margin-bottom: 10px;"><input type="radio" name="radio-group" id="radio1" /><label for="radio1">Radio</label></div>',
  },

  // Buttons
  {
    id: 'outline-button',
    label: 'Outline Button',
    icon: MousePointerClick,
    category: 'forms',
    content: '<button style="padding: 12px 24px; background: transparent; color: #007bff; border: 2px solid #007bff; border-radius: 4px; font-size: 1rem; cursor: pointer;">Outline Button</button>',
  },
  {
    id: 'link-button',
    label: 'Link Button',
    icon: Link2,
    category: 'forms',
    content: '<a href="#" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-size: 1rem; text-align: center;">Link Button</a>',
  },
]
