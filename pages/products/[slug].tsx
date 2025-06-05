import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  images: string[];
  stock: number;
  inStock: boolean;
  category: string;
  slug: string;
}

interface ProductDetailProps {
  product?: Product;
  error?: string;
}

export default function ProductDetail({ product, error }: ProductDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    setLoading(true);
    // Add to cart logic here
    console.log('Adding to cart:', { product, quantity });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(`Added ${quantity} x ${product?.name} to cart!`);
    }, 1000);
  };

  const handleBuyNow = () => {
    // Direct checkout logic
    console.log('Buy now:', { product, quantity });
    router.push('/checkout');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Store</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Product Details</h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-500 mb-4">SKU: {product.slug}</p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">{product.formattedPrice}</span>
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
                {product.inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Category */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
            </div>

            {/* Add to Cart Section */}
            {product.inStock && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {!product.inStock && (
              <div className="space-y-4">
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                >
                  Out of Stock
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Notify When Available
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;

  try {
    // Try to fetch the product from the API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/products?storeId=1`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    const product = data.products?.find((p: Product) => p.slug === slug);

    if (!product) {
      return {
        props: {
          error: 'Product not found'
        }
      };
    }

    return {
      props: {
        product
      }
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        error: 'Failed to load product'
      }
    };
  }
}; 