import type { NextApiRequest, NextApiResponse } from 'next';

interface TemplateStyles {
  [key: string]: {
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      glow?: string;
    };
    layout: string;
    category: string;
    name: string;
  };
}

const TEMPLATE_STYLES: TemplateStyles = {
  'nexus-futuristic': {
    colorScheme: {
      primary: '#00D4FF',
      secondary: '#0A0A0F',
      accent: '#FF006E',
      background: '#000000',
      glow: '#00D4FF'
    },
    layout: 'futuristic',
    category: 'Tech',
    name: 'NEXUS'
  },
  'lumina-glow': {
    colorScheme: {
      primary: '#1A1A1A',
      secondary: '#FEFBF6',
      accent: '#D4AF37',
      background: '#FEFBF6',
      glow: '#FFD700'
    },
    layout: 'boutique',
    category: 'Fashion',
    name: 'LUMINA'
  },
  'velocity-interactive': {
    colorScheme: {
      primary: '#FF3366',
      secondary: '#1E1E1E',
      accent: '#00FF88',
      background: '#F8F8F8',
      glow: '#FF3366'
    },
    layout: 'immersive',
    category: 'Creative',
    name: 'VELOCITY'
  },
  'aurora-ai-art': {
    colorScheme: {
      primary: '#8B5CF6',
      secondary: '#0F0F23',
      accent: '#F59E0B',
      background: '#111111',
      glow: '#8B5CF6'
    },
    layout: 'futuristic',
    category: 'Digital',
    name: 'AURORA'
  },
  'zenith-minimal': {
    colorScheme: {
      primary: '#000000',
      secondary: '#FEFEFE',
      accent: '#FF4500',
      background: '#FAFAFA',
      glow: '#FF4500'
    },
    layout: 'minimal',
    category: 'Minimal',
    name: 'ZENITH'
  },
  'prisma-3d-surreal': {
    colorScheme: {
      primary: '#FF1493',
      secondary: '#4B0082',
      accent: '#FFD700',
      background: '#2F1B69',
      glow: '#FF1493'
    },
    layout: 'immersive',
    category: 'Art',
    name: 'PRISMA'
  }
};

function generateWebsitePreviewSVG(templateId: string, view: string = 'hero'): string {
  const template = TEMPLATE_STYLES[templateId];
  if (!template) {
    // Fallback for unknown templates
    return generateFallbackSVG(templateId, view);
  }

  const { colorScheme, layout, category, name } = template;
  
  // Different layouts based on view type
  switch (view) {
    case 'hero':
      return generateHeroPreview(template, templateId);
    case 'desktop':
      return generateDesktopPreview(template, templateId);
    case 'mobile':
      return generateMobilePreview(template, templateId);
    case 'structure':
      return generateStructurePreview(template, templateId);
    default:
      return generateHeroPreview(template, templateId);
  }
}

function generateHeroPreview(template: any, templateId: string): string {
  const { colorScheme, name, category, layout } = template;
  
  const isMinimal = layout === 'minimal';
  const isFuturistic = layout === 'futuristic';
  const isImmersive = layout === 'immersive';
  
  return `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorScheme.background};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:0.9" />
        </linearGradient>
        ${isFuturistic ? `
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>` : ''}
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="800" height="600" fill="url(#bg-grad)"/>
      
      <!-- Browser Chrome -->
      <rect x="20" y="20" width="760" height="560" rx="12" fill="white" filter="url(#shadow)"/>
      <rect x="20" y="20" width="760" height="40" rx="12" fill="#f5f5f5"/>
      <circle cx="45" cy="40" r="6" fill="#ff5f57"/>
      <circle cx="65" cy="40" r="6" fill="#ffbd2e"/>
      <circle cx="85" cy="40" r="6" fill="#28ca42"/>
      <rect x="120" y="32" width="500" height="16" rx="8" fill="#e5e5e5"/>
      
      <!-- Website Content -->
      <g transform="translate(20, 60)">
        ${isMinimal ? generateMinimalLayout(colorScheme, name) : ''}
        ${isFuturistic ? generateFuturisticLayout(colorScheme, name) : ''}
        ${isImmersive ? generateImmersiveLayout(colorScheme, name) : ''}
        ${!isMinimal && !isFuturistic && !isImmersive ? generateDefaultLayout(colorScheme, name) : ''}
      </g>
      
      <!-- Template Label -->
      <rect x="600" y="550" width="180" height="30" rx="15" fill="${colorScheme.primary}" opacity="0.9"/>
      <text x="690" y="570" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${name} Template</text>
    </svg>
  `;
}

