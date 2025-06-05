import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  ArrowLeftIcon, 
  EyeIcon, 
  CloudIcon, 
  ChartBarIcon,
  BeakerIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function BuilderIOIntegration() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 2000);
  };

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
              <h1 className="text-xl font-semibold">Builder.io Integration</h1>
              <p className="text-sm text-gray-500">Headless CMS with visual editing</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected && (
              <>
                <button className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <CogIcon className="h-4 w-4 mr-2" />
                  Settings
                </button>

                <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview
                </button>

                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                  Publish
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {!isConnected ? (
            /* Connection Setup */
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="max-w-2xl w-full mx-auto text-center p-8">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                    <CloudIcon className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect to Builder.io</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Integrate with Builder.io's headless CMS to create dynamic, 
                    personalized experiences for your Web3 store.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <EyeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Visual Editor</h3>
                    <p className="text-sm text-gray-600">
                      Drag-and-drop visual editor with real-time preview
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <ChartBarIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">A/B Testing</h3>
                    <p className="text-sm text-gray-600">
                      Built-in A/B testing and analytics for optimization
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BeakerIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personalization</h3>
                    <p className="text-sm text-gray-600">
                      Dynamic content based on user behavior and preferences
                    </p>
                  </div>
                </div>

                {/* Connection Form */}
                <div className="bg-white rounded-xl border p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Builder.io API Key
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your Builder.io API key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Space ID
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your Builder.io space ID"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </div>
                  ) : (
                    'Connect to Builder.io'
                  )}
                </button>

                <p className="text-xs text-gray-500 mt-4">
                  Don't have a Builder.io account? 
                  <a href="#" className="text-blue-600 hover:underline ml-1">Sign up for free</a>
                </p>
              </div>
            </div>
          ) : (
            /* Builder.io Dashboard */
            <div className="h-full bg-white">
              <div className="h-full flex">
                {/* Left Sidebar */}
                <div className="w-64 bg-gray-50 border-r flex flex-col">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-gray-900 mb-3">Content Models</h3>
                    <div className="space-y-2">
                      {['Page', 'Product', 'Blog Post', 'Landing Page', 'Component'].map((model) => (
                        <div
                          key={model}
                          className="p-2 bg-white border rounded cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <div className="text-sm font-medium">{model}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-b">
                    <h3 className="font-medium text-gray-900 mb-3">Pages</h3>
                    <div className="space-y-1">
                      <div className="p-2 bg-blue-50 border border-blue-300 rounded text-sm">
                        Home Page
                      </div>
                      <div className="p-2 bg-white border rounded text-sm cursor-pointer hover:bg-gray-50">
                        Product Catalog
                      </div>
                      <div className="p-2 bg-white border rounded text-sm cursor-pointer hover:bg-gray-50">
                        About Us
                      </div>
                      <div className="p-2 bg-white border rounded text-sm cursor-pointer hover:bg-gray-50">
                        Contact
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <h3 className="font-medium text-gray-900 mb-3">Analytics</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm font-medium text-gray-900">Page Views</div>
                        <div className="text-lg font-bold text-blue-600">12,543</div>
                        <div className="text-xs text-green-600">+15% this week</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm font-medium text-gray-900">Conversions</div>
                        <div className="text-lg font-bold text-green-600">234</div>
                        <div className="text-xs text-green-600">+8% this week</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 flex flex-col">
                  {/* Toolbar */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h2 className="font-semibold text-gray-900">Home Page</h2>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Published</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-white border rounded text-sm">Desktop</button>
                        <button className="px-3 py-1 text-gray-600 text-sm">Tablet</button>
                        <button className="px-3 py-1 text-gray-600 text-sm">Mobile</button>
                      </div>
                    </div>
                  </div>

                  {/* Canvas */}
                  <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                      {/* Simulated Builder.io Visual Editor */}
                      <div className="relative">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                          <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl font-bold mb-4">
                              Welcome to Your Web3 Marketplace
                            </h1>
                            <p className="text-xl mb-6">
                              Discover, buy, and sell digital assets in the decentralized economy
                            </p>
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                              Explore Now
                            </button>
                          </div>
                        </div>

                        {/* Features Section */}
                        <div className="p-8">
                          <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                              Why Choose Our Platform?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <CloudIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Decentralized</h3>
                                <p className="text-gray-600">Built on blockchain technology for true ownership</p>
                              </div>
                              <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <ChartBarIcon className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                                <p className="text-gray-600">Real-time insights and performance tracking</p>
                              </div>
                              <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <BeakerIcon className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                                <p className="text-gray-600">Cutting-edge features and continuous updates</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* CTA Section */}
                        <div className="bg-gray-50 p-8">
                          <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                              Ready to Get Started?
                            </h2>
                            <p className="text-gray-600 mb-6">
                              Join thousands of creators building their digital stores
                            </p>
                            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                              Create Your Store
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Properties Panel */}
                <div className="w-80 bg-gray-50 border-l">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-gray-900 mb-3">Element Properties</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded text-sm" 
                          rows={3}
                          defaultValue="Welcome to Your Web3 Marketplace"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                        <select className="w-full px-3 py-2 border rounded text-sm">
                          <option>Gradient</option>
                          <option>Solid Color</option>
                          <option>Image</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b">
                    <h3 className="font-medium text-gray-900 mb-3">A/B Testing</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Variant A</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Active</span>
                        </div>
                        <div className="text-xs text-gray-600">Conversion: 3.2%</div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Variant B</span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Draft</span>
                        </div>
                        <div className="text-xs text-gray-600">Conversion: --</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Targeting</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                        <select className="w-full px-3 py-2 border rounded text-sm">
                          <option>All Visitors</option>
                          <option>New Users</option>
                          <option>Returning Users</option>
                          <option>Mobile Users</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select className="w-full px-3 py-2 border rounded text-sm">
                          <option>Global</option>
                          <option>United States</option>
                          <option>Europe</option>
                          <option>Asia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 