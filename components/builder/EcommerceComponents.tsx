import React from 'react';
import { useBuilderStore } from '@/stores/builderStore';

interface ThemeColors {
  background?: string;
  text?: string;
  primary?: string;
  secondary?: string;
  accent?: string;
  border?: string;
}

interface Theme {
  colors?: ThemeColors;
  fonts?: {
    heading: string;
    body: string;
  };
}

interface CartWidgetProps {
  itemCount?: number;
  showBadge?: boolean;
  theme?: Theme;
}

interface Category {
  name: string;
  image: string;
  productCount: number;
}

interface CategoryCardProps {
  category?: Category;
  theme?: Theme;
}

interface NewsletterSignupProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
  backgroundColor?: string;
  theme?: Theme;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureHighlightProps {
  features?: Feature[];
  theme?: Theme;
}

interface ThemeProviderProps {
  theme?: Theme;
  children: React.ReactNode;
}

// Product Card Component with dynamic data
export const ProductCard = ({
  product,
  productId,
  showFromUserProducts = false,
  className = "",
  theme,
  onAddToCart
}: {
  product?: any;
  productId?: number;
  showFromUserProducts?: boolean;
  className?: string;
  theme?: any;
  onAddToCart?: (product: any) => void;
}) => {
  const { products } = useBuilderStore();

  // Ensure products is an array before using find
  const productsArray = Array.isArray(products) ? products : [];

  // Use user's product if specified, otherwise use passed product or default
  const displayProduct = showFromUserProducts && productId
    ? productsArray.find(p => p && p.id === productId)
    : product || {
      id: 1,
      name: 'Sample Product',
      price: 99,
      image: '/api/placeholder/300/200',
      originalPrice: null,
      rating: 4.5,
      reviews: 127,
      description: 'A great product for your store'
    };

  const themeColors = theme?.colors || {
    primary: '#2563eb',
    text: '#1f2937',
    background: '#ffffff'
  };

  if (!displayProduct) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(displayProduct);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${className}`}
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="relative">
        <img
          src={displayProduct.image || '/api/placeholder/300/200'}
          alt={displayProduct.name || 'Product'}
          className="w-full h-48 object-cover rounded-md mb-3"
        />
        {displayProduct.originalPrice && displayProduct.originalPrice > displayProduct.price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Sale
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3
          className="font-semibold text-sm line-clamp-2"
          style={{ color: themeColors.text }}
        >
          {displayProduct.name || 'Product Name'}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(displayProduct.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500">({displayProduct.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span
            className="text-lg font-bold"
            style={{ color: themeColors.primary }}
          >
            ${displayProduct.price || 0}
          </span>
          {displayProduct.originalPrice && displayProduct.originalPrice > displayProduct.price && (
            <span className="text-sm text-gray-500 line-through">
              ${displayProduct.originalPrice}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-3 text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors text-sm font-medium"
          style={{ backgroundColor: themeColors.primary }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// Product Grid Component with dynamic products
export const ProductGrid = ({
  title = 'Featured Products',
  columns = 3,
  showViewAll = true,
  categoryFilter = null,
  limit = 6,
  showFromUserProducts = true,
  theme
}: {
  title?: string;
  columns?: number;
  showViewAll?: boolean;
  categoryFilter?: string | null;
  limit?: number;
  showFromUserProducts?: boolean;
  theme?: any;
}) => {
  const { products } = useBuilderStore();

  // Ensure we always start with an array
  let displayProducts = showFromUserProducts && Array.isArray(products) ? products : [];

  if (categoryFilter && displayProducts.length > 0) {
    displayProducts = displayProducts.filter(p =>
      p.category?.toLowerCase().includes(categoryFilter.toLowerCase())
    );
  }

  // Ensure displayProducts is still an array before slicing
  if (Array.isArray(displayProducts)) {
    displayProducts = displayProducts.slice(0, limit);
  } else {
    displayProducts = [];
  }

  // If no user products, show sample products
  if (displayProducts.length === 0) {
    displayProducts = Array.from({ length: Math.min(limit, 6) }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: 49 + (i * 10),
      image: `/api/placeholder/300/200?text=Product+${i + 1}`,
      rating: 4 + (i % 2 * 0.5),
      reviews: 50 + (i * 23),
      originalPrice: i % 3 === 0 ? 79 + (i * 10) : null
    }));
  }

  const themeColors = theme?.colors || {
    primary: '#2563eb',
    text: '#1f2937'
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-2xl font-bold"
          style={{ color: themeColors.text }}
        >
          {title}
        </h2>
        {showViewAll && (
          <button
            className="font-medium hover:opacity-80"
            style={{ color: themeColors.primary }}
          >
            View All →
          </button>
        )}
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 4)} gap-6`}>
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};