function generateMinimalLayout(colorScheme: any, name: string): string {
  return `
    <!-- Header -->
    <rect x="0" y="0" width="760" height="80" fill="${colorScheme.background}"/>
    <text x="50" y="45" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${name}</text>
    <rect x="600" y="30" width="60" height="20" rx="10" fill="${colorScheme.primary}"/>
    <rect x="680" y="30" width="60" height="20" rx="10" fill="transparent" stroke="${colorScheme.primary}" stroke-width="1"/>
    
    <!-- Hero Section -->
    <rect x="0" y="100" width="760" height="300" fill="${colorScheme.secondary}"/>
    <text x="380" y="200" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="36" font-weight="300">Simple.</text>
    <text x="380" y="240" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="36" font-weight="300">Beautiful.</text>
    <text x="380" y="280" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="36" font-weight="300">Minimal.</text>
    <rect x="320" y="320" width="120" height="40" rx="20" fill="${colorScheme.accent}"/>
    <text x="380" y="345" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14">Shop Now</text>
    
    <!-- Product Grid -->
    <g transform="translate(0, 420)">
      <rect x="50" y="0" width="150" height="100" fill="white" stroke="${colorScheme.primary}" stroke-width="0.5"/>
      <rect x="220" y="0" width="150" height="100" fill="white" stroke="${colorScheme.primary}" stroke-width="0.5"/>
      <rect x="390" y="0" width="150" height="100" fill="white" stroke="${colorScheme.primary}" stroke-width="0.5"/>
      <rect x="560" y="0" width="150" height="100" fill="white" stroke="${colorScheme.primary}" stroke-width="0.5"/>
    </g>
  `;
}

function generateFuturisticLayout(colorScheme: any, name: string): string {
  return `
    <!-- Header with Glow -->
    <rect x="0" y="0" width="760" height="60" fill="${colorScheme.secondary}"/>
    <text x="50" y="35" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="20" font-weight="bold" filter="url(#glow)">${name}</text>
    <rect x="600" y="20" width="50" height="20" rx="10" fill="${colorScheme.primary}" filter="url(#glow)"/>
    <rect x="660" y="20" width="50" height="20" rx="10" fill="transparent" stroke="${colorScheme.primary}" stroke-width="1" filter="url(#glow)"/>
    
    <!-- Holographic Hero -->
    <rect x="0" y="80" width="760" height="250" fill="${colorScheme.background}"/>
    <polygon points="100,150 300,120 500,160 700,130 700,300 100,330" fill="${colorScheme.primary}" opacity="0.1"/>
    <text x="380" y="180" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="28" font-weight="bold" filter="url(#glow)">FUTURE TECH</text>
    <text x="380" y="210" text-anchor="middle" fill="${colorScheme.accent}" font-family="Arial, sans-serif" font-size="16" filter="url(#glow)">Next-Gen Experience</text>
    <rect x="320" y="240" width="120" height="35" rx="17" fill="${colorScheme.accent}" filter="url(#glow)"/>
    <text x="380" y="262" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">EXPLORE</text>
    
    <!-- Glowing Product Cards -->
    <g transform="translate(0, 350)">
      <rect x="60" y="20" width="140" height="120" rx="8" fill="${colorScheme.secondary}" stroke="${colorScheme.primary}" stroke-width="1" filter="url(#glow)"/>
      <rect x="220" y="20" width="140" height="120" rx="8" fill="${colorScheme.secondary}" stroke="${colorScheme.primary}" stroke-width="1" filter="url(#glow)"/>
      <rect x="380" y="20" width="140" height="120" rx="8" fill="${colorScheme.secondary}" stroke="${colorScheme.primary}" stroke-width="1" filter="url(#glow)"/>
      <rect x="540" y="20" width="140" height="120" rx="8" fill="${colorScheme.secondary}" stroke="${colorScheme.primary}" stroke-width="1" filter="url(#glow)"/>
    </g>
  `;
}

