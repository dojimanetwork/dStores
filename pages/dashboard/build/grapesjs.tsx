import React, { useEffect, useState } from 'react';
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
const DraggableComponent = ({ type, metadata }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div 
      ref={drag}
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
const DraggableCanvasComponent = ({ id, index, children, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'canvas-component',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'canvas-component',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onMove(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      {children}
    </div>
  );
};

// Enhanced editable wrapper for components
const EditableComponent = ({ id, type, props, onUpdate, onDelete, theme, isSelected, onClick, index, onMove }) => {
  const Component = COMPONENT_REGISTRY[type];
  const { duplicateComponent, moveComponentUp, moveComponentDown, currentPage } = useBuilderStore();
  
  if (!Component) return null;

  const isFirst = index === 0;
  const isLast = index === (currentPage?.components?.length || 0) - 1;

  return (
    <DraggableCanvasComponent id={id} index={index} onMove={onMove}>
      <div 
        className={`relative group transition-all duration-200 ${
          isSelected 
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
              className={`p-1 rounded transition-colors ${
                isFirst 
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
              className={`p-1 rounded transition-colors ${
                isLast 
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
              className={`p-1 rounded transition-colors ${
                isSelected 
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
const DropCanvas = ({ children, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item) => {
      onDrop(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      className={`min-h-screen bg-white rounded-lg shadow-sm border-2 border-dashed ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'} p-6 transition-colors`}
    >
      {children}
    </div>
  );
};

// Property editor modal/popup
const PropertyEditorModal = ({ selectedComponent, onUpdate, onClose, isOpen }) => {
  if (!isOpen || !selectedComponent) return null;

  const { type, props } = selectedComponent;
  const metadata = COMPONENT_METADATA[type];

  const handleChange = (key, value) => {
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
                    rows="3"
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
                    rows="2"
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
    reorderComponents
  } = useBuilderStore();

  const [isLoading, setIsLoading] = useState(true);

  // Load user's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?storeId=1');
        if (response.ok) {
          const data = await response.json();
          // Ensure data is an array before setting
          setProducts(Array.isArray(data) ? data : []);
        } else {
          console.warn('Failed to fetch products, using empty array');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    fetchProducts();
    loadPages();
    setIsLoading(false);
  }, []);

  // Initialize default page if none exists
  useEffect(() => {
    if (!isLoading && !currentPage) {
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
  }, [currentPage, isLoading, currentTheme, setCurrentPage]);

  const handleDropComponent = (componentType) => {
    const newComponent = {
      id: `${componentType}_${Date.now()}`,
      type: componentType,
      props: getDefaultProps(componentType),
      position: { x: 0, y: 0 },
      size: { width: 100, height: 'auto' }
    };
    addComponent(newComponent);
  };

  const getDefaultProps = (type) => {
    const defaults = {
      'hero': {
        title: 'Welcome to Your Store',
        subtitle: 'Discover amazing products at unbeatable prices',
        buttonText: 'Shop Now'
      },
      'product-grid': {
        title: 'Featured Products',
        columns: 3,
        showFromUserProducts: true,
        limit: 6
      },
      'product-card': {
        showFromUserProducts: true
      },
      'newsletter': {
        title: 'Stay Updated',
        subtitle: 'Get the latest deals and new arrivals in your inbox.',
        buttonText: 'Subscribe'
      },
      'features': {},
      'cart-widget': { itemCount: 2 },
      'category-card': {}
    };
    return defaults[type] || {};
  };

  const handleSaveProject = () => {
    savePages();
    alert('Project saved successfully!');
  };

  const handlePreview = () => {
    savePages();
    const previewUrl = `/store-preview?page=${currentPage?.id || 'home'}`;
    window.open(previewUrl, '_blank');
  };

  const handleMoveComponent = (fromIndex, toIndex) => {
    reorderComponents(fromIndex, toIndex);
  };

  // Group components by category
  const componentsByCategory = Object.entries(COMPONENT_METADATA).reduce((acc, [type, metadata]) => {
    if (!acc[metadata.category]) {
      acc[metadata.category] = [];
    }
    acc[metadata.category].push({ type, metadata });
    return acc;
  }, {});

  const selectedComponentData = currentPage?.components.find(c => c.id === selectedComponent);

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
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Store Builder</h1>
                <p className="text-sm text-gray-500">
                  {currentPage?.components?.length || 0} components • Drag, edit, and rearrange to build your store
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Theme selector */}
              <select 
                value={currentTheme.id} 
                onChange={(e) => {
                  const theme = themes.find(t => t.id === e.target.value);
                  if (theme) setTheme(theme);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </select>

              <button
                onClick={togglePreview}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isPreview 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <EyeIcon className="w-4 h-4" />
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={handleSaveProject}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <BookmarkSquareIcon className="w-4 h-4" />
                Save
              </button>
              
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                Open Preview
              </button>
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
                        {componentsByCategory.layout?.map(({ type, metadata }) => (
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
                        {componentsByCategory.ecommerce?.map(({ type, metadata }) => (
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
                        {componentsByCategory.marketing?.map(({ type, metadata }) => (
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
                        const Component = COMPONENT_REGISTRY[component.type];
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
                            theme={currentTheme}
                            isSelected={selectedComponent === component.id}
                            onClick={selectComponent}
                            onUpdate={updateComponent}
                            onDelete={removeComponent}
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
            onClose={() => selectComponent(null)}
            isOpen={selectedComponent !== null}
          />
        </div>
      </DndProvider>
    </DashboardLayout>
  );
} 