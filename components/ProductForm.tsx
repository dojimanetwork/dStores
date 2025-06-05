import React, { useState, useRef } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { PhotoIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Dummy image collection for easy selection
const DUMMY_IMAGES = {
  electronics: [
    { id: 1, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', name: 'Wireless Headphones' },
    { id: 2, url: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop', name: 'Smart Watch' },
    { id: 3, url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop', name: 'Bluetooth Speaker' },
    { id: 4, url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop', name: 'Smartphone' },
    { id: 5, url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=500&fit=crop', name: 'Laptop' },
    { id: 6, url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop', name: 'Gaming Setup' }
  ],
  fashion: [
    { id: 7, url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', name: 'Casual T-Shirt' },
    { id: 8, url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=500&fit=crop', name: 'Denim Jacket' },
    { id: 9, url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop', name: 'Sneakers' },
    { id: 10, url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop', name: 'Summer Dress' },
    { id: 11, url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop', name: 'Luxury Handbag' },
    { id: 12, url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', name: 'Sunglasses' }
  ],
  skincare: [
    { id: 13, url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop', name: 'Vitamin C Serum' },
    { id: 14, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop', name: 'Face Mist' },
    { id: 15, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', name: 'Night Cream' },
    { id: 16, url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop', name: 'Cleanser' },
    { id: 17, url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&h=500&fit=crop', name: 'Face Mask' },
    { id: 18, url: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=500&h=500&fit=crop', name: 'Moisturizer' }
  ],
  home: [
    { id: 19, url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500&h=500&fit=crop', name: 'Ceramic Vase' },
    { id: 20, url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop', name: 'Throw Blanket' },
    { id: 21, url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop', name: 'Wall Art' },
    { id: 22, url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&h=500&fit=crop', name: 'Candle' },
    { id: 23, url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop', name: 'Plant Pot' },
    { id: 24, url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop', name: 'Cushion' }
  ]
};

export const ProductForm = () => {
  const { addProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    images: [] as string[],
    stock: '0',
    category: 'electronics'
  });
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload' | 'dummy'>('dummy');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDummyPicker, setShowDummyPicker] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (formData.images.length === 0 && !formData.image) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        images: formData.images.length > 0 ? formData.images : [formData.image],
        sku: `SKU-${Date.now()}`,
        stock_quantity: parseInt(formData.stock) || 0,
        status: 'active',
        metadata: {
          category: formData.category || 'General'
        }
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Product created:', result);
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          description: '',
          image: '',
          images: [],
          stock: '0',
          category: 'electronics'
        });
        setErrors({});
        
        alert('✅ Product created successfully! Your product is now available in your store.');
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('❌ Failed to create product. Please try again.');
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // Create object URL for immediate preview
        const objectUrl = URL.createObjectURL(file);
        uploadedImages.push(objectUrl);
        
        // In production, you'd upload to your storage service (AWS S3, Cloudinary, etc.)
        // For now, we'll use the object URL
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
        image: prev.image || uploadedImages[0] || ''
      }));

      // Clear any image-related errors
      if (errors.images) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDummyImageSelect = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl],
      image: prev.image || imageUrl
    }));

    // Clear any image-related errors
    if (errors.images) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      image: prev.images.filter((_, i) => i !== index)[0] || ''
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Product</h2>
        <p className="text-gray-600">Create a new product for your store. All fields marked with * are required.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Price, Stock, and Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price * ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={e => handleInputChange('price', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={e => handleInputChange('stock', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={e => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="skincare">Skincare</option>
              <option value="home">Home & Decor</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={e => handleInputChange('description', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your product..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Images Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Product Images * (At least 1 image required)
          </label>
          
          {/* Image Upload Mode Selector */}
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setImageUploadMode('dummy')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                imageUploadMode === 'dummy'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Quick Select
            </button>
            <button
              type="button"
              onClick={() => setImageUploadMode('upload')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                imageUploadMode === 'upload'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📁 Upload Files
            </button>
            <button
              type="button"
              onClick={() => setImageUploadMode('url')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                imageUploadMode === 'url'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔗 Image URL
            </button>
          </div>

          {/* Quick Select Dummy Images */}
          {imageUploadMode === 'dummy' && (
            <div className="mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-h-60 overflow-y-auto p-3 border border-gray-200 rounded-lg">
                {DUMMY_IMAGES[formData.category as keyof typeof DUMMY_IMAGES].map((image) => (
                  <div
                    key={image.id}
                    onClick={() => handleDummyImageSelect(image.url)}
                    className="relative group cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-20 object-cover rounded-lg border border-gray-200 group-hover:border-blue-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium">Select</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Click any image to add it to your product</p>
            </div>
          )}

          {/* File Upload */}
          {imageUploadMode === 'upload' && (
            <div className="mb-4">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
              </div>
            </div>
          )}

          {/* URL Input */}
          {imageUploadMode === 'url' && (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={e => handleInputChange('image', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.image && !formData.images.includes(formData.image)) {
                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, prev.image]
                      }));
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Selected Images Preview */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
          >
            {uploading ? 'Processing...' : '🚀 Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}; 