function generateImmersiveLayout(colorScheme: any, name: string): string {
  return `
    <!-- Dynamic Header -->
    <rect x="0" y="0" width="760" height="70" fill="${colorScheme.background}"/>
    <circle cx="100" cy="35" r="20" fill="${colorScheme.primary}"/>
    <text x="140" y="40" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${name}</text>
    <rect x="600" y="25" width="60" height="20" rx="10" fill="${colorScheme.accent}"/>
    <rect x="670" y="25" width="60" height="20" rx="10" fill="transparent" stroke="${colorScheme.accent}" stroke-width="1"/>
    
    <!-- Interactive Hero -->
    <rect x="0" y="90" width="760" height="280" fill="${colorScheme.secondary}"/>
    <circle cx="200" cy="180" r="60" fill="${colorScheme.primary}" opacity="0.3"/>
    <circle cx="400" cy="220" r="40" fill="${colorScheme.accent}" opacity="0.4"/>
    <circle cx="600" cy="160" r="50" fill="${colorScheme.primary}" opacity="0.2"/>
    <text x="380" y="200" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="32" font-weight="bold">Interactive</text>
    <text x="380" y="230" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="32" font-weight="bold">Experience</text>
    <rect x="320" y="260" width="120" height="40" rx="20" fill="${colorScheme.accent}"/>
    <text x="380" y="285" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14">Dive In</text>
    
    <!-- Dynamic Cards -->
    <g transform="translate(0, 390)">
      <rect x="40" y="10" width="160" height="110" rx="12" fill="white" transform="rotate(-2 120 65)" filter="url(#shadow)"/>
      <rect x="200" y="10" width="160" height="110" rx="12" fill="white" transform="rotate(1 280 65)" filter="url(#shadow)"/>
      <rect x="360" y="10" width="160" height="110" rx="12" fill="white" transform="rotate(-1 440 65)" filter="url(#shadow)"/>
      <rect x="520" y="10" width="160" height="110" rx="12" fill="white" transform="rotate(2 600 65)" filter="url(#shadow)"/>
    </g>
  `;
}

function generateDefaultLayout(colorScheme: any, name: string): string {
  return `
    <!-- Standard Header -->
    <rect x="0" y="0" width="760" height="60" fill="white"/>
    <text x="50" y="35" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="20" font-weight="bold">${name}</text>
    <rect x="600" y="20" width="60" height="20" rx="10" fill="${colorScheme.primary}"/>
    <rect x="670" y="20" width="60" height="20" rx="10" fill="transparent" stroke="${colorScheme.primary}" stroke-width="1"/>
    
    <!-- Hero Section -->
    <rect x="0" y="80" width="760" height="200" fill="${colorScheme.background}"/>
    <text x="380" y="150" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="28" font-weight="bold">Welcome to ${name}</text>
    <text x="380" y="180" text-anchor="middle" fill="${colorScheme.secondary}" font-family="Arial, sans-serif" font-size="16">Discover amazing products</text>
    <rect x="320" y="200" width="120" height="35" rx="17" fill="${colorScheme.accent}"/>
    <text x="380" y="222" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">Shop Now</text>
    
    <!-- Product Grid -->
    <g transform="translate(0, 300)">
      <rect x="60" y="20" width="140" height="120" rx="8" fill="white" filter="url(#shadow)"/>
      <rect x="220" y="20" width="140" height="120" rx="8" fill="white" filter="url(#shadow)"/>
      <rect x="380" y="20" width="140" height="120" rx="8" fill="white" filter="url(#shadow)"/>
      <rect x="540" y="20" width="140" height="120" rx="8" fill="white" filter="url(#shadow)"/>
    </g>
  `;
}

