import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/DashboardLayout';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  BookmarkSquareIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DocumentDuplicateIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useBuilderStore } from '@/stores/builderStore';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';
import {
  ProductCard,
  ProductGrid,
  HeroSection,
  CartWidget,
  CategoryCard,
  NewsletterSignup,
  FeatureHighlight,
  ThemeProvider
} from '@/components/builder/EcommerceComponents';
import type { ComponentConfig } from '@/stores/builderStore';

// Component registry with better organization
const COMPONENT_REGISTRY = {
  'hero': HeroSection,
  'product-grid': ProductGrid,
  'product-card': ProductCard,
  'cart-widget': CartWidget,
  'category-card': CategoryCard,
  'newsletter': NewsletterSignup,
  'features': FeatureHighlight
};

// Component metadata for better organization
const COMPONENT_METADATA = {
  'hero': {
    label: 'Hero Section',
    category: 'layout',
    description: 'Eye-catching banner with title and call-to-action',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    color: 'blue'
  },
  'product-grid': {
    label: 'Product Grid',
    category: 'ecommerce',
    description: 'Display products in a customizable grid layout',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    color: 'green'
  },
  'product-card': {
    label: 'Product Card',
    category: 'ecommerce',
    description: 'Individual product showcase with details',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    color: 'purple'
  },
  'category-card': {
    label: 'Category Card',
    category: 'ecommerce',
    description: 'Product category with image and description',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    color: 'indigo'
  },
  'newsletter': {
    label: 'Newsletter Signup',
    category: 'marketing',
    description: 'Email subscription form with customizable design',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: 'pink'
  },
  'features': {
    label: 'Feature Highlights',
    category: 'marketing',
    description: 'Showcase key features or benefits',
    icon: 'M5 13l4 4L19 7',
    color: 'teal'
  },
  'cart-widget': {
    label: 'Cart Widget',
    category: 'ecommerce',
    description: 'Floating shopping cart indicator',
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6',
    color: 'orange'
  }
};

