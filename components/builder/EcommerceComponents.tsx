import React from 'react';
import { Builder } from '@builder.io/react';

// Product Card Component
export const ProductCard = ({ 
  product = { 
    name: 'Sample Product', 
    price: '$99', 
    image: '/api/placeholder/300/200',
    originalPrice: null,
    rating: 4.5,
    reviews: 127
  } 
}) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div className="relative">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover rounded-md mb-3" 
      />
      {product.originalPrice && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Sale
        </div>
      )}
    </div>
    
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
      
      {/* Rating */}
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-xs text-gray-500">({product.reviews})</span>
      </div>
      
      {/* Price */}
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold text-blue-600">{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
        )}
      </div>
      
      <button className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
        Add to Cart
      </button>
    </div>
  </div>
);

// Product Grid Component
export const ProductGrid = ({ 
  title = 'Featured Products', 
  columns = 3,
  showViewAll = true
}) => (
  <div className="py-8">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {showViewAll && (
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          View All →
        </button>
      )}
    </div>
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 4)} gap-6`}>
      {[1, 2, 3, 4, 5, 6].slice(0, columns * 2).map((i) => (
        <ProductCard 
          key={i}
          product={{
            name: `Product ${i}`,
            price: `$${49 + (i * 10)}`,
            image: `/api/placeholder/300/200?text=Product+${i}`,
            rating: 4 + (i % 2 * 0.5),
            reviews: 50 + (i * 23),
            originalPrice: i % 3 === 0 ? `$${79 + (i * 10)}` : null
          }}
        />
      ))}
    </div>
  </div>
);

// Hero Section Component
export const HeroSection = ({ 
  title = 'Welcome to Your Store', 
  subtitle = 'Discover amazing products at unbeatable prices', 
  buttonText = 'Shop Now',
  secondaryButtonText = 'Learn More',
  backgroundImage = '/api/placeholder/1200/400',
  overlay = true,
  alignment = 'center'
}) => (
  <div 
    className="relative h-96 bg-cover bg-center rounded-lg flex items-center justify-center text-white overflow-hidden"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    {overlay && <div className="absolute inset-0 bg-black bg-opacity-40"></div>}
    <div className={`relative z-10 text-${alignment} max-w-2xl px-6`}>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
      <p className="text-xl mb-8 opacity-90">{subtitle}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors">
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

// Cart Widget Component
export const CartWidget = ({ itemCount = 0, showBadge = true }) => (
  <div className="fixed top-4 right-4 bg-white rounded-full p-3 shadow-lg border cursor-pointer hover:shadow-xl transition-shadow z-50">
    <div className="relative">
      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// Category Card Component
export const CategoryCard = ({
  category = {
    name: 'Electronics',
    image: '/api/placeholder/300/200',
    productCount: 150
  }
}) => (
  <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
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

// Newsletter Signup Component
export const NewsletterSignup = ({
  title = 'Stay Updated',
  subtitle = 'Get the latest deals and new arrivals in your inbox.',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  backgroundColor = 'bg-blue-50'
}) => (
  <div className={`${backgroundColor} rounded-lg p-8 text-center`}>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6">{subtitle}</p>
    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input 
        type="email" 
        placeholder={placeholder}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
        {buttonText}
      </button>
    </div>
  </div>
);

// Feature Highlight Component
export const FeatureHighlight = ({
  features = [
    { icon: 'truck', title: 'Free Shipping', description: 'On orders over $50' },
    { icon: 'clock', title: 'Fast Delivery', description: '2-3 business days' },
    { icon: 'shield', title: 'Secure Payments', description: 'SSL encryption' }
  ]
}) => {
  const getIcon = (iconName) => {
    const icons = {
      truck: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    <div className="bg-white py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {getIcon(feature.icon)}
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Register all components with Builder.io
export const registerBuilderComponents = () => {
  // Product Card
  Builder.registerComponent(ProductCard, {
    name: 'ProductCard',
    inputs: [
      {
        name: 'product',
        type: 'object',
        subFields: [
          { name: 'name', type: 'string', defaultValue: 'Sample Product' },
          { name: 'price', type: 'string', defaultValue: '$99' },
          { name: 'originalPrice', type: 'string' },
          { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg'], defaultValue: '/api/placeholder/300/200' },
          { name: 'rating', type: 'number', defaultValue: 4.5, min: 0, max: 5, step: 0.1 },
          { name: 'reviews', type: 'number', defaultValue: 127 }
        ]
      }
    ]
  });

  // Product Grid
  Builder.registerComponent(ProductGrid, {
    name: 'ProductGrid',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Featured Products' },
      { name: 'columns', type: 'number', defaultValue: 3, min: 1, max: 4 },
      { name: 'showViewAll', type: 'boolean', defaultValue: true }
    ]
  });

  // Hero Section
  Builder.registerComponent(HeroSection, {
    name: 'HeroSection',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Welcome to Your Store' },
      { name: 'subtitle', type: 'string', defaultValue: 'Discover amazing products at unbeatable prices' },
      { name: 'buttonText', type: 'string', defaultValue: 'Shop Now' },
      { name: 'secondaryButtonText', type: 'string' },
      { name: 'backgroundImage', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png'], defaultValue: '/api/placeholder/1200/400' },
      { name: 'overlay', type: 'boolean', defaultValue: true },
      { 
        name: 'alignment', 
        type: 'string', 
        enum: ['left', 'center', 'right'], 
        defaultValue: 'center' 
      }
    ]
  });

  // Cart Widget
  Builder.registerComponent(CartWidget, {
    name: 'CartWidget',
    inputs: [
      { name: 'itemCount', type: 'number', defaultValue: 0 },
      { name: 'showBadge', type: 'boolean', defaultValue: true }
    ]
  });

  // Category Card
  Builder.registerComponent(CategoryCard, {
    name: 'CategoryCard',
    inputs: [
      {
        name: 'category',
        type: 'object',
        subFields: [
          { name: 'name', type: 'string', defaultValue: 'Electronics' },
          { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png'], defaultValue: '/api/placeholder/300/200' },
          { name: 'productCount', type: 'number', defaultValue: 150 }
        ]
      }
    ]
  });

  // Newsletter Signup
  Builder.registerComponent(NewsletterSignup, {
    name: 'NewsletterSignup',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Stay Updated' },
      { name: 'subtitle', type: 'string', defaultValue: 'Get the latest deals and new arrivals in your inbox.' },
      { name: 'placeholder', type: 'string', defaultValue: 'Enter your email address' },
      { name: 'buttonText', type: 'string', defaultValue: 'Subscribe' },
      { name: 'backgroundColor', type: 'string', defaultValue: 'bg-blue-50' }
    ]
  });

  // Feature Highlight
  Builder.registerComponent(FeatureHighlight, {
    name: 'FeatureHighlight',
    inputs: [
      {
        name: 'features',
        type: 'list',
        subFields: [
          { name: 'icon', type: 'string', enum: ['truck', 'clock', 'shield'], defaultValue: 'truck' },
          { name: 'title', type: 'string', defaultValue: 'Free Shipping' },
          { name: 'description', type: 'string', defaultValue: 'On orders over $50' }
        ],
        defaultValue: [
          { icon: 'truck', title: 'Free Shipping', description: 'On orders over $50' },
          { icon: 'clock', title: 'Fast Delivery', description: '2-3 business days' },
          { icon: 'shield', title: 'Secure Payments', description: 'SSL encryption' }
        ]
      }
    ]
  });
}; 