import {
    LayoutGrid,
    Type,
    Image,
    Video,
    Square,
    Columns,
    Heading1,
    AlignLeft,
    List,
    Quote,
    FileImage,
    Film,
    Grid3x3,
    FormInput,
    TextCursorInput,
    MousePointerClick,
    FileText,
    CreditCard,
    Sparkles,
    Megaphone,
    Mail,
} from 'lucide-react'

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
        icon: Square,
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
        icon: Square,
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
        icon: Columns,
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
        icon: Grid3x3,
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
]
