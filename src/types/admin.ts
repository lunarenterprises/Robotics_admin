export interface Robot {
  id: string;
  name: string;
  image: string;
  category: 'pricing' | 'quote' | 'rental';
  features: string[];
  specs: Record<string, string>;
  price?: number;
  currency?: string;
  useCases: string[];
  industries: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featuredImage: string;
  tags: string[];
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  category: 'roadmap' | 'innovation' | 'case-study' | 'current-project';
  content: string;
  images: string[];
  status: 'active' | 'completed' | 'planning';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  position: string;
  content: string;
  rating: number;
  image?: string;
  logo?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'certification' | 'partner' | 'client';
  website?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  robotInterest: string;
  purposeOfUse: string;
  expectedQuantity: number;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  source: 'website' | 'phone' | 'email' | 'referral';
  createdAt: string;
  updatedAt: string;
}