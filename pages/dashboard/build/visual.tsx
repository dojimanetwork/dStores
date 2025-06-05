import React, { useState, useRef, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  ArrowLeftIcon, 
  EyeIcon, 
  Cog6ToothIcon, 
  ShareIcon,
  PlusIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

// Component Types for Web3 Commerce
const COMPONENT_TYPES = {
  HERO: 'hero',
  PRODUCT_GRID: 'product-grid',
  PRODUCT_CARD: 'product-card',
  HEADER: 'header',
  FOOTER: 'footer',
  BUTTON: 'button',
  TEXT: 'text',
  IMAGE: 'image',
  CONTAINER: 'container',
  CART_WIDGET: 'cart-widget',
  WALLET_CONNECT: 'wallet-connect',
  CRYPTO_PAYMENT: 'crypto-payment',
  NFT_SHOWCASE: 'nft-showcase',
  TOKEN_GATING: 'token-gating',
  DAO_GOVERNANCE: 'dao-governance',
  DEFI_STAKING: 'defi-staking'
};

// Device Breakpoints
const DEVICES = {
  DESKTOP: { name: 'Desktop', width: 1200, icon: ComputerDesktopIcon },
  TABLET: { name: 'Tablet', width: 768, icon: DeviceTabletIcon },
  MOBILE: { name: 'Mobile', width: 375, icon: DevicePhoneMobileIcon }
};

interface ComponentData {
  id: string;
  type: string;
  name: string;
  props: Record<string, any>;
  children: ComponentData[];
  styles: Record<string, any>;
  position: { x: number; y: number };
}

interface DropResult {
  id: string;
  type: string;
}

// Draggable Component from Palette
function DraggableComponent({ type, name, icon }: { type: string; name: string; icon: string }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
    </div>
  );
}

// Droppable Canvas Area
function DropCanvas({ children, onDrop }: { children: React.ReactNode; onDrop: (item: any) => void }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-full bg-white border-2 border-dashed rounded-lg transition-all duration-200 ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {children}
    </div>
  );
}

