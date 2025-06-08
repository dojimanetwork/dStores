import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TemplatePreviewModal from './TemplatePreviewModal';
import { TEMPLATES, SAMPLE_PRODUCTS, DESIGN_TRENDS, ANIMATION_LEVELS } from './templatesData';
import { EyeIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';

// Component for individual template image with loading state
function TemplateImage({ template, onLoad }: { template: any; onLoad?: () => void }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    setImageLoaded(true);
    // Fallback to placeholder
    e.currentTarget.src = `/api/placeholder/800/600?text=${encodeURIComponent(template.name + ' Template')}`;
  };

  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      {/* Loading Placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-gray-500 text-sm font-medium">Loading {template.name}...</div>
          </div>
        </div>
      )}
      
      {/* Template Image */}
      <img
        src={template.previewImages.hero}
        alt={`${template.name} template preview showing ${template.description}`}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* Error State */}
      {imageError && imageLoaded && (
        <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
          Preview generated
        </div>
      )}
    </div>
  );
}

export default function TemplateSelection() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleTemplateConfirm = (templateId: string) => {
    // Find the template data
    const template = TEMPLATES.find(t => t.id === templateId);
    
    // Mark build website as complete in setup completion context
    markBuildWebsiteComplete(templateId, 'template');
    
    // Also save template data to localStorage for additional persistence
    if (template) {
      localStorage.setItem('selectedTemplate', JSON.stringify({
        id: templateId,
        name: template.name,
        category: template.category,
        theme: template.theme || 'Default Theme',
        selectedAt: new Date().toISOString()
      }));
      
      // Save finalized website data for immediate availability
      const finalizedData = {
        type: 'Template',
        description: `Professional template: ${template.name}`,
        templateId: templateId,
        theme: template.theme || 'Default Theme',
        lastModified: new Date().toLocaleDateString(),
        finalizedAt: new Date().toISOString()
      };
      localStorage.setItem('finalizedWebsite', JSON.stringify(finalizedData));
    }
    
    // Navigate to template page
    router.push(`/dashboard/templates/${templateId}`);
    setSelectedTemplate(null);
  };

  const isSelectedTemplate = (templateId: string) => {
    return completionState.buildWebsite.completed && 
           completionState.buildWebsite.templateSelected === templateId;
  };

  const categories = ['all', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];
  
  let filteredTemplates = TEMPLATES;
  
  if (selectedCategory !== 'all') {
    filteredTemplates = filteredTemplates.filter(t => t.category === selectedCategory);
  }

  return (
    <>
      {/* Simple Category Filter */}
      <div className="flex justify-center mb-12">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1 ${
              isSelectedTemplate(template.id) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {/* Template Image with Overlays */}
            <div className="relative">
              <TemplateImage template={template} />
              
              {/* Selected Badge */}
              {isSelectedTemplate(template.id) && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
                    <CheckCircleIcon className="w-3 h-3" />
                    Active
                  </div>
                </div>
              )}

              {/* Preview Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center z-10">
                <button
                  onClick={() => handleTemplateSelect(template.id)}
                  className="opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium shadow-lg flex items-center gap-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{template.rating}</span>
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {template.category}
                </span>
              </div>

              {/* Use Button */}
              {!isSelectedTemplate(template.id) && (
                <button
                  onClick={() => handleTemplateConfirm(template.id)}
                  className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Use Template
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <TemplatePreviewModal
          template={TEMPLATES.find(t => t.id === selectedTemplate)!}
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onConfirm={handleTemplateConfirm}
          productCount={productCount}
          isSelected={isSelectedTemplate(selectedTemplate)}
        />
      )}
    </>
  );
} 