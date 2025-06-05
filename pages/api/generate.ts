import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface ComponentPosition {
  x: number;
  y: number;
}

interface GenerateRequest {
  brand: string;
  industry: string;
  components: string[];
  componentPositions: { [key: string]: ComponentPosition };
  products: any[];
}

const componentTemplates = {
  hero: (brand: string, industry: string, theme: any) => `
    <section class="hero-section">
      <div class="container mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl font-bold mb-4">Welcome to ${brand}</h1>
        <p class="text-xl mb-8">Your premier ${industry} destination</p>
        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Shop Now
        </button>
      </div>
    </section>
  `,

  'featured-products': (products: any[], theme: any) => {
    const featuredProducts = products.slice(0, 4);
    return `
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${featuredProducts.map((product, index) => `
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="aspect-w-1 aspect-h-1 w-full">
                  <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="w-full h-48 object-cover"
                  />
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                  <p class="text-gray-600 mb-2">${product.description}</p>
                  <p class="text-xl font-bold text-blue-600">$${product.price}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="text-center mt-8">
            <button 
              onclick="window.location.href='/products?products=' + encodeURIComponent(JSON.stringify(${JSON.stringify(products)}))"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>
    `;
  },

  'products-page': (theme: any) => {
    return `
      <section class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Our Products</h2>
          <div class="text-center">
            <a 
              href="/products" 
              class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </a>
          </div>
        </div>
      </section>
    `;
  },

  testimonials: (brand: string) => `
    <section class="testimonials-section">
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <p class="text-gray-600 mb-4">"Amazing experience shopping at ${brand}. The quality is outstanding!"</p>
            <p class="font-semibold">- John Doe</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <p class="text-gray-600 mb-4">"Best customer service and products I've ever encountered."</p>
            <p class="font-semibold">- Jane Smith</p>
          </div>
        </div>
      </div>
    </section>
  `,

  contact: () => `
    <section class="contact-section">
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold mb-8 text-center">Contact Us</h2>
        <form class="max-w-lg mx-auto">
          <div class="mb-4">
            <input type="text" placeholder="Your Name" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <input type="email" placeholder="Your Email" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <textarea placeholder="Your Message" class="w-full p-2 border rounded" rows="4"></textarea>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </section>
  `
};

function generateProductGrid(products: any[]) {
  return products.map(product => `
    <div class="bg-white p-4 rounded-lg shadow-md">
      <h3 class="font-semibold mb-2">${product.name}</h3>
      <p class="text-gray-600 mb-2">$${product.price}</p>
      <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Add to Cart
      </button>
    </div>
  `).join('');
}

const themes = [
  {
    name: 'Modern Minimal',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      background: '#ffffff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    }
  },
  {
    name: 'Elegant Dark',
    colors: {
      primary: '#8b5cf6',
      secondary: '#6d28d9',
      background: '#111827',
      text: '#f3f4f6'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter'
    }
  },
  {
    name: 'Warm Professional',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      background: '#fafaf9',
      text: '#44403c'
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Inter'
    }
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { brand, industry, components, products, suggestedModifications } = req.body;

    // Generate a random theme
    const theme = themes[Math.floor(Math.random() * themes.length)];

    // Generate layout with theme
    const layout = components
      .map((component: string) => {
        if (component === 'featured-products') {
          return componentTemplates['featured-products'](products, theme);
        }
        if (component === 'products-page') {
          return componentTemplates['products-page'](theme);
        }
        if (component === 'hero') {
          return componentTemplates.hero(brand, industry, theme);
        }
        if (component === 'testimonials') {
          return componentTemplates.testimonials(brand);
        }
        if (component === 'contact') {
          return componentTemplates.contact();
        }
        return '';
      })
      .join('\n');

    // Wrap layout with theme styles
    const html = `
      <style>
        :root {
          --primary: ${theme.colors.primary};
          --secondary: ${theme.colors.secondary};
          --background: ${theme.colors.background};
          --text: ${theme.colors.text};
        }
        
        body {
          font-family: ${theme.fonts.body}, sans-serif;
          background-color: var(--background);
          color: var(--text);
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: ${theme.fonts.heading}, serif;
        }
        
        .btn-primary {
          background-color: var(--primary);
          color: white;
        }
        
        .btn-secondary {
          background-color: var(--secondary);
          color: white;
        }
      </style>
      ${layout}
    `;

    res.status(200).json({ 
      result: html,
      theme: theme.name
    });
  } catch (error) {
    console.error('Layout generation error:', error);
    res.status(500).json({ error: 'Failed to generate layout' });
  }
}