// Rendered Component in Canvas
function RenderedComponent({ component, isSelected, onSelect, onUpdate }: {
  component: ComponentData;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ComponentData>) => void;
}) {
  const renderComponentContent = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HERO:
        return (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-16 text-center">
            <h1 className="text-5xl font-bold mb-4">{component.props.title || 'Your Web3 Store'}</h1>
            <p className="text-xl mb-8">{component.props.subtitle || 'Build the future of commerce'}</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">
              {component.props.buttonText || 'Get Started'}
            </button>
          </div>
        );

      case COMPONENT_TYPES.PRODUCT_GRID:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product {i}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Product Name</h3>
                  <p className="text-gray-600 text-sm mb-2">Short description</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">0.1 ETH</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case COMPONENT_TYPES.HEADER:
        return (
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                <span className="text-xl font-bold">{component.props.brandName || 'Web3Store'}</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
                <a href="#" className="text-gray-700 hover:text-blue-600">Products</a>
                <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
              </nav>
              <div className="flex items-center space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Connect Wallet</button>
                <div className="relative">
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">3</span>
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </header>
        );

      case COMPONENT_TYPES.WALLET_CONNECT:
        return (
          <div className="bg-white border rounded-lg p-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">Connect your crypto wallet to start shopping</p>
            <div className="space-y-2">
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium">MetaMask</button>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">WalletConnect</button>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium">Coinbase</button>
            </div>
          </div>
        );

      case COMPONENT_TYPES.NFT_SHOWCASE:
        return (
          <div className="bg-black text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">Exclusive NFT Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold">NFT #{i}</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Crypto Punk #{i}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400">2.5 ETH</span>
                      <button className="bg-purple-600 px-3 py-1 rounded text-sm">Mint</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case COMPONENT_TYPES.DEFI_STAKING:
        return (
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">DeFi Staking Pool</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">ETH Pool</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>APY:</span>
                    <span className="text-green-300 font-bold">12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVL:</span>
                    <span>$2.4M</span>
                  </div>
                  <button className="w-full bg-green-500 py-2 rounded mt-4">Stake Now</button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">USDC Pool</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>APY:</span>
                    <span className="text-green-300 font-bold">8.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVL:</span>
                    <span>$1.8M</span>
                  </div>
                  <button className="w-full bg-blue-500 py-2 rounded mt-4">Stake Now</button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Your Stakes</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Staked:</span>
                    <span>5.2 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rewards:</span>
                    <span className="text-green-300">0.15 ETH</span>
                  </div>
                  <button className="w-full bg-purple-500 py-2 rounded mt-4">Claim</button>
                </div>
              </div>
            </div>
          </div>
        );

      case COMPONENT_TYPES.BUTTON:
        return (
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              component.props.variant === 'secondary' 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            style={component.styles}
          >
            {component.props.text || 'Button'}
          </button>
        );

      case COMPONENT_TYPES.TEXT:
        return (
          <div className={component.props.tag || 'p'} style={component.styles}>
            {component.props.content || 'Add your text here...'}
          </div>
        );

      case COMPONENT_TYPES.CONTAINER:
        return (
          <div 
            className="min-h-24 border-2 border-dashed border-gray-300 rounded-lg p-4"
            style={component.styles}
          >
            <span className="text-gray-500 text-sm">Container - Drop components here</span>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 border rounded">
            <span className="text-gray-600">Unknown component: {component.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderComponentContent()}
      
      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded pointer-events-none">
          <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            {component.name}
          </div>
        </div>
      )}

      {/* Hover Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <button 
            className="p-1 bg-white border rounded shadow-sm hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              // Duplicate component
            }}
          >
            <DocumentDuplicateIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button 
            className="p-1 bg-white border rounded shadow-sm hover:bg-red-50 text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              // Delete component
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VisualBuilder() {
  const router = useRouter();
  const [selectedDevice, setSelectedDevice] = useState('DESKTOP');
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Component Palette for Web3 Commerce
  const componentPalette = [
    // Layout Components
    { type: COMPONENT_TYPES.HEADER, name: 'Header', icon: '🧭', category: 'Layout' },
    { type: COMPONENT_TYPES.FOOTER, name: 'Footer', icon: '📄', category: 'Layout' },
    { type: COMPONENT_TYPES.CONTAINER, name: 'Container', icon: '📦', category: 'Layout' },
    
    // Content Components  
    { type: COMPONENT_TYPES.HERO, name: 'Hero Section', icon: '🎯', category: 'Content' },
    { type: COMPONENT_TYPES.TEXT, name: 'Text', icon: '📝', category: 'Content' },
    { type: COMPONENT_TYPES.IMAGE, name: 'Image', icon: '🖼️', category: 'Content' },
    { type: COMPONENT_TYPES.BUTTON, name: 'Button', icon: '🔘', category: 'Content' },
    
    // E-commerce Components
    { type: COMPONENT_TYPES.PRODUCT_GRID, name: 'Product Grid', icon: '🛍️', category: 'E-commerce' },
    { type: COMPONENT_TYPES.PRODUCT_CARD, name: 'Product Card', icon: '🏷️', category: 'E-commerce' },
    { type: COMPONENT_TYPES.CART_WIDGET, name: 'Cart Widget', icon: '🛒', category: 'E-commerce' },
    
    // Web3 Components
    { type: COMPONENT_TYPES.WALLET_CONNECT, name: 'Wallet Connect', icon: '👛', category: 'Web3' },
    { type: COMPONENT_TYPES.CRYPTO_PAYMENT, name: 'Crypto Payment', icon: '💳', category: 'Web3' },
    { type: COMPONENT_TYPES.NFT_SHOWCASE, name: 'NFT Showcase', icon: '🎨', category: 'Web3' },
    { type: COMPONENT_TYPES.TOKEN_GATING, name: 'Token Gating', icon: '🔐', category: 'Web3' },
    { type: COMPONENT_TYPES.DAO_GOVERNANCE, name: 'DAO Governance', icon: '🗳️', category: 'Web3' },
    { type: COMPONENT_TYPES.DEFI_STAKING, name: 'DeFi Staking', icon: '💰', category: 'Web3' },
  ];

  const groupedComponents = componentPalette.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, typeof componentPalette>);

  // Handle component drop
  const handleComponentDrop = useCallback((item: any) => {
    const newComponent: ComponentData = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      name: item.name,
      props: {},
      children: [],
      styles: {},
      position: { x: 0, y: 0 }
    };

    setComponents(prev => [...prev, newComponent]);
  }, []);

  // Handle component selection
  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  return (
    <DndProvider backend={HTML5Backend}>
      <DashboardLayout>
        <div className="h-full flex flex-col bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-white border-b">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-semibold">Web3 Visual Builder</h1>
                <p className="text-sm text-gray-500">Drag & drop Web3 commerce components</p>
              </div>
            </div>

            {/* Device Selection */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              {Object.entries(DEVICES).map(([key, device]) => {
                const Icon = device.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDevice(key)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      selectedDevice === key 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{device.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>

              <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                <ShareIcon className="h-4 w-4 mr-2" />
                Publish
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {!previewMode && (
              <>
                {/* Left Sidebar - Component Palette */}
                <div className="w-64 bg-white border-r flex flex-col">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900 mb-4">Components</h3>
                    <div className="space-y-4">
                      {Object.entries(groupedComponents).map(([category, components]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">{category}</h4>
                          <div className="space-y-2">
                            {components.map((component) => (
                              <DraggableComponent
                                key={component.type}
                                type={component.type}
                                name={component.name}
                                icon={component.icon}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Properties Panel */}
                <div className="w-64 bg-white border-l">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
                    {selectedComponentData ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Component Name
                          </label>
                          <input 
                            type="text" 
                            value={selectedComponentData.name}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            onChange={(e) => {
                              // Update component name
                            }}
                          />
                        </div>

                        {/* Dynamic properties based on component type */}
                        {selectedComponentData.type === COMPONENT_TYPES.HERO && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                placeholder="Hero title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                              <textarea 
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                rows={3}
                                placeholder="Hero subtitle"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                placeholder="Call to action"
                              />
                            </div>
                          </>
                        )}

                        {selectedComponentData.type === COMPONENT_TYPES.BUTTON && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                placeholder="Button text"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
                              <select className="w-full px-3 py-2 border rounded-md text-sm">
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="outline">Outline</option>
                              </select>
                            </div>
                          </>
                        )}

                        {/* Style Properties */}
                        <div className="pt-4 border-t">
                          <h4 className="font-medium text-gray-900 mb-3">Styling</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                              <div className="flex space-x-2">
                                <input 
                                  type="color" 
                                  className="w-10 h-10 border rounded cursor-pointer"
                                />
                                <input 
                                  type="text" 
                                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                placeholder="16px"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                placeholder="8px"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Cog6ToothIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Select a component to edit its properties</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col">
              {/* Canvas Toolbar */}
              {!previewMode && (
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-600">
                      Canvas: {DEVICES[selectedDevice as keyof typeof DEVICES]?.width}px wide
                    </div>
                  </div>
                </div>
              )}

              {/* Canvas Area */}
              <div className="flex-1 p-8 bg-gray-100 overflow-auto">
                <div 
                  className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
                  style={{ 
                    width: previewMode ? '100%' : `${DEVICES[selectedDevice as keyof typeof DEVICES]?.width}px`,
                    minHeight: '600px'
                  }}
                >
                  {!previewMode ? (
                    <DropCanvas onDrop={handleComponentDrop}>
                      {components.length > 0 ? (
                        <div className="space-y-4 p-4">
                          {components.map((component) => (
                            <RenderedComponent
                              key={component.id}
                              component={component}
                              isSelected={selectedComponent === component.id}
                              onSelect={() => handleComponentSelect(component.id)}
                              onUpdate={(updates) => {
                                // Update component
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="h-96 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <PlusIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your Web3 store</h3>
                            <p className="text-gray-500 mb-4">Drag components from the left panel to begin</p>
                            <button 
                              className="text-blue-600 hover:text-blue-800 font-medium"
                              onClick={() => {
                                // Add default hero component
                                handleComponentDrop({ type: COMPONENT_TYPES.HERO, name: 'Hero Section' });
                              }}
                            >
                              Add Hero Section
                            </button>
                          </div>
                        </div>
                      )}
                    </DropCanvas>
                  ) : (
                    // Preview Mode
                    <div>
                      {components.map((component) => (
                        <RenderedComponent
                          key={component.id}
                          component={component}
                          isSelected={false}
                          onSelect={() => {}}
                          onUpdate={() => {}}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </DndProvider>
  );
} 