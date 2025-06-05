export interface TemplateNavAction {
  label: string;
  target: string;
}

export interface TemplatePage {
  key: string;
  label: string;
  img: string;
  alt: string;
  nav?: TemplateNavAction[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  designer: string;
  tags: string[];
  features: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    glow?: string;
  };
  layout: 'landing' | 'storefront' | 'marketplace' | 'boutique' | 'minimal' | 'futuristic' | 'immersive';
  demoUrl: string;
  previewImages: {
    hero: string;
    desktop: string;
    mobile: string;
    structure: string;
  };
  designTrends: string[];
  animationLevel: 'subtle' | 'moderate' | 'dynamic' | 'cinematic';
  pages: TemplatePage[];
}

// Beautiful sample products for dummy data
export const SAMPLE_PRODUCTS = {
  skincare: [
    {
      name: "Vitamin C Brightening Serum",
      price: 89.99,
      originalPrice: 119.99,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
      rating: 4.8,
      reviews: 1247
    },
    {
      name: "Hydrating Rose Face Mist",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
      rating: 4.6,
      reviews: 892
    },
    {
      name: "Anti-Aging Night Cream",
      price: 125.00,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
      rating: 4.9,
      reviews: 2156
    }
  ],
  fashion: [
    {
      name: "Organic Cotton Oversized Tee",
      price: 39.99,
      originalPrice: 59.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      rating: 4.7,
      reviews: 1834
    },
    {
      name: "Sustainable Denim Jacket",
      price: 189.99,
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500",
      rating: 4.5,
      reviews: 967
    },
    {
      name: "Minimalist Leather Sneakers",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      rating: 4.8,
      reviews: 1456
    }
  ],
  electronics: [
    {
      name: "Wireless Noise-Canceling Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      rating: 4.9,
      reviews: 3247
    },
    {
      name: "Smart Fitness Watch",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500",
      rating: 4.6,
      reviews: 2189
    },
    {
      name: "Portable Bluetooth Speaker",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      rating: 4.7,
      reviews: 1678
    }
  ],
  home: [
    {
      name: "Scandinavian Ceramic Vase",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500",
      rating: 4.8,
      reviews: 892
    },
    {
      name: "Organic Cotton Throw Blanket",
      price: 69.99,
      originalPrice: 89.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
      rating: 4.7,
      reviews: 1234
    },
    {
      name: "Modern Wall Art Set",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500",
      rating: 4.5,
      reviews: 567
    }
  ]
};

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'nexus-futuristic',
    name: 'NEXUS - Futuristic Commerce',
    description: 'Award-winning futuristic template with sci-fi gaming UI aesthetics, holographic elements, and cinematic glow effects. Features advanced cursor interactions, smooth scroll animations, and immersive 3D-like depth.',
    category: 'Tech & Electronics',
    designer: 'Future Labs Design Studio',
    tags: ['futuristic', 'sci-fi', 'holographic', 'glow-effects', 'gaming-ui', 'premium'],
    features: ['Holographic Product Displays', 'Cinematic Scroll Animations', 'Gaming UI Elements', 'Glow & Light Effects', 'Advanced Cursor Interactions', '3D-Like Depth'],
    colorScheme: {
      primary: '#00D4FF',
      secondary: '#0A0A0F', 
      accent: '#FF006E',
      background: '#000000',
      glow: '#00D4FF'
    },
    layout: 'futuristic',
    demoUrl: '#',
    designTrends: ['glow-effects', 'sci-fi-gaming-ui', 'holographic', 'advanced-animations'],
    animationLevel: 'cinematic',
    previewImages: {
      hero: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600',
      desktop: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800',
      mobile: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=800',
      structure: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=1200'
    },
    pages: [
      {
        key: 'home',
        label: 'Futuristic Homepage',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200',
        alt: 'NEXUS Homepage - Futuristic design with holographic elements, glowing accents, and sci-fi gaming UI aesthetics',
        nav: [
          { label: 'Explore Products', target: 'products' },
          { label: 'Tech Specs', target: 'tech-specs' },
          { label: 'VR Experience', target: 'vr-demo' }
        ]
      },
      {
        key: 'products',
        label: 'Holographic Catalog',
        img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=1200',
        alt: 'Futuristic product catalog with holographic displays and glow effects',
        nav: [
          { label: 'Product Details', target: 'product-details' },
          { label: 'AR Preview', target: 'ar-view' },
          { label: 'Tech Compare', target: 'compare' }
        ]
      },
      {
        key: 'product-details',
        label: 'Immersive Product View',
        img: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=1200',
        alt: 'Cinematic product detail page with 3D-like presentation and gaming UI elements',
        nav: [
          { label: 'Add to Cart', target: 'cart' },
          { label: '360° View', target: '360-view' },
          { label: 'Customize', target: 'customizer' }
        ]
      }
    ]
  },
  {
    id: 'lumina-glow',
    name: 'LUMINA - Luxury Glow',
    description: 'Premium luxury template with sophisticated glow effects, window shadow overlays, and off-white aesthetics. Features advanced light manipulation, organic shadows, and award-winning visual hierarchy.',
    category: 'Fashion & Luxury',
    designer: 'Awwwards Studio Collective',
    tags: ['luxury', 'glow-effects', 'window-shadows', 'off-white', 'premium', 'organic'],
    features: ['Sophisticated Glow Effects', 'Window Shadow Overlays', 'Off-White Aesthetics', 'Organic Light Play', 'Premium Typography', 'Luxury Animations'],
    colorScheme: {
      primary: '#1A1A1A',
      secondary: '#FEFBF6', 
      accent: '#D4AF37',
      background: '#FEFBF6',
      glow: '#FFD700'
    },
    layout: 'boutique',
    demoUrl: '#',
    designTrends: ['glow-effects', 'window-shadow-overlays', 'off-white-aesthetic', 'organic-shadows'],
    animationLevel: 'dynamic',
    previewImages: {
      hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600',
      desktop: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800',
      mobile: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=800',
      structure: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1200'
    },
    pages: [
      {
        key: 'home',
        label: 'Luxury Homepage',
        img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200',
        alt: 'LUMINA Homepage - Luxury design with sophisticated glow effects and window shadow overlays',
        nav: [
          { label: 'Shop Collection', target: 'collection' },
          { label: 'Atelier', target: 'atelier' },
          { label: 'Heritage', target: 'heritage' }
        ]
      },
      {
        key: 'collection',
        label: 'Curated Collection',
        img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1200',
        alt: 'Luxury collection page with organic shadow overlays and premium glow effects',
        nav: [
          { label: 'Product Story', target: 'product-story' },
          { label: 'Craftsmanship', target: 'craftsmanship' },
          { label: 'Styling Guide', target: 'styling' }
        ]
      }
    ]
  },
  {
    id: 'velocity-interactive',
    name: 'VELOCITY - Interactive Experience',
    description: 'Cutting-edge template with Flash-era nostalgia meets modern tech. Features advanced scroll interactions, playful animations, cursor effects, and immersive storytelling elements.',
    category: 'Creative & Agency',
    designer: 'Interactive Motion Labs',
    tags: ['interactive', 'flash-nostalgia', 'scroll-animations', 'cursor-effects', 'storytelling', 'immersive'],
    features: ['Advanced Scroll Interactions', 'Flash-Era Nostalgia', 'Custom Cursor Effects', 'Immersive Storytelling', 'Playful Animations', 'Interactive Elements'],
    colorScheme: {
      primary: '#FF3366',
      secondary: '#1E1E1E', 
      accent: '#00FF88',
      background: '#F8F8F8',
      glow: '#FF3366'
    },
    layout: 'immersive',
    demoUrl: '#',
    designTrends: ['flash-era-nostalgia', 'advanced-scroll', 'cursor-effects', 'immersive-storytelling'],
    animationLevel: 'cinematic',
    previewImages: {
      hero: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600',
      desktop: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800',
      mobile: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=800',
      structure: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=1200'
    },
    pages: [
      {
        key: 'home',
        label: 'Interactive Homepage',
        img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=1200',
        alt: 'VELOCITY Homepage - Interactive experience with Flash-era nostalgia and modern animations',
        nav: [
          { label: 'Explore Story', target: 'story' },
          { label: 'Play Demo', target: 'demo' },
          { label: 'Interactive Gallery', target: 'gallery' }
        ]
      }
    ]
  },
  {
    id: 'aurora-ai-art',
    name: 'AURORA - AI Art Gallery',
    description: 'Next-generation template showcasing AI-generated imagery with holographic effects, data visualization, and cutting-edge aesthetic. Perfect for tech-forward brands and digital art platforms.',
    category: 'Digital Art & AI',
    designer: 'AI Design Collective',
    tags: ['ai-generated', 'holographic', 'data-viz', 'cutting-edge', 'digital-art', 'tech-forward'],
    features: ['AI-Generated Imagery', 'Holographic Displays', 'Data Visualization', 'Tech-Forward Design', 'Digital Art Showcase', 'Innovative Layouts'],
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#0F0F23', 
      accent: '#F59E0B',
      background: '#111111',
      glow: '#8B5CF6'
    },
    layout: 'futuristic',
    demoUrl: '#',
    designTrends: ['ai-generated-imagery', 'holographic', 'data-visualization', 'tech-forward'],
    animationLevel: 'dynamic',
    previewImages: {
      hero: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600',
      desktop: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800',
      mobile: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=800',
      structure: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=1200'
    },
    pages: [
      {
        key: 'home',
        label: 'AI Art Homepage',
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=1200',
        alt: 'AURORA Homepage - AI-generated art gallery with holographic effects and data visualization',
        nav: [
          { label: 'AI Gallery', target: 'gallery' },
          { label: 'Generate Art', target: 'generator' },
          { label: 'Data Insights', target: 'insights' }
        ]
      }
    ]
  },
  {
    id: 'zenith-minimal',
    name: 'ZENITH - Elevated Minimal',
    description: 'Award-winning minimalist template with sophisticated typography, subtle glow accents, and premium off-white aesthetics. Features clean brutalist elements with organic shadow overlays.',
    category: 'Minimal & Clean',
    designer: 'Pentagram Studio',
    tags: ['minimal', 'brutalist', 'typography', 'off-white', 'clean', 'sophisticated'],
    features: ['Award-Winning Typography', 'Sophisticated Minimalism', 'Subtle Glow Accents', 'Brutalist Elements', 'Off-White Aesthetic', 'Premium Layout'],
    colorScheme: {
      primary: '#000000',
      secondary: '#FEFEFE', 
      accent: '#FF4500',
      background: '#FAFAFA',
      glow: '#FF4500'
    },
    layout: 'minimal',
    demoUrl: '#',
    designTrends: ['minimalism-brutalism', 'typography-focus', 'off-white-aesthetic', 'subtle-glow'],
    animationLevel: 'subtle',
    previewImages: {
      hero: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600',
      desktop: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&h=800',
      mobile: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=800',
      structure: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=1200'
    },
    pages: [
      {
        key: 'home',
        label: 'Minimal Homepage',
        img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200',
        alt: 'ZENITH Homepage - Elevated minimalist design with sophisticated typography and subtle glow accents',
        nav: [
          { label: 'Portfolio', target: 'portfolio' },
          { label: 'Services', target: 'services' },
          { label: 'Contact', target: 'contact' }
        ]
      }
    ]
  },
  {
    id: 'prisma-3d-surreal',
    name: 'PRISMA - 3D Surreal',
    description: 'Groundbreaking surreal 3D template inspired by Salvador Dali with impossible geometries, mind-bending visuals, and avant-garde product presentations. Features cutting-edge WebGL effects.',
    category: 'Art & Surreal',
    designer: 'Surreal Design Labs',
    tags: ['surreal', '3d', 'salvador-dali', 'webgl', 'impossible-geometry', 'avant-garde'],
    features: ['Surreal 3D Elements', 'Impossible Geometries', 'WebGL Effects', 'Avant-Garde Design', 'Mind-Bending Visuals', 'Artistic Product Display'],
    colorScheme: {
      primary: '#FF1493',
      secondary: '#4B0082', 
      accent: '#FFD700',
      background: '#2F1B69',
      glow: '#FF1493'
    },
    layout: 'immersive',
    demoUrl: '#',
    designTrends: ['surrealism-3d', 'impossible-geometry', 'webgl-effects', 'avant-garde'],
    animationLevel: 'cinematic',
    previewImages: {
      hero: 'https://images.unsplash.com/photo-1634912314704-c646c586b131?w=800&h=600',
      desktop: 'https://images.unsplash.com/photo-1616628188859-7a09abb2c2e4?w=1200&h=800',
      mobile: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=400&h=800',
      structure: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&h=1200'
    },
    pages: [
      {
        key: 'home',
        label: 'Surreal Homepage',
        img: 'https://images.unsplash.com/photo-1634912314704-c646c586b131?w=800&h=1200',
        alt: 'PRISMA Homepage - Surreal 3D design with impossible geometries and mind-bending visuals',
        nav: [
          { label: 'Surreal Gallery', target: 'gallery' },
          { label: 'Dream Shop', target: 'shop' },
          { label: 'Reality Warp', target: 'warp' }
        ]
      }
    ]
  }
];

// Export additional design trend categories for filtering
export const DESIGN_TRENDS = {
  'glow-effects': 'Glow & Light Effects',
  'sci-fi-gaming-ui': 'Sci-Fi Gaming UI',
  'window-shadow-overlays': 'Window & Shadow Overlays',
  'flash-era-nostalgia': 'Flash Era Nostalgia',
  'ai-generated-imagery': 'AI-Generated Imagery',
  'holographic': 'Holographic Elements',
  'advanced-scroll': 'Advanced Scroll Interactions',
  'cursor-effects': 'Custom Cursor Effects',
  'off-white-aesthetic': 'Off-White Aesthetic',
  'minimalism-brutalism': 'Minimalism & Brutalism',
  'surrealism-3d': 'Surrealism in 3D',
  'data-visualization': 'Data Visualization',
  'immersive-storytelling': 'Immersive Storytelling',
  'typography-focus': 'Typography Focus'
};

export const ANIMATION_LEVELS = {
  'subtle': 'Subtle & Refined',
  'moderate': 'Balanced Motion',
  'dynamic': 'Dynamic & Engaging',
  'cinematic': 'Cinematic Experience'
}; 