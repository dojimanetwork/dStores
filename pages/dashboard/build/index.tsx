import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';
import { useBuilderStore } from '@/stores/builderStore';

export default function BuildHomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { markBuildWebsiteComplete, isStepCompleted, completionState, getBuildMethod } = useSetupCompletion();
  const { currentPage, storeInfo } = useBuilderStore();
  const [finalizedWebsite, setFinalizedWebsite] = useState(null);

  // Check for completion state changes and update finalized website accordingly
  useEffect(() => {
    const updateFinalizedWebsite = () => {
      try {
        // First check if build website is completed via setup completion context
        if (isStepCompleted('buildWebsite')) {
          const buildMethod = getBuildMethod();
          const templateSelected = completionState.buildWebsite.templateSelected;
          const method = completionState.buildWebsite.method;
          
          let websiteData = {
            type: buildMethod || 'Custom Build',
            method: method,
            theme: 'Default Theme',
            lastModified: new Date().toLocaleDateString(),
            completedAt: completionState.buildWebsite.completedAt
          };

          if (method === 'template' && templateSelected) {
            // Try to get template name from localStorage first
            const savedTemplate = localStorage.getItem('selectedTemplate');
            let templateName = templateSelected;
            if (savedTemplate) {
              try {
                const templateData = JSON.parse(savedTemplate);
                templateName = templateData.name || templateSelected;
              } catch (error) {
                console.log('Could not parse saved template data');
              }
            }
            websiteData.description = `Professional template: ${templateName}`;
            websiteData.templateId = templateSelected;
            websiteData.templateName = templateName;
          } else if (method === 'visual-builder') {
            websiteData.description = 'Custom website built with drag-and-drop editor';
            // Check for component count from localStorage
            const savedPage = localStorage.getItem('currentPage');
            if (savedPage) {
              const pageData = JSON.parse(savedPage);
              if (pageData.components) {
                websiteData.componentCount = pageData.components.length;
              }
            }
          } else if (method === 'ai-generated') {
            websiteData.description = 'AI-powered custom website design';
          }

          setFinalizedWebsite(websiteData);
          return;
        }

        // Fallback: Check localStorage for finalized website data
        const finalizedData = localStorage.getItem('finalizedWebsite');
        if (finalizedData) {
          setFinalizedWebsite(JSON.parse(finalizedData));
          return;
        }

        // Check localStorage for saved pages/templates as secondary fallback
        const savedPage = localStorage.getItem('currentPage');
        const templateData = localStorage.getItem('selectedTemplate');
        const aiGeneratedData = localStorage.getItem('aiGeneratedWebsite');

        let websiteSource = null;
        let websiteData = null;

        if (savedPage) {
          const pageData = JSON.parse(savedPage);
          if (pageData.components && pageData.components.length > 0) {
            websiteSource = 'visual-builder';
            websiteData = {
              type: 'Visual Builder',
              description: 'Custom website built with drag-and-drop editor',
              componentCount: pageData.components.length,
              theme: pageData.theme?.name || 'Default Theme',
              lastModified: new Date().toLocaleDateString()
            };
          }
        }

        if (templateData && !websiteSource) {
          const template = JSON.parse(templateData);
          websiteSource = 'template';
          websiteData = {
            type: 'Template',
            description: `Professional template: ${template.name}`,
            templateId: template.id,
            theme: template.theme || 'Default Theme',
            lastModified: new Date().toLocaleDateString()
          };
        }

        if (aiGeneratedData && !websiteSource) {
          const aiData = JSON.parse(aiGeneratedData);
          websiteSource = 'ai-generated';
          websiteData = {
            type: 'AI Generated',
            description: 'AI-powered custom website design',
            aiModel: aiData.model || 'GPT-4',
            theme: aiData.theme || 'AI Selected Theme',
            lastModified: new Date().toLocaleDateString()
          };
        }

        if (websiteData) {
          setFinalizedWebsite(websiteData);
          // Mark build website as complete if not already
          if (!isStepCompleted('buildWebsite')) {
            const method = websiteSource === 'template' ? 'template' : 
                          websiteSource === 'visual-builder' ? 'visual-builder' : 
                          websiteSource === 'ai-generated' ? 'ai-generated' : 'visual-builder';
            markBuildWebsiteComplete(websiteSource, method);
          }
        } else {
          // No website found
          setFinalizedWebsite(null);
        }
      } catch (error) {
        console.error('Error checking finalized website:', error);
        setFinalizedWebsite(null);
      }
    };

    updateFinalizedWebsite();
    
    // Add a small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isStepCompleted, markBuildWebsiteComplete, completionState, getBuildMethod]); // Added dependencies to trigger updates

  const handleOptionClick = (option) => {
    if (!option.enabled) {
      return; // Do nothing for disabled options
    }
    
    console.log(`🎯 Build option clicked: ${option.title}`);
    console.log(`🔗 Navigating to: ${option.href}`);
    
    try {
      router.push(option.href).catch((error) => {
        console.error(`❌ Navigation failed:`, error);
        window.location.href = option.href;
      });
    } catch (error) {
      console.error(`❌ Click handler error:`, error);
      window.location.href = option.href;
    }
  };

  const buildOptions = [
    {
      id: 'templates',
      title: 'Templates',
      description: 'Choose from professionally designed templates and customize them to your brand',
      href: '/dashboard/build/templates',
      icon: '🎨',
      category: 'Quick Start',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      enabled: true
    },
    {
      id: 'grapesjs',
      title: 'Visual Editor',
      description: 'Design your store with powerful drag-and-drop visual editor',
      href: '/dashboard/build/grapesjs',
      icon: '🎯',
      category: 'Custom Build',
      color: 'from-purple-500 to-purple-600',
      enabled: true
    },
    {
      id: 'ai-generate',
      title: 'AI Builder',
      description: 'Let AI create a custom design based on your brand and preferences (Coming Soon)',
      href: null,
      icon: '🤖',
      category: 'AI Powered',
      color: 'from-gray-400 to-gray-500',
      comingSoon: true,
      enabled: false
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading build options...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Build Your Store
          </h1>
          <p className="text-lg text-gray-600">
            Choose your preferred way to build and customize your e-commerce store
          </p>
        </div>

        {/* Current Website Status - Always Show */}
        <div className="mb-8">
          {finalizedWebsite || isStepCompleted('buildWebsite') ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-1">
                      Current Website: {getBuildMethod() || finalizedWebsite?.type || 'Ready'} ✨
                    </h3>
                    <p className="text-green-700 mb-2">
                      {finalizedWebsite?.description || `Your website has been built using ${getBuildMethod()}`}
                    </p>
                    <div className="text-sm text-green-600 space-y-1">
                      <p><strong>Build Method:</strong> {getBuildMethod() || finalizedWebsite?.type || 'Custom'}</p>
                      <p><strong>Theme:</strong> {finalizedWebsite?.theme || 'Default Theme'}</p>
                      <p><strong>Status:</strong> Ready for customization</p>
                      {finalizedWebsite?.lastModified && (
                        <p><strong>Last Modified:</strong> {finalizedWebsite.lastModified}</p>
                      )}
                      {finalizedWebsite?.componentCount && (
                        <p><strong>Components:</strong> {finalizedWebsite.componentCount}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push('/store-preview')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      const method = getBuildMethod();
                      if (method === 'Visual Builder' || finalizedWebsite?.type === 'Visual Builder') {
                        router.push('/dashboard/build/grapesjs');
                      } else if (method === 'Template' || finalizedWebsite?.type === 'Template') {
                        router.push('/dashboard/build/templates');
                      } else {
                        // Default to visual builder if unsure
                        router.push('/dashboard/build/grapesjs');
                      }
                    }}
                    className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H5m14 0v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5m6 0v-4a1 1 0 00-1-1h-2a1 1 0 00-1 1v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-1">
                    No Website Selected Yet
                  </h3>
                  <p className="text-blue-700 mb-2">
                    Choose one of the build options below to get started with your store
                  </p>
                  <div className="text-sm text-blue-600">
                    <p>Select <strong>Templates</strong> for quick setup or <strong>Visual Editor</strong> for custom design</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Build Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {buildOptions.map((option) => {
            return (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={`relative bg-white rounded-xl border border-gray-200 p-8 transition-all ${
                  option.enabled 
                    ? 'hover:shadow-xl hover:border-gray-300 cursor-pointer group' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Badges */}
                <div className="absolute top-6 right-6 flex gap-2">
                  {option.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  {option.comingSoon && (
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Icon and Category */}
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mb-4 ${
                    option.enabled ? 'group-hover:scale-110' : ''
                  } transition-transform shadow-lg`}>
                    <span className="text-2xl">{option.icon}</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {option.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-bold text-gray-900 mb-3 transition-colors ${
                  option.enabled ? 'group-hover:text-blue-600' : ''
                }`}>
                  {option.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {option.description}
                </p>

                {/* Call to Action */}
                <div className={`flex items-center font-semibold transition-transform ${
                  option.enabled 
                    ? 'text-blue-600 group-hover:translate-x-2' 
                    : 'text-gray-400'
                }`}>
                  {option.enabled 
                    ? (finalizedWebsite || isStepCompleted('buildWebsite') ? 'Modify' : 'Get Started')
                    : 'Available Soon'
                  }
                  {option.enabled && (
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
} 