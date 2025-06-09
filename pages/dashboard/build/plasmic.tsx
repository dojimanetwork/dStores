import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
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
  DeviceTabletIcon,
  PlayIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import React from 'react';

// Web3 Commerce Component Types
const COMPONENT_TYPES = {
  HERO: 'hero',
  PRODUCT_GRID: 'product-grid',
  HEADER: 'header',
  FOOTER: 'footer',
  BUTTON: 'button',
  TEXT: 'text',
  IMAGE: 'image',
  CONTAINER: 'container',
  WALLET_CONNECT: 'wallet-connect',
  NFT_SHOWCASE: 'nft-showcase',
  DEFI_STAKING: 'defi-staking',
  CRYPTO_PAYMENT: 'crypto-payment',
  TOKEN_GATING: 'token-gating'
};

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
  styles: Record<string, any>;
}

// Draggable Component
function DraggableComponent({ type, name, icon, description }: {
  type: string;
  name: string;
  icon: string;
  description: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { type, name },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  React.useEffect(() => {
    drag(ref);
  }, [drag]);

  return (
    <div
      ref={ref}
      className={`p-3 bg-white border rounded-lg cursor-grab hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 ${isDragging ? 'opacity-50 cursor-grabbing' : ''
        }`}
    >
      <div className="flex items-start space-x-3">
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{name}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
    </div>
  );
}

// Drop Canvas
function DropCanvas({ children, onDrop }: { children: React.ReactNode; onDrop: (item: any) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  React.useEffect(() => {
    drop(ref);
  }, [drop]);

  return (
    <div
      ref={ref}
      className={`min-h-full transition-all duration-200 ${isOver ? 'bg-purple-50 ring-2 ring-purple-300' : ''
        }`}
    >
      {children}
    </div>
  );
}

// Rendered Component
function RenderedComponent({ component, isSelected, onSelect }: {
  component: ComponentData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const renderContent = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HERO:
        return (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-16 text-center">
            <h1 className="text-5xl font-bold mb-4">{component.props.title || 'Welcome to Web3'}</h1>
            <p className="text-xl mb-8">{component.props.subtitle || 'Build the future of commerce'}</p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold">
              {component.props.buttonText || 'Get Started'}
            </button>
          </div>
        );

      case COMPONENT_TYPES.PRODUCT_GRID:
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-bold">NFT #{i}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Digital Asset {i}</h3>
                    <p className="text-gray-600 text-sm mb-2">Exclusive Web3 collectible</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-purple-600">0.{i} ETH</span>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case COMPONENT_TYPES.HEADER:
        return (
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
                <span className="text-xl font-bold">{component.props.brandName || 'Web3Store'}</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-700 hover:text-purple-600">Home</a>
                <a href="#" className="text-gray-700 hover:text-purple-600">Products</a>
                <a href="#" className="text-gray-700 hover:text-purple-600">NFTs</a>
                <a href="#" className="text-gray-700 hover:text-purple-600">DeFi</a>
              </nav>
              <div className="flex items-center space-x-4">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg">
                  Connect Wallet
                </button>
              </div>
            </div>
          </header>
        );

      case COMPONENT_TYPES.WALLET_CONNECT:
        return (
          <div className="bg-white border rounded-lg p-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">Choose your preferred Web3 wallet</p>
            <div className="space-y-2">
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600">
                MetaMask
              </button>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
                WalletConnect
              </button>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700">
                Coinbase Wallet
              </button>
            </div>
          </div>
        );

      case COMPONENT_TYPES.NFT_SHOWCASE:
        return (
          <div className="bg-black text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">Exclusive NFT Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                  <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">#{String(i).padStart(4, '0')}</span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Cosmic Punk #{i}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 font-bold">{i + 1}.5 ETH</span>
                      <button className="bg-purple-600 px-3 py-1 rounded text-sm hover:bg-purple-700">
                        Mint
                      </button>
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
            <h2 className="text-3xl font-bold mb-6 text-center">DeFi Yield Farming</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-semibold mb-4">ETH Pool</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>APY:</span>
                    <span className="text-green-300 font-bold">15.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVL:</span>
                    <span>$4.2M</span>
                  </div>
                  <button className="w-full bg-green-500 py-2 rounded mt-4 hover:bg-green-600">
                    Stake ETH
                  </button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-semibold mb-4">USDC Pool</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>APY:</span>
                    <span className="text-green-300 font-bold">9.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVL:</span>
                    <span>$2.1M</span>
                  </div>
                  <button className="w-full bg-blue-500 py-2 rounded mt-4 hover:bg-blue-600">
                    Stake USDC
                  </button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-semibold mb-4">Your Rewards</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Earned:</span>
                    <span className="text-green-300">0.25 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending:</span>
                    <span className="text-yellow-300">0.05 ETH</span>
                  </div>
                  <button className="w-full bg-purple-500 py-2 rounded mt-4 hover:bg-purple-600">
                    Claim All
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case COMPONENT_TYPES.BUTTON:
        return (
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${component.props.variant === 'secondary'
              ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
          >
            {component.props.text || 'Click Me'}
          </button>
        );

      case COMPONENT_TYPES.TEXT:
        return (
          <div className="p-4">
            <p className="text-gray-700" style={component.styles}>
              {component.props.content || 'Add your text content here...'}
            </p>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded">
            <span className="text-gray-500">Component: {component.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative group ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {renderContent()}

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-purple-500/10 border-2 border-purple-500 rounded pointer-events-none">
          <div className="absolute -top-8 left-0 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
            {component.name}
          </div>
        </div>
      )}

      {/* Hover Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <button className="p-1 bg-white border rounded shadow-sm hover:bg-gray-50">
            <DocumentDuplicateIcon className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-1 bg-white border rounded shadow-sm hover:bg-red-50 text-red-600">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlasmicBuilder() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('DESKTOP');
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [projectStarted, setProjectStarted] = useState(false);

  // Component Palette
  const componentPalette = [
    { type: COMPONENT_TYPES.HERO, name: 'Hero Section', icon: '🎯', description: 'Eye-catching banner', category: 'Layout' },
    { type: COMPONENT_TYPES.HEADER, name: 'Header', icon: '🧭', description: 'Navigation header', category: 'Layout' },
    { type: COMPONENT_TYPES.FOOTER, name: 'Footer', icon: '📄', description: 'Page footer', category: 'Layout' },
    { type: COMPONENT_TYPES.CONTAINER, name: 'Container', icon: '📦', description: 'Content wrapper', category: 'Layout' },
    { type: COMPONENT_TYPES.TEXT, name: 'Text Block', icon: '📝', description: 'Rich text content', category: 'Content' },
    { type: COMPONENT_TYPES.IMAGE, name: 'Image', icon: '🖼️', description: 'Media content', category: 'Content' },
    { type: COMPONENT_TYPES.BUTTON, name: 'Button', icon: '🔘', description: 'Call-to-action', category: 'Content' },
    { type: COMPONENT_TYPES.PRODUCT_GRID, name: 'Product Grid', icon: '🛍️', description: 'Product showcase', category: 'E-commerce' },
    { type: COMPONENT_TYPES.WALLET_CONNECT, name: 'Wallet Connect', icon: '👛', description: 'Web3 wallet integration', category: 'Web3' },
    { type: COMPONENT_TYPES.NFT_SHOWCASE, name: 'NFT Gallery', icon: '🎨', description: 'NFT collection display', category: 'Web3' },
    { type: COMPONENT_TYPES.DEFI_STAKING, name: 'DeFi Staking', icon: '💰', description: 'Yield farming interface', category: 'Web3' },
    { type: COMPONENT_TYPES.CRYPTO_PAYMENT, name: 'Crypto Payment', icon: '💳', description: 'Crypto checkout', category: 'Web3' },
    { type: COMPONENT_TYPES.TOKEN_GATING, name: 'Token Gating', icon: '🔐', description: 'Token-based access', category: 'Web3' },
  ];

  const groupedComponents = componentPalette.reduce((acc, component) => {
    if (!acc[component.category]) acc[component.category] = [];
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, typeof componentPalette>);

  const handleStartProject = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setProjectStarted(true);
    }, 1500);
  };

  const handleComponentDrop = useCallback((item: any) => {
    const newComponent: ComponentData = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      name: item.name,
      props: {},
      styles: {}
    };
    setComponents(prev => [...prev, newComponent]);
  }, []);

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  if (!projectStarted) {
    return (
      <DashboardLayout>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-semibold">Plasmic Visual Builder</h1>
                <p className="text-sm text-gray-500">Professional Web3 commerce builder</p>
              </div>
            </div>
          </div>

          {/* Project Setup */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="max-w-md w-full mx-auto text-center p-8">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Plasmic</h2>
                <p className="text-gray-600">
                  Build stunning Web3 commerce experiences with our professional visual builder.
                  No coding required.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { icon: '🎨', title: 'Visual Design System', desc: 'Drag & drop Web3 components' },
                  { icon: '📱', title: 'Responsive Design', desc: 'Mobile-first approach' },
                  { icon: '⚡', title: 'Real-time Collaboration', desc: 'Team editing features' },
                  { icon: '🔗', title: 'Web3 Integration', desc: 'Wallet, NFTs, DeFi built-in' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center text-left p-4 bg-white rounded-lg border shadow-sm">
                    <div className="text-2xl mr-4">{feature.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{feature.title}</div>
                      <div className="text-sm text-gray-500">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {isLoading ? (
                <div className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Setting up your workspace</h3>
                  <p className="text-gray-600">Initializing Plasmic editor...</p>
                </div>
              ) : (
                <button
                  onClick={handleStartProject}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Create Web3 Store
                </button>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Plasmic Studio</h1>
                  <p className="text-sm text-gray-500">Web3 Commerce Builder</p>
                </div>
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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${selectedDevice === key
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{device.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                {previewMode ? <CodeBracketIcon className="h-4 w-4 mr-2" /> : <PlayIcon className="h-4 w-4 mr-2" />}
                {previewMode ? 'Edit' : 'Preview'}
              </button>

              <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium">
                <ShareIcon className="h-4 w-4 mr-2" />
                Publish
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {!previewMode && (
              <>
                {/* Left Sidebar */}
                <div className="w-72 bg-white border-r flex flex-col">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900 mb-4">Components</h3>
                    <div className="space-y-4">
                      {Object.entries(groupedComponents).map(([category, components]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-purple-600 mb-2 uppercase tracking-wide">
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {components.map((component) => (
                              <DraggableComponent
                                key={component.type}
                                type={component.type}
                                name={component.name}
                                icon={component.icon}
                                description={component.description}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-72 bg-white border-l">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
                    {selectedComponentData ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={selectedComponentData.name}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>

                        {/* Component-specific properties */}
                        {selectedComponentData.type === COMPONENT_TYPES.HERO && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                                placeholder="Hero title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                              <textarea
                                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                                rows={3}
                                placeholder="Hero subtitle"
                              />
                            </div>
                          </>
                        )}

                        <div className="pt-4 border-t">
                          <h4 className="font-medium text-gray-900 mb-3">Styling</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                              <div className="flex space-x-2">
                                <input type="color" className="w-10 h-10 border rounded cursor-pointer" />
                                <input
                                  type="text"
                                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                                  placeholder="Linear gradient or color"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Cog6ToothIcon className="h-6 w-6 text-purple-500" />
                        </div>
                        <p className="text-sm text-gray-500">Select a component to edit properties</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col">
              {!previewMode && (
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-600">
                      Canvas: {DEVICES[selectedDevice as keyof typeof DEVICES]?.width}px
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 p-8 bg-gray-100 overflow-auto">
                <div
                  className="mx-auto bg-white shadow-xl rounded-lg overflow-hidden"
                  style={{
                    width: previewMode ? '100%' : `${DEVICES[selectedDevice as keyof typeof DEVICES]?.width}px`,
                    minHeight: '800px'
                  }}
                >
                  {!previewMode ? (
                    <DropCanvas onDrop={handleComponentDrop}>
                      {components.length > 0 ? (
                        <div>
                          {components.map((component) => (
                            <RenderedComponent
                              key={component.id}
                              component={component}
                              isSelected={selectedComponent === component.id}
                              onSelect={() => handleComponentSelect(component.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="h-96 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <PlusIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building</h3>
                            <p className="text-gray-500 mb-4">Drag components from the sidebar to get started</p>
                            <button
                              className="text-purple-600 hover:text-purple-800 font-medium"
                              onClick={() => handleComponentDrop({ type: COMPONENT_TYPES.HERO, name: 'Hero Section' })}
                            >
                              Add Hero Section
                            </button>
                          </div>
                        </div>
                      )}
                    </DropCanvas>
                  ) : (
                    <div>
                      {components.map((component) => (
                        <RenderedComponent
                          key={component.id}
                          component={component}
                          isSelected={false}
                          onSelect={() => { }}
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