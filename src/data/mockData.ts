import { Robot, BlogPost, ResearchProject, Testimonial, Partner, Lead } from '../types/admin';

export const mockRobots: Robot[] = [
  {
    id: '1',
    name: 'D2 Delivery Robot',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'pricing',
    features: ['Sleek design', 'Reliable navigation', 'Easy branding', 'High demand'],
    specs: { 'Max Speed': '1.5 m/s', 'Battery Life': '12 hours', 'Payload': '15 kg', 'Navigation': 'LiDAR + Camera' },
    price: 42000,
    currency: 'AED',
    useCases: ['Food delivery', 'Document transport', 'Retail assistance'],
    industries: ['Restaurants', 'Malls', 'Hospitals'],
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Temi Robot',
    image: 'https://images.pexels.com/photos/8386427/pexels-photo-8386427.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'quote',
    features: ['AI assistance', 'Video calls', 'Delivery capability', 'UAE support'],
    specs: { 'Screen Size': '10.1 inches', 'Battery': '8 hours', 'Connectivity': 'WiFi, 4G', 'Voice': 'Multilingual' },
    useCases: ['Patient assistance', 'Office reception', 'Customer service'],
    industries: ['Healthcare', 'Offices', 'Retail'],
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Alice Pro',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'rental',
    features: ['Humanoid design', '3D navigation', 'Media playback', 'Multilingual'],
    specs: { 'Height': '1.6m', 'Weight': '65kg', 'Languages': '20+', 'Display': '21.5 inch touchscreen' },
    useCases: ['Reception services', 'Event hosting', 'Information desk'],
    industries: ['Corporate', 'Events', 'Exhibitions'],
    status: 'active',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-22'
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Service Robots in UAE Hospitality',
    slug: 'future-service-robots-uae-hospitality',
    excerpt: 'Exploring how service robots are transforming the hospitality industry across the UAE.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Industry Trends',
    author: 'Fortune Robotics Team',
    featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['robotics', 'hospitality', 'UAE', 'automation'],
    status: 'published',
    seoTitle: 'Service Robots UAE Hospitality - Fortune Robotics',
    seoDescription: 'Discover how service robots are revolutionizing UAE hospitality industry...',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-21'
  },
  {
    id: '2',
    title: 'Robot Maintenance: Best Practices Guide',
    slug: 'robot-maintenance-best-practices',
    excerpt: 'Essential maintenance tips to keep your service robots running smoothly.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Robot Maintenance Tips',
    author: 'Technical Team',
    featuredImage: 'https://images.pexels.com/photos/8386427/pexels-photo-8386427.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['maintenance', 'tips', 'longevity'],
    status: 'draft',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-19'
  }
];

export const mockResearchProjects: ResearchProject[] = [
  {
    id: '1',
    title: 'Advanced Navigation AI for Indoor Environments',
    description: 'Developing next-generation navigation algorithms for complex indoor spaces.',
    category: 'innovation',
    content: 'Our research focuses on improving robot navigation in dynamic environments...',
    images: ['https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600'],
    status: 'active',
    startDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    title: 'Dubai Mall Robot Deployment Success Story',
    description: 'Case study of successful robot deployment in Dubai Mall.',
    category: 'case-study',
    content: 'Implementation of 50 service robots across Dubai Mall resulted in...',
    images: ['https://images.pexels.com/photos/8386427/pexels-photo-8386427.jpeg?auto=compress&cs=tinysrgb&w=600'],
    status: 'completed',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    createdAt: '2023-06-01',
    updatedAt: '2024-01-05'
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Ahmed Al-Mansouri',
    company: 'Dubai Hospitality Group',
    position: 'Operations Manager',
    content: 'Fortune Robotics delivered exceptional service robots that transformed our guest experience.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    clientName: 'Sarah Johnson',
    company: 'Emirates Healthcare',
    position: 'Director of Operations',
    content: 'The Temi robots have significantly improved patient care and staff efficiency.',
    rating: 5,
    status: 'active',
    createdAt: '2024-01-10'
  }
];

export const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Dubai Municipality',
    logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
    type: 'certification',
    website: 'https://www.dm.gov.ae',
    description: 'Official certification for robotics deployment in Dubai',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'UAE AI Council',
    logo: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=200',
    type: 'partner',
    description: 'Strategic partnership for AI development',
    status: 'active',
    createdAt: '2024-01-05'
  }
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Mohammad Hassan',
    email: 'mhassan@example.com',
    phone: '+971501234567',
    company: 'Dubai Restaurant Group',
    robotInterest: 'D2 Delivery Robot',
    purposeOfUse: 'Food delivery in restaurants',
    expectedQuantity: 5,
    message: 'Interested in bulk purchase for our restaurant chain.',
    status: 'new',
    source: 'website',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22'
  },
  {
    id: '2',
    name: 'Lisa Chen',
    email: 'lchen@hospital.ae',
    phone: '+971502345678',
    company: 'Al Zahra Hospital',
    robotInterest: 'Temi Robot',
    purposeOfUse: 'Patient assistance and information',
    expectedQuantity: 3,
    message: 'Need robots for patient care support.',
    status: 'contacted',
    source: 'referral',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-21'
  }
];