function generateDesktopPreview(template: any, templateId: string): string {
  // Similar structure but optimized for desktop view
  return generateHeroPreview(template, templateId);
}

function generateMobilePreview(template: any, templateId: string): string {
  const { colorScheme, name } = template;
  
  return `
    <svg width="400" height="800" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg">
      <!-- Mobile phone frame -->
      <rect x="20" y="20" width="360" height="760" rx="30" fill="#2d2d2d" filter="url(#shadow)"/>
      <rect x="30" y="30" width="340" height="740" rx="25" fill="black"/>
      <rect x="40" y="60" width="320" height="680" rx="15" fill="white"/>
      
      <!-- Mobile content -->
      <g transform="translate(40, 60)">
        <rect x="0" y="0" width="320" height="60" fill="${colorScheme.primary}"/>
        <text x="160" y="35" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">${name}</text>
        
        <rect x="0" y="80" width="320" height="200" fill="${colorScheme.background}"/>
        <text x="160" y="150" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="20" font-weight="bold">Mobile</text>
        <text x="160" y="175" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="20" font-weight="bold">Optimized</text>
        <rect x="120" y="200" width="80" height="30" rx="15" fill="${colorScheme.accent}"/>
        
        <rect x="20" y="300" width="280" height="80" rx="8" fill="${colorScheme.secondary}"/>
        <rect x="20" y="400" width="280" height="80" rx="8" fill="${colorScheme.secondary}"/>
        <rect x="20" y="500" width="280" height="80" rx="8" fill="${colorScheme.secondary}"/>
      </g>
      
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
    </svg>
  `;
}

function generateStructurePreview(template: any, templateId: string): string {
  const { colorScheme, name } = template;
  
  return `
    <svg width="800" height="1200" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="1200" fill="#f8f9fa"/>
      
      <!-- Wireframe structure -->
      <text x="400" y="50" text-anchor="middle" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${name} Structure</text>
      
      <!-- Header wireframe -->
      <rect x="50" y="100" width="700" height="60" fill="none" stroke="${colorScheme.primary}" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="70" y="135" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="12">Header</text>
      
      <!-- Hero wireframe -->
      <rect x="50" y="180" width="700" height="200" fill="none" stroke="${colorScheme.primary}" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="70" y="205" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="12">Hero Section</text>
      
      <!-- Content sections -->
      <rect x="50" y="400" width="340" height="150" fill="none" stroke="${colorScheme.accent}" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="70" y="425" fill="${colorScheme.accent}" font-family="Arial, sans-serif" font-size="12">Products</text>
      
      <rect x="410" y="400" width="340" height="150" fill="none" stroke="${colorScheme.accent}" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="430" y="425" fill="${colorScheme.accent}" font-family="Arial, sans-serif" font-size="12">Features</text>
      
      <!-- Footer -->
      <rect x="50" y="1100" width="700" height="80" fill="none" stroke="${colorScheme.primary}" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="70" y="1125" fill="${colorScheme.primary}" font-family="Arial, sans-serif" font-size="12">Footer</text>
    </svg>
  `;
}

function generateFallbackSVG(templateId: string, view: string): string {
  return `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#f3f4f6"/>
      <text x="400" y="300" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="24">Template Preview</text>
      <text x="400" y="330" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">${templateId}</text>
    </svg>
  `;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { params } = req.query;
  
  if (!Array.isArray(params) || params.length === 0) {
    return res.status(400).json({ error: 'Template ID required' });
  }
  
  const templateId = params[0];
  const view = req.query.view as string || 'hero';
  
  try {
    const svg = generateWebsitePreviewSVG(templateId, view);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error generating template preview:', error);
    const fallbackSvg = generateFallbackSVG(templateId, view);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(fallbackSvg);
  }
} 