import {
  BarChart3,
  Calendar,
  CheckCircle,
  Cpu,
  Clipboard,
  Compass,
  Database,
  Flag,
  Headphones,
  Home,
  Info,
  Link2,
  Lock,
  MessageSquare,
  Bell,
  CreditCard,
  Power,
  Receipt,
  Send,
  Settings,
  Shield,
  Star,
  Sliders,
  Video,
  Wallet,
  AlertTriangle,
  User,
  LayoutGrid,
  Building2,
  Workflow,
  Users,
  Image as ImageIcon,
  Zap,
  Mail,
  Phone,
  FileText,
  TrendingUp,
  Target,
  Award,
  Briefcase,
  Globe,
  Rocket,
} from 'lucide-react'

export const pricingCards = [
  {
    title: 'Starter',
    description: 'Perfect for trying out plura',
    price: 'Free',
    duration: '',
    highlight: 'Key features',
    features: ['3 Sub accounts', '2 Team members', 'Unlimited pipelines'],
    priceId: '',
  },
  {
    title: 'Unlimited Saas',
    description: 'The ultimate agency kit',
    price: 'KSh 15,000',
    duration: 'month',
    highlight: 'Key features',
    features: ['Rebilling', '24/7 Support team'],
    priceId: 'price_1OYxkqFj9oKEERu1KfJGWxgN', // TODO: Update this ID in Stripe Dashboard to match KSh 15,000
  },
  {
    title: 'Basic',
    description: 'For serious agency owners',
    price: 'KSh 5,000',
    duration: 'month',
    highlight: 'Everything in Starter, plus',
    features: ['Unlimited Sub accounts', 'Unlimited Team members'],
    priceId: 'price_1OYxkqFj9oKEERu1NbKUxXxN', // TODO: Update this ID in Stripe Dashboard to match KSh 5,000
  },
]

export const addOnProducts = [
  { title: 'Priority Support', id: 'prod_PNjJAE2EpP16pn' },
]

export const icons = [
  {
    value: 'chart',
    label: 'Bar Chart',
    path: BarChart3,
  },
  {
    value: 'headphone',
    label: 'Headphones',
    path: Headphones,
  },
  {
    value: 'send',
    label: 'Send',
    path: Send,
  },
  {
    value: 'pipelines',
    label: 'Pipelines',
    path: Workflow,
  },
  {
    value: 'calendar',
    label: 'Calendar',
    path: Calendar,
  },
  {
    value: 'settings',
    label: 'Settings',
    path: Settings,
  },
  {
    value: 'check',
    label: 'Check Circled',
    path: CheckCircle,
  },
  {
    value: 'chip',
    label: 'Chip',
    path: Cpu,
  },
  {
    value: 'compass',
    label: 'Compass',
    path: Compass,
  },
  {
    value: 'database',
    label: 'Database',
    path: Database,
  },
  {
    value: 'flag',
    label: 'Flag',
    path: Flag,
  },
  {
    value: 'home',
    label: 'Home',
    path: Home,
  },
  {
    value: 'info',
    label: 'Info',
    path: Info,
  },
  {
    value: 'link',
    label: 'Link',
    path: Link2,
  },
  {
    value: 'lock',
    label: 'Lock',
    path: Lock,
  },
  {
    value: 'messages',
    label: 'Messages',
    path: MessageSquare,
  },
  {
    value: 'notification',
    label: 'Notification',
    path: Bell,
  },
  {
    value: 'payment',
    label: 'Payment',
    path: CreditCard,
  },
  {
    value: 'power',
    label: 'Power',
    path: Power,
  },
  {
    value: 'receipt',
    label: 'Receipt',
    path: Receipt,
  },
  {
    value: 'shield',
    label: 'Shield',
    path: Shield,
  },
  {
    value: 'star',
    label: 'Star',
    path: Star,
  },
  {
    value: 'tune',
    label: 'Tune',
    path: Sliders,
  },
  {
    value: 'videorecorder',
    label: 'Video Recorder',
    path: Video,
  },
  {
    value: 'wallet',
    label: 'Wallet',
    path: Wallet,
  },
  {
    value: 'warning',
    label: 'Warning',
    path: AlertTriangle,
  },
  {
    value: 'person',
    label: 'Person',
    path: User,
  },
  {
    value: 'category',
    label: 'Category',
    path: LayoutGrid,
  },
  {
    value: 'clipboardIcon',
    label: 'Clipboard Icon',
    path: Clipboard,
  },
  {
    value: 'government',
    label: 'Government',
    path: Building2,
  },
  {
    value: 'image',
    label: 'Image',
    path: ImageIcon,
  },
  {
    value: 'kanban',
    label: 'Kanban',
    path: LayoutGrid,
  },
  {
    value: 'automation',
    label: 'Automation',
    path: Zap,
  },
  {
    value: 'email',
    label: 'Email',
    path: Mail,
  },
  {
    value: 'phone',
    label: 'Phone',
    path: Phone,
  },
  {
    value: 'document',
    label: 'Document',
    path: FileText,
  },
  {
    value: 'analytics',
    label: 'Analytics',
    path: TrendingUp,
  },
  {
    value: 'target',
    label: 'Target',
    path: Target,
  },
  {
    value: 'award',
    label: 'Award',
    path: Award,
  },
  {
    value: 'briefcase',
    label: 'Briefcase',
    path: Briefcase,
  },
  {
    value: 'globe',
    label: 'Globe',
    path: Globe,
  },
  {
    value: 'users',
    label: 'Users',
    path: Users,
  },
  {
    value: 'rocket',
    label: 'Rocket',
    path: Rocket,
  },
]

export type EditorBtns =
  | 'text'
  | 'container'
  | 'section'
  | 'contactForm'
  | 'paymentForm'
  | 'link'
  | '2Col'
  | 'video'
  | '__body'
  | 'image'
  | null
  | '3Col'
  | 'header'
  | 'hero'
  | 'footer'

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: 'center',
  objectFit: 'cover',
  backgroundRepeat: 'no-repeat',
  textAlign: 'left',
  opacity: '100%',
}