// Draggable component from palette
const DraggableComponent = ({ type, metadata }: { type: string; metadata: any }) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={`p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-${metadata.color}-50 hover:border-${metadata.color}-300 transition-all duration-200 group ${isDragging ? 'opacity-50' : ''} transform hover:scale-105`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 bg-${metadata.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <svg className={`w-5 h-5 text-${metadata.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metadata.icon} />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{metadata.label}</h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{metadata.description}</p>
        </div>
      </div>
    </div>
  );
};

// Draggable component in canvas for reordering
const DraggableCanvasComponent = ({ id, index, children, onMove }: { id: string; index: number; children: React.ReactNode; onMove: (from: number, to: number) => void; }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'canvas-component',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, drop] = useDrop({
    accept: 'canvas-component',
    hover: (draggedItem: { id: string; index: number }) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      {children}
    </div>
  );
};

// Enhanced editable wrapper for components
const EditableComponent = ({ id, type, props, onUpdate, onDelete, theme, isSelected, onClick, index, onMove }: {
  id: string;
  type: string;
  props: any;
  onUpdate: (id: string, props: any) => void;
  onDelete: (id: string) => void;
  theme: any;
  isSelected: boolean;
  onClick: (id: string) => void;
  index: number;
  onMove: (from: number, to: number) => void;
}) => {
  const Component = (COMPONENT_REGISTRY as any)[type];
  const { duplicateComponent, moveComponentUp, moveComponentDown, currentPage } = useBuilderStore();

  if (!Component) return null;

  const isFirst = index === 0;
  const isLast = index === (currentPage?.components?.length || 0) - 1;

  return (
    <DraggableCanvasComponent id={id} index={index} onMove={onMove}>
      <div
        className={`relative group transition-all duration-200 ${isSelected
          ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30'
          : 'hover:ring-1 hover:ring-gray-300'
          } rounded-lg`}
        onClick={(e) => {
          e.stopPropagation();
          onClick(id);
        }}
      >
        {/* Drag handle */}
        <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium">
            <Bars3Icon className="w-3 h-3" />
            <span className="capitalize">{type.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Component controls overlay */}
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1 bg-white rounded-lg shadow-lg border p-1">
            {/* Move up */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveComponentUp(id);
              }}
              disabled={isFirst}
              className={`p-1 rounded transition-colors ${isFirst
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              title="Move up"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>

            {/* Move down */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveComponentDown(id);
              }}
              disabled={isLast}
              className={`p-1 rounded transition-colors ${isLast
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              title="Move down"
            >
              <ArrowDownIcon className="w-4 h-4" />
            </button>

            {/* Edit */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick(id);
              }}
              className={`p-1 rounded transition-colors ${isSelected
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                }`}
              title="Edit properties"
            >
              <PencilIcon className="w-4 h-4" />
            </button>

            {/* Duplicate */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateComponent(id);
              }}
              className="p-1 text-gray-600 hover:bg-green-100 hover:text-green-600 rounded transition-colors"
              title="Duplicate"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this component?')) {
                  onDelete(id);
                }
              }}
              className="p-1 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Render the component */}
        <div>
          <Component
            {...props}
            theme={theme}
          />
        </div>
      </div>
    </DraggableCanvasComponent>
  );
};

// Droppable canvas area
const DropCanvas = ({ children, onDrop }: { children: React.ReactNode; onDrop: (type: string) => void }) => {
  const [{ isOver }, drop] = useDrop<{ type: string }, void, { isOver: boolean }>({
    accept: 'component',
    drop: (item: { type: string }) => {
      onDrop(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className={`min-h-screen bg-white rounded-lg shadow-sm border-2 border-dashed ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'} p-6 transition-colors`}
    >
      {children}
    </div>
  );
};

// Property editor modal/popup
const PropertyEditorModal = ({ selectedComponent, onUpdate, onClose, isOpen }: {
  selectedComponent: ComponentConfig | undefined;
  onUpdate: (id: string, props: Partial<ComponentConfig>) => void;
  onClose: () => void;
  isOpen: boolean;
}) => {
  if (!isOpen || !selectedComponent) return null;

  const { type, props } = selectedComponent;
  const metadata = COMPONENT_METADATA[type as keyof typeof COMPONENT_METADATA];

  const handleChange = (key: string, value: any) => {
    onUpdate(selectedComponent.id, { props: { ...props, [key]: value } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-${metadata?.color}-100 rounded-lg flex items-center justify-center`}>
                <svg className={`w-4 h-4 text-${metadata?.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metadata?.icon} />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{metadata?.label} Properties</h3>
                <p className="text-sm text-gray-500">{metadata?.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Common properties based on component type */}
            {type === 'hero' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={props.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter subtitle..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={props.buttonText || ''}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter button text..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
                  <input
                    type="text"
                    value={props.secondaryButtonText || ''}
                    onChange={(e) => handleChange('secondaryButtonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter secondary button text..."
                  />
                </div>
              </>
            )}

            {type === 'product-grid' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
                  <select
                    value={props.columns || 3}
                    onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 Column</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Limit</label>
                  <input
                    type="number"
                    value={props.limit || 6}
                    onChange={(e) => handleChange('limit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="20"
                    placeholder="Number of products to show"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="useMyProducts"
                    checked={props.showFromUserProducts || false}
                    onChange={(e) => handleChange('showFromUserProducts', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="useMyProducts" className="text-sm text-gray-700">Use my products</label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="showViewAll"
                    checked={props.showViewAll !== false}
                    onChange={(e) => handleChange('showViewAll', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="showViewAll" className="text-sm text-gray-700">Show "View All" button</label>
                </div>
              </>
            )}

            {type === 'newsletter' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <textarea
                    value={props.subtitle || ''}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter subtitle..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                  <input
                    type="text"
                    value={props.buttonText || ''}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter button text..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
                  <input
                    type="text"
                    value={props.placeholder || ''}
                    onChange={(e) => handleChange('placeholder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter placeholder text..."
                  />
                </div>
              </>
            )}

            {type === 'cart-widget' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Count</label>
                <input
                  type="number"
                  value={props.itemCount || 0}
                  onChange={(e) => handleChange('itemCount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  placeholder="Number of items in cart"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this new component after the PropertyEditorModal
const SectionEditorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { storeInfo, updateStoreInfo } = useBuilderStore();
  const [formData, setFormData] = useState(storeInfo);

  useEffect(() => {
    setFormData(storeInfo);
  }, [storeInfo]);

  const handleSave = () => {
    updateStoreInfo(formData);

    // Also update localStorage directly to ensure persistence
    localStorage.setItem('storeInfo', JSON.stringify({
      ...storeInfo,
      ...formData
    }));

    // Show success feedback
    alert('Store information updated successfully! Your changes will be visible in the preview.');
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    if (field.startsWith('social.')) {
      const socialField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold">Edit Store Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Store Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Store Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Store Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Description (About Page)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell customers about your store..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@yourstore.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(e) => handleChange('social.facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/yourstore"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(e) => handleChange('social.instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/yourstore"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                <input
                  type="url"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => handleChange('social.twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://twitter.com/yourstore"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-6 border-t flex-shrink-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VisualBuilder() {
  const router = useRouter();
  const {
    currentPage,
    setCurrentPage,
    addComponent,
    updateComponent,
    removeComponent,
    selectedComponent,
    selectComponent,
    themes,
    currentTheme,
    setTheme,
    isPreview,
    togglePreview,
    savePages,
    loadPages,
    products,
    setProducts,
    reorderComponents,
    storeInfo,
    updateStoreInfo
  } = useBuilderStore();

  const { markBuildWebsiteComplete, isStepCompleted } = useSetupCompletion();

  const [isLoading, setIsLoading] = useState(true);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showSectionEditor, setShowSectionEditor] = useState(false);

  // Load user's products
  const [productsLocal, setProductsLocal] = useState([]);

  useEffect(() => {
    loadPages();

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?storeId=1');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          setProductsLocal(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
    setIsLoading(false);
  }, [loadPages, setProducts]);

  // Initialize default page if none exists
  useEffect(() => {
    if (!currentPage && !isLoading) {
      const defaultPage = {
        id: 'home',
        name: 'Home Page',
        slug: 'home',
        components: [],
        theme: currentTheme,
        meta: {
          title: 'My Store',
          description: 'Welcome to my store'
        }
      };
      setCurrentPage(defaultPage);
    }
  }, [currentPage, currentTheme, setCurrentPage, isLoading]);

  const selectedComponentData = currentPage?.components.find(c => c.id === selectedComponent);

  // Handle component selection and modal opening
  const handleComponentSelect = (id: string) => {
    selectComponent(id);
    if (id) {
      setShowPropertyModal(true);
    } else {
      setShowPropertyModal(false);
    }
  };

  const handleClosePropertyModal = () => {
    setShowPropertyModal(false);
    selectComponent(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const handleDropComponent = (componentType: string) => {
    const newComponent = {
      id: `${componentType}_${Date.now()}`,
      type: componentType,
      props: getDefaultProps(componentType),
      position: { x: 0, y: 0 },
      size: { width: 100, height: 100 }
    };
    addComponent(newComponent);
  };

  const getDefaultProps = (type: string) => {
    const defaults = {
      'hero': {
        title: 'Welcome to Your Store',
        subtitle: 'Discover amazing products at unbeatable prices',
        buttonText: 'Shop Now',
        secondaryButtonText: 'Learn More',
        backgroundImage: '/api/placeholder/1200/400'
      },
      'product-grid': {
        title: 'Featured Products',
        columns: 3,
        showViewAll: true,
        showFromUserProducts: true
      },
      'product-card': {
        showFromUserProducts: true,
        productId: 1
      },
      'cart-widget': {
        itemCount: 0,
        showBadge: true
      },
      'category-card': {
        category: {
          name: 'Electronics',
          image: '/api/placeholder/300/200',
          productCount: 150
        }
      },
      'newsletter': {
        title: 'Stay Updated',
        subtitle: 'Get the latest deals and new arrivals in your inbox.',
        placeholder: 'Enter your email address',
        buttonText: 'Subscribe'
      },
      'features': {
        features: [
          { icon: 'truck', title: 'Free Shipping', description: 'On orders over $50' },
          { icon: 'clock', title: 'Fast Delivery', description: '2-3 business days' },
          { icon: 'shield', title: 'Secure Payments', description: 'SSL encryption' }
        ]
      }
    };
    return defaults[type as keyof typeof defaults] || {};
  };

  const handleSaveProject = () => {
    savePages();
    alert('Project saved as draft successfully!');
  };

  const handleFinalizeWebsite = () => {
    // Save the project first
    savePages();

    // Mark website as complete when finalized
    if (currentPage && currentPage.components && currentPage.components.length > 0) {
      markBuildWebsiteComplete('visual-builder', 'visual-builder');

      // Also save finalization data for the main build page
      const websiteData = {
        type: 'Visual Builder',
        description: 'Custom website built with drag-and-drop editor',
        componentCount: currentPage.components.length,
        theme: currentPage.theme?.name || currentTheme.name || 'Default Theme',
        lastModified: new Date().toISOString(),
        finalizedAt: new Date().toISOString()
      };

      localStorage.setItem('finalizedWebsite', JSON.stringify(websiteData));

      alert('🎉 Website finalized successfully! You can now proceed to add products.');

      // Redirect to build page to show the finalized status
      setTimeout(() => {
        router.push('/dashboard/build');
      }, 1500);
    } else {
      alert('Please add at least one component before finalizing your website.');
    }
  };

  const handlePreview = () => {
    // Save before previewing
    savePages();
    router.push('/store-preview');
  };

  const handleMoveComponent = (fromIndex: number, toIndex: number) => {
    reorderComponents(fromIndex, toIndex);
  };

  // Group components by category
  const componentsByCategory = Object.entries(COMPONENT_METADATA).reduce((acc: Record<string, { type: string; metadata: typeof COMPONENT_METADATA[keyof typeof COMPONENT_METADATA] }[]>, [type, metadata]) => {
    if (!acc[metadata.category]) {
      acc[metadata.category] = [];
    }
    acc[metadata.category].push({ type, metadata });
    return acc;
  }, {});

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back
                </button>
                <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-900">Visual Builder</h1>
                  <p className="text-xs text-gray-500">
                    {currentPage?.components?.length || 0} components
                    {isStepCompleted('buildWebsite') && (
                      <span className="ml-2 text-green-600">• Finalized</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-2">
                {/* Theme Selector - Hidden on mobile */}
                <select
                  value={currentTheme.id}
                  onChange={(e) => {
                    const theme = themes.find(t => t.id === e.target.value);
                    if (theme) setTheme(theme);
                  }}
                  className="hidden md:block px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                >
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>

                {/* Preview Toggle */}
                <button
                  onClick={togglePreview}
                  className={`px-2 py-1 rounded text-xs transition-colors ${isPreview
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </button>

                {/* Save Draft */}
                <button
                  onClick={handleSaveProject}
                  className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-xs transition-colors"
                >
                  Save
                </button>

                {/* Finalize/Status */}
                {!isStepCompleted('buildWebsite') ? (
                  <button
                    onClick={handleFinalizeWebsite}
                    disabled={!currentPage || !currentPage.components || currentPage.components.length === 0}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${currentPage && currentPage.components && currentPage.components.length > 0
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    Finalize
                  </button>
                ) : (
                  <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    ✓ Done
                  </div>
                )}

                {/* Store Info Button */}
                <button
                  onClick={() => setShowSectionEditor(true)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${storeInfo.name || storeInfo.description || storeInfo.email
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Info
                  {(storeInfo.name || storeInfo.description || storeInfo.email) && (
                    <span className="ml-1 w-1 h-1 bg-green-500 rounded-full inline-block"></span>
                  )}
                </button>

                {/* Preview Link */}
                <button
                  onClick={handlePreview}
                  className="px-2 py-1 text-gray-600 hover:text-gray-900 rounded text-xs transition-colors"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Builder Interface */}
          <div className="flex-1 bg-gray-50 flex">
            {/* Component Palette - Left Sidebar */}
            {!isPreview && (
              <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Component Library</h3>
                  <p className="text-xs text-gray-500 mt-1">Drag components to build your store</p>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Layout Components */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Layout Components
                      </h4>
                      <div className="space-y-2">
                        {componentsByCategory.layout?.map(({ type, metadata }: { type: string; metadata: typeof COMPONENT_METADATA[keyof typeof COMPONENT_METADATA] }) => (
                          <DraggableComponent
                            key={type}
                            type={type}
                            metadata={metadata}
                          />
                        ))}
                      </div>
                    </div>

                    {/* E-commerce Components */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        E-commerce Components
                      </h4>
                      <div className="space-y-2">
                        {componentsByCategory.ecommerce?.map(({ type, metadata }: { type: string; metadata: typeof COMPONENT_METADATA[keyof typeof COMPONENT_METADATA] }) => (
                          <DraggableComponent
                            key={type}
                            type={type}
                            metadata={metadata}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Marketing Components */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        Marketing Components
                      </h4>
                      <div className="space-y-2">
                        {componentsByCategory.marketing?.map(({ type, metadata }: { type: string; metadata: typeof COMPONENT_METADATA[keyof typeof COMPONENT_METADATA] }) => (
                          <DraggableComponent
                            key={type}
                            type={type}
                            metadata={metadata}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Builder Area */}
            <div className="flex-1 p-6">
              <ThemeProvider theme={currentTheme}>
                {isPreview ? (
                  // Preview mode - just render components
                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="space-y-8">
                      {currentPage?.components?.map((component) => {
                        const Component = (COMPONENT_REGISTRY as any)[component.type];
                        return Component ? (
                          <Component
                            key={component.id}
                            {...component.props}
                            theme={currentTheme}
                          />
                        ) : null;
                      })}
                      <CartWidget itemCount={3} theme={currentTheme} />
                    </div>
                  </div>
                ) : (
                  // Edit mode - draggable components
                  <DropCanvas onDrop={handleDropComponent}>
                    <div
                      className="space-y-6 min-h-96"
                      onClick={() => selectComponent(null)}
                    >
                      {!currentPage || currentPage.components.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-2">Start Building Your Store</h3>
                            <p className="text-sm">Drag components from the left panel to get started.</p>
                            <p className="text-xs text-gray-400 mt-2">Click the ✏️ edit button on any component to open its properties panel.</p>
                          </div>
                        </div>
                      ) : (
                        currentPage.components.map((component, index) => (
                          <EditableComponent
                            key={component.id}
                            id={component.id}
                            type={component.type}
                            props={component.props}
                            onUpdate={updateComponent}
                            onDelete={removeComponent}
                            theme={currentTheme}
                            isSelected={selectedComponent === component.id}
                            onClick={handleComponentSelect}
                            index={index}
                            onMove={handleMoveComponent}
                          />
                        ))
                      )}
                    </div>
                  </DropCanvas>
                )}
              </ThemeProvider>
            </div>
          </div>

          {/* Property Editor Modal */}
          <PropertyEditorModal
            selectedComponent={selectedComponentData}
            onUpdate={updateComponent}
            onClose={handleClosePropertyModal}
            isOpen={showPropertyModal}
          />

          <SectionEditorModal
            isOpen={showSectionEditor}
            onClose={() => setShowSectionEditor(false)}
          />
        </div>
      </DndProvider>
    </DashboardLayout>
  );
} 