// Hero Section Component with theme support
export const HeroSection = ({
  title = 'Welcome to Your Store',
  subtitle = 'Discover amazing products at unbeatable prices',
  buttonText = 'Shop Now',
  secondaryButtonText = 'Learn More',
  backgroundImage = '/api/placeholder/1200/400',
  overlay = true,
  alignment = 'center',
  theme,
  editable = false,
  onEdit
}: {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  backgroundImage?: string;
  overlay?: boolean;
  alignment?: string;
  theme?: any;
  editable?: boolean;
  onEdit?: (field: string, value: string) => void;
}) => {
  const themeColors = theme?.colors || {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#ffffff'
  };

  const handleTextEdit = (field: string, value: string) => {
    if (onEdit) {
      onEdit(field, value);
    }
  };

  return (
    <div
      className="relative h-96 bg-cover bg-center rounded-lg flex items-center justify-center text-white overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {overlay && <div className="absolute inset-0 bg-black bg-opacity-40"></div>}
      <div className={`relative z-10 text-${alignment} max-w-2xl px-6`}>
        {editable ? (
          <input
            type="text"
            value={title}
            onChange={(e) => handleTextEdit('title', e.target.value)}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-transparent border-none outline-none text-center w-full"
            style={{ color: themeColors.text }}
          />
        ) : (
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
        )}

        {editable ? (
          <textarea
            value={subtitle}
            onChange={(e) => handleTextEdit('subtitle', e.target.value)}
            className="text-xl mb-8 opacity-90 bg-transparent border-none outline-none text-center w-full resize-none"
            style={{ color: themeColors.text }}
          />
        ) : (
          <p className="text-xl mb-8 opacity-90">{subtitle}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="px-8 py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: themeColors.primary }}
          >
            {buttonText}
          </button>
          {secondaryButtonText && (
            <button className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Cart Widget Component
export const CartWidget = ({ itemCount = 0, showBadge = true, theme }: CartWidgetProps) => {
  const themeColors = theme?.colors || {
    background: '#ffffff',
    text: '#1f2937'
  };

  return (
    <div
      className="fixed top-4 right-4 rounded-full p-3 shadow-lg border cursor-pointer hover:shadow-xl transition-shadow z-50"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="relative">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: themeColors.text }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
        </svg>
        {showBadge && itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
    </div>
  );
};

// Category Card Component
export const CategoryCard = ({
  category = {
    name: 'Electronics',
    image: '/api/placeholder/300/200',
    productCount: 150
  },
  theme
}: CategoryCardProps) => {
  const themeColors = theme?.colors || {
    background: '#ffffff'
  };

  return (
    <div
      className="relative rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      style={{ backgroundColor: themeColors.background }}
    >
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-lg font-semibold">{category.name}</h3>
        <p className="text-sm opacity-90">{category.productCount} products</p>
      </div>
    </div>
  );
};

// Newsletter Signup Component
export const NewsletterSignup = ({
  title = 'Stay Updated',
  subtitle = 'Get the latest deals and new arrivals in your inbox.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  backgroundColor = 'bg-blue-50',
  theme,
  editable = false,
  onEdit
}: NewsletterSignupProps) => {
  const themeColors = theme?.colors || {
    primary: '#2563eb',
    text: '#1f2937'
  };

  return (
    <div className={`${backgroundColor} rounded-lg p-8 text-center`}>
      {editable ? (
        <input
          type="text"
          value={title}
          onChange={(e) => onEdit && onEdit('title', e.target.value)}
          className="text-2xl font-bold mb-2 bg-transparent border-none outline-none text-center w-full"
          style={{ color: themeColors.text }}
        />
      ) : (
        <h3 className="text-2xl font-bold mb-2" style={{ color: themeColors.text }}>{title}</h3>
      )}

      {editable ? (
        <textarea
          value={subtitle}
          onChange={(e) => onEdit && onEdit('subtitle', e.target.value)}
          className="text-gray-600 mb-6 bg-transparent border-none outline-none text-center w-full resize-none"
        />
      ) : (
        <p className="text-gray-600 mb-6">{subtitle}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder={placeholder}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button
          className="text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: themeColors.primary }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Feature Highlight Component
export const FeatureHighlight = ({
  features = [
    { icon: 'truck', title: 'Free Shipping', description: 'On orders over $50' },
    { icon: 'clock', title: 'Fast Delivery', description: '2-3 business days' },
    { icon: 'shield', title: 'Secure Payments', description: 'SSL encryption' }
  ],
  theme
}: FeatureHighlightProps) => {
  const themeColors = theme?.colors || {
    primary: '#2563eb',
    text: '#1f2937',
    background: '#ffffff'
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactElement> = {
      truck: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
      ),
      clock: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      shield: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      )
    };
    return icons[iconName] || icons.shield;
  };

  return (
    <div className="py-12" style={{ backgroundColor: themeColors.background }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${themeColors.primary}20` }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: themeColors.primary }}
              >
                {getIcon(feature.icon)}
              </svg>
            </div>
            <h3 className="font-semibold mb-2" style={{ color: themeColors.text }}>
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Theme Provider Component
export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => {
  if (!theme) return children;

  const cssVariables = {
    '--color-primary': theme.colors?.primary,
    '--color-secondary': theme.colors?.secondary,
    '--color-accent': theme.colors?.accent,
    '--color-background': theme.colors?.background,
    '--color-text': theme.colors?.text,
    '--color-border': theme.colors?.border,
    '--font-heading': theme.fonts?.heading,
    '--font-body': theme.fonts?.body,
  };

  return (
    <div style={cssVariables as React.CSSProperties} className="theme-provider">
      {children}
    </div>
  );
}; 