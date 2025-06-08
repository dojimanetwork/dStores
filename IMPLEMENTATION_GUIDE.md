# dStores Visual Builder Implementation Guide

## 🎯 Problem Statement
- Plasmic Studio iframe embedding fails due to CORS/X-Frame-Options
- Need visual builder for e-commerce stores with dynamic functionality
- Users need drag-and-drop interface to design stores
- Stores must have working cart, products, and commerce features

## ✅ Current Solution: Builder.io Integration

### Features Implemented
- ✅ Visual drag-and-drop interface
- ✅ E-commerce specific components (Product Cards, Cart Widget, etc.)
- ✅ Store preview functionality
- ✅ Component palette with categories
- ✅ Shared component library
- ✅ Responsive design
- ✅ Save/load functionality

### Components Available
1. **Layout Components**
   - Hero Section (customizable title, subtitle, buttons, background)
   - Product Grid (configurable columns, titles)
   - Category Cards with hover effects

2. **E-commerce Components**
   - Product Card (with ratings, pricing, sale badges)
   - Cart Widget (with item count badge)
   - Feature Highlights (shipping, security, etc.)

3. **Marketing Components**
   - Newsletter Signup
   - Feature showcases
   - Social media integration

### Setup Instructions
1. Get Builder.io API key from [builder.io](https://builder.io)
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_BUILDER_API_KEY=your_api_key_here
   ```
3. Components are auto-registered and ready to use

## 🚀 Alternative Approaches

### Option 1: Custom React-Based Builder

If you want full control without third-party dependencies:

```typescript
// Custom drag-and-drop implementation
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Component registry
const COMPONENTS = {
  'hero': HeroSection,
  'product-grid': ProductGrid,
  'cart-widget': CartWidget
};

// Drag source
const DraggableComponent = ({ type, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return <div ref={drag}>{children}</div>;
};

// Drop target
const DropZone = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item) => onDrop(item.type),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return <div ref={drop}>{children}</div>;
};
```

### Option 2: GrapesJS Integration

Pure client-side visual builder:

```bash
npm install grapesjs grapesjs-preset-webpage
```

```javascript
import grapesjs from 'grapesjs';

const editor = grapesjs.init({
  container: '#gjs',
  components: '<div>Your initial content</div>',
  plugins: ['gjs-preset-webpage'],
  pluginsOpts: {
    'gjs-preset-webpage': {}
  }
});

// Add custom e-commerce blocks
editor.BlockManager.add('product-card', {
  label: 'Product Card',
  content: `<div class="product-card">...</div>`,
  category: 'E-commerce'
});
```

### Option 3: Craft.js Implementation

React-based page builder:

```bash
npm install @craftjs/core
```

```typescript
import { Editor, Frame, Element } from '@craftjs/core';

const App = () => {
  return (
    <Editor resolver={{ 
      ProductCard, 
      ProductGrid, 
      HeroSection 
    }}>
      <Frame>
        <Element is="div" canvas>
          <ProductGrid />
        </Element>
      </Frame>
    </Editor>
  );
};
```

## 🛒 Dynamic E-commerce Functionality

### Cart State Management
```typescript
// Global cart state using Zustand
import { create } from 'zustand';

interface CartState {
  items: CartItem[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
}

const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => set((state) => ({
    items: [...state.items, { ...product, quantity: 1 }]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity } : item
    )
  })),
  total: get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}));
```

### Product Data Integration
```typescript
// API integration for dynamic products
const useProducts = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Connect to your product API
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);
  
  return products;
};

// Dynamic ProductGrid component
const ProductGrid = ({ categoryId, limit = 6 }) => {
  const products = useProducts();
  
  const filteredProducts = products
    .filter(p => !categoryId || p.categoryId === categoryId)
    .slice(0, limit);
    
  return (
    <div className="grid grid-cols-3 gap-6">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

## 🎨 Theming & Customization

### Dynamic Theme System
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

const ThemeProvider = ({ theme, children }) => {
  const cssVariables = {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--font-heading': theme.fonts.heading,
    // ... more variables
  };
  
  return (
    <div style={cssVariables}>
      {children}
    </div>
  );
};
```

## 💾 Store Configuration & Persistence

### Store Schema
```typescript
interface StoreConfig {
  id: string;
  name: string;
  theme: Theme;
  layout: {
    components: ComponentConfig[];
    pages: PageConfig[];
  };
  products: Product[];
  settings: {
    currency: string;
    shipping: ShippingConfig;
    payments: PaymentConfig;
  };
}

// Save store configuration
const saveStore = async (config: StoreConfig) => {
  await fetch('/api/stores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
};
```

## 🚀 Next Steps

### Immediate Actions
1. ✅ Current Builder.io implementation is ready to use
2. 🔄 Add your Builder.io API key to environment variables
3. 🎨 Customize component styles to match your brand
4. 🛒 Integrate with your product/inventory API
5. 💳 Add payment processing (Stripe, PayPal, etc.)

### Future Enhancements
- [ ] Multi-page store builder
- [ ] Advanced theme customization
- [ ] SEO optimization tools
- [ ] Analytics integration
- [ ] Multi-language support
- [ ] Mobile app integration

## 📞 Professional Services Available

If you need help implementing any of these solutions or want a custom-built visual builder specifically for your needs, professional development services are available for:

- Custom visual builder development
- E-commerce API integration
- Payment processing setup
- Performance optimization
- Deployment and hosting setup

The current Builder.io implementation provides a solid foundation that can be extended and customized to meet your specific requirements. 