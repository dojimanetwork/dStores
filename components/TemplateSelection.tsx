import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TemplatePreviewModal from './TemplatePreviewModal';
import { TEMPLATES, SAMPLE_PRODUCTS, DESIGN_TRENDS, ANIMATION_LEVELS } from './templatesData';
import { EyeIcon, RocketLaunchIcon, CheckCircleIcon, StarIcon, TagIcon, PaintBrushIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, SparklesIcon, BoltIcon, CubeIcon, FireIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';

export default function TemplateSelection() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [selectedAnimationLevel, setSelectedAnimationLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('detailed');
  const { markBuildWebsiteComplete, completionState } = useSetupCompletion();

  useEffect(() => {
    fetchProductCount();
  }, []);

  const fetchProductCount = async () => {
    try {
      const response = await fetch('/api/products?storeId=1');
      if (response.ok) {
        const data = await response.json();
        setProductCount(data.products?.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch product count:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSampleProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProductCount(data.count);
        alert(`Added ${data.count} sample products successfully!`);
      } else {
        throw new Error('Failed to add sample products');
      }
    } catch (error) {
      console.error('Error adding sample products:', error);
      alert('Failed to add sample products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleTemplateConfirm = (templateId: string) => {
    markBuildWebsiteComplete(templateId);
    
    const template = TEMPLATES.find(t => t.id === templateId);
    alert(`🎉 Great choice! Your "${template?.name}" template has been selected and your website structure is now ready. You can now add products, configure shipping, and set up payments.`);
    
    // Redirect to the working template page so users can see their store in action
    router.push(`/dashboard/templates/${templateId}`);
    setSelectedTemplate(null);
  };

  const getTemplateFeatures = (template: any) => {
    const features = [
      {
        text: `${template.pages?.length || 0} Pages`,
        color: 'bg-blue-100 text-blue-800'
      },
      {
        text: template.layout.charAt(0).toUpperCase() + template.layout.slice(1),
        color: 'bg-purple-100 text-purple-800'
      }
    ];

    if (!loading) {
      features.push({
        text: `${productCount} Products`,
        color: productCount > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      });
    }

    return features;
  };

  const getAnimationLevelIcon = (level: string) => {
    switch (level) {
      case 'subtle': return <SparklesIcon className="w-4 h-4" />;
      case 'moderate': return <BoltIcon className="w-4 h-4" />;
      case 'dynamic': return <CubeIcon className="w-4 h-4" />;
      case 'cinematic': return <FireIcon className="w-4 h-4" />;
      default: return <SparklesIcon className="w-4 h-4" />;
    }
  };

  const getAnimationLevelColor = (level: string) => {
    switch (level) {
      case 'subtle': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'moderate': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'dynamic': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'cinematic': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isSelectedTemplate = (templateId: string) => {
    return completionState.buildWebsite.completed && 
           completionState.buildWebsite.templateSelected === templateId;
  };

  const categories = ['all', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  const trends = ['all', ...Object.keys(DESIGN_TRENDS)];
  const animationLevels = ['all', ...Object.keys(ANIMATION_LEVELS)];
  
  let filteredTemplates = TEMPLATES;
  
  if (selectedCategory !== 'all') {
    filteredTemplates = filteredTemplates.filter(t => t.category === selectedCategory);
  }
  
  if (selectedTrend !== 'all') {
    filteredTemplates = filteredTemplates.filter(t => t.designTrends.includes(selectedTrend));
  }
  
  if (selectedAnimationLevel !== 'all') {
    filteredTemplates = filteredTemplates.filter(t => t.animationLevel === selectedAnimationLevel);
  }

  return (
    <>
      {/* Hero Section with Glow Effect */}
      <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <SparklesIcon className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              World-Class Templates
            </h1>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl leading-relaxed">
            Award-winning designs featuring the latest 2024-2025 trends: glow effects, sci-fi gaming UI, 
            holographic elements, advanced animations, and cutting-edge aesthetics that will impress everyone.
          </p>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-emerald-300">
              <StarIcon className="w-5 h-5" />
              <span className="font-medium">Award-Winning Designs</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <BeakerIcon className="w-5 h-5" />
              <span className="font-medium">Latest 2024-2025 Trends</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <BoltIcon className="w-5 h-5" />
              <span className="font-medium">Cutting-Edge Tech</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Status Banner */}
      {completionState.buildWebsite.completed && (
        <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-full mr-4">
              <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">
                Website Structure Complete! ✨
              </h3>
              <p className="text-emerald-700">
                You've selected the "{TEMPLATES.find(t => t.id === completionState.buildWebsite.templateSelected)?.name}" template. 
                Your website structure is ready to display products with shipping and payment integration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Status Banner */}
      {!loading && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <RocketLaunchIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  🚀 Ready to Launch!
                </h3>
                <p className="text-blue-700">
                  {productCount > 0 
                    ? `You have ${productCount} product${productCount !== 1 ? 's' : ''} ready to be displayed in your chosen template.`
                    : 'Add some products first to see them displayed in your template.'
                  }
                </p>
              </div>
            </div>
            {productCount === 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/dashboard/products')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Products
                </button>
                <button
                  onClick={addSampleProducts}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? 'Adding...' : 'Add Sample Products'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PaintBrushIcon className="w-5 h-5" />
          Filter by Design Elements
        </h3>
        
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
                {category !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                    {TEMPLATES.filter(t => t.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Design Trends Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Design Trends</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTrend('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTrend === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              All Trends
            </button>
            {trends.slice(1).map((trend) => (
              <button
                key={trend}
                onClick={() => setSelectedTrend(trend)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTrend === trend
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {DESIGN_TRENDS[trend as keyof typeof DESIGN_TRENDS]}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Animation Level</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAnimationLevel('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedAnimationLevel === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              All Levels
            </button>
            {animationLevels.slice(1).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedAnimationLevel(level)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedAnimationLevel === level
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {getAnimationLevelIcon(level)}
                {ANIMATION_LEVELS[level as keyof typeof ANIMATION_LEVELS]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:scale-[1.02] ${
              isSelectedTemplate(template.id) ? 'ring-4 ring-emerald-500 ring-opacity-50' : ''
            }`}
            style={{
              background: template.colorScheme.glow 
                ? `linear-gradient(135deg, ${template.colorScheme.background} 0%, ${template.colorScheme.glow}08 100%)`
                : template.colorScheme.background
            }}
          >
            {/* Glow Effect */}
            {template.colorScheme.glow && (
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${template.colorScheme.glow}20 0%, transparent 70%)`
                }}
              />
            )}

            {/* Template Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={template.previewImages.hero}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay with Animation Level */}
              <div className="absolute top-4 left-4">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm ${getAnimationLevelColor(template.animationLevel)}`}>
                  {getAnimationLevelIcon(template.animationLevel)}
                  {ANIMATION_LEVELS[template.animationLevel as keyof typeof ANIMATION_LEVELS]}
                </div>
              </div>

              {/* Selected Badge */}
              {isSelectedTemplate(template.id) && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-medium shadow-lg">
                    <CheckCircleIcon className="w-4 h-4" />
                    Selected
                  </div>
                </div>
              )}

              {/* Preview Button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleTemplateSelect(template.id)}
                  className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-6 py-3 bg-white text-gray-900 rounded-full font-medium shadow-xl hover:shadow-2xl flex items-center gap-2"
                >
                  <EyeIcon className="w-5 h-5" />
                  Preview Template
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-600">Award Winner</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Design Trends */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {template.designTrends.slice(0, 3).map((trend) => (
                    <span
                      key={trend}
                      className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs rounded-lg font-medium border border-blue-100"
                    >
                      {DESIGN_TRENDS[trend as keyof typeof DESIGN_TRENDS]}
                    </span>
                  ))}
                  {template.designTrends.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                      +{template.designTrends.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2">
                  {template.features.slice(0, 4).map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-xs text-gray-600">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: template.colorScheme.accent }}
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleTemplateConfirm(template.id)}
                disabled={isSelectedTemplate(template.id)}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSelectedTemplate(template.id)
                    ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isSelectedTemplate(template.id) ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Template Selected
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="w-5 h-5" />
                    Choose This Template
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <div className="mb-4">
            <TagIcon className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Templates Found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters to see more templates.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTrend('all');
              setSelectedAnimationLevel('all');
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          template={TEMPLATES.find(t => t.id === selectedTemplate)!}
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onConfirm={handleTemplateConfirm}
          productCount={productCount}
        />
      )}
    </>
  );
} 